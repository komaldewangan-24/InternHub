import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notificationAPI } from '../services/api';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    notificationAPI
      .getAll(8)
      .then(({ data }) => {
        if (!isActive) return;
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount || 0);
      })
      .catch(() => {
        if (!isActive) return;
        setNotifications([]);
        setUnreadCount(0);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setUnreadCount(0);
      setNotifications((current) => current.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() })));
    } catch {
      // Keep the bell passive on failure.
    }
  };

  const handleToggle = async () => {
    const next = !open;
    setOpen(next);
    if (!open && unreadCount > 0) {
      await markAllRead();
    }
  };

  return (
    <div className="relative">
      <button
        className="relative rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
        onClick={handleToggle}
        type="button"
      >
        Notifications
        {unreadCount > 0 ? (
          <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-16 z-20 w-[340px] rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Recent updates</p>
            <button className="text-xs font-semibold text-primary" onClick={markAllRead} type="button">
              Mark all read
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {notifications.length ? (
              notifications.map((notification) => (
                <Link
                  key={notification._id}
                  className={`block rounded-2xl border p-4 text-sm ${
                    notification.readAt ? 'border-slate-200 bg-slate-50' : 'border-primary/30 bg-primary/5'
                  }`}
                  onClick={() => setOpen(false)}
                  to={notification.link || '#'}
                >
                  <p className="font-semibold">{notification.title}</p>
                  <p className="mt-1 text-slate-600">{notification.message}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
