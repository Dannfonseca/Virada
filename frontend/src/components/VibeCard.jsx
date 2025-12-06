import { CheckCircle2, Trash2, MapPin, MessageSquare } from 'lucide-react';
import { CATEGORIES } from '../config/categories';

const VibeCard = ({ item, onToggle, onDelete, onCardClick }) => {
    const categoryConfig = Object.values(CATEGORIES).find(c => c.id === item.category) || CATEGORIES.TOUR;

    return (
        <div
            onClick={() => onCardClick(item)}
            className={`
        relative group mb-4 overflow-hidden rounded-3xl transition-all duration-500 ease-out cursor-pointer
        ${item.done
                    ? 'opacity-60 scale-[0.98] grayscale-[0.5]'
                    : 'hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]'}
      `}
        >
            {/* Dynamic Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${categoryConfig.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            <div className="absolute inset-0 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-glass" />

            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${categoryConfig.gradient} opacity-80`} />

            <div className="relative p-6 flex items-center gap-5">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(item._id, !item.done);
                    }}
                    className="shrink-0 group/check relative"
                >
                    <div className={`
            w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
            ${item.done
                            ? `bg-gradient-to-br ${categoryConfig.gradient} shadow-glow scale-100`
                            : 'bg-white/10 border-2 border-white/30 hover:border-white/60 hover:bg-white/20'}
          `}>
                        {item.done && <CheckCircle2 size={24} className="text-white animate-in zoom-in duration-300" />}
                    </div>
                </button>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className={`
            text-xl font-bold text-white leading-tight drop-shadow-md font-display transition-all duration-300
            ${item.done ? 'line-through opacity-70 decoration-2 decoration-white/30' : 'group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80'}
          `}>
                        {item.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider text-white/90 bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-sm">
                            <categoryConfig.icon size={12} />
                            {categoryConfig.label}
                        </span>
                        {item.location && (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/70 bg-black/20 px-3 py-1.5 rounded-lg max-w-[150px] truncate border border-white/5">
                                <MapPin size={12} /> {item.location}
                            </span>
                        )}
                        {item.comments?.length > 0 && (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/70 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                                <MessageSquare size={12} /> {item.comments.length}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item._id);
                    }}
                    className="shrink-0 p-3 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default VibeCard;
