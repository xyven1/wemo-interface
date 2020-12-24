<template>
  <!-- <div class="bg-dark d-flex flex-column align-items-center justify-content-end justify-content-sm-start pt-2 pb-5" style="height: 100%">
    <div v-if="!switches" class="spinner-border text-light p-2 align-self-center mb-auto">
      <span class="sr-only">Loading...</span>
    </div>
    <div v-for="(sw, index) in switches" :key="index" class="p-1">
      <button @click="toggle(sw)" class="btn btn-lg" :class="{'btn-primary': sw.state==1, 'btn-secondary': sw.state==0, 'btn-info': sw.state==2}">
        {{sw.name}}
      </button>
    </div>
  </div> -->
  <svg viewBox="0 0 295 515" style="max-height: 100%; max-width: 100%" xmlns="http://www.w3.org/2000/svg">
    <polygon v-on:click="svgClick" style="stroke: rgb(0, 0, 0); fill: rgb(222, 222, 222); paint-order: fill; stroke-width: 0px;" points="185.43600463867188 309.0169982910156 211.1280059814453 254.75900268554688 257.37200927734375 274.85101318359375 232.15699768066406 331.2550048828125">
      <title>Dining Room</title>
    </polygon>
    <rect x="107.4" y="102.714" width="32.287" height="67.265" style="fill: rgb(216, 216, 216); stroke-width: 0px;">
      <title>Front Porch</title>
    </rect>
    <rect x="146.311" y="101.672" width="54.519" height="70.071" style="fill: rgb(216, 216, 216); stroke-width: 0px;">
      <title>Front Hall</title>
    </rect>
    <polygon style="stroke: rgb(0, 0, 0); fill: rgb(222, 222, 222); paint-order: fill; stroke-width: 0px;" points="184.3260040283203 312.3810119628906 230.86399841308594 334.0090026855469 202.9290008544922 393.5190124511719 156.15899658203125 368.80999755859375">
      <title>Porch</title>
    </polygon>
    <rect x="216.845" y="4.55" width="70.176" height="77.804" style="fill: rgb(221, 221, 221); stroke: rgb(0, 0, 0); stroke-width: 0px;" rx="0.264" ry="0.264">
      <title>Master Bedroom</title>
    </rect>
    <polygon style="stroke: rgb(0, 0, 0); fill: rgb(222, 222, 222); paint-order: fill; stroke-width: 0px;" points="153.51699829101562 371.2309875488281 95.98899841308594 337.99798583984375 79.36900329589844 366.66900634765625 137.0850067138672 399.510009765625">
      <title>Mud Room</title>
    </polygon>
    <polygon style="paint-order: fill; fill: rgb(221, 221, 221); stroke: rgb(0, 0, 0); stroke-width: 0px;" points="68.91600036621094 364.95001220703125 156.06100463867188 414.4200134277344 105.7249984741211 500.07501220703125 19.71500015258789 445.80499267578125">
      <title>Garage</title>
    </polygon>
    <polygon style="stroke: rgb(0, 0, 0); fill: rgb(222, 222, 222); paint-order: fill; stroke-width: 0px;" points="140.82699584960938 359.6510009765625 166.30999755859375 313.44000244140625 109.98999786376953 283.90301513671875 85.91600036621094 328.635009765625">
      <title>Laundry Room</title>
    </polygon>
    <polygon style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 0px;" points="178.1580047607422 316.135986328125 207.4040069580078 253.68800354003906 194.22900390625 187.0189971923828 151.01400756835938 187.28700256347656 105.16500091552734 277.92999267578125">
      <title>Kitchen</title>
    </polygon>
    <polygon style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 0px;" points="219.7899932861328 145.6510009765625 286.9840087890625 145.91600036621094 286.45599365234375 270.81500244140625 258.5249938964844 270.5509948730469 219.26300048828125 253.16000366210938">
      <title>Living Room</title>
    </polygon>
    <rect x="144.954" y="5.205" width="67.457" height="45.586" style="fill: rgb(216, 216, 216);">
      <title>Room 2</title>
    </rect>
    <rect x="145.218" y="55.534" width="56.653" height="41.634" style="fill: rgb(216, 216, 216);">
      <title>Room 1</title>
    </rect>
    <rect x="247.984" y="85.309" width="38.735" height="36.364" style="fill: rgb(216, 216, 216);">
      <title>Master Bathroom</title>
    </rect>
    <rect x="216.101" y="85.045" width="27.932" height="35.837" style="fill: rgb(216, 216, 216);">
      <title>Hall Bathroom</title>
    </rect>
  </svg>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  components: {
  },
  data(){
    return {
      switches: null,
    }
  },
  async mounted(){
    var vm = this
    await axios.get("http://10.200.10.195:3000/api").then((res)=>{
      vm.switches = res.data
    })
    vm.$socket.on('stateChange', (data)=>{
      vm.switches.find(s=> s.serialNumber == data.serialNumber).state = data.state
    })
  },
  methods: {
    async toggle(sw){
      await axios.post("http://10.200.10.195:3000/api", {serialNumber: sw.serialNumber}).then((res)=>{
        sw.state = parseInt(res.data.BinaryState)
      })
    },
    getInfo(e) {
      e.target.setAttribute("fill", "red")
    },
    svgClick(e){
      e.target.setAttribute("fill", "red")
    }
  }
}
</script>

<style>
@import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
#app, html, body {
  height:100%;
}

</style>
