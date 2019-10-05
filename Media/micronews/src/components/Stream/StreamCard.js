import React, { useState } from "react";
import upArrow from "../../assets/up-arrow.png";
import downArrow from "../../assets/down-arrow.png";
import "./Stream.css";

function StreamCard({
  item: { channel, subheader, title, body, upvotes, downvotes },
  hideStream
}) {
  const [voted, setVoted] = useState(null);

  const registerVote = idx => {
    if(!voted){
      setVoted(idx)
    }
  }

  return (
    <div className="d-flex stream-card my-3 animated fadeIn">
      <div className="vote-slice d-flex flex-column">
        <div className="d-flex flex-column my-auto mx-auto">
          <img
            src={upArrow}
            className={`img-fluid arrow-img ${voted === 1 ? "" : "not-voted"}`}
            onClick={() => registerVote(1)}
          />
          <img
            src={downArrow}
            className={`img-fluid arrow-img ${
              voted === 2 ? "" : "not-voted"
            } mt-3`}
            onClick={() => registerVote(2)}
          />
        </div>
      </div>
      <div className="content-slice py-2 px-3 mx-2 d-flex flex-column">
        {hideStream && (
          <div className="position-relative d-flex animated fadeIn">
            <div className="position-absolute blur-content d-flex">
              <div className="blur-content-inner d-flex">
                <div className="pr-3 mx-auto my-auto blur-content-text">
                  Subscribe to see this content!
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="d-flex content-header mt-2">
          <div className="channel-title font-weight-bold">m/{channel}</div>
          <div className="timestamp ml-3">{subheader}</div>
        </div>
        <div className="content-title mt-4">{title}</div>
        <div className="content-preview mt-4">{body}</div>
      </div>
    </div>
  );
}

export default StreamCard;
