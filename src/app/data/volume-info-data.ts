import { Deserializable } from '../interface/deserializable';

export class VolumeInfoData implements Deserializable{
    
    public allowAnonLogging: boolean;
    public authors: string[];
    public canonicalVolumeLink: string;
    public categories: string[];
    public contentVersion: string;
    public description: string;
    public imageLinks: Map<string, string>;
    public industryIdentifiers: Array<Map<string,string>>;
    public infoLink: string;
    public language: string;
    public maturityRating: string;
    public pageCount: number;
    public panelizationSummary: Map<string, boolean>;
    public previewLink: string;
    public printType: string;
    public publishedDate: string;
    public publisher: string;
    public readingModes: object;
    public subtitle: string;
    public title: string;
    
    constructor(objectModel: {}){
        this.allowAnonLogging=objectModel['allowAnonLogging'];
        this.authors=objectModel['authors'];
        this.canonicalVolumeLink=objectModel['canonicalVolumeLink'];
        this.categories=objectModel['categories'];
        this.contentVersion=objectModel['contentVersion'];
        this.description=objectModel['description'];
        this.imageLinks=objectModel['imageLinks'];
        this.industryIdentifiers=objectModel['industryIdentifiers'];
        this.infoLink=objectModel['infoLink'];
        this.language=objectModel['language'];
        this.maturityRating=objectModel['maturityRating'];
        this.pageCount=objectModel['pageCount'];
        this.panelizationSummary=objectModel['panelizationSummary'];
        this.previewLink=objectModel['previewLink'];
        this.printType=objectModel['printType'];
        this.publishedDate=objectModel['publishedDate'];
        this.publisher=objectModel['publisher'];
        this.readingModes=objectModel['readingModes'];
        this.subtitle=objectModel['subtitle'];
        this.title=objectModel['title'];
    }

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
