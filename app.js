// put لتعديل كل الداتا  
// patch لتعديل جزء من الداتا



const express = require("express") ;

const app = express();

app.use(express.json())

class Books {
    constructor(id,name,title){
        this.id = id
        this.name = name
        this.title = title
    }

    changeTranslation(languge){
        this.title = `${this.title} - (${languge})`

    }

    static validate(book){
        if(!(book instanceof Books)) return "book must be instance";
        if(!book.id || typeof book.id !== "number") return "book id must be number and not empty";   // !book.id  ==> ان القيمة غير موجودةاو فارغة
        if(!book.name || typeof book.name !== "string") return "Must be a string and not empty"
        if(!book.title || typeof book.title !== "string") return "Must be a string and not empty"
    
        return null
    }

}

let books = []

app.post("/books",(req,res)=>{
    const {id,name,title} = req.body ;

    if(books.some((book)=>book.id ===id)){
        return res.status(400).json({error:"This book is already exist"})
    }

    const newBook = new Books(id,name,title)
    const error = Books.validate(newBook)

    if(error) return res.status(400).json({error})
        
        books.push(newBook)
        res.status(201).json({message:"Book has been added",book:newBook})

})


// show all books
app.get("/books",(req,res)=>{
    res.json(books)
})


// show one book
app.get("/books/:id", (req, res) => {

   const bookId = req.params.id
   const  book = books.find(b=> b.id === parseInt(bookId))

   if(book){
        res.json({book})
   }
   else{
    res.status(404).json({ message: "Book not found" });
   }


});

// update the book
app.put("/books/:id",(req,res)=>{
    const bookId = parseInt(req.params.id,10)
    const bookIndex = books.findIndex((book)=>book.id === bookId)    // id عشان ادور ع كتاب عن طريق ال 

    if(bookIndex === -1){
        return res.status(400).json({error:"Soory book not found"})
    }
    const {name,title} = req.body

    if(name) books[bookIndex].name = name
    if(title) books[bookIndex].title = title

    res.status(200).json({message:"Book has been updated",book:books[bookIndex]})
})


// Delete book 

app.delete("/books/:id",(req,res)=>{
    const bookId = parseInt(req.params.id,10)
    const bookIndex = books.findIndex((book)=>book.id === bookId)    // id عشان ادور ع كتاب عن طريق ال 

    if(bookIndex === -1){
        return res.status(400).json({error:"Soory book not found"})
    }
    books.splice(bookIndex,1)
    return res.status(200).json({message:"Deleted book successfuly"})
})


// translation

app.patch("/books/:id/translation",(req,res)=>{

    const bookId = parseInt(req.params.id,10)
    const languge = req.body.languge

    console.log(languge)
    if(!languge || typeof languge !== "string"){
        return res.status(400).json({error:"Sorry invalid languge"})
    }

    const book = books.find((b)=>b.id === bookId)
    if(!book) return res.status(404).json({error:"Sorry book not founr"})

        book.changeTranslation(languge);

        return res.status(200).json({ message: "Translation updated successfully", book });
})

const port = 3000

app.listen(port,()=>{
    console.log(`liabrary system started on http://127.0.0.1/:${port}`)
})