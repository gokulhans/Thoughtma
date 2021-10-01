var express = require('express');
var router = express.Router();
var db = require('../connection')
var ObjectId = require('mongodb').ObjectId
const Formidable = require('formidable');
const cloudinary = require("cloudinary");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup');
});

router.post('/upload', function(req, res) {
  console.log('call');
  let data = req.body
  data.imgtype = 'profilepic'
  console.log(data);
  console.log(data.imgurl);
  let img = data.imgurl
  db.get().collection('images').insertOne(data).then((response) => {
    console.log(response.insertedId);
  })
  // console.log(req.body);
  // console.log(req.files.image);

  cloudinary.v2.uploader.upload(img,
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });
         
});

router.get('/admin', async function(req, res) {
  let blogs = await db.get().collection('blogs').find().toArray()
  let users = await db.get().collection('users').find().toArray()
  res.render('admin',{blogs,users});
});

router.get('/delete/:id', (req, res) => {
  id = req.params.id
  db.get().collection('blogs').deleteOne({ _id: ObjectId(id) })
  res.redirect('/admin')
})

router.get('/deleteuser/:id', (req, res) => {
  id = req.params.id
  db.get().collection('users').deleteOne({ _id: ObjectId(id)})
  res.redirect('/admin')
})



module.exports = router;
