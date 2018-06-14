import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Conta } from './conta.model';
import { ContaService } from './conta.service';

@Injectable()
export class ContaPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private contaService: ContaService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.contaService.find(id)
                    .subscribe((contaResponse: HttpResponse<Conta>) => {
                        const conta: Conta = contaResponse.body;
                        if (conta.data) {
                            conta.data = {
                                year: conta.data.getFullYear(),
                                month: conta.data.getMonth() + 1,
                                day: conta.data.getDate()
                            };
                        }
                        this.ngbModalRef = this.contaModalRef(component, conta);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    const c = new Conta();
                    c.parcelas = 1;
                    this.ngbModalRef = this.contaModalRef(component, c);
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    contaModalRef(component: Component, conta: Conta): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.conta = conta;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
