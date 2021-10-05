require('dotenv').config()
const express = require('express');
const app = express()
const jwt =require('jsonwebtoken')

app.use(express.json())

const posts =[
{
    username: 'kyle',
    title :'post 1'

},
{
    username: 'ahmed',
    title :'post 2'

},
]

app.get('/posts',authentificateToken ,(req,res)=>{
res.json(posts.filter(post => post.username === req.user.name))
res.json(posts)
})


 

function authentificateToken(req,res,next){

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token==null ) return res.sendStatus(401)

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user) =>{
        if (err) return res.sendStatus(403)
    req.user=user
    next()
    })

}

app.listen(3000)