const router = require('express').Router();
const dbRoutes = require('./api/database');
const updateRoutes = require('./api/updateRoutes');
const addRoutes = require('./api/addRoutes');
const getIDRoutes = require('./api/getIDRoutes');
const getReportData = require('./api/getReportData');
const webhookRoutes = require('./api/webhookRoutes');
const newVideoRoutes = require('./api/newVideoRoutes');
const emailRoutes = require('./api/emailRoutes');

router.use('/api', dbRoutes);
router.use('/updateCandidate', updateRoutes);
router.use('/addNewCandidate', addRoutes);
router.use('/getID', getIDRoutes);
router.use('/reports', getReportData);
router.use('/webhook', webhookRoutes);
router.use('/video-api', newVideoRoutes);
router.use('/email', emailRoutes);

module.exports = router;