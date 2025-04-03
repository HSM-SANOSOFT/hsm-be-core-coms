export class ApiTokensLogModel {
  constructor(
    public ID?: number,
    public IP?: string,
    public FECHA?: Date,
    public RESPUESTA?: string,
    public SOLICITUD?: string,
    public ACCION?: string,
    public COD_RESP?: number,
    public DATA_RC?: string,
    public API?: string,
  ) {}
}
