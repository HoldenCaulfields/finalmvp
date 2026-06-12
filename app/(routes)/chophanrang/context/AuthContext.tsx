import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { googleProvider } from '../lib/firebase';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | SimulatedUser | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  simulateLogin: (name: string, email: string) => void;
  logout: () => Promise<void>;
  isSimulated: boolean;
}

export interface SimulatedUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | SimulatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);

  useEffect(() => {
    // Listen to real Firebase state change
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsSimulated(false);
      } else if (!isSimulated) {
        setUser(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("Auth state change error:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isSimulated]);

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsSimulated(false);
    } catch (err: any) {
      console.warn("Real Google Auth Popup failed/blocked. Providing instructions for users or falling back safely:", err);
      setError(
        err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request'
          ? "Trình duyệt đã chặn cửa sổ bật lên (popup-blocked). Bạn có thể đăng nhập bằng tài khoản Demo để kiểm thử nhanh chóng!"
          : err.message
      );
      setLoading(false);
    }
  };

  const simulateLogin = (name: string, email: string) => {
    setLoading(true);
    const mockUser: SimulatedUser = {
      uid: `simulated_user_${Date.now()}`,
      displayName: name || "Khách Hàng Phan Rang",
      email: email || "khach.phanrang@example.com",
      photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name || 'khach')}`,
      emailVerified: true,
    };
    setUser(mockUser);
    setIsSimulated(true);
    setLoading(false);
    setError(null);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setIsSimulated(false);
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginWithGoogle, simulateLogin, logout, isSimulated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
