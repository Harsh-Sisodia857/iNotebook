import React from "react";
import AddNote from "./AddNote";
import Notes from "./Notes";

function Home() {
  
  return (
    <div className="container">
      <h1 className="my-3">Add a note</h1>
      <AddNote/>
      <h1>Your Note</h1>
        <Notes/>
    </div>
  );
}

export default Home;
