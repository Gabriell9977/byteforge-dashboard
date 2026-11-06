const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.use(helmet());

// Configuración de CORS optimizada para permitir Vercel y desarrollo local
const allowedOrigins = [
  'http://localhost:5173',
  'https://byteforge-dashboard.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'byteforge_super_secret_key_2026';
const DB_FILE = path.join(__dirname, 'database.json');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// ==========================================
// INICIALIZACIÓN DE LA BASE DE DATOS (DB SEED)
// ==========================================
const initDB = async () => {
  let db = { users: [] };
  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (e) {
      db = { users: [] };
    }
  }

  const adminEmail = 'gabriel@byteforge.io';
  const adminIndex = db.users.findIndex(u => u.email === adminEmail);
  
  if (adminIndex === -1) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.users.push({
      id: 'admin-default-id',
      name: 'Gabriel Marte',
      email: adminEmail,
      password: hashedPassword,
      role: 'Admin',
      status: 'Active',
      isVerified: true,
      verificationCode: null,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } else {
    // Aseguramos que el admin principal siempre esté activo y verificado
    if (db.users[adminIndex].role !== 'Admin' || db.users[adminIndex].status !== 'Active') {
      db.users[adminIndex].role = 'Admin';
      db.users[adminIndex].status = 'Active';
      db.users[adminIndex].isVerified = true;
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    }
  }
};

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// ==========================================
// MIDDLEWARES DE SEGURIDAD Y RBAC
// ==========================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing or invalid.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token verification failed.' });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Forbidden: Administrator privileges required.' });
  }
  next();
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ==========================================
// 1. RUTA DE REGISTRO
// ==========================================
app.post('/api/auth/register', authLimiter, async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    const db = readDB();
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ error: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'Viewer',
      status: 'Pending',
      isVerified: true,
      verificationCode: null,
      resetPasswordToken: null,
      resetPasswordExpires: null
    };

    db.users.push(newUser);
    writeDB(db);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Your account is pending administrator approval.'
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 2. RUTA DE LOGIN (Con validación de estado)
// ==========================================
app.post('/api/auth/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Credentials are required.' });
    }

    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status && user.status !== 'Active') {
      return res.status(403).json({ 
        error: 'Access denied: Your account is pending administrator approval or has been suspended.' 
      });
    }

    const userRole = user.role || 'Viewer';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: userRole, status: user.status }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: userRole, 
        status: user.status 
      }
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 3. RECUPERACIÓN Y RESTABLECIMIENTO DE CONTRASEÑA
// ==========================================
app.post('/api/auth/forgot-password', authLimiter, (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // Por seguridad (mitigación de enumeración), respondemos éxito genérico aunque no exista
    if (!user) {
      return res.json({ success: true, message: 'If the email exists, password reset instructions have been sent.' });
    }

    // Generar token criptográfico único con expiración de 15 minutos
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    writeDB(db);

    // Simulador profesional en la consola del servidor backend
    console.log(`\n========================================`);
    console.log(`[PASSWORD RESET SIMULATOR] To: ${user.email}`);
    console.log(`[RESET LINK]: http://localhost:5173/reset-password/${resetToken}`);
    console.log(`========================================\n`);

    res.json({ success: true, message: 'Password reset instructions have been sent to your email.' });
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/reset-password', authLimiter, async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    const db = readDB();
    const user = db.users.find(
      u => u.resetPasswordToken === token && u.resetPasswordExpires > Date.now()
    );

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset token.' });
    }

    // Encriptar la nueva contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    writeDB(db);

    res.json({ success: true, message: 'Password has been reset successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 4. RUTAS DE GESTIÓN DE USUARIOS (Admin)
// ==========================================
app.get('/api/users', authenticateToken, requireAdmin, (req, res, next) => {
  try {
    const db = readDB();
    const users = db.users.map(({ password, verificationCode, resetPasswordToken, resetPasswordExpires, ...rest }) => rest);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/users/:id', authenticateToken, requireAdmin, (req, res, next) => {
  try {
    const { id } = req.params;
    const db = readDB();

    const userExists = db.users.some(u => u.id === id);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    db.users = db.users.filter(u => u.id !== id);
    writeDB(db);

    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

app.put('/api/users/:id', authenticateToken, requireAdmin, (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, status } = req.body;
    const db = readDB();

    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (name !== undefined) db.users[userIndex].name = name;
    if (role !== undefined) db.users[userIndex].role = role;
    if (status !== undefined) db.users[userIndex].status = status;

    writeDB(db);

    const { password, verificationCode, resetPasswordToken, resetPasswordExpires, ...updatedUser } = db.users[userIndex];
    res.json({ success: true, message: 'User updated successfully.', user: updatedUser });
  } catch (err) {
    next(err);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[Server Error]: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening securely on port ${PORT}`);
  });
});