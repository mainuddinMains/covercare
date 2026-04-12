"use client";

import { useState } from "react";

interface GuideStep {
  number: number;
  icon: string;
  title: string;
  body: string;
  tip?: string;
  items?: string[];
}

const STEPS: GuideStep[] = [
  {
    number: 1,
    icon: "📋",
    title: "Get Ready at Home",
    body: "Before your appointment, gather a few things so check-in goes smoothly.",
    items: [
      "Your insurance card (front and back)",
      "A photo ID — driver's license or passport",
      "A list of any medicines you take, including vitamins",
      "Any past medical records if you have them",
      "A list of questions you want to ask",
    ],
    tip: "No insurance? Tell them when you call. Many clinics offer a sliding-scale fee based on what you can afford.",
  },
  {
    number: 2,
    icon: "🏥",
    title: "Arrive and Check In",
    body: "Get there 10–15 minutes early. The front desk will ask for your name, ID, and insurance card.",
    items: [
      "You may fill out a short health history form — it's okay to leave things blank if you don't know",
      "You might wait 10–30 minutes — this is normal",
      "Bring something to read or listen to",
    ],
    tip: "You can ask the front desk what your visit will cost before you see the doctor.",
  },
  {
    number: 3,
    icon: "👩‍⚕️",
    title: "Meet the Nurse",
    body: "A nurse or medical assistant will bring you to a room first. They'll check a few basic things.",
    items: [
      "Your weight and height",
      "Your blood pressure and temperature",
      "They'll ask why you came in today — be honest, even if it feels embarrassing",
      "They'll check your medicines list",
    ],
    tip: "Write down your main concern before the visit so you don't forget to mention it.",
  },
  {
    number: 4,
    icon: "🩺",
    title: "See Your Doctor",
    body: "The doctor will listen to you, ask questions, and examine you. This is YOUR time — speak up.",
    items: [
      "Describe your symptoms in plain language — no need for medical words",
      "Ask them to explain anything you don't understand",
      "Ask: \"What is this medication for?\" or \"When should I come back?\"",
      "It's okay to say \"Can you write that down for me?\"",
    ],
    tip: "You can bring a friend or family member to listen and help you remember what the doctor says.",
  },
  {
    number: 5,
    icon: "🏠",
    title: "Before You Leave",
    body: "After seeing the doctor, a few things might happen. Make sure you understand the next steps.",
    items: [
      "You might get a prescription — ask the pharmacy about generic options (they cost less)",
      "You might get a referral to see a specialist",
      "Ask when your test results will be ready and how you'll hear about them",
      "Pay any bills at the front desk, or ask about a payment plan",
    ],
    tip: "If you get a bill later in the mail, it's okay to call the billing office and ask for a lower price or payment plan.",
  },
];

export default function AppointmentGuide() {
  const [expanded, setExpanded] = useState<number | null>(0);

  function toggle(i: number) {
    setExpanded((prev) => (prev === i ? null : i));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl" aria-hidden>🗓️</span>
          <h1 className="text-xl font-semibold text-gray-900">Your First Doctor Visit</h1>
        </div>
        <p className="text-sm text-gray-500">
          Not sure what to expect? Here's exactly what happens, step by step.
          Tap any step to see the details.
        </p>
      </div>

      {/* Visual timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" aria-hidden />

        <ol className="space-y-3" aria-label="Appointment steps">
          {STEPS.map((step, i) => {
            const isOpen = expanded === i;
            const isDone = expanded !== null && i < expanded;

            return (
              <li key={step.number} className="relative pl-16">
                {/* Step circle */}
                <div
                  className={`absolute left-0 top-3 w-12 h-12 rounded-full flex flex-col items-center justify-center text-xl border-2 transition-colors ${
                    isOpen
                      ? "bg-blue-600 border-blue-600 shadow-lg"
                      : isDone
                      ? "bg-green-50 border-green-300"
                      : "bg-white border-gray-200"
                  }`}
                  aria-hidden
                >
                  {step.icon}
                </div>

                {/* Card */}
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`step-body-${i}`}
                  className={`w-full text-left rounded-2xl border transition-all p-4 ${
                    isOpen
                      ? "border-blue-200 bg-blue-50 shadow-sm"
                      : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wide">
                        Step {step.number} of {STEPS.length}
                      </span>
                      <h2 className="font-semibold text-gray-900 text-sm mt-0.5">{step.title}</h2>
                      {!isOpen && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{step.body}</p>
                      )}
                    </div>
                    <span
                      className={`flex-shrink-0 ml-2 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    >
                      ▾
                    </span>
                  </div>
                </button>

                {/* Expanded body */}
                {isOpen && (
                  <div
                    id={`step-body-${i}`}
                    role="region"
                    aria-label={step.title}
                    className="mt-2 ml-0 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                  >
                    <p className="text-sm text-gray-700 mb-3">{step.body}</p>

                    {step.items && (
                      <ul className="space-y-2 mb-3" aria-label="Checklist">
                        {step.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-500 flex-shrink-0 mt-0.5 font-bold" aria-hidden>✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {step.tip && (
                      <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                        <span className="text-amber-500 flex-shrink-0 text-base" aria-hidden>💡</span>
                        <p className="text-xs text-amber-800 leading-relaxed">{step.tip}</p>
                      </div>
                    )}

                    {/* Next / Previous */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => setExpanded(i > 0 ? i - 1 : null)}
                        disabled={i === 0}
                        aria-label="Previous step"
                        className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-0 transition-colors"
                      >
                        ← Previous
                      </button>
                      {i < STEPS.length - 1 ? (
                        <button
                          onClick={() => setExpanded(i + 1)}
                          aria-label={`Next step: ${STEPS[i + 1].title}`}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Next: {STEPS[i + 1].title} →
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-green-600">
                          You're all set! 🎉
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
        <p className="text-sm font-medium text-blue-800 mb-1">Ready to find a clinic?</p>
        <p className="text-xs text-blue-600 mb-3">
          Find a free or low-cost clinic near you using CoverCare's clinic finder.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="/"
            className="text-xs font-medium bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors"
          >
            Ask the assistant
          </a>
          <a
            href="/hospitals"
            className="text-xs font-medium border border-blue-300 text-blue-700 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
          >
            Find nearby hospitals
          </a>
        </div>
      </div>
    </div>
  );
}
