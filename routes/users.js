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
  if (req.session.loggedIN) {
    let user = await db.get().collection('user').findOne({_id:ObjectId(req.session.user)})
    let blogs =  await db.get().collection('blogs').find().toArray()
    res.render('index',{user,blogs});    
  } else {
    res.redirect('/users/signup/')
  }
  
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
    session.loggedfalse = false
    session.loggedIN = true
    res.redirect('/users/')
  })

})
router.get('/login', function (req, res) {
  console.log(req.session);
  if (req.session.loggedIN) {
    res.redirect('/users/')
  }
  if (req.session.loggedfalse) {
    res.render('login',{err:true});
  } else {
    res.render('login');
  }
});

router.post('/login', (req, res) => {
  fun.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = String(response.user._id) 
      req.session.loggedfalse = false
      req.session.loggedIN = true
      res.redirect('/users/')
    } else {
      req.session.loggedfalse = true

      res.redirect('/users/login');
    }
  })
})

router.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/');
});


router.get('/myprofile', async function (req, res) {
  let user = await db.get().collection('user').findOne({_id:ObjectId(req.session.user)})
  let blogs = await db.get().collection('blogs').find({"userid":req.session.user}).toArray()
  res.render('profile',{user,blogs})
});



router.get('/profile/:id', async function (req, res) {
  let userid = req.params.id
  let user = await db.get().collection('user').findOne({_id:ObjectId(userid)})
  let blogs = await db.get().collection('blogs').find({"userid":userid}).toArray()
  res.render('userprofile',{blogs,user})
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


router.get('/delete/:id', (req, res) => {
  id = req.params.id
  db.get().collection('blogs').deleteOne({_id:ObjectId(id)})
  res.redirect('/users/')
})

module.exports = router;