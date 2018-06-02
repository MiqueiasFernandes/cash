import { BaseEntity } from './../../shared';

export class Plano implements BaseEntity {
    constructor(
        public id?: number,
        public nome?: string,
        public data?: any,
        public ativo?: boolean,
        public detalhes?: string,
        public orcamento?: BaseEntity,
    ) {
        this.ativo = false;
    }
}
