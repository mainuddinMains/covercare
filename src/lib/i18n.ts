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
    auth_logout: 'Log Out',

    // AppointmentGuide
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

    // AppointmentGuide
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
