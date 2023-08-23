import { Injectable } from '@angular/core';
import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ICar, NewCar } from '../car.model';
import { Observable } from 'rxjs';

export type EntityResponseType = HttpResponse<ICar>;
export type EntityArrayResponseType = HttpResponse<ICar[]>;

@Injectable({
  providedIn: 'root'
})
export class CarService {

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cars');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {
  }

  /**
   * Creates a car.
   * @param car
   */
  create(car: NewCar): Observable<EntityResponseType> {
    return this.http.post<ICar>(this.resourceUrl, car, {observe: 'response'});
  }

  /**
   * Updates a car.
   * @param car
   */
  update(car: ICar): Observable<EntityResponseType> {
    return this.http.put<ICar>(`${this.resourceUrl}/${this.getCarIdentifier(car)}`, car, {observe: 'response'});
  }

  /**
   * Returns a car by id.
   * @param id
   */
  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICar>(`${this.resourceUrl}/${id}`, {observe: 'response'});
  }

  /**
   * Returns the list of cars.
   * @param req
   */
  query(req?: any): Observable<EntityArrayResponseType> {
    return this.http.get<ICar[]>(this.resourceUrl, {params: req, observe: 'response'});
  }

  /**
   * Deletes a car by id.
   * @param id
   */
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {observe: 'response'});
  }

  /**
   * Returns the identifier for the car.
   * @param car
   */
  getCarIdentifier(car: ICar): number | undefined {
    return car.id;
  }
}
