"use client";

import { useState } from "react";
import { useReminders, Reminder } from "@/hooks/useReminders";
import AddReminderModal from "./AddReminderModal";

function formatDate(date: string, time: string) {
  const d = new Date(`${date}T${time}`);
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function daysUntil(date: string, time: string) {
  const diff = new Date(`${date}T${time}`).getTime() - Date.now();
  const days = Math.ceil(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 0) return null;
  return `In ${days} days`;
}

interface ReminderCardProps {
  reminder: Reminder;
  onDelete: (id: string) => void;
  onEdit: (r: Reminder) => void;
}

function ReminderCard({ reminder: r, onDelete, onEdit }: ReminderCardProps) {
  const until = daysUntil(r.appointmentDate, r.appointmentTime);
  const isPast = !until;

  return (
    <div className={`bg-white border rounded-xl p-4 shadow-sm ${isPast ? "opacity-60 border-gray-100" : "border-gray-100 hover:shadow-md"} transition-shadow`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-gray-900 truncate">{r.providerName}</h3>
            {until && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                until === "Today" || until === "Tomorrow"
                  ? "bg-orange-50 text-orange-700"
                  : "bg-blue-50 text-blue-700"
              }`}>
                {until}
              </span>
            )}
            {isPast && (
              <span className="text-xs text-gray-400 flex-shrink-0">Past</span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{formatDate(r.appointmentDate, r.appointmentTime)}</p>

          {(r.providerAddress || r.providerPhone || r.notes) && (
            <div className="mt-1.5 space-y-0.5 text-xs text-gray-500">
              {r.providerAddress && (
                <p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(r.providerAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {r.providerAddress}
                  </a>
                </p>
              )}
              {r.providerPhone && (
                <p><a href={`tel:${r.providerPhone}`} className="text-blue-600 hover:underline">{r.providerPhone}</a></p>
              )}
              {r.notes && <p className="text-gray-400 italic">{r.notes}</p>}
            </div>
          )}
        </div>

        {!isPast && (
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(r)}
              className="text-xs text-gray-400 hover:text-blue-600 px-2 py-1 rounded transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(r.id)}
              className="text-xs text-gray-400 hover:text-red-600 px-2 py-1 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RemindersList() {
  const { upcoming, past, addReminder, updateReminder, deleteReminder, hydrated } = useReminders();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);

  function handleSave(data: Omit<Reminder, "id" | "notified" | "createdAt">) {
    if (editing) {
      updateReminder(editing.id, { ...data, notified: false });
      setEditing(null);
    } else {
      addReminder(data);
    }
  }

  function handleEdit(r: Reminder) {
    setEditing(r);
    setShowModal(true);
  }

  function handleClose() {
    setShowModal(false);
    setEditing(null);
  }

  if (!hydrated) {
    return <div className="max-w-2xl mx-auto px-4 py-8 text-sm text-gray-400">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Appointment Reminders</h2>
          <p className="text-sm text-gray-500">
            Browser notifications fire when your reminder time arrives — even across tabs.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add
        </button>
      </div>

      {upcoming.length === 0 && past.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🗓️</div>
          <p className="text-sm">No reminders yet.</p>
          <p className="text-xs mt-1">Add an appointment and we'll notify you in time.</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Upcoming</h3>
          {upcoming.map((r) => (
            <ReminderCard key={r.id} reminder={r} onDelete={deleteReminder} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Past</h3>
          {past.map((r) => (
            <ReminderCard key={r.id} reminder={r} onDelete={deleteReminder} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {(showModal || editing) && (
        <AddReminderModal
          initial={editing ?? undefined}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
