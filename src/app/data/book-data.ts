import { Deserializable } from '../interface/deserializable';

export class BookData implements Deserializable{
	public id:string;
	public title:string;
	public viewTitle:string;
	public author:string;
	public viewAuthor:string;
	public category1:string;
	public category2:string;
	public category3:string;
	public description1:string;
	public description2:string;
	public description3:string;
	public image:string;
	public googlevolumeid:string;

	//consider bringing in if pdf preview is available


	constructor(objectModel?: {}){
		if(objectModel != undefined){
			this.id = objectModel['id'];
			this.title = objectModel['title'];
			this.viewTitle="";
			this.author = objectModel['author'];
			this.viewAuthor="";
			this.category1 = objectModel['category1'];
			this.category2 = objectModel['category2'];
			this.category3 = objectModel['category3'];
			this.description1 = objectModel['description1'];
			this.description2 = objectModel['description2'];
			this.description3 = objectModel['description3'];
			this.image=objectModel['image'];
			this.googlevolumeid=objectModel['googlevolumeid'];
		}
	}

	deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

	summaryString():string{
		return 'Unknown book data';
	}
}
