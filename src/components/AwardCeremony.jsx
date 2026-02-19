import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import './AwardCeremony.css';

const chatMessages = [
    { sender: 'Yash', message: 'Abe chalna, tere bina maja nahi ata movie me', type: 'other', delay: 800 },
    { sender: 'Sarthak', message: 'Dekhte hai…', type: 'sarthak', delay: 2500 },
    { sender: 'Krushna', message: 'Aajaaaaaaa 😭', type: 'other', delay: 600 },
    { sender: 'Yash', message: 'Abe chalna', type: 'other', delay: 500 },
    { sender: 'Sarthak', message: 'Dekhte bola na…', type: 'sarthak', delay: 3000 },
    { sender: 'Yash', message: 'Abe chalna', type: 'other', delay: 400 },
    { sender: 'Sarthak', message: 'Mera man nahi hai, tum log jao', type: 'sarthak', delay: 2800 },
    { sender: 'Yash', message: 'Abe chalna', type: 'other', delay: 300 },
    { sender: 'Krushna', message: 'tu nhi ayega to ham bhi nhi jaare', type: 'other', delay: 700 },
    { sender: 'Sarthak', message: 'Meko nahi aana', type: 'sarthak', delay: 2200 },
    { sender: 'Krushna', message: 'Chal lena be', type: 'other', delay: 500 },
    { sender: 'Yash', message: 'Abe chalna', type: 'other', delay: 400 },
    { sender: 'Sarthak', message: 'Abe jao na be, tum log nhi aana, meko kaam hai ghar me', type: 'sarthak', delay: 3500 },
];

const senderColors = {
    Yash: '#25D366',
    Krushna: '#FF6B6B',
    Sarthak: '#9B59B6',
};

function TypingIndicator({ sender }) {
    return (
        <div className="message-wrapper received">
            <div className="message-bubble received-bubble typing-bubble">
                <span className="sender-name" style={{ color: senderColors[sender] }}>
                    {sender}
                </span>
                <div className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                </div>
            </div>
        </div>
    );
}

function SarthakTypingIndicator() {
    return (
        <div className="message-wrapper sent">
            <div className="message-bubble sent-bubble typing-bubble">
                <div className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                </div>
            </div>
        </div>
    );
}

export default function AwardCeremony() {
    const [visibleMessages, setVisibleMessages] = useState([]);
    const [typingUser, setTypingUser] = useState(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [chatComplete, setChatComplete] = useState(false);
    const sectionRef = useRef(null);
    const chatContainerRef = useRef(null);
    const timeoutRefs = useRef([]);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

    useEffect(() => {
        if (isInView && !hasStarted) {
            setHasStarted(true);
        }
    }, [isInView, hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        let currentIndex = 0;

        const showNextMessage = () => {
            if (currentIndex >= chatMessages.length) {
                setTypingUser(null);
                setChatComplete(true);
                return;
            }

            const currentMsg = chatMessages[currentIndex];
            
            // Show typing indicator
            setTypingUser(currentMsg.sender);

            // After typing delay, show the message
            const typingTimeout = setTimeout(() => {
                setTypingUser(null);
                setVisibleMessages(prev => [...prev, currentIndex]);
                currentIndex++;
                
                // Small gap before next typing starts
                const gapTimeout = setTimeout(showNextMessage, 300);
                timeoutRefs.current.push(gapTimeout);
            }, currentMsg.delay);
            
            timeoutRefs.current.push(typingTimeout);
        };

        // Start the sequence
        const startTimeout = setTimeout(showNextMessage, 500);
        timeoutRefs.current.push(startTimeout);

        return () => {
            timeoutRefs.current.forEach(id => clearTimeout(id));
            timeoutRefs.current = [];
        };
    }, [hasStarted]);

    // Auto-scroll to bottom as messages appear
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [visibleMessages, typingUser]);

    return (
        <section className="whatsapp-section" ref={sectionRef}>
            <div className="whatsapp-container">
                {/* WhatsApp Header */}
                <div className="whatsapp-header">
                    <div className="header-left">
                        <div className="back-arrow">←</div>
                        <div className="group-avatar">👥</div>
                        <div className="group-info">
                            <span className="group-name">S.K.Y.</span>
                            <span className="group-members">Sarthak, Krushna, Yash</span>
                        </div>
                    </div>
                    <div className="header-icons">
                        <span>📹</span>
                        <span>📞</span>
                        <span>⋮</span>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="chat-container" ref={chatContainerRef}>
                    <div className="date-bubble">
                        <span>Every Weekend Ever</span>
                    </div>
                    
                    {visibleMessages.map((msgIndex) => {
                        const chat = chatMessages[msgIndex];
                        return (
                            <div
                                key={msgIndex}
                                className={`message-wrapper ${chat.type === 'sarthak' ? 'sent' : 'received'} message-fade-in`}
                            >
                                <div className={`message-bubble ${chat.type === 'sarthak' ? 'sent-bubble' : 'received-bubble'}`}>
                                    {chat.type !== 'sarthak' && (
                                        <span 
                                            className="sender-name"
                                            style={{ color: senderColors[chat.sender] }}
                                        >
                                            {chat.sender}
                                        </span>
                                    )}
                                    <span className="message-text">{chat.message}</span>
                                    <span className="message-time">
                                        {chat.type === 'sarthak' ? '✓✓ ' : ''}
                                        {`${10 + Math.floor(msgIndex / 3)}:${String((msgIndex * 7) % 60).padStart(2, '0')} PM`}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Typing Indicator */}
                    {typingUser && (
                        typingUser === 'Sarthak' 
                            ? <SarthakTypingIndicator />
                            : <TypingIndicator sender={typingUser} />
                    )}
                </div>

                {/* WhatsApp Input Bar */}
                <div className="whatsapp-input-bar">
                    <span className="emoji-btn">😊</span>
                    <div className="input-field">Type a message</div>
                    <span className="attach-btn">📎</span>
                    <span className="camera-btn">📷</span>
                    <div className="mic-btn">🎤</div>
                </div>
            </div>

            {/* Caption */}
            <p className={`chat-caption ${chatComplete ? 'caption-visible' : ''}`}>
                *Actual footage from every movie plan ever* 🎬
            </p>
        </section>
    );
}
