import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { Conta } from './conta.model';
import { ContaService } from './conta.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';

@Component({
    selector: 'jhi-conta',
    templateUrl: './conta.component.html',
    styles: [`
        @media only screen and (min-width: 900px) {
            .titulo {
                justify-content: space-around;
                display: flex;
            }
        }
        .data {
            border: 1px solid rgba(0, 0, 0, 0.5);
            padding: 2px;
            border-radius: 2px;
        }
        .mes {
            width: 100px;
            text-align: right;
        }
        .ano {
            width: 100px;
        }
    `]
})
export class ContaComponent implements OnInit, OnDestroy {

currentAccount: any;
    contas: Conta[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    mes = 0;
    ano = 0;

    constructor(
        private contaService: ContaService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager
    ) {
        const dt = new Date();
        this.mes = (dt.getMonth() + 1);
        this.ano = dt.getFullYear();
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
    }

    loadAll() {
        this.contas = [];
        this.contaService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            mes: this.mes,
            ano: this.ano,
        }).subscribe(
                (res: HttpResponse<Conta[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/conta'], {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate(['/conta', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInContas();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Conta) {
        return item.id;
    }
    registerChangeInContas() {
        this.eventSubscriber = this.eventManager.subscribe('contaListModification', (response) => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.contas = data;
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
