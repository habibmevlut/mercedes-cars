import { ICar } from '../car/car.model';

export interface IColor {
  id?: number;
  name?: string;
  code?: string;
}



export type NewColor = Omit<IColor, 'id'> & { id: null };
