import { AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, itemTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-20 duration-300">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-full shadow-lg shadow-red-500/40">
                    <AlertTriangle className="text-white w-6 h-6" strokeWidth={2.5} />
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-black text-center text-slate-800 mb-4 mt-2">
                    Confirmar Exclusão
                </h2>

                <p className="text-center text-slate-600 mb-6">
                    Tem certeza que deseja excluir <span className="font-bold text-slate-800">"{itemTitle}"</span>?
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30"
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
