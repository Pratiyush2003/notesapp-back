import express from "express";
import fetchUser from "../middleware/fetchUser.js";
import Notes from "../models/Notes.js";
const router = express.Router();

//* ROUTE 1: Get All the Notes using: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({user : req.userId})
        res.json(notes);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

//* ROUTE 2: Add new Note using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchUser, async (req, res) => {
    try {

        //* data comimg from body(frontend)
        const {title, description, tag} = req.body;

        //* validation 
        if (!title || !description || !tag) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const notes = await Notes({
            title,
            description,
            tag,
            user : req.userId
        })

        //* saving notes
        const savedNote = await notes.save();
        res.json({savedNote, success : "Note added successfully"});
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
    }
})

//* ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    //* data comimg from body(frontend)
    const {title, description, tag} = req.body;
    const {id} = req.params;

    try {
        //* Find the note to be updated and update it
        const note = await Notes.findById({_id : id})

        //* validation
        if (!note) {
            return res.status(404).send("Not Found")
        }

        if (note.user.toString() !== req.userId) {
            return res.status(401).send("Not Allowed");
        }

        console.log(note);
        
        //* Note Update 
        const notes = await Notes.findByIdAndUpdate({_id : id}, {
            $set : {
                title,
                description,
                tag
            }
        }, {new : true})

        res.json({notes, success : "Notes Updated Successfully"})
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
    }
})

//* ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required

router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
       
        //* Find the note to be delete and delete it
        let note = await Notes.findById(req.params.id)

        if (!note) { return res.status(404).send("Not Found") }

         //* Allow deletion only if user owns this Note
         if (note.user.toString() !== req.userId) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({success : "Note has been deleted", note : note})

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }

    
})

//* ROUTE 5: Get notes by id: GET "/api/notes/notes/:id". Login required
router.get('/notes/:id', fetchUser, async (req, res) => {

    try {

        const {id} = req.params
        const notes = await Notes.findById({_id : id});
        console.log(notes);

        if (notes) {
            return res.status(200).json(notes);
        } else {
            return res.status(404).json({ success: "notes Not Found" });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
})

export default router