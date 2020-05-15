/** @format */

const express = require('express')
const connectdb = require('./dbconnection')
const Boards = require('./models/BoardSchema')

const router = express.Router()

router
  .route('/')
  .get((req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    connectdb.then((db) => {
      Boards.find({}).then((boards) => {
        res.json(boards)
      })
    })
  })
  .post((req, res) => {
    const book = new Boards(req.body)
    console.log(book)
    book.save()
    return res.status(201).json(book)
  })

module.exports = router
