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
    <div className="flex flex-col flex-1 overflow-hidden bg-background">

      {/* Header */}
      <div className="border-b bg-card px-5 py-4 flex items-center gap-3 shadow-sm">

        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
          👨‍🔧
        </div>

        <div>
          <h2 className="font-semibold text-lg">
            Worker Name
          </h2>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Online
          </div>
        </div>

      </div>


      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {messages.map((msg) => (

          <div
            key={msg.id}
            className={`flex ${msg.sender === "me"
                ? "justify-end"
                : "justify-start"
              }`}
          >

            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm

            ${msg.sender === "me"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border rounded-bl-md"
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
        className="border-t bg-card p-4"
      >

        <div className="flex items-center gap-3">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."

            className="
          flex-1
          h-12
          rounded-full
          border
          px-5
          bg-background
          focus:outline-none
          focus:ring-2
          focus:ring-primary/30
          "
          />

          <button
            type="submit"
            className="
          h-12
          w-12
          rounded-full
          bg-primary
          text-white
          flex
          items-center
          justify-center
          hover:scale-105
          transition
          "
          >
            <Send size={18} />

          </button>

        </div>

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
