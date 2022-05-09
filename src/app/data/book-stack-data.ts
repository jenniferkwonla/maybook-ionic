import { Deserializable } from '../interface/deserializable';

export class BookStackData implements Deserializable{
    public image:string;
    public title:string;
    public description:string;

    constructor(objectModel?: {}){
		if(objectModel != undefined){
			this.title = objectModel['title'];
			this.description = objectModel['description'];
			this.image=objectModel['image'];
		}
	}

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

	summaryString():string{
		return 'Unknown book stack data';
	}
}
