"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { MapPin, Navigation, AlertCircle, Check } from "lucide-react";

export interface LocationData {
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  value: Partial<LocationData>;
  onChange: (data: LocationData) => void;
}

// Cambodian administrative hierarchy with coordinates
interface DistrictDetail {
  khmer: string;
  lat: number;
  lng: number;
  sangkats: string[];
}

interface ProvinceDetail {
  khmer: string;
  districts: Record<string, DistrictDetail>;
}

const CAMBODIA_LOCATIONS: Record<string, ProvinceDetail> = {
  "Phnom Penh": {
    khmer: "រាជធានីភ្នំពេញ",
    districts: {
      "Meanchey": {
        khmer: "ខណ្ឌមានជ័យ",
        lat: 11.5284,
        lng: 104.9125,
        sangkats: ["បឹងទំពុន", "ស្ទឹងមានជ័យ", "ចាក់អង្រែលើ", "ចាក់អង្រែក្រោម"],
      },
      "Chamkarmon": {
        khmer: "ខណ្ឌចំការមន",
        lat: 11.5448,
        lng: 104.9282,
        sangkats: ["ទន្លេបាសាក់", "ផ្សារដើមថ្កូវ", "បឹងត្របែក", "ទួលទំពូង"],
      },
      "Daun Penh": {
        khmer: "ខណ្ឌដូនពេញ",
        lat: 11.5714,
        lng: 104.9282,
        sangkats: ["ផ្សារកណ្តាល", "ផ្សារចាស់", "ផ្សារថ្មី", "ជ័យជំនះ", "វត្តភ្នំ"],
      },
      "Toul Kork": {
        khmer: "ខណ្ឌទួលគោក",
        lat: 11.5739,
        lng: 104.8994,
        sangkats: ["បឹងកក់", "ផ្សារដេប៉ូ", "ទឹកល្អក់", "ផ្សារដើមគ"],
      },
      "Sen Sok": {
        khmer: "ខណ្ឌសែនសុខ",
        lat: 11.5833,
        lng: 104.8722,
        sangkats: ["ភ្នំពេញថ្មី", "ទឹកថ្លា", "ឃ្មួញ", "អូរបែកក្អម"],
      },
      "Boeung Keng Kang": {
        khmer: "ខណ្ឌបឹងកេងកង",
        lat: 11.5529,
        lng: 104.9221,
        sangkats: ["បឹងកេងកងទី១", "បឹងកេងកងទី២", "បឹងកេងកងទី៣", "អូឡាំពិក", "ទួលស្វាយព្រៃ"],
      },
      "Por Senchey": {
        khmer: "ខណ្ឌពោធិ៍សែនជ័យ",
        lat: 11.5467,
        lng: 104.8456,
        sangkats: ["ចោមចៅ", "កាកាប", "សំរោងក្រោម"],
      },
      "Russey Keo": {
        khmer: "ខណ្ឌឫស្សីកែវ",
        lat: 11.6067,
        lng: 104.9136,
        sangkats: ["ទួលសង្កែ", "ឫស្សីកែវ", "ច្រាំងចំរេះ", "គីឡូម៉ែត្រលេខ៦"],
      },
      "Chbar Ampov": {
        khmer: "ខណ្ឌច្បារអំពៅ",
        lat: 11.5298,
        lng: 104.9458,
        sangkats: ["ច្បារអំពៅទី១", "ច្បារអំពៅទី២", "និរោធ", "ព្រែកប្រា"],
      },
      "Chroy Changvar": {
        khmer: "ខណ្ឌជ្រោយចង្វារ",
        lat: 11.5975,
        lng: 104.9358,
        sangkats: ["ជ្រោយចង្វារ", "ព្រែកលៀប", "ព្រែកតាសេក"],
      },
      "Dangkao": {
        khmer: "ខណ្ឌដង្កោ",
        lat: 11.4886,
        lng: 104.8694,
        sangkats: ["ដង្កោ", "ព្រៃស", "ជើងឯក", "ពងទឹក"],
      },
    },
  },
  "Siem Reap": {
    khmer: "ខេត្តសៀមរាប",
    districts: {
      "Siem Reap Central": {
        khmer: "ក្រុងសៀមរាប",
        lat: 13.3671,
        lng: 103.8448,
        sangkats: ["ស្វាយដង្គំ", "ស្លក្រាម", "គោកចក", "សាលាកំរើក"],
      },
    },
  },
  "Battambang": {
    khmer: "ខេត្តបាត់ដំបង",
    districts: {
      "Battambang Central": {
        khmer: "ក្រុងបាត់ដំបង",
        lat: 13.0957,
        lng: 103.2022,
        sangkats: ["ស្វាយប៉ោ", "ព្រែកព្រះស្តេច", "រតនៈ", "ចំការសំរោង"],
      },
    },
  },
  "Preah Sihanouk": {
    khmer: "ខេត្តព្រះសីហនុ",
    districts: {
      "Sihanoukville": {
        khmer: "ក្រុងព្រះសីហនុ",
        lat: 10.6275,
        lng: 103.5222,
        sangkats: ["សង្កាត់លេខ១", "សង្កាត់លេខ២", "សង្កាត់លេខ៣", "សង្កាត់លេខ៤"],
      },
    },
  },
  "Kampot": {
    khmer: "ខេត្តកំពត",
    districts: {
      "Kampot Central": {
        khmer: "ក្រុងកំពត",
        lat: 10.6104,
        lng: 104.1815,
        sangkats: ["កំពង់កណ្តាល", "កំពង់បាយ", "អណ្តូងខ្មែរ", "ត្រើយកោះ"],
      },
    },
  },
  "Kandal": {
    khmer: "ខេត្តកណ្តាល",
    districts: {
      "Ta Khmau": {
        khmer: "ក្រុងតាខ្មៅ",
        lat: 11.4833,
        lng: 104.95,
        sangkats: ["តាខ្មៅ", "ព្រែកឫស្សី", "ដើមមៀន", "កំពង់សំណាញ់"],
      },
    },
  },
};

export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
  const { t } = useLanguage();
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  // Selected city/province key (default Phnom Penh)
  const [selectedCity, setSelectedCity] = useState<string>(value.city || "Phnom Penh");
  const [selectedDistrict, setSelectedDistrict] = useState<string>(value.district || "Meanchey");
  const [selectedSangkat, setSelectedSangkat] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>(value.address || "");

  const activeProvince = CAMBODIA_LOCATIONS[selectedCity] || CAMBODIA_LOCATIONS["Phnom Penh"];
  const availableDistricts = activeProvince.districts;
  const activeDistrictDetail = availableDistricts[selectedDistrict] || Object.values(availableDistricts)[0];
  const availableSangkats = activeDistrictDetail?.sangkats || [];

  const updateLocation = (
    cityKey: string,
    districtKey: string,
    sangkatVal: string,
    streetVal: string,
    customLat?: number,
    customLng?: number
  ) => {
    const prov = CAMBODIA_LOCATIONS[cityKey] || CAMBODIA_LOCATIONS["Phnom Penh"];
    const distDetail = prov.districts[districtKey] || Object.values(prov.districts)[0];
    const lat = customLat ?? distDetail?.lat ?? 11.5435;
    const lng = customLng ?? distDetail?.lng ?? 104.8997;

    // Build standard natural address: e.g. "ផ្ទះលេខ 12, ផ្លូវ 271, សង្កាត់បឹងទំពុន, ខណ្ឌមានជ័យ, រាជធានីភ្នំពេញ"
    const parts = [
      streetVal.trim(),
      sangkatVal ? `សង្កាត់${sangkatVal}` : "",
      distDetail?.khmer || districtKey,
      prov.khmer,
    ].filter(Boolean);

    const fullAddress = parts.join(", ");

    onChange({
      address: fullAddress || streetVal || distDetail?.khmer || "រាជធានីភ្នំពេញ",
      city: cityKey,
      district: distDetail?.khmer || districtKey,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleCityChange = (cityKey: string) => {
    setSelectedCity(cityKey);
    const newProv = CAMBODIA_LOCATIONS[cityKey];
    const firstDistrictKey = Object.keys(newProv.districts)[0] || "";
    setSelectedDistrict(firstDistrictKey);
    setSelectedSangkat("");
    updateLocation(cityKey, firstDistrictKey, "", streetAddress);
  };

  const handleDistrictChange = (distKey: string) => {
    setSelectedDistrict(distKey);
    setSelectedSangkat("");
    updateLocation(selectedCity, distKey, "", streetAddress);
  };

  const handleSangkatChange = (sangkat: string) => {
    setSelectedSangkat(sangkat);
    updateLocation(selectedCity, selectedDistrict, sangkat, streetAddress);
  };

  const handleStreetChange = (text: string) => {
    setStreetAddress(text);
    updateLocation(selectedCity, selectedDistrict, selectedSangkat, text);
  };

  const confirmGpsAccess = () => {
    setShowPrompt(false);
    if (!navigator.geolocation) {
      setGpsError(t("locationDenied"));
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        updateLocation(selectedCity, selectedDistrict, selectedSangkat, streetAddress || "ទីតាំងបច្ចុប្បន្ន", lat, lng);
      },
      () => {
        setIsLocating(false);
        setGpsError(t("locationDenied"));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-3">
      {/* GPS Dialog */}
      {showPrompt && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
          <div className="flex items-start space-x-2.5">
            <Navigation className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-blue-900">{t("locationPrompt")}</h4>
              <p className="text-[11px] text-blue-700/90 mt-0.5 leading-relaxed">
                ប្រព័ន្ធនឹងស្វែងរកអ្នកផ្តល់សេវាដែលនៅជិតអ្នកបំផុតដោយផ្អែកលើកូអរដោនេ GPS។
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <button
              type="button"
              onClick={confirmGpsAccess}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
            >
              អនុញ្ញាតទីតាំង (Allow)
            </button>
            <button
              type="button"
              onClick={() => setShowPrompt(false)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition"
            >
              បោះបង់
            </button>
          </div>
        </div>
      )}

      {gpsError && (
        <div className="flex items-center space-x-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Cambodian Cascading Selectors: City/Province + District/Khan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            រាជធានី/ខេត្ត
          </label>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          >
            {Object.entries(CAMBODIA_LOCATIONS).map(([key, prov]) => (
              <option key={key} value={key}>
                {prov.khmer} ({key})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            ខណ្ឌ/ស្រុក
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          >
            {Object.entries(availableDistricts).map(([key, d]) => (
              <option key={key} value={key}>
                {d.khmer} ({key})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sangkat / Commune Selector */}
      {availableSangkats.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            សង្កាត់/ឃុំ (ជម្រើស)
          </label>
          <select
            value={selectedSangkat}
            onChange={(e) => handleSangkatChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          >
            <option value="">-- ជ្រើសរើសសង្កាត់ --</option>
            {availableSangkats.map((s) => (
              <option key={s} value={s}>
                សង្កាត់{s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Detailed Street Address / House number */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-semibold text-slate-700">
            ផ្ទះលេខ / ផ្លូវ (Street & House)
          </label>
          <button
            type="button"
            onClick={() => setShowPrompt(true)}
            disabled={isLocating}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin text-blue-600" : ""}`} />
            <span>{isLocating ? "កំពុងកំណត់ទីតាំង..." : "ប្រើទីតាំងបច្ចុប្បន្ន (GPS)"}</span>
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={streetAddress}
            onChange={(e) => handleStreetChange(e.target.value)}
            placeholder="ឧ. ផ្ទះលេខ 12, ផ្លូវ 271..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Coordinates confirmed */}
      {value.latitude && value.longitude ? (
        <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            កូអរដោនេ GPS៖ {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)}
          </span>
        </div>
      ) : null}
    </div>
  );
};

