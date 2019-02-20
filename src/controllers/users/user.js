const mongoose = require('mongoose');
//requerimos bcrypt
const bcrypt = require('bcrypt');
//requerimos jwt
const jwt = require('jsonwebtoken');
//Requerimos el modelo
const User = require('../../models/User');
const Comment = require('../../models/Comment')
const Course = require('../../models/Course')
//Encuentra usuario
const index = (req, res) => {
  User
      .find()
      .exec()
      .then(users => {
        res
          .json({
            users,
            total: users.length
          })
          .status(200)
      })
      .catch(err => {
        console.log(`caugth err: ${err}`);
        return res.status(500).json(err)
      })
}

//Registrate Usuario
const signup = (request, response) => {
  User
    .find({email: request.body.email})
    .exec()
    .then(users => {
      if (users.length < 1) {
        //save new user using bcrypt
        bcrypt.hash(request.body.password, 10, (error, hash) => {
          if (error) {
            return response
                    .status(500)
                    .json({
                      message:  error
                    })
          }
          //create new user
          const newUser = new User ({
            _id: mongoose.Types.ObjectId(),
            name: request.body.name,
            username: request.body.username,
            email: request.body.email,
            password: hash
          });
          newUser
            .save()
            .then(saved => {
              response
                .status(200)
                .json({
                  message: 'User created succesfully',
                  data: saved
                });
            })
        });
      } else {
          response
            .status(422)
            .json({
              message: 'User already exists'
            })
      }
    })
    .catch(err => {
      console.log(`caugth err: ${err}`);
      return res.status(500).json(err)
    })
}

//Inicia sesión
const login = (request, response) => {
  User
    .find({email: request.body.email})
    .exec()
    .then(user => {
      if (user.length > 0) {
        //comparación de passwords
        bcrypt.compare(request.body.password, user[0].password, (error, result) => {
          if (error) {
            return response
                .status(401)
                .json({
                  message: 'Authentication Failed.'
                })
          }
          //se crea token
          if (result) {
            const token = jwt.sign({
              name: user[0].name,
              username: user[0].username,
              email: user[0].email,
              _id: user[0]._id
            }, process.env.JWT_SECRETKEY,{
              expiresIn:'1hr'
            });

            return response
                .status(200)
                .json({
                  message: 'Authentication Succesfull',
                  token
                });
          }

          response
            .status(401)
            .json({
              message: 'Authentication Failied'
            })
        });
      } else {
        response
          .status(422)
          .json({
            message: 'Authentication Failied'
          })
      }
    });
}

const findBy = (req , res) => {
  User
      .findById(req.params.userId)
      .exec()
      .then(users => {
        // console.log(users)
        res.json({
          users
        })
        .status(200)
      })
      .catch(err => {
        console.log(`caugth err ${err}`);
        return res.status(500).json(err)
      })
}

const updateBy = (request, response) => {

  const name = request.body.name;
  const email = request.body.email;
  const password = request.body.password;
  const username = request.body.username;

  User
    // console.log(request.params.userId)
    .findOne({_id: request.params.userId})
    .then(function(user){
      console.log(`user: ${user}`)
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          user.name = name;
          user.email = email;
          user.username = username;

          user.save()
              .then(saved => {
                response
                  .status(201)
                  .json({
                    message: 'User updated succesfully',
                    user: saved
                  });
              })
        } else {
          bcrypt.hash(password, 10, (error, hash) => {
            if (error) {
              return response
                .status(500)
                .json({
                  message: error
                });
            }
            user.name = name;
            user.email = email;
            user.username = username;
            user.password = hash;

            user
              .save()
              .then(saved => {
                response
                  .status(201)
                  .json({
                    message: 'User updated succesfully',
                    user: saved
                  });
              })
          });
        }
      });
    })
    .catch(err => {
      console.log(`caugth the error: ${err}`);
      return response.status(404).json({"type": "Not found"});
    });
}

const findCommentsByUser = (req, res) => {
  User
    .findById(req.params.userId)
    .populate('comments')
    .exec()
    .then(user => {
      res.json({
        coincidences: user.comments.length,
        data: user.comments
      })
      .status(200)
    })
    .catch(err => {
      console.log(`Caught error: ${err}`)
      return res.status(500).json(err)
    })
}

const createComment = (req, res) => {
  User
    .findById(req.params.userId)
    .exec()
    .then(user => {
      const newComment = new Comment({
        _id: mongoose.Types.ObjectId(),
        text: req.body.text,
        ratings: req.body.ratings,
        user: req.params.userId,
        username:req.body.username,
        course: req.body.course
      });
      newComment
        .save()
        .then(commentCreated => {
          const courseId = newComment.course
      Course
        .findById(courseId)
        .exec()
        .then(course => {
          course.comments.push(commentCreated._id)
          course.commentsText.push(commentCreated.text)
          course.commentsRating.push(commentCreated.ratings)
          course.save()
        })
          user.comments.push(commentCreated._id)
          user.save();
          res.json({
            type:'Comment Created',
            data:commentCreated
          })
          .status(200)
        })
        .catch(err => {
          console.log(`Caught error:${err}`)
          return res.satus(500).json(err)
        })
    })
}

module.exports = {index, signup, login, findBy, updateBy, createComment, findCommentsByUser}
