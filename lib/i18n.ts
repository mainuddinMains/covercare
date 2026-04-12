export type Locale = "en" | "es";

export const translations = {
  en: {
    // Nav
    nav_chat:          "Chat",
    nav_hospitals:     "Hospitals",
    nav_cost:          "Cost Estimator",
    nav_reminders:     "Reminders",
    nav_profile:       "Profile",
    nav_sources:       "Sources",

    // Disclaimer
    disclaimer_label:  "Not medical advice.",
    disclaimer_body:   "CoverCare provides general healthcare navigation guidance only. Always consult a licensed healthcare provider for medical decisions. In an emergency, call",
    disclaimer_dismiss:"Dismiss",

    // Chat
    chat_welcome:      "Hi! I'm your CoverCare assistant. I can help you find affordable clinics, compare insurance plans, and look up healthcare providers. What can I help you with today?",
    chat_placeholder:  "Ask about clinics, insurance, or providers…",
    chat_new_convo:    "New conversation",
    chat_profile_active: "profile active",
    chat_save_profile: "+ Save insurance profile",
    chat_send:         "Send",

    // Suggestions
    suggestion_clinics:     (loc: string) => `Find clinics ${loc}`,
    suggestion_dental:      "What insurance plans cover dental?",
    suggestion_medicaid:    "Do I qualify for Medicaid?",
    suggestion_cardiologist:(state: string) => `Find a cardiologist in ${state}`,

    // Hospital finder
    hospitals_title:   "Find Hospitals Near You",
    hospitals_subtitle:"Real-time data from Google Maps. Auto-locating on page load.",
    hospitals_locate:  "Use My Location",
    hospitals_locating:"Locating…",
    hospitals_searching:"Searching…",

    // Cost estimator
    estimate_title:    "Estimate Your Out-of-Pocket Cost",
    estimate_subtitle: "Based on real CMS Medicare Fee Schedule rates + typical insurance cost-sharing.",
    estimate_button:   "Estimate Cost",
    estimate_loading:  "Looking up CMS rates…",

    // Profile
    profile_title:     "Insurance Profile",

    // Footer
    footer_disclaimer: "CoverCare provides general guidance only — not medical advice.",
    footer_emergency:  "911 for emergencies.",
  },

  es: {
    // Nav
    nav_chat:          "Chat",
    nav_hospitals:     "Hospitales",
    nav_cost:          "Estimador de Costos",
    nav_reminders:     "Recordatorios",
    nav_profile:       "Perfil",
    nav_sources:       "Fuentes",

    // Disclaimer
    disclaimer_label:  "No es consejo médico.",
    disclaimer_body:   "CoverCare proporciona orientación general de navegación de salud únicamente. Siempre consulte a un proveedor de salud licenciado para decisiones médicas. En una emergencia, llame al",
    disclaimer_dismiss:"Cerrar",

    // Chat
    chat_welcome:      "¡Hola! Soy tu asistente de CoverCare. Puedo ayudarte a encontrar clínicas asequibles, comparar planes de seguro y buscar proveedores de salud. ¿En qué puedo ayudarte hoy?",
    chat_placeholder:  "Pregunta sobre clínicas, seguros o proveedores…",
    chat_new_convo:    "Nueva conversación",
    chat_profile_active: "perfil activo",
    chat_save_profile: "+ Guardar perfil de seguro",
    chat_send:         "Enviar",

    // Suggestions
    suggestion_clinics:     (loc: string) => `Encontrar clínicas ${loc}`,
    suggestion_dental:      "¿Qué planes cubren tratamiento dental?",
    suggestion_medicaid:    "¿Califico para Medicaid?",
    suggestion_cardiologist:(state: string) => `Encontrar cardiólogo en ${state}`,

    // Hospital finder
    hospitals_title:   "Encontrar Hospitales Cerca de Ti",
    hospitals_subtitle:"Datos en tiempo real de Google Maps. Ubicación automática al cargar.",
    hospitals_locate:  "Usar Mi Ubicación",
    hospitals_locating:"Localizando…",
    hospitals_searching:"Buscando…",

    // Cost estimator
    estimate_title:    "Estima Tu Costo de Bolsillo",
    estimate_subtitle: "Basado en tarifas reales del Programa de Honorarios de Medicare de CMS.",
    estimate_button:   "Estimar Costo",
    estimate_loading:  "Consultando tarifas de CMS…",

    // Profile
    profile_title:     "Perfil de Seguro",

    // Footer
    footer_disclaimer: "CoverCare ofrece orientación general únicamente — no es consejo médico.",
    footer_emergency:  "911 en emergencias.",
  },
} as const;

// Widened type so both locales satisfy it (avoids literal-type mismatches)
export type Translations = {
  [K in keyof typeof translations.en]: (typeof translations.en)[K] extends (...args: infer A) => string
    ? (...args: A) => string
    : string;
};
