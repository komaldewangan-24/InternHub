import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

  return Array.from(grouped.values());
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

  const openConversation = async (recipient) => {
    setSelectedUser(recipient);
    const userId = recipient._id || recipient.id;
    const { data } = await messageAPI.getConversation(userId);
    setMessages(data.data || []);
  };

  const visiblePeople = useMemo(() => {
    if (search.trim().length >= 2) {
      return searchResults;
    }
    return conversations.map((conversation) => conversation.user);
  }, [conversations, search, searchResults]);

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
      description="Message faculty, recruiters, and placement users according to your role permissions."
      navigation={navigation}
      user={user}
    >
      <div className="grid gap-6 xl:grid-cols-[0.42fr,0.58fr]">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Search people" value={search} onChange={(event) => setSearch(event.target.value)} />
          <div className="mt-6 space-y-3">
            {visiblePeople.length ? (
              visiblePeople.map((person) => (
                <button
                  key={person._id || person.id}
                  className={`w-full rounded-2xl border p-4 text-left ${
                    (selectedUser?._id || selectedUser?.id) === (person._id || person.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200'
                  }`}
                  onClick={() => openConversation(person)}
                  type="button"
                >
                  <p className="font-semibold">{person.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{person.role}</p>
                </button>
              ))
            ) : (
              <EmptyState title="No conversations yet" description="Search for a permitted recipient to start chatting." />
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          {selectedUser ? (
            <>
              <div className="border-b border-slate-200 pb-4">
                <p className="text-lg font-bold">{selectedUser.name}</p>
                <p className="text-sm text-slate-500">{selectedUser.role}</p>
              </div>
              <div className="mt-6 max-h-[460px] space-y-3 overflow-y-auto">
                {messages.map((message) => {
                  const senderId = message.sender?._id || message.sender;
                  const isMine = senderId === currentUserId;
                  return (
                    <div
                      key={message._id}
                      className={`rounded-2xl p-4 text-sm ${
                        isMine ? 'ml-auto max-w-[75%] bg-primary text-white' : 'max-w-[75%] bg-slate-100 text-slate-700'
                      }`}
                    >
                      {message.content}
                    </div>
                  );
                })}
              </div>
              <form className="mt-6 flex gap-3" onSubmit={handleSendMessage}>
                <input className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Write a message" value={newMessage} onChange={(event) => setNewMessage(event.target.value)} />
                <button className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white" type="submit">
                  Send
                </button>
              </form>
            </>
          ) : (
            <EmptyState title="Select a conversation" description="Choose someone from the left to view history or start a new conversation." />
          )}
        </section>
      </div>
    </AppShell>
  );
}
