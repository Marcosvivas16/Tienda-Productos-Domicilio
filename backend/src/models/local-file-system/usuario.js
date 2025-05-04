/**
 * Proyecto Software
 * 2025
 * @author Diego Vallespin & Hatim Bajji
 */
import { randomUUID } from 'node:crypto';
import { readJSON, writeJSON, resolvePath } from '../../utils.js';
import bcrypt from 'bcryptjs';

const FILE_PATH = resolvePath('local-data/usuarios.json');

export class UsuarioModel {
  static async getAll() {
    const usuarios = await readJSON(FILE_PATH);
    return Array.isArray(usuarios) ? usuarios.map(({ password, ...u }) => u) : [];
  }

  static async getById({ id }) {
    const usuarios = await readJSON(FILE_PATH);
    const user = usuarios.find(u => u.id === id);
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }

  static async register({ input }) {
    const usuarios = await readJSON(FILE_PATH);
    const { email, password, nombre, telefono, direccion } = input;

    if (usuarios.find(u => u.email === email)) {
      throw new Error('El usuario ya existe.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = {
      id: randomUUID(),
      email,
      password: hashedPassword,
      nombre: nombre || '',
      telefono: telefono || '',
      direccion: direccion || ''
    };

    usuarios.push(nuevoUsuario);
    await writeJSON(FILE_PATH, usuarios);
    const { password: _, ...userWithoutPassword } = nuevoUsuario;
    return userWithoutPassword;
  }

  static async login({ input }) {
    const usuarios = await readJSON(FILE_PATH);
    const user = usuarios.find(u => u.email === input.email);
    if (!user) throw new Error('Usuario no encontrado.');

    const match = await bcrypt.compare(input.password, user.password);
    if (!match) throw new Error('Contraseña incorrecta.');

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async update({ id, input }) {
    const usuarios = await readJSON(FILE_PATH);
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Usuario no encontrado');

    for (const key in input) {
      if (key === 'password') {
        usuarios[index].password = await bcrypt.hash(input[key], 10);
      } else {
        usuarios[index][key] = input[key];
      }
    }

    await writeJSON(FILE_PATH, usuarios);
    const { password, ...updatedUser } = usuarios[index];
    return updatedUser;
  }

  static async protected({ id }) {
    const usuarios = await readJSON(FILE_PATH);
    const user = usuarios.find(u => u.id === id);
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }

  static async logout() {
    return true;
  }
}