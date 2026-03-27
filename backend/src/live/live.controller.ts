import { Controller, Post, Body } from '@nestjs/common';
import { LiveService } from './live.service';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Post('match-update')
  updateMatch(@Body() payload: UpdateMatchDto) {
    this.liveService.broadcastMatchUpdate(payload);
    return { ok: true };
  }
}
