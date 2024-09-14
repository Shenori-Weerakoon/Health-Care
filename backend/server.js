require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Routes
const userRoutes = require("./routes/userRoutes");
const logInRoutes = require("./routes/logInRoutes");
const MoodCheckInRoutes = require('./routes/MoodCheckInRoutes');

// express app
const app = express();


const PORT = process.env.PORT || 8001;
// middleware
app.use(express.json());

// Parse JSON requests
app.use(bodyParser.json()); 

// cors
app.use(cors());

// Routes

app.use("/users", userRoutes);
app.use("/users", logInRoutes);
app.use('/mood-checks', MoodCheckInRoutes);

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to mongodb database");
    // listen to port
    app.listen(process.env.PORT, () => {
       console.log("listening for requests on port", process.env.PORT);
     });
    
  })
  .catch((err) => {
    console.log(err);
  });