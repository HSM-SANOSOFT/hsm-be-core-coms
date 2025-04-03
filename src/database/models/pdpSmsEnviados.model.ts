export class PdpSmsEnviadosModel {
  constructor(
    public NUMERO?: number,
    public TEXTO?: string,
    public CEDULA?: string,
    public TELEFONO?: string,
    public MODULO?: string,
    public FECHA?: Date,
  ) {}
}
