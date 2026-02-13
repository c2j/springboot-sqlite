import apiClient from './client';
import type {
  LoginRequest,
  LoginResponse,
  ClientSignupRequest,
  EmployeeSignupRequest,
  SignupResponse,
} from '@/types';

export const authApi = {
  login: async (data: LoginRequest, role: 'client' | 'employee' = 'client'): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/users/login', data, {
      params: { role },
    });
    return response.data;
  },

  signupClient: async (data: ClientSignupRequest): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>('/users/clients/signup', data);
    return response.data;
  },

  signupEmployee: async (data: EmployeeSignupRequest): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>('/users/employees/signup', data);
    return response.data;
  },
};
