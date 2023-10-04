const db = require("../models/index");
const Assignment = db.assignment;
const User = db.users;
const l = require("lodash");
const { setCustomHeaders } = require('../utils/setHeaders');
// Create and Save a new Assignment
exports.createAssignment = async (req, res) => {

  if(req.url.includes('?')) {
    return res.status(400).json({ error: 'Invalid url' });
  }

  // Validate request
  const allowedFields = ['name', 'points', 'num_of_attempts', 'deadline'];
  const bodyKeys = Object.keys(req.body);

  // Check if all fields in req.body are in the allowedFields array
  const isValid = bodyKeys.every((field) => allowedFields.includes(field));

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid fields in the request body' });
  }

  if (!req.body.name) {
    res.status(400).json({
      message: "Content can not be empty!"
    });
    return;
  }
  if(l.isNil(req.body.deadline) || !l.isString(req.body.deadline) || ! /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(req.body.deadline)){
    res.status(400).json({
      message: "The deadline is required and should be in the format 16-08-29T09:12:33.001Z"
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
      setCustomHeaders(res);
      res.status(201).json(data);
    })
    .catch(err => {
      res.status(400).json({
        message:
          err.message
      });
    });
};

// Retrieve all Assignment from the database
exports.getAllAssignments = (req, res) => {
  if(req.url.includes('?')) {
    return res.status(400).json({ error: 'Invalid url' });
  }
    Assignment.findAll()
      .then(data => {
        setCustomHeaders(res);
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(400).json({
          message:
            err.message || "Some error occurred while retrieving assignments."
        });
      });
  };

// Retrieve Assignment from the database
exports.getAssignmentById = (req, res) => {
  if(req.url.includes('?')) {
    return res.status(400).json({ error: 'Invalid url' });
  }
    const id = req.params.id;
  
    Assignment.findByPk(id)
      .then(data => {
        if (data) {
          setCustomHeaders(res);
          res.status(200).json(data);
        } else {
          res.status(404).json({
            message: `Cannot find Assignment with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(400).json({
          message: "Error retrieving Assignment with id=" + id
        });
      });
  };

// Delete Assignment from the database
exports.deleteAssignmentById = async(req, res) => {
  if(req.url.includes('?')) {
    return res.status(400).json({ error: 'Invalid url' });
  }
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
                setCustomHeaders(res);
                res.status(204).json({
                  message: "Assignment was deleted successfully!"
                });
              } else {
                res.status(404).json({
                  message: `Cannot delete Assignment with id=${id}. Maybe Assignment was not found!`
                });
              }
            })
            .catch(err => {
              res.status(400).json({
                message: "Could not delete Assignment with id=" + id
              });
            });
    } else {
        res.status(403).json({
            message: "You are not authorized to delete this assignment"
        });
    }
  };

// Update Assignment from the database
exports.updateAssignmentById = async(req, res) => {
  if(req.url.includes('?')) {
    return res.status(400).json({ error: 'Invalid url' });
  }
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
            setCustomHeaders(res);
            res.status(204).json({
                message: "Assignment was updated successfully."
            });
        } else {
            res.status(404).json({
                message: `Cannot update Assignment with id=${id}. Maybe Assignment was not found or req.body is empty!`
            });
        }
        })
        .catch(err => {
        res.status(400).json({
            message: "Error updating Assignment with id=" + id
        });
        });
    } else {
        res.status(403).json({
            message: "You are not authorized to update this assignment"
        });
    }
};

