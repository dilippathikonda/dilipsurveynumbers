import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { landRecords } from '../../db/schema.js'

const CreateLandRecordSchema = z.object({
  surveyNumber: z.string().min(1),
  village: z.string().optional(),
  landExtent: z.coerce.number().positive(),
  extentUnit: z.string().min(1),
  ownerName: z.string().min(1),
  cultivatorName: z.string().min(1),
  cropGrown: z.string().optional(),
  notes: z.string().optional(),
})

export const getLandRecords = createServerFn({ method: 'GET' }).handler(async () => {
  return db.select().from(landRecords).orderBy(desc(landRecords.createdAt))
})

export const createLandRecord = createServerFn({ method: 'POST' })
  .inputValidator(CreateLandRecordSchema)
  .handler(async ({ data }) => {
    const [record] = await db
      .insert(landRecords)
      .values({
        surveyNumber: data.surveyNumber,
        village: data.village,
        landExtent: data.landExtent.toString(),
        extentUnit: data.extentUnit,
        ownerName: data.ownerName,
        cultivatorName: data.cultivatorName,
        cropGrown: data.cropGrown,
        notes: data.notes,
      })
      .returning()
    return record
  })
