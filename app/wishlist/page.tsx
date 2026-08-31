import { Metadata } from "next";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "My Wishlist | Dream Mart",
  description: "View and manage your saved items in your Dream Mart Wishlist. Keep track of your favorite organic fruits and groceries.",
};

export default function Page() {
  return <WishlistClient />;
}
