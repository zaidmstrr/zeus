import { observable, computed } from 'mobx';
import BaseModel from './BaseModel';
import { localeString } from './../utils/LocaleUtils';

interface Outpoint {
    output_index: number;
    txid_bytes: string;
    txid_str: string;
}

export default class Utxo extends BaseModel {
    @observable address: string;
    confirmations: string;
    outpoint: Outpoint;
    pk_script: string;

    @computed public get isUnconfirmed(): boolean {
        return this.getConfs <= 0;
    }

    @computed public get getAmount(): number | string {
        return this.amount_sat;
    }

    @computed public get getConfs(): number {
        return Number(this.confirmations);
    }

    @computed public get getOutpoint(): string {
        return `${this.txid_str}:${this.output_index}`;
    }
}
