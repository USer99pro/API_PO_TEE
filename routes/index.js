
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send("Hello from the API root");  // ✅ Use send instead of render
});

module.exports = router;
