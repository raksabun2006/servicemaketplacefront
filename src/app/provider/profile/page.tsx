"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { providerApi } from "@/lib/api/provider.api";
import { ProviderProfileResponse } from "@/types/provider";
import { LocationPicker, LocationData } from "@/components/ui/LocationPicker";
import { FileUploader } from "@/components/ui/FileUploader";
import { StatusBadge } from "@/components/ui/Badge";
import {
  Briefcase,
  DollarSign,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  Camera,
  Upload,
  Trash2,
} from "lucide-react";
import { fileApi } from "@/lib/api/file.api";

export default function ProviderProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();

  const [profile, setProfile] = useState<ProviderProfileResponse | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(1);
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [serviceArea, setServiceArea] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [location, setLocation] = useState<Partial<LocationData>>({
    city: "Phnom Penh",
    district: "Meanchey",
    latitude: 11.5435,
    longitude: 104.8997,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    providerApi
      .getMyProfile()
      .then((data) => {
        setProfile(data);
        setBusinessName(data.businessName || "");
        setBio(data.bio || "");
        setExperienceYears(data.experienceYears || 1);
        setHourlyRate(data.hourlyRate ? String(data.hourlyRate) : "");
        setServiceArea(data.serviceArea || "");
        setAvatarUrl(data.avatarUrl || "");
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

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("ទំហំរូបភាពមិនត្រូវលើសពី 10MB ទេ។");
      return;
    }

    // Instant local preview
    const localPreviewUrl = URL.createObjectURL(file);
    setAvatarUrl(localPreviewUrl);

    try {
      setIsUploadingAvatar(true);
      setErrorMsg(null);
      const uploaded = await fileApi.upload(file, "AVATAR");
      const serverUrl = fileApi.getFileUrl(uploaded.url || uploaded.id);
      setAvatarUrl(serverUrl);

      const updated = await providerApi.updateMyProfile({
        avatarUrl: serverUrl,
      });

      setProfile(updated);
      if (user) {
        updateUser({
          ...user,
          avatarUrl: serverUrl,
        });
      }
      setSuccessMsg("រូបថតប្រវត្តិរូបត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setErrorMsg(apiErr?.message || "ការបញ្ចូលរូបភាពបានបរាជ័យ។");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploadingAvatar(true);
      setErrorMsg(null);
      setAvatarUrl("");
      const updated = await providerApi.updateMyProfile({
        avatarUrl: "",
      });
      setProfile(updated);
      if (user) {
        updateUser({
          ...user,
          avatarUrl: undefined,
        });
      }
      setSuccessMsg("បានលុបរូបថតប្រវត្តិរូបរួចរាល់!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      setErrorMsg("មិនអាចលុបរូបភាពបានទេ។");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const updated = await providerApi.updateMyProfile({
        businessName: businessName.trim(),
        bio: bio.trim(),
        experienceYears: Number(experienceYears),
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        serviceArea: serviceArea.trim(),
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
          fullName: updated.fullName || user.fullName,
        });
      }
      setSuccessMsg("ព័ត៌មានប្រវត្តិរូបត្រូវបានរក្សាទុកដោយជោគជ័យ!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setErrorMsg(apiErr?.message || "មិនអាចធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូបបានទេ។");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("profile")}</h1>
            <p className="text-xs text-slate-500 mt-1">
              គ្រប់គ្រងព័ត៌មានអាជីវកម្ម និងការផ្ទៀងផ្ទាត់គណនីរបស់អ្នក
            </p>
          </div>

          {successMsg && (
            <div className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Account Status Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">ស្ថានភាពគណនីអ្នកផ្តល់សេវា</h3>
                  <p className="text-[11px] text-slate-500">
                    {profile?.isVerified || profile?.verificationStatus === "VERIFIED"
                      ? "គណនីរបស់អ្នកត្រូវបានផ្ទៀងផ្ទាត់ជាផ្លូវការរួចរាល់ហើយ"
                      : "គណនីរបស់អ្នកត្រៀមរួចជាស្រេចសម្រាប់ការទទួលការងារពីអតិថិជន"}
                  </p>
                </div>
              </div>
              <div>
                <StatusBadge status={profile?.verificationStatus || "UNVERIFIED"} />
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 pb-6 border-b border-slate-100">
              <div className="relative w-20 h-20 shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-700 font-bold text-2xl flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-sm relative">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fileApi.getFileUrl(avatarUrl)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile?.fullName?.charAt(0) || user?.fullName?.charAt(0) || "P"
                  )}

                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    </div>
                  )}
                </div>

                {/* Bottom-right Camera Icon Badge */}
                <label
                  htmlFor="provider-avatar-input"
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md cursor-pointer transition active:scale-95 border-2 border-white"
                  title="បញ្ចូលរូបភាព"
                >
                  <Camera className="w-3.5 h-3.5" />
                </label>

                <input
                  id="provider-avatar-input"
                  type="file"
                  accept="image/*"
                  disabled={isUploadingAvatar}
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-900">{profile?.fullName || user?.fullName}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    អ្នកផ្តល់សេវា
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile?.email || user?.email}</span>
                </p>
                {profile?.phone && (
                  <p className="text-xs text-slate-500 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.phone}</span>
                  </p>
                )}

                <div className="pt-1 flex items-center space-x-3 text-xs">
                  <label
                    htmlFor="provider-avatar-input"
                    className="inline-flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer transition"
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
              <div className="p-8 text-center text-xs text-slate-400">កំពុងផ្ទុក...</div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ឈ្មោះអាជីវកម្ម / ក្រុមការងារ (Business Name)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Pisey Home Services"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      បទពិសោធន៍ (ឆ្នាំ)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      តម្លៃចាប់ផ្តើម / ម៉ោង ($)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min={0}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="15"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                      />
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    តំបន់ផ្តល់សេវាចម្បង
                  </label>
                  <input
                    type="text"
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                    placeholder="ឧទាហរណ៍៖ រាជធានីភ្នំពេញ និងខេត្តកណ្តាល"
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    អំពីសេវាកម្ម និងជំនាញ (Bio)
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="រៀបរាប់អំពីប្រវត្តិការងារ ជំនាញឯកទេស គ្រឿងបន្លាស់ និងគុណភាពសេវាកម្មរបស់អ្នក..."
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                </div>

                {/* Location Picker */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    ទីតាំងមូលដ្ឋានរបស់អ្នកផ្តល់សេវា
                  </label>
                  <LocationPicker value={location} onChange={setLocation} />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
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
