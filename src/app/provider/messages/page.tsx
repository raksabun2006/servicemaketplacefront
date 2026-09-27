"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { chatApi } from "@/lib/api/chat.api";
import { ConversationResponse, ChatMessageResponse } from "@/types/chat";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  MessageSquare,
  Send,
  Loader2,
  User,
  ArrowLeft,
  Search,
} from "lucide-react";

export default function ProviderMessagesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Manage in-mobile-chat body class to hide MobileNavigation while in chat thread
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile && mobileView === "chat" && activeConversation) {
      document.body.classList.add("in-mobile-chat");
    } else {
      document.body.classList.remove("in-mobile-chat");
    }

    return () => {
      document.body.classList.remove("in-mobile-chat");
    };
  }, [mobileView, activeConversation]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await chatApi.getConversations(0, 50);
      const list = res.content || [];
      setConversations(list);

      // On desktop, auto-select first conversation if none selected
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        if (!activeConversation && list.length > 0) {
          setActiveConversation(list[0]);
        }
      }
    } catch {
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, [activeConversation]);

  const fetchMessages = useCallback(async (convId: string) => {
    try {
      setLoadingMessages(true);
      const res = await chatApi.getMessages(convId, 0, 50);
      setMessages([...(res.content || [])].reverse());
      chatApi.markAsRead(convId).catch(() => {});
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
      const interval = setInterval(() => {
        chatApi.getMessages(activeConversation.id, 0, 50).then((res) => {
          setMessages([...(res.content || [])].reverse());
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeConversation, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = (conv: ConversationResponse) => {
    setActiveConversation(conv);
    setMobileView("chat");
  };

  const handleBackToList = () => {
    setMobileView("list");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || sending) return;

    const textToSend = newMessage.trim();
    setNewMessage("");

    try {
      setSending(true);
      const sent = await chatApi.sendMessage(activeConversation.id, textToSend);
      setMessages((prev) => [...prev, sent]);
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (conv.customerName || "").toLowerCase();
    const title = (conv.serviceRequestTitle || "").toLowerCase();
    const preview = (conv.lastMessagePreview || "").toLowerCase();
    return name.includes(q) || title.includes(q) || preview.includes(q);
  });

  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <div className="flex h-full min-h-0 flex-1">
        <Sidebar />

        <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 p-0 sm:p-4 lg:p-6">
          {/* Desktop Heading */}
          <div className="hidden md:block mb-3 px-2">
            <h1 className="text-xl font-bold text-slate-900">{t("messages")}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              ជជែកផ្ទាល់ជាមួយអតិថិជនអំពីព័ត៌មានលម្អិតនៃបញ្ហា និងការចុះបំពេញការងារ
            </p>
          </div>

          {/* Master-Detail Container */}
          <div className="flex-1 flex flex-col md:flex-row bg-white sm:rounded-2xl sm:border sm:border-slate-200/90 shadow-2xs overflow-hidden h-full min-h-0">
            {/* 1. Left Pane: Conversation List */}
            <div
              className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col h-full min-h-0 bg-white shrink-0 ${
                mobileView === "chat" ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Header on Mobile/Desktop */}
              <div className="p-3 sm:p-4 border-b border-slate-100 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base sm:text-sm font-bold text-slate-900">
                      {t("messages")}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                      {conversations.length}
                    </span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ស្វែងរកការសន្ទនា..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Conversations Scroll Area */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pb-20 md:pb-0">
                {loadingConversations ? (
                  <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                    <span>កំពុងផ្ទុកការសន្ទនា...</span>
                  </div>
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => {
                    const active = activeConversation?.id === conv.id;
                    const customerName = conv.customerName || "អតិថិជន";
                    return (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => handleSelectConversation(conv)}
                        className={`w-full p-3.5 text-left flex items-start space-x-3 transition active:bg-slate-100 ${
                          active
                            ? "bg-emerald-50/80 border-l-4 border-emerald-600 md:border-l-4"
                            : "hover:bg-slate-50/80"
                        }`}
                      >
                        <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-sm shadow-2xs">
                          {customerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {customerName}
                            </h4>
                            {conv.lastMessageAt && (
                              <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                                {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                          {conv.serviceRequestTitle && (
                            <p className="text-[10px] font-semibold text-emerald-600 truncate mt-0.5">
                              {conv.serviceRequestTitle}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {conv.lastMessagePreview || "ចាប់ផ្តើមការសន្ទនា"}
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                    <MessageSquare className="w-6 h-6 text-slate-300 mx-auto" />
                    <p>មិនទាន់មានការសន្ទនានៅឡើយទេ។</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Right Pane: Chat Thread */}
            <div
              className={`flex-1 flex flex-col bg-slate-50/40 h-full min-h-0 min-w-0 ${
                mobileView === "list" ? "hidden md:flex" : "flex"
              }`}
            >
              {activeConversation ? (
                <>
                  {/* Chat Top Header */}
                  <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-2xs z-10">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {/* Back button on Mobile */}
                      <button
                        type="button"
                        onClick={handleBackToList}
                        className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition active:scale-95 shrink-0"
                        aria-label="Back to conversations list"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>

                      <div className="relative">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                          {(activeConversation.customerName || "អតិថិជន")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {activeConversation.customerName || "អតិថិជន"}
                        </h3>
                        {activeConversation.serviceRequestTitle ? (
                          <span className="text-[10px] text-emerald-700 font-semibold truncate block">
                            សំណើ៖ {activeConversation.serviceRequestTitle}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 block">
                            អតិថិជន
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 min-h-0 overscroll-contain">
                    {loadingMessages ? (
                      <div className="text-center py-12 text-xs text-slate-400 flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>កំពុងផ្ទុកសារ...</span>
                      </div>
                    ) : messages.length > 0 ? (
                      messages.map((msg) => {
                        const isMine = msg.senderId === user?.id || msg.isMine;
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${
                              isMine ? "items-end" : "items-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed break-words shadow-2xs ${
                                isMine
                                  ? "bg-emerald-600 text-white rounded-br-xs"
                                  : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs"
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.message}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 px-1">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-16 text-xs text-slate-400 space-y-1">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-2">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <p className="font-semibold text-slate-600">
                          ផ្ញើសារដំបូងដើម្បីឆ្លើយតបទៅកាន់អតិថិជន
                        </p>
                        <p className="text-[11px] text-slate-400">
                          ពិភាក្សាអំពីតម្លៃ ពេលវេលា ឬទីតាំងចុះបំពេញការងារ
                        </p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input Box: Sticky at bottom, safe area aware */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-2 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2 sticky bottom-0 z-20 pb-[max(0.65rem,calc(env(safe-area-inset-bottom)+0.35rem))] shrink-0 shadow-xs"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      enterKeyHint="send"
                      placeholder="សរសេរសារឆ្លើយតប..."
                      className="flex-1 px-4 py-2.5 text-[15px] sm:text-sm rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition shadow-2xs"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-xs transition"
                      aria-label="Send message"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 ml-0.5" />
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <EmptyState
                    title={t("noMessages")}
                    subtitle="ជ្រើសរើសការសន្ទនាដើម្បីចាប់ផ្តើមជជែក។"
                    icon={MessageSquare}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
