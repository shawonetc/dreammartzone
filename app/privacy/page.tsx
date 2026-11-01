import PolicyPageTemplate from "../components/PolicyPageTemplate";

export const metadata = {
  title: "Privacy Policy | Dream Mart",
  description: "Learn how Dream Mart protects your privacy, personal information, and data security.",
};

export default function PrivacyPage() {
  return (
    <PolicyPageTemplate
      slug="privacy"
      defaultTitle="Privacy Policy"
      breadcrumbLabel="Privacy Policy"
    />
  );
}
