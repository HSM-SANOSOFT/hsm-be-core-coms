import type { EmailTemplateType } from './email_template_types.type';
import type { EmailTemplatesTypesMap } from './email_templates_types_map.type';

export type EmailTemplateTypePayload =
  EmailTemplatesTypesMap[EmailTemplateType];
