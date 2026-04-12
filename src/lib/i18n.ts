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
    auth_or: 'or',
    auth_logout: 'Log Out',
    auth_back_to_home: 'Back to home',

    guest_profile_heading: 'You are browsing as a guest',
    guest_profile_body:
      'Create an account to save your insurance profile, reminders, and chat history.',
    guest_create_account: 'Create an Account',
    guest_exit: 'Exit Guest Mode',

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

    guide_title: 'Your First Doctor Visit',
    guide_description:
      'Not sure what to expect? Here is exactly what happens, step by step. Tap any step to see the details.',
    guide_step_counter: (step: number, total: number) =>
      `Step ${step} of ${total}`,
    guide_previous: 'Previous',
    guide_next: (title: string) => `Next: ${title}`,
    guide_complete: 'You are all set!',
    guide_cta_title: 'Ready to find a clinic?',
    guide_cta_body:
      'Find a free or low-cost clinic near you using CareCompass.',
    guide_cta_assistant: 'Ask the assistant',
    guide_cta_hospitals: 'Find nearby hospitals',

    guide_step1_title: 'Get Ready at Home',
    guide_step1_body:
      'Before your appointment, gather a few things so check-in goes smoothly.',
    guide_step1_tip:
      'No insurance? Tell them when you call. Many clinics offer a sliding-scale fee based on what you can afford.',
    guide_step1_items: [
      'Your insurance card (front and back)',
      'A photo ID -- driver\'s license or passport',
      'A list of any medicines you take, including vitamins',
      'Any past medical records if you have them',
      'A list of questions you want to ask',
    ],

    guide_step2_title: 'Arrive and Check In',
    guide_step2_body:
      'Get there 10 to 15 minutes early. The front desk will ask for your name, ID, and insurance card.',
    guide_step2_tip:
      'You can ask the front desk what your visit will cost before you see the doctor.',
    guide_step2_items: [
      'You may fill out a short health history form -- it is okay to leave things blank if you do not know',
      'You might wait 10 to 30 minutes -- this is normal',
      'Bring something to read or listen to',
    ],

    guide_step3_title: 'Meet the Nurse',
    guide_step3_body:
      'A nurse or medical assistant will bring you to a room first. They will check a few basic things.',
    guide_step3_tip:
      'Write down your main concern before the visit so you do not forget to mention it.',
    guide_step3_items: [
      'Your weight and height',
      'Your blood pressure and temperature',
      'They will ask why you came in today -- be honest, even if it feels embarrassing',
      'They will check your medicines list',
    ],

    guide_step4_title: 'See Your Doctor',
    guide_step4_body:
      'The doctor will listen to you, ask questions, and examine you. This is YOUR time -- speak up.',
    guide_step4_tip:
      'You can bring a friend or family member to listen and help you remember what the doctor says.',
    guide_step4_items: [
      'Describe your symptoms in plain language -- no need for medical words',
      'Ask them to explain anything you do not understand',
      '"What is this medication for?" or "When should I come back?"',
      'It is okay to say "Can you write that down for me?"',
    ],

    guide_step5_title: 'Before You Leave',
    guide_step5_body:
      'After seeing the doctor, a few things might happen. Make sure you understand the next steps.',
    guide_step5_tip:
      'If you get a bill later in the mail, it is okay to call the billing office and ask for a lower price or payment plan.',
    guide_step5_items: [
      'You might get a prescription -- ask the pharmacy about generic options (they cost less)',
      'You might get a referral to see a specialist',
      'Ask when your test results will be ready and how you will hear about them',
      'Pay any bills at the front desk, or ask about a payment plan',
    ],

    // ToolResult
    tool_wider_area_hospitals: 'Showing hospitals in the wider area',
    tool_wider_area_providers: 'Showing providers in the wider area',
    tool_show_less: 'Show less',
    tool_show_more: (count: number) => `Show ${count} more`,
    tool_er: 'ER',
    tool_telehealth: 'Telehealth',
    tool_estimated_cost: 'Your estimated cost',
    tool_total_billed: 'Total billed',
    tool_cost_unavailable: 'Cost data not available for this procedure',
    tool_avg_total: 'Avg total:',
    tool_medicare_pays: 'Medicare pays:',
    tool_cases: (count: string) => `${count} cases`,
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
    auth_or: 'o',
    auth_logout: 'Cerrar Sesi\u00f3n',
    auth_back_to_home: 'Volver al inicio',

    guest_profile_heading: 'Estas navegando como invitado',
    guest_profile_body:
      'Crea una cuenta para guardar tu perfil de seguro, recordatorios e historial de chat.',
    guest_create_account: 'Crear una Cuenta',
    guest_exit: 'Salir del Modo Invitado',

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

    guide_title: 'Tu Primera Visita al Doctor',
    guide_description:
      '\u00bfNo sabes qu\u00e9 esperar? Aqu\u00ed te explicamos exactamente lo que pasa, paso a paso. Toca cualquier paso para ver los detalles.',
    guide_step_counter: (step: number, total: number) =>
      `Paso ${step} de ${total}`,
    guide_previous: 'Anterior',
    guide_next: (title: string) => `Siguiente: ${title}`,
    guide_complete: '\u00a1Listo, eso es todo!',
    guide_cta_title: '\u00bfListo para encontrar una cl\u00ednica?',
    guide_cta_body:
      'Encuentra una cl\u00ednica gratuita o de bajo costo cerca de ti con CareCompass.',
    guide_cta_assistant: 'Pregunta al asistente',
    guide_cta_hospitals: 'Buscar hospitales cercanos',

    guide_step1_title: 'Prep\u00e1rate en Casa',
    guide_step1_body:
      'Antes de tu cita, re\u00fane algunas cosas para que el registro sea m\u00e1s f\u00e1cil.',
    guide_step1_tip:
      '\u00bfNo tienes seguro? D\u00edselo cuando llames. Muchas cl\u00ednicas ofrecen tarifas de escala m\u00f3vil seg\u00fan lo que puedas pagar.',
    guide_step1_items: [
      'Tu tarjeta de seguro (frente y reverso)',
      'Una identificaci\u00f3n con foto -- licencia de conducir o pasaporte',
      'Una lista de todos los medicamentos que tomas, incluyendo vitaminas',
      'Cualquier historial m\u00e9dico que tengas',
      'Una lista de preguntas que quieras hacer',
    ],

    guide_step2_title: 'Llega y Reg\u00edstrate',
    guide_step2_body:
      'Llega de 10 a 15 minutos antes. En la recepci\u00f3n te pedir\u00e1n tu nombre, identificaci\u00f3n y tarjeta de seguro.',
    guide_step2_tip:
      'Puedes preguntar en la recepci\u00f3n cu\u00e1nto costar\u00e1 tu visita antes de ver al doctor.',
    guide_step2_items: [
      'Puede que llenes un formulario corto de historial de salud -- est\u00e1 bien dejar espacios en blanco si no sabes',
      'Podr\u00edas esperar de 10 a 30 minutos -- esto es normal',
      'Trae algo para leer o escuchar',
    ],

    guide_step3_title: 'Conoce a la Enfermera',
    guide_step3_body:
      'Una enfermera o asistente m\u00e9dico te llevar\u00e1 a una sala primero. Revisar\u00e1n algunas cosas b\u00e1sicas.',
    guide_step3_tip:
      'Escribe tu preocupaci\u00f3n principal antes de la visita para que no se te olvide mencionarla.',
    guide_step3_items: [
      'Tu peso y estatura',
      'Tu presi\u00f3n arterial y temperatura',
      'Te preguntar\u00e1n por qu\u00e9 viniste hoy -- s\u00e9 honesto, aunque te d\u00e9 pena',
      'Revisar\u00e1n tu lista de medicamentos',
    ],

    guide_step4_title: 'Ve a Tu Doctor',
    guide_step4_body:
      'El doctor te escuchar\u00e1, te har\u00e1 preguntas y te examinar\u00e1. Este es TU tiempo -- no dudes en hablar.',
    guide_step4_tip:
      'Puedes traer a un amigo o familiar para que escuche y te ayude a recordar lo que dice el doctor.',
    guide_step4_items: [
      'Describe tus s\u00edntomas en palabras sencillas -- no necesitas usar t\u00e9rminos m\u00e9dicos',
      'P\u00eddeles que te expliquen cualquier cosa que no entiendas',
      '"\u00bfPara qu\u00e9 es este medicamento?" o "\u00bfCu\u00e1ndo debo regresar?"',
      'Est\u00e1 bien decir "\u00bfPuede escribirme eso?"',
    ],

    guide_step5_title: 'Antes de Irte',
    guide_step5_body:
      'Despu\u00e9s de ver al doctor, pueden pasar varias cosas. Aseg\u00farate de entender los siguientes pasos.',
    guide_step5_tip:
      'Si recibes una factura por correo despu\u00e9s, est\u00e1 bien llamar a la oficina de facturaci\u00f3n y pedir un precio m\u00e1s bajo o un plan de pagos.',
    guide_step5_items: [
      'Podr\u00edas recibir una receta -- pregunta en la farmacia sobre opciones gen\u00e9ricas (cuestan menos)',
      'Podr\u00edas recibir una referencia para ver a un especialista',
      'Pregunta cu\u00e1ndo estar\u00e1n listos tus resultados y c\u00f3mo te los har\u00e1n saber',
      'Paga cualquier cuenta en la recepci\u00f3n, o pregunta sobre un plan de pagos',
    ],

    // ToolResult
    tool_wider_area_hospitals: 'Mostrando hospitales en el \u00e1rea m\u00e1s amplia',
    tool_wider_area_providers: 'Mostrando proveedores en el \u00e1rea m\u00e1s amplia',
    tool_show_less: 'Mostrar menos',
    tool_show_more: (count: number) => `Mostrar ${count} m\u00e1s`,
    tool_er: 'Urgencias',
    tool_telehealth: 'Telesalud',
    tool_estimated_cost: 'Tu costo estimado',
    tool_total_billed: 'Total facturado',
    tool_cost_unavailable: 'Datos de costo no disponibles para este procedimiento',
    tool_avg_total: 'Promedio total:',
    tool_medicare_pays: 'Medicare paga:',
    tool_cases: (count: string) => `${count} casos`,
  },
} as const

export type Translations = {
  [K in keyof (typeof translations)['en']]: (typeof translations)['en'][K] extends (
    ...args: infer A
  ) => string
    ? (...args: A) => string
    : (typeof translations)['en'][K] extends readonly string[]
      ? readonly string[]
      : string
}
