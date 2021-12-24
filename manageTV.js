import axios from 'axios'
export default () => {
  var prevState = 0
  var state = 0
  setInterval(async () => {
    await axios.get('http://10.200.10.128:8001/api/v2/', {timeout: 990 }).then(res => {
      state = ({on: 1, standby: 0})[res.data.device.PowerState]
    }).catch(err => {
      if(err.code == 'ECONNABORTED')
        state = 0
      if(err.code == "ECONNREFUSED")
        state = 1
    })
    if(state != prevState) {
      axios.post('http://10.200.10.35', state ? "down" : "up").catch(err => console.log(err))
      prevState = state
    }
  }, 1000)
}