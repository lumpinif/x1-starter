import { ViewTransitions } from "next-view-transitions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ViewTransitions>{children}</ViewTransitions>;
}
