"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { MoreHorizontal } from "lucide-react";
import {
    Search,
    Phone,
    Video,
    MoreVertical,
    Send,
    Paperclip,
    ArrowLeft,
    Smile,
    Image as ImageIcon,
    Mic,
    MapPin,
    Star,
    Mail,
    X
} from 'lucide-react'

// Mock Data for Contacts - Aligned with WorkerProfiles
const INITIAL_CONTACTS = [
    {
        id: 1,
        name: 'Alex Johnson',
        role: 'Professional Barber',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        status: 'online',
        lastMessage: 'I can help you with that haircut!',
        time: '10:30 AM',
        unread: 2,
        rating: 4.9,
        reviews: 128,
        location: 'Downtown Area',
        specialties: ['Haircuts', 'Beard Trims', 'Styling']
    },
    {
        id: 2,
        name: 'Sarah Smith',
        role: 'Master Plumber',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        status: 'online',
        lastMessage: 'I can be there by 2 PM.',
        time: 'Yesterday',
        unread: 0,
        rating: 5.0,
        reviews: 84,
        location: 'Westside',
        specialties: ['Repairs', 'Installations', 'Emergency']
    },
    {
        id: 3,
        name: 'Michael Chen',
        role: 'Business Consultant',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        status: 'away',
        lastMessage: 'Let me review your business plan.',
        time: 'Yesterday',
        unread: 0,
        rating: 4.8,
        reviews: 56,
        location: 'Remote / Hybrid',
        specialties: ['Strategy', 'Finance', 'Growth']
    },
    {
        id: 4,
        name: 'Emily Davis',
        role: 'Interior Designer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        status: 'online',
        lastMessage: 'I love the color palette you chose!',
        time: 'Mon',
        unread: 1,
        rating: 4.9,
        reviews: 92,
        location: 'North Hills',
        specialties: ['Residential', 'Commercial', 'Color Theory']
    },
]

// Mock Data for Messages
const MOCK_MESSAGES = {
    1: [
        { id: 1, senderId: 1, text: 'Hi, I saw your request for a plumbing job.', time: '10:00 AM' },
        { id: 2, senderId: 'me', text: 'Yes, looking for someone effectively immediately.', time: '10:05 AM' },
        { id: 3, senderId: 1, text: 'I can be there by 2 PM.', time: '10:30 AM' },
    ],
    2: [
        { id: 1, senderId: 'me', text: 'Can you check the main breaker?', time: 'Yesterday' },
        { id: 2, senderId: 2, text: 'The wiring needs to be replaced.', time: 'Yesterday' },
    ],
    3: [],
    4: [],
}

const Chatbox = () => {
    const searchParams = useSearchParams()
    const workerId = searchParams.get('workerId')

    const [activeChat, setActiveChat] = useState(null)
    const [contacts, setContacts] = useState(INITIAL_CONTACTS)
    const [messages, setMessages] = useState(MOCK_MESSAGES)
    const [inputText, setInputText] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [showWorkerDetails, setShowWorkerDetails] = useState(false)
    const messagesEndRef = useRef(null)

    // Auto-select worker based on URL parameter
    useEffect(() => {
        if (workerId) {
            const worker = contacts.find(c => c.id === parseInt(workerId))
            if (worker) {
                setActiveChat(worker)
                setShowWorkerDetails(true)
            }
        }
    }, [workerId, contacts])

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, activeChat])

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!inputText.trim() || !activeChat) return

        const newMessage = {
            id: Date.now(),
            senderId: 'me',
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        setMessages((prev) => ({
            ...prev,
            [activeChat.id]: [...(prev[activeChat.id] || []), newMessage],
        }))

        // Update last message in contact list
        setContacts((prev) =>
            prev.map((contact) =>
                contact.id === activeChat.id
                    ? { ...contact, lastMessage: inputText, time: 'Now' }
                    : contact
            )
        )

        setInputText('')
    }

    const filteredContacts = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.role.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex h-[calc(100vh-64px)] bg-secondary overflow-hidden">
            {/* Sidebar - Contact List */}
            <div
                className={`${activeChat ? 'hidden md:flex' : 'flex'
                    } w-full md:w-80 lg:w-96 flex-col border-r border-border bg-card`}
            >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-border">
                    <h1 className="text-xl font-bold text-primary mb-4">Messages</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-9 pr-4 py-2 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Contact List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredContacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => setActiveChat(contact)}
                            className={`p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-secondary/50 ${activeChat?.id === contact.id ? 'bg-secondary' : ''
                                }`}
                        >
                            <div className="relative">
                                <img
                                    src={contact.avatar}
                                    alt={contact.name}
                                    className="w-12 h-12 rounded-full object-cover border border-border"
                                />
                                <span
                                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${contact.status === 'online'
                                        ? 'bg-green-500'
                                        : contact.status === 'away'
                                            ? 'bg-yellow-500'
                                            : 'bg-gray-400'
                                        }`}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold text-primary truncate">
                                        {contact.name}
                                    </h3>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                        {contact.time}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-muted-foreground truncate pr-2">
                                        {contact.lastMessage}
                                    </p>
                                    {contact.unread > 0 && (
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                                            {contact.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div
                className={`${activeChat ? 'flex' : 'hidden md:flex'
                    } flex-1 flex-col bg-secondary/30`}
            >
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-card border-b border-border flex items-center justify-between shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveChat(null)}
                                    className="md:hidden p-2 hover:bg-secondary rounded-full -ml-2"
                                >
                                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                                </button>
                                <div className="relative cursor-pointer" onClick={() => setShowWorkerDetails(!showWorkerDetails)}>
                                    <img
                                        src={activeChat.avatar}
                                        alt={activeChat.name}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                                    />
                                    {activeChat.status === 'online' && (
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card"></span>
                                    )}
                                </div>
                                <div className="cursor-pointer" onClick={() => setShowWorkerDetails(!showWorkerDetails)}>
                                    <h2 className="font-semibold text-primary">
                                        {activeChat.name}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        {activeChat.role} • {activeChat.status === 'online' ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-primary transition-colors">
                                    <Phone className="h-5 w-5" />
                                </button>
                                <button className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-primary transition-colors">
                                    <Video className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setShowWorkerDetails(!showWorkerDetails)}
                                    className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Worker Details Panel */}
                        {showWorkerDetails && (
                            <div className="bg-card border-b border-border p-6 animate-in slide-in-from-top duration-300">
                                <div className="max-w-4xl mx-auto">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={activeChat.avatar}
                                                alt={activeChat.name}
                                                className="w-20 h-20 rounded-full border-4 border-primary/10 object-cover"
                                            />
                                            <div>
                                                <h3 className="text-2xl font-bold text-primary mb-1">{activeChat.name}</h3>
                                                <p className="text-muted-foreground font-medium">{activeChat.role}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowWorkerDetails(false)}
                                            className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Rating */}
                                        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                                            <Star className="w-5 h-5 text-amber-500 fill-current" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Rating</p>
                                                <p className="font-semibold text-primary">{activeChat.rating} ({activeChat.reviews} reviews)</p>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Location</p>
                                                <p className="font-semibold text-primary">{activeChat.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Specialties */}
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground mb-2">Specialties</p>
                                        <div className="flex flex-wrap gap-2">
                                            {activeChat.specialties?.map((spec, i) => (
                                                <span key={i} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Contact Actions */}
                                    <div className="flex gap-3 mt-6">
                                        <button className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2">
                                            <Phone className="w-4 h-4" /> Call Now
                                        </button>
                                        <button className="flex-1 bg-accent text-accent-foreground py-2 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2">
                                            <Mail className="w-4 h-4" /> Send Email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="flex justify-center my-4">
                                <span className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
                                    Today
                                </span>
                            </div>

                            {messages[activeChat.id]?.map((msg) => {
                                const isMe = msg.senderId === 'me'
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[75%] md:max-w-[60%] px-4 py-3 rounded-2xl shadow-sm ${isMe
                                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                                : 'bg-card text-card-foreground border border-border rounded-bl-none'
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                            <span
                                                className={`text-[10px] mt-1 block text-right opacity-70 ${isMe ? 'text-primary-foreground' : 'text-muted-foreground'
                                                    }`}
                                            >
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-card border-t border-border">
                            <form
                                onSubmit={handleSendMessage}
                                className="flex items-center gap-2 bg-secondary/50 p-1.5 rounded-full border border-border focus-within:ring-2 focus-within:ring-primary/10 transition-all"
                            >
                                <button
                                    type="button"
                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-colors"
                                >
                                    <Paperclip className="h-5 w-5" />
                                </button>
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none focus:outline-none px-2 text-sm text-foreground placeholder:text-muted-foreground"
                                />
                                <button
                                    type="button"
                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-colors"
                                >
                                    <Smile className="h-5 w-5" />
                                </button>
                                {inputText.trim() ? (
                                    <button
                                        type="submit"
                                        className="p-2 bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
                                    >
                                        <Send className="h-4 w-4 ml-0.5" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-colors"
                                    >
                                        <Mic className="h-5 w-5" />
                                    </button>
                                )}
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-secondary/30">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                            <MoreHorizontal className="h-10 w-10 opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">
                            Select a conversation
                        </h3>
                        <p className="max-w-xs mx-auto">
                            Choose a contact from the sidebar to start chatting or video calling.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Chatbox