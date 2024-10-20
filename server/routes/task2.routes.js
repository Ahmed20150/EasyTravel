// backend/routes/course.routes.js
const express = require('express');
const { getAllCourses, addCourse, updateMaxCapacity, getDepartmentByCode, deleteCourse } = require('../controller/course.controller');
const router = express.Router();

router.get('/', getAllCourses);
router.post('/', addCourse);
router.put('/capacity/:code', updateMaxCapacity);
router.get('/department/:code', getDepartmentByCode);
router.delete('/:code', deleteCourse);

module.exports = router;
