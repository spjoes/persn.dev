"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-bold transition hover:opacity-80">
          Joseph Kerper
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/#about"
                  onClick={(e) => scrollToSection(e, "about")}
                  className="text-sm font-medium transition hover:text-zinc-400"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  onClick={(e) => scrollToSection(e, "projects")}
                  className="text-sm font-medium transition hover:text-zinc-400"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm font-medium transition hover:text-zinc-400"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  onClick={(e) => scrollToSection(e, "contact")}
                  className="text-sm font-medium transition hover:text-zinc-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 