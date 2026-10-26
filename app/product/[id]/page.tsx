import { Metadata } from "next";
import { getProductById, normalizeProduct } from "../../data/products";
import ProductDetailClient from "./ProductDetailClient";
import { supabase } from "../../lib/supabaseClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  let product: any = null;

  try {
    const { data } = await supabase.from("products").select("*").eq("id", resolvedParams.id).maybeSingle();
    if (data) product = normalizeProduct(data);
  } catch (e) {
    // ignore
  }

  if (!product) {
    product = getProductById(resolvedParams.id);
  }

  if (!product) {
    return {
      title: "Product Not Found | Dream Mart",
      description: "The requested product could not be found.",
    };
  }

  const title = `${product.name} | Dream Mart`;
  const description = product.shortDescription || product.longDescription || `Buy ${product.name} at Dream Mart. Category: ${product.category}. Price: ৳${product.price}`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  return <ProductDetailClient id={resolvedParams.id} />;
}
