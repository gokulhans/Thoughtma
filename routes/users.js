var express = require('express');
var router = express.Router();
var db = require('../connection')
var fun = require('../functions')
var ObjectId = require('mongodb').ObjectId

/* GET users listing. */
// const requiredlogin = (req,res)=>{
//   if (req.session.user) {
//       req.session.userstatus = true
//   }else{
//     req.session.userstatus = false
//   }
// }
router.get('/',async function (req, res) {
  let user = await db.get().collection('user').findOne({_id:ObjectId(req.session.user)})
  let blogs =  await db.get().collection('blogs').find().toArray()
  res.render('index',{user,blogs});
  
});

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.get('/blog/:id', async (req, res) => {
  let id = req.params.id
  let blogs = await db.get().collection('blogs').findOne({_id:ObjectId(id)})
  res.render('blog',{blogs})
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
  res.redirect('/');
});


router.get('/profile', async function (req, res) {
  let user = await db.get().collection('user').findOne({_id:ObjectId(req.session.user)})
  res.render('profile',{user})
});

router.get('/newblog',async function (req, res) {
  let user = await db.get().collection('user').findOne({_id:ObjectId(req.session.user)})
  res.render('newblog',{user})
});
router.post('/newblog', async function (req, res) {
  let blogdata = req.body
  db.get().collection('blogs').insertOne(blogdata)
  let blogs =  await db.get().collection('blogs').find().toArray()
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

router.get('/delete/:id', (req, res) => {
  id = req.params.id
  db.get().collection('blogs').deleteOne({_id:ObjectId(id)})
  res.redirect('/users/')
})

module.exports = router;