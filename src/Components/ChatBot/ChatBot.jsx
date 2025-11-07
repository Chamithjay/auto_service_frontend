import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../../services/ChatBotService";
import "./ChatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I can help you check available appointment slots. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(inputMessage, currentUser?.id);

      const botMessage = {
        type: "bot",
        text: response.response || "Sorry, I could not understand that.",
        data: response.data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      const errorMessage = {
        type: "bot",
        text: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotClick = (slot) => {
    const slotMessage = `I'd like to book ${slot.start} - ${slot.end}`;
    setInputMessage(slotMessage);
  };

  const formatTime12Hour = (time24) => {
    if (!time24) return "N/A";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="chat-bot-button" onClick={toggleChat}>
        <svg
          className="chat-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="chat-bot-window">
          <div className="chat-bot-header">
            <div className="chat-header-content">
              <div className="bot-avatar"></div>
              <div>
                <h3>AutoService Bot</h3>
                <span className="bot-status">Online</span>
              </div>
            </div>
            <button className="close-chat-btn" onClick={toggleChat}>
              ✕
            </button>
          </div>

          <div className="chat-bot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                {message.type === "bot" && (
                  <div className="message-avatar"></div>
                )}
                <div className="message-content">
                  <div className="message-text">
                    {message.text &&
                      !message.text.includes("*") &&
                      message.text}
                  </div>

                  {/* Display time slots as cards only */}
                  {message.data &&
                    message.data.available_slots &&
                    message.data.available_slots.length > 0 && (
                      <div className="slots-container">
                        <div className="slots-header">
                          <svg
                            className="calendar-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>Available Time Slots</span>
                          <span className="slots-count">
                            {message.data.total_slots} slots
                          </span>
                        </div>

                        <div className="slots-grid">
                          {message.data.available_slots.map((slot, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="slot-card"
                              onClick={() => handleSlotClick(slot)}
                              title="Click to book this slot"
                            >
                              <div className="slot-time">
                                <svg
                                  className="clock-icon"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="time-label">
                                  {formatTime12Hour(slot.start)}
                                </span>
                              </div>
                              <div className="slot-duration">
                                <span className="duration-text">
                                  {slot.end
                                    ? `to ${formatTime12Hour(slot.end)}`
                                    : "1 hour"}
                                </span>
                              </div>
                              <div className="slot-status">
                                <span className="status-badge">
                                  {slot.available_employees >=
                                  slot.required_employees
                                    ? "Available"
                                    : "Full"}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>

                        {message.data.date && (
                          <div className="slots-footer">
                            {new Date(message.data.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        )}
                      </div>
                    )}

                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message bot">
                <div className="message-avatar"></div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chat-bot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Ask about appointment availability..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputMessage.trim()}>
              <svg
                className="send-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
