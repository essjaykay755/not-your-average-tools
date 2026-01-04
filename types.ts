export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  path: string;
  category: string;
  rating?: number;
  developer?: string;
  imageUrl?: string;
  featured?: boolean;
  usage: string;
  usageSteps?: {
    title: string;
    description: string;
    icon?: any;
  }[];
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}
