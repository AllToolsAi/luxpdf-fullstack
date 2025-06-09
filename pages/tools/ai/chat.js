'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import { FiSend, FiRefreshCw } from 'react-icons/fi';

export default function ChatAI() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! How can I help you today?' },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Memoized response generation
    const generateResponse = useCallback(() => {
        const responses = [
            "I'm an AI assistant here to help with your questions.",
            "That's an interesting question. Let me think about that...",
            "I can provide information on various topics. What would you like to know?",
            "Would you like me to elaborate on that point?",
            "I'm designed to assist with information and problem-solving.",
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 800));

        const botMessage = {
            role: 'assistant',
            content: generateResponse(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    }, [input, isLoading, generateResponse]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }, [handleSubmit]);

    // Auto-focus input and scroll to bottom
    useEffect(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Clear chat function
    const clearChat = useCallback(() => {
        setMessages([{ role: 'assistant', content: 'Hello! How can I help you today?' }]);
        inputRef.current?.focus();
    }, []);

    return (
        <Layout>
            <SEO
                title="AI Chat Assistant | DeepSeek Chat"
                description="Chat with our AI assistant for instant help and answers. Clean, fast and privacy-focused chat interface."
                keywords="AI chat assistant, DeepSeek chat, online chatbot, AI help"
            />

            <section className="flex flex-col h-[calc(100vh-140px)] bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col px-4 py-6">
                    {/* Header */}
                    <header className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                            DeepSeek Chat
                        </h1>
                        <button
                            onClick={clearChat}
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                        >
                            <FiRefreshCw size={16} />
                            Clear Chat
                        </button>
                    </header>

                    {/* Chat Container */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-lg px-4 py-3 ${
                                            msg.role === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg rounded-bl-none px-4 py-3">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                            <form onSubmit={handleSubmit} className="flex items-end gap-2">
                                <div className="flex-1 relative">
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Message DeepSeek Chat..."
                                        className="w-full min-h-[50px] max-h-[200px] px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                        disabled={isLoading}
                                        rows={1}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className={`p-3 rounded-lg ${isLoading || !input.trim() ? 'text-gray-400 dark:text-gray-500' : 'text-white bg-blue-600 hover:bg-blue-700'} transition-colors`}
                                >
                                    <FiSend size={20} />
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                DeepSeek Chat can make mistakes. Consider checking important information.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}