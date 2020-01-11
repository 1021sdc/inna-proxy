const nr = require('newrelic');
const express = require('express');
const cors = require('cors');
const path = require('path');
const proxy = require('http-proxy-middleware');
const rp = require('request-promise');

const app = express();

const port = 8080;

app.use(express.static(path.join(__dirname, '/../public')));
app.use(cors());

/////////////////////////////
const reviews = 'http://34.217.147.152/reviews/';
const listings = 'http://35.166.168.110/listings/';
const photos = 'http://54.200.99.206/photos/';
const moreHomes = 'http://54.244.203.223/MoreHomes/?id=';
const booking = 'http://52.34.93.128/booking/?id=';
const room = 'http://52.34.93.128/room/?id=';

const all = [reviews, listings, photos, moreHomes, booking, room];

app.get('/test/:id', (req, res) => {
  let response = [];
  const { id } = req.params;
  Promise.all(all.map((addr) => {
      rp(addr+id)
          .then(function (res) {
              response.push(res);
          })
          .then(() => {
            if (response.length === 6) {
              res.status(200).send(response);
            }
          })
          .catch((err) => console.error(err))
  }))
});
////////////////////////////

app.get('/photos/:id', (req, res) => {
  const { id } = req.params;
  res.redirect(`http://54.200.99.206/photos/${id}`);
});

app.get('/listings/:id', (req, res) => {
  const { id } = req.params;
  res.redirect(`http://35.166.168.110/listings/${id}`);
});

app.get('/reviews/:id/', (req, res) => {
  const { id } = req.params;
  res.redirect(`http://34.217.147.152/reviews/${id}`);
});

app.use('/MoreHomes',
  proxy({
    target: 'http://54.244.203.223/MoreHomes',
    pathRewrite: (path, req) => {
      return path.split('/').slice(2).join('/');
    }
  })
);

app.use('/booking',
  proxy({
    target: 'http://52.34.93.128/booking',
    pathRewrite: (path, req) => {

      var querystring = '?';

      for (key in req.query) {
        if (querystring !== '?') {
          querystring += '&';
        }

        querystring += `${key}=${req.query[key]}`;
      }

      return querystring;
    }
  })
);

app.use('/room',
  proxy({
    target: 'http://52.34.93.128/room',
    pathRewrite: (path, req) => {

      var querystring = '?';

      for (key in req.query) {
        if (querystring !== '?') {
          querystring += '&';
        }

        querystring += `${key}=${req.query[key]}`;
      }

      return querystring;
    }
  })
);

app.listen(port, () => {
  console.log('Server is listening on port 8080')
});
