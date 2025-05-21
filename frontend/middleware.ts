import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"

type Payload = {
  exp: number;
  isAdvertiser: boolean;
}

export const middleware = async (request: NextRequest) => {
  const token = request.cookies.get("access_token")?.value
  const currentTime = Math.floor(Date.now() / 1000)
  const isMarketRoute = request.nextUrl.pathname.startsWith("/market")
  const isPurchaseConfirmationRoute = request.nextUrl.pathname.startsWith("/purchase-confirmation")
  const isPaymentsRoute = request.nextUrl.pathname.startsWith("/payments")
  
  if (isMarketRoute) {
    try {
      if (!token) throw new Error("access_token not found")
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
      const newPayload = payload as Payload

      if (!newPayload.isAdvertiser) throw new Error("access denied")
      if (newPayload.exp && newPayload.exp < currentTime) throw new Error("token expired")

    } catch (error) {
      console.error("An error ocurred while checking the token", error)
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  if (isPurchaseConfirmationRoute || isPaymentsRoute) {
    try {
      if (!token) throw new Error("access_token not found")
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
      const newPayload = payload as Payload
      if (newPayload.exp && newPayload.exp < currentTime) throw new Error("token expired")
    } catch (error) {
      console.error("An error ocurred while checking the token", error)
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
} 