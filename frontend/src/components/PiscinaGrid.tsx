import { useState, useEffect } from 'react';
import type { Piscina } from '../types/piscina';
import type { GridConfig as GridConfigType } from '../types/grid';
import { PiscinaCard } from './PiscinaCard';
import { PiscinaModal } from './PiscinaModal';
import { GridConfig } from './GridConfig';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface PiscinaGridProps {
  piscinas: Piscina[];
}

const GRID_CONFIG_KEY = 'piscina-grid-config';

const defaultGrid: GridConfigType = { columns: 2, rows: 1 };

export const PiscinaGrid = ({ piscinas }: PiscinaGridProps) => {
  const [selectedPiscina, setSelectedPiscina] = useState<Piscina | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModalToast, setShowModalToast] = useState(false);
  const [gridConfig, setGridConfig] = useState<GridConfigType>(() => {
    const saved = localStorage.getItem(GRID_CONFIG_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultGrid;
      }
    }
    return defaultGrid;
  });
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(false);
  const [autoRotateInterval, setAutoRotateInterval] = useState(30); // seconds

  useEffect(() => {
    localStorage.setItem(GRID_CONFIG_KEY, JSON.stringify(gridConfig));
  }, [gridConfig]);

  // Resetear página cuando cambia el layout
  useEffect(() => {
    setCurrentPage(0);
  }, [gridConfig.columns, gridConfig.rows]);

  // Navegación con teclado y ESC para salir de fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        setIsFullscreen(false);
        return;
      }

      if (showModal || isFullscreen) return; // No navegar si el modal está abierto o en fullscreen

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, gridConfig, showModal, piscinas.length, isFullscreen]);

  // Calcular paginación
  const maxPiscinas = gridConfig.columns * gridConfig.rows;
  const totalPages = Math.ceil(piscinas.length / maxPiscinas);
  const startIndex = currentPage * maxPiscinas;
  const endIndex = startIndex + maxPiscinas;
  const piscinasMostradas = piscinas.slice(startIndex, endIndex);

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotateEnabled || totalPages <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentPage((prev) => {
        const nextPage = prev + 1;
        return nextPage >= totalPages ? 0 : nextPage;
      });
    }, autoRotateInterval * 1000);

    return () => clearInterval(intervalId);
  }, [autoRotateEnabled, autoRotateInterval, totalPages]);

  const handleCardClick = (piscina: Piscina) => {
    if (isFullscreen) {
      setShowModalToast(true);
      setTimeout(() => setShowModalToast(false), 3000);
      return;
    }
    setSelectedPiscina(piscina);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPiscina(null);
  };



  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleToggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error entering fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error exiting fullscreen:', err);
      }
    }
  };

  // Listen for fullscreen changes (when user presses ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const showPagination = totalPages > 1;

  return (
    <>
      {!isFullscreen && (
        <GridConfig
          gridConfig={gridConfig}
          onGridConfigChange={setGridConfig}
          totalPiscinas={piscinas.length}
          currentPage={currentPage}
          piscinasPerPage={maxPiscinas}
          onToggleFullscreen={handleToggleFullscreen}
          {...(showPagination && {
            autoRotateEnabled,
            autoRotateInterval,
            onToggleAutoRotate: () => setAutoRotateEnabled(!autoRotateEnabled),
            onChangeAutoRotateInterval: setAutoRotateInterval
          })}
        />
      )}

      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Grid de Piscinas */}
        <div
          className={`monitor-grid grid-${gridConfig.columns}x${gridConfig.rows}`}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
            gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
            gap: '3px',
            position: isFullscreen ? 'fixed' : 'relative',
            top: isFullscreen ? 0 : 'auto',
            left: isFullscreen ? 0 : 'auto',
            width: isFullscreen ? '100vw' : undefined,
            height: isFullscreen
              ? '100vh'
              : showPagination
                ? 'calc(100vh - 160px)'
                : 'calc(100vh - 90px)',
            zIndex: isFullscreen ? 2000 : 'auto',
            backgroundColor: isFullscreen ? '#000' : 'transparent',
            margin: isFullscreen
              ? 0
              : showPagination
                ? '75px 5px 80px 5px'
                : '75px 5px 10px 5px',
            padding: isFullscreen ? 0 : undefined,
            boxSizing: 'border-box'
          }}
          onDoubleClick={async () => {
            if (isFullscreen && document.fullscreenElement) {
              await document.exitFullscreen();
            }
          }}
        >
          {piscinasMostradas.map((piscina) => (
            <PiscinaCard
              key={piscina.id}
              piscina={piscina}
              onClick={() => handleCardClick(piscina)}
              layout={`${gridConfig.columns}x${gridConfig.rows}`}
              isFullscreen={isFullscreen}
            />
          ))}
        </div>

        {/* Paginación inferior */}
        {!isFullscreen && showPagination && (
          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            {/* Flecha Izquierda */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px solid #4dd0e1',
                backgroundColor: currentPage === 0 ? '#f5f5f5' : '#ffffff',
                color: currentPage === 0 ? '#ccc' : '#00bcd4',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.2s',
                opacity: currentPage === 0 ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (currentPage > 0) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.backgroundColor = '#e0f7fa';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <IoIosArrowBack />
            </button>

            {/* Números de página */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: index === currentPage ? '2px solid #00bcd4' : '2px solid #e0e0e0',
                    backgroundColor: index === currentPage ? '#00bcd4' : '#ffffff',
                    color: index === currentPage ? '#ffffff' : '#666',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: index === currentPage ? '700' : '500',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (index !== currentPage) {
                      e.currentTarget.style.backgroundColor = '#e0f7fa';
                      e.currentTarget.style.borderColor = '#4dd0e1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== currentPage) {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Flecha Derecha */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px solid #4dd0e1',
                backgroundColor: currentPage === totalPages - 1 ? '#f5f5f5' : '#ffffff',
                color: currentPage === totalPages - 1 ? '#ccc' : '#00bcd4',
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.2s',
                opacity: currentPage === totalPages - 1 ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (currentPage < totalPages - 1) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.backgroundColor = '#e0f7fa';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <IoIosArrowForward />
            </button>
          </div>
        )}
      </div>

      <PiscinaModal
        piscina={selectedPiscina}
        show={showModal}
        onClose={handleCloseModal}
      />



      {showModalToast && isFullscreen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            zIndex: 3001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            animation: 'fadeIn 0.2s ease-in-out',
            pointerEvents: 'none',
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}
        >
          Sal del modo pantalla completa para ver detalles
        </div>
      )}
    </>
  );
};
