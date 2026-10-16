import { Metadata } from "next";
import { Suspense } from "react";
import SignInClient from "./SignInClient";

export const metadata: Metadata = {
  title: "Sign In / Register | Dream Mart",
  description: "Sign in or create a new account at Dream Mart to track your organic grocery orders, manage your wishlist, and save your shopping cart.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F5F2F7] text-purple-900 font-bold">Loading...</div>}>
      <SignInClient />
    </Suspense>
  );
}

