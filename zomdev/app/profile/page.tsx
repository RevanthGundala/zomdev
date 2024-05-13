/**
 * v0 by Vercel.
 * @see https://v0.dev/t/MeSpDnKyjpf
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import ProfileClient from "./ProfileClient";
import ProfileServer from "./ProfileServer";

export default function Profile() {
  return (
    <ProfileClient>
      <ProfileServer />
    </ProfileClient>
  );
}
