const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'byteforge_super_secret_key_2026';

// ==========================================
// MIDDLEWARE DE AUTENTICACIÓN Y ROL DE ADMIN
// ==========================================
const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verificamos que el usuario exista en la base de datos y sea Admin
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ error: 'Acceso prohibido: Se requieren privilegios de Administrador.' });
    }

    req.user = user; // Adjuntamos el usuario a la petición
    next();
  } catch (err) {
    console.error('Error de autenticación:', err);
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

// ==========================================
// 1. OBTENER TODOS LOS USUARIOS (GET /api/users)
// ==========================================
router.get('/', verifyAdmin, async (req, res) => {
  try {
    // Excluimos las contraseñas por seguridad al enviar la lista al frontend
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error interno del servidor al listar usuarios.' });
  }
});

// ==========================================
// 2. ACTUALIZAR ESTADO O ROL (PUT /api/users/:id)
// Útil para aprobar cuentas (Pending -> Active) o cambiar roles
// ==========================================
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, role, name } = req.body;

    const updateData = {};
    if (status) updateData.status = status; // Ej: 'Active', 'Pending', 'Suspended'
    if (role) updateData.role = role;       // Ej: 'Admin', 'Editor', 'Viewer'
    if (name) updateData.name = name;

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado correctamente.',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error interno al actualizar el usuario.' });
  }
});

// ==========================================
// 3. ELIMINAR USUARIO (DELETE /api/users/:id)
// ==========================================
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Evitar que el administrador se auto-elimine por accidente
    if (req.user._id.toString() === id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta de administrador principal.' });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente del sistema.'
    });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ error: 'Error interno al eliminar el usuario.' });
  }
});

module.exports = router;