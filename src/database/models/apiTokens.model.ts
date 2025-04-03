export class ApiTokensModel {
  constructor(
    public ID?: number,
    public DOMINIO?: string,
    public DESCRIPCION?: string,
    public TOKEN?: string,
    public CADUCIDAD?: Date,
  ) {}
}
