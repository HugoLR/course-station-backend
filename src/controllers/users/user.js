const mongoose = require('mongoose');
//requerimos bcrypt
const bcrypt = require('bcrypt');
//requerimos jwt
const jwt = require('jsonwebtoken');

//Requerimos el modelo
const User = require('../../models/User');

//Encuentra
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

//Registrate
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
              email: user[0].email
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

module.exports = {index, signup, login, findBy, updateBy}
