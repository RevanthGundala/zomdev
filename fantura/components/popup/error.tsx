/**
 * v0 by Vercel.
 * @see https://v0.dev/t/wm3SoBTLweP
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";

export default function ErrorPopup() {
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-red-500 p-3 text-white">
              <TriangleAlertIcon className="h-6 w-6" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-bold">Error!</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Something went wrong. Please try again.
              </p>
            </div>
            <Button className="w-full" variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TriangleAlertIcon(props) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
