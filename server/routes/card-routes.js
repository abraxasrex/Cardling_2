var Card = require('../models/card.js');
var path = require('path');

/// Create, edit, and delete
function makeCard(req, res, imagePath) {
  Card.create({
    original: req.body.original.trim(),
    translated: req.body.translated.trim(),
    owner: req.body.owner,
    src: imagePath,
    cardSet: req.body.cardSet
  }, function(err, card) {
    if(err) {
      res.send('Card creation err: ', err);
    } else {
      getCards(res);
    }
  });
}

function editCard(req, res, imagePath, id) {
  Card.update({ _id: id },
    { $set: { original: req.body.original, translated: req.body.translated, src: req.body.src, cardSet: req.body.cardSet}
  }, function(err, card) {
    if(err) {
      res.send('Card edit error: ', err);
    } else {
      getCards(res);
    }
  });
}

function removeCard(req, res) {
  Card.remove({
    _id : req.params.card_id
  }, function(err, card) {
    if (err) {
      res.send(err);
    } else {
      Card.find(function(err, cards) {
        if (err){
          res.send(err);
        } else {
          res.json(cards);
        }
      });
    }
  });
}

// Return Selected
function getCards(res) {
  Card.find(function (err, cards) {
    if(err) {
      res.send('getcards in routes.js err', err);
    } else {
      res.json(cards);
    }
  });
}

function getMatchingCards(req, res){
  // if(req.params.field == 'term'){
  //   Card.find({$or: [{original:req.params.val},{translated:req.params.val}]},function(err,cards){
  //     if(err) {
  //       res.send('getcards in routes.js err', err);
  //     } else {
  //       res.json(cards);
  //     }
  //   });
  // }else{
    var customReq = {};
    customReq[req.params.field] = req.params.val;
    Card.find(customReq, function(err, cards){
      if(err){
        res.send('getcards in routes.js err', err);
      }else{
        res.json(cards);
        console.log(req.params.field, ' ', req.params.val);
      }
    });
  // }

}

module.exports = function (app) {

  app.get('/api/cards', function(req, res) {
    getCards(res);
  });

  app.get('/api/cards/:field/:val', function(req, res){
     getMatchingCards(req, res);
  });

  app.delete('/api/cards/:card_id', function(req, res) {
     removeCard(req, res);
  });

  app.post('/api/cards', function(req, res) {
    var imagePath = req.body.src;
    Card.findOne({original : req.body.original, translated: req.body.translated}, function(err, data) {
        if(err) {
            console.log(" findOne duplicate err: ", err);
        } else if(req.body.edit){
          editCard(req, res, imagePath, req.body.edit);
        } else if(data === null){
          makeCard(req, res, imagePath);
        } else {
          console.log('attempted to upload duplicate Card!!');
        }
    });
  });

};
