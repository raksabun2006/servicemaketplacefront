"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { adminApi } from "@/lib/api/admin.api";
import { fileApi } from "@/lib/api/file.api";
import { ProviderProfileResponse } from "@/types/provider";
import { ProviderApplicationResponse } from "@/types/admin";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  Briefcase,
  MapPin,
  ExternalLink,
  Mail,
  Phone,
  User,
  AlertCircle,
  Clock,
  Search,
  Eye,
  X,
  RotateCcw,
  Check,
} from "lucide-react";

export default function AdminProvidersPage() {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<"pending_apps" | "all_apps" | "providers">("pending_apps");
  const [applications, setApplications] = useState<ProviderApplicationResponse[]>([]);
  const [providers, setProviders] = useState<ProviderProfileResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<"ALL" | "UNVERIFIED" | "PENDING" | "VERIFIED">("ALL");

  // Document modal preview
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url: string } | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      if (activeTab === "pending_apps") {
        const res = await adminApi.getApplications({ status: "PENDING", page: 0, size: 50 });
        const items = Array.isArray(res) ? res : res.content || [];
        setApplications(items);
      } else if (activeTab === "all_apps") {
        const res = await adminApi.getApplications({ page: 0, size: 50 });
        const items = Array.isArray(res) ? res : res.content || [];
        setApplications(items);
      } else {
        const res = await adminApi.getProviders(0, 100);
        const items = Array.isArray(res) ? res : res.content || [];
        setProviders(items);
      }
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setNotification({
        type: "error",
        message: apiErr?.message || "មិនអាចទាញយកទិន្នន័យបានទេ។ សូមព្យាយាមម្តងទៀត។",
      });
      setApplications([]);
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleApproveApp = async (applicationId: string) => {
    try {
      setActionLoading(applicationId);
      await adminApi.approveApplication(applicationId);
      setNotification({
        type: "success",
        message: "ពាក្យស្នើសុំត្រូវបានអនុម័ត! អ្នកប្រើប្រាស់ត្រូវបានដំឡើងជាអ្នកផ្តល់សេវា (PROVIDER) ដោយជោគជ័យ។",
      });
      fetchItems();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setNotification({
        type: "error",
        message: apiErr?.message || "ការអនុម័តបានបរាជ័យ។",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmRejectApp = async (applicationId: string) => {
    if (!rejectReason.trim()) return;
    try {
      setActionLoading(applicationId);
      await adminApi.rejectApplication(applicationId, rejectReason.trim());
      setRejectingId(null);
      setRejectReason("");
      setNotification({
        type: "success",
        message: "ពាក្យស្នើសុំត្រូវបានបដិសេធ។",
      });
      fetchItems();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setNotification({
        type: "error",
        message: apiErr?.message || "ការបដិសេធបានបរាជ័យ។",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveProvider = async (providerId: string) => {
    try {
      setActionLoading(providerId);
      await adminApi.approveProvider(providerId);
      setNotification({
        type: "success",
        message: "អ្នកផ្តល់សេវាត្រូវបានផ្ទៀងផ្ទាត់ និងអនុម័តដោយជោគជ័យ!",
      });
      fetchItems();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setNotification({
        type: "error",
        message: apiErr?.message || "ការអនុម័តបានបរាជ័យ។",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmRejectProvider = async (providerId: string) => {
    if (!rejectReason.trim()) return;
    try {
      setActionLoading(providerId);
      await adminApi.rejectProvider(providerId, rejectReason.trim());
      setRejectingId(null);
      setRejectReason("");
      setNotification({
        type: "success",
        message: "អ្នកផ្តល់សេវាត្រូវបានបដិសេធ ឬដកហូតការផ្ទៀងផ្ទាត់។",
      });
      fetchItems();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setNotification({
        type: "error",
        message: apiErr?.message || "ការបដិសេធបានបរាជ័យ។",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered providers
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.serviceArea?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const isVerified = p.verificationStatus === "VERIFIED" || p.isVerified;
      const isPending = p.verificationStatus === "PENDING";
      const isUnverified = !isVerified && !isPending;

      if (providerFilter === "VERIFIED") return isVerified;
      if (providerFilter === "PENDING") return isPending;
      if (providerFilter === "UNVERIFIED") return isUnverified;
      return true;
    });
  }, [providers, searchQuery, providerFilter]);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        app.businessName?.toLowerCase().includes(q) ||
        app.applicant?.fullName?.toLowerCase().includes(q) ||
        app.applicant?.email?.toLowerCase().includes(q) ||
        app.applicant?.phone?.toLowerCase().includes(q) ||
        app.city?.toLowerCase().includes(q)
      );
    });
  }, [applications, searchQuery]);

  // Counts
  const pendingCount = applications.filter((a) => a.applicationStatus === "PENDING").length;
  const unverifiedProviderCount = providers.filter(
    (p) => p.verificationStatus !== "VERIFIED" && !p.isVerified
  ).length;
  const verifiedProviderCount = providers.filter(
    (p) => p.verificationStatus === "VERIFIED" || p.isVerified
  ).length;

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header & Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t("providerVerification")}</h1>
              <p className="text-xs text-slate-500 mt-1">
                ត្រួតពិនិត្យពាក្យស្នើសុំ ឯកសារអត្តសញ្ញាណប័ណ្ណ និងផ្ទៀងផ្ទាត់អ្នកផ្តល់សេវាដោយងាយស្រួល
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-amber-800">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-semibold">រង់ចាំផ្ទៀងផ្ទាត់:</span>
                <span className="font-bold">{pendingCount + unverifiedProviderCount}</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">បានផ្ទៀងផ្ទាត់:</span>
                <span className="font-bold">{verifiedProviderCount}</span>
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div
              className={`flex items-center justify-between p-3.5 rounded-2xl text-xs border animate-in fade-in duration-200 ${
                notification.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              <div className="flex items-center space-x-2">
                {notification.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="font-medium">{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2 overflow-x-auto text-xs">
              <button
                onClick={() => {
                  setActiveTab("pending_apps");
                  setSearchQuery("");
                }}
                className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                  activeTab === "pending_apps"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>ពាក្យស្នើសុំរង់ចាំ (Pending Applications)</span>
                {applications.length > 0 && activeTab === "pending_apps" && (
                  <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
                    {applications.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab("all_apps");
                  setSearchQuery("");
                }}
                className={`px-4 py-2 rounded-xl font-bold transition ${
                  activeTab === "all_apps"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                ពាក្យស្នើសុំទាំងអស់ (All Applications)
              </button>

              <button
                onClick={() => {
                  setActiveTab("providers");
                  setSearchQuery("");
                }}
                className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                  activeTab === "providers"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>អ្នកផ្តល់សេវាទាំងអស់ (Active Providers)</span>
                {providers.length > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                      activeTab === "providers" ? "bg-white/20" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {providers.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search & Status Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ស្វែងរកឈ្មោះ អ៊ីមែល លេខទូរស័ព្ទ..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter for Providers Tab */}
            {activeTab === "providers" && (
              <div className="flex items-center space-x-1.5 text-xs w-full sm:w-auto overflow-x-auto">
                <span className="text-slate-400 text-[11px] font-medium mr-1">តម្រង៖</span>
                {(
                  [
                    { key: "ALL", label: "ទាំងអស់" },
                    { key: "UNVERIFIED", label: "មិនទាន់ផ្ទៀងផ្ទាត់" },
                    { key: "PENDING", label: "កំពុងរង់ចាំ" },
                    { key: "VERIFIED", label: "បានផ្ទៀងផ្ទាត់" },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setProviderFilter(f.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      providerFilter === f.key
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : "text-slate-600 hover:bg-slate-100 border border-transparent"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span>កំពុងផ្ទុកទិន្នន័យពីម៉ាស៊ីនបម្រើ...</span>
            </div>
          ) : activeTab === "pending_apps" || activeTab === "all_apps" ? (
            /* Applications List */
            filteredApplications.length > 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                {filteredApplications.map((app) => {
                  const docUrl =
                    app.identityDocumentUrl ||
                    (app.identityDocumentFileId
                      ? fileApi.getFileUrl(app.identityDocumentFileId)
                      : null);
                  const photoUrl =
                    app.profilePhotoUrl ||
                    (app.profilePhotoFileId
                      ? fileApi.getFileUrl(app.profilePhotoFileId)
                      : null);
                  const isPending = app.applicationStatus === "PENDING";

                  return (
                    <div key={app.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start space-x-3.5">
                          {photoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={photoUrl}
                              alt={app.businessName || app.applicant?.fullName || "Photo"}
                              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-base shrink-0 border border-purple-100">
                              {(app.businessName || app.applicant?.fullName || "P").charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-bold text-slate-900">
                                {app.businessName || app.applicant?.fullName}
                              </h3>
                              <StatusBadge status={app.applicationStatus} />
                            </div>
                            <p className="text-xs text-slate-500">
                              បេក្ខជន៖ {app.applicant?.fullName || "មិនស្គាល់"} • អ៊ីមែល៖ {app.applicant?.email}
                              {app.applicant?.phone && ` • ទូរស័ព្ទ៖ ${app.applicant.phone}`}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center flex-wrap gap-2 pt-1 sm:pt-0">
                          {docUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewDoc({
                                  title: `ឯកសារអត្តសញ្ញាណប័ណ្ណ - ${app.businessName || app.applicant?.fullName}`,
                                  url: docUrl,
                                })
                              }
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-500" />
                              <span>ពិនិត្យឯកសារ</span>
                              <Eye className="w-3 h-3 text-slate-400" />
                            </button>
                          )}

                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveApp(app.id)}
                                disabled={actionLoading === app.id}
                                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
                              >
                                {actionLoading === app.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                <span>អនុម័ត & ផ្ទៀងផ្ទាត់</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setRejectingId(app.id);
                                  setRejectReason("");
                                }}
                                disabled={actionLoading === app.id}
                                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>បដិសេធ</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {app.bio && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {app.bio}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                        {app.experienceYears !== undefined && (
                          <div className="flex items-center space-x-1 text-slate-500">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            <span>បទពិសោធន៍ {app.experienceYears} ឆ្នាំ</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {[app.address, app.district, app.city || app.serviceArea]
                              .filter(Boolean)
                              .join(", ") || "រាជធានីភ្នំពេញ"}
                          </span>
                        </div>
                        {app.rejectionReason && (
                          <div className="text-xs text-rose-600">
                            មូលហេតុបដិសេធ៖ {app.rejectionReason}
                          </div>
                        )}
                      </div>

                      {/* Reject Form Modal / Inline Box */}
                      {rejectingId === app.id && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 mt-2">
                          <label className="block text-xs font-bold text-rose-800">
                            មូលហេតុនៃការបដិសេធ (Rejection reason):
                          </label>
                          <input
                            type="text"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="ឧទាហរណ៍៖ រូបភាពឯកសារអត្តសញ្ញាណប័ណ្ណមិនច្បាស់ ឬ ព័ត៌មានមិនត្រឹមត្រូវ..."
                            className="w-full px-3 py-1.5 text-xs bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                          <div className="flex items-center space-x-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleConfirmRejectApp(app.id)}
                              disabled={!rejectReason.trim()}
                              className="px-3.5 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition disabled:opacity-50"
                            >
                              បញ្ជាក់បដិសេធ
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectingId(null)}
                              className="px-3 py-1.5 bg-white text-slate-700 text-xs rounded-xl border border-slate-200 hover:bg-slate-50"
                            >
                              បោះបង់
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title={
                  activeTab === "pending_apps"
                    ? "មិនមានពាក្យស្នើសុំកំពុងរង់ចាំការផ្ទៀងផ្ទាត់ទេ"
                    : "មិនមានពាក្យស្នើសុំនៅឡើយទេ"
                }
                subtitle="រាល់ពាក្យស្នើសុំចុះឈ្មោះជាអ្នកផ្តល់សេវាថ្មីនឹងបង្ហាញនៅទីនេះ។"
                icon={ShieldCheck}
              />
            )
          ) : (
            /* Active Providers Directory */
            filteredProviders.length > 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                {filteredProviders.map((prov) => {
                  const docUrl = prov.identityDocumentFileId
                    ? fileApi.getFileUrl(prov.identityDocumentFileId)
                    : null;
                  const isVerified = prov.verificationStatus === "VERIFIED" || prov.isVerified;

                  return (
                    <div key={prov.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start space-x-3.5">
                          {prov.avatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={prov.avatarUrl}
                              alt={prov.fullName}
                              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-base shrink-0 border border-slate-200">
                              {(prov.fullName || "P").charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-bold text-slate-900">
                                {prov.businessName || prov.fullName}
                              </h3>
                              <StatusBadge
                                status={
                                  isVerified
                                    ? "VERIFIED"
                                    : prov.verificationStatus || "UNVERIFIED"
                                }
                              />
                            </div>
                            <p className="text-xs text-slate-500">
                              តំណាងដោយ៖ {prov.fullName} • អ៊ីមែល៖ {prov.email}
                              {prov.phone && ` • ទូរស័ព្ទ៖ ${prov.phone}`}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons for Admin */}
                        <div className="flex items-center flex-wrap gap-2 pt-1 sm:pt-0">
                          {/* View Profile in public marketplace */}
                          <Link
                            href={`/providers/${prov.id}`}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                          >
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            <span>កម្រងព័ត៌មាន</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>

                          {/* View ID Document */}
                          {docUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewDoc({
                                  title: `ឯកសារសម្គាល់ - ${prov.businessName || prov.fullName}`,
                                  url: docUrl,
                                })
                              }
                              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>មើលឯកសារ</span>
                              <Eye className="w-3 h-3 text-blue-400" />
                            </button>
                          )}

                          {/* DIRECT VERIFY ACTION: Available for all unverified or pending providers */}
                          {!isVerified ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveProvider(prov.id)}
                                disabled={actionLoading === prov.id}
                                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                              >
                                {actionLoading === prov.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                <span>ផ្ទៀងផ្ទាត់ (Verify)</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setRejectingId(prov.id);
                                  setRejectReason("");
                                }}
                                disabled={actionLoading === prov.id}
                                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>បដិសេធ</span>
                              </button>
                            </>
                          ) : (
                            /* Already verified: Option to revoke verification if needed */
                            <button
                              type="button"
                              onClick={() => {
                                setRejectingId(prov.id);
                                setRejectReason("");
                              }}
                              disabled={actionLoading === prov.id}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-slate-400 hover:text-rose-600 text-xs font-medium rounded-xl hover:bg-rose-50 transition"
                              title="ដកហូតការផ្ទៀងផ្ទាត់"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>ដកហូតការផ្ទៀងផ្ទាត់</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                        {prov.experienceYears !== undefined && (
                          <div className="flex items-center space-x-1 text-slate-500">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            <span>បទពិសោធន៍ {prov.experienceYears} ឆ្នាំ</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prov.serviceArea || prov.city || "រាជធានីភ្នំពេញ"}</span>
                        </div>
                        {prov.rejectionReason && (
                          <div className="text-xs text-rose-600">
                            មូលហេតុ៖ {prov.rejectionReason}
                          </div>
                        )}
                      </div>

                      {/* Reject Form Modal / Inline Box */}
                      {rejectingId === prov.id && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 mt-2 animate-in fade-in duration-150">
                          <label className="block text-xs font-bold text-rose-800">
                            មូលហេតុនៃការបដិសេធ / ដកហូតការផ្ទៀងផ្ទាត់:
                          </label>
                          <input
                            type="text"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="ឧទាហរណ៍៖ ឯកសារមិនច្បាស់ មិនបានបំពេញព័ត៌មានត្រឹមត្រូវ..."
                            className="w-full px-3 py-1.5 text-xs bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                          <div className="flex items-center space-x-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleConfirmRejectProvider(prov.id)}
                              disabled={!rejectReason.trim()}
                              className="px-3.5 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition disabled:opacity-50"
                            >
                              បញ្ជាក់
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectingId(null)}
                              className="px-3 py-1.5 bg-white text-slate-700 text-xs rounded-xl border border-slate-200 hover:bg-slate-50"
                            >
                              បោះបង់
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="មិនទាន់មានអ្នកផ្តល់សេវាក្នុងបញ្ជីនេះទេ"
                subtitle="សូមសាកល្បងផ្លាស់ប្តូរតម្រងស្វែងរក ឬពិនិត្យម្តងទៀត។"
                icon={ShieldCheck}
              />
            )
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 truncate">{previewDoc.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={previewDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                  title="បើកផ្ទាំងថ្មី"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex items-center justify-center bg-slate-50 min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewDoc.url}
                alt={previewDoc.title}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-sm"
              />
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
              >
                បិទផ្ទាំង
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
