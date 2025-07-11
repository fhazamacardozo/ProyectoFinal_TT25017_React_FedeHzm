# E-commerce Demo Project

Este proyecto es una aplicación web de demostración de un e-commerce, desarrollada como parte de un curso/bootcamp para aplicar conocimientos de desarrollo frontend moderno.

## 🚀 Características Principales

* **Catálogo de Productos:** Explora una lista de productos con sus detalles.
* **Carrito de Compras:** Agrega, elimina y gestiona productos en tu carrito.
* **Gestión de Productos (ABM):** Funcionalidad CRUD (Crear, Leer, Actualizar, Eliminar) de productos para usuarios con rol de administrador.
* **Autenticación de Usuarios:** Registro e inicio de sesión con Firebase Authentication (correo electrónico y contraseña).
* **Base de Datos NoSQL:** Almacenamiento de productos en Firebase Firestore.
* **Diseño Responsivo:** Interfaz adaptable a dispositivos móviles, tabletas y escritorio.
* **SEO y Accesibilidad:** Gestión de meta tags con React Head.

## 🛠️ Tecnologías Utilizadas

* **Frontend:**
    * [React.js](https://react.dev/)
    * [React-Bootstrap](https://react.bootstrap/)
    * [React Router DOM](https://reactrouter.com/en/main)
    * [React Icons](https://react-icons.github.io/react-icons/)
    * [React Head](https://www.npmjs.com/package/react-head) 
* **Backend como Servicio (BaaS):**
    * [Firebase](https://firebase.google.com/) (Authentication y Firestore)

## 🔑 Credenciales de Administrador

Para probar las funciones de **Administración de Productos (ABM)**, inicia sesión con estas credenciales:

**Email:** `admin@admin.com`
**Contraseña:** `adminadmin`

*Puedes registrarte como un usuario normal para explorar la experiencia de compra sin acceso a la administración.*

## ⚙️ Configuración y Ejecución Local

Sigue estos pasos para poner el proyecto en marcha localmente.

### Prerrequisitos

Asegúrate de tener instalado:
* [Node.js](https://nodejs.org/en/download/) (versión 18+ recomendada)
* [npm](https://www.npmjs.com/get-npm) o [Yarn](https://yarnpkg.com/getting-started/install)

### Instalación

1.  **Clona el repositorio**

2.  **Instala las dependencias:**
    ```bash
    npm install
    # o
    yarn install
    ```

### Variables de Entorno (Firebase API Key)

Para conectar la aplicación a tu proyecto de Firebase:

1.  **Crear un proyecto en Firebase o consultar por credenciales de mi proyecto de prueba:** Accede a la [Consola de Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto si no tienes uno. 
2.  **Crea el archivo `.env`:** En la raíz de tu proyecto, crea un archivo llamado `.env`.
3.  **Añade tus credenciales de Firebase:** Pega la configuración de tu proyecto de Firebase dentro de `.env`. Puedes encontrarla en la Consola de Firebase (Configuración del proyecto > Tus apps > Selecciona tu app web > Configuración).

    ```dotenv
    VITE_FIREBASE_API_KEY="Tu_ApiKey_De_Firebase"
    VITE_FIREBASE_AUTH_DOMAIN="Tu_AuthDomain_De_Firebase"
    VITE_FIREBASE_PROJECT_ID="Tu_ProjectId_De_Firebase"
    VITE_FIREBASE_STORAGE_BUCKET="Tu_StorageBucket_De_Firebase"
    VITE_FIREBASE_MESSAGING_SENDER_ID="Tu_MessagingSenderId_De_Firebase"
    VITE_FIREBASE_APP_ID="Tu_AppId_De_Firebase"
    ```
    *(`VITE_` es el prefijo que usa Vite para exponer las variables de entorno al cliente.)*

### Ejecutar la Aplicación

```bash
npm run dev
# o
yarn dev
La aplicación se abrirá en http://localhost:5173.

##🙋‍♂️ Autor
fhazamacardozo