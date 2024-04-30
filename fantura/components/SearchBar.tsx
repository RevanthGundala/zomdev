/**
 * v0 by Vercel.
 * @see https://v0.dev/t/kXCfzvEV4Xj
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      // Assert that event.target is an HTMLInputElement
      const target = event.target as HTMLInputElement;
      const value = target.value; // Now TypeScript knows target has a 'value' property
      // Use router to navigate
      router.push(`/team/${value}`);
    }
  }

  return (
    <div className="relative w-full max-w-[600px] shadow-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <SearchIcon className="w-5 h-5 text-gray-400" />
      </div>
      <Input
        className="block w-full p-6 pl-10 text-lg text-gray-900 rounded-md bg-gray-50 focus:outline-none focus:shadow-md"
        placeholder="Search..."
        type="search"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
