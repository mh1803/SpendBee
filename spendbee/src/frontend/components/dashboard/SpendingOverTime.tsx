import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import type { Transaction } from "../../../types/analysis";
import styles from "./SpendingOverTime.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

interface SpendingOverTimeProps {
  transactions: Transaction[];
  currency: string;
}

export function SpendingOverTime({
  transactions,
  currency,
}: SpendingOverTimeProps) {
  const { labels, dataValues } = useMemo(() => {
    const grouped: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.amount < 0) {
        grouped[tx.date] = (grouped[tx.date] || 0) + Math.abs(tx.amount);
      }
    });

    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const sortedValues = sortedDates.map((d) => grouped[d]);

    return { labels: sortedDates, dataValues: sortedValues };
  }, [transactions]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Spending",
        data: dataValues,
        fill: true,
        borderColor: "rgba(245, 158, 11, 0.8)",
        backgroundColor: "rgba(245, 158, 11, 0.15)",
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "rgba(245, 158, 11, 0.8)",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "rgba(245, 158, 11, 0.8)",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 13,
          weight: 600,
        },
        bodyFont: {
          size: 14,
          weight: 700,
        },
        callbacks: {
          label: (context) =>
            `${currency}${(context.parsed.y as number).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6b7280",
          autoSkip: true,
          maxTicksLimit: 6,
          font: { size: window.innerWidth < 768 ? 10 : 11, weight: 500 },
        },
        border: { display: false },
        min: labels[0],
        max: labels[labels.length - 1],
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255, 193, 7, 0.08)" },
        ticks: {
          color: "#6b7280",
          font: { size: window.innerWidth < 768 ? 10 : 11, weight: 500 },
          callback: (value) => `${currency}${value}`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Spending Over Time</h3>
      <div className={styles.chartWrapper}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
