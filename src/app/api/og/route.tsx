import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "ស្វែងរកជាង និងសេវាកម្មនៅកម្ពុជា";
    const category = searchParams.get("category") || "សេវាកម្មទូទៅ";
    const city = searchParams.get("city") || "Phnom Penh";
    const district = searchParams.get("district") || "";
    const budget = searchParams.get("budget") || "";
    const urgent = searchParams.get("urgent") === "true";
    const imageUrl = searchParams.get("imageUrl") || searchParams.get("image") || "";

    let validImageData: string | null = null;
    if (imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))) {
      try {
        const imgRes = await fetch(imageUrl, {
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
            validImageData = `data:${cType};base64,${b64}`;
          }
        }
      } catch {
        validImageData = null;
      }
    }

    const locationText = district ? `${district}, ${city}` : city;

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
            position: "relative",
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
            {/* Logo + Brand name */}
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
                {/* Brand Logo Symbol */}
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
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 900,
                    letterSpacing: "-0.5px",
                    color: "#ffffff",
                  }}
                >
                  ខ្មែរ សេវា
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#93c5fd",
                    letterSpacing: "0.5px",
                  }}
                >
                  Khmer Service Marketplace
                </span>
              </div>
            </div>

            {/* Badges */}
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
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
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
            {/* Left Content (Title, Location, Budget) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: validImageData ? "1 1 60%" : "1 1 100%",
                gap: "18px",
              }}
            >
              <h1
                style={{
                  fontSize: title.length > 50 ? "36px" : "46px",
                  fontWeight: 900,
                  lineHeight: 1.25,
                  color: "#ffffff",
                  letterSpacing: "-0.5px",
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
                {/* Location Chip */}
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
                  <span style={{ color: "#f87171" }}>📍</span>
                  <span>{locationText}</span>
                </div>

                {/* Budget Chip (if any) */}
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
                    <span>💰</span>
                    <span>{budget}</span>
                  </div>
                )}

                {/* Status Verified */}
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
                  <span>✓</span>
                  <span>ផ្ទៀងផ្ទាត់ដោយ ខ្មែរ សេវា</span>
                </div>
              </div>
            </div>

            {/* Right Photo Preview (if validImageData provided) */}
            {validImageData && (
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
                  src={validImageData}
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
                letterSpacing: "0.3px",
              }}
            >
              servicemaketplacefront.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response(`Failed to generate dynamic image: ${e}`, {
      status: 500,
    });
  }
}
