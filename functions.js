const bcrypt = require('bcrypt')
var db = require('./connection')
var ObjectId = require('mongodb').ObjectId


module.exports={
    doSignup:(userdata)=>{
        return new Promise(async(resolve,reject)=>{
            userdata.password=await bcrypt.hash(userdata.password,10)
            db.get().collection('user').insertOne(userdata).then((response)=>{
                resolve(response)
            })
        })
    }, 
    doLogin:(userdata)=>{
        return new Promise(async(resolve,reject)=>{
            let user= await db.get().collection('user').findOne({gmail:userdata.gmail}).then((response) => {
                return userobj = response
            })
            let validPassword = await bcrypt.compare(userdata.password,user.password)
            let response = {}
                if(!validPassword){
                    console.log('login failed');
                    response.status = false
                    resolve(response)
                }else {
                    console.log('login success');
                    response.status = true
                    response.user = userobj
                    resolve(response)
                }
            })  
    }

}