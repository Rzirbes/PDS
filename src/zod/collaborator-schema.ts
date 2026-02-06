// src/zod/collaborator-schema.ts
import { z } from 'zod'

const hexColorRegex = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/

export const CollaboratorSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  cpf: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  isEnabled: z.boolean().optional(),
  schedulerColor: z.string().min(1),

  // localização (ids)
  country: z.string().uuid().optional().nullable(),
  state: z.string().uuid().optional().nullable(),
  city: z.string().uuid().optional().nullable(),

  // campos do endereço
  zipCode: z.string().max(10).optional().nullable(),
  street: z.string().max(255).optional().nullable(),
  buildingNumber: z.string().max(10).optional().nullable(),
  neighborhood: z.string().max(255).optional().nullable(),
  complement: z.string().max(255).optional().nullable(),
})


export type CollaboratorFormData = z.infer<typeof CollaboratorSchema>
