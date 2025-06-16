import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { StoreDataContext } from "../../context/StoreContext";

Chart.register(ArcElement, Tooltip, Legend);

const InsightsSection = () => {
  const [serviceStats, setServiceStats] = useState([]);
  const [userPrefs, setUserPrefs] = useState([]);
  const [locationStats, setLocationStats] = useState([]);
  const [maxService, setMaxService] = useState(null);
  const [loading, setLoading] = useState(true);
  const { storeData } = useContext(StoreDataContext);

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/stores/insights/${storeData._id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setServiceStats(res.data.serviceStats || []);
      setUserPrefs(res.data.userPrefs || []);
      setLocationStats(res.data.locationStats || []);
      setMaxService(res.data.maxService || null);
    } catch (err) {
      setServiceStats([]);
      setUserPrefs([]);
      setLocationStats([]);
      setMaxService(null);
    }
    setLoading(false);
  };

  const pieData = {
    labels: serviceStats.map((s) => s.name),
    datasets: [
      {
        label: "Service Usage",
        data: serviceStats.map((s) => s.count),
        backgroundColor: [
          "#2563eb",
          "#f59e42",
          "#10b981",
          "#f43f5e",
          "#a78bfa",
          "#fbbf24",
          "#34d399",
          "#f87171",
        ],
        borderWidth: 1,
      },
    ],
  };

  const maxLocation =
    locationStats.length > 0
      ? locationStats.reduce((a, b) => (a.count > b.count ? a : b))
      : null;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Store Insights</h2>
      {loading ? (
        <div>Loading insights...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Service Usage Pie Chart */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Service Usage</h3>
            <div className="w-64 h-64">
              <Pie data={pieData} />
            </div>
            <ul className="mt-6 w-full">
              {serviceStats.map((s) => (
                <li
                  key={s.name}
                  className={`flex justify-between py-1 px-2 rounded ${
                    maxService && s.name === maxService.name
                      ? "bg-blue-50 font-bold text-blue-700"
                      : ""
                  }`}
                >
                  <span>{s.name}</span>
                  <span>{s.count} times</span>
                </li>
              ))}
            </ul>
            {maxService && (
              <div className="mt-4 text-green-700 font-semibold">
                Most popular: {maxService.name} ({maxService.count} times)
              </div>
            )}
          </div>

          {/* User Preferences */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">What Users Prefer</h3>
            <ul>
              {userPrefs.map((pref) => (
                <li
                  key={pref.preference}
                  className="flex justify-between py-2 border-b last:border-b-0"
                >
                  <span>{pref.preference}</span>
                  <span className="font-semibold">{pref.count} users</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Stats */}
          <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">
              Bookings by User Location
            </h3>
            <div className="flex flex-col md:flex-row gap-8">
              <ul className="flex-1">
                {locationStats.map((loc) => (
                  <li
                    key={loc.location}
                    className={`flex justify-between py-2 px-2 rounded ${
                      maxLocation && loc.location === maxLocation.location
                        ? "bg-green-50 font-bold text-green-700"
                        : ""
                    }`}
                  >
                    <span>{loc.location}</span>
                    <span>{loc.count} bookings</span>
                  </li>
                ))}
              </ul>
              {maxLocation && (
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="text-green-700 font-semibold text-lg">
                    Most bookings from:
                  </div>
                  <div className="text-2xl font-bold mt-2">
                    {maxLocation.location}
                  </div>
                  <div className="text-gray-500">
                    ({maxLocation.count} bookings)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsSection;