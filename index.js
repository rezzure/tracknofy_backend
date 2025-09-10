const connectDB = require("./server.js");

connectDB();

require("dotenv").config();
const port = process.env.PORT ;
const express =  require('express');
const app = express();
const cors = require("cors")
const path = require('path')
app.use(express.json());

app.use(cors({origin:'*'}));


app.use(express.urlencoded({ extended: true }));     

// query photo for client site
app.use(express.static(path.join(__dirname, 'public')));  
//company logo photo to displayin comapnies list(middleware)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/",(req,res)=>[
    res.send("this is home page")
])


app.use("/api", require("./router/Auth.router/auth.router.js")) // auth api----done
app.use("/api",require("./router/admin.router/admin.router.js"))// admin api---- done
app.use("/api",require("./router/client.router/client.router.js"))// client api---- 
app.use("/api",require("./router/supervisor.router/supervisor.router.js"))  //supervisor api---- done 

app.use('/api', require('./router/query.router/query.router.js'));   // query support api

app.use('/api', require('./router/superAdmin.router/addCompany.router.js'));  //super Admin

app.use((req, res, next) => {
  console.log('DEBUG: Incoming request:', req.method, req.originalUrl);
  next();
});


app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port http://localhost:${port}`);
    console.log(`Also accessible at http://YOUR_LOCAL_IP:${port}`);
});