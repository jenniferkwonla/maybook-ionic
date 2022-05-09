import { Deserializable } from '../interface/deserializable';
import { VolumeInfoData } from './volume-info-data';
import { VolumeAccessInfoData } from './volume-access-info-data';
import { VolumeSaleInfoData } from './volume-sale-info-data';
import { VolumeSearchInfoData } from './volume-search-info-data';

export class VolumesItemsData implements Deserializable{

    public etag:string;
    public id:string;
    public kind:string;
    public selfLink:string;
    public volumeInfo:VolumeInfoData;
    public accessInfo: VolumeAccessInfoData;
    public saleInfo: VolumeSaleInfoData;
    public searchInfo: VolumeSearchInfoData;
    

    constructor(objectModel: {}){
        this.etag=objectModel['etag'];
        this.id=objectModel['id'];
        this.kind=objectModel['kind'];
        this.selfLink=objectModel['selfLink'];
        this.volumeInfo=objectModel['volumeInfo'];
        this.accessInfo=objectModel['accessInfo'];
        this.saleInfo=objectModel['saleInfo'];
        this.searchInfo=objectModel['searchInfo'];
    }

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
