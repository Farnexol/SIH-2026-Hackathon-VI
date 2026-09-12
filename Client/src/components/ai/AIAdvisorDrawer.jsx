import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, ArrowRight, BookOpen, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import { Link } from 'react-router-dom';

export default function AIAdvisorDrawer() {
  const { isAiAdvisorOpen, closeAiAdvisor } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello Rahul. I am your **Samarth AI Learning Advisor**, calibrated to the *Official Statistical System Framework (OSSF)*.\n\nYour highest priority competency gap is **Python for Data Analysis (38% vs 80% required)**. How can I assist your capacity building today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "What should I learn next?",
    "Why is Python my highest priority?",
    "Explain my competency gaps.",
    "Generate a learning plan.",
    "Recommend resources for Data Visualization."
  ];

  useEffect(() => {
    if (isAiAdvisorOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiAdvisorOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await api.askAiAdvisor(text);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: res.response,
          timestamp: res.timestamp
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'I apologize, but I encountered an error retrieving statistical advisor recommendations. Please try again.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAiAdvisorOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={closeAiAdvisor}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
                  Samarth AI Advisor
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">v1.2</span>
                </h3>
                <p className="text-[11px] text-slate-300">Competency & Curriculum Optimization</p>
              </div>
            </div>
            <button
              onClick={closeAiAdvisor}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prompt suggestions */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Quick Inquiries
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="text-left text-[11px] bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-md transition-colors shadow-2xs disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line prose-xs">
                    {msg.text}
                  </div>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 items-center text-xs text-slate-500">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-500 italic shadow-2xs">
                  Analyzing competency matrices & survey standards...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Navigation Footer */}
          <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center justify-between text-xs">
            <Link
              to="/learning-path"
              onClick={closeAiAdvisor}
              className="text-blue-700 font-medium hover:underline inline-flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              Open Learning Path
            </Link>
            <Link
              to="/courses"
              onClick={closeAiAdvisor}
              className="text-slate-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Browse Courses
            </Link>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your competencies, courses, or gaps..."
                disabled={loading}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2 rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
