# 📸 Cómo Agregar Tus Imágenes y Videos

## Opción 1: Archivos Locales (Recomendado)

### Paso 1: Crea las carpetas
En `c:\xampp-8\htdocs\sanvalentin.github.io\` crea estas carpetas:
- `fotos/` - Para tus imágenes
- `videos/` - Para tus videos

### Paso 2: Sube tus archivos
Coloca tus imágenes (.jpg, .png, .gif) en la carpeta `fotos/`
Coloca tus videos (.mp4, .webm) en la carpeta `videos/`

### Paso 3: Actualiza el array en script.js
Abre `script.js` y busca el array `photos` (línea ~10):

```javascript
const photos = [
    { type: 'image', src: 'fotos/foto-con-melina.jpg', alt: 'Con Melina' },
    { type: 'image', src: 'fotos/primer-beso.png', alt: 'Primer beso' },
    { type: 'video', src: 'videos/viaje-juntos.mp4', alt: 'Nuestro viaje' },
    { type: 'image', src: 'fotos/atardecer.jpg', alt: 'Atardecer romantic' }
];
```

---

## Opción 2: URLs de Internet

Si tus fotos están en Google Drive, Imgur, o cualquier otro sitio:

```javascript
const photos = [
    { type: 'image', src: 'https://ejemplo.com/mi-foto.jpg', alt: 'Descripción' },
    { type: 'video', src: 'https://ejemplo.com/mi-video.mp4', alt: 'Descripción' }
];
```

### Convertir Google Drive a URL directa:
1. Sube tu foto a Google Drive
2. Click derecho → "Obtener vínculo"
3. Cambia `open` por `uc` en la URL:
   - De: `https://drive.google.com/file/d/ID/view?usp=sharing`
   - A: `https://drive.google.com/uc?id=ID`

---

## Opción 3: Videos de YouTube

```javascript
const photos = [
    { type: 'youtube', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', alt: 'Mi video' }
];
```

Reemplaza `dQw4w9WgXcQ` con el ID del video (la parte después de `watch?v=`)

---

## Ejemplo Completo

```javascript
const photos = [
    // Imagen local
    { type: 'image', src: 'fotos/primer-encuentro.jpg', alt: 'Primer encuentro' },
    
    // Imagen de Google Drive
    { type: 'image', src: 'https://drive.google.com/uc?id=1ABC123...', alt: 'Momento especial' },
    
    // Video local
    { type: 'video', src: 'videos/nuestro-viaje.mp4', alt: 'Viaje juntos' },
    
    // Video YouTube
    { type: 'youtube', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', alt: 'Canción' },
    
    // Imagen de internet
    { type: 'image', src: 'https://ejemplo.com/foto.jpg', alt: 'Foto' }
];
```

---

## 🎬 Formatos Soportados

**Imágenes:**
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`

**Videos:**
- `.mp4` (más compatible)
- `.webm`
- `.m4v`

---

## 💡 Tips

1. **Comprimir imágenes:** Usa [tinypng.com](https://tinypng.com) para reducir tamaño
2. **Tab en script.js:** Los cambios se aplican al recargar la página
3. **Rutas relativas:** Siempre usa `fotos/` y `videos/` sin la barra inicial `/`
4. **Nombres de archivos:** Avoid espacios, usa guiones o underscores `mi_foto.jpg`

---

## ❌ Errores Comunes

| Error | Solución |
|-------|----------|
| Imagen no carga | Verifica que el archivo existe en la carpeta correcta |
| Ruta incorrecta | Usa `fotos/nombre.jpg` NO `/fotos/nombre.jpg` |
| Video no funciona | Convierte a MP4, algunos formatos no son compatibles |
| YouTube cortado | El embed debe ser `/embed/ID` NO `/watch?v=ID` |

---

## 🆘 Necesitas ayuda?

Si algún archivo no carga:
1. Abre DevTools (F12)
2. Pestaña "Console"
3. Filtra por "404" para ver archivos no encontrados
4. Verifica la ruta en script.js

¡Disfruta de tu galería personalizada! 💕
