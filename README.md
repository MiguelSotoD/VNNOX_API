# VNNOX API Backend

Backend proxy en Node.js/Express para consumir la API de VNNOX (NovaStar).

---

## Requisitos

- Node.js v18 o superior
- npm
- Cuenta activa en [VNNOX US](https://us.vnnox.com/#/login)

---

## Instalación

```bash
git clone <repo-url>
cd VNNOX_API
npm install
```

---

## Configuración del archivo `.env`

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
VNNOX_USERNAME=your_username
VNNOX_PASSWORD=your_password
VNNOX_BASE_URL=https://openapi-us.vnnox.com
VNNOX_GATEWAY_URL=https://us-gateway.vnnox.com
PORT=3000
```

### ¿Cómo obtener tus credenciales?

1. Entra a [https://us.vnnox.com/#/login](https://us.vnnox.com/#/login)
2. Inicia sesión con tu cuenta

> **IMPORTANTE — diferencia entre username y contraseña:**
>
> - `VNNOX_USERNAME` → Es el **nombre de tu cuenta** (account name), visible en tu perfil dentro del portal. **No es el email ni el usuario con el que inicias sesión.**
> - `VNNOX_PASSWORD` → Es la **contraseña con la que inicias sesión** en el portal.

Si no sabes cuál es el account name, una vez dentro del portal búscalo en la sección de perfil o configuración de cuenta — suele aparecer como "Account Name" o "Username".

---

## Iniciar el servidor

```bash
# Modo desarrollo (hot-reload)
npm run dev

# Modo producción
npm start
```

El servidor corre en `http://localhost:3000` por defecto.

---

## Endpoints disponibles

### Autenticación

#### `POST /api/auth/token`

Obtiene el token de acceso de VNNOX y lo guarda en memoria para las demás peticiones.

**No requiere body** — las credenciales se toman del `.env`.

```bash
curl -X POST http://localhost:3000/api/auth/token
```

**Respuesta exitosa (`status: 0`):**

```json
{
  "logid": 1779810131058,
  "status": 0,
  "data": {
    "token": "f479e3efd2201fd693ce3f1504c197de",
    "expire": 86000
  }
}
```

> El token es válido por **86000 segundos (~24 horas)**. La API permite hasta **1000 peticiones por día** a este endpoint.

**Códigos de error comunes:**

| status | Descripción |
|--------|-------------|
| 0 | Éxito |
| 11 | Usuario o contraseña incorrectos |
| 2 | Username no enviado en el header |

---

#### `GET /api/auth/logid`

Devuelve el `logid` y token actualmente almacenados en memoria.

```bash
curl http://localhost:3000/api/auth/logid
```

---

### Media

#### `GET /api/media`

Obtiene la lista de medios de la cuenta. **Requiere haber llamado a `/api/auth/token` primero.**

| Query param | Requerido | Tipo | Descripción |
|-------------|-----------|------|-------------|
| `limit` | Sí | int | Número de items a obtener |
| `offset` | Sí | int | Item inicial (paginación) |
| `search` | No | string | Búsqueda por nombre |
| `isComplex` | No | int | `1` = media complejo, `0` = lista simple |

```bash
# Primeros 10 medios
curl "http://localhost:3000/api/media?limit=10&offset=0"

# Con búsqueda
curl "http://localhost:3000/api/media?limit=10&offset=0&search=mi_imagen"
```

**Respuesta exitosa:**

```json
{
  "data": {
    "count": "1",
    "mediaList": [
      {
        "mid": "21277",
        "mediaName": "S.jpg",
        "mediaType": "1",
        "media_entity": {
          "mid": "21277",
          "size": "10830",
          "height": "375",
          "width": "600",
          "unique": "7004bcb6058a4559f69b0a389549fd30",
          "duration_time": "00:00:00.000"
        },
        "pictureAddress": "https://...",
        "bigPictureAddress": "https://..."
      }
    ]
  },
  "status": [10000001]
}
```

**Códigos de estado del endpoint de media:**

| status | Descripción |
|--------|-------------|
| 10000001 | Datos obtenidos correctamente |
| 20000001 | Error al obtener datos |
| 40000001 | Token expirado — vuelve a llamar a `/api/auth/token` |

---

## Flujo de uso

```
1. POST /api/auth/token   →  obtiene y guarda el token
2. GET  /api/media        →  usa el token guardado automáticamente
```

El token se guarda **en memoria** — si reinicias el servidor debes volver a llamar a `/api/auth/token`.

---

## Nodos disponibles

| Región | API Host | Gateway Host |
|--------|----------|--------------|
| USA | `openapi-us.vnnox.com` | `us-gateway.vnnox.com` |

---

## Estructura del proyecto

```
VNNOX_API/
├── src/
│   ├── index.js          # Servidor Express
│   ├── store.js          # Estado compartido en memoria (token)
│   └── routes/
│       ├── auth.js       # Endpoints de autenticación
│       └── media.js      # Endpoints de media
├── .env                  # Credenciales (no subir a git)
├── .env.example          # Plantilla de variables de entorno
├── .gitignore
└── package.json
```

---

## Notas importantes

- El archivo `.env` está en `.gitignore` — nunca lo subas a un repositorio público.
- El token expira en ~24 horas. Implementa un mecanismo de renovación automática si lo usas en producción.
- La API de autenticación tiene un límite de **1000 peticiones por día**.
