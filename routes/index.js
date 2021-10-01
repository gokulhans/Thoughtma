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
  let data = req.body
  console.log(data);
  db.get().collection('images').insertOne(data).then((response) => {
    let id = response.insertedId
    let userid = req.body.userid
    let image = req.files.image
    image.mv('./public/images/'+userid+'.jpg',(err,done)=>{
      if(!err){
        res.redirect('/users/myprofile/')
      }else{
        console.log(err);
      }
    })
  })

  /*cloudinary.v2.uploader.upload(img,
  { public_id: "olympic_flagfd" }, 
  function(error, result) {console.log(result); });*/
         
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
