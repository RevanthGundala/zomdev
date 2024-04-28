import { randomBytes } from "crypto";

enum SocialAccount {
  GOOGLE = "Google",
  X = "X",
}

type Account = {
  name: SocialAccount;
  img: string;
  connected: boolean;
};

function handleAuth(socialAccount: SocialAccount) {
  console.log("Authenticating: ", socialAccount);

  // TODO: switch to .env
  const params = new URLSearchParams({
    response_type: "code",
    client_id: "QVBFWTRuT0EzdzF6cFBkTHZxSkw6MTpjaQ",
    redirect_uri:
      "https://gaa876jg49.execute-api.us-west-2.amazonaws.com/stage/oauth2/x-callback",
    scope: "tweet.read%20users.read%20follows.read%20offline.access",
    state: "Fantura",
    code_challenge: generateCodeChallenge(),
    code_challenge_type: "S256",
  });
  const loginURL = `https://twitter.com/i/oauth2/authorize?${params}`;
  // console.log("loginURL", loginURL);
  router.push(loginURL);
}

function generateCodeChallenge(): string {
  function base64URLEncode(str: Buffer) {
    return str
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  const code_verifier = base64URLEncode(randomBytes(32));

  // Dependency: Node.js crypto module
  // https://nodejs.org/api/crypto.html#crypto_crypto
  function sha256(buffer: any) {
    return crypto.createHash("sha256").update(buffer).digest();
  }
  return base64URLEncode(sha256(code_verifier));
}

export default function ConnectedAccounts() {
  const socialAccounts: Account[] = [
    {
      name: SocialAccount.GOOGLE,
      img: "./google.svg",
      connected: true,
    },
    {
      name: SocialAccount.X,
      img: "./next.svg",
      connected: false,
    },
  ];

  return (
    <div className="mt-20">
      <h1>Connected Accounts</h1>
      <div className="flex flex-col space-y-6 bg-gray-200">
        {socialAccounts.map((account) => (
          <AccountDisplay key={account.name} account={account} />
        ))}
      </div>
    </div>
  );
}

function AccountDisplay({ account }: { account: Account }) {
  const { name, img, connected } = account;

  return (
    <div className="flex items-center">
      <div className="flex flex-1 space-x-4">
        <img src={img} alt={name} />
        <span>{name}</span>
      </div>
      <div>
        {connected ? (
          <button onClick={() => handleAuth(name)}>Disconnect</button>
        ) : (
          <button onClick={() => handleAuth(name)}>Connect</button>
        )}
      </div>
    </div>
  );
}
