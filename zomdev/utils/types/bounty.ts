export type Bounty = {
  id: string;
  title: string;
  description: string;
  requirements: string;
  reward: number;
  submissions: string[];
  createdAt: string;
  deadline: string;
};

export type Company = string;

export type BountyInfo = {
  bounty: Bounty;
  company: Company;
};
