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

router.get('/', getAllAssignments)
router.post('/', createAssignment)
router.get('/:id', getAssignmentById)
router.delete('/:id', deleteAssignmentById)
router.put('/:id', updateAssignmentById)

module.exports = router;
