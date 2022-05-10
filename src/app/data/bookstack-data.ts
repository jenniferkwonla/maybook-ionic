import { Deserializable } from '../interface/deserializable';

export class BookstackData implements Deserializable{
    public id:string;
    public userids: string;
    public books:Text;
    
    constructor(objectModel: {}){
        this.id = objectModel['id'];
        this.userids = objectModel['userids'];
        this.books = objectModel['books'];
    }

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

    summaryString():string{
		return 'Unknown bookstack data';
	}
}