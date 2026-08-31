import { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Shopping Cart | Dream Mart",
  description: "Review items in your Dream Mart Shopping Cart and complete your checkout via WhatsApp. Fast home delivery and secure service.",
};

export default function Page() {
  return <CartClient />;
}
