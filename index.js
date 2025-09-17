// const connectDB = require("./server.js");



// const formRoutes = require('./router/formRouter/formRouter.js');
// const submissionRoutes = require('./router/submissionRouter/submissionRouter.js');
// const fileRoutes = require('./router/file.router/fileRouter.js');
// const dashboardRoutes = require('./router/dashbordRouter/dashboardRouter.js');
// const fs = require('fs');

// connectDB();

// require("dotenv").config();
// const port = process.env.PORT;
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const path = require("path");
// app.use(express.json());

// app.use(cors({ origin: "*" }));

// app.use(express.urlencoded({ extended: true }));

// // query photo for client site
// app.use(express.static(path.join(__dirname, "public")));
// //company logo photo to displayin comapnies list(middleware)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.get("/", (req, res) => [res.send("this is home page")]);



// // testion


// // Create uploads directory if it doesn't exist
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Serve static files from uploads directory
// app.use('/uploads', express.static('uploads'));

// // Routes
// app.use('/api', formRoutes);
// app.use('/api', submissionRoutes);
// app.use('/api', fileRoutes);
// app.use('/api/dashboard', dashboardRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', message: 'Form Builder API is running' });
// });

// // Error handling middleware
// const upload = require('./middleware/dynamicForm.multer/multer.js');
// app.use((error, req, res, next) => {
//   if (error instanceof upload.MulterError) {
//     if (error.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({
//         success: false,
//         message: 'File too large. Maximum size is 5MB.'
//       });
//     }
//   }
// })
 


// // testingg





// app.use("/api", require("./router/Auth.router/auth.router.js")); // auth api----done
// app.use("/api", require("./router/admin.router/admin.router.js")); // admin api---- done
// app.use("/api", require("./router/client.router/client.router.js")); // client api----
// app.use("/api", require("./router/supervisor.router/supervisor.router.js")); //supervisor api---- done

// app.use("/api", require("./router/query.router/query.router.js")); // query support api

// app.use("/api", require("./router/superAdmin.router/addCompany.router.js")); //super Admin

// app.use((req, res, next) => {
//   console.log("DEBUG: Incoming request:", req.method, req.originalUrl);
//   next();
// });


// app.listen(port, "0.0.0.0", () => {
//     console.log(`Server is running on port http://localhost:${port}`);
//     console.log(`Also accessible at http://YOUR_LOCAL_IP:${port}`);
// });





// Updated code
const connectDB = require("./server.js");
const formRoutes = require('./router/formRouter/formRouter.js');
const submissionRoutes = require('./router/submissionRouter/submissionRouter.js');
const fileRoutes = require('./router/file.router/fileRouter.js');
const dashboardRoutes = require('./router/dashbordRouter/dashboardRouter.js');
const fs = require('fs');

connectDB();

require("dotenv").config();
const port = process.env.PORT;
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
app.use(express.json());

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

// Serve static files from public directory (this will serve files from public/uploads)
app.use(express.static(path.join(__dirname, "public")));

// Also create a specific route for uploads if needed
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

app.get("/", (req, res) => [res.send("this is home page")]);

// Routes
app.use('/api', formRoutes);
app.use('/api', submissionRoutes);
app.use('/api', fileRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Form Builder API is running' });
});

// Error handling middleware
const upload = require('./middleware/dynamicForm.multer/multer.js');
app.use((error, req, res, next) => {
  if (error instanceof upload.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
  }
});

// Other routes
// kanban board task router
app.use('/api', require("./router/kanbanRouter/kanBanRouter.js"));
app.use("/api", require("./router/Auth.router/auth.router.js"));
app.use("/api", require("./router/admin.router/admin.router.js"));
app.use("/api", require("./router/client.router/client.router.js"));
app.use("/api", require("./router/supervisor.router/supervisor.router.js"));
app.use("/api", require("./router/query.router/query.router.js"));
app.use("/api", require("./router/superAdmin.router/addCompany.router.js"));
app.use('/api', require('./router/survey.router/surveyRouter.js'));

app.use((req, res, next) => {
  console.log("DEBUG: Incoming request:", req.method, req.originalUrl);
  next();
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port http://localhost:${port}`);
    console.log(`Also accessible at http://YOUR_LOCAL_IP:${port}`);
});