const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'byteforge_super_secret_key_2026';

// ==========================================
// 1. RUTA DE REGISTRO
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Ya existe un usuario registrado con este correo.' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // REGLA DE NEGOCIO: Nace como 'Viewer' y con estado 'Pending' para aprobación del Admin
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'Viewer',
      status: 'Pending'
    });

    await newUser.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Usuario registrado exitosamente. Pendiente de aprobación por el administrador.' 
    });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error interno del servidor durante el registro.' });
  }
});

// ==========================================
// 2. RUTA DE LOGIN
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Por favor, ingresa correo y contraseña.' });
    }

    // Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas o la cuenta no existe.' });
    }

    // REGLA CRÍTICA DE SEGURIDAD: Validar si la cuenta ha sido aprobada por el Admin
    if (user.status && user.status !== 'Active') {
      return res.status(403).json({ 
        error: 'Acceso denegado: Tu cuenta se encuentra pendiente de aprobación o ha sido suspendida.' 
      });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Generar Token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, status: user.status },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor durante el inicio de sesión.' });
  }
});

// ==========================================
// 3. RUTA DE RECUPERACIÓN DE CONTRASEÑA
// ==========================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Verificamos opcionalmente si existe (sin filtrar por seguridad)
    const user = await User.findOne({ email: email?.toLowerCase() });

    res.json({
      success: true,
      message: 'Si el correo está registrado, se han enviado las instrucciones de recuperación.'
    });
  } catch (err) {
    console.error('Error en forgot-password:', err);
    res.status(500).json({ error: 'Error al procesar la recuperación de contraseña.' });
  }
});

module.exports = router;