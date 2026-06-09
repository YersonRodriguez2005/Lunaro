<div align="center">

# Lunaro ·

**Plataforma de moda e-commerce construida con React, Node.js y PostgreSQL**

![Version](https://img.shields.io/badge/version-1.0.0-indigo?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

</div>

---

## Índice

- [Descripción](#-descripción)
- [Tech Stack](#-tech-stack)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Vistas](#-vistas)
- [Características](#-características)
- [Instalación](#-instalación)
- [Variables de entorno](#-variables-de-entorno)
- [Scripts](#-scripts)
- [Flujo de autenticación](#-flujo-de-autenticación)
- [Roles y permisos](#-roles-y-permisos)

---

## 📌 Descripción

**Lunaro** es una plataforma de e-commerce de moda con catálogo de productos, carrito de compras, sistema de reseñas y panel de administración. Cuenta con autenticación mediante JWT (access + refresh token), checkout simulado y gestión completa de inventario para administradores.

---

## 🛠 Tech Stack

### Frontend
| Tecnología | Uso |
|---|---|
| **React 18** | UI declarativa con hooks |
| **Vite** | Bundler y servidor de desarrollo |
| **Tailwind CSS** | Estilos utilitarios |
| **Zustand** | Estado global (auth, carrito, búsqueda) |
| **React Router v6** | Enrutamiento SPA |
| **Axios** | Cliente HTTP con interceptores |
| **Lucide React** | Iconografía |

### Backend
| Tecnología | Uso |
|---|---|
| **Node.js 20** | Runtime |
| **Express** | Framework HTTP |
| **PostgreSQL 16** | Base de datos relacional |
| **JWT** | Autenticación (access + refresh token) |
| **Multer** | Subida de imágenes |
| **Bcrypt** | Hash de contraseñas |

---

## 📁 Estructura del proyecto

```
lunaro/
├── client/                        # Frontend React + Vite
│   ├── public/
│   └── src/
│       ├── api/                   # Funciones de llamada a la API (axios)
│       │   ├── auth.js
│       │   ├── products.js
│       │   ├── categories.js
│       │   ├── orders.js
│       │   ├── checkout.js
│       │   └── users.js
│       ├── components/            # Componentes reutilizables
│       │   ├── Header.jsx
│       │   ├── ProductCard.jsx
│       │   ├── ProductReviews.jsx
│       │   └── SessionModal.jsx
│       ├── pages/                 # Vistas principales
│       │   ├── Dashboard.jsx
│       │   ├── ProductDetail.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── Profile.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── AdminPanel.jsx
│       └── store/                 # Estado global Zustand
│           ├── authStore.js
│           ├── cartStore.js
│           └── searchStore.js
│
└── server/                        # Backend Express
    ├── controllers/
    ├── middlewares/
    │   ├── auth.middleware.js      # Verificación JWT
    │   └── role.middleware.js      # Control de roles
    ├── routes/
    │   ├── auth.routes.js
    │   ├── products.routes.js
    │   ├── categories.routes.js
    │   ├── orders.routes.js
    │   └── users.routes.js
    ├── db/
    │   └── pool.js                # Conexión a PostgreSQL
    └── index.js
```

---

## 🖼 Vistas

> Reemplaza las celdas de imagen con capturas reales de tu proyecto.

| Vista | Descripción | Captura |
|---|---|:---:|
| **Dashboard** | Catálogo con filtros por categoría, búsqueda en tiempo real y paginación | ![Dashboard](./screenshots/dashboard.png) |
| **Detalle de producto** | Galería de imágenes, selector de talla, cantidad, reseñas y beneficios | ![ProductDetail](./screenshots/product-detail.png) |
| **Carrito** | Lista de artículos, control de cantidad, barra de progreso para envío gratis | ![Cart](./screenshots/cart.png) |
| **Checkout** | Formulario de pago simulado con detección de tarjeta y resumen del pedido | ![Checkout](./screenshots/checkout.png) |
| **Perfil** | Datos personales, dirección de envío e historial de órdenes con estado | ![Profile](./screenshots/profile.png) |
| **Login** | Autenticación con layout split-panel | ![Login](./screenshots/login.png) |
| **Registro** | Creación de cuenta con indicador de fortaleza de contraseña | ![Register](./screenshots/register.png) |
| **Panel Admin** | KPIs, gestión de productos (CRUD), inventario con filtros y drag & drop de imágenes | ![AdminPanel](./screenshots/admin.png) |

---

## ✨ Características

### Clientes
- 🔍 Búsqueda en tiempo real con filtro por categoría y "Mejor Valorados"
- 🛒 Carrito persistente con Zustand (por producto + talla)
- ⭐ Sistema de reseñas con calificación por estrellas y distribución visual
- 📦 Historial de órdenes con estado (pagado, pendiente, enviado)
- 👤 Perfil editable con dirección de envío preestablecida

### Administradores
- 📊 KPIs de inventario (total, activos, stock bajo, sin stock)
- 🗂 Gestión de categorías en tiempo real
- 📸 Subida de imágenes con drag & drop (Multer)
- ✏️ CRUD completo de productos con soft delete
- 🔎 Búsqueda y filtro por estado en el inventario

### Seguridad
- 🔐 JWT con access token de corta duración y refresh token
- ⏱ Modal de sesión con cuenta regresiva y renovación automática
- 🔒 Rutas protegidas por rol (`user` / `admin`) en frontend y backend
- 🛡 Contraseñas hasheadas con Bcrypt

---

## 🚀 Instalación

### Requisitos previos
- Node.js ≥ 20
- PostgreSQL ≥ 15
- npm ≥ 9

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/lunaro.git
cd lunaro
```

### 2. Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Run en ambas terminales (Backend y Frontend)
npm run dev
```

### 3. Configurar la base de datos

```bash
# Crear la base de datos en PostgreSQL
createdb lunaro_db

# Ejecutar el esquema inicial
psql -d lunaro_db -f server/db/schema.sql
```

### 4. Configurar variables de entorno

Crea los archivos `.env` en cada carpeta (ver sección siguiente).

### 5. Iniciar el proyecto

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` y el servidor en `http://localhost:3000`.

---

## 🔑 Variables de entorno

### `server/.env`

```env
# Servidor
PORT=3000

# Base de datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/lunaro_db

# JWT
JWT_SECRET=tu_secreto_de_access_token
JWT_REFRESH_SECRET=tu_secreto_de_refresh_token
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Archivos
UPLOAD_DIR=uploads
```

### `client/.env`

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📜 Scripts

### Backend (`server/`)

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor en modo desarrollo con hot-reload |
| `npm start` | Servidor en producción |

### Frontend (`client/`)

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build de producción |

---

## 🔐 Flujo de autenticación

```
[Login]
   │
   ├─► POST /api/auth/login
   │       └─► Responde con { accessToken, refreshToken, user }
   │
   ├─► accessToken  → guardado en localStorage
   └─► refreshToken → guardado en localStorage

[Peticiones autenticadas]
   │
   └─► Axios interceptor adjunta Authorization: Bearer <accessToken>

[Token expirado]
   │
   ├─► authStore detecta expiración próxima → muestra SessionModal
   ├─► Usuario elige "Continuar" → POST /api/auth/refresh
   │       └─► Nuevo accessToken → updateToken() en Zustand
   └─► Usuario elige "Cerrar sesión" → logout() + redirect /login
```

---

## 👥 Roles y permisos

| Acción | `user` | `admin` |
|---|:---:|:---:|
| Ver catálogo | ✅ | ✅ |
| Ver detalle de producto | ✅ | ✅ |
| Agregar al carrito | ✅ | ✅ |
| Realizar checkout | ✅ | ✅ |
| Dejar reseñas | ✅ | ✅ |
| Ver historial de órdenes | ✅ | ✅ |
| Acceder al Panel Admin | ❌ | ✅ |
| Crear / editar productos | ❌ | ✅ |
| Desactivar productos | ❌ | ✅ |
| Gestionar categorías | ❌ | ✅ |

---

<div align="center">

Hecho con ♥ para **Lunaro** · [MIT License](./LICENSE)

</div>