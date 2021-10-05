require('dotenv').config()
const express = require('express');
const app = express()
const jwt =require('jsonwebtoken')

app.use(express.json())

let refreshTokens = []

app.post('/token',(req,res)=>{
    const refreshToken =req.body.token
    if(refreshToken==null) res.sendStatus(401)                                                  //creating a refresh token
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(401)
    jwt.verify(refreshToken ,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({user: user.name})
        res.json({accessToken :accessToken})
    })
})
app.delete('/logout',(req,res)=>{                                                    
    refreshTokens =refreshTokens.filter(token =>token !== req.body.token)   // deleting the refresh token (parceque qq peut générer des tokens infiniment)
    res.sendStatus(204)
})


app.post('/login',(req,res)=>{

const username =req.body.username                                       
const user={name :username}
const accessToken =generateAccessToken(user)
const refreshToken= jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
refreshTokens.push(refreshToken)
res.json({ accessToken :accessToken , refreshToken: refreshToken})
})
 



function generateAccessToken(user){
                                                                                                            // adding expiration date
   return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn :'30s'})

}



app.listen(4000)