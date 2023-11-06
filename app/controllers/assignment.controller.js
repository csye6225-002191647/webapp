const db = require("../models/index");
const Assignment = db.assignment;
const l = require("lodash");
const { setCustomHeaders } = require('../utils/setHeaders');
const logger = require('../config/logger.config');
const statsd = require('node-statsd')
const appConfig = require('../configs/app.config')

const client = new statsd({
    host: appConfig.METRICS_HOSTNAME,
    port: appConfig.METRICS_PORT,
    prefix: appConfig.METRICS_PREFIX
  })

// Create and Save a new Assignment
exports.createAssignment = async (req, res) => {
  // Validate request
  client.increment('endpoint.create.assignemnt')
  logger.info('Creating a new Assignment');
  const allowedFields = ['name', 'points', 'num_of_attempts', 'deadline'];
  const bodyKeys = Object.keys(req.body);

  // Check if all fields in req.body are in the allowedFields array
  const isValid = bodyKeys.every((field) => allowedFields.includes(field));

  if (!isValid) {
    logger.error('Invalid fields in request body');
    return res.status(400).json({ error: 'Invalid fields in the request body' });
  }

  if (!req.body.name) {
    res.status(400).json({
      message: "Content can not be empty!"
    });
    logger.error('Content can not be empty');
    return;
  }
  if(l.isNil(req.body.deadline) || !l.isString(req.body.deadline) || ! /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(req.body.deadline)){
    res.status(400).json({
      message: "The deadline is required and should be in the format 16-08-29T09:12:33.001Z"
    });
    logger.error('Deadline is required with valid format');
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
   // Create a modified response object without user_id
   const responseData = {
     id: data.id, 
     name: data.name,
     points: data.points,
     num_of_attempts: data.num_of_attempts,
     deadline: data.deadline,
     assignment_created: data.assignment_created,
     assignment_updated: data.assignment_updated
   };
   
   setCustomHeaders(res);
   res.status(201).json(responseData);
   logger.info('Assignment created successfully');
 })
 .catch(err => {
   res.status(400).json({
     message: err.message
   });
   logger.error('Error creating Assignment:', err.message);
 });
};

// Retrieve all Assignment from the database
exports.getAllAssignments = (req, res) => {
  client.increment('endpoint.get.assignments')
  logger.info('Retrieving all Assignments');
  var length = req.headers['content-length'];
  if (length > 0) {
    logger.error('body should be empty');
    return res.status(400).json();
  }
  Assignment.findAll()
    .then(data => {
      logger.info('Assignments retrieved successfully');
      const filteredData = data.map(item => {
        // Using object destructuring to create a new object without 'user_id'
        const { user_id, ...rest } = item.dataValues;
        return rest;
      });

      setCustomHeaders(res);
      res.status(200).json(filteredData);
      logger.info('Assignments retrieved successfully');
    })
    .catch(err => {
      res.status(400).json({
        message:
          err.message || "Some error occurred while retrieving assignments."
      });
      logger.error('Error retrieving Assignments:', err.message);
    });
};

// Retrieve Assignment from the database
exports.getAssignmentById = (req, res) => {
  client.increment('endpoint.get.assignment')
  logger.info('Retrieving Assignment by ID');
  var length = req.headers['content-length'];
  if (length > 0) {
    logger.error('body should be empty');
    return res.status(400).json();
  }
  
  const id = req.params.id;
  
  Assignment.findByPk(id)
    .then(data => {
      if (data) {
        const responseData = {
          id: data.id, 
          name: data.name,
          points: data.points,
          num_of_attempts: data.num_of_attempts,
          deadline: data.deadline,
          assignment_created: data.assignment_created,
          assignment_updated: data.assignment_updated
        };
        setCustomHeaders(res);
        res.status(200).json(responseData);
        logger.info('Assignment retrieved successfully');
      } else {
        res.status(404).json({
          message: `Cannot find Assignment with id=${id}.`
        });
        logger.warn(`Assignment with id=${id} not found`);
      }
    })
    .catch(err => {
      res.status(400).json({
        message: "Error retrieving Assignment with id=" + id
      });
      logger.error('Error retrieving Assignment:', err.message);
    });
};

// Delete Assignment from the database
exports.deleteAssignmentById = async(req, res) => {
  client.increment('endpoint.delete.assignment')
  logger.info('Deleting Assignment by ID');
  try {
    var length = req.headers['content-length'];
    if (length > 0) {
      logger.error('body should be empty');
      return res.status(400).json();
    }

    const requestParamid = req.params.id;

    const { user_id } = await Assignment.findOne({
      where: { id: requestParamid }
    });

    const user_id_header = req.user.dataValues.id
  
    if(user_id_header === user_id) {
        Assignment.destroy({
            where: { id: requestParamid }
          })
            .then(num => {
              if (num == 1) {
                setCustomHeaders(res);
                res.status(204).json({
                  message: "Assignment was deleted successfully!"
                });
                logger.info('Assignment deleted successfully');
              }
            })
            .catch(err => {
              logger.error('Error deleting Assignment:', err.message);
              res.status(400).json({
                message: "Could not delete Assignment with id=" + id
              });
            });
    } else {
        res.status(403).json({
            message: "You are not authorized to delete this assignment"
        });
        logger.warn('Unauthorized');
    }
  } catch(e) {
    res.status(404).json({
      message: "Assignment not found!"
    });
    logger.warn('Assignment not found!');
  }
};

// Update Assignment from the database
exports.updateAssignmentById = async (req, res) => {
  client.increment('endpoint.update.assignment')
  logger.info('Updating Assignment by ID');
  try {
    const id = req.params.id;

    const { user_id } = await Assignment.findOne({
      where: { id: id }
    });

    const user_id_header = req.user.dataValues.id;

    if (user_id_header === user_id) {
      const allowedFields = ['name', 'points', 'num_of_attempts', 'deadline'];

      // Check if the request body has all the allowed fields and no extra fields
      const bodyKeys = Object.keys(req.body);
      const isValid = bodyKeys.every((field) => allowedFields.includes(field));

      if (!isValid || bodyKeys.length !== allowedFields.length) {
        res.status(400).json({
          message: "Invalid or incomplete fields in the request body"
        });
        logger.error("Invalid or incomplete fields in the request body");
        return;
      }

      if (req.body.deadline && (!l.isString(req.body.deadline) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(req.body.deadline))) {
        res.status(400).json({
          message: "The deadline is required and should be in the format 2024-08-29T09:12:33.001Z"
        });
        logger.error("Deadline required with valid");
        return;
      }

      Assignment.update(req.body, {
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            logger.info('Assignment updated successfully');
            setCustomHeaders(res);
            res.status(204).json({
              message: "Assignment was updated successfully."
            });
          } else {
            res.status(404).json({
              message: `Cannot update Assignment with id=${id}. Maybe Assignment was not found or req.body is empty!`
            });
            logger.warn(`Cannot update Assignment with id=${id}. Maybe Assignment was not found or req.body is empty!`);
          }
        })
        .catch(err => {
          res.status(400).json({
            message: err.message
          });
          logger.error('Error updating Assignment:', err.message);
        });
    } else {
      res.status(403).json({
        message: "You are not authorized to update this assignment"
      });
    }
  } catch (e) {
    res.status(404).json({
      message: "Assignment does not exist"
    });
    logger.warn(`Assignment does not exist`);
  }
};