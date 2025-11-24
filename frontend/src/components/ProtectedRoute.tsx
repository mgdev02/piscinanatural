import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [isValidating, setIsValidating] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const validateSession = async () => {
            const token = localStorage.getItem('session-token');

            if (!token) {
                setIsAuthenticated(false);
                setIsValidating(false);
                return;
            }

            try {
                await axios.post(
                    'http://localhost:8000/validate-session',
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setIsAuthenticated(true);
            } catch (error) {
                // Token inválido o expirado
                localStorage.removeItem('session-token');
                localStorage.removeItem('auth-email');
                localStorage.removeItem('user-data');
                setIsAuthenticated(false);
            } finally {
                setIsValidating(false);
            }
        };

        validateSession();
    }, []);

    if (isValidating) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem',
                color: '#00bcd4'
            }}>
                Verificando sesión...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
};
