import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal } from '../shared';
import {Area, ContaService, Destino, Recurso} from '../entities/conta';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Conta} from '../entities/conta/conta.model';
import 'rxjs/Rx' ;

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.scss'
    ]

})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    lineChartData = [
        {data: [10, 20, 30, 9, 35, 40, 80], label: 'Acumulado'},
        {data: [18, 48, 77, 9, 100, 27, 40], label: 'Saldo'},
        {data: [28, 48, 40, 19, 86, 27, 90], label: 'Despesas'},
        {data: [65, 59, 80, 81, 56, 55, 40], label: 'Entradas'},
    ];

    lineChartLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    lineChartOptions = {
        responsive: true
    };

    lineChartColors: Array<any> = [
        {
            backgroundColor: '#ffff00a1',
            borderColor: 'yellow'
        },
        {
            backgroundColor: '#00ff00a1',
            borderColor: 'green'
        },
        {
            backgroundColor: '#0000ffa1',
            borderColor: 'blue'
        },
        {
            backgroundColor: '#ff0000a1',
            borderColor: 'red'
        }
    ];

    lineChartLegend = true;
    lineChartType = 'line';

    MIQUEIAS = true;
    ALDA = true;
    ISAAC = true;
    RUTH = true;
    FAMILIA = true;
    BB_CREDITO = true;
    BB_DEBITO = true;
    CAIXA = true;
    NUBANK_M_C = true;
    NUBANK_A_C = true;
    DINHEIRO = true;
    ALIMENTAR = true;
    ROUPA = true;
    ELETRO = true;
    COMBUSTIVEL = true;
    CARRO = true;
    CASA = true;
    EDUCACAO = true;
    SAUDE = true;
    ESTETICA = true;
    OUTRO = true;
    ano = 2018;
    modo = 1;
    controls = false;
    contas: Conta[] = [];
    show = true;
    entradas = false;
    despesas = true;
    extratostr = '';

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private contaService: ContaService
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            if (this.isAuthenticated()) {
                this.carregar();
            }
        });
        this.registerAuthenticationSuccess();
        if (this.isAuthenticated()) {
            this.carregar();
        }
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.carregar();
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    carregar() {
        this.reset();
        this.contaService.query({
            page: 0,
            size: 1000000000,
            mes: 1,
            ano: 2017
        }).subscribe(
            (res: HttpResponse<Conta[]>) => this.importar(res.body),
            (res: HttpErrorResponse) => alert(res.message)
        );
    }

    reset() {
        this.show = false;
        this.lineChartData = [];
        this.lineChartColors = [];
    }

    atualizar() {
        this.reset();
        this.importar(this.contas);
    }

    importar(contas: Conta[]) {
        this.contas = [];
        contas.forEach((c) => {
            c.data = new Date(Date.parse(c.data));
            this.contas.push(Object.assign(new Conta(), c));
        });
        const ncnt: Conta[] = [];
        this.contas.forEach((conta: Conta) => {
            if (!(( this.entradas && conta.isentrada || this.despesas && !conta.isentrada ? ((!this.MIQUEIAS && conta.getDestino() === Destino.MIQUEIAS.valueOf()) ||
                (!this.ALDA && conta.getDestino() === Destino.ALDA.valueOf()) ||
                (!this.ISAAC && conta.getDestino() === Destino.ISAAC.valueOf()) ||
                (!this.RUTH && conta.getDestino() === Destino.RUTH.valueOf()) ||
                (!this.FAMILIA && conta.getDestino() === Destino.FAMILIA.valueOf())) : false) ||
                (!this.BB_CREDITO && conta.getRecurso() === Recurso.BB_CREDITO.valueOf()) ||
                (!this.BB_DEBITO && conta.getRecurso() === Recurso.BB_DEBITO.valueOf()) ||
                (!this.CAIXA && conta.getRecurso() === Recurso.CAIXA.valueOf()) ||
                (!this.NUBANK_M_C && conta.getRecurso() === Recurso.NUBANK_M_C.valueOf()) ||
                (!this.NUBANK_A_C && conta.getRecurso() === Recurso.NUBANK_A_C.valueOf()) ||
                (!this.DINHEIRO && conta.getRecurso() === Recurso.DINHEIRO.valueOf()) ||
                (!this.ALIMENTAR && conta.getArea() === Area.ALIMENTAR.valueOf()) ||
                (!this.ROUPA && conta.getArea() === Area.ROUPA.valueOf()) ||
                (!this.ELETRO && conta.getArea() === Area.ELETRO.valueOf()) ||
                (!this.CARRO && conta.getArea() === Area.CARRO.valueOf()) ||
                (!this.CASA && conta.getArea() === Area.CASA.valueOf()) ||
                (!this.EDUCACAO && conta.getArea() === Area.EDUCACAO.valueOf()) ||
                (!this.SAUDE && conta.getArea() === Area.SAUDE.valueOf()) ||
                (!this.ESTETICA && conta.getArea() === Area.ESTETICA.valueOf()) ||
                (!this.OUTRO && conta.getArea() === Area.OUTRO.valueOf()) ||
                (!this.ehDesseAno(conta)) ||
                (this.modo === 1 ? !conta.ativo : false))) {
                ncnt.push(conta);
            }
        });
        this.calcular(ncnt);
    }

    ehDesseAno(conta: Conta): boolean {  /// ano nao esta atualizando bind
        const data: Date = conta.data;
        const dt = new Date(data.getFullYear(), data.getMonth(), data.getDay());
        dt.setMonth(dt.getMonth() + conta.parcelas - 1);
        return this.ano >= data.getFullYear() && this.ano <= dt.getFullYear();
    }

    calcular(cs: Conta[]): void {
        console.log(cs);
        const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const s = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const e = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        cs.forEach((c: Conta) => {
            const dt = c.data as Date;
            const mes = dt.getMonth();
            const fim: Date = this.getDate(c);
            for (let m = dt.getFullYear() === this.ano ? mes : 0; m < (this.ano === fim.getFullYear() ? (fim.getMonth() + 1) : 12); m++) {
                if (c.isentrada) {
                    e[m] += c.valor;
                    s[m] += c.valor;
                } else {
                    d[m] += c.valor;
                    s[m] -= c.valor;
                }
            }
        });

        a[0] = s[0];
        for (let m = 1; m < 12; m++) {
            a[m] = a[m - 1] + s[m];
        }

        this.lineChartData = [
            {data: a, label: 'Acumulado'},
            {data: s, label: 'Saldo'},
            {data: d, label: 'Despesas'},
            {data: e, label: 'Entradas'},
        ];

        this.lineChartColors = [
            {
                backgroundColor: 'rgba(255, 255, 0, 0.3)',
                borderColor: 'yellow'
            },
            {
                backgroundColor: 'rgba(0, 255, 0, 0.3)',
                borderColor: 'green'
            },
            {
                backgroundColor: 'rgba(255, 0, 0, 0.3)',
                borderColor: 'red'
            },
            {
                backgroundColor: 'rgba(0, 0, 255, 0.3)',
                borderColor: 'blue'
            }
        ];

        this.show = true;
    }
    getDate(conta) {
        if (conta && conta.parcelas < 1) {
            conta.parcelas = 1;
        }
        if (conta.data) {
            const data: Date = conta.data;
            const dt = new Date(data.getFullYear(), data.getMonth(), data.getDay());
            dt.setMonth(dt.getMonth() + conta.parcelas - 1);
            return dt;
        }
    }
    extrato() {
        this.contaService.query({
            page: 0,
            size: 1000000000,
            sort: ['data', 'id'],
            mes: 1,
            ano: 2017
        }).subscribe(
            (res: HttpResponse<Conta[]>) => this.baixar(res.body),
            (res: HttpErrorResponse) => alert(res.message)
        );
    }
    baixar(cs: Conta[]) {
        cs.map((c) => {
            c.data = new Date(Date.parse(c.data));
            return Object.assign(new Conta(), c);
        });

        let str = '-------------------------------------------------------\n';
         str += '|                 Extrato do ano ' + this.ano + '                 |\n';
         str += '-------------------------------------------------------\n';
        let acum = 0;
        for (let mes = 0; mes < 12; mes++) {
            str += '\n======================= Mes ' + this.lineChartLabels[mes] + ' =======================\n';
            str += '\nID            DESCRICAO     RECEITAS           DESPESAS\n';
            const rec = [];
            const desp = [];
            const inat = [];
            cs.forEach((conta: Conta ) => {
                const dt: Date = conta.data;
                const fim: Date = this.getDate(conta);
                for (let a = dt.getFullYear(); a <= fim.getFullYear(); a++) {
                    for (let m = this.ano === dt.getFullYear() ? dt.getMonth()  : 0; m <= (a === fim.getFullYear() ? fim.getMonth() : 12); m++) {
                        if (a === this.ano && (m === mes)) {
                            if (conta.ativo) {
                                if (conta.isentrada) {
                                    rec.push(conta);
                                } else {
                                    desp.push(conta);
                                }
                            } else {
                                inat.push(conta);
                            }
                        }
                    }
                }
            });

            let entrada = 0;
            let saida = 0;

            rec.forEach((r: Conta) => {
                str += this.spacar(r.id.toString(), 8, 2);
                str += this.spacar(r.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '-'), 20);
                str += this.spacar(r.valor.toString(), 6, 1) + '\n';
                entrada += r.valor;
            });
            desp.forEach((s: Conta) => {
                str += this.spacar(s.id.toString(), 8, 2);
                str += this.spacar(s.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '-'), 20);
                str += '                  ';
                str += this.spacar(s.valor.toString(), 6, 1) + '\n';
                saida += s.valor;
            });
            if (inat.length > 0) {
                str += '\nintativos:\n';
            }
            inat.forEach((i: Conta) => {
                str += this.spacar(i.id.toString(), 8, 2);
                str += this.spacar(i.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '-'), 20) + '\n';
                if (!i.isentrada) {
                    str += '                  ';
                    str += this.spacar(i.valor.toString(), 6, 1) + '\n';
                } else {
                    str += this.spacar(i.valor.toString(), 6, 1) + '\n';
                }
            });

            str += '\n_______________________________________________________\n';
            str += 'Total                       ' + entrada + '               ' + saida + '\n';
            str += 'Saldo total             ' + this.spacar('R$  ' + (entrada - saida), 20, 1) + '\n';
            str += 'Saldo acumulado         ' + this.spacar('R$  ' + (acum + (entrada - saida)), 20, 1) + '\n';
            acum += (entrada - saida);
        }
        console.log(this.extratostr = str);
        const data = str;
        const blob = new Blob([data], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);

        // const link = document.createElement('a');
        // link.target = '_blank';
        // link.href = 'https://www.google.es';
        // link.setAttribute('visibility', 'hidden');
        // link.click();
    }

    spacar(str: string, esp: number, modo = 0): string {
        const tam = str.length;
        if (tam > esp) {
            return ' ' + str.substr(0, esp - 5) + '... ';
        }
        if (esp - tam < 2) {
            return str;
        }
        let esq = Math.round((esp - tam) / 2);
        let dir = esp - tam - esq;
        if (modo === 1) {
            esq += dir;
            dir = 0;
        }
        if (modo === 2) {
            dir += esq;
            esq = 0;
        }
        return (modo === 2 ? '' : ' '.repeat(esq)) + str + (modo === 1 ? '' : ' '.repeat(dir));
    }
}
