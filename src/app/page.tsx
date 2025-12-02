import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import { LoginButton } from "@/components/login-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Snowfall } from "@/components/snowfall";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden snow-bg">
      {/* Snowfall Effect */}
      <Snowfall />
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 festive-bg pointer-events-none" />
      
      {/* Top Decorative Border */}
      <div className="absolute top-0 left-0 right-0 h-2 shimmer-border" />
      
      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 text-4xl opacity-30 animate-float hidden md:block">🎄</div>
      <div className="absolute top-16 right-12 text-3xl opacity-30 animate-float-delayed hidden md:block">⭐</div>
      <div className="absolute bottom-20 left-12 text-3xl opacity-30 animate-float-delayed hidden md:block">🎁</div>
      <div className="absolute bottom-16 right-8 text-4xl opacity-30 animate-float hidden md:block">🦌</div>
      
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher currentLocale={locale} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 z-10">
        <div className="text-center max-w-2xl mx-auto">
          {/* Animated Santa */}
          <div className="relative mb-8">
            <div className="text-[120px] sm:text-[150px] animate-bounce-subtle inline-block">
              🎅
            </div>
            {/* Sparkle effects around Santa */}
            <span className="absolute top-4 left-1/4 text-2xl animate-sparkle">✨</span>
            <span className="absolute top-8 right-1/4 text-xl animate-sparkle" style={{ animationDelay: '0.3s' }}>✨</span>
            <span className="absolute bottom-12 left-1/3 text-lg animate-sparkle" style={{ animationDelay: '0.6s' }}>✨</span>
          </div>

          {/* Title with Gradient */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 gradient-text drop-shadow-lg">
            {messages.header.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-base-content/80 mb-10 max-w-lg mx-auto leading-relaxed">
            {messages.auth.signInPrompt}
          </p>

          {/* Login Button with Glow */}
          <div className="animate-pulse-glow rounded-2xl p-1 inline-block bg-gradient-to-r from-primary via-secondary to-accent">
            <div className="bg-base-100 rounded-xl p-1">
              <LoginButton />
            </div>
          </div>

          {/* Feature Icons */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="flex flex-col items-center gap-3 group">
              <div className="text-5xl sm:text-6xl animate-float group-hover:scale-125 transition-transform duration-300">
                🎁
              </div>
              <span className="text-sm text-base-content/60 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {locale === 'es' ? 'Regalos' : 'Gifts'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="text-5xl sm:text-6xl animate-float-delayed group-hover:scale-125 transition-transform duration-300">
                🎄
              </div>
              <span className="text-sm text-base-content/60 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {locale === 'es' ? 'Festividad' : 'Holiday'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="text-5xl sm:text-6xl animate-float group-hover:scale-125 transition-transform duration-300" style={{ animationDelay: '0.25s' }}>
                ⭐
              </div>
              <span className="text-sm text-base-content/60 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {locale === 'es' ? 'Magia' : 'Magic'}
              </span>
            </div>
          </div>

          {/* Additional decorative elements */}
          <div className="mt-12 flex justify-center gap-4 text-3xl opacity-50">
            <span className="animate-bounce-subtle" style={{ animationDelay: '0s' }}>🔔</span>
            <span className="animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>🎀</span>
            <span className="animate-bounce-subtle" style={{ animationDelay: '0.4s' }}>🍪</span>
            <span className="animate-bounce-subtle" style={{ animationDelay: '0.6s' }}>🥛</span>
            <span className="animate-bounce-subtle" style={{ animationDelay: '0.8s' }}>🔔</span>
          </div>
        </div>
      </main>

      {/* Footer with decorative border */}
      <footer className="relative py-6 text-center z-10">
        <div className="absolute bottom-0 left-0 right-0 h-2 shimmer-border" />
        <div className="flex items-center justify-center gap-2 text-base-content/60 text-sm">
          <span>🎄</span>
          <span>© {new Date().getFullYear()} Secret Santa App</span>
          <span>🎄</span>
        </div>
      </footer>
    </div>
  );
}
