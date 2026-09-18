"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { customerApi } from "@/lib/api/customer.api";
import { fileApi } from "@/lib/api/file.api";
import { CustomerProfileResponse } from "@/types/customer";
import { LocationPicker, LocationData } from "@/components/ui/LocationPicker";
import {
  User,
  Mail,
  Phone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  Trash2,
} from "lucide-react";

export default function CustomerProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();

  const [profile, setProfile] = useState<CustomerProfileResponse | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [location, setLocation] = useState<Partial<LocationData>>({
    address: "",
    city: "Phnom Penh",
    district: "Meanchey",
    latitude: 11.5435,
    longitude: 104.8997,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    customerApi
      .getMyProfile()
      .then((data) => {
        setProfile(data);
        setFullName(data.fullName || "");
        setPhone(data.phone || "");
        setAvatarUrl(data.avatarUrl || user?.avatarUrl || "");
        if (data.avatarUrl && user) {
          updateUser({
            ...user,
            avatarUrl: data.avatarUrl,
          });
        }
        setLocation({
          address: data.address || "",
          city: data.city || "Phnom Penh",
          district: data.district || "Meanchey",
          latitude: data.latitude,
          longitude: data.longitude,
        });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user, updateUser]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("ទំហំរូបភាពមិនត្រូវលើសពី 10MB ទេ។");
      return;
    }

    // 1. Immediately create local preview so the user sees the photo without waiting
    const localPreviewUrl = URL.createObjectURL(file);
    setAvatarUrl(localPreviewUrl);

    try {
      setIsUploadingAvatar(true);
      setError(null);

      // 2. Upload file to server
      const uploaded = await fileApi.upload(file, "AVATAR");
      const serverUrl = fileApi.getFileUrl(uploaded.url || uploaded.id);
      
      // 3. Update state with permanent server URL
      setAvatarUrl(serverUrl);

      // 4. Save to customer profile in database
      const updated = await customerApi.updateMyProfile({
        avatarUrl: serverUrl,
      });

      setProfile(updated);
      if (user) {
        updateUser({
          ...user,
          avatarUrl: serverUrl,
        });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || "ការបញ្ចូលរូបភាពបានបរាជ័យ។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploadingAvatar(true);
      setError(null);
      setAvatarUrl("");
      const updated = await customerApi.updateMyProfile({
        avatarUrl: "",
      });
      setProfile(updated);
      if (user) {
        updateUser({
          ...user,
          avatarUrl: undefined,
        });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("មិនអាចលុបរូបភាពបានទេ។");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(false);

      const updated = await customerApi.updateMyProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        avatarUrl: avatarUrl || undefined,
        address: location.address,
        city: location.city,
        district: location.district,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      setProfile(updated);
      if (user) {
        updateUser({
          ...user,
          fullName: updated.fullName,
          phone: updated.phone,
          avatarUrl: updated.avatarUrl || avatarUrl,
        });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || "មិនអាចធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូបបានទេ។");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("profile")}</h1>
            <p className="text-xs text-slate-500 mt-1">គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងអាសយដ្ឋានរបស់អ្នក</p>
          </div>

          {success && (
            <div className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>ព័ត៌មានប្រវត្តិរូបត្រូវបានរក្សាទុកដោយជោគជ័យ!</span>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            {/* User Avatar & Email Header */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 pb-6 border-b border-slate-100">
              {/* Clean Avatar Box without dark overlays */}
              <div className="relative w-20 h-20 shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-2xl flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-sm relative">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fileApi.getFileUrl(avatarUrl)}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile?.fullName?.charAt(0) || user?.fullName?.charAt(0) || "U"
                  )}

                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    </div>
                  )}
                </div>

                {/* Clean Floating Camera Button on Bottom-Right */}
                <label
                  htmlFor="customer-avatar-input"
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md cursor-pointer transition active:scale-95 border-2 border-white"
                  title="បញ្ចូលរូបថត"
                >
                  <Camera className="w-3.5 h-3.5" />
                </label>

                <input
                  id="customer-avatar-input"
                  type="file"
                  accept="image/*"
                  disabled={isUploadingAvatar}
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* User Identity Info & Upload Actions */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-900">{profile?.fullName || user?.fullName}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    អតិថិជន
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile?.email || user?.email}</span>
                </p>

                {/* Upload action buttons */}
                <div className="pt-1 flex items-center space-x-3 text-xs">
                  <label
                    htmlFor="customer-avatar-input"
                    className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{avatarUrl ? "ប្តូររូបថតថ្មី" : "បញ្ចូលរូបថតប្រវត្តិរូប"}</span>
                  </label>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={isUploadingAvatar}
                      className="inline-flex items-center space-x-1 text-rose-500 hover:text-rose-600 font-semibold transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>លុបរូប</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400">កំពុងផ្ទុកព័ត៌មាន...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ឈ្មោះពេញ (Full Name) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    លេខទូរស័ព្ទ (Phone)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="012 345 678"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Location Picker */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    អាសយដ្ឋានលំនៅដ្ឋានលំនាំដើម
                  </label>
                  <LocationPicker value={location} onChange={setLocation} />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{t("save")}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
