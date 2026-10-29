import { isEmail } from 'class-validator';

export interface PreparedEmail {
  email: string;
  subject: string;
  html: string;
  text: string;
  model: number;
}

/** Transport contract only: templates and variable substitution belong to SANOSOFT. */
export function validatePreparedEmail(input: unknown): PreparedEmail {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid prepared email');
  const data = input as Record<string, unknown>;
  const keys = ['email', 'subject', 'html', 'text', 'model'];
  if (Object.keys(data).some(key => !keys.includes(key))) throw new Error('Unexpected prepared email field');
  for (const key of ['email', 'subject', 'html', 'text']) {
    if (typeof data[key] !== 'string' || !(data[key] as string).trim()) throw new Error('Missing prepared email field');
  }
  if (!isEmail(data.email as string) || Buffer.byteLength(data.email as string) > 254) throw new Error('Invalid recipient');
  if (/[\r\n\x00]/.test(data.subject as string) || Buffer.byteLength(data.subject as string) > 300) throw new Error('Invalid subject');
  if (Buffer.byteLength(data.html as string) > 1048576 || Buffer.byteLength(data.text as string) > 1048576) throw new Error('Prepared email too large');
  if (!Number.isInteger(data.model) || (data.model as number) < 1 || (data.model as number) > 99999999) throw new Error('Invalid model');
  return data as unknown as PreparedEmail;
}
