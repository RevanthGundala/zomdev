import React from "react";
import { cn } from "../../lib/utils";

export default function ImageSection() {
  const cards = [
    {
      id: 1,
      className: "md:col-span-2",
      thumbnail: "/warriors.png",
      title: "Visit the Chase Center!",
      description:
        "Come on a tour of the Chase Center as we guide you through player locker rooms, secret entrances, and much more.",
      cost: "10,0000 Warrior Credits",
    },
    {
      id: 2,
      className: "col-span-1",
      thumbnail: "./swift.png",
      title: "Visit the Chase Center!",
      description:
        "Come on a tour of the Chase Center as we guide you through player locker rooms, secret entrances, and much more.",
      cost: "10,0000 Warrior Credits",
    },
    {
      id: 3,
      className: "col-span-1",
      thumbnail: "./mrbeast.png",
      title: "Visit the Chase Center!",
      description:
        "Come on a tour of the Chase Center as we guide you through player locker rooms, secret entrances, and much more.",
      cost: "10,0000 Warrior Credits",
    },
    {
      id: 4,
      className: "md:col-span-2",
      thumbnail: "./rock.png",
      title: "Visit the Chase Center!",
      description:
        "Come on a tour of the Chase Center as we guide you through player locker rooms, secret entrances, and much more.",
      cost: "10,0000 Warrior Credits",
    },
  ];
  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4">
      {/* {cards.map((card) => (
        <div
          key={card.id}
          className={`flex flex-col bg-white rounded-xl overflow-hidden ${card.className}`}
        >
          <img
            src={card.thumbnail}
            alt={card.title}
            className="rounded-xl w-full" // 'rounded-t-xl' rounds the top corners of the image
          />
          <div className="py-4">
            <h1 className="text-xl font-bold">{card.title}</h1>
            <p>{card.description}</p>
            <p className="font-semibold">{card.cost}</p>
          </div>
        </div>
      ))} */}
    </div>
  );
}
