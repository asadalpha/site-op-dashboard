const express = require('express');
const controller = require('../controllers/site.controller');
const { validateSite } = require('../validators/site.validator');

const router = express.Router();
router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', validateSite, controller.create);
router.put('/:id', validateSite, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
