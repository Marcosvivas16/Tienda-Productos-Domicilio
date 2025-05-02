import z from 'zod'

const pedidoSchema = z.object({
  usuario_id: z.string({
    required_error: 'El ID del usuario es obligatorio.',
    invalid_type_error: 'El ID del usuario debe ser un string UUID.'
  }),
  productos: z.array(
    z.object({
      id: z.string({
        required_error: 'Cada producto debe tener un ID.',
        invalid_type_error: 'El ID del producto debe ser un string UUID.'
      }),
      cantidad: z.number({
        required_error: 'La cantidad es obligatoria.'
      }).int().min(1, { message: 'La cantidad debe ser al menos 1.' })
    })
  ).min(1, { message: 'Debe haber al menos un producto en el pedido.' })
})

export function validatePedido (input) {
  return pedidoSchema.safeParse(input)
}