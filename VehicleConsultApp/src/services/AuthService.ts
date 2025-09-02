import ApiService from './ApiService';
import { User, AuthCredentials, RegisterData, ApiResponse } from '../types';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

export class AuthService {
  static async login(credentials: AuthCredentials): Promise<ApiResponse<LoginResponse>> {
    return await ApiService.post<LoginResponse>('/auth/login', credentials);
  }

  static async register(data: RegisterData): Promise<ApiResponse<RegisterResponse>> {
    return await ApiService.post<RegisterResponse>('/auth/register', data);
  }

  static async validateToken(token: string): Promise<boolean> {
    try {
      const response = await ApiService.get('/auth/validate');
      return response.success;
    } catch (error) {
      return false;
    }
  }

  static async getUserData(userId: string): Promise<ApiResponse<User>> {
    return await ApiService.get<User>(`/users/${userId}`);
  }

  static async updateProfile(userId: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return await ApiService.put<User>(`/users/${userId}`, data);
  }

  static async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    return await ApiService.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  }

  static async resetPassword(email: string): Promise<ApiResponse<any>> {
    return await ApiService.post('/auth/reset-password', { email });
  }

  static async logout(): Promise<ApiResponse<any>> {
    return await ApiService.post('/auth/logout');
  }

  // Método para validar CPF
  static validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) {
      return false;
    }
    
    const cpfArray = cpf.split('').map(el => +el);
    const rest = (count: number) => {
      return (
        cpfArray
          .slice(0, count - 12 + cpfArray.length)
          .reduce((soma, el, index) => soma + el * (count - index), 0) * 10
      ) % 11 % 10;
    };
    
    return rest(10) === cpfArray[9] && rest(11) === cpfArray[10];
  }

  // Método para validar CNPJ
  static validateCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    
    if (cnpj.length !== 14) return false;
    
    if (/^(\d)\1+$/.test(cnpj)) return false;
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    
    return resultado === parseInt(digitos.charAt(1));
  }

  // Método para formatar CPF/CNPJ
  static formatCpfCnpj(value: string): string {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      // CPF
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
  }
}