import React, { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { messageAPI, userAPI } from '../services/api';

const formatConversationMap = (messages, currentUserId) => {
  const grouped = new Map();

  messages.forEach((message) => {
    const senderId = message.sender?._id || message.sender;
    const otherUser = senderId === currentUserId ? message.recipient : message.sender;
    const otherUserId = otherUser?._id || otherUser?.id;

    if (!otherUserId) return;

    const existing = grouped.get(otherUserId);
    if (!existing || new Date(message.createdAt) > new Date(existing.lastMessage.createdAt)) {
      grouped.set(otherUserId, { user: otherUser, lastMessage: message });
    }
  });

  return Array.from(grouped.values()).sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));
};

export default function MessagesPage() {
  const { user, loading } = useCurrentUser();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const scrollRef = useRef(null);

  const currentUserId = user?._id || user?.id;
  const navigation = navigationByRole[user?.role || 'student'] || navigationByRole.student;

  const refreshConversations = useCallback(async () => {
    const { data } = await messageAPI.getAll();
    setConversations(formatConversationMap(data.data || [], currentUserId));
  }, [currentUserId]);

  useEffect(() => {
    const loadData = async () => {
      if (!currentUserId) return;
      try {
        setPageLoading(true);
        await refreshConversations();
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [currentUserId, refreshConversations]);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (search.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const { data } = await userAPI.search(search);
        setSearchResults(data.data || []);
      } catch {
        setSearchResults([]);
      }
    };
    loadSearchResults();
  }, [search]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const openConversation = async (recipient) => {
    setSelectedUser(recipient);
    const userId = recipient._id || recipient.id;
    const { data } = await messageAPI.getConversation(userId);
    setMessages(data.data || []);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!selectedUser || !newMessage.trim()) return;

    try {
      const { data } = await messageAPI.sendMessage({
        recipient: selectedUser._id || selectedUser.id,
        content: newMessage.trim(),
      });
      setMessages((current) => [...current, data.data]);
      setNewMessage('');
      await refreshConversations();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to send message');
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Loading messages..." />;
  }

  return (
    <AppShell
      title="Messages"
      description="Communicate within the institutional hierarchy to optimize recruitment outcomes."
      navigation={navigation}
      user={user}
    >
      <div className="flex h-[calc(100vh-280px)] flex-col gap-8 lg:flex-row lg:items-start lg:px-4 uppercase">
        <aside className="flex-[0.85] flex flex-col overflow-hidden rounded-md bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-white/5 h-full lg:min-w-[340px] relative group uppercase whitespace-nowrap">
          <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/10 dark:bg-transparent">
             <div className="flex items-center gap-3 mb-6 px-2">
                <div className="size-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <p className="text-[10px] font-poppins font-bold uppercase tracking-[0.3em] text-indigo-500">INBOX NODES</p>
             </div>
            <div className="relative group/search">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500/40 group-focus-within/search:text-indigo-500 transition-all text-[20px]">search</span>
              <input 
                className="w-full rounded-sm border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 px-10 py-4 text-[10px] font-poppins font-bold outline-none focus:border-indigo-500 transition-all dark:text-white" 
                placeholder="SEARCH CONTACTS..." 
                value={search} 
                onChange={(event) => setSearch(event.target.value)} 
              />
            </div>
          </div>
          
          <div className="flex-1 space-y-2 overflow-y-auto p-6 scrollbar-hide">
            {search.trim().length >= 2 ? (
              searchResults.length ? (
                searchResults.map((person) => (
                  <button
                    key={person._id || person.id}
                    className={`group w-full rounded-sm p-4 text-left transition-all duration-300 border-2 ${
                      (selectedUser?._id || selectedUser?.id) === (person._id || person.id)
                        ? 'text-white border-transparent shadow-lg scale-[1.01]'
                        : 'bg-white dark:bg-white/5 border-slate-50 dark:border-white/5 hover:border-indigo-500/30'
                    }`}
                    style={{ backgroundImage: (selectedUser?._id || selectedUser?.id) === (person._id || person.id) ? 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' : 'none' }}
                    onClick={() => openConversation(person)}
                  >
                    <p className="text-xs font-poppins font-bold tracking-tighter truncate uppercase leading-tight">{person.name}</p>
                    <p className={`mt-2 text-[8px] font-poppins font-bold uppercase tracking-widest leading-none ${
                      (selectedUser?._id || selectedUser?.id) === (person._id || person.id) ? 'text-white/60' : 'text-indigo-500'
                    }`}>{person.role}</p>
                  </button>
                ))
              ) : (
                <EmptyState icon="person_off" title="No results" description="Adjust your search parameters." />
              )
            ) : conversations.length ? (
              conversations.map((conv) => {
                 const isSelected = (selectedUser?._id || selectedUser?.id) === (conv.user?._id || conv.user?.id);
                 return (
                  <button
                    key={conv.user?._id || conv.user?.id}
                    className={`group w-full rounded-sm p-5 text-left transition-all duration-300 border ${
                      isSelected
                        ? 'text-white border-transparent shadow-lg scale-[1.01]'
                        : 'bg-transparent border-slate-100 dark:border-white/5 hover:border-indigo-500/30 shadow-sm'
                    }`}
                    style={{ backgroundImage: isSelected ? 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' : 'none' }}
                    onClick={() => openConversation(conv.user)}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="text-[11px] font-poppins font-bold tracking-tighter uppercase leading-none truncate pr-4">{conv.user?.name}</h4>
                       <span className={`text-[8px] font-poppins font-bold uppercase tracking-widest ${
                         isSelected ? 'text-white/40' : 'text-slate-400'
                       }`}>
                         {new Date(conv.lastMessage.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                       </span>
                    </div>
                    <p className={`line-clamp-1 text-[10px] font-roboto font-medium opacity-80 whitespace-normal leading-relaxed lowercase ${
                      isSelected ? 'text-white/80' : 'text-slate-500'
                    }`}>
                      {conv.lastMessage.content}
                    </p>
                  </button>
                 );
              })
            ) : (
              <EmptyState icon="chat_bubble" title="No Messages" description="Select a contact to start messaging." />
            )}
          </div>
        </aside>

        <section className="flex-[1.15] flex flex-col overflow-hidden rounded-md bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-white/5 h-full relative group">
          {selectedUser ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 p-8 bg-slate-50/5 dark:bg-transparent relative z-10">
                <div className="flex items-center gap-5 group/user">
                  <div className="flex size-14 items-center justify-center rounded-sm bg-slate-50 dark:bg-white/5 text-slate-300 font-poppins font-bold shadow-sm transition-transform group-hover:rotate-3 overflow-hidden border border-slate-100 dark:border-white/10">
                    {selectedUser.profile?.avatarUrl ? (
                      <img src={selectedUser.profile.avatarUrl} alt="User" className="size-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[28px]">account_circle</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white leading-none uppercase">{selectedUser.name}</h2>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-sm border border-emerald-500/20">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-[8px] font-poppins font-bold uppercase text-emerald-600 tracking-[0.2em]">CONNECTED</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div ref={scrollRef} className="flex-1 space-y-8 overflow-y-auto p-10 scrollbar-hide bg-transparent">
                {messages.map((message) => {
                  const senderId = message.sender?._id || message.sender;
                  const isMine = senderId === currentUserId;
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-sm px-6 py-4 text-sm font-roboto leading-relaxed shadow-sm transition-all duration-300 ${
                          isMine 
                            ? 'text-white translate-x-1' 
                            : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-100 border border-slate-100 dark:border-white/10 -translate-x-1'
                        }`}
                        style={{ backgroundImage: isMine ? 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' : 'none' }}
                      >
                        <p className="whitespace-pre-wrap lowercase">{message.content}</p>
                        <div className={`mt-2 text-[8px] font-poppins font-bold uppercase tracking-[0.2em] ${isMine ? 'text-white/40 text-right' : 'text-slate-400'}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5">
                <form className="flex items-center gap-4" onSubmit={handleSendMessage}>
                  <div className="flex-1 relative group/input">
                    <textarea 
                      className="w-full rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-6 py-4 text-sm font-medium outline-none focus:border-indigo-500 transition-all dark:text-white h-[54px] resize-none overflow-hidden" 
                      placeholder="SYNCHRONIZE MESSAGE..." 
                      value={newMessage} 
                      onChange={(event) => setNewMessage(event.target.value)} 
                    />
                  </div>
                  <button 
                    className="flex size-14 shrink-0 items-center justify-center rounded-sm text-white shadow-md transition-all hover:opacity-90 active:scale-95 disabled:opacity-50" 
                    style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
                    disabled={!newMessage.trim()} 
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-[28px]">send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-16 text-center relative">
               <div className="flex size-24 items-center justify-center rounded-sm bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-indigo-500 mb-8 shadow-sm">
                 <span className="material-symbols-outlined text-[48px] opacity-30">forum</span>
               </div>
               <h3 className="text-2xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white uppercase leading-none mb-4">COMMUNICATION_HUB</h3>
               <p className="max-w-xs text-[10px] font-poppins font-bold uppercase tracking-widest text-slate-400">Select a conversation node to begin synchronizing correspondence.</p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
