var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var cardSchema = new Schema({
  original: {
    type: String,
    default: 'fish'
  },
  translated: {
    type: String,
    default: 'pescado'
  },
  src: {
    type: String,
    default: 'https://media.giphy.com/media/12kfrrybSQPUis/giphy.gif'
  },
  owner:{
    type:String,
    default:'Ulysses'
  },
  cardSet:{
    type:String
  }
});

module.exports = mongoose.model('Card', cardSchema);
