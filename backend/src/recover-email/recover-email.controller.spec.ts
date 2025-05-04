import { Test, TestingModule } from '@nestjs/testing';
import { RecoverEmailController } from './recover-email.controller';

describe('RecoverEmailController', () => {
  let controller: RecoverEmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecoverEmailController],
    }).compile();

    controller = module.get<RecoverEmailController>(RecoverEmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
