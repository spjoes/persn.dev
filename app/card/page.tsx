import type { Metadata } from "next";
import { BusinessCard } from "@/components/business-card";

export const metadata: Metadata = {
  title: "Card",
  description: "Joseph Kerper, contact card.",
};

export default function BusinessCardPage() {
  const contactPhone = process.env.PHONE_NUMBER || null;
  return <BusinessCard contactPhone={contactPhone} />;
}
