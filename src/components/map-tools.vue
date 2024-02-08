<template>
    <div class="w-full flex align-items-center justify-content-end p-2 surface-0 border-round-top">
        <slot name="info"></slot>
        <!-- Selection Tools -->
        <span class="flex gap-2 align-items-center">
            <kbd @click="useReset" class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border-1 border-gray-200 border-round-md cursor-pointer select-none hover:bg-gray-200 transition-all transition-duration-100">reset</kbd>

            <kbd
                v-html="'position'"
                @click="useMove(!this.move)"
                :class="['px-2 py-1 text-xs font-semibold border-round-md cursor-pointer select-none transition-all transition-duration-100 border-1', {
                    'bg-blue-500 border-blue-300 text-0': (move == true),
                    'text-gray-800 bg-gray-100 border-gray-200 hover:bg-gray-200': (move == false)
                }]">
            </kbd>

            <kbd @click="useZoom(-1)" class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border-1 border-gray-200 border-round-md cursor-pointer select-none hover:bg-gray-200 transition-all transition-duration-100">zoom out</kbd>

            <kbd @click="useZoom(1)" class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border-1 border-gray-200 border-round-md cursor-pointer select-none hover:bg-gray-200 transition-all transition-duration-100">zoom in</kbd>
        </span>
    </div>
</template>

<script>
export default {
    name: 'MapTools',
    emits: [
        'tool-move',
        'tool-zoom',
        'tool-reset'
    ],
    data: () => ({
        move: false
    }),
    methods: {
        useMove: function(flag){
            this.move = flag;
            this.$emit('tool-move', this.move);
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