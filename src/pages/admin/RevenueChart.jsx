
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const RevenueChart = ({ data = [] }) => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Show all 6 months, including months with zero revenue.
  const now = new Date();

  const chartData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - 5 + index,
      1
    );

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const record = data.find(
      (item) => item.year === year && item.month === month
    );

    return {
      month: `${monthNames[date.getMonth()]} ${String(year).slice(-2)}`,
      revenue: record?.revenue ?? 0,
    };
  });

  const formatRupees = (value) =>
    `₹${Number(value).toLocaleString("en-IN")}`;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Monthly Revenue
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Paid orders · Last 6 months
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#1c3103"
                  stopOpacity={0.25}
                />
                <stop
                  offset="100%"
                  stopColor="#1c3103"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              tickMargin={12}
            />

            <YAxis
              tickFormatter={(value) =>
                value >= 1000
                  ? `₹${(value / 1000).toFixed(1)}k`
                  : `₹${value}`
              }
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              width={65}
            />

            <Tooltip
              formatter={(value) => [
                formatRupees(value),
                "Revenue",
              ]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                fontSize: 13,
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1c3103"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default RevenueChart;
