import { Deserializable } from '../interface/deserializable';

export class LibraryData implements Deserializable{
    public id:string;
    public userid: string;
    public books:Text;
    
    constructor(objectModel: {}){
        this.id = objectModel['id'];
        this.userid = objectModel['userid'];
        this.books = objectModel['books'];
    }

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

    summaryString():string{
		return 'Unknown library data';
	}
}
