// Authentication Service - Simulates JWT-based authentication with localStorage

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'seller' | 'buyer' | 'admin';
  walletBalance: number;
  createdAt: string;
  isBlocked?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: Omit<User, 'password'>;
  token?: string;
}

// Initialize with demo users
const initializeUsers = () => {
  const users = localStorage.getItem('users');
  if (!users) {
    const defaultUsers: User[] = [
      {
        id: 'admin-001',
        name: 'Admin User',
        email: 'admin@ticketshare.com',
        phone: '9999999999',
        password: 'admin123', // In production, this would be hashed
        role: 'admin',
        walletBalance: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'seller-001',
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '9876543210',
        password: 'seller123',
        role: 'seller',
        walletBalance: 1500,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'buyer-001',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '9876543211',
        password: 'buyer123',
        role: 'buyer',
        walletBalance: 5000,
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
};

// Generate JWT-like token
const generateToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 })); // 24h
  const signature = btoa(`${header}.${payload}.secret`);
  return `${header}.${payload}.${signature}`;
};

// Register new user
export const register = async (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'seller' | 'buyer';
}): Promise<AuthResponse> => {
  initializeUsers();
  
  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Check if email already exists
  if (users.find(u => u.email === userData.email)) {
    return {
      success: false,
      message: 'Email already registered',
    };
  }
  
  // Check if phone already exists
  if (users.find(u => u.phone === userData.phone)) {
    return {
      success: false,
      message: 'Phone number already registered',
    };
  }
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    ...userData,
    walletBalance: userData.role === 'buyer' ? 10000 : 0, // Initial balance for buyers
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  const token = generateToken(newUser.id);
  const { password, ...userWithoutPassword } = newUser;
  
  return {
    success: true,
    message: 'Registration successful',
    user: userWithoutPassword,
    token,
  };
};

// Login user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  initializeUsers();
  
  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }
  
  if (user.isBlocked) {
    return {
      success: false,
      message: 'Your account has been blocked. Please contact admin.',
    };
  }
  
  const token = generateToken(user.id);
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    success: true,
    message: 'Login successful',
    user: userWithoutPassword,
    token,
  };
};

// Get current user from token
export const getCurrentUser = (): Omit<User, 'password'> | null => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp < Date.now()) {
      logout();
      return null;
    }
    
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === payload.userId);
    
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch {
    return null;
  }
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('authToken');
};

// Update user wallet balance
export const updateWalletBalance = (userId: string, amount: number): void => {
  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].walletBalance += amount;
    localStorage.setItem('users', JSON.stringify(users));
  }
};

// Get all users (admin only)
export const getAllUsers = (): Omit<User, 'password'>[] => {
  initializeUsers();
  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  return users.map(({ password, ...user }) => user);
};

// Block/Unblock user (admin only)
export const toggleBlockUser = (userId: string): void => {
  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].isBlocked = !users[userIndex].isBlocked;
    localStorage.setItem('users', JSON.stringify(users));
  }
};
