jest.mock('../database/database.repository', () => ({ DatabaseRepository: class {} }));
jest.mock('./mailer/mailer.service', () => ({ MailerService: class {} }));
import { PreparedEmailService } from './prepared-email.service';

describe('prepared email transport', () => {
  const data = { email: 'test@example.org', subject: 'Asunto local', html: '<p>Hola &amp; adiós {{literal}}</p>', text: 'Hola & adiós {{literal}}', model: 24 };
  const send = jest.fn();
  const record = jest.fn();
  const attachments = jest.fn(() => []);
  let service: PreparedEmailService;
  beforeEach(() => {
    jest.clearAllMocks();
    send.mockResolvedValue([{ _id: 'receipt-1', email: data.email, status: 'queued' }]);
    record.mockResolvedValue(undefined);
    service = new PreparedEmailService({ messages: { send } } as never, { templateAttachmentsParcer: attachments } as never, { mailRecordsRepository: { emailRecord: record } } as never);
  });
  it('sends complete content without templates, merge variables or link tracking', async () => {
    await service.send(data, []);
    const message = send.mock.calls[0][0].message;
    expect(message).toMatchObject({ subject: data.subject, html: data.html, text: data.text, merge: false, track_clicks: false, track_opens: false });
    expect(message.global_merge_vars).toBeUndefined();
    expect(record.mock.calls[0][2]).toBe('PORTAL_EMAIL:24');
  });
  it('rejects header injection before contacting the provider', async () => {
    await expect(service.send({ ...data, subject: 'Hola\r\nBcc: otro' }, [])).rejects.toBeDefined();
    expect(send).not.toHaveBeenCalled();
  });
  it('does not resend if audit persistence fails after acceptance', async () => {
    record.mockRejectedValue(new Error('database unavailable'));
    await expect(service.send(data, [])).rejects.toBeDefined();
    expect(send).toHaveBeenCalledTimes(1);
  });
  it('returns rejected provider states without converting them into success', async () => {
    send.mockResolvedValue([{ _id: 'receipt-1', email: data.email, status: 'rejected' }]);
    expect((await service.send(data, []))[0].status).toBe('rejected');
  });
  it('sends real hidden recipients and audits receipts with isolated resend targets', async () => {
    send.mockResolvedValue([{ _id: 'one', email: data.email, status: 'sent' }, { _id: 'two', email: 'hidden@example.org', status: 'rejected' }]);
    const result = await service.send({ ...data, bcc: ['hidden@example.org'] }, []);
    expect(send.mock.calls[0][0].message.to).toEqual([{ email: data.email, type: 'to' }, { email: 'hidden@example.org', type: 'bcc' }]);
    expect(result[1].status).toBe('rejected');
    expect(record).toHaveBeenCalledTimes(2);
    expect(record.mock.calls[0][1].to).toEqual([{ email: data.email, type: 'to' }]);
    expect(record.mock.calls[1][1].to).toEqual([{ email: 'hidden@example.org', type: 'bcc' }]);
  });
  it.each([['invalid'], ['TEST@example.org'], ['hidden@example.org', 'HIDDEN@example.org'], Array(51).fill('a@example.org'), 'hidden@example.org'].map(bcc => [bcc]))('rejects invalid or duplicate hidden recipients before sending: %p', async bcc => {
    await expect(service.send({ ...data, bcc }, [])).rejects.toBeDefined();
    expect(send).not.toHaveBeenCalled();
  });
  it('never retries an incomplete provider receipt', async () => {
    await expect(service.send({ ...data, bcc: ['hidden@example.org'] }, [])).rejects.toBeDefined();
    expect(send).toHaveBeenCalledTimes(1);
    expect(record).toHaveBeenCalledTimes(1);
    expect(record.mock.calls[0][0]._id).toBe('receipt-1');
  });
});
