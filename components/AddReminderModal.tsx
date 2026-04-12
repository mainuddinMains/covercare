"use client";

import { useState } from "react";
import { Reminder } from "@/hooks/useReminders";

interface Props {
  initial?: Partial<Reminder>;
  onSave: (data: Omit<Reminder, "id" | "notified" | "createdAt">) => void;
  onClose: () => void;
}

const REMIND_OPTIONS = [
  { label: "15 minutes before", value: 15 },
  { label: "30 minutes before", value: 30 },
  { label: "1 hour before",     value: 60 },
  { label: "2 hours before",    value: 120 },
  { label: "1 day before",      value: 1440 },
  { label: "2 days before",     value: 2880 },
];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function AddReminderModal({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    providerName: initial?.providerName ?? "",
    providerAddress: initial?.providerAddress ?? "",
    providerPhone: initial?.providerPhone ?? "",
    appointmentDate: initial?.appointmentDate ?? todayStr(),
    appointmentTime: initial?.appointmentTime ?? "09:00",
    reminderMinutesBefore: initial?.reminderMinutesBefore ?? 60,
    notes: initial?.notes ?? "",
  });
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.providerName.trim()) { setError("Provider name is required."); return; }
    if (!form.appointmentDate)     { setError("Appointment date is required."); return; }
    if (!form.appointmentTime)     { setError("Appointment time is required."); return; }

    const apptMs = new Date(`${form.appointmentDate}T${form.appointmentTime}`).getTime();
    if (apptMs <= Date.now()) { setError("Appointment must be in the future."); return; }

    onSave(form);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 text-base">
            {initial?.providerName ? "Edit Reminder" : "Add Appointment Reminder"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Provider / Clinic Name *</label>
            <input
              type="text"
              value={form.providerName}
              onChange={(e) => set("providerName", e.target.value)}
              placeholder="e.g. Dr. Sarah Chen, Barnes-Jewish Hospital"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
              <input
                type="date"
                value={form.appointmentDate}
                min={todayStr()}
                onChange={(e) => set("appointmentDate", e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Time *</label>
              <input
                type="time"
                value={form.appointmentTime}
                onChange={(e) => set("appointmentTime", e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Remind me</label>
            <select
              value={form.reminderMinutesBefore}
              onChange={(e) => set("reminderMinutesBefore", Number(e.target.value))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {REMIND_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Address (optional)</label>
            <input
              type="text"
              value={form.providerAddress}
              onChange={(e) => set("providerAddress", e.target.value)}
              placeholder="123 Main St, St. Louis, MO"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={form.providerPhone}
                onChange={(e) => set("providerPhone", e.target.value)}
                placeholder="(314) 555-0100"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Bring insurance card"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Save Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
