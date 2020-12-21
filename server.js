const express = require('express') 
const cors = require('cors')
const compression = require('compression')
const bodyParser = require('body-parser');
const path = require('path')
const Wemo = require('wemo-client')

const app = express()
const port = 3000
const wemo = new Wemo({
  port: 1234,
  discover_opts: {
    unicastBindPort: 1235,
  },
});


app.use(cors())
app.use(compression())
app.use(bodyParser.json())
app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})

app.get('/api', (req, res) => {
  res.send(["test"])
})

wemo.discover(function (device) {
  console.log(`Wemo Device Found: ${device.friendlyName}`);

  var client = wemo.client(device);

  client.on('error', function (err) {
    console.log(`Error: ${err.code}`);
  });

  client.on('binaryState', function (value) {
    console.log(`Light State changed to: ${!!value}`);
  });

  console.log(client)
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})