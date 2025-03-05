const postTimes = [
  {
    platform: "LinkedIn",
    icon: "/assets/icons/linkedin.svg",
    "North America": "8:00 AM - 2:00 PM",
    "South America": "8:00 AM - 12:00 PM",
    Europe: "9:00 AM - 1:00 PM",
    Africa: "9:00 AM - 12:00 PM",
    Asia: "10:00 AM - 2:00 PM",
    "Australia/Oceania": "8:00 AM - 11:00 AM",
  },
  {
    platform: "Reddit",
    icon: "/assets/icons/reddit.svg",
    "North America": "6:00 AM - 9:00 AM; 7:00 PM - 10:00 PM",
    "South America": "5:00 AM - 8:00 AM",
    Europe: "6:00 AM - 9:00 AM; 6:00 PM - 9:00 PM",
    Africa: "7:00 AM - 10:00 AM",
    Asia: "6:00 PM - 8:00 PM",
    "Australia/Oceania": "7:00 AM - 9:00 AM; 8:00 PM - 10:00 PM",
  },
  {
    platform: "Instagram",
    icon: "/assets/icons/instagram.svg",
    "North America": "11:00 AM - 1:00 PM; 7:00 PM - 9:00 PM",
    "South America": "10:00 AM - 12:00 PM",
    Europe: "11:00 AM - 1:00 PM; 7:00 PM - 9:00 PM",
    Africa: "5:00 PM - 7:00 PM",
    Asia: "7:00 PM - 9:00 PM",
    "Australia/Oceania": "6:00 AM - 8:00 AM; 8:00 PM - 10:00 PM",
  },
  {
    platform: "Bluesky",
    icon: "/assets/icons/bluesky.svg",
    "North America": "10:00 AM - 12:00 PM; 5:00 PM - 8:00 PM",
    "South America": "9:00 AM - 11:00 AM",
    Europe: "10:00 AM - 12:00 PM; 6:00 PM - 9:00 PM",
    Africa: "11:00 AM - 1:00 PM",
    Asia: "8:00 PM - 10:00 PM",
    "Australia/Oceania": "9:00 AM - 11:00 AM; 7:00 PM - 9:00 PM",
  },
  {
    platform: "Twitter",
    icon: "/assets/icons/twitter.svg",
    "North America": "9:00 AM - 11:00 AM; 6:00 PM - 9:00 PM",
    "South America": "8:00 AM - 10:00 AM; 6:00 PM - 8:00 PM",
    Europe: "11:00 AM - 1:00 PM; 7:00 PM - 9:00 PM",
    Africa: "11:00 AM - 1:00 PM; 6:00 PM - 8:00 PM",
    Asia: "7:00 PM - 9:00 PM",
    "Australia/Oceania": "8:00 AM - 10:00 AM; 5:00 PM - 8:00 PM",
  },
  {
    platform: "Facebook",
    icon: "/assets/icons/facebook.svg",
    "North America": "9:00 AM - 1:00 PM",
    "South America": "10:00 AM - 1:00 PM",
    Europe: "9:00 AM - 12:00 PM",
    Africa: "12:00 PM - 3:00 PM",
    Asia: "6:00 PM - 9:00 PM",
    "Australia/Oceania": "8:00 AM - 11:00 AM",
  },
  {
    platform: "Hacker News",
    icon: "/assets/icons/ycombinator.svg",
    "North America": "7:00 AM - 12:00 PM",
    "South America": "8:00 AM - 10:00 AM",
    Europe: "1:00 PM - 5:00 PM",
    Africa: "2:00 PM - 5:00 PM",
    Asia: "9:00 AM - 11:00 AM",
    "Australia/Oceania": "8:00 AM - 10:00 AM",
  },
];

export default function postTimesTable() {
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      postTimes
        .map((row) =>
          [
            row.platform,
            row["North America"],
            row["South America"],
            row.Europe,
            row.Africa,
            row.Asia,
            row["Australia/Oceania"],
          ].join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "when_to_post_online.csv");
    document.body.appendChild(link);

    link.click();
  };

  return (
    <div className="max-w-screen-lg mx-auto overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="text-sm">
          <tr className="bg-gray-100">
            <th className="px-4 py-3 border border-gray-300">Platform</th>
            <th className="px-4 py-3 border border-gray-300">North America</th>
            <th className="px-4 py-3 border border-gray-300">South America</th>
            <th className="px-4 py-3 border border-gray-300">Europe</th>
            <th className="px-4 py-3 border border-gray-300">Africa</th>
            <th className="px-4 py-3 border border-gray-300">Asia</th>
            <th className="px-4 py-3 border border-gray-300">
              Australia/Oceania
            </th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {postTimes.map((row, index) => (
            <tr key={index} className="border border-gray-300">
              <td className="flex items-center justify-center h-16 gap-2 text-center">
                <img src={row.icon} alt={row.platform} className="w-8 h-8" />
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {row["North America"]}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {row["South America"]}
              </td>
              <td className="px-4 py-2 border border-gray-300">{row.Europe}</td>
              <td className="px-4 py-2 border border-gray-300">{row.Africa}</td>
              <td className="px-4 py-2 border border-gray-300">{row.Asia}</td>
              <td className="px-4 py-2 border border-gray-300">
                {row["Australia/Oceania"]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-center">
        <button
          onClick={handleExport}
          className="text-sm text-blue-500 cursor-pointer hover:underline"
        >
          Download Table
        </button>
      </div>
    </div>
  );
}
