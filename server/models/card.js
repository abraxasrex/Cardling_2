var mongoose = require('mongoose');

//set schema
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
    default: 'img.jpg'
  },
  owner:{
    type:String,
    default:'Ulysses'
  },
  cardSet:{
    type:String
  }
});

//export model
module.exports = mongoose.model('Card', cardSchema);
