import { randomUUID } from 'node:crypto';
import { readJSON, writeJSON } from '../../utils.js';

const pedidos = await readJSON('../local-data/pedidos.json');

export class PedidoModel {
  static async getAll({ usuarioId }) {
    return pedidos.filter(pedido => pedido.usuario_id === usuarioId);
  }

  static async getById({ id }) {
    return pedidos.find(pedido => pedido.id === id) || null;
  }

  static async create({ input }) {
    const nuevoPedido = {
      id: randomUUID(),
      ...input,
      fecha: new Date().toISOString()
    };
    pedidos.push(nuevoPedido);
    await writeJSON('local-data/pedidos.json', pedidos);
    return nuevoPedido;
  }

  static async update({ id, input }) {
    const index = pedidos.findIndex(pedido => pedido.id === id);
    if (index === -1) return null;

    pedidos[index] = {
      ...pedidos[index],
      ...input,
    };
    await writeJSON('local-data/pedidos.json', pedidos);
    return pedidos[index];
  }

  static async delete({ id }) {
    const index = pedidos.findIndex(pedido => pedido.id === id);
    if (index === -1) return false;

    pedidos.splice(index, 1);
    await writeJSON('local-data/pedidos.json', pedidos);
    return true;
  }
}
