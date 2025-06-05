import { HeroWithMockup } from "@/components/blocks/hero-with-mockup"

export function HeroDemo() {
  return (
    <HeroWithMockup
      title="Build better habits, one day at a time"
      description="Track your habits, build streaks, and achieve your goals with our intuitive habit tracking platform."
      primaryCta={{
        text: "Get Started",
        href: "/signup",
      }}
      secondaryCta={{
        text: "View on GitHub",
        href: "https://github.com/your-habit-tracker",
      }}
      mockupImage={{
        alt: "HabitVault Dashboard",
        width: 1248,
        height: 765,
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
      }}
    />
  )
} 