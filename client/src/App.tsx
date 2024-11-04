import { useEffect, useState } from "react"
import axios from "axios";



function App() {

  
  const [note , setNote] = useState<String[]>([]);
  const [title , setTitle] = useState<string>("");
  const [description , setDescription] = useState<string>("")
  const [id , setId] = useState('');
  const [noteById , setNoteById] = useState(null);
  const [editId , setEditId] = useState('');

 

  const handleSubmit = async () => {
    try {
    
      const formData = new FormData;
      formData.append('title' , title);
      formData.append('description' , description)

          await axios.post("http://localhost:3000/create-note" , {
            title : formData.get("title"),
            description: formData.get("description")
          })

          setTitle('');
          setDescription('');
          fetchNotes()
 
      } catch (error) {
        console.log("Couldnt add note " , error)
      }

  }

  const findWithIndex = async () => {

    if(!id) {
      console.log("Couldnt find any note with that id")
    }

    try {
      const response = await axios.get(`http://localhost:3000/notes/${id}`)
      setNoteById(response.data)
    } catch (error) {
     console.log("Error in finding id") 
     setNoteById(null);
    }
  }

  const deleteNote = async (deleteId) => {
    try {
       await axios.delete(`http://localhost:3000/notes/${deleteId}`);
      fetchNotes();
      
    } catch (error) {
      console.log("Couldnt delete that note " , error)
    }
  }

  const handleEditNote = async (note) => {
      setEditId(note.id);
      setTitle(note.title);
      setDescription(note.discription)
      
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if(!editId || !title || !description ) {
      console.log("Cant access that note");
    }
    try {
      await axios.put(`http://localhost:3000/notes/${editId}` , {title , description});
      setTitle('')
      setDescription('')
      setEditId('')
      fetchNotes();
    } catch (error) {
      console.log("Couldnt edit that note" , error);
    }
  }



  
      const fetchNotes = async () => {
        try {
          const response  = await fetch('http://localhost:3000/notes' , {
            method: "GET"
          });

          if(!response.ok) {
            console.log("Couldnt fetch notes! ");
          }


          const data = await response.json();
          setNote(data);


        } catch (error) {
          
        }
      }

      useEffect(() =>{
      fetchNotes()
  }, [])


  return (
      <>

      <div className="flex justify-center h-screen w-screen">
        <div className="flex flex-col h-full w-3/4">
        <h1 className="text-center font-bold text-2xl">Create note</h1>
        <form onSubmit={editId? handleEditSubmit : handleSubmit} className="flex items-center justify-center flex-col mb-6">
            <input type="text" name="title" className="border-2 w-2/4 mb-2" placeholder="Enter title.." value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="text" name="description" className="border-2 w-2/4" placeholder="Enter description..." value={description} onChange={(e) => setDescription(e.target.value)} />
            <button>{editId ? "Edit" : "Submit"}</button>
        
        </form>
        <div className="flex w-full items-center justify-center flex-col">
        <h1>Search for specific id "starting from 0"</h1>
        <input placeholder="id goes here" className="border-2" value={id} onChange={(e) => setId(e.target.value)} required />
        <button onClick={findWithIndex}>Get Notes by id</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {noteById ?
          <div className="h-[100px] w-[200px] flex flex-col border-2 mt-2">
            <h1>Note with id {id}</h1>
            <p>Title {noteById.title}</p>
            <p>Description {noteById.description}</p>
            
             </div>
             :
             <h1 className="text-center">Cant find with that id</h1>

          }

        </div>

        <h1 className="text-center font-bold mt-4">All notes</h1>
        <div className="grid grid-cols-2  gap-4">
        {!note  ? <h1>
          No notes found
        </h1>
        :
        note.map((note , index) => {
          return (
            <div key={index} className="h-[150px] w-[150px] flex flex-col border-2 mt-2">
              <h1>Title: {note.title}</h1>
              <p>Description : {note.description}</p>
              <p>Id: {note.id}</p>
              <div className="flex justify-between">
              <button className="h-[40px] w-[40px] border-2 rounded-md bg-blue-500 font-bold"
              onClick={() => handleEditNote(note)}>Edit</button>
              <button onClick={() => deleteNote(note.id)} className="h-[40px] w-[40px] border-2 rounded-md bg-red-500">Delete</button>
              </div>
            </div>
          )
        })}
        </div>
        </div>

      </div>

    </>
  )
}

export default App
