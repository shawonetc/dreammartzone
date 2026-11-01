import PolicyPageTemplate from "../components/PolicyPageTemplate";

export const metadata = {
  title: "Refund Policy | Dream Mart",
  description: "Read our transparent and hassle-free refund process, channels, and timeframes.",
};

export default function RefundPage() {
  return (
    <PolicyPageTemplate
      slug="refund"
      defaultTitle="Refund Policy"
      breadcrumbLabel="Refund Policy"
    />
  );
}
