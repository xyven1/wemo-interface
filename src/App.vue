<template>
  <nav class="navbar fixed-top navbar-dark bg-dark">
    <a class="navbar-brand">Wemo Interface</a>
    <button class="btn btn-info" @click="mapInterface=!mapInterface">Toggle Inteface Type</button>
  </nav>
  <div v-if="!mapInterface" class="bg-dark d-flex flex-column align-items-center justify-content-end justify-content-sm-start pt-2 pb-5" style="height: 100%">
    <div v-if="!switches" class="spinner-border text-light p-2 align-self-center mb-auto">
      <span class="sr-only">Loading...</span>
    </div>
    <div v-for="(sw, index) in switches" :key="index" class="p-1">
      <button @click="toggle(sw)" class="btn btn-lg" :class="{'btn-primary': sw.state==1, 'btn-secondary': sw.state==0, 'btn-info': sw.state==2}">
        {{sw.name}}
      </button>
    </div>
  </div>
  <svg v-if="mapInterface" class="bg-dark" viewBox="0 0 295 515" style="max-height: 100%; max-width: 100%; height: 100%; width: 100%" xmlns="http://www.w3.org/2000/svg">
    <path id="221820K1300DC1"  @click="mapClick" d="M 185.43600463867188 309.0169982910156 L 211.1280059814453 254.75900268554688 L 257.37200927734375 274.85101318359375 L 232.15699768066406 331.2550048828125 Z"
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Dining Room</title>
    </path>
    <path id="221941K13006EB" @click="mapClick" d="M 107.4 102.714 H 139.687 V 169.979 H 107.4 V 102.714 Z" 
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Front Porch</title>
    </path>
    <path id="221941K1300690" @click="mapClick" d="M 146.311 101.672 H 200.83 V 171.743 H 146.311 V 101.672 Z"
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Front Hall</title>
    </path>
    <path id="221820K130105F" @click="mapClick" d="M 184.3260040283203 312.3810119628906 L 230.86399841308594 334.0090026855469 L 202.9290008544922 393.5190124511719 L 156.15899658203125 368.80999755859375 Z" 
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Porch</title>
    </path>
    <path id="22A9B1K0107F37" @click="mapClick" d="M 217.109 4.55 H 286.757 A 0.264 0.264 0 0 1 287.021 4.814 V 82.09 A 0.264 0.264 0 0 1 286.757 82.354 H 217.109 A 0.264 0.264 0 0 1 216.845 82.09 V 4.814 A 0.264 0.264 0 0 1 217.109 4.55 Z" 
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Master Bedroom</title>
    </path>
    <path id="221820K13012CF" @click="mapClick" d="M 153.51699829101562 371.2309875488281 L 95.98899841308594 337.99798583984375 L 79.36900329589844 366.66900634765625 L 137.0850067138672 399.510009765625 Z"
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Mud Room</title>
    </path>
    <path id="" @click="mapClick" d="M 68.91600036621094 364.95001220703125 L 156.06100463867188 414.4200134277344 L 105.7249984741211 500.07501220703125 L 19.71500015258789 445.80499267578125 Z"
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Garage</title>
    </path>
    <path id="" @click="mapClick" d="M 140.82699584960938 359.6510009765625 L 166.30999755859375 313.44000244140625 L 109.98999786376953 283.90301513671875 L 85.91600036621094 328.635009765625 Z"
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Laundry Room</title>
    </path>
    <path id="" @click="mapClick" d="M 178.1580047607422 316.135986328125 L 207.4040069580078 253.68800354003906 L 194.22900390625 187.0189971923828 L 151.01400756835938 187.28700256347656 L 105.16500091552734 277.92999267578125 Z"
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Kitchen</title>
    </path>
    <path id="221820K1300E7B" @click="mapClick" d="M 219.7899932861328 145.6510009765625 L 286.9840087890625 145.91600036621094 L 286.45599365234375 270.81500244140625 L 258.5249938964844 270.5509948730469 L 219.26300048828125 253.16000366210938 Z"
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Living Room</title>
    </path>
    <path id="" @click="mapClick" d="M 144.954 5.205 H 212.411 V 50.791 H 144.954 V 5.205 Z"
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Room 2</title>
    </path>
    <path id="" @click="mapClick" d="M 145.218 55.534 H 201.871 V 97.168 H 145.218 V 55.534 Z"
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Room 1</title>
    </path>
    <path id="" @click="mapClick" d="M 247.984 85.309 H 286.719 V 121.673 H 247.984 V 85.309 Z"
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Master Bathroom</title>
    </path>
    <path id="" @click="mapClick" d="M 216.101 85.045 H 244.033 V 120.882 H 216.101 V 85.045 Z"
      style="fill: rgb(222, 222, 222); cursor: pointer;">
      <title>Hall Bathroom</title>
    </path>
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
      mapInterface: false
    }
  },
  async mounted(){
    var vm = this
    await axios.get("http://10.200.10.195:3000/api").then((res)=>{
      vm.switches = res.data
    })
    vm.$socket.on('stateChange', (data)=>{
      document.getElementById(data.serialNumber).style.fill = ({
        0: '#DEDEDE',
        1: '#FFD300',
        Error: 'FF0000'
      })[data.state]
    })
  },
  methods: {
    async toggle(sw){
      var newState
      await axios.post("http://10.200.10.195:3000/api", {serialNumber: sw.serialNumber}).then((res)=>{
        if(res.data.BinaryState == "Error")
          sw.state = -1
        sw.state = parseInt(res.data.BinaryState)
        newState = res.data.BinaryState
      })
      return newState
    },
    mapClick(e){
      var vm = this
      if(e.target.id != ""){
        vm.toggle(vm.switches.find(s=> s.serialNumber == e.target.id)).then((val)=>{
          e.target.style.fill = ({
            0: '#DEDEDE',
            1: '#FFD300',
            Error: '#FF0000'
          })[val]
        })
      }
    }
  }
}
</script>

<style>
@import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
#app, html, body {
  height:100%;
}
body{
  padding-top: 54px
}

</style>
