import PolicyPageTemplate from "../components/PolicyPageTemplate";

export const metadata = {
  title: "Shipping & Delivery Policy | Dream Mart",
  description: "Learn about Dream Mart's delivery coverage, speed, shipping fees, and Cash on Delivery across Bangladesh.",
};

export default function ShippingPage() {
  return (
    <PolicyPageTemplate
      slug="shipping"
      defaultTitle="Shipping & Delivery Policy"
      breadcrumbLabel="Shipping Policy"
    />
  );
}
