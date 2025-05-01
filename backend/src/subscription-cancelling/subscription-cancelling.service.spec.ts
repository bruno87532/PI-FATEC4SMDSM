import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionCancellingService } from './subscription-cancelling.service';

describe('SubscriptionCancellingService', () => {
  let service: SubscriptionCancellingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionCancellingService],
    }).compile();

    service = module.get<SubscriptionCancellingService>(SubscriptionCancellingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
