export class StripeService {
    static async createEmbbeded() {
        const url = process.env.NEXT_PUBLIC_BACKEND + "/stripe/create-checkout";

        console.log("URL: ", url);  
        const res = await fetch(url, {
            body: JSON.stringify({ product: "BASIC_MONTHLY" }),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error("Failed to create checkout");
        }
        const data = await res.json();

        return data;
    }
}
