import express from 'express';

const app = express()

app.get("/", (req,res) => {
    res.send(" Server in ready")
})

const port = process.env.PORT || 3000

app.listen(port, () =>(
    console.log(`Serve at https://localhost:${port}`)
))