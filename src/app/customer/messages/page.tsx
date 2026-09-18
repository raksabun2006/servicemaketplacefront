"use client";

import React, { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { chatApi } from "@/lib/api/chat.api";
import { fileApi } from "@/lib/api/file.api";
import { providerApi } from "@/lib/api/provider.api";
import { ConversationResponse, ChatMessageResponse } from "@/types/chat";
import { ProviderProfileResponse } from "@/types/provider";
import {
  MessageSquare,
  Send,
  Loader2,
  User,
  Plus,
  Search,
  X,
  Briefcase,
  MapPin,
  Star,
  CheckCircle2,
  Phone,
  Clock,
} from "lucide-react";

function CustomerMessagesContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const providerIdParam = searchParams.get("providerId");
  const userIdParam = searchParams.get("userId");
  const conversationIdParam = searchParams.get("conversationId");

  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // Provider Selector Modal state
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [providers, setProviders] = useState<ProviderProfileResponse[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [providerSearch, setProviderSearch] = useState("");
  const [startingChatWithId, setStartingChatWithId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async (selectConvId?: string) => {
    try {
      setLoadingConversations(true);
      const res = await chatApi.getConversations(0, 50);
      const list = res.content || [];
      setConversations(list);

      if (selectConvId) {
        const target = list.find((c) => c.id === selectConvId);
        if (target) {
          setActiveConversation(target);
        } else if (list.length > 0) {
          setActiveConversation((prev) => prev || list[0]);
        }
      } else if (list.length > 0) {
        setActiveConversation((prev) => prev || list[0]);
      }
      return list;
    } catch {
      setConversations([]);
      return [];
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  const fetchMessages = useCallback(async (convId: string) => {
    try {
      setLoadingMessages(true);
      const res = await chatApi.getMessages(convId, 0, 50);
      // reverse messages so oldest is first
      const sorted = [...(res.content || [])].reverse();
      setMessages(sorted);
      chatApi.markAsRead(convId).catch(() => {});
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const fetchProviders = useCallback(async () => {
    try {
      setLoadingProviders(true);
      const res = await providerApi.list({ page: 0, size: 50 });
      setProviders(res.content || []);
    } catch {
      setProviders([]);
    } finally {
      setLoadingProviders(false);
    }
  }, []);

  const handleOpenProviderSelector = () => {
    setShowProviderModal(true);
    fetchProviders();
  };

  const handleStartChatWithProvider = async (p: ProviderProfileResponse) => {
    try {
      setStartingChatWithId(p.id);
      let conv: ConversationResponse | null = null;
      try {
        conv = await chatApi.createOrGetConversation({
          providerId: p.id,
        });
      } catch (err1) {
        if (p.userId && p.userId !== p.id) {
          conv = await chatApi.createOrGetConversation({
            providerId: p.userId,
          });
        } else {
          throw err1;
        }
      }

      if (conv) {
        const enrichedConv: ConversationResponse = {
          ...conv,
          providerBusinessName: conv.providerBusinessName || p.businessName || p.fullName,
          providerFullName: conv.providerFullName || p.fullName,
          providerAvatarUrl: conv.providerAvatarUrl || p.avatarUrl,
        };

        setConversations((prev) => {
          const exists = prev.find((c) => c.id === enrichedConv.id);
          if (exists) return prev;
          return [enrichedConv, ...prev];
        });
        setActiveConversation(enrichedConv);
        setShowProviderModal(false);
      }
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      alert(apiErr?.message || "មិនអាចចាប់ផ្តើមការសន្ទនាជាមួយអ្នកផ្តល់សេវានេះបានទេ។");
    } finally {
      setStartingChatWithId(null);
    }
  };

  // Handle URL query params when page opens
  useEffect(() => {
    const init = async () => {
      const list = await fetchConversations(conversationIdParam || undefined);

      if (conversationIdParam && list.some((c) => c.id === conversationIdParam)) {
        return;
      }

      const targetProviderId = providerIdParam || userIdParam;
      if (targetProviderId) {
        const existing = list.find((c) => c.providerId === targetProviderId || c.id === targetProviderId);
        if (existing) {
          setActiveConversation(existing);
          return;
        }

        try {
          let conv: ConversationResponse | null = null;
          try {
            conv = await chatApi.createOrGetConversation({
              providerId: targetProviderId,
            });
          } catch {
            if (userIdParam && providerIdParam && userIdParam !== providerIdParam) {
              conv = await chatApi.createOrGetConversation({
                providerId: userIdParam,
              });
            }
          }

          if (conv) {
            let enriched = conv;
            try {
              const p = await providerApi.getById(targetProviderId);
              if (p) {
                enriched = {
                  ...conv,
                  providerBusinessName: conv.providerBusinessName || p.businessName || p.fullName,
                  providerFullName: conv.providerFullName || p.fullName,
                  providerAvatarUrl: conv.providerAvatarUrl || p.avatarUrl,
                };
              }
            } catch {
              // ignore
            }

            setConversations((prev) => {
              const exists = prev.find((c) => c.id === enriched.id);
              if (exists) return prev;
              return [enriched, ...prev];
            });
            setActiveConversation(enriched);
          }
        } catch {
          // ignore error
        }
      }
    };

    init();
  }, [conversationIdParam, providerIdParam, userIdParam, fetchConversations]);

  // Handle Active conversation message fetching and polling
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
      // Polling every 5 seconds for new messages
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

  const filteredProviders = providers.filter((p) => {
    if (!providerSearch.trim()) return true;
    const q = providerSearch.toLowerCase();
    const nameMatch = (p.fullName || "").toLowerCase().includes(q);
    const bizMatch = (p.businessName || "").toLowerCase().includes(q);
    const areaMatch = (p.serviceArea || "").toLowerCase().includes(q);
    const bioMatch = (p.bio || "").toLowerCase().includes(q);
    return nameMatch || bizMatch || areaMatch || bioMatch;
  });

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <div className="flex min-h-screen bg-slate-50/50">
        <Sidebar />

        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header with Title and Start Chat Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t("messages")}</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                ជជែកផ្ទាល់ជាមួយអ្នកផ្តល់សេវាអំពីកិច្ចការ តម្លៃ និងកាលវិភាគ
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenProviderSelector}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>ជជែកជាមួយអ្នកផ្តល់សេវា</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[72vh]">
            {/* Conversation List Column */}
            <div className="w-full md:w-80 border-r border-slate-200 flex flex-col">
              <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">ការសន្ទនា ({conversations.length})</span>
                <button
                  type="button"
                  onClick={handleOpenProviderSelector}
                  className="inline-flex items-center space-x-1 px-2 py-1 text-[11px] font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition"
                  title="ផ្ញើសារថ្មីទៅកាន់អ្នកផ្តល់សេវា"
                >
                  <Plus className="w-3 h-3" />
                  <span>សារថ្មី</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {loadingConversations ? (
                  <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                    <span>កំពុងផ្ទុកការសន្ទនា...</span>
                  </div>
                ) : conversations.length > 0 ? (
                  conversations.map((conv) => {
                    const active = activeConversation?.id === conv.id;
                    const counterpartName =
                      conv.providerBusinessName || conv.providerFullName || "អ្នកផ្តល់សេវា";
                    return (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => setActiveConversation(conv)}
                        className={`w-full p-3.5 text-left flex items-start space-x-3 transition ${
                          active ? "bg-indigo-50/70" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-sm overflow-hidden">
                          {conv.providerAvatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={fileApi.getFileUrl(conv.providerAvatarUrl)}
                              alt=""
                              className="w-full h-full object-cover rounded-xl"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                                const fb = e.currentTarget.parentElement?.querySelector(".avatar-fallback");
                                if (fb) (fb as HTMLElement).style.display = "flex";
                              }}
                            />
                          ) : null}
                          <span
                            className={`avatar-fallback ${conv.providerAvatarUrl ? "hidden" : "flex"} w-full h-full items-center justify-center`}
                          >
                            {counterpartName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {counterpartName}
                            </h4>
                            {conv.lastMessageAt && (
                              <span className="text-[10px] text-slate-400">
                                {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                          {conv.serviceRequestTitle && (
                            <p className="text-[10px] font-semibold text-indigo-600 truncate">
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
                  <div className="p-6 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">មិនទាន់មានការសន្ទនានៅឡើយទេ</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        ស្វែងរកអ្នកផ្តល់សេវាដើម្បីចាប់ផ្តើមជជែកសួរព័ត៌មាន
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenProviderSelector}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>ស្វែងរកអ្នកផ្តល់សេវា</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Thread Column */}
            <div className="flex-1 flex flex-col bg-slate-50/30">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs overflow-hidden">
                        {activeConversation.providerAvatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={fileApi.getFileUrl(activeConversation.providerAvatarUrl)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">
                          {activeConversation.providerBusinessName || activeConversation.providerFullName}
                        </h3>
                        {activeConversation.serviceRequestTitle ? (
                          <span className="text-[10px] text-slate-500">
                            សំណើ៖ {activeConversation.serviceRequestTitle}
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-medium">
                            អ្នកផ្តល់សេវាជំនាញ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {loadingMessages ? (
                      <div className="text-center py-8 text-xs text-slate-400 flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                        <span>កំពុងផ្ទុកសារ...</span>
                      </div>
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
                                  ? "bg-indigo-600 text-white rounded-br-xs"
                                  : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs"
                              }`}
                            >
                              <p>{msg.message}</p>
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
                      <div className="text-center py-12 text-xs text-slate-400 space-y-1">
                        <p className="font-semibold text-slate-600">
                          ចាប់ផ្តើមជជែកជាមួយ {activeConversation.providerBusinessName || activeConversation.providerFullName || "អ្នកផ្តល់សេវា"}
                        </p>
                        <p className="text-[11px]">ផ្ញើសារដំបូងរបស់អ្នកដើម្បីពិភាក្សាអំពីការងារ ឬសេវាកម្ម។</p>
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
                      placeholder="សរសេរសារនៅទីនេះ..."
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="p-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white rounded-xl shadow-xs transition"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div className="max-w-xs space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">ចាប់ផ្តើមជជែកជាមួយអ្នកផ្តល់សេវា</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      ជ្រើសរើសការសន្ទនាពីបញ្ជីខាងឆ្វេង ឬស្វែងរកអ្នកផ្តល់សេវាដើម្បីជជែកផ្ទាល់
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenProviderSelector}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ផ្ញើសារទៅកាន់អ្នកផ្តល់សេវា</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal: Select Provider to Message */}
        {showProviderModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    ជ្រើសរើសអ្នកផ្តល់សេវាដើម្បីជជែក
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ស្វែងរក និងផ្ញើសារទៅកាន់ជាងជំនាញដែលអ្នកចង់បាន
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProviderModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-3.5 border-b border-slate-100 bg-slate-50/60">
                <div className="relative">
                  <input
                    type="text"
                    value={providerSearch}
                    onChange={(e) => setProviderSearch(e.target.value)}
                    placeholder="ស្វែងរកតាមឈ្មោះ, យីហោ, ទីតាំង, ឬជំនាញ..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Providers List */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
                {loadingProviders ? (
                  <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    <span>កំពុងទាញយកព័ត៌មានអ្នកផ្តល់សេវា...</span>
                  </div>
                ) : filteredProviders.length > 0 ? (
                  filteredProviders.map((p) => {
                    const isStarting = startingChatWithId === p.id;
                    const displayName = p.businessName || p.fullName;

                    return (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-500 text-white font-bold text-sm flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                            {p.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={fileApi.getFileUrl(p.avatarUrl)}
                                alt={displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{displayName.charAt(0).toUpperCase()}</span>
                            )}
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center space-x-1.5">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {displayName}
                              </h4>
                              {p.isVerified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              )}
                            </div>

                            {p.businessName && p.fullName && (
                              <p className="text-[10px] text-slate-500 truncate">
                                ជាង៖ {p.fullName}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-500">
                              {p.serviceArea && (
                                <span className="inline-flex items-center space-x-0.5 text-indigo-600">
                                  <MapPin className="w-2.5 h-2.5" />
                                  <span className="truncate">{p.serviceArea}</span>
                                </span>
                              )}
                              {p.experienceYears !== undefined && p.experienceYears > 0 && (
                                <span className="inline-flex items-center space-x-0.5 text-slate-600">
                                  <Briefcase className="w-2.5 h-2.5" />
                                  <span>{p.experienceYears} ឆ្នាំ</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStartChatWithProvider(p)}
                          disabled={isStarting}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl transition shadow-2xs shrink-0 disabled:opacity-60"
                        >
                          {isStarting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <MessageSquare className="w-3.5 h-3.5" />
                          )}
                          <span>ជជែក</span>
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-10 text-center text-xs text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-600">រកមិនឃើញអ្នកផ្តល់សេវាទេ</p>
                    <p className="text-[11px]">សូមសាកល្បងស្វែងរកជាមួយពាក្យគន្លឹះផ្សេង។</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                <span>អ្នកផ្តល់សេវាសរុប៖ {filteredProviders.length}</span>
                <button
                  type="button"
                  onClick={() => setShowProviderModal(false)}
                  className="px-3 py-1 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  បិទ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default function CustomerMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      }
    >
      <CustomerMessagesContent />
    </Suspense>
  );
}
