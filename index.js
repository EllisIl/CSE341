const express = require('express');
const app = express();

const contactsRouter = require('./routes/contacts');
app.use('/contacts', contactsRouter);

app.use('/', require('./routes'));
 
app.listen(process.env.PORT || port, () => {
  console.log('Web Server is listening at port ' + (process.env.PORT || port));
});