/**
 * Proyecto Software
 * 2025
 * @author Diego Vallespin & Hatim Bajji
 */
import z from 'zod'

const productoSchema = z.object({
  nombre: z.string({
    invalid_type_error: 'El nombre del producto debe ser un texto.',
    required_error: 'El nombre del producto es obligatorio.'
  }),
  descripcion: z.string({
    invalid_type_error: 'La descripción debe ser un texto.',
    required_error: 'La descripción del producto es obligatoria.'
  }).min(10, { message: 'La descripción debe tener al menos 10 caracteres.' 
  }).max(500, { message: 'La descripción no puede exceder los 500 caracteres.' }),
  precio: z.number().min(0, { message: 'El precio debe ser un número positivo.' }),
  stock: z.number().int().nonnegative({
    message: 'El stock debe ser un número entero igual o mayor a 0.'
  }),  
  url_imagen: z.string({
    invalid_type_error: 'La URL de la imagen debe ser un texto.',
    required_error: 'La URL de la imagen es obligatoria.'
  }).url({ message: 'Debe ser una URL válida.' }),
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