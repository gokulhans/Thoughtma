var express = require('express');
var router = express.Router();
var db = require('../connection')
var ObjectId = require('mongodb').ObjectId


router.get('/', async function (req, res) {
    var chats = await db.get().collection('chats').find().toArray()
    var userchats = await db.get().collection('chats').find({userid:ObjectId(req.session.user)}).toArray()
    console.log(userchats);
    let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user)})
    res.render('chat',{chats,userchats,user});
  });
  
router.post('/post', async function (req, res) {
    let msg = req.body
    msg.time = new Date().toLocaleTimeString()
    msg.date = new Date().toLocaleDateString()
    var user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user)})
    if (user) {
      msg.user = user.name
      msg.userid = user._id
    }else{
      msg.user = 'anonymous'
    }

    console.log(msg);
    db.get().collection('chats').insertOne(msg)
    res.redirect('/chat/#new');
  });

module.exports = router;

