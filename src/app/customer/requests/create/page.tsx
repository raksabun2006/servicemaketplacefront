"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { ServiceCategory } from "@/types/service-request";
import { LocationPicker, LocationData } from "@/components/ui/LocationPicker";
import { fileApi } from "@/lib/api/file.api";
import {
  Wind,
  Zap,
  Droplets,
  Sparkles,
  Hammer,
  Paintbrush,
  Smartphone,
  Laptop,
  Car,
  Bike,
  Wrench,
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Camera,
  Trash2,
  Loader2,
  MapPin,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

// Automatic problem keyword to category classifier
const detectCategory = (text: string): ServiceCategory => {
  const lower = text.toLowerCase();
  if (/ត្រជាក់|aircon|ac|លាងម៉ាស៊ីន|ដោះម៉ាស៊ីន/.test(lower)) return "AC_REPAIR";
  if (/ទឹក|លេច|បំពង់|ទុយោ|ម៉ាស៊ីនបូម|plumb/.test(lower)) return "PLUMBING";
  if (/ភ្លើង|ខ្សែភ្លើង|កុងតាក់|ឌីសង់ទ័រ|ឆ្លងភ្លើង|electric/.test(lower)) return "ELECTRICAL";
  if (/សម្អាត|បោក|ធូលី|ផ្ទះបាយ|clean/.test(lower)) return "CLEANING";
  if (/ផ្ទះ|ទ្វារ|បង្អួច|ឈើ|ពិដាន|ដំបូល|តុ|កៅអី|carpenter/.test(lower)) return "CARPENTRY";
  if (/ថ្នាំ|លាប|paint/.test(lower)) return "PAINTING";
  if (/ទូរស័ព្ទ|phone|screen|iphone|samsung|អេក្រង់|កុំព្យូទ័រ|computer|pc|laptop|printer|windows|ទូរទស្សន៍|ឧបករណ៍/.test(lower)) return "APPLIANCE_REPAIR";
  if (/សត្វល្អិត|កន្លាត|ស្រមោច|កណ្តុរ/.test(lower)) return "PEST_CONTROL";
  if (/បង្រៀន|រៀន|tutor/.test(lower)) return "TUTORING";
  if (/សម្ផស្ស|កាត់សក់|make up|beauty/.test(lower)) return "BEAUTY";
  return "OTHER";
};

function CreateServiceRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  // 4-Step Process: 1 to 4
  const [step, setStep] = useState<number>(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  // Form State
  const initialProblem = searchParams.get("problem") || "";
  const initialCat = (searchParams.get("category") as ServiceCategory) || "";

  const [title, setTitle] = useState(initialProblem);
  const [category, setCategory] = useState<ServiceCategory>(
    initialCat || (initialProblem ? detectCategory(initialProblem) : "AC_REPAIR")
  );
  const [description, setDescription] = useState("");
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  const [urgent, setUrgent] = useState(false);
  const [budgetMin, setBudgetMin] = useState<string>("");
  const [budgetMax, setBudgetMax] = useState<string>("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [imageFileIds, setImageFileIds] = useState<string[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<{ id: string; url: string }[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [location, setLocation] = useState<Partial<LocationData>>({
    address: "",
    city: "Phnom Penh",
    district: "Meanchey",
    latitude: 11.5435,
    longitude: 104.8997,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Visual Category Options (Strictly typed to ServiceCategory)
  const visualCategories: { code: ServiceCategory; name: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { code: "AC_REPAIR", name: "ជួសជុលម៉ាស៊ីនត្រជាក់", icon: Wind, color: "bg-sky-50 text-sky-600" },
    { code: "PLUMBING", name: "ជាងទឹក & បំពង់ទឹក", icon: Droplets, color: "bg-blue-50 text-blue-600" },
    { code: "ELECTRICAL", name: "ជាងអគ្គិសនី & ភ្លើង", icon: Zap, color: "bg-amber-50 text-amber-600" },
    { code: "CLEANING", name: "សម្អាតផ្ទះ", icon: Sparkles, color: "bg-emerald-50 text-emerald-600" },
    { code: "CARPENTRY", name: "ជួសជុលផ្ទះ & ជាងឈើ", icon: Hammer, color: "bg-orange-50 text-orange-600" },
    { code: "PAINTING", name: "លាបថ្នាំផ្ទះ", icon: Paintbrush, color: "bg-purple-50 text-purple-600" },
    { code: "APPLIANCE_REPAIR", name: "ទូរស័ព្ទ កុំព្យូទ័រ & គ្រឿងអេឡិចត្រូនិក", icon: Smartphone, color: "bg-rose-50 text-rose-600" },
    { code: "PEST_CONTROL", name: "កំចាត់សត្វល្អិត", icon: Sparkles, color: "bg-teal-50 text-teal-600" },
    { code: "OTHER", name: "ការងារជួសជុលទូទៅ & យានយន្ត", icon: Wrench, color: "bg-slate-50 text-slate-600" },
  ];

  // Section 3: Common Problem Chips
  const commonProblems = [
    { text: "ម៉ាស៊ីនត្រជាក់មិនត្រជាក់", category: "AC_REPAIR" as ServiceCategory, icon: Wind },
    { text: "ទឹកលេច / បំពង់ទឹកខូច", category: "PLUMBING" as ServiceCategory, icon: Droplets },
    { text: "ភ្លើងមានបញ្ហា", category: "ELECTRICAL" as ServiceCategory, icon: Zap },
    { text: "ផ្ទះត្រូវការជួសជុល", category: "CARPENTRY" as ServiceCategory, icon: Hammer },
    { text: "ម៉ូតូខូច", category: "OTHER" as ServiceCategory, icon: Bike },
    { text: "ត្រូវការសម្អាតផ្ទះ", category: "CLEANING" as ServiceCategory, icon: Sparkles },
    { text: "ទូរស័ព្ទខូច", category: "APPLIANCE_REPAIR" as ServiceCategory, icon: Smartphone },
    { text: "កុំព្យូទ័រខូច", category: "APPLIANCE_REPAIR" as ServiceCategory, icon: Laptop },
  ];

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoCat = detectCategory(val);
    setCategory(autoCat);
  };

  const handleSelectCommonProblem = (probText: string, catCode: ServiceCategory) => {
    setTitle(probText);
    setCategory(catCode);
    setError(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("ទំហំរូបភាពមិនត្រូវលើសពី 10MB ទេ។");
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setError(null);
      const res = await fileApi.upload(file, "REQUEST_IMAGE");
      const url = fileApi.getFileUrl(res.url || res.id);
      setImageFileIds((prev) => [...prev, res.id]);
      setUploadedPhotos((prev) => [...prev, { id: res.id, url }]);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || "ការបញ្ចូលរូបភាពបានបរាជ័យ។");
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleRemovePhoto = (id: string) => {
    setImageFileIds((prev) => prev.filter((i) => i !== id));
    setUploadedPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Step validation
  const validateStep = (currentStep: number): boolean => {
    setError(null);
    if (currentStep === 1) {
      if (!title.trim()) {
        setError("សូមប្រាប់ពីបញ្ហារបស់អ្នក (ឧ. ម៉ាស៊ីនត្រជាក់មិនត្រជាក់)");
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!location.address?.trim()) {
        setError("សូមបញ្ចូលអាសយដ្ឋាន ឬទីតាំងដែលអ្នកចង់ឱ្យជាងទៅ។");
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      const min = budgetMin ? parseFloat(budgetMin) : undefined;
      const max = budgetMax ? parseFloat(budgetMax) : undefined;
      if (min !== undefined && max !== undefined && min > max) {
        setError("ថវិកាអប្បបរមាត្រូវតែតិចជាង ឬស្មើថវិកាអតិបរមា។");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    const min = budgetMin ? parseFloat(budgetMin) : undefined;
    const max = budgetMax ? parseFloat(budgetMax) : undefined;

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await serviceRequestApi.create({
        title: title.trim(),
        description: description.trim() || title.trim(),
        category,
        budgetMin: min,
        budgetMax: max,
        preferredDate: preferredDate || undefined,
        preferredTime: preferredTime || undefined,
        address: location.address?.trim() || "រាជធានីភ្នំពេញ",
        city: location.city || "Phnom Penh",
        district: location.district || "Meanchey",
        latitude: location.latitude || 11.5435,
        longitude: location.longitude || 104.8997,
        urgent,
        imageFileIds: imageFileIds.length > 0 ? imageFileIds : undefined,
      });

      setCreatedRequestId(res.id);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || "មិនអាចផ្សាយការងារបានទេ។ សូមពិនិត្យព័ត៌មាន ហើយព្យាយាមម្តងទៀត។");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCatObj = visualCategories.find((c) => c.code === category) || visualCategories[0];

  // Section 20: Success Celebration Screen
  if (isSuccess) {
    return (
      <ProtectedRoute allowedRoles={["CUSTOMER", "PROVIDER"]}>
        <div className="flex">
          <Sidebar />

          <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-300">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                បានទទួលបញ្ហារបស់អ្នក
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                យើងកំពុងស្វែងរកអ្នកដែលអាចជួយដោះស្រាយបញ្ហានេះ។ អ្នកជំនាញនៅជិតអ្នកនឹងឆ្លើយតបក្នុងពេលឆាប់ៗ។
              </p>
            </div>

            {/* Job Preview Summary Card */}
            <div className="w-full bg-white rounded-3xl border border-slate-200 p-5 text-left shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <selectedCatObj.icon className="w-4 h-4" />
                <span>{selectedCatObj.name}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              {description && (
                <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1 border-t border-slate-100">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{location.address || "រាជធានីភ្នំពេញ"}</span>
                </span>
                {(budgetMin || budgetMax) && (
                  <span className="flex items-center space-x-1 font-semibold text-slate-700">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>${budgetMin || "0"} - ${budgetMax || "50"}</span>
                  </span>
                )}
                {preferredDate && (
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{preferredDate} {preferredTime && `· ${preferredTime}`}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
              <Link
                href={createdRequestId ? `/customer/requests/${createdRequestId}` : "/customer/requests"}
                className="w-full sm:flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-2xl shadow-md transition text-center"
              >
                មើលការងាររបស់ខ្ញុំ
              </Link>
              <Link
                href="/"
                className="w-full sm:flex-1 py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-2xl border border-slate-200 transition text-center"
              >
                ត្រឡប់ទៅទំព័រដើម
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER", "PROVIDER"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {/* Top Progress Bar: 4 Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                ជំហាន {step} / 4
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {step === 1 && "១. មានបញ្ហាអ្វី?"}
                {step === 2 && "២. អ្នកនៅទីណា?"}
                {step === 3 && "៣. ចង់ឱ្យគេមកពេលណា?"}
                {step === 4 && "៤. ពិនិត្យព័ត៌មាន"}
              </span>
            </div>

            {/* Smooth Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center space-x-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 1: មានបញ្ហាអ្វី? (What is the problem?)               */}
          {/* ========================================================= */}
          {step === 1 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  តើអ្នកកំពុងមានបញ្ហាអ្វី?
                </h2>
                <p className="text-xs text-slate-500">
                  ប្រាប់យើងពីបញ្ហារបស់អ្នក យើងនឹងជួយស្វែងរកអ្នកជំនាញដែលស័ក្តិសម។
                </p>
              </div>

              {/* Large Problem Title Input */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="ឧទាហរណ៍៖ ម៉ាស៊ីនត្រជាក់មិនត្រជាក់"
                  className="w-full px-4 py-3.5 text-sm font-semibold bg-slate-50 border-2 border-slate-200 focus:border-blue-600 rounded-2xl focus:outline-none focus:bg-white transition"
                  autoFocus
                />
              </div>

              {/* Quick Common Problem Pills */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-slate-400">
                  ឬចុចជ្រើសរើសបញ្ហាដែលជួបញឹកញាប់៖
                </p>
                <div className="flex flex-wrap gap-2">
                  {commonProblems.map((p) => {
                    const isSelected = title === p.text;
                    const IconComponent = p.icon;
                    return (
                      <button
                        key={p.text}
                        type="button"
                        onClick={() => handleSelectCommonProblem(p.text, p.category)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition flex items-center space-x-1.5 ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-blue-600"}`} />
                        <span>{p.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Auto-detected Category Indicator */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedCatObj.color}`}>
                    <selectedCatObj.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">ប្រភេទសេវាដែលត្រូវការ</span>
                    <span className="text-xs font-bold text-slate-900">{selectedCatObj.name}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCategorySelector(!showCategorySelector)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center space-x-1"
                >
                  <span>{showCategorySelector ? "បិទ" : "ប្តូរប្រភេទសេវា"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCategorySelector ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Optional Category Override Dropdown Grid */}
              {showCategorySelector && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {visualCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.code;
                    return (
                      <button
                        key={cat.code}
                        type="button"
                        onClick={() => {
                          setCategory(cat.code as ServiceCategory);
                          setShowCategorySelector(false);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 text-xs transition ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate font-semibold">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Problem Description (Optional / Additional notes) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">
                  ពិពណ៌នាបន្ថែមបន្តិច <span className="text-slate-400 font-normal">(មិនចាំបាច់បញ្ចូលក៏បាន)</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ឧ. ម៉ាស៊ីនបើកបាន ប៉ុន្តែមិនចេញខ្យល់ត្រជាក់សោះ និងមានទឹកហៀរតិចៗ..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              {/* Photo Upload (Optional) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    បន្ថែមរូបភាពបញ្ហា <span className="text-slate-400 font-normal">(មិនចាំបាច់បញ្ចូលក៏បាន)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">អតិបរមា 5 រូប</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {uploadedPhotos.map((photo) => (
                    <div key={photo.id} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt="Photo" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-lg opacity-90 hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {uploadedPhotos.length < 5 && (
                    <label className="cursor-pointer w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/20 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 transition">
                      {isUploadingPhoto ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Camera className="w-5 h-5 mb-0.5" />
                          <span className="text-[10px] font-semibold">ថតរូប</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={isUploadingPhoto}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: អ្នកនៅទីណា? (Where are you?)                       */}
          {/* ========================================================= */}
          {step === 2 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  អ្នកនៅទីណា?
                </h2>
                <p className="text-xs text-slate-500">
                  ប្រាប់ទីតាំងរបស់អ្នក ដើម្បីស្វែងរកជាងដែលនៅជិតអ្នកបំផុត។
                </p>
              </div>

              <div className="pt-2">
                <LocationPicker
                  value={location}
                  onChange={(newLoc) => setLocation(newLoc)}
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: ចង់ឱ្យគេមកពេលណា? (When do you want them to come?) */}
          {/* ========================================================= */}
          {step === 3 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  ចង់ឱ្យគេមកពេលណា?
                </h2>
                <p className="text-xs text-slate-500">
                  ជ្រើសរើសពេលវេលា និងថវិកាដែលអ្នកចង់ចំណាយ
                </p>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    ថ្ងៃដែលចង់ឱ្យគេមក
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    ម៉ោងដែលចង់ឱ្យគេមក
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Urgent Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                <div className="flex items-center space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">ត្រូវការជាបន្ទាន់</span>
                    <span className="text-[11px] text-amber-700">ស្វែងរកជាងដែលអាចមកធ្វើភ្លាមៗក្នុងថ្ងៃនេះ</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={urgent}
                  onChange={(e) => setUrgent(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Budget in USD */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">
                  ថវិកាដែលអ្នកចង់ចំណាយ <span className="text-slate-400 font-normal">(USD $)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="text-xs font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">$</span>
                    <input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      placeholder="ទាបបំផុត ឧ. 20"
                      className="w-full pl-8 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                  <div className="relative">
                    <span className="text-xs font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">$</span>
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      placeholder="ខ្ពស់បំផុត ឧ. 50"
                      className="w-full pl-8 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: ពិនិត្យព័ត៌មាន (Review information)                 */}
          {/* ========================================================= */}
          {step === 4 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  ពិនិត្យព័ត៌មាន
                </h2>
                <p className="text-xs text-slate-500">
                  សូមពិនិត្យព័ត៌មានខាងក្រោមមុនពេលស្វែងរកអ្នកជំនាញ
                </p>
              </div>

              {/* Summary Review Card */}
              <div className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center space-x-2">
                    <selectedCatObj.icon className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">{selectedCatObj.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    កែប្រែ
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                  {description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-600 border-t border-slate-200/80">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{location.address || "រាជធានីភ្នំពេញ"}</span>
                  </div>
                  {(budgetMin || budgetMax) && (
                    <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>${budgetMin || "0"} - ${budgetMax || "50"}</span>
                    </div>
                  )}
                  {preferredDate && (
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{preferredDate} {preferredTime && `· ${preferredTime}`}</span>
                    </div>
                  )}
                  {urgent && (
                    <div className="flex items-center space-x-1.5 text-amber-700 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>ត្រូវការជាបន្ទាន់</span>
                    </div>
                  )}
                </div>

                {uploadedPhotos.length > 0 && (
                  <div className="pt-2 flex items-center space-x-2">
                    {uploadedPhotos.map((p) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={p.id} src={p.url} alt="Photo" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Action Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="inline-flex items-center space-x-1.5 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ត្រឡប់</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-2xl shadow-sm transition"
              >
                <span>បន្ត</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center space-x-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-2xl shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>កំពុងស្វែងរក...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ស្វែងរកអ្នកជួយ</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function CreateServiceRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">កំពុងដំណើរការ...</p>
        </div>
      }
    >
      <CreateServiceRequestContent />
    </Suspense>
  );
}
