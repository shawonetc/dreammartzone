import { Metadata } from "next";
import { Suspense } from "react";
import SignInClient from "./SignInClient";

export const metadata: Metadata = {
  title: "Sign In | Dream Mart",
  description: "Sign in to Dream Mart to access order management and admin dashboard.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F5F2F7] text-purple-900 font-bold">Loading...</div>}>
      <SignInClient />
    </Suspense>
  );
}

