import React, { useState } from "react";
import film from "../../assets/film.png";
import gaming from "../../assets/gaming.png";
import crypto from "../../assets/crypto.png";

function NavItem({ setActiveItem, active, item: { img, text } }) {
  return (
    <div
      className={`nav-item-holder my-2 ${active ? "" : "inactive-nav-item"}`}
      onClick={setActiveItem}
    >
      <div className="mx-auto my-auto p-1">
        <img src={img} className="img-fluid" />
      </div>
    </div>
  );
}

const items = [
  {
    img: gaming,
    text: "Gaming"
  },
  {
    img: film,
    text: "Film"
  },
  {
    img: crypto,
    text: "Crypto"
  }
];

function Nav({ setActiveChannel, activeChannel }) {
  const [activeItem, setActiveItem] = useState(0);

  return (
    <div className="d-flex flex-column nav">
      <div className="d-flex flex-column my-auto pb-5">
        {items.map((item, i) => {
          return (
            <NavItem
              active={i === activeChannel}
              setActiveItem={() => setActiveChannel(i)}
              item={item}
              key={i}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Nav;
