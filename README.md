# 📘 Documentación Técnica y Operativa — ByteForge SaaS Dashboard & Demo Platform

## 📄 Índice

 1. [Propósito del Proyecto y Enfoque Comercial](#-propósito-del-proyecto-y-enfoque-comercial)

 2. [Arquitectura General (Full-Stack Decoupled)](#-arquitectura-general-full-stack-decoupled)

 3. [Estructura del Proyecto y Árbol de Directorios](#-estructura-del-proyecto-y-árbol-de-directorios)

 4. [Backend / Servidor Express (Node.js en Render)](#-backend--servidor-express-nodejs-en-render)

 5. [Frontend React (Vite en Vercel)](#-frontend-react-vite-en-vercel)

 6. [Estrategia de Datos Persistentes y Fallback en Memoria](#-estrategia-de-datos-persistentes-y-fallback-en-memoria)

 7. [Control de Acceso Basado en Roles (RBAC)](#-control-de-acceso-basado-en-roles-rbac)

 8. [Motor de Diseño y Temas Duales (Light/Dark Mode)](#-motor-de-diseño-y-temas-duales-lightdark-mode)

 9. [Sistema de Internacionalización (i18n)](#-sistema-de-internacionalización-i18n)

10. [Flujo Completo de Autenticación y Páginas](#-flujo-completo-de-autenticación-y-páginas)

11. [Infraestructura y Herramientas 100% Gratuitas](#-infraestructura-y-herramientas-100-gratuitas)

12. [Declaración de Uso de Asistencia de Inteligencia Artificial](#-declaración-de-uso-de-asistencia-de-inteligencia-artificial)

13. [Propiedad Intelectual, Copyright y Términos de Servicio](#-propiedad-intelectual-copyright-y-términos-de-servicio)

## 🚀 Propósito del Proyecto y Enfoque Comercial

**ByteForge** es un prototipo funcional SaaS (*Software as a Service*) full-stack de nivel empresarial. Ha sido diseñado específicamente como **demostración de capacidades técnicas ante clientes e inversores**, mostrando cómo desplegar una plataforma robusta, rápida, responsiva y segura utilizando exclusivamente **herramientas de capa gratuita** (Free Tier).

### Aspectos Clave de la Solución:

* **Cero Costos de Infraestructura:** Operativo 24/7 sin consumo de base de datos SQL/NoSQL comercial, utilizando un sistema ligero de almacenamiento en archivo JSON (`database.json`) y sincronización reactiva en `localStorage`.

* **Experiencia de Usuario de Alto Nivel:** Cambio dinámico de idioma (Español / Inglés) y modo visual (Dark / Light Theme) sin refresco de página.

* **Seguridad y Control Operativo:** Simulación real de control de permisos por roles (`Admin`, `Editor`, `Viewer`) y flujos completos de inicio de sesión, registro y recuperación de contraseña.

## 🏗️ Arquitectura General (Full-Stack Decoupled)

La plataforma utiliza una arquitectura desacoplada donde el servidor web de interfaz y la API de servicios funcionan de forma independiente pero perfectamente sincronizadas a través de peticiones HTTP RESTful.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENTE / NAVEGADOR WEB                         │
│                                                                        │
│   ┌───────────────────────────┐         ┌──────────────────────────┐   │
│   │   LanguageContext (i18n)  │         │   ThemeContext (DOM)     │   │
│   └───────────────────────────┘         └──────────────────────────┘   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                     Vistas React (Vite)                        │   │
│   │ [Landing] [Login] [Register] [ResetPassword] [Dashboard] ...   │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │
               Peticiones RESTful   │ (HTTPS / CORS)
               y Fallback Local     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        ENTORNO DE PRODUCCIÓN                           │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 FRONTEND (Desplegado en Vercel)                │   │
│   │                 Estáticos optimizados por Vite                 │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                   │                                    │
│                                   │ Peticiones API REST                │
│                                   ▼                                    │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 BACKEND (Desplegado en Render)                 │   │
│   │   Node.js + Express Server                                     │   │
│   │   ├── routes/auth.js   ──► Validación y Tokens                 │   │
│   │   ├── routes/users.js  ──► Gestión CRUD usuarios               │   │
│   │   └── database.json    ──► Almacenamiento ágil en archivo      │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

## 📂 Estructura del Proyecto y Árbol de Directorios

El repositorio contiene tanto la lógica de cliente (Frontend) como la de servidor (Backend), organizadas de manera limpia y mantenible:

```
dashboard-saas/
├── server/                        # BACKEND (Node.js & Express API)
│   ├── models/                    # Modelos de datos y adaptadores
│   │   └── User.js                # Lógica del entidad Usuario
│   ├── node_modules/              # Dependencias del servidor
│   ├── routes/                    # Endpoints REST de la API
│   │   ├── auth.js                # Rutas para Login, Registro y Password Reset
│   │   └── users.js               # Rutas CRUD y gestión de roles
│   ├── .env                       # Variables de entorno del servidor
│   ├── database.json              # Almacenamiento local simulación de DB
│   ├── package.json               # Configuración del servidor Node.js
│   └── server.js                  # Punto de entrada de la API Express
├── src/                           # FRONTEND (React + Vite + Tailwind)
│   ├── assets/                    # Recursos estáticos (Logos, imágenes)
│   ├── components/                # Componentes UI reutilizables
│   │   ├── Icons.jsx              # Colección de iconos vectoriales SVG
│   │   ├── RecentTransactions.jsx  # Tabla dinámica de transacciones
│   │   └── Toast.jsx              # Sistema global de notificaciones flotantes
│   ├── config/                    # Configuraciones del cliente
│   │   └── api.js                 # URL base de la API y manejador de headers
│   ├── context/                   # Proveedores de Estado Global
│   │   ├── LanguageContext.jsx    # Motor i18n y diccionario ES/EN
│   │   └── ThemeContext.jsx       # Gestión de Dark/Light mode y clase <html>
│   ├── hooks/                     # Custom Hooks de React
│   │   └── useTransactions.js     # Hook personalizado para manipular transacciones
│   ├── pages/                     # Vistas / Páginas de la Aplicación
│   │   ├── Analytics.jsx          # Métricas financieras y tráfico web (Recharts)
│   │   ├── Billing.jsx            # Métodos de pago y suscripciones
│   │   ├── Dashboard.jsx          # Resumen principal y KPIs del sistema
│   │   ├── Landing.jsx            # Página pública de presentación del producto
│   │   ├── Login.jsx              # Formulario de inicio de sesión
│   │   ├── Register.jsx           # Formulario de creación de cuenta
│   │   ├── ResetPassword.jsx      # Recuperación de credenciales
│   │   ├── Settings.jsx           # Configuración de perfil y alertas
│   │   └── Users.jsx              # Administración de usuarios y RBAC
│   ├── translations/              # Archivos de traducción externa
│   │   └── index.js               # Diccionario de claves traducidas
│   ├── App.css                    # Estilos auxiliares
│   ├── App.jsx                    # Configuración de rutas y layout principal
│   ├── index.css                  # Directivas de Tailwind CSS
│   ├── Layout.jsx                 # Armazón principal (Sidebar + Topbar)
│   └── main.jsx                   # Punto de entrada de React DOM
├── .gitignore                     # Filtro de archivos para Git
├── eslint.config.js               # Reglas de lintering y calidad de código
├── index.html                     # Plantilla HTML5 raíz
├── package.json                   # Dependencias de Frontend
├── README.md                      # Presentación rápida para GitHub
├── vercel.json                    # Reglas de enrutamiento SPA para Vercel
└── vite.config.js                 # Configuración del empaquetador Vite
```

## 🖥️ Backend / Servidor Express (Node.js en Render)

El servidor ubicado en `/server` es un servicio independiente construido con **Express.js**.

### Características Técnicas del Backend:

* **CORS Habilitado:** Configurado para aceptar solicitudes seguras desde el dominio de Vercel.

* **Autenticación Basada en Rutas:**
  * `POST /api/auth/login`: Autentica usuarios comparando credenciales con `database.json`.
  * `POST /api/auth/register`: Registra nuevos usuarios y asigna rol por defecto (`Viewer` o `Editor`).
  * `POST /api/auth/reset-password`: Simula el envío y actualización segura de contraseña.
  * `GET /api/users`: Retorna el listado completo de usuarios registrados.
  * `PUT /api/users/:email`: Actualiza el rol o estado de un usuario (Requerido rol `Admin`).
  * `DELETE /api/users/:email`: Elimina registros del archivo `database.json`.

## 💾 Estrategia de Datos Persistentes y Fallback en Memoria

Dado que el propósito del proyecto es servir como **Demostración de Portafolio / Cliente** sin incurrir en costos de bases de datos como PostgreSQL o MongoDB en la nube, se implementó una **estrategia de persistencia híbrida e infalible**:

1. **Servidor Activo (Render):** Lee y escribe en el archivo `server/database.json`. Si el cliente o el administrador realiza una modificación, esta se guarda en este archivo.
2. **Fallback Local (Navegador):** Si la API gratuita en Render se encuentra dormida (inactividad del Free Tier) o no responde por falta de conexión, la aplicación en React detecta el fallo automáticamente y conmuta al uso de `localStorage` (`byteforge_system_users`, `byteforge_transactions`).
3. **Resultado:** La aplicación **nunca se rompe ante el cliente**, manteniendo siempre los datos visibles e interactivos.

## 🔐 Control de Acceso Basado en Roles (RBAC)

Para demostrar a los clientes la capacidad de gestionar permisos empresariales, la plataforma incluye control de acceso en 3 capas:

| Rol | Permisos en la Plataforma | Comportamiento UI en Demo |
| :--- | :--- | :--- |
| **Admin** | Acceso total (Lectura, Escritura, Edición, Borrado y Cambio de Roles). | Habilita todos los botones de la interfaz. |
| **Editor** | Puede modificar configuraciones, filtrar y actualizar su información personal. | Deshabilita la opción de eliminar usuarios o cambiar roles. |
| **Viewer** | Solo lectura de métricas y tablas. | Muestra notificaciones Toast de *"Acceso denegado: Se requieren permisos de Administrador"* al intentar guardar o borrar. |

## 🌓 Motor de Diseño y Temas Duales (Light/Dark Mode)

El sistema de estilos utiliza **Tailwind CSS** combinado con la lógica global implementada en `ThemeContext.jsx`.

### Lógica de Sincronización:
1. Lee la preferencia previa guardada en `localStorage.getItem('theme')`.
2. Alterna dinámicamente la clase `.dark` en el nodo raíz de la aplicación (`document.documentElement`).
3. Aplica estilos duales responsivos en cada tarjeta y componente:
   * **Tarjeta Modo Claro:** `bg-white border-slate-200 text-slate-900`
   * **Tarjeta Modo Oscuro:** `dark:bg-[#1e293b]/75 dark:border-slate-700/50 dark:text-white`

## 🌐 Sistema de Internacionalización (i18n)

Implementado en `src/context/LanguageContext.jsx` y alimentado por `src/translations/index.js`:
* **Modo de empleo en código:**
  ```javascript
  const { t } = useLanguage();
  <h1>{t('dashboardTitle') || 'Overview Dashboard'}</h1>
  ```
* Permite cambiar dinámicamente todo el sistema del Español al Inglés instantáneamente mediante el control en la barra superior.

## 📱 Flujo Completo de Autenticación y Páginas

La aplicación cuenta con una suite completa de pantallas construidas para simular un producto SaaS listo para producción:
1. **`Landing.jsx`:** Página de aterrizaje comercial pública con llamados a la acción, beneficios de la plataforma y presentación del producto.
2. **`Login.jsx`:** Pantalla de autenticación con validación de campos.
3. **`Register.jsx`:** Registro de nuevos usuarios y asignación automática al ecosistema.
4. **`ResetPassword.jsx`:** Flujo completo de recuperación de contraseña.
5. **`Dashboard.jsx`:** Vista general con métricas en tiempo real (Revenue, Users, Conversions) y transacciones recientes.
6. **`Analytics.jsx`:** Gráficos interactivos de ingresos vs. gastos e interacciones de tráfico semanal generados con `Recharts`.
7. **`Users.jsx`:** Tabla de administración de usuarios con filtros, modales para creación y control de roles RBAC.
8. **`Billing.jsx`:** Gestión de suscripciones activas, tarjetas de crédito integradas e historial de recibos descargables.
9. **`Settings.jsx`:** Perfil de usuario, edición de datos y toggles para preferencias de notificaciones.

## 🛠️ Infraestructura y Herramientas 100% Gratuitas

Toda la solución está desplegada y mantenida sin generar costos recurrentes, demostrando alta eficiencia de recursos:
* **Control de Versiones y Código Fuente:** [GitHub](https://github.com/) (Repositorio centralizado).
* **Despliegue del Frontend:** [Vercel](https://vercel.com/) (Servicio CDN ultrarrápido para React SPA con reescrituras `vercel.json`).
* **Despliegue del Backend:** [Render](https://render.com/) (Web Service para Node.js Express).
* **Entorno de Desarrollo:** Visual Studio Code, Vite, Node.js y npm.

## 🤖 Declaración de Uso de Asistencia de Inteligencia Artificial

Con el firme compromiso de mantener total transparencia con nuestros clientes, socios y evaluadores técnicos, declaramos que el desarrollo de este software ha sido concebido, dirigido y arquitectado íntegramente por talento humano.

La asistencia de **Inteligencia Artificial (IA)** se ha empleado de forma **estrictamente puntual y auxiliar** para optimizar los tiempos de entrega en tareas específicas del proceso de desarrollo:
* **Depuración y análisis de errores (Debugging):** Diagnóstico rápido de excepciones de trazas complejas y resolución de errores de sintaxis en estructuras de persistencia local (`localStorage`).
* **Documentación técnica:** Estructuración y redacción de guías operativas, manuales y especificaciones del sistema.
* **Refactorización y optimización:** Mejora de la legibilidad de algoritmos, rendimiento de componentes visuales y traducción o adaptación entre tecnologías web.
* **Prototipado rápido:** Generación preliminar de esqueletos de código repetitivo (*boilerplate*) que posteriormente fueron auditados, probados y adaptados a medida de los requerimientos de la plataforma.

*Ninguna parte crítica de la lógica de negocio, arquitectura de seguridad, control de accesos basada en roles (RBAC) o diseño de la experiencia de usuario ha sido automatizada sin la debida supervisión, auditoría y validación humana.*

## ⚖️ Propiedad Intelectual, Copyright y Términos de Servicio

© **2026 Gabriel Marte. Todos los derechos reservados.**

El código fuente, los diseños de interfaz de usuario (UI/UX), la estructura de bases de datos simuladas, los logotipos y toda la documentación técnica asociada a **ByteForge** son propiedad intelectual exclusiva del autor.

* **Permisos de Evaluación y Uso Demostrativo:** Se autoriza a clientes potenciales y evaluadores técnicos a visualizar, clonar y probar este repositorio exclusivamente con fines de demostración, evaluación comercial y revisión de portafolio.
* **Cláusula de Retiro y Restricciones:** Queda estrictamente prohibida la reproducción, distribución, modificación, reventa o uso no autorizado de este software para la creación de productos comerciales derivados sin la autorización previa y por escrito del autor. 
* **Términos de Servicio del Prototipo:** Este software se suministra "tal cual" (*as-is*) con fines demostrativos. El autor se reserva el derecho de retirar, modificar o restringir el acceso a los despliegues públicos en cualquier momento sin previo aviso.
