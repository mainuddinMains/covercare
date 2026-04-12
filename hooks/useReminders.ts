"use client";

import { useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface Reminder {
  id: string;
  providerName: string;
  providerAddress?: string;
  providerPhone?: string;
  appointmentDate: string;  // "YYYY-MM-DD"
  appointmentTime: string;  // "HH:MM"
  reminderMinutesBefore: number;
  notes: string;
  notified: boolean;
  createdAt: string;
}

export function useReminders() {
  const [reminders, setReminders, { hydrated }] = useLocalStorage<Reminder[]>(
    "covercare:reminders",
    []
  );

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const addReminder = useCallback(
    (data: Omit<Reminder, "id" | "notified" | "createdAt">) => {
      const reminder: Reminder = {
        ...data,
        id: crypto.randomUUID(),
        notified: false,
        createdAt: new Date().toISOString(),
      };
      setReminders((prev) => [...prev, reminder].sort(byDate));
      requestNotificationPermission();
      return reminder;
    },
    [setReminders]
  );

  const updateReminder = useCallback(
    (id: string, patch: Partial<Omit<Reminder, "id" | "createdAt">>) => {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r)).sort(byDate)
      );
    },
    [setReminders]
  );

  const deleteReminder = useCallback(
    (id: string) => {
      setReminders((prev) => prev.filter((r) => r.id !== id));
    },
    [setReminders]
  );

  // ── Notification polling ──────────────────────────────────────────────────

  useEffect(() => {
    if (!hydrated) return;

    const check = () => {
      const now = Date.now();
      setReminders((prev) => {
        let changed = false;
        const next = prev.map((r) => {
          if (r.notified) return r;
          const apptMs = new Date(`${r.appointmentDate}T${r.appointmentTime}`).getTime();
          const fireAt = apptMs - r.reminderMinutesBefore * 60_000;
          if (now >= fireAt && now < apptMs + 60_000) {
            fireNotification(r);
            changed = true;
            return { ...r, notified: true };
          }
          return r;
        });
        return changed ? next : prev;
      });
    };

    check(); // run immediately on mount
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, [hydrated, setReminders]);

  // ── Computed ──────────────────────────────────────────────────────────────

  const upcoming = reminders.filter((r) => {
    const apptMs = new Date(`${r.appointmentDate}T${r.appointmentTime}`).getTime();
    return apptMs > Date.now();
  });

  const past = reminders.filter((r) => {
    const apptMs = new Date(`${r.appointmentDate}T${r.appointmentTime}`).getTime();
    return apptMs <= Date.now();
  });

  return { reminders, upcoming, past, addReminder, updateReminder, deleteReminder, hydrated };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function byDate(a: Reminder, b: Reminder) {
  return new Date(`${a.appointmentDate}T${a.appointmentTime}`).getTime() -
         new Date(`${b.appointmentDate}T${b.appointmentTime}`).getTime();
}

function requestNotificationPermission() {
  if (typeof Notification !== "undefined" && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function fireNotification(r: Reminder) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  new Notification("CoverCare — Appointment Reminder", {
    body: `${r.providerName} today at ${formatTime(r.appointmentTime)}${r.notes ? `\n${r.notes}` : ""}`,
    icon: "/favicon.ico",
    tag: `reminder-${r.id}`,
  });
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}
