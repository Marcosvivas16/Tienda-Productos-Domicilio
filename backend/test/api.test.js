/**
 * Proyecto Software
 * 2025
 * @author Diego Vallespin & Hatim Bajji
 */
import request from 'supertest';
import { expect } from 'chai';
import { createApp } from '../src/app.js';
import { UsuarioModel } from '../src/models/local-file-system/usuario.js';
import { ProductoModel } from '../src/models/local-file-system/producto.js';
import { CarritoModel } from '../src/models/local-file-system/carrito.js';
import { PedidoModel } from '../src/models/local-file-system/pedido.js';

const app = createApp({
  usuarioModel: UsuarioModel,
  productoModel: ProductoModel,
  carritoModel: CarritoModel,
  pedidoModel: PedidoModel
});

describe('Casos de Prueba de la API', () => {
  let token;
  let userId;
  let productoId;
  let pedidoId;

  const email = `test-${Date.now()}@example.com`;
  const password = 'password123';

  // 1. Registro de Usuario
  it('debería registrar un usuario correctamente', async () => {
    const res = await request(app)
      .post('/usuarios/register')
      .send({
        nombre: 'Usuario de Prueba',
        email,
        password
      });

    expect(res.status).to.equal(200);
    userId = res.body.user?.id;
  });

  // 2. Inicio de Sesión
  it('debería iniciar sesión correctamente', async () => {
    const res = await request(app)
      .post('/usuarios/login')
      .send({ email, password });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    token = res.body.token;
  });

  // 3. Obtener Productos
  it('debería obtener todos los productos disponibles', async () => {
    const res = await request(app)
      .get('/productos');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    if (res.body.length > 0) {
      productoId = res.body[0].id;
    }
  });

  // 4. Añadir Producto al Carrito
  it('debería añadir un producto al carrito del usuario', async () => {
    if (!productoId) this.skip(); // si no hay productos, se omite esta prueba

    const res = await request(app)
      .post(`/carritos/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        productoId,
        cantidad: 2
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('quantity', 2);
  });

  // 5. Actualizar Producto en el Carrito
  it('debería actualizar la cantidad del producto en el carrito', async () => {
    if (!productoId) this.skip();

    const res = await request(app)
      .patch(`/carritos/${userId}/${productoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ cantidad : 5 });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property("quantity", 5);
  });

  // 6. Eliminar Producto del Carrito
  it('debería eliminar el producto del carrito del usuario', async () => {
    if (!productoId) this.skip();

    const res = await request(app)
      .delete(`/carritos/${userId}/${productoId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Producto eliminado del carrito');
  });

  // 7. Crear un Pedido
  it('debería crear un pedido correctamente', async () => {
    const res = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        usuario_id: userId,
        productos: [
          { id: productoId, cantidad: 2 }
        ]
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    pedidoId = res.body.id;
  });

  // 8. Ver un pedido de un usuario
  it('debería ver un pedido de un usuario correctamente', async () => {
    const res = await request(app)
      .get(`/pedidos/usuario/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body[0]).to.have.property('usuario_id', userId);
  });
});
