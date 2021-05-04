const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

//routes
const usersRouter = require('./routers/users');
const postsRouter = require('./routers/posts');

const api = process.env.API_URL;

const port = 3000 || process.env.PORT;

app.use(cors());
app.options('*', cors());

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

//routers
app.use(`${api}/users`, usersRouter);
app.use(`${api}/posts`, postsRouter);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database Connected");
}).catch((err) => {
    console.log(err);
})

//Development
// app.listen(3000, () => {
//     // console.log(api);                           
//     console.log(`server is running on port: ${port}`)
// })

//Production
var server = app.listen(process.env.PORT || 3000, function() {
    var port = server.address().port;
    console.log("Express is working on port" + port );
})

