import PolicyPageTemplate from "../components/PolicyPageTemplate";

export const metadata = {
  title: "Terms and Conditions | Dream Mart",
  description: "Read our official terms of service, ordering policies, and conditions.",
};

export default function TermsPage() {
  return (
    <PolicyPageTemplate
      slug="terms"
      defaultTitle="Terms & Conditions"
      breadcrumbLabel="Terms & Conditions"
    />
  );
}
