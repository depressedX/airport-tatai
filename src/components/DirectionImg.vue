<template>
    <div class="direction-img" :style="{
        margin:'auto',
        width: '839px',
        height: '514px',
        'background-image':`url(${baseImg})`}">
        <img :src="leaveECount<=10?GE:(ECount<=15?YE:RE)" class="direction-E"/>
        <img :src="leaveWCount<=10?GW:(WCount<=15?YW:RW)" class="direction-W"/>
        <img :src="leaveSCount<=10?GS:(SCount<=15?YS:RS)" class="direction-S"/>
        <img :src="leaveNCount<=10?GN:(NCount<=15?YN:RN)" class="direction-N"/>
    </div>
</template>

<script>
    import baseImg from '../assets/base.png'
    import GE from '../assets/GE.png'
    import GN from '../assets/GN.png'
    import GS from '../assets/GS.png'
    import GW from '../assets/GW.png'
    import RE from '../assets/RE.png'
    import RN from '../assets/RN.png'
    import RS from '../assets/RS.png'
    import RW from '../assets/RW.png'
    import YE from '../assets/YE.png'
    import YN from '../assets/YN.png'
    import YS from '../assets/YS.png'
    import YW from '../assets/YW.png'

    import store from '../store/store'

    let state = store.state,
        getters = store.getters

    export default {
        name: "direction-img",
        data() {
            return {
                baseImg,
                GE, GN, GS, GW,
                RE, RN, RS, RW,
                YE, YN, YS, YW
            }
        },
        mounted() {
        },
        computed: {
            dataType: () => state.dataState.dataType,
            ENTER: () => state.dataState.ENTER,
            LEAVE: () => state.dataState.LEAVE,
            BOTH: () => state.dataState.BOTH,

            leaveECount: () => getters.leavePortE.length,
            leaveNCount: () => getters.leavePortN.length,
            leaveSCount: () => getters.leavePortS.length,
            leaveWCount: () => getters.leavePortW.length,

            enterECount: () => getters.enterPortE.length,
            enterNCount: () => getters.enterPortN.length,
            enterSCount: () => getters.enterPortS.length,
            enterWCount: () => getters.enterPortW.length,

            ECount() {
                if (this.dataType === this.ENTER) {
                    return this.enterECount
                } else if (this.dataType === this.LEAVE) {
                    return this.leaveECount
                } else {
                    return this.enterECount + this.leaveECount
                }
            },
            NCount() {
                if (this.dataType === this.ENTER) {
                    return this.enterNCount
                } else if (this.dataType === this.LEAVE) {
                    return this.leaveNCount
                } else {
                    return this.enterNCount + this.leaveNCount
                }
            },
            SCount() {
                if (this.dataType === this.ENTER) {
                    return this.enterSCount
                } else if (this.dataType === this.LEAVE) {
                    return this.leaveSCount
                } else {
                    return this.enterSCount + this.leaveSCount
                }
            },
            WCount() {
                if (this.dataType === this.ENTER) {
                    return this.enterWCount
                } else if (this.dataType === this.LEAVE) {
                    return this.leaveWCount
                } else {
                    return this.enterWCount + this.leaveWCount
                }
            },
        }
    }
</script>

<style scoped>
    .direction-img {
        position: relative;
    }

    .direction-N {
        position: absolute;
        top: 0;
        left: 44%;
    }

    .direction-S {
        position: absolute;
        bottom: 13%;
        left: 54.5%;
    }

    .direction-W {
        position: absolute;
        bottom: 48.5%;
        left: 21.5%;
    }

    .direction-E {
        position: absolute;
        top: 13%;
        left: 60%;
    }
</style>