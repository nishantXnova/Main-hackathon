import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Namaste! 🙏 I am your Nepal AI Guide. How can I help you explore the beauty of Nepal today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;
            if (!apiKey || apiKey === 'your_openrouter_key_here') {
                throw new Error('OpenRouter API Key not configured in .env file');
            }

            // Construct history for OpenRouter (OpenAI format)
            const chatHistory = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.text
            }));

            // Add current message
            chatHistory.push({ role: 'user', content: userMessage });

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "z-ai/glm-4.5-air:free",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a helpful and knowledgeable Nepal Tourism expert. You provide detailed, friendly information about Nepal's culture, trekking, geography, and festivals. Keep responses concise and modern. Use emojis where appropriate. Do not mention that you are a language model."
                        },
                        ...chatHistory
                    ]
                })
            });

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content;

            if (text) {
                setMessages(prev => [...prev, { role: 'assistant', text: text }]);
            } else {
                throw new Error(data.error?.message || 'Empty response from AI');
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', text: `Sorry, I am having trouble: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
            <button
                className="chatbot-fab"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle chat"
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>Nepal AI Guide</h3>
                        <p>Always online</p>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                <div className="message-content">{msg.text}</div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message assistant loading">
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Ask anything about Nepal..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}>
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
