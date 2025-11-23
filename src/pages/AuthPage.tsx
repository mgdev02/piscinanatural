import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaKey, FaLock } from 'react-icons/fa';

const VALID_CODE = 'abj23';
const POOL_XPERT_PASSWORD = 'poolxpert2024';

type AuthMethod = 'code' | 'password';
type Step = 'email' | 'auth';

export const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState<Step>('email');
    const [authMethod, setAuthMethod] = useState<AuthMethod>('code');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setError('Por favor ingresa un correo válido');
            return;
        }
        setError('');
        setStep('auth');
    };

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code !== VALID_CODE) {
            setError('Código incorrecto. Intenta nuevamente.');
            return;
        }
        setError('');
        localStorage.setItem('auth-email', email);
        navigate('/watch');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== POOL_XPERT_PASSWORD) {
            setError('Contraseña incorrecta. Intenta nuevamente.');
            return;
        }
        setError('');
        localStorage.setItem('auth-email', email);
        navigate('/watch');
    };

    const resetAuth = () => {
        setStep('email');
        setCode('');
        setPassword('');
        setError('');
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
                {step === 'email' && (
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
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px 14px 48px',
                                        borderRadius: '12px',
                                        border: '2px solid #e0e0e0',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#00bcd4';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 188, 212, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e0e0e0';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        {error && (
                            <div
                                style={{
                                    padding: '12px',
                                    backgroundColor: '#fee',
                                    color: '#c33',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    marginBottom: '16px'
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: '#00bcd4',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(0, 188, 212, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#00acc1';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 188, 212, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#00bcd4';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 188, 212, 0.3)';
                            }}
                        >
                            Continuar
                        </button>
                    </form>
                )}

                {/* Auth Step - Method Selection + Form */}
                {step === 'auth' && (
                    <>
                        <button
                            type="button"
                            onClick={resetAuth}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#00bcd4',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                marginBottom: '20px',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            ← Cambiar correo
                        </button>

                        {/* Auth Method Tabs */}
                        <div
                            style={{
                                display: 'flex',
                                gap: '8px',
                                marginBottom: '24px',
                                backgroundColor: '#f5f5f5',
                                padding: '4px',
                                borderRadius: '12px'
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setAuthMethod('code');
                                    setError('');
                                }}
                                style={{
                                    flex: 1,
                                    padding: '10px 16px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    backgroundColor: authMethod === 'code' ? '#00bcd4' : 'transparent',
                                    color: authMethod === 'code' ? 'white' : '#666',
                                    boxShadow: authMethod === 'code' ? '0 2px 8px rgba(0, 188, 212, 0.3)' : 'none'
                                }}
                            >
                                Código
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setAuthMethod('password');
                                    setError('');
                                }}
                                style={{
                                    flex: 1,
                                    padding: '10px 16px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    backgroundColor: authMethod === 'password' ? '#00bcd4' : 'transparent',
                                    color: authMethod === 'password' ? 'white' : '#666',
                                    boxShadow: authMethod === 'password' ? '0 2px 8px rgba(0, 188, 212, 0.3)' : 'none'
                                }}
                            >
                                Pool Xpert
                            </button>
                        </div>

                        {/* Code Authentication Form */}
                        {authMethod === 'code' && (
                            <form onSubmit={handleCodeSubmit}>
                                <div style={{ marginBottom: '24px' }}>
                                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>
                                        Ingresa el código de verificación que enviamos a <strong>{email}</strong>
                                    </p>
                                    <label
                                        style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            color: '#333',
                                            fontWeight: '600',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Código de verificación
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <FaKey
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
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder="Ingresa el código"
                                            style={{
                                                width: '100%',
                                                padding: '14px 16px 14px 48px',
                                                borderRadius: '12px',
                                                border: '2px solid #e0e0e0',
                                                fontSize: '1rem',
                                                outline: 'none',
                                                transition: 'all 0.2s',
                                                boxSizing: 'border-box',
                                                letterSpacing: '2px'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#00bcd4';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(0, 188, 212, 0.1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#e0e0e0';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                            autoFocus
                                        />
                                    </div>
                                    <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '8px', fontStyle: 'italic' }}>
                                        Revisa tu correo electrónico y copia el código de 5 caracteres
                                    </p>
                                </div>

                                {error && (
                                    <div
                                        style={{
                                            padding: '12px',
                                            backgroundColor: '#fee',
                                            color: '#c33',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        backgroundColor: '#00bcd4',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 12px rgba(0, 188, 212, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#00acc1';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 188, 212, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#00bcd4';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 188, 212, 0.3)';
                                    }}
                                >
                                    Verificar código
                                </button>
                            </form>
                        )}

                        {/* Password Authentication Form */}
                        {authMethod === 'password' && (
                            <form onSubmit={handlePasswordSubmit}>
                                <div style={{ marginBottom: '24px' }}>
                                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>
                                        Ingresa con tu contraseña de la aplicación pool xpert.
                                    </p>
                                    <label
                                        style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            color: '#333',
                                            fontWeight: '600',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Contraseña de Pool Xpert
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <FaLock
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
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Ingresa la contraseña"
                                            style={{
                                                width: '100%',
                                                padding: '14px 16px 14px 48px',
                                                borderRadius: '12px',
                                                border: '2px solid #e0e0e0',
                                                fontSize: '1rem',
                                                outline: 'none',
                                                transition: 'all 0.2s',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#00bcd4';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(0, 188, 212, 0.1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#e0e0e0';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div
                                        style={{
                                            padding: '12px',
                                            backgroundColor: '#fee',
                                            color: '#c33',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        backgroundColor: '#00bcd4',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 12px rgba(0, 188, 212, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#00acc1';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 188, 212, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#00bcd4';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 188, 212, 0.3)';
                                    }}
                                >
                                    Iniciar sesión
                                </button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
