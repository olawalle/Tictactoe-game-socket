/** @format */

//Require the express moule
const express = require('express')

//create a new express application
const app = express()
var cors = require('cors')

//require the http module
const http = require('http').Server(app)

// require the socket.io module
const io = require('socket.io')

const Board = require('./models/BoardSchema')
const connect = require('./dbconnection')

const port = 500
const port_ = 5000

let count = 0

const socket = io(http)
//create an event listener

//To listen to messages
socket.on('connection', (socket) => {
  console.log('user connected to socket')
  socket.emit('news', { hello: 'world' + count++ })
  socket.on('disconnect', () => {
    console.log('Disconnected')
  })

  socket.on('start_game', () => {
    connect.then((db) => {
      console.log('connected correctly to the server')
      let squares = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((l) => {
        return {
          name: l,
          content: '',
          played: false,
        }
      })
      let newBoard = new Board({
        squares,
        game_done: false,
      })
      newBoard.save().then((res) => {
        socket.broadcast.emit('commence_game', res)
        socket.emit('commence_game', res)
      })
    })
  })

  socket.on('play_square', (game) => {
    Board.findOneAndUpdate(
      { _id: game.id },
      {
        $set: {
          squares: game.squares,
        },
      },
      { new: true }
    ).then((docs) => {
      if (docs) {
        socket.broadcast.emit('play_on', docs)
      }
    })
  })
})

const bodyParser = require('body-parser')
const boardsRouter = require('./routes')

//bodyparser middleware
app.use(bodyParser.json())

// cors middleware
app.use(cors())

//routes
app.use('/api', boardsRouter)

//wire up the server to listen to our port 500
http.listen(port, () => {
  console.log('socket connected to port: ' + port)
})

app.listen(port_, () => console.log(`running on port ${port_}`))
