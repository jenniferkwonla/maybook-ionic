import { Deserializable } from '../interface/deserializable';


export class VolumeSearchInfoData implements Deserializable{

    public textSnippet: string;

    constructor(objectModel:{}){
        this.textSnippet=objectModel['textSnippet'];
    }
    
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
