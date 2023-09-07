/** @format */

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const myParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
// app.use(myParser.json());
// app.use(
//   myParser.urlencoded({
//     extended: true,
//   })
// );
// app.use(myParser.json({ limit: '200mb' }));
// app.use(myParser.urlencoded({ limit: '200mb', extended: true }));
app.use(
  myParser.json({
    limit: '50mb',
  })
);

app.use(
  myParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true,
  })
);
const ATLAS_URI =
  'mongodb+srv://demouser:MejKpNxdXgvWjwnL@cluster0.ys8qius.mongodb.net/demo-project?retryWrites=true&w=majority';
mongoose
  .connect(ATLAS_URI)
  .then((result) => console.log('DB connected'))
  .catch((err) => console.log(err));

app.use('/', routes);

const port = process.env.port || 5000;
app.listen(port, () => console.log('listening on port '));
