const { Router } = require('express');
const app = Router();

//requerir Auth
const isAuthenticated = require('../../services/Auth');


//requerir Controladores
const Users = require('../controllers/users/user')
const Courses = require('../controllers/courses/course')

//User routes
app.get('/users', Users.index);
app.get('/users/:userId', isAuthenticated, Users.findBy);
app.put('/users/:userId', isAuthenticated,  Users.updateBy);
// app.delete('/users/:userId', isAuthenticated, Users.removeBy);

//Auth Routes
app.post('/auth/signup', Users.signup)
app.post('/auth/login', Users.login);
// app.post('/auth/logout' Users.logout)

//Course routes
// app.get('/courses', Courses.index)

module.exports = app;
