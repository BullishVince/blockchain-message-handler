var express = require('express')
var router = express.Router();

router.get('', function(req, res){
    res.json(
        { 'success' : true,
          'route' : 'message'
        });
});

module.exports = router;