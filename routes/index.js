var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var _ = require('underscore');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/crime', function(req, res) {
  var date = new Date(Date.now()-30*24*60*60*1000); // A week ago
  var dateYear = date.getUTCFullYear();
  var dateMonth = date.getUTCMonth()+1 < 10 ? '0'+(date.getUTCMonth()+1) : date.getUTCMonth()+1;
  var dateDate = date.getUTCDate() < 10 ? '0'+date.getUTCDate() : date.getUTCDate();
  var dateString = dateYear+'-'+dateMonth+'-'+dateDate;

  unirest.get('http://sanfrancisco.crimespotting.org/crime-data.php?format=json&count=100000&dstart='+dateString+'&dend='+dateString)
    .header('Accept', 'application/json')
    .end(function(result) {
      var crimes = _.map(result.body.features, function(feature) {
        return [feature.properties.date_time, feature.properties.description];
      });
      res.json(crimes);
    });
});

module.exports = router;

