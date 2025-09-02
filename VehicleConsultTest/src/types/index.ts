export interface User {
  id: string;
  email: string;
  name: string;
  cpfCnpj: string;
  userType: 'individual' | 'dealer';
  credits: number;
  plan?: UserPlan;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPlan {
  id: string;
  name: string;
  type: 'free' | 'basic' | 'premium' | 'enterprise';
  creditsLimit: number;
  price: number;
  features: string[];
  isActive: boolean;
  expiresAt?: Date;
}

export interface Vehicle {
  plate: string;
  renavam?: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  chassis?: string;
  fipeValue?: number;
  status: VehicleStatus;
  restrictions?: VehicleRestriction[];
  debts?: VehicleDebt[];
  accidents?: VehicleAccident[];
  lastUpdated: Date;
}

export interface VehicleStatus {
  stolen: boolean;
  judicial: boolean;
  ipvaStatus: 'paid' | 'pending' | 'overdue';
  licensingStatus: 'valid' | 'expired' | 'pending';
}

export interface VehicleRestriction {
  type: 'judicial' | 'administrative' | 'theft' | 'financing';
  description: string;
  date: Date;
  origin: string;
}

export interface VehicleDebt {
  type: 'ipva' | 'licensing' | 'fine' | 'inspection';
  value: number;
  dueDate: Date;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface VehicleAccident {
  date: Date;
  severity: 'light' | 'moderate' | 'severe' | 'total_loss';
  description: string;
  value?: number;
}

export interface VehicleQuery {
  id: string;
  userId: string;
  vehicle: Vehicle;
  queryDate: Date;
  isFavorite: boolean;
  notes?: string;
  creditsUsed: number;
}

export interface DealerReport {
  id: string;
  dealerId: string;
  period: {
    start: Date;
    end: Date;
  };
  totalQueries: number;
  creditsUsed: number;
  vehicles: Vehicle[];
  generatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  cpfCnpj: string;
  userType: 'individual' | 'dealer';
}

export interface VehicleSearchParams {
  plate?: string;
  renavam?: string;
}



export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Search: undefined;
  History: undefined;
  Profile: undefined;
  VehicleDetails: { vehicle: Vehicle };
  DealerDashboard: undefined;
  Plans: undefined;
  Support: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  History: undefined;
  Profile: undefined;
  Dashboard: undefined;
};