import { useEffect, useRef } from 'react';
import * as THREE from 'three';

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

export default OceanWaves;
