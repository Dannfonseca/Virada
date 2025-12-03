import { X, LayoutGrid } from 'lucide-react';
import { CATEGORIES } from '../config/categories';
import NoiseOverlay from './NoiseOverlay';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, progress }) => {
    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`
        fixed inset-y-4 left-4 w-[300px] glass-panel rounded-3xl z-50 
        flex flex-col transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0'}
      `}>
                <NoiseOverlay />

                <div className="p-8 pb-4 relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 tracking-tighter leading-[0.9] drop-shadow-sm font-display">
                                VIRADA<br />NO RIO
                            </h2>
                            <p className="text-xs font-bold text-white/60 tracking-[0.2em] mt-2 uppercase">Planejador 2025</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="bg-white/10 border border-white/20 p-5 rounded-2xl mb-4 shadow-sm backdrop-blur-md">
                        <div className="flex justify-between text-xs font-bold text-white/80 mb-3 uppercase tracking-wide">
                            <span>Progresso</span>
                            <span className="text-white drop-shadow-sm">{progress}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden p-[2px]">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-500 shadow-glow transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-2 relative z-10 custom-scrollbar">
                    <div className="px-4 py-2 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                        Menu Principal
                    </div>

                    <button
                        onClick={() => { setActiveTab('ALL'); onClose(); }}
                        className={`
              w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300
              ${activeTab === 'ALL'
                                ? 'bg-white shadow-lg shadow-orange-500/10 text-orange-600 scale-[1.02]'
                                : 'text-white/70 hover:bg-white/10 hover:pl-6'}
            `}
                    >
                        <div className={`p-2 rounded-xl transition-colors ${activeTab === 'ALL' ? 'bg-orange-100 text-orange-600' : 'bg-white/10 text-white/60'}`}>
                            <LayoutGrid size={18} />
                        </div>
                        Visão Geral
                    </button>

                    {Object.values(CATEGORIES).map(cat => {
                        const IconComponent = cat.icon;
                        const isActive = activeTab === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => { setActiveTab(cat.id); onClose(); }}
                                className={`
                  w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group
                  ${isActive
                                        ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg scale-[1.02]`
                                        : 'text-white/70 hover:bg-white/10 hover:pl-6'}
                `}
                            >
                                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}>
                                    <IconComponent size={18} />
                                </div>
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                <div className="p-8 border-t border-white/10 relative z-10">
                    <p className="text-[10px] text-center text-white/40 font-bold tracking-widest uppercase">
                        Feito com 🧡 no Rio
                    </p>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
