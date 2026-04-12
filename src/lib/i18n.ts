export type Locale = 'en' | 'es'

export const translations = {
  en: {
    nav_chat: 'Chat',
    nav_hospitals: 'Hospitals',
    nav_cost: 'Cost Estimator',
    nav_reminders: 'Reminders',
    nav_profile: 'Profile',
    nav_sources: 'Sources',

    disclaimer_label: 'Not medical advice.',
    disclaimer_body:
      'CareCompass provides general healthcare navigation guidance only. Always consult a licensed healthcare provider for medical decisions. In an emergency, call',
    disclaimer_dismiss: 'Dismiss',

    chat_welcome:
      "Hi! I'm your CareCompass assistant. I can help you find affordable clinics, compare insurance plans, and look up healthcare providers. What can I help you with today?",
    chat_placeholder: 'Ask about clinics, insurance, or providers\u2026',
    chat_new_convo: 'New conversation',
    chat_profile_active: 'profile active',
    chat_save_profile: '+ Save insurance profile',
    chat_send: 'Send',

    suggestion_clinics: (loc: string) => `Find clinics ${loc}`,
    suggestion_dental: 'What insurance plans cover dental?',
    suggestion_medicaid: 'Do I qualify for Medicaid?',
    suggestion_cardiologist: (state: string) =>
      `Find a cardiologist in ${state}`,

    hospitals_title: 'Find Hospitals Near You',
    hospitals_subtitle:
      'Real-time data from Google Maps. Auto-locating on page load.',
    hospitals_locate: 'Use My Location',
    hospitals_locating: 'Locating\u2026',
    hospitals_searching: 'Searching\u2026',

    estimate_title: 'Estimate Your Out-of-Pocket Cost',
    estimate_subtitle:
      'Based on real CMS Medicare Fee Schedule rates + typical insurance cost-sharing.',
    estimate_button: 'Estimate Cost',
    estimate_loading: 'Looking up CMS rates\u2026',

    profile_title: 'Insurance Profile',

    footer_disclaimer:
      'CareCompass provides general guidance only \u2014 not medical advice.',
    footer_emergency: '911 for emergencies.',

    auth_title: 'CareCompass',
    auth_subtitle: 'Your US healthcare navigation guide',
    auth_login: 'Log In',
    auth_signup: 'Sign Up',
    auth_name_label: 'Full Name',
    auth_name_placeholder: 'Your name',
    auth_email_label: 'Email',
    auth_email_placeholder: 'you@example.com',
    auth_password_label: 'Password',
    auth_password_placeholder: 'At least 8 characters',
    auth_login_button: 'Log In',
    auth_signup_button: 'Create Account',
    auth_footer: 'Navigate US healthcare with confidence.',
    auth_guest_button: 'Continue as Guest',
    auth_error_generic: 'Something went wrong. Please try again.',
    auth_logout: 'Log Out',
  },

  es: {
    nav_chat: 'Chat',
    nav_hospitals: 'Hospitales',
    nav_cost: 'Estimador de Costos',
    nav_reminders: 'Recordatorios',
    nav_profile: 'Perfil',
    nav_sources: 'Fuentes',

    disclaimer_label: 'No es consejo m\u00e9dico.',
    disclaimer_body:
      'CareCompass proporciona orientaci\u00f3n general de navegaci\u00f3n de salud \u00fanicamente. Siempre consulte a un proveedor de salud licenciado para decisiones m\u00e9dicas. En una emergencia, llame al',
    disclaimer_dismiss: 'Cerrar',

    chat_welcome:
      '\u00a1Hola! Soy tu asistente de CareCompass. Puedo ayudarte a encontrar cl\u00ednicas asequibles, comparar planes de seguro y buscar proveedores de salud. \u00bfEn qu\u00e9 puedo ayudarte hoy?',
    chat_placeholder:
      'Pregunta sobre cl\u00ednicas, seguros o proveedores\u2026',
    chat_new_convo: 'Nueva conversaci\u00f3n',
    chat_profile_active: 'perfil activo',
    chat_save_profile: '+ Guardar perfil de seguro',
    chat_send: 'Enviar',

    suggestion_clinics: (loc: string) => `Encontrar cl\u00ednicas ${loc}`,
    suggestion_dental:
      '\u00bfQu\u00e9 planes cubren tratamiento dental?',
    suggestion_medicaid: '\u00bfCalifico para Medicaid?',
    suggestion_cardiologist: (state: string) =>
      `Encontrar cardi\u00f3logo en ${state}`,

    hospitals_title: 'Encontrar Hospitales Cerca de Ti',
    hospitals_subtitle:
      'Datos en tiempo real de Google Maps. Ubicaci\u00f3n autom\u00e1tica al cargar.',
    hospitals_locate: 'Usar Mi Ubicaci\u00f3n',
    hospitals_locating: 'Localizando\u2026',
    hospitals_searching: 'Buscando\u2026',

    estimate_title: 'Estima Tu Costo de Bolsillo',
    estimate_subtitle:
      'Basado en tarifas reales del Programa de Honorarios de Medicare de CMS.',
    estimate_button: 'Estimar Costo',
    estimate_loading: 'Consultando tarifas de CMS\u2026',

    profile_title: 'Perfil de Seguro',

    footer_disclaimer:
      'CareCompass ofrece orientaci\u00f3n general \u00fanicamente \u2014 no es consejo m\u00e9dico.',
    footer_emergency: '911 en emergencias.',

    auth_title: 'CareCompass',
    auth_subtitle: 'Tu gu\u00eda de navegaci\u00f3n de salud en EE.UU.',
    auth_login: 'Iniciar Sesi\u00f3n',
    auth_signup: 'Registrarse',
    auth_name_label: 'Nombre Completo',
    auth_name_placeholder: 'Tu nombre',
    auth_email_label: 'Correo Electr\u00f3nico',
    auth_email_placeholder: 'tu@ejemplo.com',
    auth_password_label: 'Contrase\u00f1a',
    auth_password_placeholder: 'Al menos 8 caracteres',
    auth_login_button: 'Iniciar Sesi\u00f3n',
    auth_signup_button: 'Crear Cuenta',
    auth_footer: 'Navega el sistema de salud de EE.UU. con confianza.',
    auth_guest_button: 'Continuar como Invitado',
    auth_error_generic: 'Algo sali\u00f3 mal. Int\u00e9ntalo de nuevo.',
    auth_logout: 'Cerrar Sesi\u00f3n',
  },
} as const

export type Translations = {
  [K in keyof (typeof translations)['en']]: (typeof translations)['en'][K] extends (
    ...args: infer A
  ) => string
    ? (...args: A) => string
    : string
}
