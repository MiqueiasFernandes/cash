import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Conta } from './conta.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Conta>;

@Injectable()
export class ContaService {

    private resourceUrl =  SERVER_API_URL + 'api/contas';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(conta: Conta): Observable<EntityResponseType> {
        const copy = this.convert(conta);
        return this.http.post<Conta>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(conta: Conta): Observable<EntityResponseType> {
        const copy = this.convert(conta);
        return this.http.put<Conta>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Conta>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Conta[]>> {
        const options = createRequestOption(req);
        return this.http.get<Conta[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Conta[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Conta = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Conta[]>): HttpResponse<Conta[]> {
        const jsonResponse: Conta[] = res.body;
        const body: Conta[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Conta.
     */
    private convertItemFromServer(conta: Conta): Conta {
        const copy: Conta = Object.assign({}, conta);
        copy.data = this.dateUtils
            .convertLocalDateFromServer(conta.data);
        return copy;
    }

    /**
     * Convert a Conta to a JSON which can be sent to the server.
     */
    private convert(conta: Conta): Conta {
        const copy: Conta = Object.assign({}, conta);
        copy.data = this.dateUtils
            .convertLocalDateToServer(conta.data);
        return copy;
    }
}
