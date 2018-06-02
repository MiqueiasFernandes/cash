import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { ContaComponent } from './conta.component';
import { ContaDetailComponent } from './conta-detail.component';
import { ContaPopupComponent } from './conta-dialog.component';
import { ContaDeletePopupComponent } from './conta-delete-dialog.component';

@Injectable()
export class ContaResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const contaRoute: Routes = [
    {
        path: 'conta',
        component: ContaComponent,
        resolve: {
            'pagingParams': ContaResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Contas'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'conta/:id',
        component: ContaDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Contas'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const contaPopupRoute: Routes = [
    {
        path: 'conta-new',
        component: ContaPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Contas'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'conta/:id/edit',
        component: ContaPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Contas'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'conta/:id/delete',
        component: ContaDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Contas'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
