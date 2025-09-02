import axios, { AxiosInstance, AxiosResponse } from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ApiResponse } from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL = 'https://api.vehicleconsult.com'; // URL do seu backend

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor para adicionar token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await EncryptedStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.log('Error getting token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor para tratar erros
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          await EncryptedStorage.removeItem('auth_token');
          // Redirecionar para login se necessário
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos HTTP genéricos
  async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get(endpoint, { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post(endpoint, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put(endpoint, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete(endpoint);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse<any> {
    if (error.response) {
      // Erro de resposta do servidor
      return {
        success: false,
        error: error.response.data?.message || 'Erro do servidor',
        message: error.response.data?.error,
      };
    } else if (error.request) {
      // Erro de rede
      return {
        success: false,
        error: 'Erro de conexão. Verifique sua internet.',
      };
    } else {
      // Erro desconhecido
      return {
        success: false,
        error: 'Erro inesperado. Tente novamente.',
      };
    }
  }

  // Método para atualizar a base URL se necessário
  updateBaseURL(newBaseURL: string) {
    this.baseURL = newBaseURL;
    this.api.defaults.baseURL = newBaseURL;
  }
}

export default new ApiService();