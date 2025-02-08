



const express = require("express") ;        

const mySql = require("mysql2")             

const app = express()                     

app.use(express.json());


// (1) configure mysql Connection   

const Connection = mySql.createConnection({
    host: 'localhost',
    user:"root",
    password:"82sql82",
    database:"library"
})


// (2) connect to sql

Connection.connect((err)=>{
    if(err){
        console.log("error connection : ", err)
    }
})


// (3) Add a new book

app.post('/books',(req,res)=>{
    const {id,name,title} = req.body

    const query = 'insert into books (id,name,title) values (?,?,?)'

    Connection.query(query,[id,name,title],(err)=>{
        if(err){
            return res.status(500).json({error:"Error adding a new book",details:err.message})
        }
         res.status(201).json({message: "Book has been added"} )
    })
})



//  (4) get all books

app.get('/books',(req,res)=>{
    const query = 'select * from books'
    Connection.query(query,(err,result)=>{
        if(err){
            return res.status(500).json({errro: "error",details:err.message})

        }
        res.json(result)
    })
})


//  (5) get one book

app.get('/books/:id', (req, res) => {
    const query = "SELECT * FROM books WHERE id = ?";  

    Connection.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "error ", details: err.message });
        } 
        
        // موجود  id  يتاكد اذا  
        if(result.length === 0){
            return res.status(404).json({
                message : "This id not found"
            })
        }
        res.json(result)

    });
});


// update book

app.put("/books/:id",(req,res)=>{
    const {name,title} = req.body ; 
    
    const query = "update books set name=? ,title=?  where id =?"

    Connection.query(query,[name,title,req.params.id],(err,result)=>{
        if (err) {
            return res.status(500).json({ error: "error updating the book", 
                details: err.message });
        } 
        if(result.affectedRows===0){
            return res.status(404).json({
                message:"Book updating not found"
            })
        }
        res.json({
            message:"Book has been update"
        })
    })
  
})



// Delete book 

app.delete("/books/:id",(req,res)=>{
    const query = "DELETE FROM books WHERE ID=?"

    Connection.query(query,[req.params.id],(err,result)=>{

        if (err) {
            return res.status(500).json({ error: "error delete the book", 
                details: err.message });
        } 

        if(result.affectedRows===0){
            return res.status(404).json({
                message:"The book you want to delete was not found"
            })
        }
        res.json({
            message:"Book has been delete"
        })
})})


// update translation 

app.patch("/books/:id/translation",(req,res)=>{
    const {languge} = req.body
    
    if(!languge || typeof languge !== "string"){
        return res.status(400).json({error:"Sorry invalid languge"})
    }
    const query = "UPDATE books SET title = CONCAT(title, '-(', ?, ')') WHERE id = ?"


    Connection.query(query,[languge,req.params.id],(err,result)=>{
        if (err) {
            return res.status(500).json({ error: "error updating the book translation", 
                details: err.message });
        } 
        if(result.affectedRows===0){
            return res.status(404).json({
                message:"Book updating not found"
            })
        }
        res.json({
            message:"Book has been update translation"
        })
    })
  
})




// (TASK)

// Bookshop  (get bookshop by id)

app.get("/bookshop/:id",(req,res)=>{
    const query = "SELECT * FROM bookshop WHERE shop_id =?"
    Connection.query(query,[req.params.id],(err,result)=>{
        if(err){
            return res.status(500).json({error :"Error bookshop",details:err.message})
        }
        if(result.length === 0){
            return res.status(404).json({message:"Bookshop not found"})
        }
        res.json(result)
    })  
})


// Bookshop  (get cities  )

app.get("/cities",(req,res)=>{
    const query = "SELECT city FROM bookshop "

    Connection.query(query,(err,result)=>{
        if(err){
            return res.status(500).json({error :"Error cities",details:err.message})   
        }
        if(result.length === 0){
            return res.status(404).json({message:"This city not found"})
        }
        res.json(result)
    })
})


// Bookshop  (get bookshop by name  )

app.get("/bookshop/name/:name",(req,res)=>{
    const query = "SELECT * FROM bookshop WHERE name=?;"

    Connection.query(query,[req.params.name],(err,result)=>{
        if(err){
            return res.status(500).json({error:"Error get bookshop by name",details:err.message})
        }
        if(result.length === 0){
            return res.status(404).json({message:"This bookshop name not found"})

        }
        res.json(result)
    })
  
})


// Bookshop  (get bookshop by Email  )

app.get("/bookshop/email/:email",(req,res)=>{
    const query = "SELECT * FROM bookshop WHERE email=?"

    Connection.query(query,[req.params.email],(err,result)=>{
        if(err){
            return res.status(500).json({error:"Error get bookshop by email",details:err.message})
        }
        if(res.length === 0){
            return res.status(404).json({message:"This bookshop emaol not found"})

        }
        res.json(result)
    })
  
})


// update name & email
app.put("/bookshop/:id",(req,res)=>{
    const { name,email } = req.body; 
    const query = "update bookshop set name=? , email=?  where shop_id =?"

    Connection.query(query,[name,email,req.params.id],(err,result)=>{

        if(err){
            return res.status(500).json({error :"Error Update  ",details:err.message})   

        }
        if(result.affectedRows ===0){
            return res.status(404).json({  message:" updating not found"   })
        }
        res.json({ message:"update successfully"})

    })

})


// Add bookshop
app.post("/bookshop",(req,res)=>{
    const {name,city,contat,email} = req.body

    const query = "insert into bookshop (name,city,contat,email) values (?,?,?,?)"


    Connection.query(query,[name,city,contat,email],(err)=>{
        if(err){
            return res.status(500).json({error:"Error adding ",details:err.message})
        }
         res.status(201).json({message: " Add successfully"} )
    })
})


// delete one  bookshop


app.delete("/bookshop/:id",(req,res)=>{
    const query = "DELETE  FROM bookshop WHERE shop_id=?"

    Connection.query(query,[req.params.id],(err,result)=>{

        if (err) {
            return res.status(500).json({ error: "error delete the bookshop", 
                details: err.message });
        } 

        if(result.affectedRows===0){
            return res.status(404).json({
                message:"The bookshop you want to delete was not found"
            })
        }
        res.json({
            message:"Bookshop has been delete"
        })
})})



const port = 3000

app.listen(port,()=>{
    console.log(`liabrary system started on http://127.0.0.1/:${port}`)
})







