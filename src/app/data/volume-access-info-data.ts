import { Deserializable } from '../interface/deserializable';
import { AccessInfoEpubData } from './access-info-epub-data';
import { AccessInfoPdfData } from './access-info-pdf-data';

export class VolumeAccessInfoData implements Deserializable{
    public country: string;
    public viewability: string;
    public embeddable: boolean;
    public publicDomain: boolean;
    public textToSpeechPermission: string; 
    public epub: AccessInfoEpubData;
    public pdf: AccessInfoPdfData;
    public webReaderLink: string;
    public accessViewStatus: string;
    public downloadAccess: object;

    constructor(objectModel: {}){
        this.country=objectModel['country'];
        this.viewability=objectModel['viewability'];
        this.embeddable=objectModel['embeddable'];
        this.publicDomain=objectModel['publicDomain'];
        this.textToSpeechPermission=objectModel['textToSpeechPermission'];
        this.epub=objectModel['epub'];
        this.pdf=objectModel['pdf'];
        this.webReaderLink=objectModel['webReaderLink'];
        this.accessViewStatus=objectModel['accessViewStatus'];
        this.downloadAccess=objectModel['downloadAccess'];
    }

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
