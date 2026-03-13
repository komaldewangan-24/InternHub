import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, messageAPI, userAPI } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';

export default function MessagePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchUser();
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser._id || selectedUser.id);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchUser = async () => {
        try {
            const { data } = await authAPI.getMe();
            if (data.success) {
                setUser(data.data);
            }
        } catch (error) {
            const localUser = localStorage.getItem('user');
            if (localUser) setUser(JSON.parse(localUser));
        }
    };

    const fetchConversations = async () => {
        try {
            const { data } = await messageAPI.getAll();
            if (data.success) {
                // Group by other user
                const grouped = {};
                data.data.forEach(msg => {
                    const otherUser = msg.sender._id === user?._id ? msg.recipient : msg.sender;
                    if (!grouped[otherUser._id] || new Date(msg.createdAt) > new Date(grouped[otherUser._id].lastMessage.createdAt)) {
                        grouped[otherUser._id] = {
                            user: otherUser,
                            lastMessage: msg
                        };
                    }
                });
                setConversations(Object.values(grouped));
            }
        } catch (error) {
            console.error('Failed to fetch conversations', error);
        }
    };

    const fetchMessages = async (userId) => {
        setLoading(true);
        try {
            const { data } = await messageAPI.getConversation(userId);
            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const { data } = await messageAPI.sendMessage({
                recipient: selectedUser._id || selectedUser.id,
                content: newMessage
            });
            if (data.success) {
                setMessages([...messages, data.data]);
                setNewMessage('');
                fetchConversations();
            }
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const handleSearch = async (val) => {
        setSearchTerm(val);
        if (val.length > 2) {
            try {
                const { data } = await userAPI.getAll();
                if (data.success) {
                    const filtered = data.data.filter(u => 
                        u._id !== user?._id && 
                        (u.name.toLowerCase().includes(val.toLowerCase()) || 
                         u.email.toLowerCase().includes(val.toLowerCase()))
                    );
                    setSearchResults(filtered);
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            setSearchResults([]);
        }
    };

    const selectConversation = (otherUser) => {
        setSelectedUser(otherUser);
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
            <ToastContainer position="top-right" />
            
            {/* Sidebar Navigation */}
            <aside className="w-20 lg:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center lg:items-stretch h-full">
                <div className="p-6 flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 cursor-pointer" onClick={() => navigate('/student_dashboard')}>
                        <span className="material-symbols-outlined">rocket_launch</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight hidden lg:block">InternHub</h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link to="/student_dashboard" className="flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="font-semibold hidden lg:block">Dashboard</span>
                    </Link>
                    <Link to="/student_profile_page" className="flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                        <span className="material-symbols-outlined">person</span>
                        <span className="font-semibold hidden lg:block">Profile</span>
                    </Link>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 text-primary transition-all">
                        <span className="material-symbols-outlined">chat_bubble</span>
                        <span className="font-bold hidden lg:block">Messages</span>
                    </div>
                </nav>

                <div className="p-4 mt-auto">
                    <div className="size-12 lg:w-full lg:h-auto rounded-xl bg-slate-50 dark:bg-slate-800 p-2 flex items-center gap-3">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Aarav'}`} className="size-8 rounded-full" alt="User" />
                       <div className="hidden lg:block overflow-hidden">
                           <p className="text-xs font-bold truncate">{user?.name || 'User'}</p>
                           <p className="text-[10px] text-slate-400 capitalize">{user?.role || 'Member'}</p>
                       </div>
                    </div>
                </div>
            </aside>

            {/* Conversation List */}
            <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                        <input 
                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-9 pr-4 py-2 px text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
                            placeholder="Search people..." 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 space-y-1">
                    {searchTerm.length > 2 ? (
                        <div className="mb-4">
                            <p className="px-3 text-[10px] uppercase font-bold text-slate-400 mb-2">Search Results</p>
                            {searchResults.map(u => (
                                <button 
                                    key={u._id} 
                                    onClick={() => selectConversation(u)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedUser?._id === u._id ? 'bg-slate-50 dark:bg-slate-800' : ''}`}
                                >
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} className="size-10 rounded-full" alt={u.name} />
                                    <div className="text-left overflow-hidden">
                                        <p className="text-sm font-bold truncate">{u.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{u.role}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <>
                            <p className="px-3 text-[10px] uppercase font-bold text-slate-400 mb-2">Recent Chats</p>
                            {conversations.length > 0 ? conversations.map(conv => (
                                <button 
                                    key={conv.user._id} 
                                    onClick={() => selectConversation(conv.user)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedUser?._id === conv.user._id ? 'bg-slate-50 dark:bg-slate-800' : ''}`}
                                >
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.user.name}`} className="size-12 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" alt={conv.user.name} />
                                    <div className="text-left flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-bold truncate">{conv.user.name}</p>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(conv.lastMessage.createdAt).getHours()}:{new Date(conv.lastMessage.createdAt).getMinutes().toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{conv.lastMessage.content}</p>
                                    </div>
                                </button>
                            )) : (
                                <div className="p-6 text-center">
                                    <p className="text-sm text-slate-400">No recent conversations</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </aside>

            {/* Chat Window */}
            <main className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 h-full">
                {selectedUser ? (
                    <>
                        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                            <div className="flex items-center gap-3">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`} className="size-10 rounded-full" alt={selectedUser.name} />
                                <div>
                                    <h3 className="text-sm font-bold leading-none">{selectedUser.name}</h3>
                                    <p className="text-[10px] text-green-500 font-bold mt-1.5 flex items-center gap-1">
                                        <span className="size-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="size-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                    <span className="material-symbols-outlined">call</span>
                                </button>
                                <button className="size-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                    <span className="material-symbols-outlined">videocam</span>
                                </button>
                                <button className="size-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-chat-pattern">
                            {messages.map((msg, i) => {
                                const isMe = msg.sender._id === user?._id || msg.sender === user?._id;
                                return (
                                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                                            <div className={`p-4 rounded-2xl shadow-sm text-sm ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-bl-none'}`}>
                                                {msg.content}
                                            </div>
                                            <p className={`text-[10px] text-slate-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <footer className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            <form className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 pl-4" onSubmit={handleSendMessage}>
                                <button type="button" className="text-slate-400 hover:text-primary">
                                    <span className="material-symbols-outlined">mood</span>
                                </button>
                                <button type="button" className="text-slate-400 hover:text-primary">
                                    <span className="material-symbols-outlined">attach_file</span>
                                </button>
                                <input 
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2" 
                                    placeholder="Type your message..." 
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button className="bg-primary text-white size-10 flex items-center justify-center rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all" type="submit">
                                    <span className="material-symbols-outlined text-xl">send</span>
                                </button>
                            </form>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="size-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-5xl">chat_bubble</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Your Inbox</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">Select a conversation or search for someone to start chatting with them.</p>
                        <button className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">Start New Conversation</button>
                    </div>
                )}
            </main>
        </div>
    );
}
