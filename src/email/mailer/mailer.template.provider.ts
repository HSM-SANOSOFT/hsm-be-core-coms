import { HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as fs from 'fs';
import { join } from 'path';
import type { EmailTemplate } from 'src/type';
import { EmailTemplateType } from 'src/type/template/email';

const TEMPLATE_DIR = join(__dirname, '..', 'templates');

const logger = new Logger('MailerTemplateProvider');

logger.debug(`Loading email templates from ${TEMPLATE_DIR}`);
const templates: EmailTemplate = {} as EmailTemplate;

for (const templateType of Object.values(EmailTemplateType)) {
  const templatePath = join(TEMPLATE_DIR, `${templateType}.template.hbs`);
  try {
    templates[templateType as EmailTemplateType] = fs.readFileSync(
      templatePath,
      'utf-8',
    );
  } catch (error) {
    logger.error(`Failed to load template for ${templateType}: ${error}`);
    throw new RpcException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `Failed to load template for ${templateType}: ${error}`,
    });
  }
}

export const MailerTemplateProvider = {
  provide: 'EMAIL_TEMPLATE_PROVIDER',
  useValue: templates,
};
