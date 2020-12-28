<template>
  <svg class="bg-dark" viewBox="0 0 295 515" style="max-height: 100%; max-width: 100%; height: 100%; width: 100%" >
    <path v-if="!switches" fill="#ffffff" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
      <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/>
    </path>
    <path v-for="(region, index) in regions" :key="index" :d="region.d" @click="selecting ? event.emit('selection', region) : toggle(region.sw)"
      style="cursor: pointer;"
      :style="{
        fill: ({ 
          0: '#DDDDDD',
          1: '#FFD300',
          2: '#17a2b8',
          'Error': 'FF0000'
        })[region.sw?.state] || '#707070'
      }">
      <title>
        {{region.title}}
      </title>
    </path>
  </svg>
</template>
<script>
import axios from 'axios'
import { EventEmitter, once } from 'events'
export default {
  components: {},
  props: {
    toggle: Function,
    switches: Array
  },
  data(){
    return {
      regions: null,
      selecting: false,
      event: null
    }
  },
  mounted(){
    var vm = this
    vm.event = new EventEmitter()
  },
  methods:{
    getSwitch(sn){
      return this.switches.find(s => s.serialNumber == sn) || null
    },
    async initialize(){ //gets region data from server
      console.log("getting regions...")
      var vm = this
      await axios.get(process.env.VUE_APP_URL+"/api/svg").then((res)=>{
        vm.regions = res.data.map(r=>{
          r.sw = this.getSwitch(r.sn)
          return r
        })
      })
      vm.associateNewSwitches()
    },
    async associateNewSwitches(){ //alerts client to un associated switches, and prompts a selection
      var vm = this
      vm.selecting =true
      for(var sw of vm.switches){
        if(!vm.regions.find(r=>r.sn == sw.serialNumber)){
          alert('Switch "' + sw.name + '" not associated with region. Click OK then select a region')
          vm.event.on('selection', (region)=>{
            region.sw = sw
            region.sn = sw.serialNumber
            axios.post(process.env.VUE_APP_URL+"/api/svg", region,)
          })
          await once(vm.event, 'selection')
          vm.event.removeAllListeners('selection')
        }
      }
      vm.selecting = false
    },
  },
}
</script>