"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { categoryApi } from "@/lib/api/category.api";
import { CategoryResponse, CreateCategoryRequest } from "@/types/category";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Power,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const { t } = useLanguage();

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Feedback notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);

  // Form fields
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: "",
    code: "",
    description: "",
    displayOrder: 0,
    isActive: true,
  });

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const isActiveParam = statusFilter === "ACTIVE" ? true : statusFilter === "INACTIVE" ? false : undefined;
      const res = await categoryApi.adminList({
        search: search.trim() || undefined,
        isActive: isActiveParam,
        page: 0,
        size: 50,
      });
      setCategories(res.content || []);
    } catch {
      // If adminList fails or is empty, try getActive fallback
      try {
        const publicList = await categoryApi.getActive();
        setCategories(publicList || []);
      } catch {
        setCategories([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      displayOrder: (categories.length + 1) * 10,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryResponse) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      code: cat.code,
      description: cat.description || "",
      displayOrder: cat.displayOrder ?? 0,
      isActive: cat.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showError("សូមបញ្ចូលឈ្មោះប្រភេទសេវាកម្ម");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);

      if (editingCategory) {
        await categoryApi.update(editingCategory.id, {
          name: formData.name.trim(),
          code: formData.code ? formData.code.trim().toUpperCase() : undefined,
          description: formData.description?.trim() || undefined,
          displayOrder: Number(formData.displayOrder) || 0,
          isActive: formData.isActive,
        });
        showSuccess("ប្រភេទសេវាកម្មត្រូវបានកែប្រែជោគជ័យ!");
      } else {
        await categoryApi.create({
          name: formData.name.trim(),
          code: formData.code ? formData.code.trim().toUpperCase() : undefined,
          description: formData.description?.trim() || undefined,
          displayOrder: Number(formData.displayOrder) || 0,
          isActive: formData.isActive,
        });
        showSuccess("ប្រភេទសេវាកម្មថ្មីត្រូវបានបង្កើតជោគជ័យ!");
      }

      setIsModalOpen(false);
      loadCategories();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      showError(apiErr?.message || "បរាជ័យក្នុងការរក្សាទុកប្រភេទសេវាកម្ម");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (cat: CategoryResponse) => {
    try {
      await categoryApi.toggleStatus(cat.id);
      showSuccess(`បានប្តូរស្ថានភាព "${cat.name}" ដោយជោគជ័យ!`);
      loadCategories();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      showError(apiErr?.message || "មិនអាចប្តូរស្ថានភាពបានទេ");
    }
  };

  const handleDelete = async (cat: CategoryResponse) => {
    if (!window.confirm(`តើអ្នកពិតជាចង់លុបប្រភេទសេវាកម្ម "${cat.name}" មែនទេ?`)) {
      return;
    }

    try {
      await categoryApi.delete(cat.id);
      showSuccess(`បានលុបប្រភេទសេវា "${cat.name}" រួចរាល់!`);
      loadCategories();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      showError(apiErr?.message || "មិនអាចលុបប្រភេទសេវាកម្មបានទេ");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {t("categories")} (Service Categories)
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                គ្រប់គ្រងប្រភេទសេវាកម្មទាំងអស់នៅក្នុងទីផ្សារសេវាខ្មែរ
              </p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>បន្ថែមប្រភេទថ្មី</span>
            </button>
          </div>

          {/* Alert messages */}
          {successMsg && (
            <div className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ស្វែងរកតាមឈ្មោះ ឬ កូដប្រភេទសេវា..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              >
                <option value="ALL">ស្ថានភាពទាំងអស់</option>
                <option value="ACTIVE">សកម្ម (Active)</option>
                <option value="INACTIVE">អសកម្ម (Inactive)</option>
              </select>
            </div>
          </div>

          {/* Categories Table / List */}
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600 mb-2" />
              <span>កំពុងផ្ទុកបញ្ជីប្រភេទសេវាកម្ម...</span>
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-4">
              {/* Mobile Card View (< md) */}
              <div className="block md:hidden space-y-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 text-sm truncate">{cat.name}</h3>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                              {cat.code}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              #{cat.displayOrder ?? 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          cat.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {cat.isActive ? "សកម្ម" : "អសកម្ម"}
                      </span>
                    </div>

                    {cat.description && (
                      <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {cat.description}
                      </p>
                    )}

                    {/* Action Buttons for Mobile */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-semibold border transition text-xs ${
                          cat.isActive
                            ? "border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-100"
                            : "border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100"
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{cat.isActive ? "បិទដំណើរការ" : "បើកដំណើរការ"}</span>
                      </button>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                          title="កែសម្រួល"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                          title="លុប"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (>= md) */}
              <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-4">លំដាប់</th>
                        <th className="py-3.5 px-4">ឈ្មោះប្រភេទសេវា</th>
                        <th className="py-3.5 px-4">កូដ (Code)</th>
                        <th className="py-3.5 px-4">ការពិពណ៌នា</th>
                        <th className="py-3.5 px-4 text-center">ស្ថានភាព</th>
                        <th className="py-3.5 px-4 text-right">សកម្មភាព</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-slate-50/60 transition group">
                          <td className="py-3.5 px-4 font-semibold text-slate-400">
                            {cat.displayOrder ?? 0}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                                <Tag className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-slate-900">{cat.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[11px] font-semibold text-slate-700">
                              {cat.code}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                            {cat.description || "—"}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                cat.isActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-500 border border-slate-200"
                              }`}
                            >
                              {cat.isActive ? "សកម្ម" : "អសកម្ម"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center space-x-1">
                              <button
                                onClick={() => handleToggleStatus(cat)}
                                title={cat.isActive ? "បិទដំណើរការ" : "បើកដំណើរការ"}
                                className={`p-1.5 rounded-lg border transition ${
                                  cat.isActive
                                    ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                                    : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                }`}
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleOpenEditModal(cat)}
                                title="កែសម្រួល"
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDelete(cat)}
                                title="លុប"
                                className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Tag}
              title="មិនមានប្រភេទសេវាកម្មទេ"
              subtitle="អ្នកអាចចុចប៊ូតុង 'បន្ថែមប្រភេទថ្មី' ដើម្បីបង្កើតប្រភេទសេវាកម្មដំបូង។"
              actionLabel="បន្ថែមប្រភេទសេវា"
              onAction={handleOpenCreateModal}
            />
          )}

          {/* Modal Dialog for Create/Edit Category */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Tag className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {editingCategory ? "កែប្រែប្រភេទសេវាកម្ម" : "បន្ថែមប្រភេទសេវាកម្មថ្មី"}
                    </h3>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ឈ្មោះប្រភេទសេវា (Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ឧ. ជួសជុលម៉ាស៊ីនត្រជាក់"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      កូដសម្គាល់ (Code)
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="ឧ. AC_REPAIR, CLEANING"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      អក្សរធំ និងសញ្ញា _ (ឧ. PLUMBING)
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ការពិពណ៌នា (Description)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="រៀបរាប់សង្ខេបអំពីប្រភេទសេវាកម្មនេះ..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        លំដាប់បង្ហាញ (Display Order)
                      </label>
                      <input
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ស្ថានភាព (Status)
                      </label>
                      <select
                        value={formData.isActive ? "true" : "false"}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      >
                        <option value="true">សកម្ម (Active)</option>
                        <option value="false">អសកម្ម (Inactive)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
                    >
                      បោះបង់
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-60"
                    >
                      {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{editingCategory ? "រក្សាទុកការកែប្រែ" : "បង្កើតប្រភេទថ្មី"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
