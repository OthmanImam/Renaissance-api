import { Injectable, Logger } from '@nestjs/common';
import { LiveGateway } from './live.gateway';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class LiveService {
  private readonly logger = new Logger(LiveService.name);
  constructor(private readonly gateway: LiveGateway) {}

  broadcastMatchUpdate(update: UpdateMatchDto) {
    this.logger.debug(`Broadcasting update for match ${update.matchId}`);
    this.gateway.broadcastMatchUpdate(update);
  }
}
