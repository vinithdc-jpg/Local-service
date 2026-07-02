"use client";

import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import { PageLoader } from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext";

function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function buildUserId(user) {
  if (user?._id) return String(user._id);
  if (typeof window === "undefined") return "guest";
  const key = "chat-guest-id";
  let guestId = sessionStorage.getItem(key);
  if (!guestId) {
    guestId = `guest-${Date.now()}`;
    sessionStorage.setItem(key, guestId);
  }
  return guestId;
}

function buildUserName(user) {
  return user?.username || user?.displayName || "You";
}

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
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const workerId = searchParams.get("workerId");
  const roomId = workerId ? `chat-${workerId}` : searchParams.get("room") || "service-room";

  const [worker, setWorker] = useState(null);
  const [workerLoading, setWorkerLoading] = useState(!!workerId);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [chatError, setChatError] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const currentUserRef = useRef({ id: "guest", name: "You", role: "client" });
  const typingTimeoutRef = useRef(null);

  const activeUser = user || getStoredUser();
  const currentUserId = buildUserId(activeUser);
  const currentUserName = buildUserName(activeUser);
  const workerName = worker?.displayName || "Service Pro";
  const workerImage = worker?.image || null;

  currentUserRef.current = {
    id: currentUserId,
    name: currentUserName,
    role: activeUser?.role || "client",
  };

  // Fetch worker profile for the chat header
  useEffect(() => {
    if (!workerId) {
      setWorkerLoading(false);
      return;
    }

    let cancelled = false;

    async function loadWorker() {
      setWorkerLoading(true);
      setChatError("");
      try {
        const res = await fetch(`/api/createpro/${workerId}`);
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok || !data.worker) {
          setChatError("Could not load this professional. You can still chat in the general room.");
          return;
        }

        setWorker(data.worker);
        setMessages([
          {
            id: "welcome",
            senderId: "system",
            senderName: "System",
            text: `You started a conversation with ${data.worker.displayName}. Say hello!`,
            timestamp: new Date(),
            isSystem: true,
          },
        ]);
      } catch {
        if (!cancelled) {
          setChatError("Could not load worker details.");
        }
      } finally {
        if (!cancelled) setWorkerLoading(false);
      }
    }

    loadWorker();
    return () => {
      cancelled = true;
    };
  }, [workerId]);

  // Default welcome when no workerId
  useEffect(() => {
    if (workerId || messages.length > 0) return;
    setMessages([
      {
        id: "welcome-general",
        senderId: "system",
        senderName: "System",
        text: "Welcome to ServicePro live chat. How can we help you today?",
        timestamp: new Date(),
        isSystem: true,
      },
    ]);
  }, [workerId, messages.length]);

  // Socket connection
  useEffect(() => {
    if (authLoading || workerLoading) return undefined;

    const socket = io({
      path: "/socket.io",
      transports: ["websocket", "polling"],
      reconnection: true,
    });
    socketRef.current = socket;

    const joinRoom = () => {
      const { id, name, role } = currentUserRef.current;
      socket.emit("join-room", { roomId, userId: id, username: name, role });
    };

    socket.on("connect", () => {
      setSocketConnected(true);
      setChatError("");
      joinRoom();
    });

    socket.on("disconnect", () => setSocketConnected(false));

    socket.on("connect_error", () => {
      setSocketConnected(false);
      setChatError("Unable to connect to chat. Please refresh and try again.");
    });

    socket.on("receive-message", (payload) => {
      if (!payload?.text) return;

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === payload.id);
        if (exists) return prev;

        return [
          ...prev,
          {
            id: payload.id || `${payload.senderId}-${Date.now()}`,
            senderId: payload.senderId,
            senderName: payload.senderName,
            text: payload.text,
            timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
            isSystem: payload.senderId === "system",
          },
        ];
      });
      setIsTyping(false);
    });

    socket.on("typing", ({ userId, isTyping: typing }) => {
      if (userId !== currentUserRef.current.id) {
        setIsTyping(typing);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authLoading, workerLoading, roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    (e) => {
      e.preventDefault();
      const text = input.trim();
      const socket = socketRef.current;
      if (!text || isSending || !socket?.connected) return;

      const { id, name } = currentUserRef.current;
      const messageId = `${id}-${Date.now()}`;
      const timestamp = new Date();

      const outgoingMessage = {
        id: messageId,
        senderId: id,
        senderName: name,
        text,
        timestamp,
      };

      setMessages((prev) => [...prev, outgoingMessage]);
      socket.emit("send-message", {
        id: messageId,
        roomId,
        senderId: id,
        senderName: name,
        text,
        timestamp,
      });

      setInput("");
      setIsSending(true);
      setTimeout(() => setIsSending(false), 300);

      socket.emit("typing", { roomId, userId: id, isTyping: false });
    },
    [input, isSending, roomId]
  );

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInput(value);

    const socket = socketRef.current;
    if (!socket?.connected) return;

    const { id } = currentUserRef.current;
    socket.emit("typing", { roomId, userId: id, isTyping: value.length > 0 });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { roomId, userId: id, isTyping: false });
    }, 1500);
  };

  if (authLoading || workerLoading) {
    return <PageLoader message="Loading chat..." />;
  }

  return (
    <div className="flex flex-col flex-1 max-h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <div className="glass-strong border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Avatar src={workerImage} name={workerName} size="md" online={socketConnected} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base">{workerName}</h2>
              {worker?.role && (
                <Badge variant="success" className="text-[10px] px-2">
                  {worker.role}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  socketConnected ? "bg-success animate-pulse" : "bg-muted-foreground"
                }`}
              />
              {socketConnected ? "Online now" : "Connecting..."}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[Phone, Video, MoreVertical].map((Icon, i) => (
            <button
              key={i}
              type="button"
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Chat action"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {chatError && (
        <div className="px-4 py-2 text-sm text-destructive bg-destructive/10 border-b border-destructive/20">
          {chatError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="text-center mb-6">
          <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            {workerId ? `Chat with ${workerName}` : "Live support"}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            if (msg.isSystem || msg.senderId === "system") {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <span className="text-xs text-muted-foreground bg-secondary/80 px-3 py-1.5 rounded-full">
                    {msg.text}
                  </span>
                </motion.div>
              );
            }

            const isMe = msg.senderId === currentUserId;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && (
                  <Avatar
                    src={msg.senderId === workerId ? workerImage : null}
                    name={msg.senderName || workerName}
                    size="sm"
                  />
                )}

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

                {isMe && <Avatar name={currentUserName} size="sm" />}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && <TypingIndicator name={workerName} />}
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
              placeholder={socketConnected ? "Type a message..." : "Connecting..."}
              disabled={!socketConnected}
              className="w-full h-12 rounded-2xl border border-input bg-background/80 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all placeholder:text-muted-foreground disabled:opacity-60"
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
            disabled={!input.trim() || isSending || !socketConnected}
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
