import { Deserializable } from '../interface/deserializable';
import { VolumesItemsData } from './volumes-items-data';

export class VolumesData implements Deserializable{

    public items:VolumesItemsData[]=[];
    public kind:string;
    public totalItems: number;

    constructor(objectModel: {}){
        this.kind=objectModel['kind'];
        this.items=objectModel['items'];
        this.totalItems=objectModel['totalItems'];
    }
    
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
