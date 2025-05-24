class StripeCheckoutManager {
  private static instance: StripeCheckoutManager
  private currentCheckout: any = null
  private isInitializing = false

  private constructor() {}

  static getInstance(): StripeCheckoutManager {
    if (!StripeCheckoutManager.instance) {
      StripeCheckoutManager.instance = new StripeCheckoutManager()
    }
    return StripeCheckoutManager.instance
  }

  async destroyCurrentCheckout(): Promise<void> {
    if (this.currentCheckout) {
      try {
        if (typeof this.currentCheckout.destroy === "function") {
          await this.currentCheckout.destroy()
        }
      } catch (error) {
        console.warn("Erro ao destruir checkout:", error)
      }
      this.currentCheckout = null
    }
    this.isInitializing = false
  }

  setCurrentCheckout(checkout: any): void {
    this.currentCheckout = checkout
  }

  isCheckoutInitializing(): boolean {
    return this.isInitializing
  }

  setInitializing(value: boolean): void {
    this.isInitializing = value
  }

  async waitForDestruction(): Promise<void> {
    while (this.currentCheckout || this.isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
}

export const stripeCheckoutManager = StripeCheckoutManager.getInstance()
