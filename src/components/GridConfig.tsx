import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FaExpand } from 'react-icons/fa6';
import type { GridConfig as GridConfigType } from '../types/grid';
import { LayoutIcon } from './LayoutIcon';

interface GridConfigProps {
  gridConfig: GridConfigType;
  onGridConfigChange: (config: GridConfigType) => void;
  totalPiscinas?: number;
  currentPage?: number;
  piscinasPerPage?: number;
  onToggleFullscreen?: () => void;
  autoRotateEnabled?: boolean;
  autoRotateInterval?: number;
  onToggleAutoRotate?: () => void;
  onChangeAutoRotateInterval?: (interval: number) => void;
}

interface LayoutOption {
  columns: number;
  rows: number;
  label: string;
  minPools: number;
  maxPools: number;
}

const layoutOptions: LayoutOption[] = [
  // 1 piscina
  { columns: 1, rows: 1, label: '1×1', minPools: 1, maxPools: 1 },

  // 2 piscinas
  { columns: 2, rows: 1, label: '2×1', minPools: 2, maxPools: 5 },
  { columns: 1, rows: 2, label: '1×2', minPools: 2, maxPools: 5 },

  // 3 piscinas
  { columns: 3, rows: 1, label: '3×1', minPools: 3, maxPools: 5 },
  { columns: 2, rows: 2, label: '2×2', minPools: 3, maxPools: 5 },

  // 4-5 piscinas
  { columns: 3, rows: 2, label: '3×2', minPools: 4, maxPools: 5 },
  { columns: 2, rows: 3, label: '2×3', minPools: 4, maxPools: 5 },
];

export const GridConfig = ({
  gridConfig,
  onGridConfigChange,
  totalPiscinas = 8,
  currentPage = 0,
  piscinasPerPage = 0,
  onToggleFullscreen,
  autoRotateEnabled = false,
  autoRotateInterval = 30,
  onToggleAutoRotate,
  onChangeAutoRotateInterval
}: GridConfigProps) => {
  const [showConfig, setShowConfig] = useState(false);

  const isActive = (cols: number, rows: number) => {
    return gridConfig.columns === cols && gridConfig.rows === rows;
  };

  // Filtrar layouts apropiados según cantidad de piscinas
  const appropriateLayouts = layoutOptions.filter(
    layout => totalPiscinas >= layout.minPools && totalPiscinas <= layout.maxPools
  );

  // Si no hay layouts apropiados, mostrar todos
  const layoutsToShow = appropriateLayouts.length > 0 ? appropriateLayouts : layoutOptions;

  // Calcular rango de piscinas mostradas en la página actual
  const startPool = currentPage * piscinasPerPage + 1;
  const endPool = Math.min((currentPage + 1) * piscinasPerPage, totalPiscinas);

  // Obtener el label del layout actual
  const currentLayoutLabel = `${gridConfig.columns}×${gridConfig.rows}`;

  return (
    <>
      {/* Branding - Top Left */}
      {/* Branding - Top Left */}
      <div className="branding-container">
        <div className="d-flex align-items-baseline gap-2">
          <h1 className="branding-title">
            Pool Monitor
          </h1>
          <span className="branding-footer" style={{ fontSize: '0.65rem', opacity: 0.8, transform: 'translateY(-2px)' }}>
            by Pool Xpert
          </span>
        </div>
        <span className="branding-subtitle">
          Centro de monitoreo de piscinas
        </span>
      </div>

      {/* Contador de piscinas visibles - centrado arriba con botones */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'nowrap'
        }}
      >
        <button
          className="btn btn-outline-primary"
          style={{
            borderRadius: '20px',
            width: 'auto',
            minWidth: '100px',
            height: '40px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(77, 208, 225, 0.4)',
            backgroundColor: '#ffffff',
            borderColor: '#4dd0e1',
            borderWidth: '2px',
            transition: 'all 0.3s',
            padding: '0 16px',
            gap: '8px'
          }}
          onClick={() => setShowConfig(!showConfig)}
          title="Configurar Vista"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(77, 208, 225, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(77, 208, 225, 0.4)';
          }}
        >
          <div style={{ width: '45px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutIcon
              columns={gridConfig.columns}
              rows={gridConfig.rows}
              active={true}
              totalPools={totalPiscinas}
            />
          </div>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#00bcd4',
            whiteSpace: 'nowrap'
          }}>
            Vista {currentLayoutLabel}
          </span>
        </button>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '8px 20px',
            borderRadius: '20px',
            border: '2px solid #4dd0e1',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#00bcd4',
            whiteSpace: 'nowrap'
          }}
        >
          Mostrando <strong>{startPool}-{endPool}</strong> de <strong>{totalPiscinas}</strong> piscinas
        </div>

        {onToggleFullscreen && (
          <button
            className="btn btn-outline-primary"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              color: '#00bcd4',
              border: '2px solid #4dd0e1',
              boxShadow: '0 4px 12px rgba(77, 208, 225, 0.4)',
              transition: 'all 0.3s'
            }}
            onClick={onToggleFullscreen}
            title="Pantalla Completa"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(77, 208, 225, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(77, 208, 225, 0.4)';
            }}
          >
            <FaExpand size={20} />
          </button>
        )}

        {onToggleAutoRotate && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              padding: '6px 12px',
              borderRadius: '20px',
              border: '2px solid #4dd0e1',
              boxShadow: '0 4px 12px rgba(77, 208, 225, 0.4)'
            }}
          >
            <span style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#00bcd4',
              whiteSpace: 'nowrap'
            }}>
              Autorotación
            </span>

            {/* Toggle Switch */}
            <label
              style={{
                position: 'relative',
                display: 'inline-block',
                width: '44px',
                height: '24px',
                margin: 0,
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={autoRotateEnabled}
                onChange={onToggleAutoRotate}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: autoRotateEnabled ? '#00bcd4' : '#ccc',
                  transition: '0.3s',
                  borderRadius: '24px'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    content: '',
                    height: '18px',
                    width: '18px',
                    left: autoRotateEnabled ? '23px' : '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    transition: '0.3s',
                    borderRadius: '50%'
                  }}
                />
              </span>
            </label>

            {/* Time Selector - Only visible when enabled */}
            {autoRotateEnabled && (
              <select
                value={autoRotateInterval}
                onChange={(e) => onChangeAutoRotateInterval?.(Number(e.target.value))}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  color: '#00bcd4',
                  border: '1px solid #4dd0e1',
                  borderRadius: '12px',
                  padding: '4px 8px',
                  backgroundColor: '#f0f9fa',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>1min</option>
                <option value={120}>2min</option>
                <option value={300}>5min</option>
              </select>
            )}
          </div>
        )}
      </div>

      {showConfig && (
        <div
          className="position-fixed bg-white border rounded shadow-lg p-4"
          style={{
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1050,
            minWidth: '320px',
            maxWidth: '400px',
            maxHeight: '80vh',
            overflowY: 'auto',
            borderColor: '#4dd0e1',
            borderWidth: '2px'
          }}
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-bold" style={{ fontSize: '1.3rem', color: '#00bcd4' }}>
              Configurar Vista
            </h5>
            <button
              className="btn btn-sm"
              onClick={() => setShowConfig(false)}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#666',
                fontSize: '1.2rem',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaTimes />
            </button>
          </div>

          {/* Layouts disponibles */}
          <div>
            <label className="form-label mb-2 fw-semibold" style={{ fontSize: '1rem', color: '#555' }}>
              Seleccionar Layout:
            </label>
            <div className="d-flex flex-column gap-2">
              {layoutsToShow.map((layout) => {
                const active = isActive(layout.columns, layout.rows);
                return (
                  <button
                    key={`${layout.columns}x${layout.rows}`}
                    type="button"
                    className={`btn ${active ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => {
                      onGridConfigChange({ columns: layout.columns, rows: layout.rows });
                      setShowConfig(false);
                    }}
                    style={{
                      fontSize: '1rem',
                      padding: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      justifyContent: 'flex-start',
                      transition: 'all 0.2s',
                      borderWidth: '2px',
                      fontWeight: active ? '600' : '500'
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = '#4dd0e1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = '';
                      }
                    }}
                  >
                    <div style={{ width: '60px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <LayoutIcon
                        columns={layout.columns}
                        rows={layout.rows}
                        active={active}
                        totalPools={totalPiscinas}
                      />
                    </div>
                    <span>{layout.label}</span>
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '0.85rem',
                      opacity: 0.7
                    }}>
                      ({layout.columns * layout.rows} espacios)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showConfig && (
        <div
          className="position-fixed"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }}
          onClick={() => setShowConfig(false)}
        />
      )}
    </>
  );
};
