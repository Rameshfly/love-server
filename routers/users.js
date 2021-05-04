const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async(req, res) => {

    let user = await User.findOne({
        email: req.body.email,
    });
    
    if(user){
        return res.status(400).send({
            message: "Email Already exists"
        });
    }
    else{
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
            phoneNumber: req.body.phoneNumber
        });
    
        user = await user.save();
    
        if(!user) {
            return res.status(404).send({
               message: 'the user cannot be created'
            });
        }
    
        return res.send({
            message: "User Registered Successfully.",
            "name": user.name,
            "email": user.email,
            "phoneNumber": user.phoneNumber,
            "id": user.id,
        });
    }

})

router.post('/login', async(req, res) => {

    const user = await User.findOne({
        email: req.body.email
    });
    const secret = process.env.secret;

    if(!user) {
        return res.status(400).send({
           message: 'Check your email-id'
        });
    }

    if(user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
            {
                userId: user.id,
            },
            secret,
            {expiresIn: '1d'}
        );

        res.status(200).send({
            message: "User Logged Successfully",
            "email": user.email,
            token: token,
            "id": user.id,
        });
    }
    else{
        res.status(400).send({
            message: "Password is Wrong!"
        });
    }
})

// router.get('/:id', async(req, res) => {
//     const userPosts = await User.findById(req.params.id).populate('posts').sort({'dateCreated': -1});
//     if(!userPosts) {
//         return res.status(404).json({
//             message: "Invalid User",
//         })
//     }
//     return res.status(200).send(userPosts);
// })

module.exports = router;