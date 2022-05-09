const express = require("express");
const router = new express.Router();

const Users = require("../models/Users");


//handling post request in API
router.post("/Users", async(req, res) => {
    try {
        const registerNewId = new Users(req.body)
        console.log(req.body);
        const insertRecords = await registerNewId.save();
        res.status(201).send(insertRecords);
    } catch (e) {
        res.status(400).send(e);
    }
})

//handling get request in API
router.get("/Users", async(req, res) => {
        try {
            const getUsers = await Users.find({});
            res.send(getUsers);
        } catch (e) {
            res.status(400).send(e);
        }
    })
    // use ranking to sort
    //handel get request for individual field from schema
router.get("/Users/:id", async(req, res) => {
    try {
        const userId = req.params.id;
        const getUserId = await Users.findById(userId);
        res.send(getUserId);
        console.log(getUserId);

    } catch (e) {
        res.status(400).send(e);
    }
})

//handel patch request for individual field from schema
router.patch("/Users/:id", async(req, res) => {
    try {
        const userId = req.params.id;
        const getuserId = await Users.findByIdAndUpdate({ userId }, req.body, {
            new: true
        });
        res.send(getuserId);
    } catch (e) {
        res.status(400).send(e);
    }
})


//handel delete request for individual field from schema
router.delete("/Users/:id", async(req, res) => {
    try {
        const userId = req.params.id;
        const getuserId = await Student.findByIdAndDelete({ userId }, req.body, {
            new: true
        });
        res.send(getuserId);
    } catch (e) {
        res.status(400).send(e);
    }
})

module.exports = router;