const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const userRouter = require('./app/routes/userRoutes');

mongoose.connect('mongodb://node-shop:node-shop@node-rest-shop-shard-00-00.hetiu.mongodb.net:27017,node-rest-shop-shard-00-01.hetiu.mongodb.net:27017,node-rest-shop-shard-00-02.hetiu.mongodb.net:27017/mine-info-test?ssl=true&replicaSet=atlas-1fxegt-shard-0&authSource=admin&retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('Database connected'))
    .catch(error => console.log(error));

mongoose.Promise = global.Promise;

const corsOptions = {
    origin: "http://localhost:8081"
};


app.use(cors(corsOptions));
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Headers', 'PUT', 'PATCH', 'POST', 'GET', 'DELETE');
        return res.status(200).json({});
    }
    next();
});

// route should be handle the request.
app.use('/api/user', userRouter);


app.get("/", (req, res, next) => {
    res.status(200).json({
        message: 'Welcome to mine-info-user Machine test!',
        status_code: 200
    })
});


 
app.use((req, res, next) => {
    const error = new Error('Not found');
    res.status = 404;
    next(error)
});
   


app.use((error, req, res, next) => {
    res.status = (error.status || 500);
    res.json({
        error: {
            message: 'Internal server error.',
            status_code: "500"
        }
    })
})


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});



module.exports = app;