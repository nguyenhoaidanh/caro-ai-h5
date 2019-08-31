const express = require('express');
const router = express.Router();
var User = require('./user');
router.post('/', (req, res) => {
    var { name, time, opponent } = req.body;
    const newItem = new User({   name, time, opponent  });
    newItem
        .save()
        .then(item => res.send(item))
        .catch(err => res.send(err));
});
router.get('/', (req, res) => {
    User.find({}).sort({time: 1})
        .then(data => res.send({ data }))
        .catch(err => res.send({ err }));
});
module.exports = router; 