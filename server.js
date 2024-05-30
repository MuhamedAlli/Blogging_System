var cors = require('cors');
var bodyParser = require('body-parser');
var authRouter = require('./routes/authRoute');
var postRouter = require('./routes/postRoute');
const path = require('path');
var savedPostRouter = require('./routes/savedPostRoute');
var express = require('express');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var app = express();


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'images')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/",(req , res)=>{
    res.send("server is running...");
});

app.use("/api/v1" , authRouter);
app.use("/api/v1", postRouter);
app.use("/api/v1", savedPostRouter);

app.listen(6565);
