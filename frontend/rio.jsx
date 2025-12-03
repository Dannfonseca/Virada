import React, { useState, useEffect, useRef, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import {
  Sun,
  Moon,
  Utensils,
  Camera,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  MapPin,
  Music,
  Waves,
  Sparkles,
  Menu,
  X,
  LayoutGrid
} from 'lucide-react';
import * as THREE from 'three';

const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const CATEGORIES = {
  BEACH: {
    id: 'beach',
    label: 'Praia & Sol',
    icon: <Waves size={20} />,
    gradient: 'from-cyan-400 to-blue-500',
    shadow: 'shadow-cyan-500/30'
  },
  NIGHT: {
    id: 'night',
    label: 'Night Life',
    icon: <Moon size={20} />,
    gradient: 'from-purple-500 to-pink-500',
    shadow: 'shadow-purple-500/30'
  },
  FOOD: {
    id: 'food',
    label: 'Gastronomia',
    icon: <Utensils size={20} />,
    gradient: 'from-orange-400 to-amber-500',
    shadow: 'shadow-orange-500/30'
  },
  TOUR: {
    id: 'tour',
    label: 'Turismo',
    icon: <Camera size={20} />,
    gradient: 'from-emerald-400 to-teal-500',
    shadow: 'shadow-emerald-500/30'
  },
};

const OceanWaves = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();

    // Nevoeiro mais intenso no horizonte para borrar os prédios
    scene.fog = new THREE.FogExp2(0x87ceeb, 0.0035);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 2000);
    // Câmera mais baixa e olhando mais para o horizonte
    camera.position.set(0, 8, 20);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Sol mais baixo no horizonte
    const sunPosition = new THREE.Vector3(-80, 40, -150);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.copy(sunPosition);
    scene.add(dirLight);

    const sunGeometry = new THREE.SphereGeometry(25, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffcc, fog: false });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.copy(sunPosition);
    scene.add(sun);

    // Prédios de Copacabana no horizonte
    const cityGeometry = new THREE.PlaneGeometry(1200, 100);
    const cityMaterial = new THREE.MeshBasicMaterial({
      color: 0xa0b0c0, // Cor distante, meio azulada/cinza
      transparent: true,
      opacity: 0.8, // Transparência para ajudar no efeito de borrado
      fog: true // Afetado pelo nevoeiro intenso
    });
    const city = new THREE.Mesh(cityGeometry, cityMaterial);
    // Posicionado longe no Z e na altura do horizonte
    city.position.set(0, 25, -400);
    scene.add(city);

    const geometry = new THREE.PlaneGeometry(500, 500, 128, 128);
    geometry.rotateX(-Math.PI * 0.5);

    const customUniforms = {
      time: { value: 0 }
    };

    const material = new THREE.MeshStandardMaterial({
      color: 0x0077be,
      roughness: 0.1,
      metalness: 0.5,
      side: THREE.DoubleSide,
      onBeforeCompile: (shader) => {
        shader.uniforms.time = customUniforms.time;

        shader.vertexShader = `
          uniform float time;
          varying float vHeight;

          vec3 getWaveHeight(vec3 p) {
            float wave1 = sin(p.x * 0.05 + time * 0.8 + p.z * 0.03) * 1.8;
            float wave2 = cos(p.z * 0.07 + time * 0.6) * 1.2;
            float wave3 = sin(p.x * 0.1 + p.z * 0.1 + time * 1.0) * 0.6;
            return vec3(p.x, p.y + wave1 + wave2 + wave3, p.z);
          }

          ${shader.vertexShader}
        `.replace(
          `#include <beginnormal_vertex>`,
          `#include <beginnormal_vertex>
            vec3 p = position;
            vec3 p1 = getWaveHeight(p);
            vec3 p2 = getWaveHeight(p + vec3(0.1, 0.0, 0.0));
            vec3 p3 = getWaveHeight(p + vec3(0.0, 0.0, 0.1));
            objectNormal = normalize(cross(p2 - p1, p3 - p1));
          `
        ).replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
            vec3 newPos = getWaveHeight(position);
            transformed = newPos;
            vHeight = newPos.y;
          `
        );

        shader.fragmentShader = `
          varying float vHeight;
          uniform float time;
          ${shader.fragmentShader}
        `.replace(
          `#include <color_fragment>`,
          `#include <color_fragment>
            vec3 deepColor = vec3(0.0, 0.3, 0.7);    
            vec3 midColor = vec3(0.0, 0.7, 0.9);     
            vec3 foamColor = vec3(0.95, 1.0, 1.0);   
            vec3 sunReflectionColor = vec3(1.0, 1.0, 0.9); 

            float mixLevel = smoothstep(-2.0, 1.5, vHeight);
            float foamLevel = smoothstep(1.8, 3.5, vHeight);
            
            vec3 waterColor = mix(deepColor, midColor, mixLevel);
            waterColor = mix(waterColor, foamColor, foamLevel);

            vec3 viewDir = normalize(cameraPosition - vViewPosition);
            // Direção do reflexo ajustada para a nova posição do sol
            vec3 sunDir = normalize(vec3(-80.0, 40.0, -150.0));
            vec3 reflectDir = reflect(-sunDir, vNormal);
            float spec = pow(max(dot(viewDir, reflectDir), 0.0), 128.0);
            waterColor += sunReflectionColor * spec * 1.5;

            diffuseColor.rgb = waterColor;
          `
        );
      }
    });

    const water = new THREE.Mesh(geometry, material);
    // Plano de água posicionado mais alto para ocupar menos a tela
    water.position.y = -2;
    scene.add(water);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      customUniforms.time.value += delta * 1.0;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      sunGeometry.dispose();
      sunMaterial.dispose();
      cityGeometry.dispose();
      cityMaterial.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
};

const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
    style={{
      zIndex: 1,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
    }}
  />
);

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, progress }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`
        fixed inset-y-0 left-0 w-[280px] bg-white/40 backdrop-blur-xl border-r border-white/40 z-50 
        flex flex-col transform transition-transform duration-300 ease-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <NoiseOverlay />

        <div className="p-8 pb-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600 tracking-tighter leading-none drop-shadow-sm">
              VIRADA<br />NO RIO
            </h2>
            <button onClick={onClose} className="p-2 bg-white/20 rounded-full hover:bg-white/30 text-blue-900">
              <X size={20} />
            </button>
          </div>

          <div className="bg-white/30 border border-white/40 p-4 rounded-2xl mb-2 shadow-sm">
            <div className="flex justify-between text-xs font-bold text-blue-900/80 mb-2 uppercase tracking-wide">
              <span>Status da Viagem</span>
              <span className="text-blue-900 drop-shadow-sm">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-blue-900/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-pink-500 shadow-[0_0_10px_rgba(255,165,0,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          <div className="px-4 py-2 text-xs font-bold text-blue-900/70 uppercase tracking-widest">
            Categorias
          </div>

          <button
            onClick={() => { setActiveTab('ALL'); onClose(); }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
              ${activeTab === 'ALL'
                ? 'bg-white text-orange-600 shadow-md border border-orange-100'
                : 'text-blue-900 hover:bg-white/30'}
            `}
          >
            <LayoutGrid size={18} />
            Visão Geral
          </button>

          {Object.values(CATEGORIES).map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveTab(cat.id); onClose(); }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group
                ${activeTab === cat.id
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-md`
                  : 'text-blue-900 hover:bg-white/30'}
              `}
            >
              <span className={activeTab === cat.id ? 'text-white' : 'text-blue-900/80'}>
                {cat.icon}
              </span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-white/20">
          <p className="text-xs text-center text-blue-900/60 font-medium">
            Feito com 🧡 para o Verão 2025
          </p>
        </div>
      </div>
    </>
  );
};

const VibeCard = ({ item, onToggle, onDelete }) => {
  const categoryConfig = Object.values(CATEGORIES).find(c => c.id === item.category) || CATEGORIES.TOUR;

  return (
    <div className={`
      relative group mb-4 overflow-hidden rounded-2xl transition-all duration-300 shadow-sm
      ${item.done ? 'opacity-70 scale-[0.98]' : 'hover:scale-[1.02] hover:shadow-md'}
    `}>
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryConfig.gradient} opacity-10`} />
      <div className="absolute inset-0 backdrop-blur-md bg-white/40 border border-white/50 rounded-2xl" />
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${categoryConfig.gradient}`} />

      <div className="relative p-5 flex items-center gap-4">
        <button
          onClick={() => onToggle(item.id, !item.done)}
          className="shrink-0 transition-all hover:scale-110 focus:outline-none"
        >
          {item.done ? (
            <div className={`bg-gradient-to-br ${categoryConfig.gradient} p-1 rounded-full text-white shadow-md`}>
              <CheckCircle2 size={24} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-blue-900/30 hover:border-blue-900/60 transition-colors shadow-sm bg-white/20" />
          )}
        </button>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className={`text-lg font-bold text-blue-900 leading-tight drop-shadow-sm ${item.done ? 'line-through opacity-70' : ''}`}>
            {item.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-blue-900 bg-white/40 border border-white/30 px-2 py-1 rounded-md shadow-sm">
              {categoryConfig.icon}
              {categoryConfig.label}
            </span>
            {item.location && (
              <span className="flex items-center gap-1 text-[10px] text-blue-900/80 bg-white/30 px-2 py-1 rounded-md max-w-[150px] truncate border border-white/20">
                <MapPin size={10} /> {item.location}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onDelete(item.id)}
          className="shrink-0 p-2 text-blue-900/50 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

const AddModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('beach');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, location, category });
    setTitle('');
    setLocation('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 shadow-2xl animate-in slide-in-from-bottom-20 duration-300">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-600 p-3 rounded-full shadow-lg shadow-pink-500/40">
          <Sparkles className="text-white w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-center text-blue-900 mb-8 mt-2 drop-shadow-sm">NOVO ROLÉ</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-900/70 uppercase tracking-widest ml-1 drop-shadow-sm">O que vamos fazer?</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Pôr do sol no Arpoador"
              className="w-full bg-white/40 border border-white/40 rounded-xl px-4 py-4 text-lg text-blue-900 placeholder-blue-900/40 focus:outline-none focus:border-orange-400/50 focus:bg-white/60 transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-900/70 uppercase tracking-widest ml-1 drop-shadow-sm">Localização</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Posto 9"
              className="w-full bg-white/40 border border-white/40 rounded-xl px-4 py-3 text-blue-900 placeholder-blue-900/40 focus:outline-none focus:border-orange-400/50 focus:bg-white/60 transition-all shadow-inner"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-blue-900/70 uppercase tracking-widest ml-1 drop-shadow-sm">Vibe do Momento</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(CATEGORIES).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`
                    relative overflow-hidden flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-bold transition-all shadow-sm
                    ${category === cat.id
                      ? 'text-white scale-105 ring-2 ring-orange-400/50'
                      : 'bg-white/30 text-blue-900/70 hover:bg-white/50'}
                  `}
                >
                  {category === cat.id && <div className={`absolute inset-0 bg-gradient-to-r ${cat.gradient} -z-10`} />}
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full mt-6 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-black text-lg py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/30">
            CONFIRMAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'rio_trip_v3');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedData = data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setItems(sortedData);
      setLoading(false);
    }, console.error);
    return () => unsubscribe();
  }, [user]);

  const handleAddItem = async (newItem) => {
    if (!user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'rio_trip_v3'), {
      ...newItem,
      done: false,
      createdAt: serverTimestamp(),
      author: user.uid
    });
  };

  const handleToggleItem = async (id, currentStatus) => {
    if (!user) return;
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rio_trip_v3', id), { done: currentStatus });
  };

  const handleDeleteItem = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rio_trip_v3', id));
  };

  const filteredItems = useMemo(() => activeTab === 'ALL' ? items : items.filter(i => i.category === activeTab), [items, activeTab]);
  const progress = useMemo(() => items.length === 0 ? 0 : Math.round((items.filter(i => i.done).length / items.length) * 100), [items]);

  const currentCategoryLabel = activeTab === 'ALL' ? 'Visão Geral' : CATEGORIES[Object.keys(CATEGORIES).find(key => CATEGORIES[key].id === activeTab)]?.label;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-blue-300 text-blue-900 font-sans overflow-x-hidden selection:bg-orange-300 selection:text-blue-900">

      <OceanWaves />
      <NoiseOverlay />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        progress={progress}
      />

      <main className="relative z-10 max-w-lg mx-auto min-h-screen flex flex-col">
        <header className="px-6 py-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/30 border-b border-white/40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-blue-900 hover:bg-white/30 rounded-xl transition-colors"
            >
              <Menu size={28} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-blue-900 tracking-tight leading-none drop-shadow-sm">
                {currentCategoryLabel}
              </h1>
              <p className="text-[10px] text-blue-900/70 font-bold tracking-widest uppercase drop-shadow-sm">
                {activeTab === 'ALL' ? 'Todos os rolés' : 'Categoria'}
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600 tracking-tighter drop-shadow-sm">
              VIRADA NO RIO
            </span>
          </div>
        </header>

        <div className="flex-1 px-6 py-6 pb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 text-blue-900/50">
              <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-0 animate-in fade-in duration-700 fill-mode-forwards">
              <div className="w-32 h-32 bg-white/40 rounded-full flex items-center justify-center mb-6 blur-sm border border-white/50 shadow-sm">
                <Music className="w-12 h-12 text-blue-900/60" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2 drop-shadow-sm">Lista Vazia</h3>
              <p className="text-blue-900/70 max-w-[200px] drop-shadow-sm">Abra o menu ou adicione um novo destino para o Verão.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map(item => (
                <VibeCard
                  key={item.id}
                  item={item}
                  onToggle={handleToggleItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-blue-300/80 to-transparent z-30 flex justify-end pointer-events-none">
          <button
            onClick={() => setIsModalOpen(true)}
            className="pointer-events-auto group relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-pink-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity" />
            <Plus className="text-orange-600 group-hover:rotate-90 transition-transform duration-300" size={32} strokeWidth={3} />
          </button>
        </div>
      </main>

      <AddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}