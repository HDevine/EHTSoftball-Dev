import React from "react";
import Avatar from "./Avatar";
import ContactDetails from "./ContactDetails";

function ContactCard(props) {
  return (
    <div className="card">
      <div className="top">
        <h2 className="name">{props.name}</h2>
        <h2 className="name">{props.title}</h2>
        <Avatar image={props.image} />
      </div>
      <div className="bottom">
        <ContactDetails detailInfo={props.tel}/>
        <ContactDetails detailInfo={props.email}/>
      </div>
    </div>
  );
}

export default ContactCard;

