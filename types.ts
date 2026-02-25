
export interface PriceResult {
  storeName: string;
  price: number;
  currency: string;
  isOnline: boolean;
  isPhysical: boolean;
  productName: string;
  packageSize?: string;
  details?: string;
  link?: string;
  location?: string;
  lastUpdated: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ComparisonData {
  results: PriceResult[];
  sources: GroundingSource[];
  analysis: string;
}

export enum StoreType {
  ALL = 'all',
  PHYSICAL = 'physical',
  ONLINE = 'online'
}
