import { Metadata } from "next";
import CategoryClient from "./CategoryClient";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedCategory = decodeURIComponent(resolvedParams.name);
  
  return {
    title: `${decodedCategory} Products | Dream Mart`,
    description: `Browse our fresh, premium selection of organic ${decodedCategory.toLowerCase()} products at Dream Mart Bangladesh. Freshness and quality guaranteed.`,
  };
}

export default async function Page() {
  return <CategoryClient />;
}
