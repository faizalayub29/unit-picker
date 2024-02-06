<template>
    <div class="w-full flex align-items-center justify-content-end gap-3 py-1 px-2 surface-0 border-round-top">
        <!-- Selection Tools -->
        <span class="flex gap-2 align-items-center">
            <span @click="useReset" class="pi pi-refresh surface-200 flex align-items-center justify-content-center tool-button-size border-round border-1 border-300 text-600 hover:text-blue-500 hover:border-blue-300 cursor-pointer"></span>

            <span
                @click="useMove"
                :class="['pi pi-arrows-alt flex align-items-center justify-content-center tool-button-size border-round border-1 cursor-pointer', {
                    'bg-blue-500 border-blue-300 text-0': (move == true),
                    'surface-200 border-300 text-600 hover:text-blue-500 hover:border-blue-300': (move == false)
                }]">
            </span>
            
            <span @click="useZoom(-1)" class="pi pi-search-minus surface-200 flex align-items-center justify-content-center tool-button-size border-round border-1 border-300 text-600 hover:text-blue-500 hover:border-blue-300 cursor-pointer"></span>
            <span @click="useZoom(1)" class="pi pi-search-plus surface-200 flex align-items-center justify-content-center tool-button-size border-round border-1 border-300 text-600 hover:text-blue-500 hover:border-blue-300 cursor-pointer"></span>
        </span>

        <Divider layout="vertical" class="m-0"></Divider>

        <!-- Project Selection Tools -->
        <span class="flex">
            <select-project @select="useSVG"></select-project>
        </span>
    </div>
</template>

<script>
export default {
    name: 'MapTools',
    emits: [
        'tool-move',
        'select-project',
        'tool-zoom',
        'tool-reset'
    ],
    data: () => ({
        move: false
    }),
    methods: {
        useMove: function(){
            this.move = !this.move;
            this.$emit('tool-move', this.move);
        },
        useSVG: function(url){
            this.$emit('select-project', url);
        },
        useZoom: function(scale = 1){
            this.$emit('tool-zoom', scale);
        },
        useReset: function(){
            this.$emit('tool-reset');
        }
    }
}
</script>