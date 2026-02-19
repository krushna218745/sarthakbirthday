import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './WhatsAppIntro.css';

const chatMessages = [
    { sender: 'Yash', message: 'Abe me kya boltaa', type: 'other', delay: 2500 },
    { sender: 'Yash', message: 'Abe ghumne chalo naaaa fir movie chalenge wahi kisi pass ke theatre me', type: 'other', delay: 4500 },
    { sender: 'Krushna', message: 'I am in for ghumna not movie', type: 'other', delay: 2000 },
    { sender: 'Yash', message: 'Abe ajao na dono', type: 'other', delay: 1800 },
    { sender: 'Sarthak', message: 'Me nhi ara', type: 'sarthak', delay: 5000 },
    { sender: 'Yash', message: 'Abe sirf ghumne hi chal lo bas movie rehendo', type: 'other', delay: 2500 },
    { sender: 'Krushna', message: 'Thike ghumne ke liye me ready hu', type: 'other', delay: 2200 },
    { sender: 'Sarthak', message: 'Me nhi aara kahi bhi', type: 'sarthak', delay: 5500 },
    { sender: 'Yash', message: 'Kyu be aanaa saale', type: 'other', delay: 1800 },
    { sender: 'Sarthak', message: 'Nahi be man nhi hai', type: 'sarthak', delay: 5000 },
    { sender: 'Krushna', message: 'Kyu nhi hai man?', type: 'other', delay: 2000 },
    { sender: 'Sarthak', message: 'Nhi hai bas meko nhi jana kahi', type: 'sarthak', delay: 5500 },
    { sender: 'Yash', message: 'Abe maska mat lagwa aaja shanti se', type: 'other', delay: 2500 },
    { sender: 'Krushna', message: 'Hana be aaja', type: 'other', delay: 1800 },
    { sender: 'Sarthak', message: 'Nhi be tum log jao mera man nhi', type: 'sarthak', delay: 5500 },
    { sender: 'Yash', message: 'Kyu nhi hai man bata', type: 'other', delay: 2000 },
    { sender: 'Sarthak', message: 'Bas nhi hai man meko sona hai', type: 'sarthak', delay: 5000 },
    { sender: 'Yash', message: 'Abe par aaj to ana hi hoga', type: 'other', delay: 2200 },
    { sender: 'Krushna', message: 'Hanaaa aaj to aana hi hogaaaaaaa', type: 'other', delay: 2000 },
    { sender: 'Sarthak', message: 'Kyu?', type: 'sarthak', delay: 4000 },
    { sender: 'Yash', message: 'Areee', type: 'other', delay: 1500 },
    { sender: 'Krushna', message: 'Areee', type: 'other', delay: 1200 },
    { sender: 'Krushna', message: 'Chal batate hai kyu...', type: 'other', delay: 2500 },
    // The twist!
    { sender: 'Krushna', message: 'HAPPY BIRTHDAY SARTHAK! 🎂🎉🥳', type: 'other', delay: 3000, special: true },
    { sender: 'Yash', message: 'HAPPY BIRTHDAY BHAI! 🎁🎊🎈', type: 'other', delay: 1500, special: true },
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

export default function WhatsAppIntro({ onComplete }) {
    const [visibleMessages, setVisibleMessages] = useState([]);
    const [typingUser, setTypingUser] = useState(null);
    const [showBirthdayBlast, setShowBirthdayBlast] = useState(false);
    const chatContainerRef = useRef(null);
    const timeoutRefs = useRef([]);
    const onCompleteRef = useRef(onComplete);
    
    // Keep onComplete ref updated
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    const fireConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        const colors = ['#ff6600', '#fff01f', '#ff2d95', '#00ff00', '#00ffff'];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    useEffect(() => {
        let currentIndex = 0;
        let isCancelled = false;
        
        console.log('WhatsApp chat starting, total messages:', chatMessages.length);

        const showNextMessage = () => {
            if (isCancelled) return;
            
            console.log('showNextMessage called, currentIndex:', currentIndex);
            
            if (currentIndex >= chatMessages.length) {
                console.log('All messages done, showing blast and transitioning...');
                setTypingUser(null);
                // Show birthday blast after chat ends
                const blastTimeout = setTimeout(() => {
                    if (isCancelled) return;
                    console.log('Showing birthday blast');
                    setShowBirthdayBlast(true);
                    fireConfetti();
                    // Transition to main site after blast
                    const completeTimeout = setTimeout(() => {
                        if (isCancelled) return;
                        console.log('Calling onComplete to transition');
                        if (onCompleteRef.current) {
                            onCompleteRef.current();
                        }
                    }, 2500);
                    timeoutRefs.current.push(completeTimeout);
                }, 800);
                timeoutRefs.current.push(blastTimeout);
                return;
            }

            const currentMsg = chatMessages[currentIndex];
            
            // Show typing indicator
            setTypingUser(currentMsg.sender);

            // After typing delay, show the message
            const typingTimeout = setTimeout(() => {
                if (isCancelled) return;
                setTypingUser(null);
                setVisibleMessages(prev => [...prev, currentIndex]);
                
                // Fire confetti on special messages
                if (currentMsg.special) {
                    confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { y: 0.7 },
                        colors: ['#ff6600', '#fff01f', '#ff2d95']
                    });
                }
                
                currentIndex++;
                
                // Pause before next typing starts
                const gapTimeout = setTimeout(showNextMessage, 1200);
                timeoutRefs.current.push(gapTimeout);
            }, currentMsg.delay);
            
            timeoutRefs.current.push(typingTimeout);
        };

        // Start the sequence after a brief pause
        const startTimeout = setTimeout(showNextMessage, 1500);
        timeoutRefs.current.push(startTimeout);

        return () => {
            isCancelled = true;
            timeoutRefs.current.forEach(id => clearTimeout(id));
            timeoutRefs.current = [];
        };
    }, []);

    // Auto-scroll to bottom as messages appear
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [visibleMessages, typingUser]);

    return (
        <div className={`whatsapp-intro ${showBirthdayBlast ? 'blast-active' : ''}`}>
            <div className="whatsapp-phone">
                {/* Status Bar */}
                <div className="phone-status-bar">
                    <span>9:41</span>
                    <div className="status-icons">
                        <span>📶</span>
                        <span>🔋</span>
                    </div>
                </div>

                {/* WhatsApp Header */}
                <div className="wa-header">
                    <div className="wa-header-left">
                        <span className="wa-back">←</span>
                        <div className="wa-avatar">👥</div>
                        <div className="wa-info">
                            <span className="wa-name">S.K.Y.</span>
                            <span className="wa-status">Sarthak, Krushna, Yash</span>
                        </div>
                    </div>
                    <div className="wa-header-icons">
                        <span>📹</span>
                        <span>📞</span>
                        <span>⋮</span>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="wa-chat" ref={chatContainerRef}>
                    <div className="wa-date-badge">
                        <span>Today</span>
                    </div>
                    
                    {visibleMessages.map((msgIndex) => {
                        const chat = chatMessages[msgIndex];
                        return (
                            <div
                                key={msgIndex}
                                className={`wa-msg ${chat.type === 'sarthak' ? 'wa-msg-sent' : 'wa-msg-received'} ${chat.special ? 'wa-msg-special' : ''} wa-msg-animate`}
                            >
                                {chat.type !== 'sarthak' && (
                                    <span 
                                        className="wa-sender"
                                        style={{ color: senderColors[chat.sender] }}
                                    >
                                        {chat.sender}
                                    </span>
                                )}
                                <span className="wa-text">{chat.message}</span>
                                <span className="wa-time">
                                    {chat.type === 'sarthak' ? '✓✓ ' : ''}
                                    {`${9 + Math.floor(msgIndex / 4)}:${String(41 + (msgIndex * 2) % 19).padStart(2, '0')}`}
                                </span>
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

                {/* Input Bar */}
                <div className="wa-input">
                    <span>😊</span>
                    <div className="wa-input-field">Type a message</div>
                    <span>📎</span>
                    <span>📷</span>
                    <div className="wa-mic">🎤</div>
                </div>
            </div>

            {/* Skip Button for testing */}
            <button 
                onClick={() => {
                    console.log('Skip clicked, calling onComplete');
                    if (onCompleteRef.current) {
                        onCompleteRef.current();
                    }
                }}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    padding: '10px 20px',
                    background: '#25D366',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    zIndex: 100
                }}
            >
                Skip Chat →
            </button>

            {/* Birthday Blast Overlay */}
            {showBirthdayBlast && (
                <div className="birthday-blast">
                    <h1 className="blast-text">🎂 HAPPY BIRTHDAY SARTHAK! 🎂</h1>
                    <p className="blast-subtext">Get ready for the chaos...</p>
                </div>
            )}
        </div>
    );
}
