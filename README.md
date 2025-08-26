# 🎰 Tragaperras Casino

Una aplicación de tragaperras virtual desarrollada en Next.js con React y Framer Motion para animaciones fluidas.

## 🚀 Características

- **3 columnas de giro**: Cada carrete gira de forma independiente con diferentes tiempos de parada
- **Animaciones suaves**: Utilizando Framer Motion para efectos visuales atractivos
- **Sistema de créditos**: Comienza con 100 créditos, cada giro cuesta 10
- **Múltiples símbolos**: 8 símbolos diferentes con diferentes valores de premio
- **Detección de victorias**: Premios por 2 o 3 símbolos iguales
- **Diseño tipo casino**: Colores dorados, efectos de brillo y animaciones de neón

## 🎮 Cómo Jugar

1. Haz clic en el botón "GIRAR" para hacer girar los carretes
2. Cada giro cuesta 10 créditos
3. Gana créditos al obtener símbolos iguales:
   - 💎 Tres diamantes = 500 créditos
   - ⭐ Tres estrellas = 300 créditos  
   - 🔔 Tres campanas = 200 créditos
   - Otros tres iguales = 100 créditos
   - Dos iguales = 30 créditos
4. Cuando te quedes sin créditos, puedes reiniciar el juego

## 🛠️ Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## 📦 Dependencias Principales

- **Next.js 14**: Framework de React para aplicaciones web
- **React 18**: Biblioteca de interfaz de usuario
- **Framer Motion**: Biblioteca de animaciones para React
- **TypeScript**: Superset tipado de JavaScript

## 🎨 Características Técnicas

- **Responsive Design**: Se adapta a diferentes tamaños de pantalla
- **Animaciones fluidas**: Carretes que giran con efectos de desenfoque
- **Estado del juego**: Manejo completo del estado con React hooks
- **Efectos visuales**: Brillos, sombras y animaciones de neón
- **Accesibilidad**: Botones deshabilitados cuando corresponde

## 📁 Estructura del Proyecto

```
TragaPerras/
├── app/
│   ├── components/
│   │   └── SlotMachine.tsx    # Componente principal del tragaperras
│   ├── globals.css            # Estilos globales y animaciones
│   ├── layout.tsx            # Layout principal de la aplicación
│   └── page.tsx              # Página de inicio
├── package.json              # Dependencias y scripts
├── tsconfig.json            # Configuración de TypeScript
└── next.config.js           # Configuración de Next.js
```

## 🎯 Próximas Mejoras

- Efectos de sonido
- Más tipos de bonificaciones
- Historial de partidas
- Diferentes temas visuales
- Modo multijugador

¡Disfruta jugando! 🍀
