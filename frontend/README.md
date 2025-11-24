# Sistema de Monitoreo de Piscinas

Aplicación web desarrollada con React + TypeScript + Vite para el monitoreo en tiempo real de parámetros de calidad del agua en piscinas.

## Características

- **Vista tipo cámaras de monitoreo**: Cuadrícula responsiva que muestra múltiples piscinas simultáneamente
- **Diseño responsivo**: Se adapta automáticamente al tamaño de la pantalla usando Bootstrap
- **Vista expandida**: Modal con información detallada de cada piscina al hacer clic
- **Indicadores visuales**: Colores que indican el estado de cada parámetro (temperatura, pH, cloro)
- **Iconos**: Utiliza react-icons para una mejor experiencia visual

## Parámetros monitoreados

- **Temperatura del agua**: Rango óptimo 25-30°C
- **pH del agua**: Rango óptimo 7.2-7.6
- **Cloro del agua**: Rango óptimo 1.0-2.0 ppm

## Tecnologías utilizadas

- React 19
- TypeScript
- Vite
- Bootstrap 5
- React Icons

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Construcción

```bash
npm run build
```

## Estructura del proyecto

```
src/
├── components/
│   ├── PiscinaCard.tsx      # Tarjeta individual de piscina
│   ├── PiscinaGrid.tsx      # Cuadrícula de piscinas
│   └── PiscinaModal.tsx     # Modal de vista expandida
├── data/
│   └── piscinas.ts          # Datos de ejemplo
├── types/
│   └── piscina.ts           # Tipos TypeScript
├── App.tsx                  # Componente principal
└── main.tsx                 # Punto de entrada
```

## Diseño responsivo

La aplicación se adapta automáticamente según el tamaño de pantalla:
- **Móvil (xs)**: 1 columna
- **Tablet (sm)**: 2 columnas
- **Tablet grande (md)**: 3 columnas
- **Desktop (lg)**: 4 columnas
- **Desktop grande (xl)**: 6 columnas
