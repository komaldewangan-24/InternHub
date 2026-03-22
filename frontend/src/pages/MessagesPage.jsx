import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
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
    return <LoadingState label="Synchronizing messages..." />;
  }

  return (
    <AppShell
      title="Messaging Hub"
      description="Secure multi-role communication channel for project feedback and recruitment."
      navigation={navigation}
      user={user}
    >
      <div className="grid h-[calc(100vh-280px)] gap-6 xl:grid-cols-[380px,1fr]">
        <section className="flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm transition-all">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input 
                className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 px-11 py-3 text-sm outline-none focus:border-primary transition-all dark:text-white" 
                placeholder="Search faculty or recruiters" 
                value={search} 
                onChange={(event) => setSearch(event.target.value)} 
              />
            </div>
          </div>
          
          <div className="flex-1 space-y-2 overflow-y-auto p-4 custom-scrollbar">
            {search.trim().length >= 2 ? (
              searchResults.length ? (
                searchResults.map((person) => (
                  <button
                    key={person._id || person.id}
                    className={`group w-full rounded-2xl p-4 text-left transition-all ${
                      (selectedUser?._id || selectedUser?.id) === (person._id || person.id)
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                    onClick={() => openConversation(person)}
                  >
                    <p className="font-black tracking-tight">{person.name}</p>
                    <p className={`mt-1 text-xs font-bold uppercase tracking-widest ${
                      (selectedUser?._id || selectedUser?.id) === (person._id || person.id) ? 'text-white/70' : 'text-primary'
                    }`}>{person.role}</p>
                  </button>
                ))
              ) : (
                <EmptyState icon="person_off" title="No results" description="Try searching for a different name." />
              )
            ) : conversations.length ? (
              conversations.map((conv) => (
                <button
                  key={conv.user?._id || conv.user?.id}
                  className={`group w-full rounded-2xl p-4 text-left transition-all ${
                    (selectedUser?._id || selectedUser?.id) === (conv.user?._id || conv.user?.id)
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                  onClick={() => openConversation(conv.user)}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-black tracking-tight">{conv.user?.name}</p>
                    <span className={`text-[10px] font-bold ${
                      (selectedUser?._id || selectedUser?.id) === (conv.user?._id || conv.user?.id) ? 'text-white/60' : 'text-slate-400'
                    }`}>
                      {new Date(conv.lastMessage.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className={`mt-1 line-clamp-1 text-sm ${
                    (selectedUser?._id || selectedUser?.id) === (conv.user?._id || conv.user?.id) ? 'text-white/80' : 'text-slate-500'
                  }`}>
                    {conv.lastMessage.content}
                  </p>
                </button>
              ))
            ) : (
              <EmptyState icon="chat_bubble" title="Inbox empty" description="Start a conversation with a verified user." />
            )}
          </div>
        </section>

        <section className="flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm transition-all overflow-hidden relative">
          {selectedUser ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 p-6 bg-slate-50/50 dark:bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black shadow-sm">
                    {selectedUser.name?.[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight dark:text-white leading-none">{selectedUser.name}</h2>
                    <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-primary">{selectedUser.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex size-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined">call</span>
                  </button>
                  <button className="flex size-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
              </div>
              
              <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30 dark:bg-transparent">
                {messages.map((message) => {
                  const senderId = message.sender?._id || message.sender;
                  const isMine = senderId === currentUserId;
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-[1.5rem] px-6 py-4 text-sm font-medium shadow-sm transition-all ${
                          isMine 
                            ? 'rounded-tr-none bg-primary text-white shadow-primary/10 hover:shadow-primary/20' 
                            : 'rounded-tl-none bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5'
                        }`}
                      >
                        {message.content}
                        <div className={`mt-2 text-[9px] font-bold uppercase tracking-widest ${isMine ? 'text-white/50 text-right' : 'text-slate-400'}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5">
                <form className="flex items-center gap-4" onSubmit={handleSendMessage}>
                  <div className="flex-1 relative">
                    <input 
                      className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-6 py-4 text-sm outline-none focus:border-primary transition-all dark:text-white" 
                      placeholder="Type your message..." 
                      value={newMessage} 
                      onChange={(event) => setNewMessage(event.target.value)} 
                    />
                  </div>
                  <button className="flex size-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50" disabled={!newMessage.trim()} type="submit">
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-12 text-center">
              <div className="flex size-24 items-center justify-center rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-300 mb-8 shadow-sm">
                <span className="material-symbols-outlined text-[48px]">forum</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight dark:text-white">Professional Messaging</h3>
              <p className="mt-3 max-w-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Connect with stakeholders. Role-based permissions ensure communications remain professional and relevant to your workflow.
              </p>
              <button className="mt-10 rounded-2xl border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                Search Contacts
              </button>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
