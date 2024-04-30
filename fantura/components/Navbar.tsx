"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { logOut } from "../app/actions/auth/logOut";
import { useZkLoginSession } from "@/utils/contexts/zkLoginSession";
import { useZkLoginState } from "@/utils/contexts/zkLoginState";

export default function Navbar() {
  const { removeZkLoginSession, zkLoginSessionExists } = useZkLoginSession();
  const { removeZkLoginState } = useZkLoginState();
  return (
    <NavigationMenu className="min-w-full fixed top-0 z-50 bg-white">
      <NavigationMenuList className="flex space-x-6 px-20 py-10 items-center">
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
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Teams
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex flex-1">
          <SearchBar />
        </NavigationMenuItem>
        <NavigationMenuItem className="flex">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={[
                "bg-black text-white",
                navigationMenuTriggerStyle(),
              ].join(" ")}
            >
              Team Sign Up
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
            {zkLoginSessionExists ? (
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
                      removeZkLoginSession();
                      removeZkLoginState();
                      await logOut();
                    }}
                  >
                    Log out
                  </button>
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
