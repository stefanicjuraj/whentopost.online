"use client";

import { useState, useEffect, useRef } from "react";
import WorldMap from "./components/WorldMap";
import PostTimes from "./components/PostTimes";

type SectionKey =
  | "northAmerica"
  | "southAmerica"
  | "europe"
  | "africa"
  | "asia"
  | "australia"
  | "pacificIslands";

export default function Home() {
  const [userTimezone, setUserTimezone] = useState("UTC");
  const [audienceTimezones, setAudienceTimezones] = useState<string[]>([]);
  const [bestTimes, setBestTimes] = useState<
    { userTime: string; audienceTimes: string[] }[]
  >([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [audienceSearchTerm, setAudienceSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const [openRegionDropdown, setOpenRegionDropdown] =
    useState<SectionKey | null>(null);

  const userTimezoneRef = useRef<HTMLDivElement>(null);
  const audienceTimezoneRef = useRef<HTMLDivElement>(null);

  const [shareButtonText, setShareButtonText] = useState("Share Link");

  const timezones = [
    "UTC",
    "America/St_Johns",
    "America/Halifax",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Phoenix",
    "America/Los_Angeles",
    "America/Anchorage",
    "America/Adak",
    "America/Vancouver",
    "America/Mexico_City",
    "Pacific/Honolulu",
    "America/Santiago",
    "America/Sao_Paulo",
    "America/Buenos_Aires",
    "America/Bogota",
    "America/Lima",
    "America/Caracas",
    "America/Montevideo",
    "America/La_Paz",
    "Europe/London",
    "Europe/Lisbon",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Helsinki",
    "Europe/Athens",
    "Europe/Moscow",
    "Europe/Istanbul",
    "Europe/Kyiv",
    "Africa/Casablanca",
    "Africa/Algiers",
    "Africa/Lagos",
    "Africa/Johannesburg",
    "Africa/Nairobi",
    "Africa/Cairo",
    "Africa/Addis_Ababa",
    "Africa/Khartoum",
    "Asia/Jerusalem",
    "Asia/Riyadh",
    "Asia/Dubai",
    "Asia/Tehran",
    "Asia/Kabul",
    "Asia/Karachi",
    "Asia/Kolkata",
    "Asia/Kathmandu",
    "Asia/Dhaka",
    "Asia/Yangon",
    "Asia/Bangkok",
    "Asia/Jakarta",
    "Asia/Manila",
    "Asia/Shanghai",
    "Asia/Seoul",
    "Asia/Tokyo",
    "Asia/Ho_Chi_Minh",
    "Asia/Kuala_Lumpur",
    "Asia/Singapore",
    "Asia/Tashkent",
    "Asia/Ulaanbaatar",
    "Australia/Perth",
    "Australia/Darwin",
    "Australia/Adelaide",
    "Australia/Sydney",
    "Pacific/Auckland",
    "Pacific/Fiji",
    "Pacific/Guam",
    "Pacific/Samoa",
    "Pacific/Tahiti",
    "Pacific/Port_Moresby",
    "Pacific/Noumea",
  ];

  const getCurrentTimeForTimezone = (timezone: string) => {
    const now = new Date();
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(now);
  };

  const getUniqueTimezones = (timezones: string[]) => {
    const uniqueTimezones: { [key: string]: string } = {};

    timezones.forEach((tz) => {
      const currentTime = getCurrentTimeForTimezone(tz);
      if (!uniqueTimezones[currentTime]) {
        uniqueTimezones[currentTime] = tz;
      }
    });

    return Object.values(uniqueTimezones);
  };

  const uniqueTimezones = getUniqueTimezones(timezones);

  const filteredTimezones = (timezones: string[]) => {
    return timezones.filter((tz) =>
      tz.toLowerCase().includes(audienceSearchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userTimezoneRef.current &&
        !userTimezoneRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        audienceTimezoneRef.current &&
        !audienceTimezoneRef.current.contains(event.target as Node)
      ) {
        setOpenRegionDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const timezone = params.get("timezone");
    const audience = params.get("audience");

    if (timezone) {
      setUserTimezone(timezone);
    }

    if (audience) {
      setAudienceTimezones(audience.split(","));
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      if (audienceSearchTerm) {
        const sections: Record<SectionKey, string[]> = {
          northAmerica: [
            "America/St_Johns",
            "America/Halifax",
            "America/New_York",
            "America/Chicago",
            "America/Denver",
            "America/Phoenix",
            "America/Los_Angeles",
            "America/Anchorage",
            "America/Adak",
          ],
          southAmerica: [
            "America/Santiago",
            "America/Sao_Paulo",
            "America/Buenos_Aires",
            "America/Bogota",
            "America/Lima",
            "America/Caracas",
          ],
          europe: [
            "Europe/London",
            "Europe/Paris",
            "Europe/Helsinki",
            "Europe/Athens",
            "Europe/Moscow",
          ],
          africa: [
            "Africa/Casablanca",
            "Africa/Lagos",
            "Africa/Johannesburg",
            "Africa/Nairobi",
            "Africa/Cairo",
          ],
          asia: [
            "Asia/Jerusalem",
            "Asia/Riyadh",
            "Asia/Dubai",
            "Asia/Tehran",
            "Asia/Kabul",
            "Asia/Karachi",
            "Asia/Kolkata",
            "Asia/Kathmandu",
            "Asia/Dhaka",
            "Asia/Yangon",
            "Asia/Bangkok",
            "Asia/Jakarta",
            "Asia/Manila",
            "Asia/Shanghai",
            "Asia/Seoul",
            "Asia/Tokyo",
          ],
          australia: [
            "Australia/Perth",
            "Australia/Darwin",
            "Australia/Adelaide",
            "Australia/Sydney",
            "Pacific/Auckland",
            "Pacific/Fiji",
            "Pacific/Guam",
          ],
          pacificIslands: [
            "Pacific/Honolulu",
            "Pacific/Samoa",
            "Pacific/Tahiti",
          ],
        };

        for (const section of Object.keys(sections) as SectionKey[]) {
          const hasMatch = sections[section].some((tz: string) =>
            tz.toLowerCase().includes(audienceSearchTerm.toLowerCase())
          );
          if (hasMatch) {
            setOpenRegionDropdown(section);
            break;
          }
        }
      }
    }, 500);

    setTypingTimeout(newTimeout);

    if (audienceSearchTerm === "") {
      setOpenRegionDropdown(null);
    }

    return () => {
      clearTimeout(newTimeout);
    };
  }, [audienceSearchTerm]);

  const calculateBestTimes = () => {
    if (!audienceTimezones.length) {
      alert("Please select at least one audience timezone");
      return;
    }

    const newBestTimes = [];
    const uniqueAudienceTimezones = Array.from(new Set(audienceTimezones));

    for (let hour = 7; hour <= 21; hour++) {
      const testTime = new Date();
      testTime.setHours(hour, 0, 0, 0);

      const isValidForAll = uniqueAudienceTimezones.every((tz) => {
        const audienceHour = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          hour: "numeric",
          hour12: false,
        }).format(testTime);
        const hourNum = parseInt(audienceHour);
        return hourNum >= 8 && hourNum <= 21;
      });

      if (isValidForAll) {
        const userTime = new Intl.DateTimeFormat("en-US", {
          timeZone: userTimezone,
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }).format(testTime);

        const audienceTimes = uniqueAudienceTimezones.map((tz) => {
          const time = new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }).format(testTime);
          return { tz, time };
        });

        const uniqueTimes = Array.from(
          new Map(audienceTimes.map((item) => [item.time, item.tz])).entries()
        ).map(([time, tz]) => `${tz}: ${time}`);

        newBestTimes.push({
          userTime,
          audienceTimes: uniqueTimes,
        });
      }
    }

    if (newBestTimes.length > 0) {
      setBestTimes(newBestTimes);
      const audienceParam = uniqueAudienceTimezones.join(",");
      const newUrl = `?timezone=${encodeURIComponent(
        userTimezone
      )}&audience=${encodeURIComponent(audienceParam)}`;
      window.history.pushState({}, "", newUrl);
    } else {
      setBestTimes([]);
    }

    setShowResults(true);
  };

  const resetSelections = () => {
    setAudienceTimezones([]);
    setBestTimes([]);
    setShowResults(false);
    window.history.pushState({}, "", window.location.pathname);
  };

  const toggleSection = (section: SectionKey) => {
    if (openRegionDropdown === section) {
      setOpenRegionDropdown(null);
    } else {
      setOpenRegionDropdown(section);
    }
  };

  return (
    <div className="p-4 sm:p-2">
      <div className="max-w-screen-xl p-6 mx-auto my-4 bg-white shadow-xl sm:my-8 rounded-2xl">
        <header className="max-w-screen-sm p-3 mx-auto mt-4">
          <h1 className="mb-8 text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            When to post online
          </h1>
          <h2 className="mb-2 text-lg text-black">
            The best time to post on social media based on your timezone and the
            timezones of your audience.
          </h2>
          <p className="text-left text-black">
            The calculations consider times between{" "}
            <span className="underline">7 AM</span> and{" "}
            <span className="underline">9 PM</span> due to social media
            platforms being the most active during these hours.
          </p>
        </header>

        <hr className="max-w-screen-lg mx-auto my-8 border-t border-gray-300" />

        <PostTimes />

        <hr className="max-w-screen-lg mx-auto my-8 border-t border-gray-300" />

        <div className="max-w-screen-sm p-3 mx-auto" ref={userTimezoneRef}>
          <h2 className="mb-2 text-lg text-black">Select your timezone</h2>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-3 transition-all border border-gray-200 rounded-lg cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {userTimezone} - {getCurrentTimeForTimezone(userTimezone)}
          </div>
          {isDropdownOpen && (
            <div className="absolute z-10 w-full max-w-md mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              <input
                type="text"
                placeholder="Search timezone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border-b border-gray-200 focus:outline-none"
              />
              <ul className="overflow-y-auto max-h-60">
                {uniqueTimezones
                  .filter((tz) =>
                    tz.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((tz) => (
                    <li
                      key={tz}
                      onClick={() => {
                        setUserTimezone(tz);
                        setIsDropdownOpen(false);
                        setSearchTerm("");
                      }}
                      className="p-2 cursor-pointer hover:bg-indigo-100"
                    >
                      {tz} -{" "}
                      <span className="text-gray-500">
                        ({getCurrentTimeForTimezone(tz)})
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <div className="max-w-screen-sm p-3 mx-auto" ref={audienceTimezoneRef}>
          <h2 className="mb-2 text-lg text-black">
            Select your audience timezones
          </h2>
          <input
            type="text"
            placeholder="Search your audience timezones"
            value={audienceSearchTerm}
            onChange={(e) => setAudienceSearchTerm(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-200 rounded-lg cursor-pointer focus:outline-none"
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2">
            {/* North America */}
            <div className="relative">
              <h3
                className="flex items-center justify-between w-full px-2 py-3 pl-4 mb-2 text-left text-black bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => toggleSection("northAmerica")}
              >
                North America
                {audienceTimezones.filter((tz) =>
                  [
                    "America/St_Johns",
                    "America/Halifax",
                    "America/New_York",
                    "America/Chicago",
                    "America/Denver",
                    "America/Phoenix",
                    "America/Los_Angeles",
                    "America/Anchorage",
                    "America/Adak",
                  ].includes(tz)
                ).length > 0 && (
                  <span className="ml-auto mr-2">
                    (
                    {
                      audienceTimezones.filter((tz) =>
                        [
                          "America/St_Johns",
                          "America/Halifax",
                          "America/New_York",
                          "America/Chicago",
                          "America/Denver",
                          "America/Phoenix",
                          "America/Los_Angeles",
                          "America/Anchorage",
                          "America/Adak",
                        ].includes(tz)
                      ).length
                    }
                    )
                  </span>
                )}
                <img
                  src="/assets/icons/chevron.svg"
                  alt="Chevron"
                  className={`align-middle w-5 h-5 transition-transform ${
                    openRegionDropdown === "northAmerica" ? "rotate-180" : ""
                  }`}
                />
              </h3>
              {openRegionDropdown === "northAmerica" && (
                <div className="absolute z-10 w-full p-3 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md max-h-60">
                  {filteredTimezones([
                    "America/St_Johns",
                    "America/Halifax",
                    "America/New_York",
                    "America/Chicago",
                    "America/Denver",
                    "America/Phoenix",
                    "America/Los_Angeles",
                    "America/Anchorage",
                    "America/Adak",
                  ]).map((tz) => (
                    <label
                      key={tz}
                      className="flex items-center py-1 whitespace-nowrap"
                    >
                      <input
                        type="checkbox"
                        value={tz}
                        checked={audienceTimezones.includes(tz)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAudienceTimezones([...audienceTimezones, tz]);
                          } else {
                            setAudienceTimezones(
                              audienceTimezones.filter((time) => time !== tz)
                            );
                          }
                        }}
                        className="w-5 h-5 mr-2"
                      />
                      {tz} -{" "}
                      <span className="text-gray-500">
                        ({getCurrentTimeForTimezone(tz)})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* South America */}
            <div className="relative">
              <h3
                className="flex items-center justify-between w-full px-2 py-3 pl-4 mb-2 text-left text-black bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => toggleSection("southAmerica")}
              >
                South America
                {audienceTimezones.filter((tz) =>
                  [
                    "America/Santiago",
                    "America/Sao_Paulo",
                    "America/Buenos_Aires",
                    "America/Bogota",
                    "America/Lima",
                    "America/Caracas",
                  ].includes(tz)
                ).length > 0 && (
                  <span className="ml-auto mr-2">
                    (
                    {
                      audienceTimezones.filter((tz) =>
                        [
                          "America/Santiago",
                          "America/Sao_Paulo",
                          "America/Buenos_Aires",
                          "America/Bogota",
                          "America/Lima",
                          "America/Caracas",
                        ].includes(tz)
                      ).length
                    }
                    )
                  </span>
                )}
                <img
                  src="/assets/icons/chevron.svg"
                  alt="Chevron"
                  className={`align-middle w-5 h-5 transition-transform ${
                    openRegionDropdown === "southAmerica" ? "rotate-180" : ""
                  }`}
                />
              </h3>
              {openRegionDropdown === "southAmerica" && (
                <div className="absolute z-10 w-full p-3 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md max-h-60">
                  {filteredTimezones([
                    "America/Santiago",
                    "America/Sao_Paulo",
                    "America/Buenos_Aires",
                    "America/Bogota",
                    "America/Lima",
                    "America/Caracas",
                  ]).map((tz) => (
                    <label
                      key={tz}
                      className="flex items-center py-1 whitespace-nowrap"
                    >
                      <input
                        type="checkbox"
                        value={tz}
                        checked={audienceTimezones.includes(tz)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAudienceTimezones([...audienceTimezones, tz]);
                          } else {
                            setAudienceTimezones(
                              audienceTimezones.filter((time) => time !== tz)
                            );
                          }
                        }}
                        className="w-5 h-5 mr-2"
                      />
                      {tz} -{" "}
                      <span className="text-gray-500">
                        ({getCurrentTimeForTimezone(tz)})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Europe */}
            <div className="relative">
              <h3
                className="flex items-center justify-between w-full px-2 py-3 pl-4 mb-2 text-left text-black bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => toggleSection("europe")}
              >
                Europe
                {audienceTimezones.filter((tz) =>
                  [
                    "Europe/London",
                    "Europe/Paris",
                    "Europe/Helsinki",
                    "Europe/Athens",
                    "Europe/Moscow",
                  ].includes(tz)
                ).length > 0 && (
                  <span className="ml-auto mr-2">
                    (
                    {
                      audienceTimezones.filter((tz) =>
                        [
                          "Europe/London",
                          "Europe/Paris",
                          "Europe/Helsinki",
                          "Europe/Athens",
                          "Europe/Moscow",
                        ].includes(tz)
                      ).length
                    }
                    )
                  </span>
                )}
                <img
                  src="/assets/icons/chevron.svg"
                  alt="Chevron"
                  className={`align-middle w-5 h-5 transition-transform ${
                    openRegionDropdown === "europe" ? "rotate-180" : ""
                  }`}
                />
              </h3>
              {openRegionDropdown === "europe" && (
                <div className="absolute z-10 w-full p-3 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md max-h-60">
                  {filteredTimezones([
                    "Europe/London",
                    "Europe/Paris",
                    "Europe/Helsinki",
                    "Europe/Athens",
                    "Europe/Moscow",
                  ]).map((tz) => (
                    <label
                      key={tz}
                      className="flex items-center py-1 whitespace-nowrap"
                    >
                      <input
                        type="checkbox"
                        value={tz}
                        checked={audienceTimezones.includes(tz)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAudienceTimezones([...audienceTimezones, tz]);
                          } else {
                            setAudienceTimezones(
                              audienceTimezones.filter((time) => time !== tz)
                            );
                          }
                        }}
                        className="w-5 h-5 mr-2"
                      />
                      {tz} -{" "}
                      <span className="text-gray-500">
                        ({getCurrentTimeForTimezone(tz)})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Africa */}
            <div className="relative">
              <h3
                className="flex items-center justify-between w-full px-2 py-3 pl-4 mb-2 text-left text-black bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => toggleSection("africa")}
              >
                Africa
                {audienceTimezones.filter((tz) =>
                  [
                    "Africa/Casablanca",
                    "Africa/Lagos",
                    "Africa/Johannesburg",
                    "Africa/Nairobi",
                    "Africa/Cairo",
                  ].includes(tz)
                ).length > 0 && (
                  <span className="ml-auto mr-2">
                    (
                    {
                      audienceTimezones.filter((tz) =>
                        [
                          "Africa/Casablanca",
                          "Africa/Lagos",
                          "Africa/Johannesburg",
                          "Africa/Nairobi",
                          "Africa/Cairo",
                        ].includes(tz)
                      ).length
                    }
                    )
                  </span>
                )}
                <img
                  src="/assets/icons/chevron.svg"
                  alt="Chevron"
                  className={`align-middle w-5 h-5 transition-transform ${
                    openRegionDropdown === "africa" ? "rotate-180" : ""
                  }`}
                />
              </h3>
              {openRegionDropdown === "africa" && (
                <div className="absolute z-10 w-full p-3 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md max-h-60">
                  {filteredTimezones([
                    "Africa/Casablanca",
                    "Africa/Lagos",
                    "Africa/Johannesburg",
                    "Africa/Nairobi",
                    "Africa/Cairo",
                  ]).map((tz) => (
                    <label
                      key={tz}
                      className="flex items-center py-1 whitespace-nowrap"
                    >
                      <input
                        type="checkbox"
                        value={tz}
                        checked={audienceTimezones.includes(tz)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAudienceTimezones([...audienceTimezones, tz]);
                          } else {
                            setAudienceTimezones(
                              audienceTimezones.filter((time) => time !== tz)
                            );
                          }
                        }}
                        className="w-5 h-5 mr-2"
                      />
                      {tz} -{" "}
                      <span className="text-gray-500">
                        ({getCurrentTimeForTimezone(tz)})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Asia */}
            <div className="relative">
              <h3
                className="flex items-center justify-between w-full px-2 py-3 pl-4 mb-2 text-left text-black bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => toggleSection("asia")}
              >
                Asia
                {audienceTimezones.filter((tz) =>
                  [
                    "Asia/Jerusalem",
                    "Asia/Riyadh",
                    "Asia/Dubai",
                    "Asia/Tehran",
                    "Asia/Kabul",
                    "Asia/Karachi",
                    "Asia/Kolkata",
                    "Asia/Kathmandu",
                    "Asia/Dhaka",
                    "Asia/Yangon",
                    "Asia/Bangkok",
                    "Asia/Jakarta",
                    "Asia/Manila",
                    "Asia/Shanghai",
                    "Asia/Seoul",
                    "Asia/Tokyo",
                  ].includes(tz)
                ).length > 0 && (
                  <span className="ml-auto mr-2">
                    (
                    {
                      audienceTimezones.filter((tz) =>
                        [
                          "Asia/Jerusalem",
                          "Asia/Riyadh",
                          "Asia/Dubai",
                          "Asia/Tehran",
                          "Asia/Kabul",
                          "Asia/Karachi",
                          "Asia/Kolkata",
                          "Asia/Kathmandu",
                          "Asia/Dhaka",
                          "Asia/Yangon",
                          "Asia/Bangkok",
                          "Asia/Jakarta",
                          "Asia/Manila",
                          "Asia/Shanghai",
                          "Asia/Seoul",
                          "Asia/Tokyo",
                        ].includes(tz)
                      ).length
                    }
                    )
                  </span>
                )}
                <img
                  src="/assets/icons/chevron.svg"
                  alt="Chevron"
                  className={`align-middle w-5 h-5 transition-transform ${
                    openRegionDropdown === "asia" ? "rotate-180" : ""
                  }`}
                />
              </h3>
              {openRegionDropdown === "asia" && (
                <div className="absolute z-10 w-full p-3 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md max-h-60">
                  {filteredTimezones([
                    "Asia/Jerusalem",
                    "Asia/Riyadh",
                    "Asia/Dubai",
                    "Asia/Tehran",
                    "Asia/Kabul",
                    "Asia/Karachi",
                    "Asia/Kolkata",
                    "Asia/Kathmandu",
                    "Asia/Dhaka",
                    "Asia/Yangon",
                    "Asia/Bangkok",
                    "Asia/Jakarta",
                    "Asia/Manila",
                    "Asia/Shanghai",
                    "Asia/Seoul",
                    "Asia/Tokyo",
                  ]).map((tz) => (
                    <label
                      key={tz}
                      className="flex items-center py-1 whitespace-nowrap"
                    >
                      <input
                        type="checkbox"
                        value={tz}
                        checked={audienceTimezones.includes(tz)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAudienceTimezones([...audienceTimezones, tz]);
                          } else {
                            setAudienceTimezones(
                              audienceTimezones.filter((time) => time !== tz)
                            );
                          }
                        }}
                        className="w-5 h-5 mr-2"
                      />
                      {tz} -{" "}
                      <span className="text-gray-500">
                        ({getCurrentTimeForTimezone(tz)})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Australia */}
            <div className="relative">
              <h3
                className="flex items-center justify-between w-full px-2 py-3 pl-4 mb-2 text-left text-black bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => toggleSection("australia")}
              >
                Australia
                {audienceTimezones.filter((tz) =>
                  [
                    "Australia/Perth",
                    "Australia/Darwin",
                    "Australia/Adelaide",
                    "Australia/Sydney",
                    "Pacific/Auckland",
                    "Pacific/Fiji",
                    "Pacific/Guam",
                  ].includes(tz)
                ).length > 0 && (
                  <span className="ml-auto mr-2">
                    (
                    {
                      audienceTimezones.filter((tz) =>
                        [
                          "Australia/Perth",
                          "Australia/Darwin",
                          "Australia/Adelaide",
                          "Australia/Sydney",
                          "Pacific/Auckland",
                          "Pacific/Fiji",
                          "Pacific/Guam",
                        ].includes(tz)
                      ).length
                    }
                    )
                  </span>
                )}
                <img
                  src="/assets/icons/chevron.svg"
                  alt="Chevron"
                  className={`align-middle w-5 h-5 transition-transform ${
                    openRegionDropdown === "australia" ? "rotate-180" : ""
                  }`}
                />
              </h3>
              {openRegionDropdown === "australia" && (
                <div className="absolute z-10 w-full p-3 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md max-h-60">
                  {filteredTimezones([
                    "Australia/Perth",
                    "Australia/Darwin",
                    "Australia/Adelaide",
                    "Australia/Sydney",
                    "Pacific/Auckland",
                    "Pacific/Fiji",
                    "Pacific/Guam",
                  ]).map((tz) => (
                    <label
                      key={tz}
                      className="flex items-center py-1 whitespace-nowrap"
                    >
                      <input
                        type="checkbox"
                        value={tz}
                        checked={audienceTimezones.includes(tz)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAudienceTimezones([...audienceTimezones, tz]);
                          } else {
                            setAudienceTimezones(
                              audienceTimezones.filter((time) => time !== tz)
                            );
                          }
                        }}
                        className="w-5 h-5 mr-2"
                      />
                      {tz} -{" "}
                      <span className="text-gray-500">
                        ({getCurrentTimeForTimezone(tz)})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Pacific Islands */}
            <div className="relative">
              <h3
                className="flex items-center justify-between w-full px-2 py-3 pl-4 mb-2 text-left text-black bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => toggleSection("pacificIslands")}
              >
                Pacific Islands
                {audienceTimezones.filter((tz) =>
                  [
                    "Pacific/Honolulu",
                    "Pacific/Samoa",
                    "Pacific/Tahiti",
                  ].includes(tz)
                ).length > 0 && (
                  <span className="ml-auto mr-2">
                    (
                    {
                      audienceTimezones.filter((tz) =>
                        [
                          "Pacific/Honolulu",
                          "Pacific/Samoa",
                          "Pacific/Tahiti",
                        ].includes(tz)
                      ).length
                    }
                    )
                  </span>
                )}
                <img
                  src="/assets/icons/chevron.svg"
                  alt="Chevron"
                  className={`align-middle w-5 h-5 transition-transform ${
                    openRegionDropdown === "pacificIslands" ? "rotate-180" : ""
                  }`}
                />
              </h3>
              {openRegionDropdown === "pacificIslands" && (
                <div className="absolute z-10 w-full p-3 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md max-h-60">
                  {filteredTimezones([
                    "Pacific/Honolulu",
                    "Pacific/Samoa",
                    "Pacific/Tahiti",
                  ]).map((tz) => (
                    <label
                      key={tz}
                      className="flex items-center py-1 whitespace-nowrap"
                    >
                      <input
                        type="checkbox"
                        value={tz}
                        checked={audienceTimezones.includes(tz)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAudienceTimezones([...audienceTimezones, tz]);
                          } else {
                            setAudienceTimezones(
                              audienceTimezones.filter((time) => time !== tz)
                            );
                          }
                        }}
                        className="w-5 h-5 mr-2"
                      />
                      {tz} -{" "}
                      <span className="text-gray-500">
                        ({getCurrentTimeForTimezone(tz)})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-screen-sm p-3 mx-auto">
          <h2 className="mb-2 text-xl">Preview</h2>
          <p className="mb-2 text-sm">
            Your location is shown in{" "}
            <span className="text-blue-500">blue</span>.
          </p>
          <p className="mb-2 text-sm">
            Locations not in your audience are shown in{" "}
            <span className="text-gray-500">gray</span>. Click on them to add
            them to your audience.
          </p>
          <p className="text-sm">
            Your audience locations will be shown in{" "}
            <span className="text-pink-500">pink</span>.
          </p>
        </div>

        <div className="max-w-screen-md p-3 mx-auto">
          <WorldMap
            userTimezone={userTimezone}
            audienceTimezones={audienceTimezones}
            onTimezoneSelect={(timezone) => {
              setAudienceTimezones([...audienceTimezones, timezone]);
            }}
          />
        </div>

        <div className="flex flex-col items-center mx-auto my-10 text-center">
          <button
            onClick={calculateBestTimes}
            className="px-6 py-3 text-white transition-all transform rounded-lg cursor-pointer sm:w-1/3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:-translate-y-1"
          >
            Calculate Best Time to Post
          </button>
        </div>

        {showResults && bestTimes.length > 0 && (
          <div className="max-w-screen-md p-6 mx-auto mt-6 border border-gray-100 bg-gray-50 rounded-xl">
            <h3 className="mb-4 text-xl text-black">Best Times to Post</h3>
            <div className="space-y-6">
              {bestTimes.map((time, index) => (
                <div key={index}>
                  <p className="text-black">
                    Time to post in your timezone ({userTimezone}) &rarr;{" "}
                    <span className="font-bold">{time.userTime}</span>
                  </p>
                  <ul className="mt-2 ml-4 text-black list-disc">
                    {time.audienceTimes.map((at, i) => (
                      <li key={i}>
                        <span className="font-bold">{at}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {showResults && bestTimes.length > 0 && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setShareButtonText("Copied");
                    setTimeout(() => setShareButtonText("Share Link"), 2000);
                  }}
                  className="px-6 py-3 mt-4 text-white transition-all transform bg-green-500 rounded-lg cursor-pointer sm:w-1/3 hover:-translate-y-1"
                >
                  {shareButtonText}
                </button>
              </div>
            )}

            {showResults && (
              <div className="flex flex-col items-center mx-auto my-2 text-center">
                <button
                  onClick={resetSelections}
                  className="px-6 py-3 mt-4 text-black transition-all transform bg-white border rounded-lg cursor-pointer sm:w-1/3 hover:-translate-y-1"
                >
                  Reset Selections
                </button>
              </div>
            )}
          </div>
        )}

        {showResults &&
          bestTimes.length === 0 &&
          audienceTimezones.length > 0 && (
            <div className="p-6 mt-6 border border-gray-100 bg-gray-50 rounded-xl">
              <h3 className="mb-2 text-xl text-black">
                No optimal posting times found
              </h3>
              <p className="text-black">
                Try selecting different audience timezones
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
