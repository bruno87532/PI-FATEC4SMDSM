import { Module } from '@nestjs/common';
import { StreamToBufferService } from './stream-to-buffer.service';

@Module({
  providers: [StreamToBufferService],
  exports: [StreamToBufferService]
})
export class StreamToBufferModule {}
