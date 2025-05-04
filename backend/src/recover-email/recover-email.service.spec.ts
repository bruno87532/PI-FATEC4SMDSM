import { Test, TestingModule } from '@nestjs/testing';
import { RecoverEmailService } from './recover-email.service';

describe('RecoverEmailService', () => {
  let service: RecoverEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecoverEmailService],
    }).compile();

    service = module.get<RecoverEmailService>(RecoverEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
