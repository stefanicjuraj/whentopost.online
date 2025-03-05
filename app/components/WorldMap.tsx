"use client";

import React, { memo, useState, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const timezoneCoordinates: Record<string, [number, number]> = {
  "America/St_Johns": [-52.7, 47.5],
  "America/Halifax": [-63.6, 44.6],
  "America/New_York": [-74.0, 40.7],
  "America/Chicago": [-87.6, 41.8],
  "America/Denver": [-104.9, 39.7],
  "America/Phoenix": [-112.0, 33.4],
  "America/Los_Angeles": [-118.2, 34.0],
  "America/Anchorage": [-149.9, 61.2],
  "America/Adak": [-176.6, 51.9],
  "America/Vancouver": [-123.1, 49.3],
  "America/Mexico_City": [-99.1, 19.4],
  "Pacific/Honolulu": [-157.8, 21.3],

  "America/Santiago": [-70.6, -33.4],
  "America/Sao_Paulo": [-46.6, -23.5],
  "America/Buenos_Aires": [-58.4, -34.6],
  "America/Bogota": [-74.1, 4.7],
  "America/Lima": [-77.0, -12.0],
  "America/Caracas": [-66.9, 10.5],
  "America/Montevideo": [-56.2, -34.9],
  "America/La_Paz": [-68.1, -16.5],

  "Europe/London": [-0.1, 51.5],
  "Europe/Lisbon": [-9.1, 38.7],
  "Europe/Paris": [2.3, 48.9],
  "Europe/Berlin": [13.4, 52.5],
  "Europe/Helsinki": [24.9, 60.2],
  "Europe/Athens": [23.7, 38.0],
  "Europe/Moscow": [37.6, 55.8],
  "Europe/Istanbul": [29.0, 41.0],
  "Europe/Kyiv": [30.5, 50.5],

  "Africa/Casablanca": [-7.6, 33.6],
  "Africa/Algiers": [3.0, 36.8],
  "Africa/Lagos": [3.4, 6.5],
  "Africa/Johannesburg": [28.0, -26.2],
  "Africa/Nairobi": [36.8, -1.3],
  "Africa/Cairo": [31.2, 30.0],
  "Africa/Addis_Ababa": [38.8, 9.0],
  "Africa/Khartoum": [32.5, 15.6],

  "Asia/Jerusalem": [35.2, 31.8],
  "Asia/Riyadh": [46.7, 24.7],
  "Asia/Dubai": [55.3, 25.3],
  "Asia/Tehran": [51.4, 35.7],
  "Asia/Kabul": [69.2, 34.5],
  "Asia/Karachi": [67.0, 24.9],
  "Asia/Kolkata": [77.2, 28.6],
  "Asia/Kathmandu": [85.3, 27.7],
  "Asia/Dhaka": [90.4, 23.8],
  "Asia/Yangon": [96.2, 16.8],
  "Asia/Bangkok": [100.5, 13.8],
  "Asia/Jakarta": [106.8, -6.2],
  "Asia/Manila": [121.0, 14.6],
  "Asia/Shanghai": [121.5, 31.2],
  "Asia/Seoul": [127.0, 37.6],
  "Asia/Tokyo": [139.7, 35.7],
  "Asia/Ho_Chi_Minh": [106.7, 10.8],
  "Asia/Kuala_Lumpur": [101.7, 3.1],
  "Asia/Singapore": [103.8, 1.4],
  "Asia/Tashkent": [69.3, 41.3],
  "Asia/Ulaanbaatar": [106.9, 47.9],

  "Australia/Perth": [115.9, -31.9],
  "Australia/Darwin": [130.8, -12.5],
  "Australia/Adelaide": [138.6, -34.9],
  "Australia/Sydney": [151.2, -33.9],
  "Pacific/Auckland": [174.8, -36.9],
  "Pacific/Fiji": [178.4, -18.1],
  "Pacific/Guam": [144.8, 13.5],
  "Pacific/Samoa": [-171.8, -13.8],
  "Pacific/Tahiti": [-149.6, -17.7],
  "Pacific/Port_Moresby": [147.2, -9.5],
  "Pacific/Noumea": [166.5, -22.3],

  UTC: [0, 0],
};

interface WorldMapProps {
  userTimezone: string;
  audienceTimezones: string[];
}

const WorldMap: React.FC<WorldMapProps> = ({
  userTimezone,
  audienceTimezones,
}) => {
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMarkerMouseEnter = (
    timezone: string,
    event: React.MouseEvent
  ) => {
    setTooltipContent(timezone);

    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  const handleMarkerMouseLeave = () => {
    setTooltipContent("");
    setTooltipPosition(null);
  };

  const getCurrentTimeForTimezone = (timezone: string) => {
    const now = new Date();
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(now);
  };

  return (
    <div
      className="w-full h-[400px] mt-4 mb-8 border border-gray-200 rounded-lg overflow-hidden relative"
      ref={mapRef}
    >
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{
          scale: 160,
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: Array<{ rsmKey: string }> }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#F5F5F5" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {userTimezone && timezoneCoordinates[userTimezone] && (
          <Marker
            coordinates={timezoneCoordinates[userTimezone]}
            onMouseEnter={(e: React.MouseEvent) =>
              handleMarkerMouseEnter(
                `${userTimezone} - ${getCurrentTimeForTimezone(
                  userTimezone
                )} (You)`,
                e
              )
            }
            onMouseLeave={handleMarkerMouseLeave}
          >
            <g>
              <circle r={8} fill="#4F46E5" stroke="#fff" strokeWidth={2} />
              <circle r={16} fill="#4F46E5" fillOpacity={0.2} />
            </g>
          </Marker>
        )}

        {audienceTimezones.map(
          (tz) =>
            timezoneCoordinates[tz] && (
              <Marker
                key={tz}
                coordinates={timezoneCoordinates[tz]}
                onMouseEnter={(e: React.MouseEvent) =>
                  handleMarkerMouseEnter(
                    `${tz} - ${getCurrentTimeForTimezone(tz)}`,
                    e
                  )
                }
                onMouseLeave={handleMarkerMouseLeave}
              >
                <circle r={8} fill="#EC4899" stroke="#fff" strokeWidth={2} />
              </Marker>
            )
        )}
      </ComposableMap>

      {tooltipContent && tooltipPosition && (
        <div
          className="absolute z-10 px-2 py-1 text-sm bg-white rounded shadow-md pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 30,
          }}
        >
          {tooltipContent}
        </div>
      )}

      <div className="absolute p-2 text-xs bg-white rounded-md bottom-2 left-2 bg-opacity-80">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 mr-2 bg-indigo-600 rounded-full"></div>
          <span>Your timezone</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 bg-pink-500 rounded-full"></div>
          <span>Audience timezones</span>
        </div>
      </div>
    </div>
  );
};

export default memo(WorldMap);
