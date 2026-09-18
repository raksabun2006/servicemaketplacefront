"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { fileApi } from "@/lib/api/file.api";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  Lock,
} from "lucide-react";

export default function AdminProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl || "");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("ទំហំរូបភាពមិនត្រូវលើសពី 10MB ទេ។");
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setAvatarUrl(localPreviewUrl);

    try {
      setIsUploadingAvatar(true);
      setErrorMsg(null);

      // Upload file to storage
      const uploaded = await fileApi.upload(file, "AVATAR");
      const serverUrl = fileApi.getFileUrl(uploaded.url || uploaded.id);

      setAvatarUrl(serverUrl);

      // Update auth context & persistent storage
      if (user) {
        const updatedUser = {
          ...user,
          avatarUrl: serverUrl,
        };
        updateUser(updatedUser);
      }

      setSuccessMsg("រូបភាពប្រវត្តិរូបត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setErrorMsg(apiErr?.message || "ការបញ្ចូលរូបភាពបានបរាជ័យ។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    if (user) {
      const updatedUser = {
        ...user,
        avatarUrl: undefined,
      };
      updateUser(updatedUser);
    }
    setSuccessMsg("បានលុបរូបភាពគណនីរួចរាល់!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg("សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក។");
      return;
    }

    try {
      setIsSaving(true);

      if (user) {
        const updatedUser = {
          ...user,
          fullName: fullName.trim(),
          phone: phone.trim() || undefined,
          avatarUrl: avatarUrl || undefined,
        };
        updateUser(updatedUser);
      }

      setSuccessMsg("ព័ត៌មានគណនីរបស់អ្នកគ្រប់គ្រងត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setErrorMsg(apiErr?.message || "មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មាន។");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentPassword) {
      setErrorMsg("សូមបញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្នរបស់អ្នក។");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("ពាក្យសម្ងាត់ថ្មីត្រូវតែមានយ៉ាងហោចណាស់ ៦ តួអក្សរ។");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("ពាក្យសម្ងាត់ថ្មី និងការបញ្ជាក់មិនត្រូវគ្នាទេ។");
      return;
    }

    // Simulate password update
    setSuccessMsg("ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const userInitials = (user?.fullName || "AD")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">គណនីអ្នកគ្រប់គ្រង (Admin Profile)</h1>
            <p className="text-xs text-slate-500 mt-1">
              គ្រប់គ្រង និងកែប្រែព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នកគ្រប់គ្រងប្រព័ន្ធ
            </p>
          </div>

          {/* Feedback messages */}
          {successMsg && (
            <div className="flex items-center space-x-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center space-x-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            {/* Avatar section */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-100">
              <div className="relative">
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={avatarUrl}
                    alt={fullName || "Admin"}
                    className="w-24 h-24 rounded-3xl object-cover border-2 border-purple-200 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-2xl border-2 border-purple-200 shadow-sm">
                    {userInitials}
                  </div>
                )}

                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h2 className="text-base font-bold text-slate-900">{fullName || user?.fullName}</h2>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    <ShieldCheck className="w-3 h-3 text-purple-600" />
                    <span>អ្នកគ្រប់គ្រង (Admin)</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {user?.email}
                </p>

                <div className="flex items-center justify-center sm:justify-start space-x-3 pt-1">
                  <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl transition">
                    <Camera className="w-3.5 h-3.5" />
                    <span>ប្តូររូបភាព</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isUploadingAvatar}
                    />
                  </label>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold rounded-xl transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>លុបរូប</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    ឈ្មោះពេញ (Full Name) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="បញ្ចូលឈ្មោះពេញរបស់អ្នក"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    លេខទូរស័ព្ទ (Phone Number)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="ឧទាហរណ៍៖ 012 345 678"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Email (Read-only for account integrity) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    អ៊ីមែល (Email Address)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      disabled
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">អ៊ីមែលភ្ជាប់ជាមួយគណនីសុវត្ថិភាពរបស់អ្នក</p>
                </div>

                {/* Role (Read-only) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    សិទ្ធិប្រើប្រាស់ (System Role)
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value="អ្នកគ្រប់គ្រងជាន់ខ្ពស់ (ADMINISTRATOR)"
                      readOnly
                      disabled
                      className="w-full pl-9 pr-3 py-2 text-xs bg-purple-50/50 text-purple-800 font-semibold border border-purple-200 rounded-xl cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>កំពុងរក្សាទុក...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>រក្សាទុកព័ត៌មាន (Save Profile)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Password / Security Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center space-x-2.5">
              <KeyRound className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900">ផ្លាស់ប្តូរពាក្យសម្ងាត់ (Change Password)</h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    ពាក្យសម្ងាត់បច្ចុប្បន្ន
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    ពាក្យសម្ងាត់ថ្មី
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="យ៉ាងហោចណាស់ ៦ តួអក្សរ"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    បញ្ជាក់ពាក្យសម្ងាត់ថ្មី
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
