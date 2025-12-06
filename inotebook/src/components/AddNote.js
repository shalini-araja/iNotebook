import noteContext from "../context/notes/noteContext";
import {useContext} from 'react';

import {useState} from "react";

export default function AddNote(props) {
  const context = useContext(noteContext);
  const {addNote}  = context;

  const [note,setNote]=useState({title:"",description:"",tag:""})


  const handleClick = (e) => {
     e.preventDefault();
    addNote(note.title,note.description,note.tag);
    setNote({ title: '', description: '', tag: '' })
    props.showAlert("Added Successfully","success")
  };
  const onChange=(e)=>{
    setNote({...note,[e.target.name]:e.target.value})
  }

  return (
    <div>
      <div className="container my-3">
        <h2>Add a Note</h2>
        <form className="my-3">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              aria-describedby="emailHelp"
              onChange={onChange}
              minLength={5}
              value={note.title}
              required
            />
         </div>
          
          <div className="mb-3">
            <label htmlFor="desc" className="form-label">
             Description
            </label>
            <input
              type="text"
              className="form-control"
              id="desc"
              value={note.description}
              name="description"
              onChange={onChange}
              minLength={5}
              required
            />
          </div>
         
         <div className="mb-3">
            <label htmlFor="tag" className="form-label">
             Tag
            </label>
            <input
              type="text"
              className="form-control"
              id="tag"
              name="tag"
              value={note.tag}
              onChange={onChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={note.title.length<5 || note.description.length<5}
            onClick={handleClick}
          >
        Add Note
          </button>
        </form>
      </div>
    </div>
  );
}
