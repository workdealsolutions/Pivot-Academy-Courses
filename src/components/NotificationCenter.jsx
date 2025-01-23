import React, { useState } from "react";
import { Bell } from "lucide-react";

const Notification = ({ id, title, message, timestamp, read, onMarkAsRead }) => (
  <div className={`notification ${read ? "read" : "unread"}`} onClick={() => onMarkAsRead(id)}>
    <div className="notification-header">
      <span className="notification-title">{title}</span>
      {!read && <span className="notification-badge">New</span>}
    </div>
    <p className="notification-message">{message}</p>
    <span className="notification-timestamp">{timestamp}</span>
  </div>
);

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New course available",
      message: "Check out our new course on Advanced React Patterns!",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      title: "Assignment due soon",
      message: "Your JavaScript Fundamentals assignment is due in 2 days.",
      timestamp: "1 day ago",
      read: false,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="notification-center">
      <button className="notification-trigger" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="notification-icon" />
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </button>
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No new notifications</div>
            ) : (
              notifications.map((notification) => (
                <Notification key={notification.id} {...notification} onMarkAsRead={markAsRead} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

