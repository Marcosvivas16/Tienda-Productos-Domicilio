import z from 'zod'

const usuarioSchema = z.object({
  email: z.string({
    invalid_type_error: 'El email debe ser un texto.',
    required_error: 'El email del usuario es obligatorio.'
  }).email({ message: 'Debe ser un email válido.' }),
  password: z.string({
    invalid_type_error: 'La contraseña debe ser un texto.',
    required_error: 'La contraseña es obligatoria.'
  }).min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
})

export function validateUsuario (input) {
  return usuarioSchema.safeParse(input)
} 