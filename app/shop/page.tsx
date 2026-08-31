import { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop Organic Fruits & Groceries | Dream Mart",
  description: "Explore the wide selection of premium organic fruits, dates, honey, ghee, and groceries available at Dream Mart. Fast and reliable delivery in Bangladesh.",
};

export default function Page() {
  return <ShopClient />;
}
