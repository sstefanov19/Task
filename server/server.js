const express = require('express');
const {v4 : uuidv4} = require('uuid');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

let currentId = 1;
let notes = [];
console.log(notes);



app.get('/notes' , (req , res) => {
    res.status(200).json(notes);
})

app.post('/create-note' , (req , res) => {
    const {title , description } = req.body;

    if(!title || !description) {
        res.status(400).json({message: "Title and description are required"});

    } 

    const note = {id: currentId++ , title , description};
    notes.push(note);

})

app.get('/notes/:id' , (req , res) => {
    
    const noteId = parseInt(req.params.id , 10)
    const note =  notes.find((note) => noteId === note.id)


    res.status(200).json(note);
})

app.put('/notes/:id' , (req , res) => {

    const {title , description} = req.body;
    const noteId = parseInt(req.params.id , 10)
    const noteIndex = notes.findIndex((note) => note.id === noteId)

    if(!noteId) {
        console.log("Cant find that id")
    }

    if(!title || description ){
        console.log("Entering title and description is required")
    }

    notes[noteIndex] = {id:noteId ,  title , description};
    res.status(200).json({message: "Note succesfully edit" , note: notes[noteIndex]})

})

app.delete('/notes/:id' , (req ,res) => {
    const noteId = parseInt(req.params.id , 10)
    const note = notes.findIndex((note) => note.id === noteId);

    notes.splice(note , 1);
    res.status(200).json({message: "Note deleted succesfully"})
})




app.listen(port , () => {
    console.log(`Listening on port ${port}`)})  