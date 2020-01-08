const nr = require('newrelic');
const express = require('express');
const cors = require('cors');
const path = require('path');
const proxy = require('http-proxy-middleware');

const app = express();

const port = 8080;

app.use(express.static(path.join(__dirname, '/../public')));
app.use(cors());

app.get('/photos/:id', (req, res) => {
  const { id } = req.params;
  res.redirect(`http://54.201.94.44/photos/${id}`);
})

app.get('/listings/:id', (req, res) => {
  const { id } = req.params;
  res.redirect(`http://34.219.65.114/listings/${id}`);
})

// app.get('/booking', (req, res) => {
//   const { id } = req.params;
//   res.redirect(`http://52.53.211.152:3333/booking/?id=25`);
// })

// app.get('/room', (req, res) => {
//   const { id } = req.params;
//   res.redirect(`http://52.53.211.152:3333/room/?id=25`);
// })

app.get('/reviews/:id/', (req, res) => {
  const { id } = req.params;
  res.redirect(`http://34.217.147.152/reviews/${id}`);
})

// app.get('/MoreHomes', (req, res) => {
//   const { id } = req.params;
//   res.redirect(`http://35.164.175.129:3005/MoreHomes/${id}`);
//   // res.redirect(`http://35.164.175.129:3005/MoreHomes`);
// })

// app.use('/MoreHomes',
//   proxy({
//     target: 'http://35.164.175.129/MoreHomes',
//       pathRewrite: (path, req) => {
//         return path.split('/').slice(2).join('/');
//       }
//     })
// );

// app.use('/booking',
//   proxy({
//     target: 'http://localhost:3001/',
//       pathRewrite: (path, req) => {

//         return path
//       }
//     })
// );

// app.use('/room',
//   proxy({
//     target: 'http://localhost:3001/',
//       pathRewrite: (path, req) => {

//         return path
//       }
//     })
// );

app.use('/booking',
  proxy({
    target: 'http://54.218.70.41/booking',
    pathRewrite: (path, req) => {

      var querystring = '?';

      for (key in req.query) {
        if (querystring !== '?') {
          querystring += '&';
        }

        querystring += `${ key }=${ req.query[key] }`;
      }

      return querystring;
    }
  })
);

app.use('/room',
  proxy({
    target: 'http://54.218.70.41/room',
    pathRewrite: (path, req) => {

      var querystring = '?';

      for (key in req.query) {
        if (querystring !== '?') {
          querystring += '&';
        }

        querystring += `${ key }=${ req.query[key] }`;
      }

      return querystring;
    }
  })
);

app.listen(port, () => {
  console.log('Server is listening on port 8080')
});