/** @format */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const boardSchema = new Schema(
  {
    initiator: {
      type: String,
    },
    squares: [
      {
        name: String,
        content: String,
        played: Boolean,
      },
    ],
    game_done: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

let Board = mongoose.model('Board', boardSchema)
module.exports = Board
