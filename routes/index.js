var router = require('express').Router();

router.get('/', (req, res) => {
  res.send('welcome to ReySan API');
});

router.use('/users', require('./users'));
router.use('/categorys', require('./categorys'));
router.use('/cites', require('./cites'));


module.exports = router;
