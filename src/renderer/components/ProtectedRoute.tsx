import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import { ClipLoader } from 'react-spinners';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { token } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token]);

    if (!token) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
