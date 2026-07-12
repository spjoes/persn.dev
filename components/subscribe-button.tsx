"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Icon } from "./icons";

export function SubscribeButton() {
  return (
    <div className="flex w-fit overflow-hidden rounded-lg border border-[var(--line)] text-sm text-[var(--ink-dim)] transition-colors hover:border-[var(--line-strong)]">
      <a
        href="/rss.xml"
        className="inline-flex items-center gap-2 px-3 py-2 transition-colors hover:bg-white/[0.04] hover:text-white"
      >
        <Icon.rss className="h-4 w-4" />
        Subscribe via RSS
      </a>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger
          className="inline-flex w-9 cursor-pointer items-center justify-center border-l border-[var(--line)] transition-colors hover:bg-white/[0.04] hover:text-white focus:outline-none"
          aria-label="More feed options"
        >
          <Icon.chevronDown className="h-4 w-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            onCloseAutoFocus={(e) => e.preventDefault()}
            className="z-50 min-w-44 rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] p-1 text-sm text-[var(--ink-dim)] shadow-xl shadow-black/40"
          >
            <DropdownMenu.Item asChild>
              <a
                href="/atom.xml"
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 outline-none transition-colors hover:bg-white/[0.05] hover:text-white data-[highlighted]:bg-white/[0.05] data-[highlighted]:text-white"
              >
                <Icon.atom className="h-4 w-4" />
                Atom feed
              </a>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
