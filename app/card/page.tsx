import BusinessCardClient from "@/components/business-card-client";

export default async function BusinessCardPage() {
  const contactPhone = process.env.PHONE_NUMBER || null;

  return (
    <BusinessCardClient contactPhone={contactPhone} />
  );
}
