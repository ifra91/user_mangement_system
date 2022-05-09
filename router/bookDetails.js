const express = require("express");
const routernew = new express.Router();



const booksdata = require("../models/bookdb");

//handling post request in API
routernew.post("/bookdb", async(req, res) => {
    try {
        const addingNewBooks = new booksdata(req.body)
        console.log(req.body);
        const addBooks = await addingNewBooks.save();
        res.status(201).send(addBooks);
    } catch (e) {
        res.status(400).send(e);
    }
})

//handling get request in API
routernew.get("/bookdb", async(req, res) => {
    try {
        const getBookDetails = await booksdata.find({});
        res.send(getBookDetails);
    } catch (e) {
        res.status(400).send(e);
    }
})


// use ranking to sort
//handel get request for individual field from schema
routernew.get("/bookdb/:id", async(req, res) => {
    try {
        const getbookid = req.params.id;
        const updateBookId = await booksdata.findById(getbookid);
        res.send(updateBookId);
        console.log(updateBookId);
    } catch (e) {
        res.status(400).send(e);
    }
})

//handel patch request for individual field from schema
routernew.patch("/bookdb/:id", async(req, res) => {
    try {
        const patchBookId = req.params.id;
        const updateBookId = await booksdata.findByIdAndUpdate({ patchBookId }, req.body, {
            new: true
        });
        res.send(updateBookId);
    } catch (e) {
        res.status(400).send(e);
    }
})


//handel delete request for individual field from schema
routernew.delete("/bookdb/:id", async(req, res) => {
    try {
        const deleteBookId = req.params.id;
        const delBookId = await booksdata.findByIdAndDelete({ deleteBookId }, req.body, {
            new: true
        });
        res.send(delBookId);
    } catch (e) {
        res.status(400).send(e);
    }
})


module.exports = routernew;