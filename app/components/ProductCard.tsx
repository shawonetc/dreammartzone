"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";

export interface ProductItem {
  id: string;
  name: string;
  price: number | string;
  originalPrice?: number | string;
  image: string;
}

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setIsCartOpen } = useCart();
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300 group">
      <Link href={`/product/${product.id}`} className="block cursor-pointer">
        {/* Product Image */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3.5 bg-slate-50">
          <Image
            src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300"}
            alt={product.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Product Title */}
        <h3 className="text-xs sm:text-sm font-semibold text-slate-800 mb-2.5 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>

        {/* Product Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-base sm:text-lg font-bold text-slate-900">
            ৳{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              ৳{product.originalPrice}
            </span>
          )}
        </div>
      </Link>


      {/* Action Buttons */}
      <div className="flex flex-col gap-2 w-full pt-1">
        <button
          type="button"
          onClick={() => {
            addToCart(product, 1);
            setIsCartOpen(true);
          }}
          className="w-full py-2.5 px-4 bg-[#4E1C80] hover:bg-[#2D0C5F] active:bg-[#1d0741] text-white text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer text-center shadow-2xs"
        >
          Buy Now
        </button>
        <button
          type="button"
          onClick={() => addToCart(product, 1)}
          className="w-full py-2.5 px-4 bg-white hover:bg-[#f5f2f7] active:bg-[#eae4f0] text-[#4E1C80] border border-[#4E1C80] text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer text-center"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
