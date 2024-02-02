<template>
    <div class="flex flex-column p-3 gap-1">
        <div class="w-full flex align-items-center justify-content-end gap-3 py-1 surface-0 px-3 border-1 border-200 border-round">
            <!-- Selection Tools -->
            <!-- <div class="flex justify-content-center align-items-center gap-1">
                <label class="text-xs text-700 line-height-3">Selection Mode:</label>

                <span class="flex gap-2 align-items-center">
                    <span class="pi pi-minus surface-200 flex align-items-center justify-content-center tool-button-size border-round border-1 border-300 text-600 hover:text-blue-500 hover:border-blue-300 cursor-pointer"></span>
                    <span class="pi pi-plus surface-200 flex align-items-center justify-content-center tool-button-size border-round border-1 border-300 text-600 hover:text-blue-500 hover:border-blue-300 cursor-pointer"></span>
                </span>
            </div> -->

            <!-- Project Selection Tools -->
            <span class="border-left-1 border-200 px-3 flex">
                <select-project @select="loadProject"></select-project>
            </span>
        </div>

        <map-picker ref="sitemap" @change="selectionChange"></map-picker>
    </div>
</template>

<script>
export default {
    data: () => ({

    }),
    methods: {
        loadProject: function(url){
            this.$refs.sitemap.loader(url);
        },
        selectionChange: function(e){
            console.log(e);
        }
    }, 
    mounted: function () {
        
    }
}
</script>

<style lang="scss">
    @import url('./assets/styles/core.scss');
</style>