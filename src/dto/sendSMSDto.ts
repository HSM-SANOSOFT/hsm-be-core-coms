import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SendSMSDto {
  @IsString()
  @IsNotEmpty()
  telefono: string;
  @IsNotEmpty()
  @IsObject()
  texto: object;
  @IsString()
  @IsNotEmpty()
  plantilla: string;
  @IsString()
  @IsNotEmpty()
  modulo: string;
  @IsString()
  @IsNotEmpty()
  cedula: string;
}
