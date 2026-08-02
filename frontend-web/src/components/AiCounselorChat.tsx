"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface AiCounselorChatProps {
  contextString: string;
  token: string;
}

export function AiCounselorChat({ contextString, token }: AiCounselorChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Halo! Saya AI Counselor (Groq LLaMA-3).\nAda yang ingin didiskusikan tentang perkembangan belajarmu?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 detik timeout

      const response = await fetch("http://localhost:3000/analytics/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMsg,
          context: contextString
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Gagal merespons");
      const resData = await response.json();
      
      // Handle NextJS/NestJS standard interceptor wrapper { data: { reply: "..." } } or raw { reply: "..." }
      const replyText = resData.data?.reply || resData.reply;
      
      setMessages(prev => [...prev, { role: "ai", content: replyText }]);
    } catch (error: any) {
      console.error(error);
      if (error.name === 'AbortError') {
        setMessages(prev => [...prev, { role: "ai", content: "Maaf, koneksi ke server AI terputus (Timeout). Silakan coba lagi." }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", content: "Maaf, sistem AI sedang sibuk. Silakan coba lagi nanti." }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const triggerButton = (
    <button
      onClick={() => setIsOpen(true)}
      className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2 transition-all duration-200"
    >
      <Sparkles className="w-4 h-4" />
      <span className="text-sm font-semibold hidden sm:inline">Ask AI</span>
    </button>
  );

  let portalTarget = null;
  if (mounted && typeof document !== 'undefined') {
    portalTarget = document.getElementById("ai-chat-portal-target");
  }

  return (
    <>
      {portalTarget && createPortal(triggerButton, portalTarget)}

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Side Drawer */}
          <div className="relative w-full max-w-md h-full bg-white dark:bg-zinc-950 border-l border-gray-200 dark:border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">AI Counselor</h3>
                  <p className="text-blue-100 text-xs">Powered by Groq LLaMA-3</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/70 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gradient-to-b from-gray-50 to-transparent dark:from-zinc-900/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-sm" 
                      : "bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 rounded-2xl rounded-tl-sm px-5 py-4 text-sm flex gap-1.5 items-center shadow-sm">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-white/10">
              <div className="flex items-end gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-transparent transition-all shadow-sm dark:shadow-none">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Tanya soal prediksimu..."
                  className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none px-3 py-2.5 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none scrollbar-thin"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-3 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 mb-0.5 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-400 dark:text-zinc-500 mt-3 font-medium">AI can make mistakes. Consider verifying important information.</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
