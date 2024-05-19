export type Company = {
  companyId: string;
  companyData: {
    name: string;
    completedPayouts: number;
  };
};

export type Bounty = { bountyId: string; bountyData: BountyData };

export type BountyData = {
  title: string;
  description: string;
  requirements: string;
  reward: number;
  submissions: Submission[];
  createdAt: string;
  deadline: string;
  winner: string | null;
};

export type Submission = {
  address: string;
  submissionLink: string;
};
