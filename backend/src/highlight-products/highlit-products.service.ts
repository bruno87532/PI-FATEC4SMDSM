import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PlanService } from 'src/plan/plan.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { ProductService } from 'src/product/product.service';
import { UsersService } from 'src/users/users.service';
import { FeaturedProductByPartialNameDto } from './dto/featured-product-by-partial-name.dto';

@Injectable()
export class HighlightProductsService {
  constructor(
    private readonly planService: PlanService,
    private readonly subscriptionService: SubscriptionService,
    private readonly productService: ProductService,
    private readonly usersService: UsersService
  ) { }

  async featuredProductsHome() {
    try {
      const namePlans = [
        "Plano médio mensal",
        "Plano avançado mensal",
        "Plano médio anual",
        "Plano avançado anual"
      ];

      return await this.organizedProducts(namePlans)
    } catch (error) {
      console.error("An error ocurred while organized products for the home", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while organized products for the home")
    }
  }

  async featureProducts() {
    try {
      const namePlans = [
        "Plano básico mensal",
        "Plano médio mensal",
        "Plano avançado mensal",
        "Plano básico anual",
        "Plano médio anual",
        "Plano avançado anual"
      ];

      return await this.organizedProducts(namePlans)
    } catch (error) {
      console.error("An error ocurred while organized products for the page", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while organized products for the page")
    }
  }

  private async organizedProducts(namePlans: string[]) {
    const plans = await this.planService.getPlan();
    const plansToFeature = plans.filter(plan => namePlans.includes(plan.name));

    const subscriptionsArr = await Promise.all(
      plansToFeature.map(plan =>
        this.subscriptionService.getSubscriptionsActivateByIdPlan(plan.id)
      )
    );

    const idUsers = subscriptionsArr.flat().map(subscription => subscription.idUser);
    const users = await this.usersService.getUsersByIds(idUsers);

    const productsArr = await Promise.all(
      subscriptionsArr.map(subscriptions =>
        Promise.all(
          subscriptions.map(subscription =>
            this.productService.getProductsByIdUser(subscription.idUser)
          )
        )
      )
    );

    const result: Record<string, Record<string, any[]>> = {};

    plansToFeature.forEach((plan, planIndex) => {
      result[plan.name] = {};

      productsArr[planIndex].forEach(productList => {
        if (productList.length > 0) {
          const user = users.find(user => user.id === productList[0].idUser);
          if (user) {
            result[plan.name][user.advertiserName!] = productList;
          }
        }
      });
    });

    return result;
  }

  async featuredProductsHomeByPartialName(data: FeaturedProductByPartialNameDto) {
    try {
      const namePlans = [
        "Plano básico mensal",
        "Plano médio mensal",
        "Plano avançado mensal",
        "Plano básico anual",
        "Plano médio anual",
        "Plano avançado anual"
      ];

      return await this.organizedProductsByPartialName(namePlans, data.partialName)
    } catch (error) {
      console.error("An error ocurred while organized products for the page", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while organized products for the page")
    }
  }

  async featuredProductsPageByPartialName(data: FeaturedProductByPartialNameDto) {
    try {
      const namePlans = [
        "Plano médio mensal",
        "Plano avançado mensal",
        "Plano médio anual",
        "Plano avançado anual"
      ];

      return await this.organizedProductsByPartialName(namePlans, data.partialName)
    } catch (error) {
      console.error("An error ocurred while organized products for the home", error)
      if (error instanceof HttpException) throw error
      throw new InternalServerErrorException("An error ocurred while organized products for the home")
    }
  }


  private async organizedProductsByPartialName(namePlans: string[], partialName: string) {
    const plans = await this.planService.getPlan();
    const plansToFeature = plans.filter(plan => namePlans.includes(plan.name));

    const subscriptionsArr = await Promise.all(
      plansToFeature.map(plan =>
        this.subscriptionService.getSubscriptionsActivateByIdPlan(plan.id)
      )
    );

    const idUsers = subscriptionsArr.flat().map(subscription => subscription.idUser);
    const users = await this.usersService.getUsersByIds(idUsers);

    const productsArr = await Promise.all(
      subscriptionsArr.map(subscriptions =>
        Promise.all(
          subscriptions.map(subscription =>
            this.productService.getProductsByPartialNameId(subscription.idUser, partialName)
          )
        )
      )
    );

    const result: Record<string, Record<string, any[]>> = {};

    plansToFeature.forEach((plan, planIndex) => {
      result[plan.name] = {};

      productsArr[planIndex].forEach(productList => {
        if (productList.length > 0) {
          const user = users.find(user => user.id === productList[0].idUser);
          if (user) {
            result[plan.name][user.advertiserName!] = productList;
          }
        }
      });
    });

    return result;
  }

}
