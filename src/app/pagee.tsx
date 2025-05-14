// // src/app/page.tsx
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// export default async function RootPage() {
//   const token = (await cookies()).get("token")?.value;

//   if (!token) {
//     redirect("/login");
//   } else {
//     redirect("/home");
//   }
// }
