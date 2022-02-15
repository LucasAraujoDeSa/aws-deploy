const express = require("express")
const multer = require("multer")
const {storage} = require("./configs/multer-config")
const {uploadFileS3} = require("./configs/s3-config")
require("dotenv").config()

const app = express()
app.use(express.json())
const upload = multer({ storage: storage })

const data = [
  {
    "id":1,
    "title":"le petit prince",
    "price":125
  }
]

app.get("/", (req, res) => {
  return res.status(200).send("<h1>ola</h1>")
})

app.get("/book", (req, res) => {
  return res.status(200).json({
    "books":data
  })
})

app.get("/book/:id", (req, res) => {
  const {id} = req.params

  data.forEach(book => {
    if (book.id === parseInt(id)){
      return res.status(200).json({
        "book":book
      })
    }
  })

  return res.status(404).json({
    "data":"no book"
  })
})

app.post("/book", (req, res) => {
  const {title, price} = req.body

  const newBook = {
    id: data.length + 1,
    title: title,
    price: price
  }

  data.push(newBook)

  return res.status(201).json({"data": newBook})

})

app.post("/avatar", upload.single('avatar'), (req, res) => {
  console.log(req.file)
  uploadFileS3(req.file.filename)

  return res.status(200).json({data: req.file.filename})
})

app.listen(3333, () => {
  console.log("server running 🚀")
})
