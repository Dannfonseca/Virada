import { CheckCircle2, Trash2, MapPin } from 'lucide-react';
import { CATEGORIES } from '../config/categories';

const VibeCard = ({ item, onToggle, onDelete }) => {
    const categoryConfig = Object.values(CATEGORIES).find(c => c.id === item.category) || CATEGORIES.TOUR;
    const IconComponent = categoryConfig.icon;

    return (
        <div className={`
      relative group mb-4 overflow-hidden rounded-3xl transition-all duration-500 shadow-lg
      ${item.done
                ? 'opacity-80 scale-[0.98] grayscale-[0.3]'
                : 'hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl'}
    `}>
            {/* High contrast background - almost solid white */}
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xl transition-all duration-500 group-hover:bg-white/95" />

            {/* Subtle gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${categoryConfig.gradient} opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500`} />

            <div className="relative p-6 flex items-center gap-5">
                <button
                    onClick={() => onToggle(item._id, !item.done)}
                    className="shrink-0 transition-all duration-300 hover:scale-110 focus:outline-none group/check"
                >
                    {item.done ? (
                        <div className={`bg-gradient-to-br ${categoryConfig.gradient} p-1.5 rounded-full text-white shadow-lg scale-110`}>
                            <CheckCircle2 size={24} strokeWidth={3} />
                        </div>
                    ) : (
                        <div className={`
              w-9 h-9 rounded-full border-[3px] border-slate-200 bg-white 
              group-hover/check:border-orange-400 group-hover/check:bg-orange-50
              transition-all duration-300 shadow-inner
            `} />
                    )}
                </button>

                <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                    <h3 className={`text-xl font-black text-slate-800 leading-tight tracking-tight transition-all ${item.done ? 'line-through opacity-60' : ''}`}>
                        {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`
              flex items-center gap-1.5 text-[11px] uppercase font-black tracking-wider 
              px-3 py-1.5 rounded-full shadow-sm transition-all
              bg-gradient-to-r ${categoryConfig.gradient} text-white
            `}>
                            <IconComponent size={12} strokeWidth={3} />
                            {categoryConfig.label}
                        </span>
                        {item.location && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full max-w-[150px] truncate border border-slate-200">
                                <MapPin size={10} strokeWidth={3} /> {item.location}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => onDelete(item._id)}
                    className="shrink-0 p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300"
                >
                    <Trash2 size={20} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default VibeCard;
