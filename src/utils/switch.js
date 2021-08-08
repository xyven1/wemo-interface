import axios from 'axios'
/**
 * Toggles a switch, updates switches array accordingly
 * @param {string} sw - The serial number of the switch to toggle
 */
async function toggle(sw){
  await axios.post(process.env.VUE_APP_URL+'/api/switch/'+sw.serialNumber).then((res)=>{
    if(res.data.BinaryState == 'Error')
      sw.state = 'Error'
    else
      sw.state = parseInt(res.data.BinaryState)
    return 'Finished'
  })
}

export { toggle }