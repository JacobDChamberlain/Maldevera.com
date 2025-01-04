import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001'); // Use environment variable or default URL

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [myUserId, setMyUserId] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(0); // Track the number of online users
    const userColors = useRef({}); // Persistent mapping for user colors

    const getUserColor = (userId) => {
        if (!userColors.current[userId]) {
            // Generate either a neon or pastel color
            const isNeon = Math.random() > 0.5; // Randomly decide between neon or pastel

            if (isNeon) {
                // Neon color: High saturation, random hue
                const hue = Math.floor(Math.random() * 360); // Random hue (0-360)
                userColors.current[userId] = `hsl(${hue}, 100%, 50%)`; // Neon: 100% saturation, 50% lightness
            } else {
                // Pastel color: Low saturation, higher lightness
                const hue = Math.floor(Math.random() * 360); // Random hue (0-360)
                userColors.current[userId] = `hsl(${hue}, 70%, 80%)`; // Pastel: 70% saturation, 80% lightness
            }
        }
        return userColors.current[userId];
    };

    useEffect(() => {
        // Connect to WebSocket and set up listeners
        socket.on('connect', () => {
            setMyUserId(socket.id); // Set your user ID
        });

        socket.on('message', ({ userId, msg }) => {
            setMessages((prevMessages) => [...prevMessages, { userId, msg }]);
        });

        socket.on('onlineUsers', (count) => {
            setOnlineUsers(count); // Update the online users count
        });

        return () => {
            socket.off('connect');
            socket.off('message');
            socket.off('onlineUsers');
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            socket.emit('message', input); // Send your message
            setInput(''); // Clear the input field
        }
    };

    return (
        <div
            className="chat-wrapper"
            style={{
                height: '100vh',
                background: 'linear-gradient(to bottom right, rgba(106, 17, 203, 0.8), rgba(37, 117, 252, 0.8))',
                backdropFilter: 'blur(10px)', // Glassy effect
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
            }}
        >
            <div
                style={{
                    maxWidth: '400px',
                    width: '100%',
                    margin: '0 auto',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.2)', // Frosted glass look
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h2 style={{ color: '#fff', textAlign: 'center' }}>Sup, Fool?</h2>
                <h4 style={{ color: '#fff', textAlign: 'center', marginBottom: '10px' }}>You wanna talk some shit?</h4>
                <p style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>
                    Users online: <strong>{onlineUsers}</strong>
                </p>
                <div
                    style={{
                        maxHeight: '300px',
                        overflowY: 'scroll',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        padding: '10px',
                        marginBottom: '20px',
                        borderRadius: '5px',
                        background: 'rgba(255, 255, 255, 0.1)',
                    }}
                >
                    {messages.map(({ userId, msg }, index) => (
                        <div
                            key={index}
                            style={{
                                margin: '10px 0',
                                padding: '10px 10px 5px 10px', // Add space for the user ID
                                borderRadius: '8px',
                                background: userId === myUserId ? '#ADD8E6' : getUserColor(userId),
                                color: '#000',
                                position: 'relative', // Relative for child positioning
                            }}
                        >
                            {/* User ID at the top inside the message box */}
                            <span
                                style={{
                                    display: 'block', // Ensures the ID takes its own line
                                    fontSize: '12px',
                                    color: '#555',
                                    fontStyle: 'italic',
                                    marginBottom: '5px', // Space between ID and message
                                }}
                            >
                                {userId === myUserId ? 'You' : userId}
                            </span>
                            {msg}
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        style={{
                            flex: 1,
                            marginRight: '10px',
                            padding: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                            borderRadius: '5px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: '#fff',
                            outline: 'none',
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            background: 'linear-gradient(to bottom right, #6a11cb, #2575fc)',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;
