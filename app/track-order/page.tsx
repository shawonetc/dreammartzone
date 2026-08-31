import { Metadata } from "next";
import TrackOrderClient from "./TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order | Dream Mart",
  description: "Check the active shipment and delivery status of your Dream Mart order. Enter your Order ID to see real-time progress updates.",
};

export default function Page() {
  return <TrackOrderClient />;
}
