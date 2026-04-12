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
    chat_history: 'History',
    chat_no_history: 'No past conversations yet.',
    chat_delete: 'Delete',

    suggestion_clinics: (loc: string) => `Find clinics ${loc}`,
    suggestion_dental: 'What insurance plans cover dental?',
    suggestion_medicaid: 'Do I qualify for Medicaid?',
    suggestion_cardiologist: (state: string) =>
      state ? `Find a cardiologist in ${state}` : 'Find a cardiologist near me',

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
    auth_or: 'or',
    auth_logout: 'Log Out',

    cost_heading: 'Estimate Your Out-of-Pocket Cost',
    cost_subtitle: 'Based on real CMS Medicare Fee Schedule rates.',
    cost_step_category: 'Category',
    cost_step_procedure: 'Procedure',
    cost_step_insurance: 'Insurance',
    cost_step_result: 'Result',
    cost_back: 'Back',
    cost_loading: 'Looking up CMS rates...',
    cost_error: 'Could not fetch cost estimate. Please try again.',
    cost_your_estimated: 'Your estimated cost',
    cost_total_billed: 'Total billed',
    cost_not_available: 'Cost data not available',
    cost_not_available_detail:
      'CMS does not publish a rate for this procedure. Contact your insurer directly for a cost estimate.',
    cost_estimate_another: 'Estimate another procedure',
    cost_source: 'Source:',

    hospital_heading: 'Find Hospitals',
    hospital_subtitle:
      'CMS Medicare-certified hospitals searchable by ZIP code.',
    hospital_zip_placeholder: 'Enter ZIP code',
    hospital_use_location: 'Use My Location',
    hospital_detecting: 'Detecting location...',
    hospital_error_fetch: 'Could not load hospitals. Please try again.',
    hospital_error_geolocation: 'Geolocation is not supported by your browser.',
    hospital_error_zip: 'Could not determine your ZIP code. Please enter it manually.',
    hospital_error_location: 'Could not determine your location. Please enter a ZIP code.',
    hospital_error_permission: 'Location permission denied. Please enter a ZIP code.',
    hospital_no_results: 'No hospitals found in this area.',
    hospital_widened: (prefix: string) => `Showing hospitals in the wider ${prefix}xx area.`,
    hospital_cms_rating: 'CMS Rating',
    hospital_source: 'Source: CMS Provider Data Catalog',

    location_use_my_location: 'Use My Location',
    location_locating: 'Locating...',
    location_or: 'or',
    location_zip_placeholder: 'Enter ZIP code',
    location_go: 'Go',
    location_error_geolocation: 'Geolocation is not supported by your browser.',
    location_error_determine: 'Could not determine your location. Enter a ZIP code instead.',
    location_error_permission: 'Location permission denied. Enter a ZIP code instead.',

    conversation_back: 'Back',

    landing_emergency_heading: 'In an emergency? Call',
    landing_emergency_detail:
      'ERs are federally required to treat you regardless of insurance or immigration status.',
    landing_call_911: 'Call 911',
    landing_get_started: 'Get Started Free',
    landing_explore: 'Explore',
    landing_guest_error: 'Could not continue as guest. Please try again.',
    landing_trust_hipaa: 'HIPAA Compliant',
    landing_trust_free: '100% Free',
    landing_trust_ai: 'AI Powered',
    landing_feature_chat_title: 'AI Chat Guidance',
    landing_feature_chat_desc:
      'Cut through the jargon. Get clear, actionable answers to your healthcare questions in plain language.',
    landing_feature_cost_title: 'Cost Estimator',
    landing_feature_cost_desc:
      "Know what you'll owe before you go. Estimate out-of-pocket expenses using verified CMS Medicare data.",
    landing_feature_facilities_title: 'Find Facilities',
    landing_feature_facilities_desc:
      'Locate the right care, fast. Search nearby hospitals filtered by specialty, quality, and network acceptance.',
    landing_feature_literacy_title: 'Insurance Literacy',
    landing_feature_literacy_desc:
      'Demystify the fine print. Learn exactly how copays, deductibles, and networks impact your wallet.',
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
    chat_history: 'Historial',
    chat_no_history: 'No hay conversaciones anteriores.',
    chat_delete: 'Eliminar',

    suggestion_clinics: (loc: string) => `Encontrar cl\u00ednicas ${loc}`,
    suggestion_dental:
      '\u00bfQu\u00e9 planes cubren tratamiento dental?',
    suggestion_medicaid: '\u00bfCalifico para Medicaid?',
    suggestion_cardiologist: (state: string) =>
      state ? `Encontrar cardi\u00f3logo en ${state}` : 'Encontrar cardi\u00f3logo cerca de mi',

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
    auth_or: 'o',
    auth_logout: 'Cerrar Sesi\u00f3n',

    cost_heading: 'Estima Tu Costo de Bolsillo',
    cost_subtitle: 'Basado en tarifas reales del Programa de Honorarios de Medicare de CMS.',
    cost_step_category: 'Categor\u00eda',
    cost_step_procedure: 'Procedimiento',
    cost_step_insurance: 'Seguro',
    cost_step_result: 'Resultado',
    cost_back: 'Volver',
    cost_loading: 'Consultando tarifas de CMS...',
    cost_error: 'No se pudo obtener el estimado de costo. Int\u00e9ntalo de nuevo.',
    cost_your_estimated: 'Tu costo estimado',
    cost_total_billed: 'Total facturado',
    cost_not_available: 'Datos de costo no disponibles',
    cost_not_available_detail:
      'CMS no publica una tarifa para este procedimiento. Contacta a tu aseguradora directamente para un estimado de costo.',
    cost_estimate_another: 'Estimar otro procedimiento',
    cost_source: 'Fuente:',

    hospital_heading: 'Encontrar Hospitales',
    hospital_subtitle:
      'Hospitales certificados por Medicare de CMS, b\u00fasqueda por c\u00f3digo postal.',
    hospital_zip_placeholder: 'Ingresa c\u00f3digo postal',
    hospital_use_location: 'Usar Mi Ubicaci\u00f3n',
    hospital_detecting: 'Detectando ubicaci\u00f3n...',
    hospital_error_fetch: 'No se pudieron cargar los hospitales. Int\u00e9ntalo de nuevo.',
    hospital_error_geolocation: 'Tu navegador no soporta geolocalizaci\u00f3n.',
    hospital_error_zip: 'No se pudo determinar tu c\u00f3digo postal. Ingr\u00e9salo manualmente.',
    hospital_error_location: 'No se pudo determinar tu ubicaci\u00f3n. Ingresa un c\u00f3digo postal.',
    hospital_error_permission: 'Permiso de ubicaci\u00f3n denegado. Ingresa un c\u00f3digo postal.',
    hospital_no_results: 'No se encontraron hospitales en esta \u00e1rea.',
    hospital_widened: (prefix: string) => `Mostrando hospitales en el \u00e1rea ampliada ${prefix}xx.`,
    hospital_cms_rating: 'Calificaci\u00f3n CMS',
    hospital_source: 'Fuente: Cat\u00e1logo de Datos de Proveedores de CMS',

    location_use_my_location: 'Usar Mi Ubicaci\u00f3n',
    location_locating: 'Localizando...',
    location_or: 'o',
    location_zip_placeholder: 'Ingresa c\u00f3digo postal',
    location_go: 'Ir',
    location_error_geolocation: 'Tu navegador no soporta geolocalizaci\u00f3n.',
    location_error_determine: 'No se pudo determinar tu ubicaci\u00f3n. Ingresa un c\u00f3digo postal.',
    location_error_permission: 'Permiso de ubicaci\u00f3n denegado. Ingresa un c\u00f3digo postal.',

    conversation_back: 'Volver',

    landing_emergency_heading: '\u00bfEs una emergencia? Llama al',
    landing_emergency_detail:
      'Las salas de emergencia est\u00e1n obligadas por ley federal a atenderte sin importar tu seguro o estatus migratorio.',
    landing_call_911: 'Llamar al 911',
    landing_get_started: 'Comienza Gratis',
    landing_explore: 'Explorar',
    landing_guest_error: 'No se pudo continuar como invitado. Int\u00e9ntalo de nuevo.',
    landing_trust_hipaa: 'Cumple con HIPAA',
    landing_trust_free: '100% Gratis',
    landing_trust_ai: 'Con Inteligencia Artificial',
    landing_feature_chat_title: 'Chat con IA',
    landing_feature_chat_desc:
      'Olvida la jerga m\u00e9dica. Obt\u00e9n respuestas claras y pr\u00e1cticas a tus preguntas de salud en lenguaje sencillo.',
    landing_feature_cost_title: 'Estimador de Costos',
    landing_feature_cost_desc:
      'Sabe cu\u00e1nto pagar\u00e1s antes de ir. Estima tus gastos de bolsillo usando datos verificados de Medicare de CMS.',
    landing_feature_facilities_title: 'Buscar Centros M\u00e9dicos',
    landing_feature_facilities_desc:
      'Encuentra la atenci\u00f3n adecuada, r\u00e1pido. Busca hospitales cercanos por especialidad, calidad y red de cobertura.',
    landing_feature_literacy_title: 'Educaci\u00f3n sobre Seguros',
    landing_feature_literacy_desc:
      'Entiende la letra peque\u00f1a. Aprende c\u00f3mo los copagos, deducibles y redes afectan tu bolsillo.',
  },
} as const

export type Translations = {
  [K in keyof (typeof translations)['en']]: (typeof translations)['en'][K] extends (
    ...args: infer A
  ) => string
    ? (...args: A) => string
    : string
}
