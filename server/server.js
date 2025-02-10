const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')
const schema = require("./schemas/Schema.js")
const isAuth = require('./middlewares/isAuth.js')
const dotenv = require('dotenv')

dotenv.config()
const app = express()

// ✅ Configure CORS Properly
const corsOptions = {
    origin: "http://43.205.239.120:3000",  // Allow requests from frontend
    credentials: true,  // Allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE"],  // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization"]  // Allow these headers
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(isAuth)

// ✅ Connect to MongoDB
const mongoURL = process.env.MONGO_URL
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.once('open', () => console.log("DB Connected..."))

// ✅ GraphQL Middleware
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))

// ✅ Start Server
const port = process.env.PORT || 8081
app.listen(port, () => console.log(`Server is running on port ${port}...`))


app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});


// ✅ Test Route
app.get('/', (req, res) => res.send("Auth system..."))
