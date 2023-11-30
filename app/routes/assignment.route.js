const express = require('express')

const db = require('../models/index')

const Assignment = db.assignment
const Submission = db.submission

const router = express.Router()
const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  deleteAssignmentById,
  updateAssignmentById,
  submitAssignmentbyId
} = require('../controllers/assignment.controller')
const authorizeToken = require('../middlewares/auth')(Assignment, Submission)

router.get('/', authorizeToken, getAllAssignments)
router.post('/', authorizeToken, createAssignment)
router.get('/:id',authorizeToken, getAssignmentById)
router.delete('/:id', authorizeToken, deleteAssignmentById)
router.put('/:id', authorizeToken, updateAssignmentById)
router.post('/:id/submission', authorizeToken, submitAssignmentbyId)

module.exports = router;
