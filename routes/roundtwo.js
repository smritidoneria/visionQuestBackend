// express = require('express');
// const router = express.Router();
// const round1 = require('../controllers/roundone/investingRound');
const express = require('express');
const router = express.Router();
const roundTwo=require('../controllers/roundTwo/file');
const roundTwo1=require('../controllers/roundTwo/quiz')
const { hasRoundOneStarted } = require('../middleware/middleware');
const auth = require('../middleware/authmiddleware');
router.route('/')
    .post(  roundTwo.valuation)
    .get(roundTwo.valuationaftercrises)
router.route('/quiz')
    .post(roundTwo1.quiz)
module.exports = router;