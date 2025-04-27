import z from 'zod'

const productoSchema = z.object({
  nombre: z.string({
    invalid_type_error: 'El nombre del producto debe ser un texto.',
    required_error: 'El nombre del producto es obligatorio.'
  }),
  precio: z.number().min(0, { message: 'El precio debe ser un número positivo.' }),
  stock: z.number().int().nonnegative({
    message: 'El stock debe ser un número entero igual o mayor a 0.'
  }),
  categoria: z.enum(['Frutas','Verduras','Lácteos','Panadería','Bebidas','Carne','Pescado'], {
    required_error: 'La categoría es obligatoria.',
    invalid_type_error: 'La categoría debe ser una de las opciones válidas.'
  })
});

export function validateProducto (input) {
  return productoSchema.safeParse(input)
}

export function validatePartialProducto (input) {
  return productoSchema.partial().safeParse(input)
}