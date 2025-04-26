import { Test, TestingModule } from '@nestjs/testing';
import { HighlitProductsService } from './highlit-products.service';

describe('HighlitProductsService', () => {
  let service: HighlitProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HighlitProductsService],
    }).compile();

    service = module.get<HighlitProductsService>(HighlitProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
