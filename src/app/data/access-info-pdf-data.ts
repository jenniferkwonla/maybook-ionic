import { Deserializable } from '../interface/deserializable';

export class AccessInfoPdfData implements Deserializable{
    public isAvailable: boolean;
    public downloadLink: string;
    public acsTokenLink: string;

    constuctor(objectModel:{}){
        this.isAvailable=objectModel['isAvailable'];
        this.downloadLink=objectModel['downloadLink'];
        this.acsTokenLink=objectModel['acsTokenLink'];
    }

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
