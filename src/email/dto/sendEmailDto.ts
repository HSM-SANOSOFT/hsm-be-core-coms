import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty()
  @IsString()
  data: string;

  @IsObject()
  file: object;
}
