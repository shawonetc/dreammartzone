import PolicyPageTemplate from "../components/PolicyPageTemplate";

export const metadata = {
  title: "Return & Replacement Policy | Dream Mart",
  description: "Read Dream Mart's 24-hour freshness guarantee, return guidelines, and replacement policy.",
};

export default function ReturnsPage() {
  return (
    <PolicyPageTemplate
      slug="returns"
      defaultTitle="Return & Replacement Policy"
      breadcrumbLabel="Return Policy"
    />
  );
}
