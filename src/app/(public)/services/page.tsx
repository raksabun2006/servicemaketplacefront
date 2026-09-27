"use client";

import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { providerApi } from "@/lib/api/provider.api";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { categoryApi } from "@/lib/api/category.api";
import {
  ProviderProfileResponse,
  NearbyProviderResponse,
} from "@/types/provider";
import {
  ServiceCategory,
  ServiceRequestSummaryResponse,
} from "@/types/service-request";
import {
  resolveToServiceCategory,
  isValidServiceCategory,
  normalizeServiceCategory,
} from "@/lib/constants/categories";
import { CategoryResponse } from "@/types/category";

import { SearchBar } from "@/components/services/SearchBar";
import {
  CategoryCard,
  POPULAR_CATEGORIES,
  mapApiCategoryToItem,
  CategoryItem,
} from "@/components/services/CategoryCard";
import {
  FilterPanel,
  FilterState,
  INITIAL_FILTERS,
} from "@/components/services/FilterPanel";
import { MobileFilterDrawer } from "@/components/services/MobileFilterDrawer";
import { ProviderCard } from "@/components/services/ProviderCard";
import { ServiceCard } from "@/components/services/ServiceCard";
import { EmptyState } from "@/components/services/EmptyState";
import { LoadingSkeleton } from "@/components/services/LoadingSkeleton";
import { ProviderMapPanel } from "@/components/services/ProviderMapPanel";

import {
  Users,
  Wrench,
  SlidersHorizontal,
  Navigation,
  ArrowUpDown,
  Map as MapIcon,
  List as ListIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  MapPin,
  Loader2,
} from "lucide-react";

type SortOption = "RELEVANT" | "NEAREST" | "RATING" | "EXPERIENCE";
type ActiveTab = "providers" | "requests";

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const isKm = language === "km";

  // Search parameters
  const initialCategoryRaw = searchParams.get("category") || "";
  const initialCategory =
    normalizeServiceCategory(initialCategoryRaw) ||
    (isValidServiceCategory(initialCategoryRaw) ? initialCategoryRaw : "");
  const initialSearch = searchParams.get("search") || "";

  // Core filter states
  const [filters, setFilters] = useState<FilterState>({
    ...INITIAL_FILTERS,
    category: initialCategory,
  });
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Active view tab: "providers" (ជាងជំនាញ) or "requests" (សំណើសេវា)
  const [activeTab, setActiveTab] = useState<ActiveTab>("providers");

  // Sort & Display options
  const [sortBy, setSortBy] = useState<SortOption>("RELEVANT");
  const [showMap, setShowMap] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Location & Geolocation state
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Data states
  const [providers, setProviders] = useState<ProviderProfileResponse[]>([]);
  const [nearbyProviders, setNearbyProviders] = useState<
    NearbyProviderResponse[]
  >([]);
  const [requests, setRequests] = useState<ServiceRequestSummaryResponse[]>([]);
  const [apiCategories, setApiCategories] = useState<CategoryResponse[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination for service requests
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequestElements, setTotalRequestElements] = useState(0);

  // 1. Fetch categories directly from API: /api/v1/categories
  useEffect(() => {
    let isMounted = true;
    setIsLoadingCategories(true);
    categoryApi
      .getActive()
      .then((res) => {
        if (!isMounted) return;
        const cats = Array.isArray(res)
          ? res
          : (res as unknown as { content?: CategoryResponse[] })?.content || [];
        setApiCategories(cats);
      })
      .catch((err) => {
        console.error("Failed to fetch categories from API:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingCategories(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch all providers from API
  const loadProviders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await providerApi.list({ page: 0, size: 100 });
      setProviders(res.content || []);
    } catch (err) {
      console.error("Failed to load providers:", err);
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. Fetch service requests from API
  const loadServiceRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const resolvedCat = filters.category
        ? (resolveToServiceCategory(filters.category) as ServiceCategory)
        : undefined;
      const res = await serviceRequestApi.browse({
        category: isValidServiceCategory(resolvedCat) ? resolvedCat : undefined,
        city: filters.city || undefined,
        district: filters.district || undefined,
        search: searchQuery.trim() || undefined,
        page: currentPage - 1,
        size: 9,
      });

      if (res && res.content) {
        setRequests(res.content);
        if (res.page) {
          setTotalPages(res.page.totalPages || 1);
          setTotalRequestElements(res.page.totalElements || 0);
        }
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Failed to load service requests:", err);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.category, filters.city, filters.district, searchQuery, currentPage]);

  // Initial load
  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  useEffect(() => {
    if (activeTab === "requests") {
      loadServiceRequests();
    }
  }, [activeTab, loadServiceRequests]);

  // GPS Location handler
  const handleDetectLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationStatus(
        isKm
          ? "ឧបករណ៍របស់អ្នកមិនគាំទ្រប្រព័ន្ធ GPS ទេ។"
          : "Geolocation is not supported by your device."
      );
      return;
    }

    setIsLocating(true);
    setLocationStatus(
      isKm
        ? "កំពុងស្វែងរកជាងនៅជិតទីតាំងរបស់អ្នក..."
        : "Detecting technicians near your location..."
    );

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        setIsLocating(false);
        setLocationStatus(
          isKm
            ? "បានរកឃើញទីតាំងបច្ចុប្បន្នរបស់អ្នក"
            : "Location detected successfully"
        );

        try {
          const res = await providerApi.getNearby({
            latitude: lat,
            longitude: lng,
            radiusKm: 25,
            page: 0,
            size: 50,
          });
          if (res && res.content) {
            setNearbyProviders(res.content);
            setSortBy("NEAREST");
          }
        } catch {
          // If nearby endpoint fails, calculate approximate distance client-side
        }
      },
      () => {
        setIsLocating(false);
        setLocationStatus(
          isKm
            ? "មិនអាចទាញយកទីតាំង GPS បានទេ។ សូមពិនិត្យការអនុញ្ញាត។"
            : "Could not access GPS. Please check location permissions."
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Distance helper (Haversine formula in KM)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Build category cards dynamically strictly from API
  const displayedCategories: CategoryItem[] = useMemo(() => {
    return apiCategories.map((apiCat) => mapApiCategoryToItem(apiCat));
  }, [apiCategories]);

  // Dynamically build filter category options strictly from API
  const dynamicCategoryOptions = useMemo(() => {
    const list: { value: string; label: string }[] = [
      { value: "", label: isKm ? "ទាំងអស់ (All)" : "All Categories" },
    ];

    const seen = new Set<string>();
    apiCategories.forEach((cat) => {
      const validCode =
        resolveToServiceCategory(cat.code) !== "OTHER"
          ? resolveToServiceCategory(cat.code)
          : resolveToServiceCategory(cat.name);
      if (!seen.has(validCode)) {
        seen.add(validCode);
        list.push({
          value: validCode,
          label: cat.name, // Display exactly from API, do not translate
        });
      }
    });

    return list;
  }, [apiCategories, isKm]);

  // Filter & Sort Providers
  const filteredProviders = useMemo(() => {
    const baseList =
      nearbyProviders.length > 0 && userLocation
        ? nearbyProviders
        : providers;

    let result = baseList.filter((p) => {
      // 1. Search Query filter (matches businessName, fullName, bio, city, district, serviceArea)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (
          p.businessName ||
          ("fullName" in p ? p.fullName : "") ||
          ""
        ).toLowerCase();
        const loc = (
          (p.city || "") +
          " " +
          (p.district || "") +
          " " +
          (p.serviceArea || "")
        ).toLowerCase();
        const bio = ("bio" in p && p.bio ? p.bio : "").toLowerCase();

        if (!name.includes(q) && !loc.includes(q) && !bio.includes(q)) {
          return false;
        }
      }

      // 2. City / Province filter
      if (filters.city) {
        const pCity = (p.city || p.serviceArea || "").toLowerCase();
        const filterCity = filters.city.toLowerCase();
        if (!pCity.includes(filterCity)) return false;
      }

      // 3. District filter
      if (filters.district) {
        const pDistrict = (p.district || p.serviceArea || "").toLowerCase();
        const filterDist = filters.district.toLowerCase();
        if (!pDistrict.includes(filterDist)) return false;
      }

      // 4. Category filter (matches category code or localized name)
      if (filters.category) {
        const filterCat = filters.category.toLowerCase().replace(/_/g, " ");
        const matchedCat = displayedCategories.find((c) => c.code === filters.category);
        const catName = matchedCat ? matchedCat.name.toLowerCase() : "";

        const bio = ("bio" in p && p.bio ? p.bio : "").toLowerCase();
        const area = (p.serviceArea || "").toLowerCase();
        const bName = (p.businessName || "").toLowerCase();

        const matchesCode = bio.includes(filterCat) || area.includes(filterCat) || bName.includes(filterCat);
        const matchesName = catName ? bio.includes(catName) || area.includes(catName) || bName.includes(catName) : false;

        if (!matchesCode && !matchesName) return false;
      }

      // 5. Rating filter
      if (filters.minRating) {
        const rating = p.averageRating || 0;
        if (rating < Number(filters.minRating)) return false;
      }

      // 6. Price filter
      if (filters.minPrice) {
        const rate = p.hourlyRate || 0;
        if (rate < Number(filters.minPrice)) return false;
      }
      if (filters.maxPrice) {
        const rate = p.hourlyRate || 0;
        if (rate > Number(filters.maxPrice)) return false;
      }

      // 7. Availability status filter
      if (filters.status === "AVAILABLE") {
        const isAvail =
          p.availabilityStatus === "AVAILABLE" ||
          ("isAvailable" in p && p.isAvailable === true);
        if (!isAvail) return false;
      } else if (filters.status === "ACTIVE") {
        const isNotOffline = p.availabilityStatus !== "OFFLINE";
        if (!isNotOffline) return false;
      }

      // 8. Distance filter if user location is available
      if (filters.distanceKm && userLocation) {
        let dist = "distanceKm" in p ? p.distanceKm : undefined;
        if (dist === undefined && "latitude" in p && "longitude" in p) {
          const lat = (p as ProviderProfileResponse).latitude;
          const lng = (p as ProviderProfileResponse).longitude;
          if (lat && lng) {
            dist = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
          }
        }
        if (dist !== undefined && dist > Number(filters.distanceKm)) {
          return false;
        }
      }

      return true;
    });

    // Client-side Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "RATING") {
        return (b.averageRating || 0) - (a.averageRating || 0);
      }
      if (sortBy === "EXPERIENCE") {
        const expA = "experienceYears" in a ? a.experienceYears || 0 : 0;
        const expB = "experienceYears" in b ? b.experienceYears || 0 : 0;
        return expB - expA;
      }
      if (sortBy === "NEAREST") {
        const distA = "distanceKm" in a ? a.distanceKm || 999 : 999;
        const distB = "distanceKm" in b ? b.distanceKm || 999 : 999;
        return distA - distB;
      }
      // RELEVANT (Default): Verified first, then rating
      const vA = a.isVerified ? 1 : 0;
      const vB = b.isVerified ? 1 : 0;
      if (vA !== vB) return vB - vA;
      return (b.averageRating || 0) - (a.averageRating || 0);
    });

    return result;
  }, [
    providers,
    nearbyProviders,
    searchQuery,
    filters,
    sortBy,
    userLocation,
    displayedCategories,
  ]);

  // Provider category count helper
  const getCategoryProviderCount = (code: string, name?: string) => {
    const lowerCode = code.toLowerCase().replace(/_/g, " ");
    const lowerName = (name || "").toLowerCase();
    return providers.filter((p) => {
      const bio = ("bio" in p && p.bio ? p.bio : "").toLowerCase();
      const area = (p.serviceArea || "").toLowerCase();
      const bName = (p.businessName || "").toLowerCase();
      return (
        bio.includes(lowerCode) ||
        area.includes(lowerCode) ||
        bName.includes(lowerCode) ||
        (lowerName && (bio.includes(lowerName) || area.includes(lowerName) || bName.includes(lowerName)))
      );
    }).length;
  };

  const selectedCategoryLabel = useMemo(() => {
    if (!filters.category) return isKm ? "ជាងជំនាញ" : "Technicians";
    const found = displayedCategories.find((c) => c.code === filters.category);
    return found ? found.name : filters.category;
  }, [filters.category, displayedCategories, isKm]);

  // Reset all filters
  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery("");
    setUserLocation(null);
    setNearbyProviders([]);
    setLocationStatus(null);
    setCurrentPage(1);
    setSortBy("RELEVANT");
  };

  // Category card click toggle
  const handleCategoryCardClick = (code: string) => {
    const newCategory = filters.category === code ? "" : code;
    setFilters((prev) => ({
      ...prev,
      category: newCategory,
    }));
    setCurrentPage(1);
  };

  // Active filter count for mobile badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.city) count++;
    if (filters.district) count++;
    if (filters.category) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minRating) count++;
    if (filters.status !== "ALL") count++;
    if (filters.distanceKm) count++;
    return count;
  }, [filters]);

  const currentResultCount =
    activeTab === "providers"
      ? filteredProviders.length
      : totalRequestElements || requests.length;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-28 md:pb-20">
      {/* 1. Hero / Search Section - Clean, Light & Minimal matching Home Page */}
      <section className="relative overflow-hidden bg-white pt-6 pb-6 sm:pt-10 sm:pb-12 px-3 sm:px-6 lg:px-8 border-b border-slate-100">
        {/* Subtle decorative circuit lines identical to Home Page */}
        <div className="absolute inset-0 pointer-events-none opacity-20 sm:opacity-25">
          <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none">
            <path
              d="M-50 200 L 250 200 L 320 280 L 520 280 M 180 200 L 240 140 L 400 140 M 350 280 L 350 360 L 480 360"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <circle cx="250" cy="200" r="4" fill="#94a3b8" />
            <circle cx="320" cy="280" r="4" fill="#94a3b8" />
            <circle cx="520" cy="280" r="4" fill="#94a3b8" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-2 sm:space-y-3">
          {/* Eyebrow badge matching Home Page */}
          <span className="text-xs sm:text-sm font-semibold text-blue-600 block tracking-wide">
            {isKm
              ? "ថ្នាលស្វែងរកសេវាកម្មកម្ពុជា (Khmer Service)"
              : "Cambodia Service Marketplace"}
          </span>

          {/* Main Heading in Brand Blue */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#104ccb] tracking-tight leading-snug sm:leading-tight">
            {isKm ? "ស្វែងរកសេវាកម្មដែលអ្នកត្រូវការ" : "Find the Services You Need"}
          </h1>

          {/* Supporting Text */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            {isKm
              ? "ស្វែងរកអ្នកផ្តល់សេវាកម្មនៅជិតអ្នក និងទាក់ទងជាងជំនាញដែលសាកសមនឹងតម្រូវការរបស់អ្នក"
              : "Find trusted local service providers near you and connect with experienced technicians directly"}
          </p>

          {/* Large Clean Search Box with Khmer City Selector */}
          <div className="pt-2 sm:pt-4 max-w-3xl mx-auto text-left">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCity={filters.city}
              onCityChange={(city) => {
                setFilters((prev) => ({
                  ...prev,
                  city,
                  district: "",
                }));
              }}
              onSearchSubmit={() => {
                if (activeTab === "requests") loadServiceRequests();
              }}
              onNearMeClick={handleDetectLocation}
              isLocating={isLocating}
            />
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-8 space-y-5 sm:space-y-8">
        {/* 2. Popular Service Categories (Section 4) - Native mobile swipe carousel */}
        <section aria-labelledby="popular-categories-title">
          <div className="flex items-center justify-between mb-2.5 sm:mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2
                id="popular-categories-title"
                className="text-sm sm:text-xl font-bold text-slate-900"
              >
                {isKm ? "ប្រភេទសេវាកម្មពេញនិយម" : "Popular Service Categories"}
              </h2>
            </div>
            {filters.category && (
              <button
                type="button"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, category: "" }))
                }
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition cursor-pointer"
              >
                {isKm ? "បង្ហាញទាំងអស់" : "Show All"}
              </button>
            )}
          </div>

          {/* Category Cards: Horizontal swipe carousel on mobile, responsive grid on desktop */}
          {isLoadingCategories ? (
            <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-2.5 overflow-x-auto scrollbar-none pb-1.5 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="min-w-[130px] sm:min-w-0 flex-shrink-0 h-24 sm:h-28 rounded-2xl bg-white border border-slate-200 p-3 sm:p-4 animate-pulse space-y-2"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-200" />
                  <div className="h-3 sm:h-4 bg-slate-200 rounded-md w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-2.5 overflow-x-auto scrollbar-none pb-1.5 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
              {displayedCategories.map((cat) => (
                <CategoryCard
                  key={cat.id || cat.code}
                  category={cat}
                  isSelected={filters.category === cat.code}
                  count={getCategoryProviderCount(cat.code, cat.name)}
                  onClick={() => handleCategoryCardClick(cat.code)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 3. Location-Based Discovery Bar: "ជាងនៅជិតអ្នក" - Clean & Minimal */}
        <section className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-[#104ccb] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#104ccb]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-0.5">
                <h3 className="text-xs sm:text-base font-bold text-slate-900 truncate">
                  {isKm ? "ជាងនៅជិតអ្នក" : "Technicians Near You"}
                </h3>
                {userLocation && (
                  <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    <span>{isKm ? "GPS បានភ្ជាប់" : "GPS Connected"}</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-none mt-0.5">
                {locationStatus ||
                  (isKm
                    ? "បើកទីតាំង GPS ដើម្បីស្វែងរកជាងជំនាញនៅក្បែរផ្ទះរបស់អ្នកឆាប់រហ័ស"
                    : "Enable GPS location to find experienced technicians near you quickly")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            {/* GPS Locate Button */}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#104ccb] text-xs font-bold transition border border-blue-200/80 cursor-pointer"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 text-[#104ccb] animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-[#104ccb]" />
              )}
              <span className="truncate">
                {userLocation
                  ? (isKm ? "បច្ចុប្បន្នភាពទីតាំង" : "Update Location")
                  : (isKm ? "រកជាងជិតខ្ញុំ" : "Find Near Me")}
              </span>
            </button>

            {/* Map / List View Toggle */}
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className={`inline-flex items-center justify-center space-x-1.5 h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl border text-xs font-bold transition cursor-pointer shrink-0 ${
                showMap
                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {showMap ? (
                <>
                  <ListIcon className="w-3.5 h-3.5" />
                  <span>{isKm ? "បិទផែនទី" : "Close Map"}</span>
                </>
              ) : (
                <>
                  <MapIcon className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isKm ? "ផែនទី" : "Map"}</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Map Panel Preview (When toggled open) */}
        {showMap && (
          <div className="animate-in fade-in duration-200">
            <ProviderMapPanel
              providers={filteredProviders}
              userLocation={userLocation}
            />
          </div>
        )}

        {/* 4. Service Discovery Layout (Section 5, 6, 7, 8) */}
        <section aria-labelledby="available-services-title">
          {/* Main Discovery Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200">
            <div>
              <h2
                id="available-services-title"
                className="text-base sm:text-2xl font-bold text-slate-900"
              >
                {isKm ? "សេវាកម្មដែលអាចរកបាន" : "Available Services"}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                {isKm
                  ? "ប្រៀបធៀប និងទាក់ទងជាងជំនាញ ឬស្វែងរកសំណើការងារ"
                  : "Compare and connect with technicians, or explore job requests"}
              </p>
            </div>

            {/* Tab switch between ជាងជំនាញ (Providers) and សំណើសេវា (Requests) */}
            <div className="grid grid-cols-2 sm:inline-flex items-center p-1 rounded-xl bg-slate-200/80 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("providers")}
                className={`inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "providers"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{isKm ? "ជាងជំនាញ" : "Technicians"}</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800">
                  {filteredProviders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("requests")}
                className={`inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "requests"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{isKm ? "សំណើសេវា" : "Job Requests"}</span>
                {totalRequestElements > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800">
                    {totalRequestElements}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Layout: LEFT Filter Sidebar (280px), RIGHT Results */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-8 items-start">
            {/* Desktop Left Sidebar Filters */}
            <aside className="hidden lg:block lg:col-span-1 sticky top-24">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={handleClearFilters}
                totalResults={currentResultCount}
                categoryOptions={dynamicCategoryOptions}
                isLoadingCategories={isLoadingCategories}
              />
            </aside>

            {/* Right Column: Result Header + Cards Grid + Pagination */}
            <div className="lg:col-span-3 space-y-5">
              {/* 5. Result Header (Section 7) */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 text-xs font-bold shadow-2xs transition cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isKm ? "តម្រង" : "Filters"}</span>
                  {activeFiltersCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Dynamic Result Count: "ជាង និងសេវាកម្ម 24 នាក់" / "Providers & Services: 24 found" */}
                <div className="text-xs sm:text-sm font-bold text-slate-800">
                  <span>{isKm ? "ជាង និងសេវាកម្ម " : "Providers & Services: "}</span>
                  <span className="text-blue-700 font-extrabold">
                    {currentResultCount}
                  </span>
                  <span>{isKm ? " នាក់" : " found"}</span>
                </div>

                {/* Sort Dropdown: "តម្រៀបតាម" */}
                <div className="flex items-center space-x-1.5 ml-auto">
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    {isKm ? "តម្រៀបតាម៖" : "Sort by:"}
                  </span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="text-xs text-slate-800 font-bold py-1.5 pl-2.5 pr-7 sm:py-2 sm:pl-3 sm:pr-8 rounded-xl border border-slate-200 bg-white focus:border-blue-500 outline-none cursor-pointer shadow-2xs appearance-none"
                    >
                      <option value="RELEVANT">{isKm ? "ពាក់ព័ន្ធបំផុត" : "Most Relevant"}</option>
                      <option value="NEAREST">{isKm ? "ជិតបំផុត" : "Nearest Distance"}</option>
                      <option value="RATING">{isKm ? "វាយតម្លៃខ្ពស់" : "Highest Rated"}</option>
                      <option value="EXPERIENCE">{isKm ? "បទពិសោធន៍ច្រើន" : "Most Experienced"}</option>
                    </select>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Active Filter Pills (if any active) */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-400 font-medium text-[11px]">
                    {isKm ? "តម្រងដែលបានជ្រើសរើស៖" : "Active Filters:"}
                  </span>
                  {filters.category && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                      <span>{isKm ? "ប្រភេទ៖ " : "Category: "}{selectedCategoryLabel}</span>
                    </span>
                  )}
                  {filters.city && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                      <span>{isKm ? "ខេត្ត៖ " : "City: "}{filters.city}</span>
                    </span>
                  )}
                  {filters.district && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                      <span>{isKm ? "ខណ្ឌ៖ " : "District: "}{filters.district}</span>
                    </span>
                  )}
                  {filters.minRating && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                      <span>{filters.minRating}+ {isKm ? "ផ្កាយ" : "Stars"}</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-[11px] text-red-600 hover:text-red-700 font-bold ml-1 transition"
                  >
                    {isKm ? "លុបទាំងអស់" : "Clear All"}
                  </button>
                </div>
              )}

              {/* 6. Cards Grid / Loading State / Empty State */}
              {isLoading ? (
                <LoadingSkeleton
                  count={6}
                  viewMode={activeTab}
                />
              ) : activeTab === "providers" ? (
                filteredProviders.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                    {filteredProviders.map((provider) => (
                      <ProviderCard
                        key={provider.id}
                        provider={provider}
                        categoryLabel={selectedCategoryLabel}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    onClearFilters={handleClearFilters}
                    onViewAllServices={() => {
                      handleClearFilters();
                      setActiveTab("providers");
                    }}
                    title={
                      isKm
                        ? "មិនទាន់មានជាងសម្រាប់ការស្វែងរកនេះ"
                        : "No Technicians Found"
                    }
                    description={
                      isKm
                        ? "សាកល្បងប្តូរប្រភេទសេវា ឬទីតាំងរបស់អ្នកដើម្បីស្វែងរកជាងជំនាញផ្សេងទៀត"
                        : "Try adjusting your category, search query, or location filters"
                    }
                  />
                )
              ) : requests.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                  {requests.map((req) => (
                    <ServiceCard
                      key={req.id}
                      request={req}
                      categoryLabel={req.category || (isKm ? "សេវាកម្ម" : "Service")}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  onClearFilters={handleClearFilters}
                  onViewAllServices={() => {
                    handleClearFilters();
                    setActiveTab("requests");
                  }}
                  title={
                    isKm
                      ? "មិនទាន់មានសំណើសេវាកម្មក្នុងលក្ខខណ្ឌនេះទេ"
                      : "No Job Requests Found"
                  }
                  description={
                    isKm
                      ? "សូមសាកល្បងសម្អាតតម្រង ឬបង្ហោះសំណើថ្មីដើម្បីស្វែងរកជាងជំនាញ"
                      : "Try clearing filters or posting a new service request"
                  }
                />
              )}

              {/* Numbered Pagination (for service requests) */}
              {activeTab === "requests" && totalPages > 1 && (
                <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-blue-600 disabled:opacity-40 transition shadow-2xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-blue-500"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-blue-600 disabled:opacity-40 transition shadow-2xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 7. Bottom Khmer Trust Banner - Clean, simple & light matching Home Page */}
        <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-50 via-white to-blue-50/60 border border-blue-200/90 p-5 sm:p-8 text-slate-800 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xs">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-100/80 text-[11px] sm:text-xs font-bold text-[#104ccb]">
              <Sparkles className="w-3 h-3 text-[#104ccb]" />
              <span>{isKm ? "ថ្នាលសេវាកម្មកម្ពុជា" : "Cambodia Service Hub"}</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-[#104ccb]">
              {isKm ? "ត្រូវការជាងជំនាញ ឬចង់ផ្ដល់សេវាកម្ម?" : "Need a Technician or Want to Offer Services?"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-normal leading-relaxed">
              {isKm
                ? "ផ្ញើសំណើការងារជួសជុលគេហដ្ឋានរបស់អ្នក ឬចុះឈ្មោះជាជាងជំនាញដើម្បីទទួលបានការងារជារៀងរាល់ថ្ងៃ។"
                : "Post your repair or maintenance needs, or sign up as a certified technician to receive jobs daily."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 w-full sm:w-auto shrink-0">
            <Link
              href="/customer/requests/create"
              className="px-5 py-2.5 rounded-xl sm:rounded-full bg-[#104ccb] hover:bg-[#0a3ca8] text-white text-xs font-bold text-center shadow-sm shadow-blue-600/20 transition"
            >
              {isKm ? "បង្ហោះបញ្ហាត្រូវការជាង" : "Post a Service Request"}
            </Link>
            <Link
              href="/register?role=provider"
              className="px-5 py-2.5 rounded-xl sm:rounded-full bg-white hover:bg-blue-50 text-[#104ccb] border border-blue-200 text-xs font-bold text-center transition"
            >
              {isKm ? "ចុះឈ្មោះជាជាងជំនាញ" : "Register as Technician"}
            </Link>
          </div>
        </section>
      </main>

      {/* Mobile Filter Drawer (Bottom Sheet) */}
      <MobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={handleClearFilters}
        totalResults={currentResultCount}
        categoryOptions={dynamicCategoryOptions}
        isLoadingCategories={isLoadingCategories}
      />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center text-xs text-slate-400">
          Loading...
        </div>
      }
    >
      <ServicesPageContent />
    </Suspense>
  );
}
