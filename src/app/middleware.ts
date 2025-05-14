// // src/app/middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const token = req.cookies.get("token")?.value;

//   // если не залогинен и не на /login — редирект на /login
//   if (!token && !pathname.startsWith("/login")) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // если залогинен и зашёл на /login — редирект на /home
//   if (token && pathname === "/login") {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|api).*)"],
// };
