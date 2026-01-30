// src/zod/collaborator-schema.ts
import { z } from 'zod'

const hexColorRegex = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/

export const CollaboratorSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  isEnabled: z.boolean().optional(),
  schedulerColor: z
    .string()
    .min(1, 'Cor do calendário é obrigatória')
    .regex(hexColorRegex, 'Use um HEX válido. Ex: #3B82F6')
})

export type CollaboratorFormData = z.infer<typeof CollaboratorSchema>
