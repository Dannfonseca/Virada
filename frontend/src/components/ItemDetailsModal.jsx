import { useState } from 'react';
import { X, Calendar, MapPin, MessageCircle, Send, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../config/categories';
import { itemsAPI } from '../services/api';

const ItemDetailsModal = ({ isOpen, onClose, item, onCommentAdded }) => {
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingCommentId, setDeletingCommentId] = useState(null);

    if (!isOpen || !item) return null;

    const categoryConfig = Object.values(CATEGORIES).find(c => c.id === item.category) || CATEGORIES.TOUR;
    const IconComponent = categoryConfig.icon;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const updatedItem = await itemsAPI.addComment(item._id, commentText.trim());
            setCommentText('');
            if (onCommentAdded) {
                onCommentAdded(updatedItem);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        setDeletingCommentId(commentId);
        try {
            const updatedItem = await itemsAPI.deleteComment(item._id, commentId);
            if (onCommentAdded) {
                onCommentAdded(updatedItem);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setDeletingCommentId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-2xl max-h-[90vh] bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col animate-slideUp">
                {/* Header */}
                <div className="relative p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-200/50">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-start gap-3 sm:gap-4 pr-10">
                        <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${categoryConfig.gradient} text-white shadow-lg shrink-0`}>
                            <IconComponent size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2 leading-tight break-words">
                                {item.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase font-black tracking-wider px-2.5 sm:px-3 py-1.5 rounded-full shadow-sm bg-gradient-to-r ${categoryConfig.gradient} text-white`}>
                                    <IconComponent size={11} strokeWidth={3} />
                                    {categoryConfig.label}
                                </span>
                                {item.location && (
                                    <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-200 max-w-[140px] sm:max-w-[150px] truncate">
                                        <MapPin size={10} strokeWidth={3} /> {item.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {(item.date || item.time) && (
                            <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 col-span-1 sm:col-span-2">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-1">
                                    <Calendar size={13} />
                                    Agendado para
                                </div>
                                <div className="text-slate-800 font-bold text-lg">
                                    {item.date && new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    {item.date && item.time && ' às '}
                                    {item.time}
                                </div>
                            </div>
                        )}
                        <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-1">
                                <Calendar size={13} />
                                Criado em
                            </div>
                            <div className="text-slate-800 font-bold text-sm">
                                {formatDate(item.createdAt)}
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200">
                            <div className="text-slate-500 text-xs font-bold mb-1">
                                Status
                            </div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black ${item.done ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {item.done ? '✓ Concluído' : '○ Pendente'}
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px] text-slate-600" strokeWidth={2.5} />
                            <h3 className="text-base sm:text-lg font-black text-slate-800">
                                Comentários
                            </h3>
                            <span className="text-xs font-bold text-slate-400">
                                ({item.comments?.length || 0})
                            </span>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                            {item.comments && item.comments.length > 0 ? (
                                item.comments.map((comment) => (
                                    <div key={comment._id} className="group relative bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                        <p className="text-slate-800 text-sm sm:text-base mb-2 pr-8 break-words leading-relaxed">{comment.text}</p>
                                        <span className="text-xs text-slate-400 font-medium">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            disabled={deletingCommentId === comment._id}
                                            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                        >
                                            <Trash2 size={14} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 sm:py-8 text-slate-400">
                                    <MessageCircle size={28} className="sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm font-medium">Nenhum comentário ainda</p>
                                    <p className="text-xs">Seja o primeiro a comentar!</p>
                                </div>
                            )}
                        </div>

                        {/* Add Comment Form */}
                        <form onSubmit={handleSubmitComment} className="flex gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Adicione um comentário..."
                                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-orange-400 focus:outline-none transition-all text-sm font-medium"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim() || isSubmitting}
                                className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-orange-400 to-pink-600 hover:from-orange-500 hover:to-pink-700 text-white rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                            >
                                <Send size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailsModal;
