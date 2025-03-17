import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  InitMS() {
    return 'Microservice is up and running!';
  }
}
