const express = require('express');
const router = express.Router();
const round1 = require('../controllers/roundone/adminRoutes');
const auth = require('../middleware/authmiddleware');
const assignIndustry = require('../seeds/assignIndustry');
const changeState = require('../seeds/changeState');

router.route('/assignCity')
    .get(round1.getCity)
    .post(round1.assignCity)
router.route('/assignIndustry')
    .get(assignIndustry)

router.route('/changeState')
    .post(changeState)
module.exports = router;