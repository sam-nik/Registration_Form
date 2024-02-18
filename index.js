const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.ydce0rw.mongodb.net/formDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// 

// Registration Schema
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dob: Date, // Date of Birth field
    gender: String, // Gender field
    phoneNumber: String// Phone Number field
});

// Model of Registration Schema
const Registration = mongoose.model("Registration", registrationSchema);

// Use bodyParser middleware to parse JSON-encoded bodies with nested objects
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
    console.log(req.body);
    try {
        const { name, email, password, dob, gender, phoneNumber } = req.body;

        const existingUser = await Registration.findOne({ email: email });

        // Checking for Existing User
        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password,
                dob, // Date of Birth
                gender, // Gender
                phoneNumber // Phone Number
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else{
            alert("User already exist");
            res.redirect("/error")
        }  

    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
