import { randomUUID } from 'node:crypto';
import { readJSON, writeJSON } from '../../utils.js';
import bcrypt from 'bcryptjs';

let usuarios = await readJSON('../local-data/usuarios.json');

export class UsuarioModel {
  static async getAll() {
    return usuarios.map(({ password, ...user }) => user);
  }

  static async getById({ id }) {
    const user = usuarios.find(user => user.id === id);
    if (!user) return null;

    const { password, ...rest } = user;
    return rest;
  }

  static async register({ input }) {
    const { email, password, nombre, telefono, direccion } = input;

    const existingUser = usuarios.find(user => user.email === email);
    if (existingUser) {
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
    await writeJSON('local-data/usuarios.json', usuarios);

    const { password: _, ...userWithoutPassword } = nuevoUsuario;
    return userWithoutPassword;
  }

  static async login({ input }) {
    const { email, password } = input;

    const user = usuarios.find(user => user.email === email);
    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Contraseña incorrecta.');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async update({ id, input }) {
    const index = usuarios.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }

    for (const key in input) {
      if (key === 'password') {
        usuarios[index].password = await bcrypt.hash(input[key], 10);
      } else {
        usuarios[index][key] = input[key];
      }
    }

    await writeJSON('local-data/usuarios.json', usuarios);

    const { password, ...updatedUser } = usuarios[index];
    return updatedUser;
  }

  static async protected({ id }) {
    const user = usuarios.find(user => user.id === id);
    if (!user) return null;

    const { password, ...rest } = user;
    return rest;
  }

  static async logout() {
    return true;
  }
}
