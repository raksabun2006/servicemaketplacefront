"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { providerApi } from "@/lib/api/provider.api";
import { AvailabilityStatus } from "@/types/provider";
import { Clock, Calendar, Compass, Loader2, Check, AlertCircle } from "lucide-react";

export default function ProviderAvailabilityPage() {
  const { t } = useLanguage();

  const [status, setStatus] = useState<AvailabilityStatus>("AVAILABLE");
  const [workingHoursStart, setWorkingHoursStart] = useState("08:00");
  const [workingHoursEnd, setWorkingHoursEnd] = useState("18:00");
  const [workingDays, setWorkingDays] = useState("ចន្ទ - សៅរ៍ (Mon - Sat)");
  const [serviceRadiusKm, setServiceRadiusKm] = useState<number>(15);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    providerApi
      .getMyProfile()
      .then((profile) => {
        if (profile.availabilityStatus) setStatus(profile.availabilityStatus);
        if (profile.workingHoursStart) setWorkingHoursStart(profile.workingHoursStart);
        if (profile.workingHoursEnd) setWorkingHoursEnd(profile.workingHoursEnd);
        if (profile.workingDays) setWorkingDays(profile.workingDays);
        if (profile.serviceRadiusKm) setServiceRadiusKm(profile.serviceRadiusKm);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      await providerApi.updateAvailability({
        availabilityStatus: status,
        workingHoursStart,
        workingHoursEnd,
        workingDays,
        serviceRadiusKm: Number(serviceRadiusKm),
      });

      setSuccessMsg("ស្ថានភាពការងារត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setErrorMsg(apiErr?.message || "មិនអាចធ្វើបច្ចុប្បន្នភាពស្ថានភាពការងារបានទេ។");
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions: { value: AvailabilityStatus; label: string; desc: string; color: string }[] = [
    {
      value: "AVAILABLE",
      label: "អាចទទួលការងារ (Available)",
      desc: "គណនីរបស់អ្នកនឹងបង្ហាញដល់អតិថិជន និងទទួលសំណើការងារថ្មីៗ។",
      color: "border-emerald-500 bg-emerald-50/50 text-emerald-800",
    },
    {
      value: "BUSY",
      label: "កំពុងជាប់ការងារ (Busy)",
      desc: "កំពុងបំពេញការងារលើគម្រោងបច្ចុប្បន្ន មិនទាន់អាចទទួលការងារបន្ទាន់បានទេ។",
      color: "border-amber-500 bg-amber-50/50 text-amber-800",
    },
    {
      value: "OFFLINE",
      label: "មិនទំនេរ (Offline)",
      desc: "ឈប់សម្រាកបណ្តោះអាសន្ន។ មិនបង្ហាញក្នុងបញ្ជីស្វែងរក។",
      color: "border-slate-400 bg-slate-100 text-slate-800",
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("availability")}</h1>
            <p className="text-xs text-slate-500 mt-1">
              កំណត់ស្ថានភាពការងារ ម៉ោងប្រតិបត្តិការ និងកាំរង្វង់ចម្ងាយដែលអ្នកអាចចុះទៅជួសជុលបាន
            </p>
          </div>

          {successMsg && (
            <div className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">កំពុងផ្ទុក...</div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Status Radio Tiles */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-3">
                  ស្ថានភាពការងារបច្ចុប្បន្ន *
                </label>
                <div className="space-y-3">
                  {statusOptions.map((opt) => {
                    const selected = status === opt.value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => setStatus(opt.value)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start justify-between ${
                          selected ? opt.color : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold">{opt.label}</h4>
                          <p className="text-[11px] text-slate-500">{opt.desc}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            selected ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"
                          }`}
                        >
                          {selected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ម៉ោងចាប់ផ្តើមធ្វើការ
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={workingHoursStart}
                      onChange={(e) => setWorkingHoursStart(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ម៉ោងបញ្ចប់ការងារ
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={workingHoursEnd}
                      onChange={(e) => setWorkingHoursEnd(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Working Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ថ្ងៃធ្វើការក្នុងសប្តាហ៍
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={workingDays}
                    onChange={(e) => setWorkingDays(e.target.value)}
                    placeholder="ឧទាហរណ៍៖ ចន្ទ - សៅរ៍ (៨ ព្រឹក - ៦ ល្ងាច)"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Service Radius */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  កាំរង្វង់ចម្ងាយផ្តល់សេវា (គីឡូម៉ែត្រ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={serviceRadiusKm}
                    onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                  <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  អ្នកនឹងទទួលបានការជូនដំណឹងអំពីសំណើសេវាកម្មក្នុងរង្វង់ {serviceRadiusKm} km ជុំវិញទីតាំងរបស់អ្នក។
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
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
    </ProtectedRoute>
  );
}
