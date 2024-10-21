import { GithubLink } from "@/components/github-link";
import { LocaleSwitch } from "@/components/locale/locale-switch";
export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-end p-4">
        <GithubLink />
        <LocaleSwitch />
      </header>
      <main className="flex flex-grow items-center justify-center">
        {children}
      </main>
    </div>
  );
}
