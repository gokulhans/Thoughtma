var express = require('express');
var router = express.Router();
var db = require('../connection')
var fun = require('../functions')
var ObjectId = require('mongodb').ObjectId

/* GET users listing. */

router.get('/', async function (req, res) {
  
  let user = await db.get().collection('user').findOne({_id:ObjectId(req.session.user)})
  let blogs =  await db.get().collection('blogs').find().toArray()
  res.render('index',{user,blogs});
});

router.get('/signup', (req, res) => {
  session=req.session;
  if(session.userid){
      res.send("Welcome User <a href=\'/logout'>click to logout</a>");
  }else
  res.render('signup')
})
router.post('/signup', (req, res) => {
  
  fun.doSignup(req.body).then((response) => {
    session=req.session;
    session.user=response.insertedId
    res.redirect('/users/')
  })

})
router.get('/login', function (req, res) {
  res.render('login');
});

router.get('/logout', function (req, res) {
  res.redirect('/users/login');
});
router.get('/profile/', function (req, res) {
  res.redirect('/users/login');
});
router.get('/profile/:id', async function (req, res) {
  let id = req.params.id
  let user = await db.get().collection('user').findOne({_id:ObjectId(id)})
  console.log(user);
  res.render('profile',{user})
});

router.get('/newblog/:id',async function (req, res) {
  let id = req.params.id
  let user = await db.get().collection('user').findOne({_id:ObjectId(id)})
  res.render('newblog',{user})
});
router.post('/newblog', async function (req, res) {
  let blogdata = req.body
  db.get().collection('blogs').insertOne(blogdata)
  let blogs =  await db.get().collection('blogs').find().toArray()
  console.log(blogs);
  res.render('index',{blogs})
});

router.post('/login', (req, res) => {
  fun.doLogin(req.body).then((response) => {
    console.log(response.status);
    if (response.status) {
      let user = response.user
      res.render('index', { user })
    } else {
      res.redirect('/users/login');
    }
  })
})


module.exports = router;