import type { UUID } from 'crypto';

import type {
  EmailTemplateType,
  EmailTemplateTypePayload,
} from './template/email';

export type SendEmailPostType = {
  email: string;
  type: EmailTemplateType;
  data: EmailTemplateTypePayload;
  attachments?: UUID[];
};
