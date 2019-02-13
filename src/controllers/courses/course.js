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

const findby = (req, res) => {
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
