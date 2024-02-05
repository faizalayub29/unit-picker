<template>
    <div class="flex flex-column p-3 gap-1">
        <div class="w-full flex align-items-center justify-content-end gap-3 py-1 px-2 surface-0 border-round">
            <!-- Selection Tools -->
            <span class="flex gap-2 align-items-center">
                <span class="pi pi-arrows-alt surface-200 flex align-items-center justify-content-center tool-button-size border-round border-1 border-300 text-600 hover:text-blue-500 hover:border-blue-300 cursor-pointer"></span>
                <span class="pi pi-search surface-200 flex align-items-center justify-content-center tool-button-size border-round border-1 border-300 text-600 hover:text-blue-500 hover:border-blue-300 cursor-pointer"></span>
            </span>

            <Divider layout="vertical" class="m-0"></Divider>

            <!-- Project Selection Tools -->
            <span class="flex">
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