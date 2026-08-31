import { Metadata } from "next";
import SignInClient from "./SignInClient";

export const metadata: Metadata = {
  title: "Sign In / Register | Dream Mart",
  description: "Sign in or create a new account at Dream Mart to track your organic grocery orders, manage your wishlist, and save your shopping cart.",
};

export default function Page() {
  return <SignInClient />;
}
