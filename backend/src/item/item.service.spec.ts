import { Test, TestingModule } from '@nestjs/testing';
import { itemservice } from './item.service';

describe('itemservice', () => {
  let service: itemservice;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [itemservice],
    }).compile();

    service = module.get<itemservice>(itemservice);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
