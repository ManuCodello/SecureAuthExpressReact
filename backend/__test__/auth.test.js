// backend/__tests__/auth.test.js

const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth.routes');
// Necesitaremos una versión simplificada de nuestra app para probar solo las rutas
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock (simulación) del modelo para no depender de la base de datos real en las pruebas
jest.mock('../models/user.model', () => ({
  findByEmail: jest.fn(),
  create: jest.fn()
}));
const User = require('../models/user.model');

describe('Auth Endpoints', () => {

  // Limpiamos los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería registrar un nuevo usuario exitosamente', async () => {
    // Simular que el usuario no existe y que la creación es exitosa
    User.findByEmail.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 1 });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Usuario registrado exitosamente.');
  });

  it('no debería registrar un usuario si el email ya existe', async () => {
    // Simular que el usuario ya existe
    User.findByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
      
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'El correo electrónico ya está en uso.');
  });
});