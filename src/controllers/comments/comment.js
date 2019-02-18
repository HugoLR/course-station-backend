const mongoose = require('mongoose');
const Comment = require('../../models/Comment');

//encontrar comentarios
const index = (req, res) => {
  Comment
    .find()
    .exec()
    .then(data => {
      res.json({
        type:'Getting Comments',
        data: data
      })
      .status(200)
    })
    .catch(err => {
      console.log(`Caught error: ${err}`);
      return res.status(500).json(err);
    })
}

const findBy = (req, res) => {
  Comment
    .findById(req.params.commentId)
    .then(data => {
      res.json({
        type: 'Getting Comment',
        data: data
      })
      .status(200)
    })
    .catch(err => {
      console.log(`Caught error: ${err}`);
      return res.status(500).json(err)
    })
}

module.exports = {index, findBy}
