import z from 'zod'

const carritoSchema = z.object({
  productoId: z.string({
    required_error: 'El ID del producto es obligatorio.',
    invalid_type_error: 'El ID del producto debe ser un texto.'
  }),
  cantidad: z.number({
    required_error: 'La cantidad es obligatoria.',
    invalid_type_error: 'La cantidad debe ser un número.'
  }).int().min(1, { message: 'La cantidad debe ser al menos 1.' })
})

export function validateCarrito (input) {
  return carritoSchema.safeParse(input)
}

export function validatePartialCarrito (input) {
  return carritoSchema.partial().safeParse(input)
}