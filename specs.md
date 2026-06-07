# Especificación de Requisitos de Software (ERS)
# Sistema E-commerce de Venta de Ropa
## Basado en el Estándar IEEE 830

---

# 1. Introducción

## 1.1 Propósito

El propósito de este documento es definir de manera detallada los requisitos funcionales, no funcionales, reglas de negocio y restricciones técnicas para el desarrollo de un sistema de comercio electrónico orientado a la venta de ropa.

Este documento servirá como guía para el diseño, implementación, pruebas y mantenimiento del sistema, garantizando que los requerimientos del negocio sean comprendidos y ejecutados correctamente por el equipo de desarrollo.

---

## 1.2 Alcance

El sistema permitirá a los usuarios registrarse, autenticarse, explorar productos, realizar búsquedas, administrar un carrito de compras y completar un proceso de checkout mediante una pasarela de pagos en entorno de pruebas.

Además, contará con un módulo administrativo (Backoffice) protegido por autenticación y autorización basada en roles, desde donde los administradores podrán gestionar el catálogo de productos de forma dinámica.

### Funcionalidades incluidas

- Registro e inicio de sesión.
- Gestión de perfil de usuario.
- Catálogo de productos.
- Filtros y búsqueda avanzada.
- Gestión de carrito de compras.
- Simulación de pagos.
- Historial de órdenes.
- Panel administrativo.
- Gestión de productos.
- Gestión de inventario.
- Control de acceso basado en roles.

### Funcionalidades fuera del alcance

- Pagos reales con tarjetas.
- Facturación electrónica.
- Integración con operadores logísticos.
- Gestión de devoluciones.
- Sistema de cupones y descuentos.
- Marketplace multi-vendedor.

---

## 1.3 Definiciones, Acrónimos y Abreviaturas

| Término | Descripción |
|----------|-------------|
| PERN | PostgreSQL, Express.js, React.js y Node.js |
| JWT | JSON Web Token |
| RBAC | Role Based Access Control |
| CRUD | Create, Read, Update, Delete |
| API REST | Interfaz de programación basada en HTTP |
| Dashboard | Vista principal del sistema |
| Backoffice | Panel administrativo |
| SPA | Single Page Application |
| Sandbox | Entorno de pruebas para pagos |
| Checkout | Flujo de finalización de compra |

---

# 2. Descripción General

## 2.1 Perspectiva del Producto

El sistema será una aplicación web moderna desarrollada bajo una arquitectura cliente-servidor.

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- Context API

### Backend

- Node.js
- Express.js
- JWT
- Bcrypt
- PostgreSQL

### Base de Datos

- PostgreSQL
- Modelo relacional normalizado

---

## 2.2 Arquitectura General

```text
┌─────────────────────┐
│      Cliente        │
│ React + Tailwind    │
└──────────┬──────────┘
           │ HTTP/HTTPS
           ▼
┌─────────────────────┐
│    API REST         │
│ Node + Express      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    PostgreSQL       │
└─────────────────────┘
```

---

## 2.3 Objetivos del Sistema

### Objetivos de Negocio

- Incrementar la disponibilidad del catálogo.
- Facilitar la gestión de productos.
- Mejorar la experiencia de compra.
- Reducir procesos manuales de administración.

### Objetivos Técnicos

- Mantener una arquitectura escalable.
- Garantizar seguridad en autenticación.
- Permitir mantenimiento sencillo.
- Facilitar futuras integraciones.

---

## 2.4 Perfil de Usuarios

### Cliente

Usuario encargado de:

- Registrarse.
- Navegar productos.
- Buscar prendas.
- Gestionar carrito.
- Realizar compras.

### Administrador

Usuario encargado de:

- Gestionar productos.
- Gestionar inventario.
- Supervisar órdenes.
- Administrar catálogo.

---

# 3. Reglas de Negocio

## RN-01

Todo usuario registrado tendrá por defecto el rol CLIENTE.

## RN-02

Solo usuarios con rol ADMIN podrán acceder al Backoffice.

## RN-03

Un producto no podrá venderse si su stock es igual a cero.

## RN-04

El precio de un producto deberá ser mayor que cero.

## RN-05

Un usuario deberá estar autenticado para realizar compras.

## RN-06

Una orden aprobada no podrá ser modificada.

## RN-07

Los productos eliminados deberán conservarse mediante eliminación lógica.

## RN-08

Los correos electrónicos deberán ser únicos dentro del sistema.

---

# 4. Requisitos Funcionales

Los requisitos funcionales de **Lunaro** se encuentran organizados según el orden lógico de implementación del sistema, permitiendo un desarrollo incremental y facilitando la planificación técnica del proyecto.

---

# Módulo 1. Autenticación y Gestión de Usuarios

## RF-01 Registro de Usuario

| Campo | Descripción |
|---------|-------------|
| ID | RF-01 |
| Nombre | Registro de Usuario |
| Descripción | El sistema deberá permitir que nuevos usuarios creen una cuenta proporcionando nombre completo, correo electrónico y contraseña. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | Ninguna |

### Flujo esperado

1. El usuario accede al formulario de registro.
2. Ingresa nombre, correo y contraseña.
3. El sistema valida los datos.
4. La contraseña es cifrada.
5. Se crea la cuenta con rol CLIENTE.
6. Se almacena la información en la base de datos.

---

## RF-02 Inicio de Sesión

| Campo | Descripción |
|---------|-------------|
| ID | RF-02 |
| Nombre | Inicio de Sesión |
| Descripción | El sistema deberá autenticar usuarios mediante correo electrónico y contraseña generando un token JWT para mantener la sesión activa. |
| Actor | Cliente / Administrador |
| Prioridad | Alta |
| Dependencias | RF-01 |

### Flujo esperado

1. El usuario ingresa correo y contraseña.
2. El sistema valida las credenciales.
3. Se genera un JWT.
4. Se almacena la sesión.
5. El usuario es redirigido al Dashboard.

---

## RF-03 Cierre de Sesión

| Campo | Descripción |
|---------|-------------|
| ID | RF-03 |
| Nombre | Cierre de Sesión |
| Descripción | El sistema deberá permitir finalizar la sesión eliminando el token almacenado en el cliente. |
| Actor | Cliente / Administrador |
| Prioridad | Media |
| Dependencias | RF-02 |

---

# Módulo 2. Perfil de Usuario

## RF-04 Visualizar Perfil

| Campo | Descripción |
|---------|-------------|
| ID | RF-04 |
| Nombre | Visualizar Perfil |
| Descripción | El usuario autenticado podrá consultar la información asociada a su cuenta. |
| Actor | Cliente |
| Prioridad | Media |
| Dependencias | RF-02 |

---

## RF-05 Actualizar Perfil

| Campo | Descripción |
|---------|-------------|
| ID | RF-05 |
| Nombre | Actualizar Perfil |
| Descripción | El usuario podrá actualizar información personal como nombre, dirección y número telefónico. |
| Actor | Cliente |
| Prioridad | Media |
| Dependencias | RF-04 |

---

# Módulo 3. Catálogo y Categorías

## RF-06 Consultar Categorías

| Campo | Descripción |
|---------|-------------|
| ID | RF-06 |
| Nombre | Consultar Categorías |
| Descripción | El sistema deberá mostrar las categorías disponibles de productos para facilitar la navegación. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | Ninguna |

---

## RF-07 Listar Productos

| Campo | Descripción |
|---------|-------------|
| ID | RF-07 |
| Nombre | Listar Productos |
| Descripción | El sistema deberá mostrar todos los productos activos disponibles para la venta. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | RF-06 |

---

## RF-08 Buscar Productos

| Campo | Descripción |
|---------|-------------|
| ID | RF-08 |
| Nombre | Buscar Productos |
| Descripción | El usuario podrá buscar productos utilizando coincidencias por nombre o palabras clave. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | RF-07 |

---

## RF-09 Filtrar Productos por Categoría

| Campo | Descripción |
|---------|-------------|
| ID | RF-09 |
| Nombre | Filtrar Productos |
| Descripción | El sistema deberá permitir visualizar únicamente los productos pertenecientes a una categoría específica. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | RF-07 |

---

# Módulo 4. Dashboard Principal

## RF-10 Visualizar Dashboard

| Campo | Descripción |
|---------|-------------|
| ID | RF-10 |
| Nombre | Dashboard Principal |
| Descripción | El sistema deberá mostrar una página principal con categorías, buscador, productos destacados y acceso rápido a funcionalidades principales. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | RF-07 |

---

## RF-11 Visualizar Productos Recientes

| Campo | Descripción |
|---------|-------------|
| ID | RF-11 |
| Nombre | Productos Recientes |
| Descripción | El sistema deberá mostrar dinámicamente los últimos productos registrados por el administrador. |
| Actor | Cliente |
| Prioridad | Media |
| Dependencias | RF-07 |

---

# Módulo 5. Detalle del Producto

## RF-12 Consultar Detalle de Producto

| Campo | Descripción |
|---------|-------------|
| ID | RF-12 |
| Nombre | Detalle de Producto |
| Descripción | El sistema deberá mostrar información detallada de un producto seleccionado incluyendo descripción, imágenes, precio y stock. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | RF-07 |

---

## RF-13 Seleccionar Talla

| Campo | Descripción |
|---------|-------------|
| ID | RF-13 |
| Nombre | Seleccionar Talla |
| Descripción | El usuario deberá seleccionar una talla disponible antes de agregar el producto al carrito. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | RF-12 |

---

## RF-14 Seleccionar Cantidad

| Campo | Descripción |
|---------|-------------|
| ID | RF-14 |
| Nombre | Seleccionar Cantidad |
| Descripción | El usuario podrá seleccionar la cantidad deseada del producto respetando la disponibilidad de stock. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | RF-12 |

---

# Módulo 6. Carrito de Compras

## RF-15 Agregar Producto al Carrito

| Campo | Descripción |
|---------|-------------|
| ID | RF-15 |
| Nombre | Agregar al Carrito |
| Descripción | El usuario podrá agregar productos al carrito indicando talla y cantidad. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | RF-13, RF-14 |

---

## RF-16 Visualizar Carrito

| Campo | Descripción |
|---------|-------------|
| ID | RF-16 |
| Nombre | Visualizar Carrito |
| Descripción | El sistema deberá mostrar todos los productos agregados al carrito junto con su información resumida. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | RF-15 |

---

## RF-17 Modificar Cantidades

| Campo | Descripción |
|---------|-------------|
| ID | RF-17 |
| Nombre | Modificar Cantidades |
| Descripción | El usuario podrá incrementar o disminuir la cantidad de productos agregados al carrito. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | RF-16 |

---

## RF-18 Eliminar Producto del Carrito

| Campo | Descripción |
|---------|-------------|
| ID | RF-18 |
| Nombre | Eliminar Producto |
| Descripción | El usuario podrá eliminar productos específicos del carrito de compras. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | RF-16 |

---

## RF-19 Calcular Totales

| Campo | Descripción |
|---------|-------------|
| ID | RF-19 |
| Nombre | Cálculo Automático |
| Descripción | El sistema deberá calcular automáticamente subtotales por producto y el total general de la compra. |
| Actor | Sistema |
| Prioridad | Alta |
| Dependencias | RF-16 |

---

# Módulo 7. Checkout y Pago

## RF-20 Resumen de Compra

| Campo | Descripción |
|---------|-------------|
| ID | RF-20 |
| Nombre | Resumen de Compra |
| Descripción | El sistema deberá mostrar un resumen completo de la orden antes de proceder con el pago. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | RF-19 |

---

## RF-21 Procesar Pago Simulado

| Campo | Descripción |
|---------|-------------|
| ID | RF-21 |
| Nombre | Pago Sandbox |
| Descripción | El sistema deberá permitir realizar pagos simulados utilizando una pasarela en modo de pruebas. |
| Actor | Cliente |
| Prioridad | Alta |
| Dependencias | RF-20 |

---

## RF-22 Generar Orden

| Campo | Descripción |
|---------|-------------|
| ID | RF-22 |
| Nombre | Generar Orden |
| Descripción | El sistema deberá registrar una orden en la base de datos una vez el pago sea aprobado exitosamente. |
| Actor | Sistema |
| Prioridad | Alta |
| Dependencias | RF-21 |

---

### Módulo 8. Historial de Pedidos

#### RF-16 (Visualización de Historial)

| Campo | Descripción |
|---------|-------------|
| ID | RF-16 |
| Nombre | Visualización de Historial |
| Descripción | El sistema deberá permitir a los usuarios autenticados acceder a una sección dedicada dentro de su perfil para consultar el listado cronológico de todos los pedidos realizados. |
| Actor | Cliente |
| Prioridad | Media |
| Dependencias | RF-15 |

##### Flujo esperado

1. El usuario accede a su perfil.
2. Selecciona la opción "Mis Pedidos".
3. El sistema consulta las órdenes asociadas al usuario.
4. Se muestra un listado ordenado por fecha descendente.

---

#### RF-17 (Detalle de Pedidos Pasados)

| Campo | Descripción |
|---------|-------------|
| ID | RF-17 |
| Nombre | Detalle de Pedidos |
| Descripción | Al seleccionar un pedido del historial, el sistema deberá mostrar el detalle completo de la transacción realizada. |
| Actor | Cliente |
| Prioridad | Media |
| Dependencias | RF-16 |

##### Información mostrada

- Identificador único de la orden.
- Fecha de compra.
- Estado del pedido.
- Estado del pago.
- Productos adquiridos.
- Talla seleccionada.
- Cantidad comprada.
- Precio histórico unitario.
- Subtotal por producto.
- Total de la orden.

---

#### RF-18 (Actualización Post-Pago)

| Campo | Descripción |
|---------|-------------|
| ID | RF-18 |
| Nombre | Registro Automático de Orden |
| Descripción | Tras una simulación de pago exitosa, el sistema deberá registrar automáticamente la orden en el historial del usuario y actualizar su estado a "Pagado". |
| Actor | Sistema |
| Prioridad | Alta |
| Dependencias | RF-15 |

##### Flujo esperado

1. El pago es aprobado por la pasarela Sandbox.
2. El sistema genera la orden.
3. Se almacena el detalle completo de la compra.
4. Se registra la fecha de creación.
5. El estado inicial se establece como "Pagado".
6. La orden aparece inmediatamente en el historial del usuario.
7. El sistema redirige a la pantalla de confirmación.

---

# Módulo 9. Historial de Compras

## RF-23 Consultar Historial

| Campo | Descripción |
|---------|-------------|
| ID | RF-23 |
| Nombre | Historial de Compras |
| Descripción | El usuario podrá consultar todas las órdenes realizadas desde su cuenta. |
| Actor | Cliente |
| Prioridad | Media |
| Dependencias | RF-22 |

---

## RF-24 Ver Detalle de Orden

| Campo | Descripción |
|---------|-------------|
| ID | RF-24 |
| Nombre | Detalle de Orden |
| Descripción | El usuario podrá visualizar los productos y datos asociados a una orden específica. |
| Actor | Cliente |
| Prioridad | Media |
| Dependencias | RF-23 |

---

# Módulo 9. Backoffice Administrativo

## RF-25 Acceso al Panel Administrativo

| Campo | Descripción |
|---------|-------------|
| ID | RF-25 |
| Nombre | Acceso Administrativo |
| Descripción | El sistema deberá restringir el acceso al panel administrativo únicamente a usuarios con rol ADMIN. |
| Actor | Administrador |
| Prioridad | Alta |
| Dependencias | RF-02 |

---

## RF-26 Crear Producto

| Campo | Descripción |
|---------|-------------|
| ID | RF-26 |
| Nombre | Crear Producto |
| Descripción | El administrador podrá registrar nuevos productos incluyendo información comercial e inventario. |
| Actor | Administrador |
| Prioridad | Alta |
| Dependencias | RF-25 |

---

## RF-27 Listar Productos Administrativos

| Campo | Descripción |
|---------|-------------|
| ID | RF-27 |
| Nombre | Listar Productos |
| Descripción | El administrador podrá visualizar todos los productos registrados dentro del sistema. |
| Actor | Administrador |
| Prioridad | Alta |
| Dependencias | RF-25 |

---

## RF-28 Actualizar Producto

| Campo | Descripción |
|---------|-------------|
| ID | RF-28 |
| Nombre | Actualizar Producto |
| Descripción | El administrador podrá modificar cualquier atributo asociado a un producto existente. |
| Actor | Administrador |
| Prioridad | Alta |
| Dependencias | RF-27 |

---

## RF-29 Eliminar Producto

| Campo | Descripción |
|---------|-------------|
| ID | RF-29 |
| Nombre | Eliminación Lógica |
| Descripción | El administrador podrá desactivar productos manteniendo la integridad del historial de órdenes. |
| Actor | Administrador |
| Prioridad | Alta |
| Dependencias | RF-27 |

---

## RF-30 Gestionar Inventario

| Campo | Descripción |
|---------|-------------|
| ID | RF-30 |
| Nombre | Gestión de Inventario |
| Descripción | El administrador podrá actualizar las existencias disponibles de cada producto. |
| Actor | Administrador |
| Prioridad | Alta |
| Dependencias | RF-28 |

---

## RF-31 Consultar Órdenes

| Campo | Descripción |
|---------|-------------|
| ID | RF-31 |
| Nombre | Consultar Órdenes |
| Descripción | El administrador podrá visualizar las órdenes realizadas por los clientes para fines de control y seguimiento. |
| Actor | Administrador |
| Prioridad | Media |
| Dependencias | RF-22 |

---

# 5. Requisitos No Funcionales

## RNF-01 Rendimiento

Las vistas principales deberán cargar en menos de 3 segundos bajo condiciones normales.

## RNF-02 Escalabilidad

La arquitectura deberá permitir incorporar nuevas funcionalidades sin afectar módulos existentes.

## RNF-03 Seguridad

Las contraseñas deberán almacenarse usando:

```text
bcrypt
```

Los endpoints protegidos deberán validar:

- JWT
- Rol de usuario
- Expiración del token

## RNF-04 Disponibilidad

La aplicación deberá estar disponible el 99% del tiempo durante pruebas.

## RNF-05 Responsividad

La interfaz deberá adaptarse correctamente a:

- Móviles
- Tablets
- Escritorio

## RNF-06 Usabilidad

Las operaciones principales deberán completarse en máximo tres clics desde la navegación principal.

## RNF-07 Mantenibilidad

El proyecto deberá seguir una estructura modular.

Frontend:

```text
components/
pages/
services/
hooks/
context/
```

Backend:

```text
routes/
controllers/
services/
middlewares/
repositories/
```

## RNF-08 Compatibilidad

La aplicación deberá funcionar correctamente en:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

---

# 6. Modelo de Datos Inicial

## Tabla users

| Campo | Tipo |
|---------|--------|
| id | UUID |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |
| role | VARCHAR |
| created_at | TIMESTAMP |

## Tabla products

| Campo | Tipo |
|---------|--------|
| id | UUID |
| name | VARCHAR |
| description | TEXT |
| price | DECIMAL |
| stock | INTEGER |
| category_id | UUID |
| image_url | TEXT |
| status | BOOLEAN |

## Tabla categories

| Campo | Tipo |
|---------|--------|
| id | UUID |
| name | VARCHAR |

## Tabla orders

| Campo | Tipo |
|---------|--------|
| id | UUID |
| user_id | UUID |
| total | DECIMAL |
| status | VARCHAR |
| created_at | TIMESTAMP |

## Tabla order_details

| Campo | Tipo |
|---------|--------|
| id | UUID |
| order_id | UUID |
| product_id | UUID |
| quantity | INTEGER |
| unit_price | DECIMAL |

---

# 7. Criterios de Aceptación

### CA-01

Un usuario debe poder registrarse correctamente.

### CA-02

Un usuario autenticado debe poder agregar productos al carrito.

### CA-03

El total del carrito debe actualizarse automáticamente.

### CA-04

Un administrador debe poder crear un producto y visualizarlo inmediatamente en la tienda.

### CA-05

Un administrador debe poder actualizar el stock de un producto.

### CA-06

Una compra aprobada debe generar una orden persistida en la base de datos.

### CA-07

Un usuario debe poder consultar su historial de compras.

### CA-08

Las rutas administrativas deben rechazar usuarios sin permisos.

---

# 8. Tecnologías Requeridas

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

## Backend

- Node.js
- Express.js
- JWT
- Bcrypt

## Base de Datos

- PostgreSQL

## Control de Versiones

- Git
- GitHub

## Despliegue

- Frontend: Vercel
- Backend: Render
- Base de Datos: Neon PostgreSQL