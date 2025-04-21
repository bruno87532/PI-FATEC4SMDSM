import { Test, TestingModule } from '@nestjs/testing';
import { StreamToBufferService } from './stream-to-buffer.service';

describe('StreamToBufferService', () => {
  let service: StreamToBufferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamToBufferService],
    }).compile();

    service = module.get<StreamToBufferService>(StreamToBufferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
