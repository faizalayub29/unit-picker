<template>
    <div class="flex flex-column p-3 gap-1">
        <map-picker v-model="dataset"></map-picker>
    </div>
    <button @click="addItems">Click Me</button>
</template>

<script>
export default {
    data: () => ({
        dataset: []
    }),
    methods: {
        addItems: function(){
            this.dataset = [
                "HT6T1A(i)/1-14-08",
                "HT6T1A(i)/1-25-05",
                "HT6T1A(i)/1-26-05",
                "HT6T1A(i)/1-24-05",
                "HT6T1A(i)/1-27-16",
                "HT6T1A(i)/1-27-15",
                "HT6T1A(i)/1-26-15",
                "HT6T1A(i)/1-26-13A",
                "HT6T1A(i)/1-27-13A",
                "HT6T1A(i)/1-25-13A",
                "HT6T1A(i)/1-25-13",
                "HT6T1A(i)/1-26-13",
                "HT6T1A(i)/1-27-13",
                "HT6T1A(i)/1-24-13",
                "HT6T1A(i)/1-24-12",
                "HT6T1A(i)/1-25-12",
                "HT6T1A(i)/1-26-12",
                "HT6T1A(i)/1-27-12",
                "HT6T1A(i)/1-23-12",
                "HT6T1A(i)/1-23-11",
                "HT6T1A(i)/1-24-11",
                "HT6T1A(i)/1-25-11",
                "HT6T1A(i)/1-26-11",
                "HT6T1A(i)/1-27-11",
                "HT6T1A(i)/1-22-11",
                "HT6T1A(i)/1-22-10",
                "HT6T1A(i)/1-23-10",
                "HT6T1A(i)/1-24-10",
                "HT6T1A(i)/1-25-10",
                "HT6T1A(i)/1-26-10",
                "HT6T1A(i)/1-27-10",
                "HT6T1A(i)/1-21-10",
                "HT6T1A(i)/1-20-01",
                "HT6T1A(i)/1-21-01",
                "HT6T1A(i)/1-22-01",
                "HT6T1A(i)/1-23-01",
                "HT6T1A(i)/1-24-01",
                "HT6T1A(i)/1-25-01",
                "HT6T1A(i)/1-26-01",
                "HT6T1A(i)/1-27-01",
                "HT6T1A(i)/1-20-02",
                "HT6T1A(i)/1-21-02",
                "HT6T1A(i)/1-22-02",
                "HT6T1A(i)/1-23-02",
                "HT6T1A(i)/1-24-02",
                "HT6T1A(i)/1-25-02",
                "HT6T1A(i)/1-26-02",
                "HT6T1A(i)/1-27-02"
            ];
        }
    }, 
    mounted: function () {

    }
}
</script>

<style lang="scss">
    @import url('./assets/styles/core.scss');
</style>