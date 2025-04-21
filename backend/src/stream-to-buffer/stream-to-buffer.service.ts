import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class StreamToBufferService {
  async streamToBuffer(stream: Readable) {
    const chunks: Uint8Array[] = []

    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
    }
  
    return Buffer.concat(chunks)
  }
}
