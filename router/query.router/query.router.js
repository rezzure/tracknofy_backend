const express = require('express');
const queryController = require('../../controllers/Client/queryController');

const { getAllQueries, deleteQuery, responseQuery } = require('../../controllers/Admin/querySupport');
const upload = require('../../middleware/multer');
const verification = require('../../middleware/verification');


const router = express.Router();


// Comment: Routes for query management
router.post('/queries',verification, upload.array('photos'), queryController.createQuery);
router.get('/queries/client/:clientId', queryController.getClientQueries);

// Add client reply
router.patch('/queries/:queryId/reply', upload.array('attachments'), queryController.addClientReply);

//admin section
router.get('/all-quaries',getAllQueries)
// Correct PATCH route for updating a query (admin response)
// Remove incorrect POST route for admin response
// queryRouter.post('/queries/queryId/response', updateQuery)
router.delete('/queries/delete/:id', deleteQuery)
 

// Correct PATCH route for admin response to match frontend
router.patch('/queries/:queryId/response', responseQuery);
//admin
// queryRouter.patch('/update-query-status/:id/status', queryController.updateQueryStatus);

module.exports = router;