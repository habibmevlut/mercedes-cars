import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { ICar } from '../../car/car.model';
import { IColor } from '../color.model';
import { Observable } from 'rxjs';

export type EntityResponseType = HttpResponse<IColor>;
export type EntityArrayResponseType = HttpResponse<IColor[]>;

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/colors');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {
  }


  /**
   * Get all colors
   * @param req
   */
  query(req?: any): Observable<EntityArrayResponseType> {
    return this.http.get<IColor[]>(this.resourceUrl, {params: req, observe: 'response'});
  }
}
