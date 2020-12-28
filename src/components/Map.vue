<template>
  <svg class="bg-dark" viewBox="0 0 295 515" style="max-height: 100%; max-width: 100%; height: 100%; width: 100%" >
    <path v-if="!switches" fill="#ffffff" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
      <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/>
    </path>
    <g v-else>
      <path v-for="(region, index) in regions" :key="index" :d="region.d" @click="toggle(region.sw)"
        style="cursor: pointer;"
        :style="{
          fill: ({ 
            0: '#DDDDDD',
            1: '#FFD300',
            2: '#17a2b8',
            Error: 'FF0000'
          })[region.sw?.state] || '#707070'
        }">
        <title>
          {{region.title}}
        </title>
      </path>
    </g>
  </svg>
</template>
<script>
export default {
  components: {},
  props: {
    toggle: Function,
    switches: Array
  },
  methods:{
    getSwitch(sn){
      return this.switches.find(s => s.serialNumber == sn)
    }
  },
  computed: {
    regions(){
      console.log("computing regions...")
      return [{
          d: "M 185.43600463867188 309.0169982910156 L 211.1280059814453 254.75900268554688 L 257.37200927734375 274.85101318359375 L 232.15699768066406 331.2550048828125 Z",
          title: "Dining Room",
          sw: this.getSwitch("221820K1300DC1")
        },
        {
          d: "M 107.4 102.714 H 139.687 V 169.979 H 107.4 V 102.714 Z",
          title: "Front Porch",
          sw: this.getSwitch("221941K13006EB")
        },
        {
          d: "M 146.311 101.672 H 200.83 V 171.743 H 146.311 V 101.672 Z",
          title: "Front Hall",
          sw: this.getSwitch("221941K1300690")
        },
        {
          d: "M 184.3260040283203 312.3810119628906 L 230.86399841308594 334.0090026855469 L 202.9290008544922 393.5190124511719 L 156.15899658203125 368.80999755859375 Z",
          title: "Porch",
          sw: this.getSwitch("221820K130105F")
        },
        {
          d: "M 217.109 4.55 H 286.757 A 0.264 0.264 0 0 1 287.021 4.814 V 82.09 A 0.264 0.264 0 0 1 286.757 82.354 H 217.109 A 0.264 0.264 0 0 1 216.845 82.09 V 4.814 A 0.264 0.264 0 0 1 217.109 4.55 Z",
          title: "Master Bedroom",
          sw: this.getSwitch("22A9B1K0107F37")
        },
        {
          d: "M 153.51699829101562 371.2309875488281 L 95.98899841308594 337.99798583984375 L 79.36900329589844 366.66900634765625 L 137.0850067138672 399.510009765625 Z",
          title: "Mud Room",
          sw: this.getSwitch("221820K13012CF")
        },
        {
          d: "M 68.91600036621094 364.95001220703125 L 156.06100463867188 414.4200134277344 L 105.7249984741211 500.07501220703125 L 19.71500015258789 445.80499267578125 Z",
          title: "Garage",
          sw: this.getSwitch("")
        },
        {
          d: "M 140.82699584960938 359.6510009765625 L 166.30999755859375 313.44000244140625 L 109.98999786376953 283.90301513671875 L 85.91600036621094 328.635009765625 Z",
          title: "Laundry Room",
          sw: this.getSwitch("")
        },
        {
          d: "M 178.1580047607422 316.135986328125 L 207.4040069580078 253.68800354003906 L 194.22900390625 187.0189971923828 L 151.01400756835938 187.28700256347656 L 105.16500091552734 277.92999267578125 Z",
          title: "Kitchen",
          sw: this.getSwitch("")
        },
        {
          d: "M 219.7899932861328 145.6510009765625 L 286.9840087890625 145.91600036621094 L 286.45599365234375 270.81500244140625 L 258.5249938964844 270.5509948730469 L 219.26300048828125 253.16000366210938 Z",
          title: "Living Room",
          sw: this.getSwitch("221820K1300E7B")
        },
        {
          d: "M 144.954 5.205 H 212.411 V 50.791 H 144.954 V 5.205 Z",
          title: "Room 2",
          sw: this.getSwitch("")
        },
        {
          d: "M 145.218 55.534 H 201.871 V 97.168 H 145.218 V 55.534 Z",
          title: "Room 1",
          sw: this.getSwitch("")
        },
        {
          d: "M 247.984 85.309 H 286.719 V 121.673 H 247.984 V 85.309 Z",
          title: "Master Bathroom",
          sw: this.getSwitch("")
        },
        {
          d: "M 216.101 85.045 H 244.033 V 120.882 H 216.101 V 85.045 Z",
          title: "Hall Bathroom",
          sw: this.getSwitch("")
        }
      ]
    }
  }
}
</script>