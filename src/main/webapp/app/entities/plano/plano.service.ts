import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Plano } from './plano.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Plano>;

@Injectable()
export class PlanoService {

    private resourceUrl =  SERVER_API_URL + 'api/planos';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(plano: Plano): Observable<EntityResponseType> {
        const copy = this.convert(plano);
        return this.http.post<Plano>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(plano: Plano): Observable<EntityResponseType> {
        const copy = this.convert(plano);
        return this.http.put<Plano>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Plano>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Plano[]>> {
        const options = createRequestOption(req);
        return this.http.get<Plano[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Plano[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Plano = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Plano[]>): HttpResponse<Plano[]> {
        const jsonResponse: Plano[] = res.body;
        const body: Plano[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Plano.
     */
    private convertItemFromServer(plano: Plano): Plano {
        const copy: Plano = Object.assign({}, plano);
        copy.data = this.dateUtils
            .convertLocalDateFromServer(plano.data);
        return copy;
    }

    /**
     * Convert a Plano to a JSON which can be sent to the server.
     */
    private convert(plano: Plano): Plano {
        const copy: Plano = Object.assign({}, plano);
        copy.data = this.dateUtils
            .convertLocalDateToServer(plano.data);
        return copy;
    }
}
