import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  joinedDate?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, name: string, phone?: string, address?: string) => Promise<AuthResponse>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('active_session');
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        localStorage.removeItem('active_session');
      }
    }
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@example.com' || email === 'admin') {
        if (password === 'admin1234') {
          const userData: User = { 
            id: 'admin_01', 
            name: 'Administrator', 
            email: 'admin@example.com', 
            role: 'admin', 
            joinedDate: new Date().toISOString() 
          };
          setUser(userData);
          localStorage.setItem('active_session', JSON.stringify(userData));
          return { success: true, message: 'ยินดีต้อนรับผู้ดูแลระบบ', user: userData };
        } else {
          return { success: false, message: 'รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง' };
        }
      }

      const usersRaw = localStorage.getItem('registered_users');
      const users: (User & { password?: string })[] = usersRaw ? JSON.parse(usersRaw) : [];
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userData } = foundUser;
        setUser(userData as User);
        localStorage.setItem('active_session', JSON.stringify(userData));
        return { success: true, message: 'ยินดีต้อนรับกลับมา', user: userData as User };
      }
      return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
    } catch {
      return { success: false, message: 'ระบบขัดข้อง' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string, address?: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const usersRaw = localStorage.getItem('registered_users');
      const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];
      if (users.find(u => u.email === email)) return { success: false, message: 'อีเมลนี้ถูกลงทะเบียนแล้ว' };

      const newUser: User = {
        id: `u_${Date.now()}`,
        name,
        email,
        phone: phone || '',
        address: address || '',
        role: 'user',
        joinedDate: new Date().toISOString()
      };
      users.push({ ...newUser, password });
      localStorage.setItem('registered_users', JSON.stringify(users));
      setUser(newUser);
      localStorage.setItem('active_session', JSON.stringify(newUser));
      return { success: true, message: 'สมัครสมาชิกสำเร็จ', user: newUser };
    } catch {
      return { success: false, message: 'เกิดข้อผิดพลาด' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'ไม่พบข้อมูล' };
    try {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('active_session', JSON.stringify(updatedUser));
      const usersRaw = localStorage.getItem('registered_users');
      if (usersRaw) {
        const users = JSON.parse(usersRaw);
        const index = users.findIndex((u: any) => u.id === user.id);
        if (index !== -1) {
          users[index] = { ...users[index], ...data };
          localStorage.setItem('registered_users', JSON.stringify(users));
        }
      }
      return { success: true, message: 'อัปเดตข้อมูลสำเร็จ' };
    } catch {
      return { success: false, message: 'ล้มเหลว' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('active_session');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};