import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import { LoginButton } from "@/components/login-button";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher currentLocale={locale} />
      </div>

      <main className="text-center px-4">
        <div className="mb-8">
          <span className="text-8xl block mb-4">🎅</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-base-content mb-4">
            {messages.header.title}
          </h1>
          <p className="text-lg text-base-content/70 max-w-md mx-auto">
            {messages.auth.signInPrompt}
          </p>
        </div>

        <LoginButton />

        <div className="mt-12 flex gap-8 justify-center text-6xl">
          <span>🎁</span>
          <span>🎄</span>
          <span>⭐</span>
        </div>
      </main>

      <footer className="absolute bottom-4 text-base-content/50 text-sm">
        © {new Date().getFullYear()} Secret Santa App
      </footer>
    </div>
  );
}
