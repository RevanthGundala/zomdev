const data = {
  id: 1,
  company: "MystenLabs",
  image: "./next.png",
  title: "Fix Consensus Protocol",
  description:
    "Mystecity and find and fix the bugasdfasdfasdfaAdd to Mystecity and find and fix the sdfafasdfsdafasdfafix the sdfafasdfsdafasdfa",
  reward: "$1000",
  dateCreated: "4 days ago",
  dateEnd: "due 2 days from now",
  applicants: 5, // should be array
  status: "open",
};

export function getBounty() {
  return data;
}
