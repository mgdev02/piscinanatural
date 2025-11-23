import type { Piscina } from '../types/piscina';
import { FaThermometerHalf, FaTint } from 'react-icons/fa';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { TbDropletPause } from 'react-icons/tb';
import poolBg from '../assets/pool_bg.png';
import tankImage from '../assets/tank.png';

const TankLevel = ({ label, image, isLow, scale = 1 }: { label: string, image: string, isLow: boolean, scale?: number }) => (
  <div className="d-flex flex-column align-items-center justify-content-center p-1">
    <div className="d-flex align-items-center gap-3">
      <div
        style={{
          width: `${50 * scale}px`,
          height: `${50 * scale}px`,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: `2px solid ${isLow ? '#ff9800' : '#4caf50'}`
        }}
      >
        <img src={image} alt={label} style={{ width: `${28 * scale}px`, height: 'auto' }} />
      </div>
      <div className="d-flex flex-column">
        <span style={{ fontSize: `${0.85 * scale}rem`, fontWeight: '700', color: isLow ? '#f57c00' : '#2e7d32' }}>
          {isLow ? 'BAJO' : 'OK'}
        </span>
        <span style={{ fontSize: `${0.7 * scale}rem`, color: '#888' }}>Nivel</span>
      </div>
    </div>
    <span style={{ fontSize: `${0.75 * scale}rem`, color: '#666', fontWeight: '700', marginTop: '6px', textTransform: 'uppercase' }}>
      {label}
    </span>
  </div>
);



interface PiscinaCardProps {
  piscina: Piscina;
  onClick: () => void;
  layout?: string;
  isFullscreen?: boolean;
}

export const PiscinaCard = ({ piscina, onClick, layout, isFullscreen }: PiscinaCardProps) => {
  const getTemperaturaColor = (temp: number) => {
    if (temp >= 30) return 'text-danger';
    if (temp >= 25) return 'text-warning';
    return 'text-info';
  };

  const getTemperaturaIconColor = (temp: number): string => {
    if (temp >= 25 && temp < 30) return '#28a745'; // Verde
    if (temp >= 20 && temp < 25) return '#ff9800'; // Naranja
    if (temp >= 30) return '#dc3545'; // Rojo
    return '#ff9800'; // Naranja por defecto
  };

  const getPhColor = (ph: number) => {
    if (ph >= 7.2 && ph <= 7.6) return 'text-success';
    if (ph >= 7.0 && ph < 7.2) return 'text-warning';
    if (ph > 7.6 && ph <= 7.8) return 'text-warning';
    return 'text-danger';
  };

  const getCloroColor = (cloro: number) => {
    if (cloro >= 1.0 && cloro <= 2.0) return 'text-success';
    if (cloro >= 0.8 && cloro < 1.0) return 'text-warning';
    if (cloro > 2.0 && cloro <= 2.5) return 'text-warning';
    return 'text-danger';
  };

  // Seleccionar imagen de fondo basada en el ID de la piscina para que sea consistente

  const isCompactLayout = layout === '3x2';
  const isVeryCompact = layout === '2x3';
  const isVerticalLayout = layout === '1x2' || layout === '2x2' || layout === '3x2' || layout === '2x3';

  const sideElementsTop = isVerticalLayout ? '60%' : '45%';

  let sideScale = 1;
  if (isCompactLayout) sideScale = 0.95;
  if (isVeryCompact) sideScale = 0.75;
  if (isFullscreen && layout === '2x1') sideScale = 1.15;
  if (isFullscreen && layout === '1x2') sideScale = 1.2;
  if (isFullscreen && layout === '2x3') sideScale = 1.1;

  const sideElementsTransform = `translateY(-50%) scale(${sideScale})`;

  let volumeTop = '50%';
  if (isVeryCompact) volumeTop = '40%';
  if (isCompactLayout && !isFullscreen) volumeTop = '48%';
  if (isCompactLayout && isFullscreen) volumeTop = '40%';

  let volumeLeft = '50%';
  if (isCompactLayout && !isFullscreen) volumeLeft = '45%';

  let volumeTextLeft = '50%';
  if (isCompactLayout && !isFullscreen) volumeTextLeft = '68%';

  let volumeWidth = isVeryCompact ? '25%' : (isCompactLayout ? '35%' : '45%');
  if (isFullscreen && layout === '2x1') volumeWidth = '50%';
  if (isFullscreen && layout === '1x2') volumeWidth = '55%';
  if (isFullscreen && layout === '3x2') volumeWidth = '50%';
  if (isFullscreen && layout === '2x3') volumeWidth = '35%';

  // Image scale based on layout
  let imageScale = '120%';
  if (isCompactLayout && !isFullscreen) imageScale = '140%';
  if (layout === '2x2' && !isFullscreen) imageScale = '105%';

  const badgeFontSize = isVeryCompact ? '0.7rem' : (isCompactLayout ? '0.8rem' : 'clamp(0.75rem, 1.5vw, 1rem)');
  const badgePadding = isVeryCompact ? '3px 8px' : (isCompactLayout ? '5px 10px' : 'clamp(0.3rem, 0.8vw, 0.5rem) clamp(0.5rem, 1vw, 0.75rem)');
  const titleFontSize = isVeryCompact ? '0.8rem' : (isCompactLayout ? '0.9rem' : 'clamp(0.9rem, 1.5vw, 1.1rem)');
  const tanksGap = isVeryCompact ? '20px' : '8px';

  let mainContainerPadding = 'clamp(0.5rem, 1.5vw, 1rem)';
  if (layout === '2x2' && !isFullscreen) mainContainerPadding = 'clamp(0.5rem, 1.5vw, 1rem) clamp(0.5rem, 1.5vw, 1rem) 0px clamp(0.5rem, 1.5vw, 1rem)';

  // Fullscreen size adjustments
  const isFullscreen2x1 = isFullscreen && layout === '2x1';
  const isFullscreen1x2 = isFullscreen && layout === '1x2';
  const isFullscreen3x2 = isFullscreen && layout === '3x2';
  const isFullscreen2x3 = isFullscreen && layout === '2x3';
  const fsMultiplier = isFullscreen2x1 ? 1.15 : 1;
  const tankScale = isFullscreen1x2 ? 1.15 : (isFullscreen2x3 ? 1.2 : 1);

  // Override badge sizes for fullscreen 3x2
  const finalBadgeFontSize = isFullscreen3x2 ? '0.9rem' : (isFullscreen2x3 ? '0.85rem' : badgeFontSize);
  const finalBadgePadding = isFullscreen3x2 ? '6px 12px' : (isFullscreen2x3 ? '5px 10px' : badgePadding);
  const finalTitleFontSize = isFullscreen3x2 ? '1rem' : (isFullscreen2x3 ? '0.95rem' : titleFontSize);

  return (
    <div
      className="camera-monitor-card"
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f0f4f8 100%)',
        minHeight: '200px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}
      onClick={onClick}
    >
      {/* Card Header: Last Sync */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3
        }}
      >
        <span style={{ fontSize: `${0.7 * fsMultiplier}rem`, color: '#888', fontWeight: '500' }}>
          Últ. sincronización: {new Date().toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>

      {/* Indicador de flujo de agua */}
      <div
        className="position-absolute end-0 m-2"
        style={{ zIndex: 2, top: '24px' }}
      >
        <span
          style={{
            fontSize: finalBadgeFontSize,
            padding: finalBadgePadding,
            backgroundColor: piscina.tieneFlujo ? 'rgba(33, 150, 243, 0.85)' : 'rgba(255, 152, 0, 0.85)',
            color: 'white',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            fontWeight: '600',
            backdropFilter: 'blur(4px)',
            whiteSpace: 'nowrap'
          }}
        >
          {piscina.tieneFlujo ? (
            <PiArrowsClockwiseBold className="me-1 spin-animation" style={{ fontSize: `clamp(${0.8 * fsMultiplier}rem, 1.5vw, ${1.1 * fsMultiplier}rem)` }} />
          ) : (
            <TbDropletPause className="me-1" style={{ fontSize: `clamp(${0.8 * fsMultiplier}rem, 1.5vw, ${1.1 * fsMultiplier}rem)` }} />
          )}
          {piscina.tieneFlujo ? 'Agua en circulación' : 'Agua en reposo'}
        </span>
      </div>

      {/* Nombre de la piscina */}
      <div
        className="position-absolute p-2"
        style={{
          zIndex: 2,
          right: '100px',
          left: '3.5rem',
          overflow: 'hidden',
          top: '24px'
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 188, 212, 0.9)',
            padding: finalBadgePadding,
            borderRadius: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            maxWidth: '100%'
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: piscina.online ? '#4caf50' : '#f44336',
              border: '2px solid white',
              boxShadow: `0 0 6px ${piscina.online ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)'}`,
              flexShrink: 0
            }}
            title={piscina.online ? 'Online' : 'Offline'}
          />
          <h4
            className="text-white mb-0 fw-bold"
            style={{
              fontSize: finalTitleFontSize,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              margin: 0,
              letterSpacing: '0.5px',
              ...(layout === '3x1' && { maxWidth: '140px' })
            }}
            title={piscina.nombre}
          >
            {piscina.nombre}
          </h4>
        </div>
      </div>

      {/* Pool background image with volume text */}
      <div
        style={{
          position: 'absolute',
          top: volumeTop,
          left: volumeLeft,
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          width: volumeWidth,
          maxWidth: '300px'
        }}
      >
        <img
          src={poolBg}
          alt="Pool"
          style={{
            width: imageScale,
            height: 'auto',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.35))'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: volumeTextLeft,
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
            fontWeight: '700',
            color: '#ffffff',
            whiteSpace: 'nowrap',
            lineHeight: 1,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 188, 212, 0.4)'
          }}
        >
          {piscina.volumen.toLocaleString()} L
        </div>
      </div>



      {/* pH Vertical Bar */}
      <div
        style={{
          position: 'absolute',
          left: '10px',
          top: sideElementsTop,
          transform: sideElementsTransform,
          transformOrigin: 'left center',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '12px 6px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.8)',
          minWidth: '45px'
        }}
      >
        <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: '700', marginBottom: '6px' }}>
          pH
        </span>

        {/* Barra Gradiente */}
        <div
          style={{
            height: '80px',
            width: '8px',
            borderRadius: '4px',
            background: 'linear-gradient(to top, #f44336 0%, #ffeb3b 40%, #4caf50 50%, #2196f3 80%, #673ab7 100%)',
            position: 'relative',
            margin: '0 0 6px 0'
          }}
        >
          {/* Marca Objetivo (Target) */}
          {piscina.targetPh && (
            <div
              style={{
                position: 'absolute',
                bottom: `${Math.min(Math.max(((piscina.targetPh - 6) / 3) * 100, 0), 100)}%`,
                left: '-4px',
                width: '16px',
                height: '2px',
                backgroundColor: '#333',
                zIndex: 1
              }}
              title={`Objetivo: ${piscina.targetPh}`}
            />
          )}

          {/* Indicador Actual (Thumb) */}
          <div
            style={{
              position: 'absolute',
              bottom: `${Math.min(Math.max(((piscina.ph - 6) / 3) * 100, 0), 100)}%`,
              left: '50%',
              transform: 'translate(-50%, 50%)', // Centrado verticalmente en el punto
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: '3px solid #333',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 2,
              transition: 'bottom 0.3s ease'
            }}
          />
        </div>

        <span className={`fw-bold ${getPhColor(piscina.ph)}`} style={{ fontSize: '0.9rem', lineHeight: '1' }}>
          {piscina.ph}
        </span>

        {piscina.targetPh && (
          <div style={{
            marginTop: '4px',
            borderTop: '1px solid #ddd',
            paddingTop: '4px',
            width: '100%',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.6rem', color: '#888', display: 'block', lineHeight: '1' }}>
              Obj
            </span>
            <span style={{ fontSize: '0.75rem', color: '#555', fontWeight: '600' }}>
              {piscina.targetPh}
            </span>
          </div>
        )}
      </div>

      {/* Right Sidebar: Temp & ORP */}
      <div
        style={{
          position: 'absolute',
          right: '10px',
          top: sideElementsTop,
          transform: sideElementsTransform,
          transformOrigin: 'right center',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {/* Temperatura */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '8px 6px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.8)',
            minWidth: '45px'
          }}
        >
          <FaThermometerHalf style={{ fontSize: '1rem', color: getTemperaturaIconColor(piscina.temperatura), marginBottom: '4px' }} />
          <span className="text-dark fw-bold" style={{ fontSize: '0.9rem', lineHeight: '1' }}>{piscina.temperatura}°</span>
          <span style={{ fontSize: '0.6rem', color: '#666', marginTop: '2px', fontWeight: '600' }}>TEMP</span>
        </div>

        {/* ORP */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '8px 6px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.8)',
            minWidth: '45px'
          }}
        >
          <FaTint style={{ fontSize: '1rem', color: '#ff9800', marginBottom: '4px' }} />
          <span className="fw-bold text-dark" style={{ fontSize: '0.9rem', lineHeight: '1' }}>
            {piscina.orp || 0}
          </span>
          <span style={{ fontSize: '0.6rem', color: '#666', marginTop: '2px', fontWeight: '600' }}>mV</span>
          <span style={{ fontSize: '0.55rem', color: '#888', marginTop: '2px', borderTop: '1px solid #eee', paddingTop: '2px', width: '100%', textAlign: 'center' }}>
            {piscina.cloro}ppm
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div
        className="h-100 d-flex flex-column justify-content-end"
        style={{
          zIndex: 2,
          position: 'relative',
          padding: mainContainerPadding
        }}
      >
        {/* Información de Tanques (Bottom Grid) */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: tanksGap,
            padding: '5px 10px'
          }}
        >
          <TankLevel label="Tanque Ácido" image={tankImage} isLow={piscina.nivelAcidoBajo} scale={tankScale} />
          <TankLevel label="Tanque Cloro" image={tankImage} isLow={piscina.nivelCloroBajo} scale={tankScale} />
        </div>
      </div>

    </div >
  );
};

