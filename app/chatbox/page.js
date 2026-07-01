"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import { PageLoader } from "../components/ui/Skeleton";

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-end gap-2">
        <Avatar name="Worker" size="sm" />
        <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-muted-foreground"
              style={{
                animation: "typing-dot 1.4s infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatContent() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "worker",
      text: "Hi there! 👋 How can I help you today?",
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: 2,
      sender: "me",
      text: "I need a service today. Are you available?",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: 3,
      sender: "worker",
      text: "Absolutely! I have openings this afternoon. What service are you looking for?",
      timestamp: new Date(Date.now() - 30000),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsSending(true);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "worker",
            text: "Thanks for your message! I'll get back to you shortly with availability.",
            timestamp: new Date(),
          },
        ]);
        setIsSending(false);
      }, 2000);
    }, 500);
  };

  return (
    <div className="flex flex-col flex-1 max-h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Chat Header */}
      <div className="glass-strong border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Avatar name="Alex Johnson" size="md" online />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base">Alex Johnson</h2>
              <Badge variant="success" className="text-[10px] px-2">Pro</Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Online now
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[Phone, Video, MoreVertical].map((Icon, i) => (
            <button
              key={i}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Chat action"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4"
      >
        <div className="text-center mb-6">
          <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            Today
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.sender === "me";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && <Avatar name="Alex Johnson" size="sm" />}

                <div className={`max-w-[75%] sm:max-w-[60%] ${isMe ? "order-first" : ""}`}>
                  <div
                    className={`px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? "gradient-bg text-white rounded-2xl rounded-br-md"
                        : "bg-secondary text-foreground rounded-2xl rounded-bl-md border border-border/50"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p
                    className={`text-[10px] text-muted-foreground mt-1 px-1 ${
                      isMe ? "text-right" : "text-left"
                    }`}
                  >
                    {format(msg.timestamp, "h:mm a")}
                  </p>
                </div>

                {isMe && <Avatar name="You" size="sm" />}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Sticky Input */}
      <form
        onSubmit={sendMessage}
        className="glass-strong border-t border-border p-4 shrink-0"
      >
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <button
            type="button"
            className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="w-full h-12 rounded-2xl border border-input bg-background/80 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all placeholder:text-muted-foreground"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Add emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="h-12 w-12 rounded-2xl gradient-bg text-white flex items-center justify-center shrink-0 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none shadow-md"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
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
      <Suspense fallback={<PageLoader message="Loading chat..." />}>
        <ChatContent />
      </Suspense>
    </main>
  );
}
