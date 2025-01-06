import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001'); // Connect to the backend

function Chat() {
    const [messages, setMessages] = useState([]); // Store chat messages
    const [input, setInput] = useState(''); // Input field for new messages
    const [username, setUsername] = useState(null); // Store the username after setting
    const [usernameInput, setUsernameInput] = useState(''); // Input field for setting the username
    const [onlineUsers, setOnlineUsers] = useState(0); // Track the number of online users
    const userColors = useRef({}); // Persistent mapping of usernames to colors

    // Assign a unique color to each username
    const getUserColor = (username) => {
        if (!userColors.current[username]) {
            const hue = Math.floor(Math.random() * 360); // Generate a random hue
            userColors.current[username] = `hsl(${hue}, 70%, 80%)`; // Pastel color
        }
        return userColors.current[username];
    };

    useEffect(() => {
        // Set up WebSocket listeners
        socket.on('message', ({ username, msg }) => {
            if (typeof msg === 'string') {
                setMessages((prevMessages) => [...prevMessages, { username, msg }]); // Add new message
            } else {
                console.warn('Invalid message format received:', msg);
            }
        });

        socket.on('onlineUsers', (count) => {
            setOnlineUsers(count); // Update online user count
        });

        return () => {
            socket.off('message');
            socket.off('onlineUsers');
        };
    }, []);

    // Handle setting the username
    const setUsernameHandler = () => {
        if (usernameInput.trim()) {
            socket.emit('setUsername', usernameInput, (response) => {
                if (response.success) {
                    setUsername(usernameInput.trim()); // Save the username
                } else {
                    alert(response.error); // Display error if username is invalid
                }
            });
        }
    };

    // Handle sending a message
    const sendMessage = () => {
        if (input.trim() && username) {
            socket.emit('message', input); // Send the message
            setInput(''); // Clear the input field
        }
    };

    // Render username prompt if not set
    if (!username) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: 'linear-gradient(to bottom right, rgba(106, 17, 203, 0.8), rgba(37, 117, 252, 0.8))',
                }}
            >
                <h2 style={{ color: '#fff' }}>Choose a Username</h2>
                <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter your username"
                    style={{
                        padding: '10px',
                        margin: '10px 0',
                        borderRadius: '5px',
                        outline: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                    }}
                />
                <button
                    onClick={setUsernameHandler}
                    style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(to bottom right, #6a11cb, #2575fc)',
                        color: '#fff',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Set Username
                </button>
            </div>
        );
    }

    // Render chat interface if username is set
    return (
        <div
            className="chat-wrapper"
            style={{
                height: '100vh',
                background: 'linear-gradient(to bottom right, rgba(106, 17, 203, 0.8), rgba(37, 117, 252, 0.8))',
                backdropFilter: 'blur(10px)',
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
                    background: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h2 style={{ color: '#fff', textAlign: 'center' }}>Sup, {username}?</h2>
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
                    {messages.map(({ username, msg }, index) => (
                        <div
                            key={index}
                            style={{
                                margin: '10px 0',
                                padding: '10px',
                                borderRadius: '8px',
                                background: getUserColor(username),
                                color: '#000',
                            }}
                        >
                            <strong>{username}:</strong> {msg}
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
