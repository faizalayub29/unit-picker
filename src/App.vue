<template>
    <div class="flex flex-column p-3 gap-1">
        <div class="w-full flex align-items-center justify-content-end gap-3 py-1 px-2 surface-0 border-round">
            <!-- Selection Tools -->
            <span class="flex gap-2 align-items-center">
                <span
                    @click="(movecontent = !movecontent)"
                    :class="['pi pi-arrows-alt flex align-items-center justify-content-center tool-button-size border-round border-1 cursor-pointer', {
                        'bg-blue-500 border-blue-300 text-0': (movecontent == true),
                        'surface-200 border-300 text-600 hover:text-blue-500 hover:border-blue-300': (movecontent == false)
                    }]">
                </span>

                <span @click="scaling('minus')" class="pi pi-search-minus surface-200 flex align-items-center justify-content-center tool-button-size border-round border-1 border-300 text-600 hover:text-blue-500 hover:border-blue-300 cursor-pointer"></span>
                <span @click="scaling('plus')" class="pi pi-search-plus surface-200 flex align-items-center justify-content-center tool-button-size border-round border-1 border-300 text-600 hover:text-blue-500 hover:border-blue-300 cursor-pointer"></span>
            </span>

            <Divider layout="vertical" class="m-0"></Divider>

            <!-- Project Selection Tools -->
            <span class="flex">
                <select-project @select="loadProject"></select-project>
            </span>
        </div>

        <map-picker
            ref="sitemap"
            :moveable="movecontent"
            :class="[{
                'content-moveable': movecontent
            }]">
        </map-picker>
    </div>
</template>

<script>
export default {
    data: () => ({
        movecontent: false
    }),
    methods: {
        loadProject: function(url){
            this.$refs.sitemap.doSvg(url);
        },
        scaling: function(direction = 'plus'){
            this.$refs.sitemap.doScale(direction);
        },
        selectionChange: function(e){
            console.log(e);
        },
    }, 
    mounted: function () {
        
    }
}
</script>

<style lang="scss">
    @import url('./assets/styles/core.scss');
</style>