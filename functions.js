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
            let validPassword
            let response = {}
            let user= await db.get().collection('user').findOne({gmail:userdata.gmail})
            validPassword= await bcrypt.compare(userdata.password,user.password)

                if(!validPassword){
                    console.log('login failed');
                    response.status = false
                    resolve(response)
                }else {
                    console.log('login success');
                    response.user = user
                    response.status = true
                    resolve(response)
                }
            })  
    }

}