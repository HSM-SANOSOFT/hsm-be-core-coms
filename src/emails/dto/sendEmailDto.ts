import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SendEmailDto {
  @IsArray()
  @IsNotEmpty()
  to: string[];
  @IsString()
  @IsNotEmpty()
  subject: string;
  @IsString()
  @IsNotEmpty()
  template: string;
  @IsString()
  @IsNotEmpty()
  bcc: string;
  @IsObject()
  @IsNotEmpty()
  context: any;
}
