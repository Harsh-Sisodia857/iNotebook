const express = require('express')
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all notes using: POST "/api/notes/fetchallnotes". login required
// validation inside []
router.get('/fetchallnotes', fetchuser,  async (req, res) => {
    try {       
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);        
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Internal Server Error")
    }

})

// ROUTE 2: Add a new note using: POST "/api/notes/addnote".  login required
router.post('/addnote', fetchuser, [
    body('title', "Enter a valid Title").isLength({ min: 3 }),
    body('description', "Description must be atleast 5 character").isLength({ min: 5 })
], async (req, res) => {
    try {
    const { title, description, tag } = req.body;
    // if there are error while validating return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const note = new Note({
        title, description, tag, user : req.user.id
    })
    const savedNote = await note.save()
    res.json(savedNote);
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 3:Update a note using: PUT "/api/notes/updatenote".  login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
    const { title, description, tag } = req.body;
    const newNote = {}
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }
    // User who updating the note == User who create the note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    // {new : true} is if note does not exist then create the note but it does not make sense here because we sending error not found if note does not exist
    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 4: Delete a note using: DELETE "/api/notes/deletenote".  login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        // User who deleting the note == User who create the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success" : "Note Deleted Successfully", note });
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router;