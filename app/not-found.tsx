import Link from "next/link";
import { Icon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-mono text-sm text-[var(--accent)]">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-sm text-[var(--ink-dim)]">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="group mt-8 inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--line-strong)] hover:bg-white/[0.03]"
      >
        <Icon.arrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back home
      </Link>
    </div>
  );
}
