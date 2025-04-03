export class MailRecordsModel {
  constructor(
    public IDCORREO?: number,
    public EMAIL?: string,
    public STATUS?: string,
    public TEMPLATENAME?: string,
    public TEMPLATEVERSION?: string,
    public BASEVERSION?: string,
    public MESSAGE?: string,
    public FECHACREACION?: Date,
    public FECHAULTIMOENVIO?: Date,
  ) {}
}
