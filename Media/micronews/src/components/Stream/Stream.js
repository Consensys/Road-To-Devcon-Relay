import React, { useState } from "react";
import StreamCard from "./StreamCard";
import StreamNav from "../Nav/Nav";
import "./Stream.css";

const ITEMS = [
  {
    channel: "gaming",
    subheader: "Posted by Creator472 2 hours ago",
    title: "Counterstrike Global Offensive: Six Keys to Success",
    body:
      "I first discovered Counterstrike when I was 12 years old. The gameplay was...",
    upvotes: 2,
    downvotes: 0
  },
  {
    channel: "gaming",
    subheader: "Posted by bigmicrouser 6 hours ago",
    title: "Happy birthday Minecraft: Here's a picture I drew",
    body:
      "I tried to make it look like something you'd see in the original box...",
    upvotes: 5,
    downvotes: 2
  },
  {
    channel: "gaming",
    subheader: "Posted by realgamermike 7 hours ago",
    title: "This NPC went next level",
    body: "Who did this animation?? It looks like something is off...",
    upvotes: 4,
    downvotes: 0
  }
];

const CHANNELS = [
  "gaming",
  "film",
  "crypto"
]

function Stream() {
  const [activeChannel, setActiveChannel] = useState(0);

  return (
    <div className="d-flex">
      <StreamNav activeChannel={activeChannel} setActiveChannel={setActiveChannel} />
      <div className="d-flex flex-column stream">
        <h2 className="channel-headline mt-4">{`m/${CHANNELS[activeChannel]}`}</h2>
        <div className="mx-auto pr-5 d-flex flex-column mt-2">
          {ITEMS.map((item, i) => {
            return <StreamCard hideStream={activeChannel !== 0} item={item} key={i} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Stream;
