import React, { useState } from "react";
import type {
  Transaction,
  IncomeCategory,
  SpendingCategory,
} from "../../../types/analysis";
import { OverviewCard } from "./OverviewCard";
import styles from "./IncomeSpendingDoughnuts.module.css";

interface IncomeSpendingDoughnutsProps {
  transactions: Transaction[];
  currency: string;
  totalIncome: number;
  totalSpending: number;
}

const INCOME_CATEGORIES: IncomeCategory[] = [
  "salary",
  "freelance",
  "gifts",
  "refunds",
  "other",
];
const SPENDING_CATEGORIES: SpendingCategory[] = [
  "groceries",
  "dining",
  "bills",
  "transport",
  "health",
  "shopping",
  "leisure",
  "other",
];

interface ColorType {
  bg: string;
  border: string;
  name: string;
}
interface SegmentData {
  path: string;
  color: ColorType;
  label: string;
  value: number;
  percentage: number;
  labelX: number;
  labelY: number;
}
interface HexPointType {
  x: number;
  y: number;
}

const COLORS: ColorType[] = [
  { bg: "rgba(245, 158, 11, 0.85)", border: "#f59e0b", name: "Amber" },
  { bg: "rgba(16, 185, 129, 0.85)", border: "#10b981", name: "Green" },
  { bg: "rgba(239, 68, 68, 0.85)", border: "#ef4444", name: "Red" },
  { bg: "rgba(59, 130, 246, 0.85)", border: "#3b82f6", name: "Blue" },
  { bg: "rgba(168, 85, 247, 0.85)", border: "#a855f7", name: "Purple" },
  { bg: "rgba(236, 72, 153, 0.85)", border: "#ec4899", name: "Pink" },
  { bg: "rgba(20, 184, 166, 0.85)", border: "#14b8a6", name: "Teal" },
  { bg: "rgba(251, 146, 60, 0.85)", border: "#fb923c", name: "Orange" },
];

function createHexagonSegments(
  data: { label: string; value: number; color: ColorType }[],
  centerX: number,
  centerY: number,
  radius: number
): { segments: SegmentData[]; hexPoints: HexPointType[] } {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const hexPoints: HexPointType[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    hexPoints.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  const segments: SegmentData[] = [];
  let currentAngle = -Math.PI / 2;

  data.forEach((item) => {
    const percentage = total === 0 ? 0 : item.value / total;
    const segmentAngle =
      percentage >= 1 ? 2 * Math.PI : Math.max(percentage * 2 * Math.PI, 0.01); // full circle or min slice
    const endAngle = currentAngle + segmentAngle;

    const labelAngle = currentAngle + segmentAngle / 2;
    const labelRadius = radius * 0.65;
    const labelX = centerX + labelRadius * Math.cos(labelAngle);
    const labelY = centerY + labelRadius * Math.sin(labelAngle);

    let pathData: string;

    if (percentage >= 1) {
      // full circle segment
      pathData = `
        M ${centerX} ${centerY}
        m -${radius}, 0
        a ${radius} ${radius} 0 1 0 ${radius * 2} 0
        a ${radius} ${radius} 0 1 0 -${radius * 2} 0
      `;
    } else {
      const startX = centerX + radius * Math.cos(currentAngle);
      const startY = centerY + radius * Math.sin(currentAngle);
      const endX = centerX + radius * Math.cos(endAngle);
      const endY = centerY + radius * Math.sin(endAngle);
      const largeArcFlag = segmentAngle > Math.PI ? 1 : 0;
      pathData = [
        `M ${centerX} ${centerY}`,
        `L ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        "Z",
      ].join(" ");
    }

    segments.push({
      path: pathData,
      color: item.color,
      label: item.label,
      value: item.value,
      percentage: percentage * 100,
      labelX,
      labelY,
    });
    currentAngle = endAngle;
  });

  return { segments, hexPoints };
}

function HexagonPieChart({
  title,
  data,
  currency,
}: {
  title: string;
  data: { label: string; value: number; color: ColorType }[];
  currency: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const centerX = 200,
    centerY = 200,
    radius = 140;
  const { segments, hexPoints } = createHexagonSegments(
    data,
    centerX,
    centerY,
    radius
  );

  const hexagonPath =
    hexPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
    " Z";

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartGlow} />
      <div className={styles.chartContent}>
        <h3 className={styles.chartTitle}>{title}</h3>
        <div className={styles.chartLayout}>
          <div className={styles.chartSvgContainer}>
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              className={styles.chartSvg}
            >
              <defs>
                <clipPath id={`hexClip-${title.replace(/\s/g, "")}`}>
                  <path d={hexagonPath} />
                </clipPath>
                {segments.map((segment, i) => (
                  <linearGradient
                    key={i}
                    id={`grad-${title.replace(/\s/g, "")}-${i}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{
                        stopColor: segment.color.border,
                        stopOpacity: 1,
                      }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: segment.color.bg, stopOpacity: 0.8 }}
                    />
                  </linearGradient>
                ))}
                {segments.map((segment, i) => (
                  <filter
                    key={i}
                    id={`shadow-${title.replace(/\s/g, "")}-${i}`}
                  >
                    <feDropShadow
                      dx="0"
                      dy="4"
                      stdDeviation="6"
                      floodOpacity="0.4"
                      floodColor={segment.color.border}
                    />
                  </filter>
                ))}
                <radialGradient id={`centerGrad-${title.replace(/\s/g, "")}`}>
                  <stop
                    offset="0%"
                    style={{ stopColor: "#ffffff", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#fffdf8", stopOpacity: 1 }}
                  />
                </radialGradient>
              </defs>

              {/* Outer glow */}
              <path
                d={
                  hexPoints
                    .map((p, i) => {
                      const scale = 1.08;
                      const scaledX = centerX + (p.x - centerX) * scale;
                      const scaledY = centerY + (p.y - centerY) * scale;
                      return `${i === 0 ? "M" : "L"} ${scaledX} ${scaledY}`;
                    })
                    .join(" ") + " Z"
                }
                fill="none"
                stroke="rgba(245, 158, 11, 0.2)"
                strokeWidth="2"
                opacity={0.4}
                style={{ filter: "blur(1px)" }}
              />

              {/* Hexagon border */}
              <path
                d={hexagonPath}
                fill="none"
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="3"
              />

              {/* Segments */}
              <g clipPath={`url(#hexClip-${title.replace(/\s/g, "")})`}>
                {segments.map((segment, i) => (
                  <path
                    key={i}
                    d={segment.path}
                    fill={`url(#grad-${title.replace(/\s/g, "")}-${i})`}
                    stroke={segment.color.border}
                    strokeWidth={2.5}
                    className={styles.segment}
                    style={{
                      opacity:
                        hoveredIndex === null || hoveredIndex === i ? 1 : 0.4,
                      transform:
                        hoveredIndex === i ? "scale(1.05)" : "scale(1)",
                      transformOrigin: `${centerX}px ${centerY}px`,
                      filter:
                        hoveredIndex === i
                          ? `url(#shadow-${title.replace(/\s/g, "")}-${i})`
                          : "none",
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                ))}
              </g>

              {/* Center circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r="55"
                fill={`url(#centerGrad-${title.replace(/\s/g, "")})`}
                style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.1))" }}
              />
              <circle
                cx={centerX}
                cy={centerY}
                r="55"
                fill="none"
                stroke="rgba(245,158,11,0.25)"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Legend */}
          <div className={styles.legend}>
            {segments.map((segment, i) => (
              <div
                key={i}
                className={`${styles.legendItem} ${
                  hoveredIndex === i ? styles.legendItemHovered : ""
                }`}
                style={{
                  background:
                    hoveredIndex === i
                      ? `linear-gradient(135deg, ${segment.color.bg.replace(
                          "0.85",
                          "0.15"
                        )}, rgba(255,255,255,0.8))`
                      : "transparent",
                  borderColor:
                    hoveredIndex === i ? segment.color.border : "transparent",
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={styles.legendColor}
                  style={{
                    background: `linear-gradient(135deg, ${segment.color.border}, ${segment.color.bg})`,
                    borderColor: segment.color.border,
                  }}
                />
                <div className={styles.legendText}>
                  <div className={styles.legendLabel}>{segment.label}</div>
                  <div className={styles.legendValue}>
                    {currency}
                    {segment.value.toFixed(2)}{" "}
                    <span
                      className={styles.legendPercentage}
                      style={{ color: segment.color.border }}
                    >
                      ({segment.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function IncomeSpendingDoughnuts({
  transactions,
  currency,
  totalIncome,
  totalSpending,
}: IncomeSpendingDoughnutsProps) {
  const incomeTotals: { [key in IncomeCategory]?: number } = {};
  const spendingTotals: { [key in SpendingCategory]?: number } = {};

  transactions.forEach((tx) => {
    if (
      tx.amount > 0 &&
      INCOME_CATEGORIES.includes(tx.category as IncomeCategory)
    ) {
      incomeTotals[tx.category as IncomeCategory] =
        (incomeTotals[tx.category as IncomeCategory] || 0) + tx.amount;
    } else if (
      tx.amount < 0 &&
      SPENDING_CATEGORIES.includes(tx.category as SpendingCategory)
    ) {
      spendingTotals[tx.category as SpendingCategory] =
        (spendingTotals[tx.category as SpendingCategory] || 0) +
        Math.abs(tx.amount);
    }
  });

  const incomeData = Object.entries(incomeTotals).map(([label, value], i) => ({
    label,
    value: value || 0,
    color: COLORS[i % COLORS.length],
  }));
  const spendingData = Object.entries(spendingTotals).map(
    ([label, value], i) => ({
      label,
      value: value || 0,
      color: COLORS[i % COLORS.length],
    })
  );

  return (
    <div className={styles.container}>
      <div className={styles.chartsGrid}>
        <HexagonPieChart
          title="Income by Category"
          data={incomeData}
          currency={currency}
        />
        <HexagonPieChart
          title="Spending by Category"
          data={spendingData}
          currency={currency}
        />
      </div>
      <div className={styles.cardsGrid}>
        <OverviewCard
          label="Total Income"
          value={totalIncome}
          currency={currency}
        />
        <OverviewCard
          label="Total Spending"
          value={totalSpending}
          currency={currency}
        />
      </div>
    </div>
  );
}
