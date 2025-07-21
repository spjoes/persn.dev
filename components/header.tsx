"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    if (isHomePage) {
      // If we're on the home page, scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If we're not on the home page, navigate to home page with hash
      window.location.href = `/#${sectionId}`;
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
                <a
                  href="/#about"
                  onClick={(e) => scrollToSection(e, "about")}
                  className="text-sm font-medium transition hover:text-zinc-400"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/#projects"
                  onClick={(e) => scrollToSection(e, "projects")}
                  className="text-sm font-medium transition hover:text-zinc-400"
                >
                  Projects
                </a>
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
                <a
                  href="/#contact"
                  onClick={(e) => scrollToSection(e, "contact")}
                  className="text-sm font-medium transition hover:text-zinc-400"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 