import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, and, desc } from 'drizzle-orm'
import { requireUser } from './auth'
import * as schema from '@/lib/db/schema'

// ── Insurance Profile ──

export const getInsuranceProfile = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { userId, db } = await requireUser()
    const row = await db
      .select()
      .from(schema.insuranceProfile)
      .where(eq(schema.insuranceProfile.userId, userId))
      .get()
    return row ?? null
  },
)

const insuranceProfileInput = z.object({
  insuranceType: z.string(),
  issuerName: z.string(),
  planName: z.string(),
  planType: z.string(),
  memberId: z.string(),
  groupNumber: z.string(),
  insurerPhone: z.string(),
  effectiveDate: z.string(),
  coverageEndDate: z.string(),
  annualDeductible: z.string(),
  copayPerVisit: z.string(),
  outOfPocketMax: z.string(),
  monthlyPremium: z.string(),
  pcpName: z.string(),
  city: z.string(),
  state: z.string(),
  stateCode: z.string(),
  zip: z.string(),
})

export const saveInsuranceProfile = createServerFn({ method: 'POST' })
  .inputValidator(insuranceProfileInput)
  .handler(async ({ data }) => {
    const { userId, db } = await requireUser()
    await db
      .insert(schema.insuranceProfile)
      .values({ userId, ...data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: schema.insuranceProfile.userId,
        set: { ...data, updatedAt: new Date() },
      })
  })

// ── Reminders ──

export const getReminders = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { userId, db } = await requireUser()
    return db
      .select()
      .from(schema.reminder)
      .where(eq(schema.reminder.userId, userId))
      .all()
  },
)

const reminderInput = z.object({
  id: z.string(),
  providerName: z.string(),
  providerAddress: z.string().optional(),
  providerPhone: z.string().optional(),
  appointmentDate: z.string(),
  appointmentTime: z.string(),
  reminderMinutesBefore: z.number(),
  notes: z.string(),
  notified: z.boolean(),
  createdAt: z.string(),
})

export const saveReminder = createServerFn({ method: 'POST' })
  .inputValidator(reminderInput)
  .handler(async ({ data }) => {
    const { userId, db } = await requireUser()
    await db
      .insert(schema.reminder)
      .values({ userId, ...data })
      .onConflictDoUpdate({
        target: schema.reminder.id,
        set: {
          providerName: data.providerName,
          providerAddress: data.providerAddress,
          providerPhone: data.providerPhone,
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          reminderMinutesBefore: data.reminderMinutesBefore,
          notes: data.notes,
          notified: data.notified,
        },
      })
  })

export const deleteReminder = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { userId, db } = await requireUser()
    await db
      .delete(schema.reminder)
      .where(
        and(
          eq(schema.reminder.id, data.id),
          eq(schema.reminder.userId, userId),
        ),
      )
  })

// ── Conversations ──

export const getConversations = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { userId, db } = await requireUser()
    return db
      .select({
        id: schema.conversation.id,
        title: schema.conversation.title,
        updatedAt: schema.conversation.updatedAt,
      })
      .from(schema.conversation)
      .where(eq(schema.conversation.userId, userId))
      .orderBy(desc(schema.conversation.updatedAt))
      .all()
  },
)

const messageInput = z.object({
  id: z.string(),
  role: z.string(),
  parts: z.string(),
  createdAt: z.string(),
})

export const getConversationMessages = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ conversationId: z.string() }))
  .handler(async ({ data }) => {
    const { userId, db } = await requireUser()
    // Verify ownership
    const convo = await db
      .select({ id: schema.conversation.id })
      .from(schema.conversation)
      .where(
        and(
          eq(schema.conversation.id, data.conversationId),
          eq(schema.conversation.userId, userId),
        ),
      )
      .get()
    if (!convo) throw new Error('Conversation not found')

    return db
      .select()
      .from(schema.message)
      .where(eq(schema.message.conversationId, data.conversationId))
      .all()
  })

export const saveConversation = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string(),
      title: z.string(),
      messages: z.array(messageInput),
    }),
  )
  .handler(async ({ data }) => {
    const { userId, db } = await requireUser()
    const now = new Date()

    const upsertConvo = db
      .insert(schema.conversation)
      .values({
        id: data.id,
        userId,
        title: data.title,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: schema.conversation.id,
        set: { title: data.title, updatedAt: now },
      })

    const deleteOldMessages = db
      .delete(schema.message)
      .where(eq(schema.message.conversationId, data.id))

    if (data.messages.length === 0) {
      await db.batch([upsertConvo, deleteOldMessages])
      return
    }

    const insertMessages = db.insert(schema.message).values(
      data.messages.map((m) => ({
        id: m.id,
        conversationId: data.id,
        role: m.role,
        parts: m.parts,
        createdAt: new Date(m.createdAt),
      })),
    )

    await db.batch([upsertConvo, deleteOldMessages, insertMessages])
  })

export const deleteConversation = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { userId, db } = await requireUser()
    // Cascade delete will remove messages
    await db
      .delete(schema.conversation)
      .where(
        and(
          eq(schema.conversation.id, data.id),
          eq(schema.conversation.userId, userId),
        ),
      )
  })
