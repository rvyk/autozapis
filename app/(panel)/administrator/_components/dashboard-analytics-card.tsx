"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CHART_TABS,
  type AnalyticsPayload,
  type ChartPoint,
  type ChartTab,
} from "./dashboard-types";
import { PIE_COLORS } from "./dashboard-utils";

export function DashboardAnalyticsCard({ analytics }: { analytics: AnalyticsPayload }) {
  const [activeChart, setActiveChart] = useState<ChartTab>("REJESTRACJE");

  const totalChartValue = useMemo(() => {
    const source =
      activeChart === "REJESTRACJE"
        ? analytics.registrationsChart
        : activeChart === "PKK"
          ? analytics.pkkChart
          : analytics.categoryChart;

    return source.reduce((sum, item) => sum + item.value, 0);
  }, [activeChart, analytics]);

  const chartDescription =
    activeChart === "REJESTRACJE"
      ? "Nowi kursanci w ostatnich miesiącach"
      : activeChart === "PKK"
        ? "Liczba przesłanych dokumentów PKK"
        : "Struktura oferty kursów";

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Analityka ośrodka</h2>
          <p className="mt-1 text-sm text-stone-500">{chartDescription}</p>
          <p className="mt-1 text-sm font-medium text-stone-700">Łączna wartość: {totalChartValue}</p>
        </div>
        <div className="flex items-center gap-2">
          {CHART_TABS.map((tab) => {
            const isActive = tab === activeChart;
            return (
              <Button
                key={tab}
                variant="ghost"
                size="sm"
                onClick={() => setActiveChart(tab)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold",
                  isActive
                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                    : "text-stone-500 hover:bg-stone-100",
                )}
              >
                {tab === "REJESTRACJE"
                  ? "Rejestracje"
                  : tab === "PKK"
                    ? "PKK"
                    : "Kategorie"}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 h-72 [&_.recharts-surface:focus]:outline-none [&_.recharts-sector:focus]:outline-none [&_.recharts-rectangle:focus]:outline-none [&_.recharts-dot:focus]:outline-none">
        {activeChart === "REJESTRACJE" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.registrationsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="shortLabel" stroke="#78716c" fontSize={12} />
              <YAxis stroke="#78716c" fontSize={12} allowDecimals={false} />
              <Tooltip
                cursor={{ stroke: "#fca5a5", strokeDasharray: "4 4" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #fecaca",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 10px 30px -20px rgba(220,38,38,0.6)",
                }}
                formatter={(value) => [`${Number(value ?? 0)} osób`, "Rejestracje"]}
                labelFormatter={(_label, payload) => {
                  const first = payload?.[0]?.payload as ChartPoint | undefined;
                  return first?.label ? `Miesiąc: ${first.label}` : "Miesiąc";
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#dc2626"
                strokeWidth={3}
                dot={{ r: 4, fill: "#dc2626" }}
                activeDot={{ r: 6, fill: "#991b1b" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : null}

        {activeChart === "PKK" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.pkkChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="shortLabel" stroke="#78716c" fontSize={12} />
              <YAxis stroke="#78716c" fontSize={12} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "rgba(239,68,68,0.08)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #fecaca",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 10px 30px -20px rgba(220,38,38,0.6)",
                }}
                formatter={(value) => [`${Number(value ?? 0)} plików`, "PKK"]}
                labelFormatter={(_label, payload) => {
                  const first = payload?.[0]?.payload as ChartPoint | undefined;
                  return first?.label ? `Miesiąc: ${first.label}` : "Miesiąc";
                }}
              />
              <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : null}

        {activeChart === "KATEGORIE" ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analytics.categoryChart}
                dataKey="value"
                nameKey="label"
                outerRadius={110}
                innerRadius={60}
                paddingAngle={4}
              >
                {analytics.categoryChart.map((entry, index) => (
                  <Cell key={entry.label} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e7e5e4",
                  boxShadow: "0 10px 30px -20px rgba(28,25,23,0.35)",
                }}
                formatter={(value) => [`${Number(value ?? 0)} kursów`, "Liczba"]}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </div>
  );
}
