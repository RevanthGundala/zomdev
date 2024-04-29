"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { logOut } from "../app/actions/logOut";
import { redirect } from "next/navigation";
import { useSessionStorage } from "usehooks-ts";

export default function Navbar({ isConnected }: { isConnected: boolean }) {
  const [session, setSession, removeSession] = useSessionStorage(
    "session",
    "{}"
  );
  const [state, setState, removeState] = useSessionStorage("state", "{}");
  return (
    <NavigationMenu className="min-w-full fixed top-0 z-50 bg-white">
      <NavigationMenuList className="flex space-x-4 px-20 py-8 items-center">
        <NavigationMenuItem className="flex">
          <Link href="/" legacyBehavior passHref>
            <img src="/vercel.svg" alt="Logo" className="h-8" />
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex">
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex">
          <NavigationMenuTrigger>Entertainers</NavigationMenuTrigger>
          <NavigationMenuContent>
            {/* <ul className="flex flex-col space-y-2 py-1 px-1">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                ></ListItem>
              ))}
            </ul> */}
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex flex-1">
          <SearchBar />
        </NavigationMenuItem>
        <NavigationMenuItem className="flex">
          {/* <Feedback /> */}
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={[
                "bg-black text-white",
                navigationMenuTriggerStyle(),
              ].join(" ")}
            >
              Entertainer Sign Up
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="hover:cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isConnected ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <Link href="/profile">Profile</Link>
                    {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  {/* Rest of the menu items that are commented out */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <button
                    onClick={async () => {
                      removeSession();
                      removeState();
                      await logOut();
                    }}
                  >
                    Log out
                  </button>
                  {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <Link href="/login">Log In</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Creators",
    href: "/Creators",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Organizations",
    href: "/Organizations",
    description:
      "For sighted users to preview content available behind a link.",
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
