"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
};

export function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello Safian! I'm your AI Business Manager. How can I help you optimize your store today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await api.post("/seller/{seller_id}/chat", {
                message: userMsg.content,
                history: messages.map(m => ({ role: m.role, content: m.content }))
            });

            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: res.data.message,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: "error",
                    role: "assistant",
                    content: "Sorry, I lost connection to the neural core. Please try again.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {isOpen ? (
                <Card className="w-[420px] h-[min(650px,calc(100vh-80px))] flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-8 zoom-in-95 duration-500 border-border bg-bg-surface overflow-hidden rounded-[32px] ring-1 ring-white/5">

                    {/* Header */}
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 p-4 bg-[#0a0f0d]/95 backdrop-blur-2xl relative shrink-0 z-10">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <CardTitle className="text-xs font-heading font-black flex items-center gap-3 text-white uppercase tracking-[0.2em] italic">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-primary-glow">
                                <Bot className="w-4 h-4 text-primary" />
                            </div>
                            <span>Tijarat<span className="text-primary not-italic">AI</span> Core</span>
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all border border-white/5 hover:border-white/20"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </CardHeader>


                    {/* Messages Area */}
                    <CardContent
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20"
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex flex-col gap-2 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                                    msg.role === "user" ? "ml-auto items-end" : "items-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "p-4 rounded-[22px] text-[13px] leading-relaxed shadow-lg border",
                                        msg.role === "user"
                                            ? "bg-primary text-black font-bold border-primary shadow-primary-glow/10 rounded-tr-none"
                                            : "bg-bg-elevated border-border text-text-primary font-medium rounded-tl-none"
                                    )}
                                >
                                    {msg.content}
                                    {msg.role === "assistant" && msg.content.includes("?") && (
                                        <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-primary font-black uppercase tracking-widest opacity-70">
                                            Neural Suggestion Received
                                        </div>
                                    )}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-50 px-2 flex items-center gap-1">
                                    {msg.role === "assistant" ? <Bot className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex flex-col gap-2 max-w-[85%] items-start animate-pulse">
                                <div className="bg-bg-elevated border border-border p-4 rounded-[22px] rounded-tl-none">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    {/* Footer / Input */}
                    <CardFooter className="p-5 border-t border-border bg-bg-base/80 backdrop-blur-xl">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex w-full gap-3 relative"
                        >
                            <input
                                autoFocus
                                className="flex-1 bg-bg-base border border-border rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none text-text-primary placeholder:text-text-muted transition-all font-medium"
                                placeholder="Command the AI Core..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="w-14 h-14 bg-primary text-black hover:bg-primary/90 rounded-2xl shadow-primary-glow/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                disabled={!input.trim() || isLoading}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            ) : (
                <div className="relative group">
                    <div className="absolute -inset-1 bg-primary rounded-full blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse" />
                    <Button
                        size="icon"
                        className="w-16 h-16 rounded-full shadow-primary-glow bg-primary text-black hover:bg-primary/90 hover:scale-110 transition-all duration-500 ring-4 ring-primary/10 relative"
                        onClick={() => setIsOpen(true)}
                    >
                        <Bot className="w-8 h-8" />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-black border-2 border-primary rounded-full flex items-center justify-center">
                            <Zap className="w-2.5 h-2.5 text-primary fill-primary" />
                        </div>
                    </Button>
                </div>
            )}
        </div>
    );
}
