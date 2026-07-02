"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import { PageLoader } from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext";

function TypingIndicator({ name }) {
  return (
    <div className="flex justify-start">
      <div className="flex items-end gap-2">
        <Avatar name={name} size="sm" />
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
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: "worker-1",
      senderName: "Alex Johnson",
      text: "Hi there! 👋 I’m online and ready to help you today.",
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: 2,
      senderId: "guest",
      senderName: "You",
      text: "I need a service today. Are you available?",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [roomId, setRoomId] = useState("service-room");
  const [currentUser, setCurrentUser] = useState({ id: "guest", name: "You", role: "client" });
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const room = searchParams.get("room") || "service-room";
    setRoomId(room);

    const savedUser = JSON.parse(typeof window !== "undefined" ? localStorage.getItem("user") || "null" : "null");
    const activeUser = user || savedUser;
    const nextUser = {
      id: activeUser?._id || `guest-${Date.now()}`,
      name: activeUser?.username || activeUser?.displayName || "You",
      role: activeUser?.role || "client",
    };

    setCurrentUser(nextUser);
  }, [user]);

  useEffect(() => {
    if (!roomId) return undefined;

    const socket = io(window.location.origin, {
      transports: ["websocket"],
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("join-room", {
        roomId,
        userId: currentUser.id,
        username: currentUser.name,
        role: currentUser.role,
      });
    });

    socket.on("disconnect", () => setSocketConnected(false));

    socket.on("receive-message", (payload) => {
      setMessages((prev) => [
        ...prev,
        {
          id: payload.id || `${payload.senderId}-${Date.now()}`,
          senderId: payload.senderId,
          senderName: payload.senderName,
          text: payload.text,
          timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
        },
      ]);
      setIsTyping(false);
    });

    socket.on("typing", ({ userId, isTyping: typing }) => {
      if (userId !== currentUser.id) {
        setIsTyping(typing);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, currentUser.id, currentUser.name, currentUser.role]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending || !socketRef.current) return;

    const outgoingMessage = {
      id: `${currentUser.id}-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, outgoingMessage]);
    socketRef.current.emit("send-message", {
      roomId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: outgoingMessage.timestamp,
    });
    setInput("");
    setIsSending(true);
    setTimeout(() => setIsSending(false), 400);
    socketRef.current.emit("typing", { roomId, userId: currentUser.id, isTyping: false });
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);

    if (socketRef.current) {
      socketRef.current.emit("typing", {
        roomId,
        userId: currentUser.id,
        isTyping: event.target.value.length > 0,
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 max-h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <div className="glass-strong border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Avatar name="Alex Johnson" size="md" online />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base">Alex Johnson</h2>
              <Badge variant="success" className="text-[10px] px-2">Pro</Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`w-1.5 h-1.5 rounded-full ${socketConnected ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
              {socketConnected ? "Online now" : "Connecting..."}
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

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="text-center mb-6">
          <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            Live chat • Room {roomId}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id || msg.sender === "me";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && <Avatar name={msg.senderName || "Alex Johnson"} size="sm" />}

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

                {isMe && <Avatar name={currentUser.name} size="sm" />}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && <TypingIndicator name="Alex Johnson" />}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="glass-strong border-t border-border p-4 shrink-0">
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
              onChange={handleInputChange}
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
