const mongoose = require('mongoose');

const TGBotUserSchema = new mongoose.Schema({
  telegramId: {
    type: Number,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: false,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
});

const TGBotUser = mongoose.model('TGBotUser', TGBotUserSchema);

module.exports = TGBotUser;