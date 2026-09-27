import { ImageResponse } from "next/og";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { slugToCategory } from "@/lib/seo";
import { fileApi } from "@/lib/api/file.api";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Check if Category Landing Page
  const categorySeo = slugToCategory(id);
  if (categorySeo) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0b132b",
            backgroundImage:
              "radial-gradient(circle at 15% 15%, rgba(16, 76, 203, 0.45) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(30, 58, 138, 0.4) 0%, transparent 50%)",
            padding: "50px 60px",
            fontFamily: "system-ui, sans-serif",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
                    stroke="#104ccb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 21V12h6v9"
                    stroke="#104ccb"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff" }}>
                  ខ្មែរ សេវា
                </span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#93c5fd" }}>
                  Khmer Service Marketplace
                </span>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "rgba(16, 76, 203, 0.3)",
                border: "1px solid rgba(147, 197, 253, 0.4)",
                color: "#bfdbfe",
                fontSize: "14px",
                fontWeight: 700,
                padding: "8px 18px",
                borderRadius: "9999px",
              }}
            >
              {categorySeo.englishTitle}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: 900,
                lineHeight: 1.25,
                color: "#ffffff",
                margin: 0,
              }}
            >
              {categorySeo.khmerTitle}
            </h1>
            <p
              style={{
                fontSize: "20px",
                color: "#cbd5e1",
                maxWidth: "800px",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {categorySeo.metaDescription.slice(0, 140)}...
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ fontSize: "15px", color: "#94a3b8" }}>
              🇰🇭 ស្វែងរកជាងជំនាញដែលមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវនៅកម្ពុជា
            </div>
            <div style={{ fontSize: "15px", color: "#60a5fa", fontWeight: 700 }}>
              servicemaketplacefront.vercel.app
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // 2. Specific Service Request
  let request = null;
  try {
    request = await serviceRequestApi.getById(id);
  } catch {
    // ignore
  }

  const title = request?.title || "សំណើសេវាកម្ម | ខ្មែរ សេវា";
  const category = request?.category || "សេវាកម្ម";
  const city = request?.district
    ? `${request.district}, ${request.city || "Phnom Penh"}`
    : request?.city || "Phnom Penh";
  const urgent = Boolean(request?.urgent);
  const budget = request?.budgetMax
    ? `$${request.budgetMax}`
    : request?.budgetMin
    ? `$${request.budgetMin}`
    : "";

  // Check if request has an uploaded photo
  const rawImages = (
    request?.imageUrls && request.imageUrls.length > 0
      ? request.imageUrls
      : ((request as unknown as { imageFileIds?: string[] })?.imageFileIds || [])
  ).filter(Boolean);

  let photoUrl: string | null = null;
  if (rawImages.length > 0) {
    const rawUrl = fileApi.getFileUrl(rawImages[0]);
    if (rawUrl && (rawUrl.startsWith("http://") || rawUrl.startsWith("https://"))) {
      try {
        const imgRes = await fetch(rawUrl, {
          headers: { Accept: "image/*" },
          signal: AbortSignal.timeout(2500),
        });
        if (imgRes.ok) {
          const cType = imgRes.headers.get("content-type") || "";
          if (cType.startsWith("image/")) {
            const buf = await imgRes.arrayBuffer();
            const b64 =
              typeof Buffer !== "undefined"
                ? Buffer.from(buf).toString("base64")
                : btoa(
                    new Uint8Array(buf).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ""
                    )
                  );
            photoUrl = `data:${cType};base64,${b64}`;
          }
        }
      } catch {
        photoUrl = null;
      }
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b132b",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(16, 76, 203, 0.45) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(30, 58, 138, 0.4) 0%, transparent 50%)",
          padding: "50px 60px",
          fontFamily: "system-ui, sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top Brand Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
                  stroke="#104ccb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 21V12h6v9"
                  stroke="#104ccb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "26px", fontWeight: 900, color: "#ffffff" }}>
                ខ្មែរ សេវា
              </span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#93c5fd" }}>
                Khmer Service Marketplace
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {urgent && (
              <div
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  border: "2px solid #ef4444",
                  color: "#fca5a5",
                  fontSize: "14px",
                  fontWeight: 800,
                  padding: "8px 18px",
                  borderRadius: "9999px",
                }}
              >
                <span>⚠️ ការងារបន្ទាន់ (URGENT)</span>
              </div>
            )}
            <div
              style={{
                backgroundColor: "rgba(16, 76, 203, 0.3)",
                border: "1px solid rgba(147, 197, 253, 0.4)",
                color: "#bfdbfe",
                fontSize: "14px",
                fontWeight: 700,
                padding: "8px 18px",
                borderRadius: "9999px",
              }}
            >
              {category}
            </div>
          </div>
        </div>

        {/* Center Main Content Area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "40px",
            width: "100%",
            margin: "20px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: photoUrl ? "1 1 62%" : "1 1 100%",
              gap: "18px",
            }}
          >
            <h1
              style={{
                fontSize: title.length > 45 ? "36px" : "46px",
                fontWeight: 900,
                lineHeight: 1.25,
                color: "#ffffff",
                margin: 0,
                maxHeight: "180px",
                overflow: "hidden",
              }}
            >
              {title}
            </h1>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  padding: "8px 16px",
                  borderRadius: "12px",
                  fontSize: "15px",
                  color: "#e2e8f0",
                  fontWeight: 600,
                }}
              >
                <span>📍 {city}</span>
              </div>

              {budget && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    color: "#6ee7b7",
                    fontWeight: 800,
                  }}
                >
                  <span>💰 {budget}</span>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  padding: "8px 16px",
                  borderRadius: "12px",
                  fontSize: "15px",
                  color: "#93c5fd",
                  fontWeight: 700,
                }}
              >
                <span>✓ ផ្ទៀងផ្ទាត់ដោយ ខ្មែរ សេវា</span>
              </div>
            </div>
          </div>

          {photoUrl && (
            <div
              style={{
                width: "280px",
                height: "280px",
                borderRadius: "24px",
                overflow: "hidden",
                border: "3px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt={title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom Trust & CTA Footer Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "15px",
              color: "#94a3b8",
              fontWeight: 500,
            }}
          >
            <span>🇰🇭</span>
            <span>ថ្នាលស្វែងរក និងផ្គូផ្គងជាងជំនាញឈានមុខគេនៅកម្ពុជា</span>
          </div>

          <div
            style={{
              fontSize: "15px",
              color: "#60a5fa",
              fontWeight: 700,
            }}
          >
            servicemaketplacefront.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
