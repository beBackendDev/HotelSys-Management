import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import styles from "./DailyRevenue.module.scss";

const DailyRevenueChart = ({ data = [] }) => {
  return (
    <div className={styles.chartWrapper}>
      <div className={styles.header}>
        <h3>📈 Doanh thu & Booking theo ngày</h3>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} className={styles.chart}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#999"
          />
          <YAxis tick={{ fontSize: 12 }} stroke="#999" />

          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            formatter={(value, name) =>
              name === "revenue"
                ? [`${value.toLocaleString()} VND`, "Doanh thu"]
                : [`${value}`, "Booking"]
            }
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#1890ff"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />

          <Line
            type="monotone"
            dataKey="booking"
            stroke="#52c41a"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyRevenueChart;
