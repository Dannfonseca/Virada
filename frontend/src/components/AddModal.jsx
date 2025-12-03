import { useState } from 'react';
import { Sparkles, MapPin } from 'lucide-react';
import { CATEGORIES } from '../config/categories';

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
            <div
                className="absolute inset-0 bg-blue-900/20 backdrop-blur-md transition-opacity duration-500"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md glass-panel rounded-[2.5rem] p-8 animate-in slide-in-from-bottom-20 duration-500">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-600 p-4 rounded-full shadow-glow animate-float">
                    <Sparkles className="text-white w-6 h-6" />
                </div>

                <h2 className="text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-700 mb-8 mt-4 drop-shadow-sm font-display tracking-tight">
                    NOVO ROLÉ
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] ml-4 transition-colors group-focus-within:text-orange-500">
                            O que vamos fazer?
                        </label>
                        <input
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Pôr do sol no Arpoador"
                            className="w-full bg-white/40 hover:bg-white/60 focus:bg-white/80 border-0 rounded-2xl px-6 py-4 text-lg font-bold text-blue-900 placeholder-blue-900/30 focus:ring-2 focus:ring-orange-400/50 transition-all shadow-inner"
                        />
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] ml-4 transition-colors group-focus-within:text-orange-500">
                            Onde fica?
                        </label>
                        <div className="relative">
                            <input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Ex: Posto 9"
                                className="w-full bg-white/40 hover:bg-white/60 focus:bg-white/80 border-0 rounded-2xl pl-12 pr-6 py-4 font-medium text-blue-900 placeholder-blue-900/30 focus:ring-2 focus:ring-orange-400/50 transition-all shadow-inner"
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900/30" size={20} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] ml-4">
                            Vibe do Momento
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.values(CATEGORIES).map((cat) => {
                                const IconComponent = cat.icon;
                                const isSelected = category === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        className={`
                      relative overflow-hidden flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300
                      ${isSelected
                                                ? 'text-white shadow-lg scale-[1.02] ring-2 ring-white/50'
                                                : 'bg-white/30 text-blue-900/60 hover:bg-white/50 hover:scale-[1.02]'}
                    `}
                                    >
                                        {isSelected && <div className={`absolute inset-0 bg-gradient-to-r ${cat.gradient} -z-10`} />}
                                        <IconComponent size={18} strokeWidth={isSelected ? 3 : 2} />
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-8 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-black text-lg py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative tracking-widest">CONFIRMAR</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddModal;
