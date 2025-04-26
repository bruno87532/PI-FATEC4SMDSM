import { Test, TestingModule } from '@nestjs/testing';
import { HighlitProductsController } from './highlit-products.controller';

describe('HighlitProductsController', () => {
  let controller: HighlitProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HighlitProductsController],
    }).compile();

    controller = module.get<HighlitProductsController>(HighlitProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
