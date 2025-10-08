const express = require('express');
const queryController = require('../../controllers/Client/queryController');

const { getAllQueries, responseQuery } = require('../../controllers/Admin/querySupport');
const upload = require('../../middleware/multer');
const verification = require('../../middleware/verification');


const router = express.Router();


// Comment: Routes for query management
router.post('/queries',verification, upload.array('photos'), queryController.createQuery);
router.get('/queries/client/:clientId', queryController.getClientQueries);

// Add client reply
router.patch('/queries/:queryId/reply', upload.array('attachments'), verification, queryController.addClientReply);

//admin section
router.get('/all-quaries',getAllQueries)
router.patch('/queries/:queryId/response', verification, responseQuery);

module.exports = router;