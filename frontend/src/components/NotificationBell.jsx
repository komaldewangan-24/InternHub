import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { notificationAPI } from '../services/api';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const bellRef = useRef(null);

  const fetchNotes = useCallback(async () => {
    try {
      const response = await notificationAPI.getAll(8);
      const data = response?.data?.data || [];
      const unread = response?.data?.unreadCount || 0;
      setNotifications(data);
      setUnreadCount(unread);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
    const interval = setInterval(fetchNotes, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchNotes]);

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, readAt: n.readAt || new Date().toISOString() })));
    } catch {
      // Passive on error
    }
  };

  const toggleOpen = () => {
    if (!open && unreadCount > 0) {
      markAllAsRead();
    }
    setOpen(!open);
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={toggleOpen}
        className={`flex size-11 items-center justify-center rounded-2xl border transition-all shadow-sm ${
          open 
            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
            : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:border-primary hover:text-primary'
        }`}
        type="button"
        title="Institutional Notifications"
      >
        <div className="relative">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-16 z-50 w-[380px] rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-8 shadow-2xl backdrop-blur-3xl animate-in zoom-in-95 duration-200 transform origin-top-right">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Activity stream</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs font-bold text-primary hover:underline">Mark read</button>
            )}
          </div>

          <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
            {notifications && notifications.length > 0 ? (
              notifications.map((note) => {
                if (!note) return null;
                const date = note.createdAt ? new Date(note.createdAt) : null;
                
                return (
                  <Link
                    key={note._id || Math.random()}
                    to={note.link || '#'}
                    onClick={() => setOpen(false)}
                    className={`block rounded-3xl border p-5 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      note.readAt 
                        ? 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 opacity-70' 
                        : 'border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10'
                    }`}
                  >
                    <div className="flex justify-between gap-3">
                      <p className="font-bold text-sm dark:text-white leading-tight">{note.title || 'System Cluster Update'}</p>
                      {!note.readAt && <span className="size-2 rounded-full bg-primary mt-1 shrink-0" />}
                    </div>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{note.message || 'No notification content available.'}</p>
                    <div className="mt-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <span className="material-symbols-outlined text-[14px]">history</span>
                      {date ? `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Recent Update'}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5 p-12 text-center">
                <span className="material-symbols-outlined text-[32px] text-slate-300 dark:text-slate-700 block mb-4">notifications_off</span>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 leading-relaxed">System status optimal.<br/>No pending notifications.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
