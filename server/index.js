const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Schema
const schemaData = mongoose.Schema({
    name: String,
    email: String,
    mobile: Number,
}, {
    timestamps: true
});

const userModel = mongoose.model('User', schemaData);

mongoose.connect("mongodb://localhost:27017/appcrud")
    .then(() => {
        console.log("Connected to DB");
        app.listen(PORT, () => console.log('Server is running'));
    })
    .catch(err => console.log(err));

//  ​http://localhost:5000/
app.get("/", async (req, res) => {
    try {
        const data = await userModel.find({});
        res.json({ success: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

//  ​http://localhost:5000/create
app.post("/create", async (req, res) => {
    console.log(req.body);
    try {
        const data = new userModel(req.body);
        await data.save();
        res.send({ success: true, message: "Data saved successfully", data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error saving data" });
    }
});

//  ​http://localhost:5000/update/:id
app.put("/update/:id", async (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros de la URL
    const rest = req.body; // Obtener los datos restantes del cuerpo de la solicitud
    console.log(req.body);
    
    try {
        const data = await userModel.updateOne({ _id: id }, rest);
        if (data.nModified === 0) {
            return res.status(404).send({ success: false, message: "Data not found or not modified" });
        }
        res.send({ success: true, message: "Data updated successfully", data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating data" });
    }
});

// ​http://localhost:5000/delete/:id
app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await userModel.deleteOne({ _id: id });
        res.send({ success: true, message: "Data deleted successfully", data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error deleting data" });
    }
});
