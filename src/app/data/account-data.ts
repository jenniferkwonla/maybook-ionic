import { Deserializable } from '../interface/deserializable';

export class AccountData implements Deserializable{
    public id: number;
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
