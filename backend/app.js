const expess = require("express");
//const mypass = "vaOC4AlsmbDrapVi";
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

const app = expess();

mongoose.connect("mongodb+srv://Kamogelo:vaOC4AlsmbDrapVi@cluster0.qwien.mongodb.net/node-angular?retryWrites=true&w=majority")
 .then(() =>{
     console.log("connected to database");
 }).catch(() => {
     console.log("connection failed");
 })



app.use(bodyParser.json());
//not necessary
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,  Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;