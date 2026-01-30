import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Assistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am SankatMitra Bot 🤖. How can I help you today?", isBot: true },
    ]);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const toggleOpen = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isOpen]);

    const handleOption = (option) => {
        // Add user message
        setMessages((prev) => [...prev, { id: Date.now(), text: option.label, isBot: false }]);

        // Simulate bot thinking time
        setTimeout(() => {
            let botResponse = "";
            switch (option.value) {
                case "report":
                    botResponse = "I can help you report an incident. Taking you to the Live Alerts page...";
                    setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }]);
                    setTimeout(() => navigate("/live-alerts"), 1500);
                    break;
                case "register":
                    botResponse = "Safety first! Let's get your family registered. Redirecting...";
                    setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }]);
                    setTimeout(() => navigate("/register-family"), 1500);
                    break;
                case "shelter":
                    botResponse = "You can find nearby shelters on the dashboard or check evacuation routes. Which one?";
                    // Add more complex logic here if needed
                    setMessages(prev => [...prev, { id: Date.now() + 1, text: "I'm routing you to Smart Evacuation to check safe paths.", isBot: true }]);
                    setTimeout(() => navigate("/smart-evacuation"), 2000);
                    break;
                default:
                    botResponse = "I'm here to help.";
                    setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }]);
            }
        }, 600);
    };

    const options = [
        { label: "📢 I want to report a disaster", value: "report" },
        { label: "🏠 Register my family", value: "register" },
        { label: "🚗 Find safe route / Shelter", value: "shelter" },
    ];

    return (
        <>
            <div className="assistant-float">
                <div className="assistant-avatar" onClick={toggleOpen} role="button" aria-label="Open Assistant">
                    🤖
                </div>
            </div>

            {isOpen && (
                <div className="assistant-window">
                    <div className="chat-header">
                        <span>🤖 SankatMitra Bot</span>
                        <span style={{ marginLeft: "auto", cursor: "pointer" }} onClick={toggleOpen}>✕</span>
                    </div>
                    <div className="chat-body">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`chat-bubble ${msg.isBot ? "chat-bubble--bot" : "chat-bubble--user"}`}>
                                {msg.text}
                            </div>
                        ))}

                        {/* Show options only if last message was from bot */}
                        {messages[messages.length - 1].isBot && (
                            <div className="chat-options">
                                {options.map((opt) => (
                                    <button key={opt.value} className="chat-option-btn" onClick={() => handleOption(opt)}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}
        </>
    );
}

export default Assistant;
