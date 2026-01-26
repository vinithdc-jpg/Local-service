"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Send } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ChatContent() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "worker", text: "Hi, how can I help you?" },
    { id: 2, sender: "me", text: "I need a service today." },
  ]);

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "me", text: input },
    ]);

    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-secondary">

      {/* Header */}
      <div className="p-4 border-b bg-card">
        <h2 className="font-semibold text-primary">Chat with Worker</h2>
        <p className="text-xs text-muted-foreground">Online</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[70%] text-sm ${msg.sender === "me"
                ? "bg-primary text-primary-foreground"
                : "bg-card border"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="p-3 border-t bg-card flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border focus:outline-none"
        />
        <button
          type="submit"
          className="p-2 bg-primary text-primary-foreground rounded-full"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export default function Chatbox() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <ChatContent />
      </Suspense>
      <Footer />
    </main>
  );
}
