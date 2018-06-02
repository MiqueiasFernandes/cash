import { BaseEntity } from './../../shared';

export const enum Destino {
    'MIQUEIAS',
    'ALDA',
    'ISAAC',
    'RUTH',
    'FAMILIA'
}

export const enum Area {
    'ALIMENTAR',
    'ROUPA',
    'ELETRO',
    'COMBUSTIVEL',
    'CARRO',
    'CASA',
    'EDUCACAO',
    'SAUDE',
    'ESTETICA',
    'OUTRO'
}

export const enum Recurso {
    'BB_CREDITO',
    'BB_DEBITO',
    'CAIXA',
    'NUBANK_M_C',
    'NUBANK_A_C',
    'DINHEIRO'
}

export class Conta implements BaseEntity {
    constructor(
        public id?: number,
        public nome?: string,
        public valor?: number,
        public data?: any,
        public parcelas?: number,
        public isentrada?: boolean,
        public ativo?: boolean,
        public destino?: Destino,
        public area?: Area,
        public recurso?: Recurso,
    ) {
        this.isentrada = false;
        this.ativo = false;
    }
}
