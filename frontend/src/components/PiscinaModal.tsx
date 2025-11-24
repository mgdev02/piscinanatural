import { useEffect } from 'react';
import { Piscina } from '../types/piscina';
import { FaThermometerHalf, FaFlask, FaTint } from 'react-icons/fa';

interface PiscinaModalProps {
  piscina: Piscina | null;
  show: boolean;
  onClose: () => void;
}

export const PiscinaModal = ({ piscina, show, onClose }: PiscinaModalProps) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!piscina) return null;

  const getTemperaturaColor = (temp: number) => {
    if (temp >= 30) return 'text-danger';
    if (temp >= 25) return 'text-warning';
    return 'text-info';
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

  return (
    <>
      {show && (
        <div 
          className="modal fade show"
          style={{ display: 'block' }}
          tabIndex={-1}
          onClick={onClose}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title fw-bold" style={{ fontSize: '2rem' }}>{piscina.nombre}</h2>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={onClose}
                  aria-label="Close"
                  style={{ fontSize: '1.5rem' }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center">
                        <FaThermometerHalf className={`mb-3 ${getTemperaturaColor(piscina.temperatura)}`} style={{ fontSize: '3rem' }} />
                        <h4 className="card-title" style={{ fontSize: '1.5rem' }}>Temperatura</h4>
                        <h1 className={`fw-bold ${getTemperaturaColor(piscina.temperatura)}`} style={{ fontSize: '3.5rem' }}>
                          {piscina.temperatura}°C
                        </h1>
                        <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>Rango óptimo: 25-30°C</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center">
                        <FaFlask className={`mb-3 ${getPhColor(piscina.ph)}`} style={{ fontSize: '3rem' }} />
                        <h4 className="card-title" style={{ fontSize: '1.5rem' }}>pH</h4>
                        <h1 className={`fw-bold ${getPhColor(piscina.ph)}`} style={{ fontSize: '3.5rem' }}>
                          {piscina.ph}
                        </h1>
                        <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>Rango óptimo: 7.2-7.6</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center">
                        <FaTint className={`mb-3 ${getCloroColor(piscina.cloro)}`} style={{ fontSize: '3rem' }} />
                        <h4 className="card-title" style={{ fontSize: '1.5rem' }}>Cloro</h4>
                        <h1 className={`fw-bold ${getCloroColor(piscina.cloro)}`} style={{ fontSize: '3.5rem' }}>
                          {piscina.cloro} ppm
                        </h1>
                        <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>Rango óptimo: 1.0-2.0 ppm</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="mb-3" style={{ fontSize: '1.5rem' }}>Información General</h4>
                  <p className="text-muted" style={{ fontSize: '1.2rem' }}>
                    Esta piscina está siendo monitoreada en tiempo real. Los valores mostrados 
                    reflejan el estado actual del agua. Se recomienda mantener los parámetros 
                    dentro de los rangos óptimos para garantizar la calidad del agua.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose} style={{ fontSize: '1.2rem', padding: '0.75rem 1.5rem' }}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {show && <div className="modal-backdrop fade show" onClick={onClose}></div>}
    </>
  );
};

