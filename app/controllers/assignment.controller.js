const db = require("../models/index");
const Assignment = db.assignment;
const {Op} = require('sequelize');

// Create and Save a new Assignment
exports.createAssignment = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Assignment
  const assignmet = {
    name: req.body.name,
    points: req.body.points,
    num_of_attempts: req.body.num_of_attempts,
    deadline : req.body.deadline
  };

  // Save Tutorial in the database
  Assignment.create(assignmet)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Assignment."
      });
    });
};

// Retrieve all Assignment from the database.
exports.getAllAssignments = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  
    Assignment.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving assignments."
        });
      });
  };

exports.getAssignmentById = (req, res) => {
    const id = req.params.id;
  
    Assignment.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Assignment with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Assignment with id=" + id
        });
      });
  };

exports.deleteAssignmentById = (req, res) => {
    const id = req.params.id;
  
    Assignment.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Assignment was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Assignment with id=${id}. Maybe Assignment was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Assignment with id=" + id
        });
      });
  };

  exports.updateAssignmentById = (req, res) => {
    const id = req.params.id;
  
    Assignment.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Assignment was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Assignment with id=${id}. Maybe Assignment was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Assignment with id=" + id
        });
      });
  };

  