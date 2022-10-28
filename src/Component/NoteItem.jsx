import React, { useContext } from "react";
import NoteContext from "../Context/notes/NoteContext";

function NoteItem(props) {
  const Context = useContext(NoteContext);
  const { deleteNote } = Context;
  const { note, updateNote } = props;
  return (
    <div className="col-md-3 my-3">
      <div className="card">
        <div
          className="card-body"
          style={{ paddingTop: 15, paddingBottom: 0, paddingLeft: 0 }}
        >
          <div className="d-flex align-items-start justify-content-evenly">
            <h5 className="card-title">{note.title}</h5>
            <i
              className="far fa-trash-alt mx-1 my-1"
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                deleteNote(note._id);
              }}
            ></i>
            <i
              className="far fa-edit my-1"
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                updateNote(note);
              }}
            ></i>
          </div>
        </div>
        <p className="card-text mx-1 my-2">{note.description}</p>
      </div>
    </div>
  );
}

export default NoteItem;
