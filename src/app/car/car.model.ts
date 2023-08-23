import { IColor } from '../color/color.model';

export interface ICar {
  id?: number;
  carId?: string;
  inStock?: boolean;
  hp?: number;
  price?: number;
  colo?: IColor;
}

export type NewCar = Omit<ICar, 'id'> & { id: null };
