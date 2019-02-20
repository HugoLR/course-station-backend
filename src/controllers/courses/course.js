const mongoose = require('mongoose')

const Course = require('../../models/Course')

//Encuentra
const index = (req, res) => {
  Course
        .find()
        .exec()
        .then(courses => {
          res
            .json({
              courses,
              total: courses.length
            })
            .status(200)
        })
        .catch(err => {
          console.log(`caugth err: ${err}`);
          return res.status(500).json(err)
        })
}

//Encuentra por Id
const findBy = (req, res) => {
  Course
        .findById(req.params.courseId)
        .exec()
        .then(courses => {
          res.json({
            courses
          })
          .status(200)
        })
        .catch(err => {
          console.log(`caugth err ${err}`);
          return res.status(500).json(err)
        })

}

//Crea
const create = (req, res) => {
  Course
      const newCourse = new Course ({
        _id:mongoose.Types.ObjectId(),
        title:req.body.title,
        description:req.body.description,
        url:req.body.url,
        instructors:req.body.instructors,
        image:req.body.image,
        plattform:req.body.plattform,
        level:req.body.level,
        price:req.body.price,
      })
  newCourse
  .save()
  .then(data => {
    res.json({
      type:'New Course Created',
      data: data
    })
    .status(200)
  })
  .catch(err => {
    console.log(`caugth err:${err}`);
    return res.status(500).json(err)
  })
}

const findCommentsByCourse = (req, res) => {
  Course
    .findById(req.params.courseId)
    .populate("comments")
    .exec()
    .then(course => {
      res.json({
        coincidences: course.comments.length,
        data:course.comments
      })
      .status(200)
    })
    .catch(err => {
      console.log(`caugth err: ${err}`);
      return res.status(500).json(err)
    })

  // Course
  //   .findById(req.params.courseId)
  //   .populate("user")
  //   .exec()
  //   .then(course => {
  //     res.json({
  //       data:course.use
  //     })
  //     .status(200)
  //   })
  //   .catch(err => {
  //     console.log(`caugth err: ${err}`);
  //     return rest.status(500).json(err)
  //   })
}

const showCommentsForAllCourses = (req,res) => {
  Course
    .find()
    .populate("comments")
    .exec()
    .then(course => {
      res.json({
        data:course
      })
      .status(200)
    })
    .catch(err => {
      console.log(`caugth err: ${err}`);
      return res.statu(500).json(err)
    })
}

module.exports = {index, findBy, create, findCommentsByCourse, showCommentsForAllCourses }
