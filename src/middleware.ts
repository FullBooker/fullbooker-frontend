import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const bypassDomain = "beta.mowinbet.com";
  const requestHost = req.headers.get("host");

  // if (requestHost && requestHost.includes(bypassDomain)) {
  //   return NextResponse.next();
  // }

  if (basicAuth) {
    // const authValue = basicAuth.split(" ")[1];
    // const [user, pwd] = Buffer.from(authValue, "base64").toString().split(":");

    // const validUser = process.env.NEXT_BASIC_AUTH_USER || "admin";
    // const validPassword = process.env.NEXT_BASIC_AUTH_PASSWORD || "@dmin123";

    // if (user === validUser && pwd === validPassword) {
      return NextResponse.next();
    // }
  }

  // return new Response("Auth required", {
  //   status: 401,
  //   headers: {
  //     "WWW-Authenticate": 'Basic realm="Secure Area"',
  //   },
  // });
}
