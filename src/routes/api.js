const { Router } = require('express');
const app = Router();

//requerir Auth
const isAuthenticated = require('../../services/Auth');


//requerir Controladores
const Users = require('../controllers/users/user');
const Courses = require('../controllers/courses/course');
const Comments = require('../controllers/comments/comment');

//User routes
app.get('/users', Users.index);
app.get('/users/:userId', Users.findBy);
app.put('/users/:userId', isAuthenticated,  Users.updateBy);
app.get('/users/:userId/comments', Users.findCommentsByUser);
app.post('/users/:userId/comments', Users.createComment);
app.delete('/users/:userId/comments', Users.removeComment);
// app.delete('/users/:userId', isAuthenticated, Users.removeBy);

//Auth Routes
app.post('/auth/signup', Users.signup);
app.post('/auth/login', Users.login);
// app.post('/auth/logout' Users.logout)

// Course routes
app.get('/courses', Courses.index);
app.get('/courses/:courseId', Courses.findBy);
app.get('/courses/:courseId/comments', Courses.findCommentsByCourse)
app.get('/courses/comments', Courses.showCommentsForAllCourses)
app.post('/courses', Courses.create);


//Comments routes
app.get('/comments', Comments.index);
app.get('/comments/:commentId', Comments.findBy);


module.exports = app;
