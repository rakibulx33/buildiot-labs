"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { primaryNav, secondaryNav, site } from "@/content/site";
import { Logo, LogoPlate } from "./Logo";
import { TLink } from "./TLink";

function isActive(pathname: string, href: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return path === href || path.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Tuck the header away while reading down the page; bring it back on any scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        if (Math.abs(y - last) < 8) return;
        setHidden(y > last && y > 200);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Show the header again after every navigation (state adjusted during render).
  const [shownFor, setShownFor] = useState(pathname);
  if (shownFor !== pathname) {
    setShownFor(pathname);
    setHidden(false);
  }

  useEffect(() => {
    document.documentElement.toggleAttribute("data-menu-open", menuOpen);
  }, [menuOpen]);

  const openMenu = useCallback(() => {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback((instant = false) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (instant) dialog.dataset.instant = "";
    dialog.close();
    if (instant) requestAnimationFrame(() => delete dialog.dataset.instant);
  }, []);

  return (
    <header
      className="site-header"
      data-hidden={hidden && !menuOpen ? "" : undefined}
      style={{ viewTransitionName: "site-header" }}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="wrap flex h-full items-center gap-6">
        <TLink href="/" className="shrink-0 rounded-[6px]" aria-label="BuildIoT Lab, home">
          <Logo height={42} />
        </TLink>

        <nav aria-label="Primary" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <TLink
                  href={item.href}
                  className="nav-link"
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <TLink href="/contact" className="btn btn-primary btn-sm hidden sm:inline-flex">
            <span className="btn-pad" aria-hidden="true" />
            Start a Project
          </TLink>
          <button
            ref={menuButtonRef}
            type="button"
            className="menu-button"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={openMenu}
          >
            <span className="menu-button-lines" aria-hidden="true" />
            Menu
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        id="site-menu"
        className="menu"
        aria-label="Site menu"
        onClose={() => {
          setMenuOpen(false);
          menuButtonRef.current?.focus({ preventScroll: true });
        }}
        onClick={(e) => {
          // A click on the dialog itself (not its content) closes it.
          if (e.target === e.currentTarget) closeMenu();
        }}
      >
        <div className="wrap flex min-h-full flex-col">
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <LogoPlate height={34} />
            <button type="button" className="menu-close" onClick={() => closeMenu()}>
              Close
            </button>
          </div>

          <div className="menu-grid">
            <nav aria-label="Lab" className="menu-col">
              <p className="menu-heading">The lab</p>
              <ul>
                {primaryNav.map((item, i) => (
                  <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                    <TLink
                      href={item.href}
                      className="menu-link"
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                      onClick={() => closeMenu(true)}
                    >
                      <span className="menu-link-label">{item.label}</span>
                      <span className="menu-link-blurb">{item.blurb}</span>
                    </TLink>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Studio" className="menu-col">
              <p className="menu-heading">Working with us</p>
              <ul>
                {secondaryNav.map((item, i) => (
                  <li key={item.href} style={{ "--i": i + primaryNav.length } as React.CSSProperties}>
                    <TLink
                      href={item.href}
                      className="menu-link menu-link-sm"
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                      onClick={() => closeMenu(true)}
                    >
                      <span className="menu-link-label">{item.label}</span>
                      <span className="menu-link-blurb">{item.blurb}</span>
                    </TLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="menu-foot">
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
