import express from 'express'
import cors from 'cors'
import compression from 'compression'
import path from 'path'
import http from 'http'
import bodyParser from 'body-parser'
import fs from 'fs'
import Wemo from 'wemo-client'
import { Server } from "socket.io"
import debounce from "debounce"
import axios from 'axios'

const app = express()
const server = http.createServer(app)
var devices = {}

//configs
const wemo = new Wemo({
  discover_opts: {
    explicitSocketBind: true,
  }
});
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

//middleware
app.use(cors())
app.use(compression())
app.use(bodyParser.json())
app.use(express.static('dist'))

//serves static files in dist
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})

//returns list of switches
app.get('/api', async (req, res) => {
  console.log('Getting state of switches')
  await Promise.all(Object.entries(devices).map(([sn,d]) => {
    return Promise.race([
      new Promise((resolve) =>{
        d.getBinaryState((err, state) =>{
          resolve({
            name: d.device.friendlyName,
            serialNumber: sn,
            state: state
          })
        })
      }),
      new Promise(res=> setTimeout(res, 2000))
    ])
  })).then((values)=>res.send(values.filter(v=>v!=null)))
})

//allows client to toggle switches using serial number
app.post('/api', (req, res) => {
  console.log(req.body)
  io.emit('stateChange', {serialNumber: req.body.serialNumber, state: 2})
  let device = devices[req.body.serialNumber]
  device.getBinaryState((err, state) =>{
    console.log("Toggling", device.device.friendlyName, state == 1 ? "Off" : "On")
    device.setBinaryState(state == 1 ? 0 : 1, (err, result)=>{
      res.send(result)
    })
  })
})

//returns parsed array containing data for svg, containing associations between map regions and serial number of switch
app.get('/api/svg', (req, res) => {
  fs.readFile('./svg.json', (err,data)=>{
    res.send(JSON.parse(data))
  })
})

//allows client to change serial number associated to a region
app.post('/api/svg', (req, res) => {
  fs.readFile('./svg.json', (err,data)=>{
    var parsed = JSON.parse(data)
    parsed.flatMap(r=>r.regions).find(r=>r.d == req.body.d).sn = req.body.sn
    fs.writeFile('./svg.json', JSON.stringify(parsed,null, 2), (err)=>{if(err) console.log(err); res.send("file edited")})
  })
})

//sync devices loaded onto server with devices stored on file
const sync = debounce(()=>{
  fs.readFile('./devices.json', (err,data)=>{
    var parsed = JSON.parse(data)
    for (const [, client] of Object.entries(devices)) {
      let sw = parsed.find(sw=>sw.serialNumber==client.device.serialNumber)
      let device = {name: client.device.friendlyName, serialNumber: client.device.serialNumber, ip: client.device.host, port: client.device.port}
      if(sw) sw = device
      else parsed.push(device)
    }
    fs.writeFile('./devices.json', JSON.stringify(parsed,null, 2), (err)=>{if(err) console.log(err)})
  })
}, 1000)

//client managment
function manageClient(deviceInfo){
  var client = wemo.client(deviceInfo)
  devices[client.device.serialNumber] = client

  client.on('error', err => {
    console.log('Error: %s', err.code)
  })

  client.on('binaryState', value =>{
    io.emit('stateChange', {serialNumber: client.device.serialNumber, state: parseInt(value)})
  })
}

//discovers wemo devices connected to network
function discover() {
  console.log("searching...")
  wemo.discover((err, deviceInfo) => {
    if(err) 
      return console.log("Error in discovery:", err)
    console.log('Wemo Device Found: %j', deviceInfo.friendlyName)
    manageClient(deviceInfo)
    sync()
  })
}

//loads devices from devices.json
function loadDevices(){
  fs.readFile('./devices.json', (err,data)=>{
    var parsed = JSON.parse(data)
    parsed.forEach(sw => {
      wemo.load(`http://${sw.ip}:${sw.port}/setup.xml`, (err, deviceInfo)=>{
        if(err) 
          return console.log("Failed to Load:", err)
        console.log('Loaded Device: %j', deviceInfo.friendlyName)
        manageClient(deviceInfo)
      })  
    })
  })
}

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  socket.on('disconnect', (reason) => {
    console.log('disconnecting:', socket.id, "because: ", reason)
  });
});

//load all stored devices
loadDevices()

//initilize server
server.listen(process.env.SERVER_PORT, () => {
  console.log(`app listening at http://localhost:${process.env.SERVER_PORT}`)
})

//repeated discover run every 10 seconds
setInterval(discover, 10000)
setInterval(()=>{ //maganage duck heat
  var d = devices['221814K0102A85']
  axios.get('http://10.200.10.13').then((res)=>{
    if(res.data.sensor>80) d.setBinaryState(0)
    if(res.data.sensor<75) d.setBinaryState(1)
    io.emit('duckTemp', res.data)
  }).catch(()=>{})
}, 1e3)
