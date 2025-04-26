import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PlanService } from 'src/plan/plan.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class HighlitProductsService {
  constructor(
    private readonly planService: PlanService,
    private readonly subscriptionService: SubscriptionService,
    private readonly productService: ProductService,
  ) { }

  async featuredProductHome() {
    try {
      const plans = await this.planService.getPlan()
      const plansToFeature = await plans.filter((plan) => ["Plano médio mensal", "Plano avançado mensal", "Plano médio anual", "Plano avançado anual"].includes(plan.name))
      const subscriptionsArr = await Promise.all(
        plansToFeature.map(async (plan) => {
          return await this.subscriptionService.getSubscriptionsActivateByIdPlan(plan.id)
        })
      )
      const products = await Promise.all(subscriptionsArr.map(
        (subscriptions) => {
          subscriptions.map(
            async (subscription) => {
              return await this.productService.getProductsByIdUser(subscription.idUser)
            }
          )
        }
      ))
    } catch (error) {
      console.error("An error ocurred while organized products for the home", error)
      throw new InternalServerErrorException("An error ocurred while organized products for the home")
    }
  }
}
