import { Test, TestingModule } from '@nestjs/testing';
import { RecoverPasswordsService } from './recover-passwords.service';

describe('RecoverPasswordsService', () => {
  let service: RecoverPasswordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecoverPasswordsService],
    }).compile();

    service = module.get<RecoverPasswordsService>(RecoverPasswordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
