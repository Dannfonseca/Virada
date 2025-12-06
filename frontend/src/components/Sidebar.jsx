import { X, LayoutGrid } from 'lucide-react';
import { CATEGORIES } from '../config/categories';
import NoiseOverlay from './NoiseOverlay';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, progress }) => {
    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`
        fixed inset-y-0 left-0 w-[320px] bg-white/10 backdrop-blur-2xl border-r border-white/20 z-50 
        flex flex-col transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_0_40px_rgba(0,0,0,0.1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Decorative gradient orb */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative p-8 pb-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 tracking-tighter leading-none drop-shadow-sm font-display">
                                VIRADA<br />NO RIO
                            </h2>
                            <p className="text-xs font-bold text-white/50 tracking-[0.3em] uppercase mt-2">Summer 2025</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/5 hover:bg-white/20 rounded-full text-white/80 transition-all hover:rotate-90 duration-300"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl mb-2 shadow-inner backdrop-blur-md group hover:bg-white/10 transition-colors">
                        <div className="flex justify-between text-xs font-black text-white/70 mb-3 uppercase tracking-wider">
                            <span>Trip Progress</span>
                            <span className="text-white drop-shadow-glow">{progress}%</span>
                        </div>
                        <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden p-[2px]">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 shadow-[0_0_15px_rgba(255,105,180,0.5)] transition-all duration-1000 ease-out relative overflow-hidden"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 space-y-3 relative">
                    <div className="px-2 py-2 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                        Explore Vibe
                    </div>

                    <button
                        onClick={() => { setActiveTab('ALL'); onClose(); }}
                        className={`
              w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden
              ${activeTab === 'ALL'
                                ? 'bg-gradient-to-r from-white/20 to-white/5 text-white shadow-glass border border-white/20'
                                : 'text-white/60 hover:bg-white/5 hover:text-white'}
            `}
                    >
                        <div className={`
              p-2 rounded-xl transition-all duration-300
              ${activeTab === 'ALL' ? 'bg-orange-500 text-white shadow-glow' : 'bg-white/5 group-hover:bg-white/10'}
            `}>
                            <LayoutGrid size={18} />
                        </div>
                        <span className="font-display tracking-wide">Visão Geral</span>
                        {activeTab === 'ALL' && (
                            <div className="absolute right-4 w-2 h-2 bg-orange-500 rounded-full shadow-glow animate-pulse" />
                        )}
                    </button>

                    {Object.values(CATEGORIES).map(cat => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => { setActiveTab(cat.id); onClose(); }}
                                className={`
                  w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden
                  ${activeTab === cat.id
                                        ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg border border-white/20`
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'}
                `}
                            >
                                <div className={`
                  p-2 rounded-xl transition-all duration-300
                  ${activeTab === cat.id ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}
                `}>
                                    <Icon size={18} />
                                </div>
                                <span className="font-display tracking-wide">{cat.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="p-8 border-t border-white/10">
                    <p className="text-xs text-center text-white/30 font-medium tracking-widest uppercase">
                        Designed by Architect Zero
                    </p>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
