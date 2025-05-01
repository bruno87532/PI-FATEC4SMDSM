import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionCancellingController } from './subscription-cancelling.controller';

describe('SubscriptionCancellingController', () => {
  let controller: SubscriptionCancellingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionCancellingController],
    }).compile();

    controller = module.get<SubscriptionCancellingController>(SubscriptionCancellingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
