const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post('/register', (req, res) => {

        if(!req.body.email){
            res.json({ success:false, message:'You must provide an e-mail'});

        }else{
            if (!req.body.username) {
                res.json({ success:false, message:'You must provide a username'});
            }
            else{
                if (!req.body.password) {
                    res.json({ success:false, message:'You must provide a password'});
                    
                }else{
                    
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });
                    user.save((err) =>{
                        if(err){
                            if(err.code === 11000){
                                res.json({ success:false, message:'Username or e-mail already exists!'});
                            }
                            else{
                                if (err.errors) {
                                    if (err.errors.email) {
                                        res.json({ success:false , message: err.errors.email.message});
                                    }
                                    else{
                                        if (err.errors.username) {
                                            res.json({ success:false , message: err.errors.username.message});
                                        }
                                        else{
                                            if (err.errors.password) {
                                                res.json({ success:false , message: err.errors.password.message});
                                            }
                                            else{
                                                res.json({ success: false, message: err});
                                            }
                                        }
                                    }
                                }else{
                                    res.json({ success:false, message:'Could not save user.Error:', err});
                                }

                                
                            }
                            
                        }else{
                            res.json({ success: true, message:'Account registered!'});
                        }
                    });
                }
               
            }

        }
        
    });

    router.get('/checkEmail/:email', (req,res) =>{
        if (!req.params.email) {
            res.json({ success: false, message: 'E-mail was not provided'});
        }else{
            User.findOne({ email: req.params.email}, (err, user) => {
                if (err) {
                    res.json({ success: false, message : err});
                }else{
                    if (user) {
                        res.json({ success: false, message:'E-mail is already taken!'});
                    }else{
                        res.json({ success: true, message:'E-mail is available!'});
                    }
                }
            });
        }
    });

    router.get('/checkUsername/:username', (req,res) =>{
        if (!req.params.username) {
            res.json({ success: false, message: 'Username was not provided'});
        }else{
            User.findOne({ username: req.params.username}, (err, user) => {
                if (err) {
                    res.json({ success: false, message : err});
                }else{
                    if (user) {
                        res.json({ success: false, message:'Username is already taken!'});
                    }else{
                        res.json({ success: true, message:'Username is available!'});
                    }
                }
            });
        }
    });


    router.post('/login', (req, res) =>{
        if (!req.body.username) {
            res.json({ success: false, message: 'No username was provded!'});
        }else{
            if (!req.body.password) {
                res.json({ success: false, message: 'No password was provded!'});
            }else{
                User.findOne({ username: req.body.username.toLowerCase()}, (err,user) =>{
                    if(err){
                        res.json({ success: false, message: err });
                    }else{
                        if (!user) {
                            res.json({ success:false, message: 'Username not found!'});
                        }else{
                            const validPassword = user.comparePassword(req.body.password);
                            if (!validPassword) {
                                res.json({ success: false, message:'Password invalid!'})
                            }else{

                                const token = jwt.sign({userId: user._id}, config.secret, { expiresIn: '24h'});

                                res.json({ success: true, message: 'Success!', token: token, user: {username: user.username}})
                            }
                        
                        }
                    }
                });
            }
        }
    })

    // router.use((req, res, next) => {
    //     const token = req.headers['authorization'];
    //     if (!token) {
    //         res.json({ success:false, message:'No token provided!'});

    //     }else{
    //         jwt.verify(token, config.secret, (err, decoded) =>{
    //             if (err) {
    //                 res.json({ success:false, message:'Token Invalid: '+ err});
    //             }else{
    //                 req.decoded = decoded;
    //                 next();
    //             }
    //         });
    //     }
    // });

    router.get('/profile', (req, res) =>{
        User.findOne({ _id: req.decoded.userId}).select('username email').exec((err, user) =>{
            if(err){
                res.json({ success:false, message: err});
            }else{
                if (!user) {
                    res.json({ success:false, message: 'User not found!'});
                }else{
                    res.json({ success: true, user: user});
                }
            }
        });
    });

    router.get('/publicProfile/:username', (req, res) => {
        // Check if username was passed in the parameters
        if (!req.params.username) {
          res.json({ success: false, message: 'No username was provided' }); // Return error message
        } else {
          // Check the database for username
          User.findOne({ username: req.params.username }).select('username email').exec((err, user) => {
            // Check if error was found
            if (err) {
              res.json({ success: false, message: 'Something went wrong.' }); // Return error message
            } else {
              // Check if user was found in the database
              if (!user) {
                res.json({ success: false, message: 'Username not found.' }); // Return error message
              } else {
                res.json({ success: true, user: user }); // Return the public user's profile data
              }
            }
          });
        }
    });

    return router;
}