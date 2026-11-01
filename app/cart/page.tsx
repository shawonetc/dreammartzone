import { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Shopping Cart | Dream Mart",
  description: "Review items in your Dream Mart Shopping Cart and complete your checkout securely. Fast home delivery and Cash on Delivery service.",
};

export default function Page() {
  return <CartClient />;
}
