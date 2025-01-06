import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import './Chat.css';

const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001');

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState(null);
    const [usernameInput, setUsernameInput] = useState('');
    const [onlineUsers, setOnlineUsers] = useState(0);
    const userColors = useRef({});

    const getUserColor = (username) => {
        if (!userColors.current[username]) {
            const hue = Math.floor(Math.random() * 360);
            userColors.current[username] = `hsl(${hue}, 70%, 80%)`;
        }
        return userColors.current[username];
    };

    useEffect(() => {
        socket.on('message', ({ username, msg }) => {
            if (typeof msg === 'string') {
                setMessages((prevMessages) => [...prevMessages, { username, msg }]);
            } else {
                console.warn('Invalid message format received:', msg);
            }
        });

        socket.on('onlineUsers', (count) => {
            setOnlineUsers(count);
        });

        return () => {
            socket.off('message');
            socket.off('onlineUsers');
        };
    }, []);

    const setUsernameHandler = () => {
        if (usernameInput.trim()) {
            socket.emit('setUsername', usernameInput, (response) => {
                if (response.success) {
                    setUsername(usernameInput.trim());
                } else {
                    alert(response.error);
                }
            });
        }
    };

    const sendMessage = () => {
        if (input.trim() && username) {
            socket.emit('message', input);
            setInput('');
        }
    };

    if (!username) {
        return (
            <div className="username-prompt">
                <h2 className="username-header">Choose a Username</h2>
                <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter your username"
                    className="username-input"
                />
                <button onClick={setUsernameHandler} className="username-button">
                    Set Username
                </button>
            </div>
        );
    }

    return (
        <div className="chat-wrapper">
            <div className="chat-container">
                <h2 className="chat-header">Sup, {username}?</h2>
                <p className="chat-users-online">
                    Users online: <strong>{onlineUsers}</strong>
                </p>
                <div className="chat-messages">
                    {messages.map(({ username, msg }, index) => (
                        <div
                            key={index}
                            className="chat-message"
                            style={{ background: getUserColor(username) }}
                        >
                            <strong>{username}:</strong> {msg}
                        </div>
                    ))}
                </div>
                <div className="chat-input-wrapper">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="chat-input"
                    />
                    <button onClick={sendMessage} className="chat-button">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;