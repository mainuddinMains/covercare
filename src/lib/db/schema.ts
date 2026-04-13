import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

// ── better-auth required tables ──

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  isAnonymous: integer('is_anonymous', { mode: 'boolean' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', {
    mode: 'timestamp',
  }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
})

// ── app tables ──

export const insuranceProfile = sqliteTable('insurance_profile', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  insuranceType: text('insurance_type').notNull().default(''),
  issuerName: text('issuer_name').notNull().default(''),
  planName: text('plan_name').notNull().default(''),
  planType: text('plan_type').notNull().default(''),
  memberId: text('member_id').notNull().default(''),
  groupNumber: text('group_number').notNull().default(''),
  insurerPhone: text('insurer_phone').notNull().default(''),
  effectiveDate: text('effective_date').notNull().default(''),
  coverageEndDate: text('coverage_end_date').notNull().default(''),
  annualDeductible: text('annual_deductible').notNull().default(''),
  copayPerVisit: text('copay_per_visit').notNull().default(''),
  outOfPocketMax: text('out_of_pocket_max').notNull().default(''),
  monthlyPremium: text('monthly_premium').notNull().default(''),
  pcpName: text('pcp_name').notNull().default(''),
  city: text('city').notNull().default(''),
  state: text('state').notNull().default(''),
  stateCode: text('state_code').notNull().default(''),
  zip: text('zip').notNull().default(''),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const reminder = sqliteTable('reminder', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  providerName: text('provider_name').notNull(),
  providerAddress: text('provider_address'),
  providerPhone: text('provider_phone'),
  appointmentDate: text('appointment_date').notNull(),
  appointmentTime: text('appointment_time').notNull(),
  reminderMinutesBefore: integer('reminder_minutes_before').notNull(),
  notes: text('notes').notNull().default(''),
  notified: integer('notified', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
})

export const conversation = sqliteTable('conversation', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull().default('New conversation'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const message = sqliteTable('message', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id')
    .notNull()
    .references(() => conversation.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  parts: text('parts').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// Cache for MRF negotiated rate lookups. Key is SHA-256 of fileUrl + billingCode.
// Populated by the /api/mrf/rates endpoint after stream-scanning insurer files.
export const mrfRateCache = sqliteTable('mrf_rate_cache', {
  id: text('id').primaryKey(),
  insurer: text('insurer').notNull(),
  billingCode: text('billing_code').notNull(),
  fileUrl: text('file_url').notNull(),
  description: text('description').notNull().default(''),
  rateMin: real('rate_min'),
  rateMax: real('rate_max'),
  rateMedian: real('rate_median'),
  rateAvg: real('rate_avg'),
  sampleSize: integer('sample_size'),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})
