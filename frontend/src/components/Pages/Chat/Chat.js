import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001'); // Update the URL to match your backend

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        socket.on('message', (msg) => {
            console.log('Message received:', msg); // Debugging line
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => socket.off('message'); // Clean up the listener on unmount
    }, []);


    const sendMessage = () => {
        if (input.trim()) {
            socket.emit('message', input); // Send message to server
            setInput(''); // Clear input field
        }
    };

    return (
        <div className='chat-wrapper' style={{ height: '100vh' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>Sup</h3>
                <div
                    style={{
                        maxHeight: '300px',
                        overflowY: 'scroll',
                        border: '1px solid #ccc',
                        padding: '10px',
                        marginBottom: '10px',
                    }}
                >
                    {messages.map((msg, index) => (
                        <div key={index} style={{ margin: '5px 0', padding: '5px', background: '#f1f1f1', borderRadius: '5px' }}>
                            {msg}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    style={{ width: 'calc(100% - 80px)', marginRight: '10px', padding: '5px' }}
                />
                <button onClick={sendMessage} style={{ padding: '5px 10px' }}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chat;
