const express = require("express");
const router = express.Router();
const Note = require("../models/Notes");
const { body, validationResult } = require("express-validator");

const fetchUser = require("../middleWare/fetchUser");

//get all the notes
router.get("/fetchAllNotes", fetchUser, async (req, res) => {
    
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});

//add a new route using post for adding note login required
router.post(
  "/addNote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = await new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const saveNote = await note.save();
      res.json(saveNote);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//route 3 update note
router.put("/updateNote/:id",fetchUser,async (req,res)=>{
const {title,description,tag}=req.body;
const newNote={};
if(title){
    newNote.title=title;
}
if(description){
    newNote.description=description;
}
if(tag){
    newNote.tag=tag;
}

let note=await Note.findById(req.params.id);
// console.log(req.params.id);
if(!note){
   return res.status(404).send("Not Found");
}
if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not Allowed");
}
note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
res.json({note});
})



//route 4 for deleting a note
router.delete("/deleteNote/:id",fetchUser,async (req,res)=>{

//find note to find and delete
let note=await Note.findById(req.params.id);
// console.log(req.params.id);
if(!note){
   return res.status(404).send("Not Found");
}
if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not Allowed");
}
note=await Note.findByIdAndDelete(req.params.id);
res.json({"success":"Note has been deleted",note:note});
})
module.exports = router;