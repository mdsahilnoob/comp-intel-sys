"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import type { CompanyLevelAnalytics } from "@/server/domain"

export function LevelChart({ levels }: { levels: CompanyLevelAnalytics[] }) {
  const data = levels.filter((level) => level.medianTc !== null).map((level) => ({ name: level.levelCode, value: level.medianTc }))
  if (data.length === 0) return <div className="grid min-h-64 place-items-center text-sm text-muted-foreground">Not enough records for a chart yet.</div>
  return <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 4 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" /><XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} /><YAxis hide /><Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Median TC"]} cursor={{ fill: "var(--secondary)" }} /><Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
}
