import ApiService from './ApiService';
import { Vehicle, VehicleQuery, VehicleSearchParams, ApiResponse } from '../types';

export class VehicleService {
  // Buscar veículo por placa ou RENAVAM
  static async searchVehicle(params: VehicleSearchParams): Promise<ApiResponse<Vehicle>> {
    try {
      // Primeiro tenta APIs gratuitas
      if (params.plate) {
        const freeApiResult = await this.searchVehicleFromFreeAPI(params.plate);
        if (freeApiResult.success) {
          return freeApiResult;
        }
      }
      
      // Se falhar, usa API paga (implementar futuramente)
      return await ApiService.post<Vehicle>('/vehicles/search', params);
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao buscar veículo',
      };
    }
  }

  // Buscar em APIs gratuitas (simulação - implementar com APIs reais)
  private static async searchVehicleFromFreeAPI(plate: string): Promise<ApiResponse<Vehicle>> {
    try {
      // Aqui você pode integrar com APIs gratuitas como:
      // - API do DENATRAN (se disponível)
      // - APIs de consulta básica gratuitas
      // - Web scraping de sites públicos (com cuidado legal)
      
      // Por enquanto, retornamos dados simulados para desenvolvimento
      if (this.isValidPlate(plate)) {
        const mockVehicle: Vehicle = {
          plate: plate.toUpperCase(),
          brand: 'VOLKSWAGEN',
          model: 'GOL',
          year: 2020,
          color: 'BRANCO',
          chassis: 'WVW***************',
          fipeValue: 45000,
          status: {
            stolen: false,
            judicial: false,
            ipvaStatus: 'paid',
            licensingStatus: 'valid',
          },
          restrictions: [],
          debts: [],
          accidents: [],
          lastUpdated: new Date(),
        };

        return {
          success: true,
          data: mockVehicle,
        };
      }

      return {
        success: false,
        error: 'Placa inválida',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao consultar APIs gratuitas',
      };
    }
  }

  // Salvar consulta no histórico
  static async saveQuery(vehicleData: Vehicle, isFavorite = false, notes?: string): Promise<ApiResponse<VehicleQuery>> {
    const queryData = {
      vehicle: vehicleData,
      isFavorite,
      notes,
      queryDate: new Date(),
      creditsUsed: 1,
    };

    return await ApiService.post<VehicleQuery>('/queries', queryData);
  }

  // Buscar histórico de consultas
  static async getQueryHistory(page = 1, limit = 20): Promise<ApiResponse<VehicleQuery[]>> {
    return await ApiService.get<VehicleQuery[]>('/queries', { page, limit });
  }

  // Buscar favoritos
  static async getFavorites(): Promise<ApiResponse<VehicleQuery[]>> {
    return await ApiService.get<VehicleQuery[]>('/queries/favorites');
  }

  // Marcar/desmarcar como favorito
  static async toggleFavorite(queryId: string, isFavorite: boolean): Promise<ApiResponse<VehicleQuery>> {
    return await ApiService.put<VehicleQuery>(`/queries/${queryId}`, { isFavorite });
  }

  // Adicionar nota a uma consulta
  static async addNote(queryId: string, notes: string): Promise<ApiResponse<VehicleQuery>> {
    return await ApiService.put<VehicleQuery>(`/queries/${queryId}`, { notes });
  }

  // Deletar consulta do histórico
  static async deleteQuery(queryId: string): Promise<ApiResponse<any>> {
    return await ApiService.delete(`/queries/${queryId}`);
  }

  // Buscar valor FIPE
  static async getFipeValue(brand: string, model: string, year: number): Promise<ApiResponse<number>> {
    try {
      // Integração com API FIPE gratuita
      const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas`);
      const brands = await response.json();
      
      // Aqui você implementaria a lógica completa da API FIPE
      // Por enquanto retornamos valor simulado
      
      return {
        success: true,
        data: 45000,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao buscar valor FIPE',
      };
    }
  }

  // Validar placa brasileira
  static isValidPlate(plate: string): boolean {
    const plateRegex = /^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    return plateRegex.test(plate.toUpperCase().replace(/[^A-Z0-9]/g, ''));
  }

  // Validar RENAVAM
  static isValidRenavam(renavam: string): boolean {
    const renavamNumbers = renavam.replace(/\D/g, '');
    
    if (renavamNumbers.length !== 11) {
      return false;
    }

    const digits = renavamNumbers.split('').map(Number);
    const sequence = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * sequence[i];
    }

    const remainder = sum % 11;
    const checkDigit = remainder === 0 || remainder === 1 ? 0 : 11 - remainder;

    return checkDigit === digits[10];
  }

  // Formatar placa
  static formatPlate(plate: string): string {
    const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (clean.length <= 7) {
      return clean.replace(/^([A-Z]{3})([0-9]{1,4})$/, '$1-$2');
    } else {
      return clean.replace(/^([A-Z]{3})([0-9])([A-Z])([0-9]{2})$/, '$1$2$3$4');
    }
  }

  // Formatar RENAVAM
  static formatRenavam(renavam: string): string {
    const numbers = renavam.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(\d{3})(\d{4})/, '$1.$2.$3');
  }
}