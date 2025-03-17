const express = require("express");
const app = express();
const router = express.Router();
const port = 3000;

app.use(express.urlencoded({ extended: true })) // Acceder a urlencoded
app.use(express.json())

router.get('/test', (req, res) => {
  res.send("Hello world")
})

app.use(router)
app.listen(port, () => {
  console.log('Listen on ' + port)
})
