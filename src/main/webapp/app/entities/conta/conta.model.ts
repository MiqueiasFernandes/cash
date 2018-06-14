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
    public getDestino(): number {
        return [
            'MIQUEIAS',
            'ALDA',
            'ISAAC',
            'RUTH',
            'FAMILIA'
        ].indexOf(this.destino.toString());
    }
    public getArea(): number {
        return [
            'ALIMENTAR',
            'ROUPA',
            'ELETRO',
            'CARRO',
            'CASA',
            'EDUCACAO',
            'SAUDE',
            'ESTETICA',
            'OUTRO'
        ].indexOf(this.area.toString());
    }
    public getRecurso(): number {
        return [
            'BB_CREDITO',
            'BB_DEBITO',
            'CAIXA',
            'NUBANK_M_C',
            'NUBANK_A_C',
            'DINHEIRO'
        ].indexOf(this.recurso.toString());
    }
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
