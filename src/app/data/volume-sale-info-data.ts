import { Deserializable } from '../interface/deserializable';

export class VolumeSaleInfoData implements Deserializable{

    public country: string;
    public saleability: string;
    public onSaleDate: Date;
    public isEbook: boolean;
    public listPrice: object;
    public retailPrice: object;
    public buyLink: string;


    constructor(objectModel: {}){
        this.country=objectModel['country'];
        this.saleability=objectModel['saleability'];
        this.onSaleDate=objectModel['onSaleDate'];
        this.isEbook=objectModel['isEbook'];
        this.listPrice=objectModel['listPrice'];
        this.retailPrice=objectModel['retailPrice'];
        this.buyLink=objectModel['buyLink'];
    }

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
