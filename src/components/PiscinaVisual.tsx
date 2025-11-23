interface PiscinaVisualProps {
  volumen: number;
}

export const PiscinaVisual = ({ volumen }: PiscinaVisualProps) => {
  // Normalizar el volumen para el tamaño visual (rango aproximado: 20000 - 150000 litros)
  const minVolumen = 20000;
  const maxVolumen = 150000;
  const normalizedVolumen = Math.max(0, Math.min(1, (volumen - minVolumen) / (maxVolumen - minVolumen)));
  
  // Tamaño base y escala según volumen (40% a 100% del tamaño base)
  const baseSize = 120;
  const minSize = baseSize * 0.4;
  const maxSize = baseSize;
  const size = minSize + (maxSize - minSize) * normalizedVolumen;
  
  // Profundidad visual (efecto 3D)
  const depth = size * 0.3;
  
  return (
    <div 
      className="d-flex align-items-center justify-content-center"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        opacity: 0.7
      }}
    >
      <svg
        width={size + depth}
        height={size + depth}
        viewBox={`0 0 ${size + depth} ${size + depth}`}
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
      >
        {/* Sombra de profundidad (efecto 3D) */}
        <ellipse
          cx={(size + depth) / 2 + depth * 0.3}
          cy={(size + depth) / 2 + depth * 0.3}
          rx={size / 2 * 0.9}
          ry={size / 4 * 0.9}
          fill="rgba(0,0,0,0.2)"
        />
        
        {/* Piscina vista desde arriba (forma ovalada) */}
        <ellipse
          cx={(size + depth) / 2}
          cy={(size + depth) / 2}
          rx={size / 2}
          ry={size / 2.5}
          fill="url(#poolGradient)"
          stroke="#26c6da"
          strokeWidth="2"
        />
        
        {/* Borde interno */}
        <ellipse
          cx={(size + depth) / 2}
          cy={(size + depth) / 2}
          rx={size / 2 * 0.85}
          ry={size / 2.5 * 0.85}
          fill="none"
          stroke="#00bcd4"
          strokeWidth="1.5"
          opacity="0.6"
        />
        
        {/* Ondas de agua */}
        <ellipse
          cx={(size + depth) / 2}
          cy={(size + depth) / 2 - size * 0.1}
          rx={size / 2 * 0.7}
          ry={size / 2.5 * 0.7}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.4"
        />
        <ellipse
          cx={(size + depth) / 2}
          cy={(size + depth) / 2 + size * 0.1}
          rx={size / 2 * 0.6}
          ry={size / 2.5 * 0.6}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.3"
        />
        
        {/* Gradiente para el agua */}
        <defs>
          <linearGradient id="poolGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4dd0e1" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#26c6da" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00bcd4" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

