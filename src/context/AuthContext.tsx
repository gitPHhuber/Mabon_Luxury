import React, { useState, useEffect, createContext, useContext, PropsWithChildren } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
}

interface AuthResult {
    success: boolean;
    error?: 'USER_NOT_FOUND' | 'INCORRECT_PASSWORD' | 'EMAIL_ALREADY_IN_USE';
}

interface AuthContextType {
    user: Omit<User, 'password'> | null;
    login: (email: string, password: string) => Promise<AuthResult>;
    logout: () => void;
    signup: (name: string, email: string, password: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<Omit<User, 'password'> | null>(null);

    const getUsers = (): User[] => {
        try {
            const users = localStorage.getItem('mabon_users');
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error("Failed to parse users from localStorage", error);
            return [];
        }
    };

    useEffect(() => {
        const users = getUsers();
        const adminUser = users.find(u => u.name === 'admin');
        if (!adminUser) {
            const admin: User = { id: 'admin_user_id', name: 'admin', email: 'admin@mabon.com', password: 'admin' };
            localStorage.setItem('mabon_users', JSON.stringify([...users, admin]));
        }


        try {
            const storedUser = localStorage.getItem('mabon_current_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse current user from localStorage", error);
            localStorage.removeItem('mabon_current_user');
        }
    }, []);

    const login = async (email: string, password: string): Promise<AuthResult> => {
        const users = getUsers();
        
        const foundUser = users.find(u => 
            (u.email.toLowerCase() === email.toLowerCase()) || 
            (u.name === 'admin' && email === 'admin')
        );

        if (!foundUser) {
            return { success: false, error: 'USER_NOT_FOUND' };
        }

        if (foundUser.password !== password) {
            return { success: false, error: 'INCORRECT_PASSWORD' };
        }

        const { password: _, ...userToStore } = foundUser;
        setUser(userToStore);
        localStorage.setItem('mabon_current_user', JSON.stringify(userToStore));
        return { success: true };
    };

    const signup = async (name: string, email: string, password: string): Promise<AuthResult> => {
        const users = getUsers();
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            return { success: false, error: 'EMAIL_ALREADY_IN_USE' };
        }

        const newUser: User = { id: Date.now().toString(), name, email, password };
        const updatedUsers = [...users, newUser];
        localStorage.setItem('mabon_users', JSON.stringify(updatedUsers));
        
        const { password: _, ...userToStore } = newUser;
        setUser(userToStore);
        localStorage.setItem('mabon_current_user', JSON.stringify(userToStore));
        
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mabon_current_user');
    };

    const value = { user, login, logout, signup };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};