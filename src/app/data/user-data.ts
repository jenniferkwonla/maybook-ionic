import { Deserializable } from '../interface/deserializable';

export class UserData implements Deserializable{
    public id: string;
    public userid: string;
    public password: string;

    constructor(objectModel: {}){
		this.id = objectModel['id'];
		this.userid = objectModel['userid'];
		this.password = objectModel['password'];
	}

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

    summaryString():string{
		return 'Unknown user data';
	}
}
