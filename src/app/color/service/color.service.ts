import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { IColor, NewColor } from '../color.model';
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
     * Creates a color.
     * @param color
     */
    create(color: NewColor): Observable<EntityResponseType> {
        return this.http.post<IColor>(this.resourceUrl, color, {observe: 'response'});
    }

    /**
     * Updates a color.
     * @param color
     */
    update(color: IColor): Observable<EntityResponseType> {
        return this.http.put<IColor>(`${this.resourceUrl}/${this.getCarIdentifier(color)}`, color, {observe: 'response'});
    }

    /**
     * Returns a color by id.
     * @param id
     */
    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IColor>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    /**
     * Get all colors
     * @param req
     */
    query(req?: any): Observable<EntityArrayResponseType> {
        return this.http.get<IColor[]>(this.resourceUrl, {params: req, observe: 'response'});
    }

    /**
     * Deletes a color by id.
     * @param id
     */
    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }


    getCarIdentifier(color: IColor): number | undefined {
        return color.id;
    }
}
