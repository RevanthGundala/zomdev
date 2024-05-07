/**
 * v0 by Vercel.
 * @see https://v0.dev/t/WlShzUkfWvh
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DeleteAccount() {
  async function deleteAccount() {}
  return (
    <div className="mx-auto max-w-md space-y-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Delete Your Account</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Deleting your account will permanently remove all your data and
          content. This action cannot be undone.
        </p>
      </div>
      <div className="space-y-4">
        <Button
          className="w-full"
          variant="destructive"
          onClick={deleteAccount}
        >
          Delete Account
        </Button>
        <Link className="w-full" href="/">
          Cancel
        </Link>
      </div>
    </div>
  );
}
