import z from 'zod'

const registroSchema = z.object({
  nombre: z.string({
    invalid_type_error: 'El nombre debe ser un texto.',
    required_error: 'El nombre del usuario es obligatorio.'
  }).min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string({
    invalid_type_error: 'El email debe ser un texto.',
    required_error: 'El email del usuario es obligatorio.'
  }).email({ message: 'Debe ser un email válido.' }),
  password: z.string({
    invalid_type_error: 'La contraseña debe ser un texto.',
    required_error: 'La contraseña es obligatoria.'
  }).min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  direccion: z.string({
    invalid_type_error: 'La dirección debe ser un texto.'
  }).min(5, { message: 'La dirección debe tener al menos 5 caracteres.' }).optional(),
  telefono: z.string({
    invalid_type_error: 'El teléfono debe ser un texto.'
  }).regex(/^\+?\d{7,15}$/, {
    message: 'Debe ser un número de teléfono válido.'
  }).optional()
})

const loginSchema = z.object({
  email: z.string({
    invalid_type_error: 'El email debe ser un texto.',
    required_error: 'El email es obligatorio.'
  }).email({ message: 'Debe ser un email válido.' }),
  password: z.string({
    invalid_type_error: 'La contraseña debe ser un texto.',
    required_error: 'La contraseña es obligatoria.'
  }).min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
})

export function validateRegistro(input) {
  return registroSchema.safeParse(input)
}

export function validatePartialUsuario(input) {
  return registroSchema.partial().safeParse(input)
}

export function validateLogin(input) {
  return loginSchema.safeParse(input)
}
