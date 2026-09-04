"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import type { ComparisonEntryData } from "@/server/domain"

export function ComparisonChart({ entries }: { entries: ComparisonEntryData[] }) {
  const data = entries.map((entry) => ({ name: `${entry.companyName} ${entry.companyLevelCode}`, value: entry.metrics.medianTc ?? 0 }))
  return <div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ top: 8, right: 20, bottom: 0, left: 12 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={116} tickLine={false} axisLine={false} tick={{ fill: "var(--foreground)", fontSize: 12 }} /><Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Median TC"]} cursor={{ fill: "var(--secondary)" }} /><Bar dataKey="value" fill="var(--primary)" radius={[0, 6, 6, 0]} barSize={26} /></BarChart></ResponsiveContainer></div>
}
