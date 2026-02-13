// User and authentication types

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Client extends User {
  address?: string;
  phone?: string;
}

export interface Employee extends User {
  employeeId: string;
  role: 'employee' | 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Login and signup request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ClientSignupRequest {
  name: string;
  email: string;
  password: string;
  address?: string;
  phone?: string;
}

export interface EmployeeSignupRequest {
  name: string;
  email: string;
  password: string;
  employeeId: string;
}

export interface SignupResponse {
  id: string;
  name: string;
  email: string;
}
