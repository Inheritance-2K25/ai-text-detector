"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import logoImage from "./AItextdetectorLogo.jpeg";

export default function Navbar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme) {
      const shouldBeDark = savedTheme === "dark";
      setDark(shouldBeDark);
      // Apply immediately
      if (shouldBeDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Apply theme when dark state changes
  useEffect(() => {
    if (!mounted) return;
    
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark, mounted]);

  const toggleTheme = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDark((prev) => {
      const newValue = !prev;
      // Immediately apply the change
      if (newValue) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newValue;
    });
  };

  const navLinks = [
    { href: "/", label: "AI Text Detector" },
    { href: "/plagiarism-checker", label: "Plagiarism Checker" },
    { href: "/grammar-checker", label: "Grammar Checker" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity group">
            <div className="relative h-14 w-auto flex items-center justify-center">
              <Image
                src={logoImage}
                alt="AI Text Detector Logo"
                width={200}
                height={56}
                className="object-contain h-full w-auto"
                priority
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group"
                >
                  <span
                    className={`
                      text-sm font-semibold transition-all duration-300
                      ${
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                      }
                    `}
                  >
                    {link.label}
                  </span>
                  
                  {/* Active indicator */}
                  <span
                    className={`
                      absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400
                      transition-all duration-300 ease-out
                      ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                    `}
                  />
                  
                  {/* Active background glow */}
                  {isActive && (
                    <span className="absolute inset-0 -z-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg blur-sm opacity-50 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4 pt-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
