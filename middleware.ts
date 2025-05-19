// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("access");  // теперь должен найти cookie 'access'
  const isLoginPage = url.pathname === "/login";

  if (!token && !isLoginPage) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (token && isLoginPage) {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next|favicon.ico).*)"] };
