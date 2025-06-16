import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { StoreDataContext } from "../../context/StoreContext";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const timeOptions = [
  { label: "Day", value: "day" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
  { label: "Decade", value: "decade" },
];

const PayoutSection = () => {
  const { storeData } = useContext(StoreDataContext);
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState("month");

  useEffect(() => {
    fetchPayoutStats();
    // eslint-disable-next-line
  }, [timeFrame]);

  const fetchPayoutStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/stores/payout-stats/${storeData._id}?timeFrame=${timeFrame}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSalesData(res.data.salesData || []);
      setTotalSales(res.data.totalSales || 0);
      setTotalOrders(res.data.totalOrders || 0);
    } catch {
      setSalesData([]);
      setTotalSales(0);
      setTotalOrders(0);
    }
    setLoading(false);
  };

  // Prepare chart data
  const chartLabels = salesData.map((d) => d.label);
  const chartSales = salesData.map((d) => d.sales);

  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Sales (₹)",
        data: chartSales,
        backgroundColor: "#2563eb",
        borderRadius: 6,
        maxBarThickness: 32,
      },
    ],
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Payout & Sales Analytics</h2>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex-1 flex flex-col items-center justify-center">
          <div className="text-gray-500 text-sm mb-1">Total Sales</div>
          <div className="text-3xl font-bold text-green-700 mb-2">₹{totalSales.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex-1 flex flex-col items-center justify-center">
          <div className="text-gray-500 text-sm mb-1">Total Orders</div>
          <div className="text-3xl font-bold text-blue-700 mb-2">{totalOrders}</div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Sales Graph</h3>
          <div>
            {timeOptions.map((opt) => (
              <button
                key={opt.value}
                className={`px-3 py-1 rounded mr-2 font-semibold transition ${
                  timeFrame === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                }`}
                onClick={() => setTimeFrame(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div>Loading sales data...</div>
        ) : (
          <div className="w-full h-96">
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { mode: "index", intersect: false },
                },
                scales: {
                  x: { grid: { display: false } },
                  y: {
                    beginAtZero: true,
                    grid: { color: "#f3f4f6" },
                    ticks: { callback: (v) => "₹" + v }
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutSection;