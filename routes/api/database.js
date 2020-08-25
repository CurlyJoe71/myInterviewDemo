const router = require('express').Router();
const controller = require('./dbcontroller');

// connect to the database
router.route('/getManagers')
  .get(controller.getManagers);

router.route('/page/:perPage/:offset')
  .get(controller.getPage);

router.route('/getQuestions/all')
  .get(controller.getQuestions);

router.route('/new')
  .get(controller.addNew);

router.route('/:id')
  .get(controller.get);

router.route('/getCandidates/preScreen')
  .get(controller.getPreScreenCandidates);

router.route('/')
  .get(controller.getAll);
  
 module.exports = router;