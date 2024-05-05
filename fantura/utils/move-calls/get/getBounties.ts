const data = [
  {
    id: 1,
    company: "MystenLabs",
    image: "./next.png",
    title: "Fix Consensus Protocol",
    description:
      "Add to Mystecity and find and fix the bugAdd to Mystecity and find and fix the bugasdfasdfasdfaAdd to Mystecity and find and fix the sdfafasdfsdafasdfafix the sdfafasdfsdafasdfa",
    reward: "$1000",
    dateCreated: "4 days ago",
    dateEnd: "due 2 days from now",
    applicants: 5,
    status: "open",
  },
  {
    id: 2,
    company: "MystenLabs",
    image: "./next.png",
    title: "Fix Consensus Protocol",
    description:
      "Add to Mystecity and find and fix the bugAdd to Mystecity and find and fix the bugasdfasdfasdfaAdd to Mystecity and find and fix the sdfafasdfsdafasdfafix the sdfafasdfsdafasdfa",
    reward: "$1000",
    dateCreated: "4 days ago",
    dateEnd: "due 2 days from now",
    applicants: 5,
    status: "open",
  },
];

export function getBounties() {
  return data;
}
