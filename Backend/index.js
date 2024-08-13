const express = require('express')

const ConnectToMongo = require ("./db")
const cors = require('cors')

ConnectToMongo();

const app = express()
const port = 3000

app.use(express.json());

// app.use(cors())

const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'auth-token'],
  credentials: true
};

app.use(cors(corsOptions));


app.use('/api/admin', require('./routes/admin'))
app.use('/api/student', require('./routes/student'))




// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})