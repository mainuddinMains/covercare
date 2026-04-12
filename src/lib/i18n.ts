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
    profile_subtitle:
      'Save your info to get personalized cost estimates and provider matches.',
    profile_scan_heading: 'Scan Your Card',
    profile_insurance_type_label: 'Insurance Type',
    profile_insurance_type_placeholder: 'Select insurance type...',
    profile_plan_name_label: 'Plan Name',
    profile_plan_name_placeholder: 'e.g. Blue Cross PPO',
    profile_member_id_label: 'Member ID',
    profile_member_id_placeholder: 'From your insurance card',
    profile_group_number_label: 'Group Number',
    profile_group_number_placeholder: 'From your insurance card',
    profile_insurer_phone_label: 'Insurer Phone',
    profile_insurer_phone_placeholder: 'Customer service number',
    profile_effective_date_label: 'Effective Date',
    profile_effective_date_placeholder: 'MM/DD/YYYY',
    profile_location_heading: 'Your Location',
    profile_clear: 'Clear Profile',

    scanner_take_photo: 'Take Photo',
    scanner_scanning: 'Scanning...',
    scanner_upload: 'Upload',
    scanner_card_alt: 'Card preview',
    scanner_error: 'Could not read your card. Try a clearer photo.',

    a11y_heading: 'Accessibility and Language',
    a11y_high_contrast: 'High Contrast',
    a11y_on: 'On',
    a11y_off: 'Off',
    a11y_font_size: 'Font Size',
    a11y_font_small: 'Small',
    a11y_font_medium: 'Medium',
    a11y_font_large: 'Large',
    a11y_language: 'Language',
    a11y_simple_language: 'Simple Language',
    a11y_simple_on: 'On -- Using simpler words',
    a11y_simple_help:
      'When on, the AI assistant uses shorter sentences and avoids jargon.',

    reminder_title: 'Reminders',
    reminder_subtitle: 'Keep track of upcoming appointments.',
    reminder_add: 'Add',
    reminder_empty_title: 'No reminders yet.',
    reminder_empty_subtitle:
      'Add one to get notified before your appointment.',
    reminder_upcoming: 'Upcoming',
    reminder_past: 'Past',
    reminder_delete_label: 'Delete reminder',
    reminder_notification_title: 'CareCompass - Appointment Reminder',
    reminder_modal_title: 'Add Appointment Reminder',
    reminder_provider_label: 'Provider Name *',
    reminder_provider_placeholder: 'e.g. Dr. Smith',
    reminder_address_label: 'Address',
    reminder_phone_label: 'Phone',
    reminder_optional_placeholder: 'Optional',
    reminder_date_label: 'Date *',
    reminder_time_label: 'Time *',
    reminder_remind_label: 'Remind me (minutes before)',
    reminder_15_min: '15 minutes',
    reminder_30_min: '30 minutes',
    reminder_1_hour: '1 hour',
    reminder_2_hours: '2 hours',
    reminder_1_day: '1 day',
    reminder_notes_label: 'Notes',
    reminder_notes_placeholder: 'Bring insurance card, list of medications...',
    reminder_submit: 'Add Reminder',

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
    profile_subtitle:
      'Guarda tu informaci\u00f3n para obtener estimaciones de costos personalizadas y proveedores compatibles.',
    profile_scan_heading: 'Escanea Tu Tarjeta',
    profile_insurance_type_label: 'Tipo de Seguro',
    profile_insurance_type_placeholder: 'Selecciona tipo de seguro...',
    profile_plan_name_label: 'Nombre del Plan',
    profile_plan_name_placeholder: 'ej. Blue Cross PPO',
    profile_member_id_label: 'N\u00famero de Miembro',
    profile_member_id_placeholder: 'De tu tarjeta de seguro',
    profile_group_number_label: 'N\u00famero de Grupo',
    profile_group_number_placeholder: 'De tu tarjeta de seguro',
    profile_insurer_phone_label: 'Tel\u00e9fono del Asegurador',
    profile_insurer_phone_placeholder: 'N\u00famero de servicio al cliente',
    profile_effective_date_label: 'Fecha de Vigencia',
    profile_effective_date_placeholder: 'MM/DD/AAAA',
    profile_location_heading: 'Tu Ubicaci\u00f3n',
    profile_clear: 'Borrar Perfil',

    scanner_take_photo: 'Tomar Foto',
    scanner_scanning: 'Escaneando...',
    scanner_upload: 'Subir',
    scanner_card_alt: 'Vista previa de la tarjeta',
    scanner_error: 'No se pudo leer tu tarjeta. Intenta con una foto m\u00e1s clara.',

    a11y_heading: 'Accesibilidad e Idioma',
    a11y_high_contrast: 'Alto Contraste',
    a11y_on: 'Activado',
    a11y_off: 'Desactivado',
    a11y_font_size: 'Tama\u00f1o de Fuente',
    a11y_font_small: 'Peque\u00f1o',
    a11y_font_medium: 'Mediano',
    a11y_font_large: 'Grande',
    a11y_language: 'Idioma',
    a11y_simple_language: 'Lenguaje Simple',
    a11y_simple_on: 'Activado -- Usando palabras m\u00e1s simples',
    a11y_simple_help:
      'Cuando est\u00e1 activado, el asistente usa oraciones m\u00e1s cortas y evita terminolog\u00eda t\u00e9cnica.',

    reminder_title: 'Recordatorios',
    reminder_subtitle: 'Lleva un registro de tus pr\u00f3ximas citas.',
    reminder_add: 'Agregar',
    reminder_empty_title: 'No hay recordatorios a\u00fan.',
    reminder_empty_subtitle:
      'Agrega uno para recibir una notificaci\u00f3n antes de tu cita.',
    reminder_upcoming: 'Pr\u00f3ximas',
    reminder_past: 'Pasadas',
    reminder_delete_label: 'Eliminar recordatorio',
    reminder_notification_title: 'CareCompass - Recordatorio de Cita',
    reminder_modal_title: 'Agregar Recordatorio de Cita',
    reminder_provider_label: 'Nombre del Proveedor *',
    reminder_provider_placeholder: 'ej. Dr. Smith',
    reminder_address_label: 'Direcci\u00f3n',
    reminder_phone_label: 'Tel\u00e9fono',
    reminder_optional_placeholder: 'Opcional',
    reminder_date_label: 'Fecha *',
    reminder_time_label: 'Hora *',
    reminder_remind_label: 'Recordarme (minutos antes)',
    reminder_15_min: '15 minutos',
    reminder_30_min: '30 minutos',
    reminder_1_hour: '1 hora',
    reminder_2_hours: '2 horas',
    reminder_1_day: '1 d\u00eda',
    reminder_notes_label: 'Notas',
    reminder_notes_placeholder: 'Traer tarjeta de seguro, lista de medicamentos...',
    reminder_submit: 'Agregar Recordatorio',

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
