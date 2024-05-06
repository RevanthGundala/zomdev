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
import { LogOut, User, LogIn, BookHeart } from "lucide-react";
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
  const { removeZkLoginSession } = useZkLoginSession();
  const { removeZkLoginState } = useZkLoginState();
  return (
    <NavigationMenu className="min-w-full fixed top-0 z-50 bg-white">
      <NavigationMenuList className="flex space-x-6 px-20 py-10 items-center">
        <NavigationMenuItem className="flex">
          <Link href="/" legacyBehavior passHref>
            <img src="/vercel.svg" alt="Logo" className="h-8" />
          </Link>
        </NavigationMenuItem>
        {/* <NavigationMenuItem className="flex">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}
        <NavigationMenuItem className="flex">
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {/* <NavigationMenuItem className="flex">
          <Link href="/companies" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Companies
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}
        <NavigationMenuItem className="flex flex-1"></NavigationMenuItem>
        <NavigationMenuItem className="flex">
          <Link href="/bounties" legacyBehavior passHref>
            <NavigationMenuLink
              className={[
                "bg-black text-white",
                navigationMenuTriggerStyle(),
              ].join(" ")}
            >
              Bounties
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {true ? (
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

              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookHeart className="mr-2 h-4 w-4" />
                  <Link href="/bounties/create">Create Bounty</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookHeart className="mr-2 h-4 w-4" />
                  <Link href="/bounties/view">My Bounties</Link>
                </DropdownMenuItem>
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
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <NavigationMenuItem className="flex">
            <Link href="/contact" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Contact
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
