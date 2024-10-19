import { SignOut } from "@/components/sign-out";
import { getI18n } from "@/locales/server";
import { getUser } from "@x1-starter/supabase/queries";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { data } = await getUser();
  const t = await getI18n();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center gap-4">
        <p>{t("welcome", { name: data?.user?.email })}</p>
        <SignOut />
      </div>
    </div>
  );
}
