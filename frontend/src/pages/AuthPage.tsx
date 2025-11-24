import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            toast.error('Por favor ingresa un correo válido');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/check-user', {
                email: email
            });

            if (response.data.exists) {
                toast.success('¡Usuario encontrado!');

                // Guardar token de sesión
                if (response.data.token) {
                    localStorage.setItem('session-token', response.data.token);
                }

                localStorage.setItem('auth-email', email);

                if (response.data.data) {
                    localStorage.setItem('user-data', JSON.stringify(response.data.data));
                }

                // Navegar directamente como se solicitó, saltando contraseña por ahora
                setTimeout(() => {
                    navigate('/watch');
                }, 1000);
            } else {
                toast.error('Tu correo no se encuentra registrado en la app Pool Xpert');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                padding: '20px'
            }}
        >
            <Toaster position="top-center" />
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    padding: '48px',
                    maxWidth: '440px',
                    width: '100%',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    position: 'relative'
                }}
            >
                {/* Logo/Branding */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: '2rem',
                            fontWeight: '800',
                            background: 'linear-gradient(45deg, #00bcd4, #2196f3)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '8px'
                        }}
                    >
                        Pool Monitor
                    </h1>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                        Centro de monitoreo de piscinas
                    </p>
                </div>

                {/* Email Step */}
                <form onSubmit={handleEmailSubmit}>
                    <div style={{ marginBottom: '24px' }}>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#333',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}
                        >
                            Correo electrónico
                        </label>
                        <div style={{ position: 'relative' }}>
                            <FaEnvelope
                                style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#00bcd4',
                                    fontSize: '1.1rem'
                                }}
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    borderRadius: '12px',
                                    border: '2px solid #e0e0e0',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    boxSizing: 'border-box',
                                    backgroundColor: loading ? '#f5f5f5' : 'white'
                                }}
                                onFocus={(e) => {
                                    if (!loading) {
                                        e.target.style.borderColor = '#00bcd4';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 188, 212, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: loading ? '#ccc' : '#00bcd4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: loading ? 'none' : '0 4px 12px rgba(0, 188, 212, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = '#00acc1';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 188, 212, 0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = '#00bcd4';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 188, 212, 0.3)';
                            }
                        }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                                Verificando...
                            </span>
                        ) : (
                            'Continuar'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
