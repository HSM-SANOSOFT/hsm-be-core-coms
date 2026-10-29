import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { PreparedEmailService } from './prepared-email.service';

@Controller()
export class PreparedEmailController {
  constructor(private readonly service: PreparedEmailService) {}

  @MessagePattern('sendPreparedEmail')
  send(@Payload() payload: { data: unknown; files?: Express.Multer.File[] }) {
    if (!payload || !Array.isArray(payload.files) || payload.files.length > 10) throw new RpcException({ statusCode: 400, message: 'Invalid attachments' });
    const files = payload.files.map(file => {
      const buffer = file.buffer as unknown as { type: string; data: number[] };
      if (!buffer || buffer.type !== 'Buffer' || !Array.isArray(buffer.data) || buffer.data.length > 10485760) throw new RpcException({ statusCode: 400, message: 'Invalid attachment' });
      return { ...file, buffer: Buffer.from(buffer.data) };
    });
    return this.service.send(payload.data, files);
  }
}
