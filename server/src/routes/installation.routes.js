const express = require('express');
const controller = require('../controllers/installation.controller');
const { validateInstallation } = require('../validators/installation.validator');

const router = express.Router();
router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', validateInstallation, controller.create);
router.put('/:id', validateInstallation, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
