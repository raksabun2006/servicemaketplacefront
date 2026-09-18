"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { chatApi } from "@/lib/api/chat.api";
import { ConversationResponse, ChatMessageResponse } from "@/types/chat";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessageSquare, Send, Loader2, User } from "lucide-react";

export default function ProviderMessagesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await chatApi.getConversations(0, 50);
      setConversations(res.content || []);
      if (!activeConversation && res.content && res.content.length > 0) {
        setActiveConversation(res.content[0]);
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

  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-slate-900">{t("messages")}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              ជជែកផ្ទាល់ជាមួយអតិថិជនអំពីព័ត៌មានលម្អិតនៃបញ្ហា និងការចុះបំពេញការងារ
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[70vh]">
            {/* Conversation List */}
            <div className="w-full md:w-80 border-r border-slate-200 flex flex-col">
              <div className="p-3.5 border-b border-slate-100 bg-slate-50/50">
                <span className="text-xs font-bold text-slate-700">ការសន្ទនាជាមួយអតិថិជន</span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {loadingConversations ? (
                  <div className="p-4 text-center text-xs text-slate-400">កំពុងផ្ទុក...</div>
                ) : conversations.length > 0 ? (
                  conversations.map((conv) => {
                    const active = activeConversation?.id === conv.id;
                    const customerName = conv.customerName || "អតិថិជន";
                    return (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => setActiveConversation(conv)}
                        className={`w-full p-3.5 text-left flex items-start space-x-3 transition ${
                          active ? "bg-emerald-50/70" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-sm">
                          {customerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {customerName}
                            </h4>
                            {conv.lastMessageAt && (
                              <span className="text-[10px] text-slate-400">
                                {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          {conv.serviceRequestTitle && (
                            <p className="text-[10px] font-semibold text-emerald-600 truncate">
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
                  <div className="p-8 text-center text-xs text-slate-400">
                    មិនទាន់មានការសន្ទនានៅឡើយទេ។
                  </div>
                )}
              </div>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 flex flex-col bg-slate-50/30">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">
                          {activeConversation.customerName || "អតិថិជន"}
                        </h3>
                        {activeConversation.serviceRequestTitle && (
                          <span className="text-[10px] text-slate-500">
                            សំណើ៖ {activeConversation.serviceRequestTitle}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {loadingMessages ? (
                      <div className="text-center py-8 text-xs text-slate-400">កំពុងផ្ទុកសារ...</div>
                    ) : messages.length > 0 ? (
                      messages.map((msg) => {
                        const isMine = msg.senderId === user?.id || msg.isMine;
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                          >
                            <div
                              className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                                isMine
                                  ? "bg-emerald-600 text-white rounded-br-xs"
                                  : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs"
                              }`}
                            >
                              <p>{msg.message}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 px-1">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12 text-xs text-slate-400">
                        ផ្ញើសារដំបូងដើម្បីឆ្លើយតបទៅកាន់អតិថិជន។
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input Box */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="សរសេរសារឆ្លើយតប..."
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
