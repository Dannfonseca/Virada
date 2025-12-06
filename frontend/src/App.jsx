import { useState, useEffect, useMemo } from 'react';
import { Menu, Plus, Music } from 'lucide-react';
import { CATEGORIES } from './config/categories';
import OceanWaves from './components/OceanWaves';
import NoiseOverlay from './components/NoiseOverlay';
import Sidebar from './components/Sidebar';
import VibeCard from './components/VibeCard';
import AddModal from './components/AddModal';
import DeleteModal from './components/DeleteModal';
import ItemDetailsModal from './components/ItemDetailsModal';
import { itemsAPI } from './services/api';
import socket from './services/socket';

export default function App() {
    const [items, setItems] = useState([]);
    const [activeTab, setActiveTab] = useState('ALL');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load items from API on mount
    useEffect(() => {
        const loadItems = async () => {
            try {
                const data = await itemsAPI.getAll();
                setItems(data);
            } catch (error) {
                console.error('Error loading items:', error);
            } finally {
                setLoading(false);
            }
        };

        loadItems();
    }, []);

    // Socket.IO real-time updates
    useEffect(() => {
        // Listen for new items
        socket.on('item:created', (newItem) => {
            setItems(prevItems => [newItem, ...prevItems]);
        });

        // Listen for updated items
        socket.on('item:updated', (updatedItem) => {
            setItems(prevItems =>
                prevItems.map(item =>
                    item._id === updatedItem._id ? updatedItem : item
                )
            );
        });

        // Listen for deleted items
        socket.on('item:deleted', (deletedId) => {
            setItems(prevItems => prevItems.filter(item => item._id !== deletedId));
        });

        // Listen for comment updates
        socket.on('item:comment-added', ({ itemId, comment }) => {
            setItems(prevItems =>
                prevItems.map(item =>
                    item._id === itemId
                        ? { ...item, comments: [...(item.comments || []), comment] }
                        : item
                )
            );
            // Update selected item if it's the one being viewed
            if (selectedItem?._id === itemId) {
                setSelectedItem(prev => ({
                    ...prev,
                    comments: [...(prev.comments || []), comment]
                }));
            }
        });

        // Listen for comment deletions
        socket.on('item:comment-deleted', ({ itemId, commentId }) => {
            setItems(prevItems =>
                prevItems.map(item =>
                    item._id === itemId
                        ? { ...item, comments: item.comments.filter(c => c._id !== commentId) }
                        : item
                )
            );
            // Update selected item if it's the one being viewed
            if (selectedItem?._id === itemId) {
                setSelectedItem(prev => ({
                    ...prev,
                    comments: prev.comments.filter(c => c._id !== commentId)
                }));
            }
        });

        // Cleanup listeners on unmount
        return () => {
            socket.off('item:created');
            socket.off('item:updated');
            socket.off('item:deleted');
            socket.off('item:comment-added');
            socket.off('item:comment-deleted');
        };
    }, [selectedItem]);

    const handleAddItem = async (newItem) => {
        try {
            await itemsAPI.create(newItem);
            // Item will be added via socket event
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    const handleToggleItem = async (id, currentStatus) => {
        try {
            await itemsAPI.update(id, currentStatus);
            // Item will be updated via socket event
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDeleteItem = (id) => {
        const item = items.find(i => i._id === id);
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await itemsAPI.delete(itemToDelete._id);
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            // Item will be deleted via socket event
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleCardClick = async (item) => {
        try {
            // Fetch fresh item data with comments
            const fullItem = await itemsAPI.getById(item._id);
            setSelectedItem(fullItem);
            setIsDetailsModalOpen(true);
        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    };

    const handleCommentAdded = (updatedItem) => {
        setSelectedItem(updatedItem);
        // Update in items list
        setItems(prevItems =>
            prevItems.map(item =>
                item._id === updatedItem._id ? updatedItem : item
            )
        );
    };

    const filteredItems = useMemo(() => {
        let result = activeTab === 'ALL' ? items : items.filter(i => i.category === activeTab);

        // Sort by Date (asc) then Category
        return result.sort((a, b) => {
            // If both have dates, sort by date
            if (a.date && b.date) {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA.getTime() !== dateB.getTime()) {
                    return dateA - dateB;
                }
            }
            // If only one has date, prioritize the one with date
            if (a.date && !b.date) return -1;
            if (!a.date && b.date) return 1;

            // Secondary sort by Category (or keep original order if same category)
            return a.category.localeCompare(b.category);
        });
    }, [items, activeTab]);
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
                <header className="px-6 py-6 flex items-center justify-between sticky top-0 z-20">
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-md border-b border-white/10" />

                    <div className="relative flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-3 -ml-2 text-white hover:bg-white/10 rounded-2xl transition-all hover:scale-105 active:scale-95"
                        >
                            <Menu size={28} strokeWidth={2.5} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight leading-none drop-shadow-sm font-display">
                                {currentCategoryLabel}
                            </h1>
                            <p className="text-[10px] text-white/60 font-black tracking-[0.2em] uppercase mt-1">
                                {activeTab === 'ALL' ? 'Todos os rolés' : 'Categoria'}
                            </p>
                        </div>
                    </div>

                    <div className="relative text-right hidden sm:block">
                        <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600 tracking-tighter drop-shadow-sm">
                            VIRADA NO RIO
                        </span>
                    </div>
                </header>

                <div className="flex-1 px-6 py-8 pb-32">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4 text-blue-900/50">
                            <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-0 animate-in fade-in duration-700 fill-mode-forwards">
                            <div className="relative w-40 h-40 mb-6 animate-float">
                                {/* Glowing border */}
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-full blur-xl opacity-60 animate-pulse" />
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-full animate-spin-slow" style={{ animationDuration: '3s' }} />

                                {/* Inner circle */}
                                <div className="absolute inset-2 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-white/50 shadow-2xl">
                                    <Music className="w-14 h-14 text-orange-500" strokeWidth={2.5} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2 drop-shadow-lg font-display">Lista Vazia</h3>
                            <p className="text-white/90 max-w-[200px] font-medium drop-shadow-md">Abra o menu ou adicione um novo destino para o Verão.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredItems.map(item => (
                                <VibeCard
                                    key={item._id}
                                    item={item}
                                    onToggle={handleToggleItem}
                                    onDelete={handleDeleteItem}
                                    onCardClick={handleCardClick}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-blue-400/50 to-transparent z-30 flex justify-end pointer-events-none">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="pointer-events-auto group relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-glow hover:scale-110 active:scale-95 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Plus className="text-orange-500 group-hover:text-white group-hover:rotate-90 transition-all duration-300 relative z-10" size={32} strokeWidth={3} />
                    </button>
                </div>
            </main>

            <AddModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddItem}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemTitle={itemToDelete?.title || ''}
            />

            <ItemDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedItem(null);
                }}
                item={selectedItem}
                onCommentAdded={handleCommentAdded}
            />
        </div>
    );
}
