import { z } from 'zod'

export const applicationSchema = z.object({
  steamLink: z
    .string()
    .url('Debe ser un enlace válido')
    .refine((v) => v.includes('steamcommunity.com'), 'Debe ser un perfil de Steam'),
  faceitLink: z
    .string()
    .url('Debe ser un enlace válido')
    .refine(
      (v) => v.includes('faceit.com') || v.includes('faceitstats.com'),
      'Debe ser un perfil de Faceit'
    ),
  gamersclubLink: z
    .string()
    .url('Debe ser un enlace válido')
    .refine(
      (v) => v.includes('gamersclub.com.br') || v.includes('gamersclub.com'),
      'Debe ser un perfil de GamersClub'
    ),
  discordLink: z
    .string()
    .min(2, 'Deebe ser un usuario o enlace válido'),
  hoursPlayed: z
    .number({ invalid_type_error: 'Debe ser un número' })
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo')
    .max(20000, '¿Estás seguro? Parece demasiado'),
  startDate: z.string().min(4, 'Ingresa una fecha o año'),
  age: z
    .number({ invalid_type_error: 'Debe ser un número' })
    .int('Debe ser un número entero')
    .min(13, 'Debes tener al menos 13 años')
    .max(60, 'Ingresa una edad válida'),
  server: z.enum(['NA', 'SA'], { required_error: 'Selecciona un servidor' }),
  regionCountry: z.string().min(2, 'Selecciona un país'),
  roles: z
    .array(z.enum(['IGL', 'Entry', 'AWPer', 'Support', 'Lurker', 'Coach']))
    .min(1, 'Selecciona al menos un rol')
    .max(3, 'Máximo 3 roles'),
  maps: z
    .array(
      z.enum(['Ancient', 'Train', 'Anubis', 'Dust2', 'Inferno', 'Mirage', 'Nuke', 'Overpass', 'Vertigo', 'Otro'])
    )
    .min(1, 'Selecciona al menos un mapa'),
  fps: z
    .number({ invalid_type_error: 'Debe ser un número' })
    .int()
    .min(30)
    .max(1000),
  ping: z
    .number({ invalid_type_error: 'Debe ser un número' })
    .int()
    .min(5)
    .max(300),
  microphone: z.boolean(),
  experience: z
    .string()
    .min(2, 'Describe tu experiencia')
    .max(1000, 'Demasiado largo'),
  schedule: z
    .string()
    .min(2, 'Describe tu horario')
    .max(200, 'Demasiado largo'),
  commitment: z.enum(['si', 'no']),
  commitmentReason: z.string().min(2, 'Fundamenta tu respuesta').max(1000),
  // Honeypot for bots
  company: z.string().optional(),
})

// Cross-field refinement: ensure regionCountry matches the server region
export const applicationSchemaWithRegion = applicationSchema.refine(
  (data) => {
    const NA = ['US', 'CA', 'MX']
    const SA = ['AR', 'BR', 'CL', 'CO', 'PE', 'UY', 'PY', 'EC', 'BO', 'VE']
    if (data.server === 'NA') return NA.includes(data.regionCountry)
    if (data.server === 'SA') return SA.includes(data.regionCountry)
    return false
  },
  {
    message: 'El país seleccionado no corresponde con la región',
    path: ['regionCountry'],
  }
)

export type ApplicationInput = z.infer<typeof applicationSchemaWithRegion>
