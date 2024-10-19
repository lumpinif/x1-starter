import { GithubLink } from "@/components/github-link";
import { LocaleSwitch } from "@/components/locale/locale-switch";
export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-end items-center">
        <GithubLink />
        <LocaleSwitch />
      </header>
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
