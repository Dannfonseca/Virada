import { Waves, Moon, Utensils, Camera } from 'lucide-react';

export const CATEGORIES = {
    BEACH: {
        id: 'beach',
        label: 'Praia & Sol',
        icon: Waves,
        gradient: 'from-cyan-400 to-blue-500',
        shadow: 'shadow-cyan-500/30'
    },
    NIGHT: {
        id: 'night',
        label: 'Night Life',
        icon: Moon,
        gradient: 'from-purple-500 to-pink-500',
        shadow: 'shadow-purple-500/30'
    },
    FOOD: {
        id: 'food',
        label: 'Gastronomia',
        icon: Utensils,
        gradient: 'from-orange-400 to-amber-500',
        shadow: 'shadow-orange-500/30'
    },
    TOUR: {
        id: 'tour',
        label: 'Turismo',
        icon: Camera,
        gradient: 'from-emerald-400 to-teal-500',
        shadow: 'shadow-emerald-500/30'
    },
};
