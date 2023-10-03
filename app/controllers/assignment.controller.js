const db = require("../models/index");
const Assignment = db.assignment;
const User = db.users;

// Create and Save a new Assignment
exports.createAssignment = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

    const { id } = req.user.dataValues

  // Create a Assignment
  const assignment = {
    name: req.body.name,
    points: req.body.points,
    num_of_attempts: req.body.num_of_attempts,
    deadline : req.body.deadline,
    user_id: id
  };

  // Save in the database
  Assignment.create(assignment)
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Assignment."
      });
    });
};

// Retrieve all Assignment from the database
exports.getAllAssignments = (req, res) => {
    Assignment.findAll()
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving assignments."
        });
      });
  };

// Retrieve Assignment from the database
exports.getAssignmentById = (req, res) => {
    const id = req.params.id;
  
    Assignment.findByPk(id)
      .then(data => {
        if (data) {
          res.status(200).send(data);
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

// Delete Assignment from the database
exports.deleteAssignmentById = async(req, res) => {
    const id = req.params.id;
    const {user_id} = await Assignment.findOne({
        where: { id: id }
      });
  
    const user_id_header = req.user.dataValues.id
  
    if(user_id_header === user_id) {
        Assignment.destroy({
            where: { id: id }
          })
            .then(num => {
              if (num == 1) {
                res.status(204).send({
                  message: "Assignment was deleted successfully!"
                });
              } else {
                res.status(404).send({
                  message: `Cannot delete Assignment with id=${id}. Maybe Assignment was not found!`
                });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Could not delete Assignment with id=" + id
              });
            });
    } else {
        res.status(401).send({
            message: "You are not authorized to delete this assignment"
        });
    }
  };

// Update Assignment from the database
exports.updateAssignmentById = async(req, res) => {
    const id = req.params.id;

    const { user_id } = await Assignment.findOne({
        where: { id: id }
        });

    const user_id_header = req.user.dataValues.id

    if(user_id_header === user_id) {

    Assignment.update(req.body, {
        where: { id: id }
    })
        .then(num => {
        if (num == 1) {
            res.status(204).send({
                message: "Assignment was updated successfully."
            });
        } else {
            res.status(404).send({
                message: `Cannot update Assignment with id=${id}. Maybe Assignment was not found or req.body is empty!`
            });
        }
        })
        .catch(err => {
        res.status(500).send({
            message: "Error updating Assignment with id=" + id
        });
        });
    } else {
        res.status(401).send({
            message: "You are not authorized to update this assignment"
        });
    }
};

  