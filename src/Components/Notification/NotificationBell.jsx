import React, { useState, useEffect, useRef } from "react";
import {
  getUnreadNotificationsByRole,
  getUnreadCountByRole,
  markAsRead,
  markAllAsReadByRole,
} from "../../services/notificationService";

const NotificationBell = ({ userRole }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch unread notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getUnreadNotificationsByRole(userRole);
      setNotifications(data);
      setUnreadCount(data.length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCountByRole(userRole);
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (userRole) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [userRole]);

  // Poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (userRole) fetchUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, [userRole]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      if (newState) fetchNotifications();
      return newState;
    });
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Mark as read failed:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadByRole(userRole);
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all as read failed:", err);
    }
  };

  const getNotificationIcon = (type) => {
    return (
      { SUCCESS: "Check", WARNING: "Warning", ERROR: "Cross", INFO: "Info" }[
        type
      ] || "Info"
    );
  };

  const getNotificationColor = (type) => {
    return (
      {
        SUCCESS: "#10b981",
        WARNING: "#f59e0b",
        ERROR: "#ef4444",
        INFO: "#14274E",
      }[type] || "#14274E"
    );
  };

  const formatTimeAgo = (dateString) => {
    const diff = Math.floor((Date.now() - new Date(dateString)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <>
      {/* Embedded Styles */}
      <style>{`
        /* ====================================
                   NOTIFICATION BELL - FULLY COMBINED STYLES
                   ==================================== */
        .notification-bell-container {
          position: relative;
          display: inline-block;
        }
        .notification-bell-button {
          background: #14274e;
          border: none;
          cursor: pointer;
          padding: 10px;
          border-radius: 50%;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(20, 39, 78, 0.1);
        }
        .notification-bell-button:hover {
          background: linear-gradient(135deg, #14274e, #394867);
          box-shadow: 0 6px 12px rgba(20, 39, 78, 0.2);
          transform: translateY(-2px);
        }
        .notification-bell-button:active {
          transform: translateY(0) scale(0.95);
        }
        .bell-icon {
          width: 22px;
          height: 22px;
          color: white;
        }
        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          font-size: 10px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 12px;
          width: 400px;
          max-width: 90vw;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(20, 39, 78, 0.15);
          z-index: 1000;
          animation: slideDown 0.3s ease;
          overflow: hidden;
          border: 1px solid rgba(155, 164, 180, 0.2);
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          border-bottom: 1px solid rgba(155, 164, 180, 0.2);
          background: linear-gradient(135deg, #14274e, #394867);
        }
        .notification-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: white;
        }
        .mark-all-read-btn {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .mark-all-read-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
        .notification-list {
          max-height: 450px;
          overflow-y: auto;
        }
        .notification-list::-webkit-scrollbar {
          width: 8px;
        }
        .notification-list::-webkit-scrollbar-track {
          background: #f1f6f9;
        }
        .notification-list::-webkit-scrollbar-thumb {
          background: #9ba4b4;
          border-radius: 4px;
        }
        .notification-list::-webkit-scrollbar-thumb:hover {
          background: #394867;
        }
        .notification-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 18px 24px;
          border-bottom: 1px solid #f1f6f9;
          border-left: 3px solid transparent;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }
        .notification-item:hover {
          background: #f1f6f9;
          border-left-color: #14274e;
        }
        .notification-item.unread::before {
          content: "";
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: #14274e;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(20, 39, 78, 0.4);
        }
        .notification-content {
          display: flex;
          gap: 14px;
          flex: 1;
        }
        .notification-type-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .notification-text h4 {
          margin: 0 0 6px;
          font-size: 15px;
          font-weight: 700;
          color: #14274e;
          line-height: 1.4;
        }
        .notification-text p {
          margin: 0 0 8px;
          font-size: 14px;
          color: #394867;
          line-height: 1.5;
          word-wrap: break-word;
        }
        .notification-time {
          font-size: 12px;
          color: #9ba4b4;
          font-weight: 600;
        }
        .mark-read-btn {
          background: white;
          border: 2px solid #9ba4b4;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #9ba4b4;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        .mark-read-btn:hover {
          background: linear-gradient(135deg, #10b981, #059669);
          border-color: #10b981;
          color: white;
          transform: scale(1.1) rotate(5deg);
        }
        .notification-loading {
          padding: 50px 20px;
          text-align: center;
          color: #394867;
          font-size: 14px;
          font-weight: 600;
        }
        .notification-loading::after {
          content: "...";
          animation: dots 1.5s infinite;
        }
        @keyframes dots {
          0%,
          20% {
            content: ".";
          }
          40% {
            content: "..";
          }
          60%,
          100% {
            content: "...";
          }
        }
        .notification-empty {
          padding: 50px 20px;
          text-align: center;
        }
        .empty-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 16px;
          color: #9ba4b4;
        }
        .notification-empty p {
          margin: 0;
          color: #394867;
          font-size: 15px;
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .notification-dropdown {
            width: 360px;
            right: -10px;
          }
        }
        @media (max-width: 480px) {
          .notification-dropdown {
            width: 95vw;
            right: -20px;
            max-width: 360px;
          }
          .notification-header {
            padding: 14px 18px;
          }
          .notification-header h3 {
            font-size: 16px;
          }
          .mark-all-read-btn {
            font-size: 12px;
            padding: 5px 10px;
          }
          .notification-item {
            padding: 14px 18px;
          }
          .notification-text h4 {
            font-size: 14px;
          }
          .notification-text p {
            font-size: 13px;
          }
          .notification-type-icon {
            width: 36px;
            height: 36px;
            font-size: 14px;
          }
          .mark-read-btn {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }
        }

        /* Accessibility */
        .notification-bell-button:focus,
        .mark-all-read-btn:focus,
        .mark-read-btn:focus {
          outline: 3px solid #394867;
          outline-offset: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* JSX */}
      <div className="notification-bell-container" ref={dropdownRef}>
        <button
          className="notification-bell-button"
          onClick={toggleDropdown}
          aria-label="Toggle notifications"
          aria-expanded={isOpen}
        >
          <svg
            className="bell-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadCount > 0 && (
            <span
              className="notification-badge"
              aria-label={`${unreadCount} unread`}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div
            className="notification-dropdown"
            role="dialog"
            aria-label="Notifications"
          >
            <div className="notification-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <button
                  className="mark-all-read-btn"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="notification-list" role="list">
              {loading ? (
                <div
                  className="notification-loading"
                  role="status"
                  aria-live="polite"
                >
                  Loading
                </div>
              ) : notifications.length === 0 ? (
                <div className="notification-empty">
                  <svg
                    className="empty-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>No new notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="notification-item unread"
                    style={{ borderLeftColor: getNotificationColor(n.type) }}
                    role="listitem"
                    tabIndex={0}
                  >
                    <div className="notification-content">
                      <div className="notification-icon-wrapper">
                        <span
                          className="notification-type-icon"
                          style={{
                            backgroundColor: getNotificationColor(n.type),
                          }}
                        >
                          {getNotificationIcon(n.type)}
                        </span>
                      </div>
                      <div className="notification-text">
                        <h4>{n.title}</h4>
                        <p>{n.message}</p>
                        <span className="notification-time">
                          {formatTimeAgo(n.createdAt)}
                        </span>
                      </div>
                    </div>
                    <button
                      className="mark-read-btn"
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                      aria-label={`Mark ${n.title} as read`}
                    >
                      Check
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationBell;
