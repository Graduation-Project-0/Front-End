import React, { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function filterChartDataByRange(fullData, range, year) {
  if (!Array.isArray(fullData) || fullData.length === 0) return fullData;
  if (range === "year") return fullData;

  const today = new Date();
  const endIdx = year === today.getFullYear() ? today.getMonth() : 11;
  const span = range === "6m" ? 6 : 3;
  const startIdx = Math.max(0, endIdx - span + 1);
  return fullData.slice(startIdx, endIdx + 1);
}

function MonthScansTooltipBody({ monthName, chartYear, displayed, valueLabel }) {
  return (
    <div
      className="grid min-w-[8rem] gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-2 text-xs shadow-md"
      style={{ backgroundColor: "#ffffff", border: "1px solid #e5e5e5", color: "#000000" }}
    >
      <div className="font-medium text-neutral-600">
        {monthName} {chartYear}
      </div>
      <div className="flex items-center gap-2 font-bold text-black">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#7CFF8A]"
          aria-hidden
        />
        <span>
          {displayed}{" "}
          <span className="font-medium text-neutral-700">{valueLabel}</span>
        </span>
      </div>
    </div>
  );
}

function ChartExportMonthTooltips({
  visible,
  chartData,
  chartYear,
  scansChartYMax,
  getTooltipProps,
}) {
  if (!visible || !chartData?.length) return null;
  const plotLeft = 11;
  const plotWidth = 86;
  const plotBottom = 14;
  const plotHeight = 72;

  return (
    <div className="pointer-events-none absolute inset-0 z-[6]" aria-hidden>
      {chartData.map((row, i) => {
        const scans = Number(row.scans) || 0;
        const left = plotLeft + ((i + 0.5) / chartData.length) * plotWidth;
        const heightRatio =
          scansChartYMax > 0 ? Math.min(1, scans / scansChartYMax) : 0;
        const bottom = plotBottom + heightRatio * plotHeight;
        const { monthName, displayed, valueLabel } = getTooltipProps(row, row.name);
        return (
          <div
            key={`${row.name}-${chartYear}`}
            className="absolute -translate-x-1/2"
            style={{ left: `${left}%`, bottom: `${bottom}%` }}
          >
            <MonthScansTooltipBody
              monthName={monthName}
              chartYear={chartYear}
              displayed={displayed}
              valueLabel={valueLabel}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardScansChart({
  chartData,
  chartYear,
  combinedFileUrlEmailTotal,
  exportChartTooltips = false,
}) {
  const [timeRange, setTimeRange] = useState("year");

  const filteredData = useMemo(
    () => filterChartDataByRange(chartData, timeRange, chartYear),
    [chartData, timeRange, chartYear]
  );

  const exportData = exportChartTooltips
    ? filterChartDataByRange(chartData, "year", chartYear)
    : filteredData;

  const scansMax = exportData.reduce(
    (m, d) => Math.max(m, Number(d.scans) || 0),
    0
  );
  const scansChartYMax = scansMax > 0 ? scansMax : 5;

  const getMonthScansTooltipProps = (point, label) => {
    const monthName = typeof point?.name === "string" ? point.name : label;
    const monthIdx =
      typeof monthName === "string" ? CHART_MONTHS.indexOf(monthName) : -1;
    const today = new Date();
    const isCurrentCalendarMonth =
      typeof monthIdx === "number" &&
      monthIdx >= 0 &&
      chartYear === today.getFullYear() &&
      monthIdx === today.getMonth();
    const monthlyScans = Number(point?.scans ?? 0) || 0;
    const displayed = isCurrentCalendarMonth
      ? `${combinedFileUrlEmailTotal}`
      : monthlyScans;
    const valueLabel = isCurrentCalendarMonth ? "SCANS" : "Scans";
    return { monthName, displayed, valueLabel };
  };

  const renderTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const point = payload[0]?.payload ?? {};
    const { monthName, displayed, valueLabel } = getMonthScansTooltipProps(
      point,
      label
    );
    return (
      <MonthScansTooltipBody
        monthName={monthName}
        chartYear={chartYear}
        displayed={displayed}
        valueLabel={valueLabel}
      />
    );
  };

  const rangeLabel =
    timeRange === "year"
      ? "Full year"
      : timeRange === "6m"
        ? "Last 6 months"
        : "Last 3 months";

  return (
    <div className="flex min-h-[280px] flex-col rounded-2xl border border-gray-900 bg-[#0d0d0d] lg:col-span-2 lg:h-full lg:min-h-0">
      <div className="flex shrink-0 flex-col gap-2 border-b border-gray-900 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="grid flex-1 gap-1">
          <h3 className="font-bold tracking-wide text-gray-100">Scans by month</h3>
          <p className="text-xs text-gray-500">
            Monthly scan activity in {chartYear}
            {timeRange !== "year" ? ` · ${rangeLabel}` : ""}
          </p>
        </div>
        <label className="flex shrink-0 items-center gap-2 sm:ml-auto">
          <span className="sr-only">Chart time range</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full min-w-[9.5rem] cursor-pointer rounded-lg border border-gray-800 bg-[#141414] px-3 py-2 text-xs font-medium text-gray-200 outline-none transition focus:border-[#1E7D04]/50 focus:ring-1 focus:ring-[#1E7D04]/40 sm:w-[10.5rem]"
            aria-label="Select chart time range"
          >
            <option value="year">Full year</option>
            <option value="6m">Last 6 months</option>
            <option value="3m">Last 3 months</option>
          </select>
        </label>
      </div>

      <div className="relative min-h-[220px] flex-1 px-2 pb-4 pt-4 sm:px-4 sm:pt-6">
        <ChartExportMonthTooltips
          visible={exportChartTooltips}
          chartData={exportData}
          chartYear={chartYear}
          scansChartYMax={scansChartYMax}
          getTooltipProps={getMonthScansTooltipProps}
        />
        <ResponsiveContainer width="100%" height="100%" minHeight={220}>
          <AreaChart
            data={filteredData}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="dashboardScansFillInteractive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7CFF8A" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#7CFF8A" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#2a2a2a" vertical={false} strokeDasharray="4 4" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={24}
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={32}
              allowDecimals={false}
              domain={[0, scansChartYMax]}
              stroke="#6b7280"
              tick={{ fontSize: 10, fill: "#6b7280" }}
            />
            <Tooltip
              content={renderTooltip}
              cursor={{ stroke: "#7CFF8A", strokeOpacity: 0.35, strokeWidth: 1 }}
            />
            <Area
              type="natural"
              dataKey="scans"
              stroke="#7CFF8A"
              strokeWidth={2}
              fill="url(#dashboardScansFillInteractive)"
              fillOpacity={1}
              baseValue={0}
              isAnimationActive={!exportChartTooltips}
              dot={{ fill: "#7CFF8A", r: 3, strokeWidth: 0 }}
              activeDot={{
                r: 5,
                fill: "#7CFF8A",
                stroke: "#e8ffe8",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
