const express = require('express')

const db = require('../models/index')

const Assignment = db.assignment

const router = express.Router()
const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  deleteAssignmentById,
  updateAssignmentById,
} = require('../controllers/assignment.controller')
const authorizeToken = require('../middlewares/auth')(Assignment)

router.get('/', authorizeToken, getAllAssignments)
router.post('/', authorizeToken, createAssignment)
router.get('/:id',authorizeToken, getAssignmentById)
router.delete('/:id', authorizeToken, deleteAssignmentById)
router.put('/:id', authorizeToken, updateAssignmentById)

module.exports = router;
