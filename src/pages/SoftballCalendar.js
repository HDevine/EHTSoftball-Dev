import React from "react";
//import Calendar from "@ericz1803/react-google-calendar";
import ApiCalendar from "react-google-calendar-api";

//const API_KEY = "AIzaSyBJCHhXLOBjo8kUSlFjyNgFq1N3aJCF3aU";
//let calendars = [
//  {calendarId: "lifter89@gmail.com"},
//  {
//    calendarId: "hu42ml7a4gpddvudq1705732gl4p9rjp@import.calendar.google.com",
//    color: "#B241D1" //optional, specify color of calendar 2 events
//  }
//];
//<Calendar apiKey={"AIzaSyBJCHhXLOBjo8kUSlFjyNgFq1N3aJCF3aU"} calendars={calendars} />


export default class SoftballCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.handleItemClick = this.handleItemClick.bind(this);    
  }

  handleItemClick(event, name) {
    if (name === 'sign-in'){
        ApiCalendar.handleAuthClick()
    }
    else if (name === 'sign-out'){
        ApiCalendar.handleSignoutClick();
    }
  }

  render() {
    return (
        <>
          <button onClick={(e) => this.handleItemClick(e, 'sign-in')}>Sign In</button>
          <button onClick={(e) => this.handleItemClick(e, 'sign-out')}>Sign Out</button>
        </>
    );
  }
}

//export default SoftballCalendar;
