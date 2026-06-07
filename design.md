# Arquitectura y Diseño de Software (Design Specification)
## Proyecto: E-commerce de Ropa Completo (Stack PERN)

### 1. Alcance Técnico y Arquitectura General
El proyecto se concibe como una aplicación desacoplada que utiliza una arquitectura de API RESTful para la persistencia y manipulación de datos, y una Single Page Application (SPA) para la interfaz de usuario.

* **Frontend (Cliente):** Aplicación construida sobre Vite + React. Controlará el estado global de forma eficiente y consumirá los endpoints expuestos por el backend mediante peticiones HTTP asíncronas (Axios o Fetch API).
* **Backend (Servidor):** Servidor HTTP en Node.js utilizando el framework Express. Implementará un enrutamiento modularizado, middlewares de validación, encriptación de datos y gestión de tokens de sesión.
* **Base de Datos:** Motor relacional PostgreSQL encargado de asegurar la integridad referencial del negocio (usuarios, catálogo, órdenes).

---

### 2. Stack Tecnológico
* **Frontend Core:** React 18+ & Vite (Entorno de compilación ultra rápido).
* **Estilos y UI:** Tailwind CSS (Framework de utilidades CSS para diseño responsivo y ágil).
* **Iconografía:** Lucide React (Paquete de iconos SVG ligeros y consistentes).
* **Backend Core:** Node.js & Express.
* **Persistencia / ORM / Driver:** PostgreSQL nativo con el pool `pg` (o Sequelize/Prisma, seleccionando el driver nativo `pg` para máximo control de queries SQL).
* **Seguridad:** JSON Web Tokens (JWT) para sesiones y `bcryptjs` para el hashing de contraseñas.
* **Pasarela de Pagos:** Stripe API / PayPal SDK (Entorno Sandbox/Prueba).

---

### 3. Especificación de Interfaces (UI/UX)

El sistema constará de las siguientes vistas y componentes modulares:

1.  **Login y Registro (`/login`, `/register`):** Formulario limpio con validaciones en tiempo real (campos requeridos, formato de correo, longitud de contraseña). Redirecciona según el rol obtenido en el JWT.
2.  **Dashboard del Cliente (`/`):**
    * **Header (Navbar):** Logo, buscador global de texto, selector rápido de categorías, ícono de carrito con badge indicador de cantidad, menú desplegable de perfil / cerrar sesión.
    * **Módulo de Categorías:** Fila horizontal de tarjetas visuales o botones filtrables (Hombre, Mujer, Niños, Accesorios).
    * **Productos Recientes:** Grid responsivo (1 col móvil, 2 cols tablet, 4 cols desktop) que muestra los últimos productos agregados dinámicamente por el administrador mediante ordenación cronológica descendente.
3.  **Detalle del Producto (`/product/:id`):** Vista extendida al interactuar con una tarjeta. Muestra carrusel/imagen del producto, metadatos extendidos (nombre, descripción detallada, precio, stock disponible), selector de tallas y un input numérico para la cantidad que valida no superar el stock, junto al botón "Agregar al Carrito".
4.  **Carrito de Compras (`/cart`):** Tabla de control con el desglose de ítems añadidos. Permite incrementar/decrementar cantidades o remover ítems. Muestra la liquidación matemática en tiempo real: Precio Unitario, Subtotal por ítem y el Total General. Incluye el botón de acción "Proceder al Pago".
5.  **Pasarela de Pagos / Checkout (`/checkout`):** Formulario seguro para ingresar los datos de la tarjeta de crédito de prueba. Al procesar de forma exitosa, conecta con el backend para consolidar la orden.
6.  **Configuración de Perfil (`/profile`):** Vista de gestión de datos personales del usuario (nombre, dirección de envío predeterminada, teléfono).
7.  **Panel de Administración (`/admin`):**
    * **Módulo CRUD:** Tabla de datos con paginación que lista todo el catálogo. Botones para activar/desactivar producto (eliminación lógica), editar datos y un botón principal para abrir el formulario modal de "Crear Nuevo Producto".
8.  **Historial de Pedidos (`/orders` o `/profile/orders`):** Vista estructurada en formato de acordeón o línea de tiempo que renderiza las compras del usuario ordenadas por fecha descendente. Cada tarjeta de pedido mostrará de forma resumida el ID del pedido, la fecha y un componente Badge de Tailwind para el estado (ej: Verde para `'paid'`, Amarillo para `'pending'`). Al expandirse, invocará los detalles de los productos asociados.

---

### 4. Sistema de Diseño Visual

#### 4.1 Paleta de Colores (Basada en Tailwind CSS)

Se adopta una línea visual sobria, moderna y elegante orientada al sector de la moda (Apparel/Fashion):

| Rol Visual | Color Hex | Clase Tailwind equivalente | Propósito |
| :--- | :--- | :--- | :--- |
| **Primario (Fondo Principal)** | `#F8FAFC` | `bg-slate-50` | Fondo general de la aplicación limpia. |
| **Superficie (Cards/Nav)** | `#FFFFFF` | `bg-white` | Contenedores, headers y tarjetas de producto. |
| **Texto Principal** | `#0F172A` | `text-slate-900` | Títulos, nombres de productos y textos de alto contraste. |
| **Texto Secundario** | `#475569` | `text-slate-600` | Descripciones, subtítulos y precios unitarios. |
| **Acento / Éxito** | `#059669` | `text-emerald-600` / `bg-emerald-600` | Precios destacados, botones de compra exitosa, pagos aprobados y estado "Pagado". |
| **Interactivo / Enlaces** | `#4F46E5` | `text-indigo-600` / `bg-indigo-600` | Botones de llamadas a la acción primarios (Login, Guardar, Checkout). |
| **Estado Pendiente / Verificación** | `#F59E0B` | `text-amber-500` / `bg-amber-500` | Etiquetas de pedidos en proceso de pago, validación o verificación administrativa. |
| **Estado Entregado** | `#2563EB` | `text-blue-600` / `bg-blue-600` | Indicadores visuales para pedidos completados y entregados al cliente. |
| **Peligro / Alerta** | `#DC2626` | `text-red-600` / `bg-red-600` | Botón eliminar del carrito, pedidos cancelados, alertas de stock agotado y errores críticos. |

#### 4.2 Iconografía (Lucide React)
* `Search`: Barra de búsqueda en el header.
* `ShoppingCart`: Acceso al carrito y badge de ítems.
* `User`: Acceso a la configuración de perfil y login.
* `Plus` / `Minus`: Selectores de cantidad en carrito y detalles.
* `Trash2`: Eliminación de ítems en el carrito.
* `Edit`: Acceso a la edición de productos en la tabla administrativa.
* `CheckCircle`: Pantalla de confirmación de pago exitoso.
* `Filter`: Filtrado avanzado de categorías.

---

### 5. Diccionario de Datos (PostgreSQL Mapping)

Este diccionario define de manera estricta la estructura de las tablas, restricciones y tipos de datos que se inicializarán en la base de datos PostgreSQL.

#### 5.1 Tabla: `users`
Almacena las credenciales y perfiles de los usuarios del sistema (Clientes y Administradores).

| Campo | Tipo de Datos | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` o `UUID` | `PRIMARY KEY` | Identificador único del usuario. |
| `name` | `VARCHAR(100)` | `NOT NULL` | Nombre completo del usuario. |
| `email` | `VARCHAR(150)` | `NOT NULL`, `UNIQUE` | Correo electrónico usado como login. |
| `password` | `VARCHAR(255)` | `NOT NULL` | Hash encriptado de la contraseña (bcrypt). |
| `role` | `VARCHAR(20)` | `NOT NULL`, `DEFAULT 'client'` | Roles permitidos: `'client'` o `'admin'`. |
| `phone` | `VARCHAR(20)` | `NULL` | Teléfono de contacto. |
| `address` | `TEXT` | `NULL` | Dirección física para el despacho de ropa. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP`| Fecha de registro en el sistema. |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP`| Fecha de última modificación. |

#### 5.2 Tabla: `categories`
Clasificación lógica para la organización de las prendas de vestir.

| Campo | Tipo de Datos | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Identificador único de la categoría. |
| `name` | `VARCHAR(50)` | `NOT NULL`, `UNIQUE` | Nombre de la categoría (ej. 'Hombre'). |
| `description`| `TEXT` | `NULL` | Detalle conceptual de la categoría. |
| `active` | `BOOLEAN` | `DEFAULT TRUE` | Control para habilitar/deshabilitar de la UI. |

#### 5.3 Tabla: `products`
Catálogo maestro de las prendas de vestir administradas dinámicamente.

| Campo | Tipo de Datos | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Identificador único de la prenda. |
| `category_id`| `INTEGER` | `FOREIGN KEY REFERENCES categories(id)` | Vínculo con la tabla categorías. |
| `name` | `VARCHAR(150)` | `NOT NULL` | Nombre comercial de la prenda de ropa. |
| `description`| `TEXT` | `NOT NULL` | Detalle, material y especificaciones. |
| `price` | `NUMERIC(10,2)`| `NOT NULL`, `CHECK (price >= 0)` | Precio unitario de venta. |
| `stock` | `INTEGER` | `NOT NULL`, `CHECK (stock >= 0)` | Cantidad disponible en inventario. |
| `sizes` | `VARCHAR(10)[]`| `NOT NULL` | Array de texto con tallas (ej. `{'S', 'M', 'L'}`). |
| `image_url` | `TEXT` | `NOT NULL` | Enlace persistido de la imagen de la prenda. |
| `active` | `BOOLEAN` | `DEFAULT TRUE` | Eliminación lógica (Inactivo oculta del cliente). |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP`| Permite ordenar por "Productos Recientes". |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP`| Fecha de actualización de stock o precio. |

#### 5.4 Tabla: `orders`
Cabecera de las transacciones procesadas con éxito mediante la pasarela de pagos.

| Campo | Tipo de Datos | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Identificador único del pedido. |
| `user_id` | `INTEGER` | `FOREIGN KEY REFERENCES users(id)` | Cliente que realizó la compra. |
| `total` | `NUMERIC(10,2)`| `NOT NULL` | Monto total liquidado de la orden. |
| `status` | `VARCHAR(30)` | `DEFAULT 'pending'` | Estados: `'pending'`, `'paid'`, `'failed'`. |
| `payment_id` | `VARCHAR(255)` | `NULL` | ID de transacción retornado por la pasarela de prueba. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP`| Fecha exacta del cobro y orden. |

#### 5.5 Tabla: `order_items`
Detalle granular (cuerpo) de las prendas adquiridas en cada orden de compra.

| Campo | Tipo de Datos | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Identificador único de la línea de detalle. |
| `order_id` | `INTEGER` | `FOREIGN KEY REFERENCES orders(id) ON DELETE CASCADE` | Vínculo con la cabecera del pedido. |
| `product_id` | `INTEGER` | `FOREIGN KEY REFERENCES products(id)` | Prenda comprada. |
| `quantity` | `INTEGER` | `NOT NULL`, `CHECK (quantity > 0)` | Cantidad de unidades compradas. |
| `price_unit` | `NUMERIC(10,2)`| `NOT NULL` | Precio de la prenda al momento de la compra. |