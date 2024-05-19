import { useEffect, useState } from "react";
import { useSessionStorage } from "usehooks-ts";

interface Checkout {
  bountyId: string;
  companyId: string;
  winner: string;
  reward: number;
}

export default function useCheckout() {
  const [checkout, setCheckout, removeCheckout] = useSessionStorage(
    "checkout",
    ""
  );

  const [isLoading, setIsLoading] = useState(false);
  const [bountyId, setBountyId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [reward, setReward] = useState<number | null>(null);

  useEffect(() => {
    if (checkout !== "") {
      setIsLoading(true);
      const deserializedCheckout = JSON.parse(checkout) as Checkout;
      const { bountyId, companyId, winner, reward } = deserializedCheckout;

      setBountyId(bountyId);
      setCompanyId(companyId);
      setWinner(winner);
      setReward(reward);
      setIsLoading(false);
    }
  }, [checkout]);

  return { isLoading, bountyId, companyId, winner, reward, removeCheckout };
}
