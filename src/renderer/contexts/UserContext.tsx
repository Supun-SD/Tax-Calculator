import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '../hooks/useToast';
import { loginService } from '../services/loginService';

interface UserContextType {
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showSuccess } = useToast();

    const login = async (username: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginService.login(username, password);
            setToken(response.token);
            showSuccess('Login successful');
        } catch (err: any) {
            let errorMessage = 'Login failed';

            if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err?.response?.data) {
                errorMessage = err.response.data;
            } else if (err?.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const logout = () => {
        setToken(null);
    }

    const clearError = () => {
        setError(null);
    }

    return (
        <UserContext.Provider value={{ token, loading, error, login, logout, clearError }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}

export { UserContext };