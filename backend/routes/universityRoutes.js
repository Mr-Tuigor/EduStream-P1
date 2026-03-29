const express = require('express');
const router = express.Router();
const { getUniversity } = require('../controllers/universityController');

router.get('/', getUniversity);

module.exports = router;