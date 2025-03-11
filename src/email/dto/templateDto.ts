import Mailchimp from '@mailchimp/mailchimp_transactional';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class TemplateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  version: string;

  @IsNotEmpty()
  @IsString()
  baseVersion: string;

  @IsObject()
  data: object;

  @IsOptional()
  @IsObject({ each: true })
  attachments: Mailchimp.MessageAttachment[];
}
