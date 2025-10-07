# 📒 Gestor de Contactos - Full Stack CRUD App

Una aplicación web **completa y profesional** para gestionar contactos, construida con **Next.js 14**, **Prisma**, **PostgreSQL** y **Docker**.

---

## 🚀 Características Principales

### 🔐 Funcionalidades Core
- ✅ **Autenticación completa** con JWT  
- ✅ **CRUD** (Crear, Leer, Actualizar, Eliminar contactos)  
- ✅ **PostgreSQL** con Prisma ORM  
- ✅ **API RESTful protegida** con middleware  
- ✅ **Docker containerization** para despliegue rápido  
- ✅ **Diseño responsive** con Tailwind CSS  

### 💎 Interfaz Avanzada
- 🔍 **Búsqueda en tiempo real** con debounce (300 ms)  
- 🧩 **Filtros avanzados** por nombre, email, teléfono y dirección  
- 📊 **Paginación completa** con controles intuitivos  
- ↕️ **Ordenamiento múltiple** (nombre, email, teléfono, fecha)  
- 💬 **Toasts profesionales** para todas las operaciones  
- 🪟 **Modales** para crear y editar contactos  
- 📈 **Estadísticas en tiempo real**  

---

## 🧱 Componentes Reutilizables

| # | Componente | Descripción |
|:-:|-------------|-------------|
| 1 | `Button` | Variantes `primary`, `secondary`, `danger` |
| 2 | `Input` | Campos con validación y estilos |
| 3 | `Modal` | Ventana emergente reutilizable |
| 4 | `ContactForm` | Formulario crear/editar contactos |
| 5 | `ContactTable` | Tabla con paginación y acciones |
| 6 | `SearchBar` | Búsqueda en tiempo real |
| 7 | `ContactFilters` | Filtros y orden avanzado |
| 8 | `Toast` | Notificaciones interactivas |
| 9 | `Layout` | Layout principal |
| 10 | `Pagination` | Control de paginación |

---

## 🛠️ Tecnologías Utilizadas

### 🖥️ Frontend
- **Next.js 14 (App Router)**  
- **React 18 + TypeScript**  
- **Tailwind CSS**  
- **Context API + Custom Hooks**

### ⚙️ Backend
- **Next.js API Routes**  
- **Prisma ORM**  
- **JWT + bcryptjs**  
- **Middleware de protección**

### 🧩 Desarrollo
- **Docker & Docker Compose**  
- **ESLint**  
- **Diseño Responsive (Mobile First)**

---

## 📋 Prerrequisitos

| Requisito | Versión |
|------------|----------|
| Node.js | 18 o superior |
| Docker | Opcional, recomendado |
| PostgreSQL | Si no usas Docker |

---

## 🏃‍♂️ Instalación y Ejecución

### 🔸 Opción 1: Con Docker (Recomendada)

```bash
# Clonar el proyecto
git clone <repository-url>
cd contact-manager-final

# Ejecutar con Docker
docker-compose up --build
```

La aplicación estará disponible en 👉 **http://localhost:3000**

---

### 🔹 Opción 2: Desarrollo Local

```bash
# Clonar e instalar dependencias
git clone <repository-url>
cd contact-manager-final
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar DATABASE_URL y JWT_SECRET

# Configurar base de datos
npx prisma generate
npx prisma db push
npx prisma db seed

# Ejecutar
npm run dev
```

La app estará en 👉 **http://localhost:3000**

---

## 🔐 Credenciales de Prueba

| Email | Contraseña |
|--------|-------------|
| `admin@example.com` | `password123` |

---

## 🗂️ Estructura del Proyecto

```bash
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── login/route.ts
│   │   └── contacts/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── types/
│   ├── dashboard/
│   ├── login/
│   └── layout.tsx
├── middleware.ts
└── lib/
    └── auth.ts
```

---

## 📊 UI / UX Features

### 🔍 Búsqueda y Filtrado
- Búsqueda **en tiempo real** en nombre, email, teléfono y dirección  
- Debounce automático de **300 ms**  
- **Filtros avanzados** + **orden múltiple**  
- **Estadísticas instantáneas** de resultados  

### 📄 Paginación
- Control total entre páginas  
- Selector de tamaño (5, 10, 20)  
- Indicador: “Mostrando 1–5 de 20”  
- Adaptable a móvil/desktop  

### 💬 Notificaciones
- Toasts: `success`, `error`, `warning`, `info`  
- Autocierre y barra de progreso  
- Animaciones suaves y sistema en cola  

### 📱 Responsive
- Diseño mobile-first  
- Tablas que se adaptan a pantallas pequeñas  
- Modales ajustables y navegación touch  

---

## 🚢 Despliegue

```bash
npm run build
npm start
```

### Variables de entorno

```env
DATABASE_URL="postgresql://usuario:password@host:5432/basedatos"
JWT_SECRET="clave_super_secreta"
```

---

## 🧭 API Endpoints

### 🔐 Autenticación
| Método | Endpoint | Descripción |
|:--|:--|:--|
| `POST` | `/api/auth/login` | Iniciar sesión y obtener token JWT |

### 📇 Contactos (Protegidos)
| Método | Endpoint | Descripción |
|:--|:--|:--|
| `GET` | `/api/contacts` | Obtener todos los contactos |
| `POST` | `/api/contacts` | Crear nuevo contacto |
| `PUT` | `/api/contacts/[id]` | Actualizar contacto |
| `DELETE` | `/api/contacts/[id]` | Eliminar contacto |

---

## 🗄️ Esquema de Base de Datos (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  contacts  Contact[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String
  address   String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🎯 Estado del Proyecto

| Requisito | Estado |
|------------|:------:|
| CRUD Completo | ✅ |
| Autenticación JWT | ✅ |
| Docker y PostgreSQL | ✅ |
| Prisma Schema y Seed | ✅ |
| 10 Componentes Reutilizables | ✅ |
| Paginación y Filtros Avanzados | ✅ |
| Responsive Design | ✅ |
| Notificaciones Toast | ✅ |
| Documentación Completa | ✅ |

---

## 🧩 Docker Compose

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/contactmanager
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=contactmanager
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 👨‍💻 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build / Producción
npm run build
npm start

# Prisma
npx prisma generate
npx prisma db push
npx prisma studio
npx prisma db seed

# Docker
docker-compose up --build
docker-compose down
```

---

## 💬 Soporte y Solución de Problemas

- Revisa que las variables de entorno estén configuradas  
- Ejecuta `npx prisma generate` tras modificar el schema  
- Verifica que PostgreSQL esté corriendo  
- Consulta Prisma Studio: `npx prisma studio`

---

## ❤️ Desarrollado por

Desarrollado con 💙 usando  
**Next.js, TypeScript, Prisma, PostgreSQL y Docker**

> _“Sencillo, potente y 100 % funcional. ¡Listo para producción!”_ 🚀
