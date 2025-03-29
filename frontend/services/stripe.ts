export class StripeService {
    private static pathBackend = process.env.NEXT_PUBLIC_BACKEND;

    static async createCheckout(price: string) {
        const res = await fetch(this.pathBackend + "/stripe/create-checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ price })
        });
        if (!res.ok) {
            throw new Error("Failed to create checkout");
        }
        const data = await res.json();
        return data.client_secret;
    }
}
