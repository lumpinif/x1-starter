import { ViewTransitions } from "next-view-transitions";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <section className="w-full max-w-md">{children}</section>
    </ViewTransitions>
  );
}
