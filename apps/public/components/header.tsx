"use client";

import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useSession} from "@repo/utils/auth";
import {Menu, PlusCircle, X} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import MemberSwitcher from "./member-switcher";

const PublicLinks = [
  {href: "/", label: "Home"},
  {href: "/projects", label: "Projects"},
  {href: "/blogs", label: "Blog"},
  {href: "/about", label: "About"},
  {href: "/faq", label: "FAQ"},
  {href: "/contact", label: "Contact"},
];

export default function Header() {
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {session} = useSession();
  return (
    <header className="bg-background flex h-24 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link className="text-primary flex items-center text-2xl font-bold" href="/">
          <Image alt="" height={60} src="/upwc.png" width={60} />
          UPwithCrowd
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-8 text-lg">
            {PublicLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className={cn("text-foreground hover:text-primary ye", pathName === link.href && "text-primary")}
                  href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-x-4">
          {session !== null ? (
            <div className="flex items-center space-x-6">
              <Link className="flex items-center justify-center gap-2" href="/projects/new">
                <PlusCircle className="text-primary size-5" />
                Start a Project
              </Link>
              <MemberSwitcher />
            </div>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        <button
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isMenuOpen ? (
        <nav className="mt-4 md:hidden">
          <ul className="flex flex-col space-y-2">
            {PublicLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className={cn(
                    "text-foreground hover:text-primary block py-2",
                    pathName === link.href && "text-primary",
                  )}
                  href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Button className="w-full">{session?.user ? "Start a Project" : "Sign up"}</Button>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
