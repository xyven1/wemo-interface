import express from 'express'
import cors from 'cors'
import compression from 'compression'
import bodyParser from 'body-parser'
import path from 'path'
import http from 'http'
import Wemo from 'wemo-client'
import { Server } from "socket.io";

const app = express()
const port = 3000
const wemo = new Wemo({
  discover_opts: {
    explicitSocketBind: true,
  }
});

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

app.use(cors())
app.use(compression())
app.use(bodyParser.json())
app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})

var devices = {}
app.get('/api', async (req, res) => {
  var list = []
  for (const [sn, d] of Object.entries(devices)) {
    console.log("getting state of", d.device.friendlyName)
    await new Promise((resolve) =>{
      d.getBinaryState((err, state) =>{
        list.push ({
          name: d.device.friendlyName,
          serialNumber: sn,
          state: state
        })
        resolve()
      })
    })
  }
  console.log(list)
  res.send(list)
})

app.post('/api', (req, res) => {
  io.emit('stateChange', {serialNumber: req.body.serialNumber, state: 2})
  let device = devices[req.body.serialNumber]
  device.getBinaryState((err, state) =>{
    console.log("Toggling", device.device.friendlyName, state == 1 ? "Off" : "On")
    device.setBinaryState(state == 1 ? 0 : 1, (err, result)=>{
      res.send(result)
    })
  })
})

wemo.discover(function(err, deviceInfo) {
  console.log('Wemo Device Found: %j', deviceInfo.friendlyName)

  var client = wemo.client(deviceInfo)
  devices[client.device.serialNumber] =  client
 
  client.on('error', function(err) {
    console.log('Error: %s', err.code);
  })

  client.on('binaryState', function(value) {
    io.emit('stateChange', {serialNumber: client.device.serialNumber, state: parseInt(value)})
  })
})

io.on('connect', (socket)=>{
	console.log("Connected new user:", socket.id)
	//client managment
})

server.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})