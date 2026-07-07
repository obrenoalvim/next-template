import Link from "next/link";
import { Boxes, KeyRound, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const stack = [
  "Next.js 16",
  "TypeScript",
  "Tailwind v4",
  "shadcn/ui",
  "Postgres",
  "Drizzle",
  "Better Auth",
  "Docker",
];

const features = [
  {
    icon: KeyRound,
    title: "Auth built in",
    description:
      "Email/password login with Better Auth, sessions, and a protected route example.",
  },
  {
    icon: Layers,
    title: "Real database",
    description:
      "Postgres + Drizzle ORM, schema and migrations ready to extend.",
  },
  {
    icon: Boxes,
    title: "Runs in Docker",
    description:
      "App and database both containerized — clone, migrate, and go.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-20">
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <span className="text-muted-foreground rounded-full border px-3 py-1 text-xs">
          Base template
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          next-template
        </h1>
        <p className="text-muted-foreground max-w-lg text-lg">
          A pre-wired starting point for new projects: auth, a real database,
          and Docker already configured so you can skip the setup and start
          building.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" render={<Link href="/register" />}>
            Get started
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/login" />}>
            Sign in
          </Button>
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pt-2 text-xs">
          {stack.map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {item}
              {i < stack.length - 1 ? (
                <span className="text-border">·</span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-16 grid w-full max-w-3xl gap-6 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col gap-2 rounded-xl border p-5"
          >
            <Icon className="text-primary size-5" />
            <h2 className="font-medium">{title}</h2>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
