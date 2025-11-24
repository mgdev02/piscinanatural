import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiscinaGrid } from '../components/PiscinaGrid';
import { FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Piscina } from '../types/piscina';
import { calculatePPM } from '../utils/chlorineCalculator';

export const WatchPage = () => {
    const navigate = useNavigate();
    const [piscinasData, setPiscinasData] = useState<Piscina[]>([]);

    useEffect(() => {
        // Helper para mapear controladores a objetos Piscina
        const mapControllersToPiscinas = (controllers: any[]): Piscina[] => {
            return controllers
                .filter((ctrl: any) => ctrl.Status !== "Desasociado")
                .map((ctrl: any) => {
                    const getSensorValue = (name: string): number => {
                        const sensor = ctrl.sensors?.find((s: any) => s.SensorName === name);
                        return sensor?.Value !== null && sensor?.Value !== undefined ? Number(sensor.Value) : 0;
                    };

                    const getSensorUpperTh = (name: string): number | undefined => {
                        const sensor = ctrl.sensors?.find((s: any) => s.SensorName === name);
                        return sensor?.UpperTh !== null && sensor?.UpperTh !== undefined ? Number(sensor.UpperTh) : undefined;
                    };

                    const getSensorStatus = (name: string): number => {
                        const sensor = ctrl.sensors?.find((s: any) => s.SensorName === name);
                        return sensor?.Status !== null && sensor?.Status !== undefined ? Number(sensor.Status) : 0;
                    };

                    const flujoStatus = getSensorStatus("Flujo");
                    const tieneFlujo = flujoStatus === 0;
                    const phValue = getSensorValue("pH");
                    const phTarget = getSensorUpperTh("pH");
                    const tempValue = getSensorValue("Temperatura");
                    const orpValue = getSensorValue("Cloro libre");
                    const ppmValue = calculatePPM(phValue, orpValue);

                    return {
                        id: String(ctrl.CtrlId),
                        nombre: ctrl.CtrlName || `Piscina ${ctrl.CtrlId}`,
                        temperatura: tempValue,
                        ph: phValue,
                        cloro: ppmValue,
                        orp: orpValue,
                        targetPh: phTarget,
                        tieneFlujo: tieneFlujo,
                        volumen: ctrl.Volume || 0,
                        online: ctrl.Status === "Conectado",
                        nivelAcidoBajo: false,
                        nivelCloroBajo: false
                    };
                });
        };

        // 1. Carga inicial rápida desde LocalStorage
        const loadFromLocal = () => {
            const userDataStr = localStorage.getItem('user-data');
            if (userDataStr) {
                try {
                    const userData = JSON.parse(userDataStr);
                    if (userData.controllers) {
                        const mapped = mapControllersToPiscinas(userData.controllers);
                        setPiscinasData(mapped);
                    }
                } catch (error) {
                    console.error("Error al cargar datos locales:", error);
                }
            }
        };

        loadFromLocal();

        // 2. Función para refrescar desde Backend
        const refreshData = async () => {
            const token = localStorage.getItem('session-token');
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:8000/refresh-data', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data && response.data.controllers) {
                    const newControllers = response.data.controllers;
                    const mapped = mapControllersToPiscinas(newControllers);
                    setPiscinasData(mapped);

                    // Actualizar LocalStorage preservando datos de usuario
                    const userDataStr = localStorage.getItem('user-data');
                    let newUserData = {};
                    if (userDataStr) {
                        const oldData = JSON.parse(userDataStr);
                        newUserData = { ...oldData, controllers: newControllers };
                    } else {
                        newUserData = { controllers: newControllers };
                    }
                    localStorage.setItem('user-data', JSON.stringify(newUserData));
                }
            } catch (error) {
                console.error("Error refrescando datos:", error);
            }
        };

        // 3. Llamada inicial al backend y configuración del polling
        refreshData(); // Primera actualización real
        const intervalId = setInterval(refreshData, 30000); // Cada 30 seg

        return () => clearInterval(intervalId);
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem('session-token');

        try {
            if (token) {
                await axios.post(
                    'http://localhost:8000/logout',
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            // Limpiar localStorage independientemente del resultado
            localStorage.removeItem('session-token');
            localStorage.removeItem('auth-email');
            localStorage.removeItem('user-data');

            toast.success('Sesión cerrada exitosamente');

            // Redirigir al login después de un breve delay
            setTimeout(() => {
                navigate('/auth', { replace: true });
            }, 500);
        }
    };

    return (
        <div className="app-container">
            <Toaster position="top-center" />

            {/* Header con saludo y logout */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1100,
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                {/* Saludo al usuario */}
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#333'
                }}>
                    ¡Hola, {(() => {
                        const userData = localStorage.getItem('user-data');
                        if (userData) {
                            try {
                                const parsed = JSON.parse(userData);
                                const firstName = parsed.user?.FirstName || 'Usuario';
                                const lastName = parsed.user?.LastName || '';
                                return `${firstName} ${lastName}`.trim();
                            } catch {
                                return 'Usuario';
                            }
                        }
                        return 'Usuario';
                    })()}!
                </div>

                {/* Botón de logout (solo ícono) */}
                <button
                    onClick={handleLogout}
                    title="Cerrar sesión"
                    style={{
                        backgroundColor: '#ff5252',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(255, 82, 82, 0.3)',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff1744';
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 82, 82, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff5252';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 82, 82, 0.3)';
                    }}
                >
                    <FaSignOutAlt />
                </button>
            </div>

            <PiscinaGrid piscinas={piscinasData} />
        </div>
    );
};
