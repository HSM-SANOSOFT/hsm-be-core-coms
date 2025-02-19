import { IsNotEmpty, IsObject, IsString } from "class-validator";

export class SendSMSDto {
    @IsString()
    @IsNotEmpty()
    telefono: string;
    @IsString()
    @IsNotEmpty()
    @IsObject()
    texto: object;
    @IsString()
    @IsNotEmpty()
    @IsObject()
    plantilla: string;
    @IsString()
    @IsNotEmpty()
    modulo: string;
    @IsString()
    @IsNotEmpty()
    cedula: string;
}
