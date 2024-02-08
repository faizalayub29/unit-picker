<template>
    <div :style="containerStyle" :class="containerClass">
        <!-- Tools -->
        <map-tools
            ref="tools"
            @tool-move="doMove"
            @tool-zoom="doZoom"
            @tool-reset="doReset">

            <template #info>
                <div class="flex align-items-center gap-1 animation-duration-100 fadein px-2">
                    <kbd
                        v-html="'add'"
                        @click="doAction('Equal')"
                        :class="['px-2 py-1 text-xs font-semibold border-round-md cursor-pointer select-none transition-all transition-duration-100 border-1', {
                            'bg-blue-500 border-blue-300 text-0': (keyboardKey.id == 'add'),
                            'text-gray-800 bg-gray-100 border-gray-200 hover:bg-gray-200': (keyboardKey.id != 'add')
                        }]">
                    </kbd>

                    <kbd
                        v-html="'remove'"
                        @click="doAction('Minus')"
                        :class="['px-2 py-1 text-xs font-semibold border-round-md cursor-pointer select-none transition-all transition-duration-100 border-1', {
                            'bg-blue-500 border-blue-300 text-0': (keyboardKey.id == 'remove'),
                            'text-gray-800 bg-gray-100 border-gray-200 hover:bg-gray-200': (keyboardKey.id != 'remove')
                        }]">
                    </kbd>
                </div>
            </template>
        </map-tools>

        <!-- Editor -->
        <div ref="wrapper" class="flex-1 h-screen w-full overflow-hidden">
            <div
                ref="base"
                :class="['border-round border-2 shadow-3 h-full w-full transition-all transition-duration-100 transition-linear content-map', {
                    'border-orange-400': moveable,
                    'border-300': !moveable,
                }]"
                :style="{
                    transform: `scale(${ scale }) translate(${ offsetX }px, ${ offsetY }px)`
                }">
                <component :is="projectmap"></component>
            </div>
        </div>
    </div>

    <!-- Just Dummy -->
    <div class="overflow-auto w-20rem py-3 surface-700 border-round-xl">
        <ol class="m-0 list-none p-0 gap-2 flex flex-column w-full">
            <li v-for="(data, index) in collection" :key="index" class="text-center text-0 white-space-nowrap">{{ (index + 1) }} - {{ data }}</li>
            <li v-if="collection.length == 0" class="text-400 text-center">For testing purpose <br>Something Will Appear Here</li>
        </ol>
    </div>
</template>

<script>
import * as d3 from 'd3';
import * as helper from '../utils';
import * as KeyCode from 'keycode-js';
import { union, clone, debounce } from 'lodash';
import { DomHandler } from 'primevue/utils';

export default {
    name: 'MapPicker',
    emits: ['update:modelValue', 'change'],
    props: {
        class: null,
        style: null,
        holdKey: false,
        modelValue: {
            type: Array,
            default: []
        }
    },
    data: () => ({
        projectmap: 'HypeResidence',
        instance: null,
        collection: [],
        shapeinvolve: ['rect', 'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'text', 'image'],
        selectionEl: null,
        keybind: null,
        moveable: false,

        scale: 0.95,
        offsetX: 0,
        offsetY: 0,
    }),
    watch: {
        modelValue: {
            deep: true,
            immediate: true,
            handler: function(data){
                //# External -> Internal
                const { base } = this.$refs;
                const coming = clone(data);
                const current = clone(this.collection);
                const finalCollect = union(current, coming);

                this.collection.splice(0, this.collection.length);

                finalCollect.forEach(e => {
                    const parentEl = DomHandler.findSingle(base, `[id="${ e }"]`);

                    if(parentEl){
                        const shapeunit = DomHandler.findSingle(parentEl, this.shapeinvolve.join(','));

                        if(shapeunit){
                            DomHandler.addClass(shapeunit, 'highlighted');
                        }
                    }

                    this.collection.push(e);
                });
            }
        },
        projectmap: {
            immediate: true,
            handler: async function(){
                await this.$nextTick();

                const { base } = this.$refs;
                const svgElement = DomHandler.findSingle(base, 'svg');
                const svgContent = new XMLSerializer().serializeToString(svgElement);

                //# Drawer
                base.innerHTML = helper.svgclean(svgContent);

                //# Clear Model
                this.doResetModel();

                await helper.sleep(600);
                await this.install();
            }
        }
    },
    computed: {
        keyboardKey: function(){
            const key = (this.keybind);
            const output = { id: null, message: '' };

            if(key == KeyCode.CODE_EQUALS){
                output.id = 'add';
                output.key = 'ctrl';
            }

            if(key == KeyCode.CODE_MINUS || key == KeyCode.CODE_DASH){
                output.id = 'remove';
                output.key = 'shift';
            }

            switch(output.id){
                case 'add':
                    output.message = 'Hold + CTRL (adding mode)';
                break;
                case 'remove':
                    output.message = 'Hold + SHIFT (removing mode)';
                break;
            }

            return output;
        },
        activeEvent: function(){
            const keycontrol = (this.keyboardKey.id);

            if(['add', 'remove'].includes(keycontrol)){
                return ['drag', 'click'];
            }

            if(this.moveable){
                return ['drag-position']
            }

            return [];
        },
        containerClass: function(){
            return ['relative surface-100 h-full w-full sdp-canvas-base flex flex-column align-items-center justify-content-center border-1 border-300 border-round', {
                'active-mode': this.keyboardKey.id,
                'content-moveable': this.moveable
            }, this.class];
        },
        containerStyle: function(){
            return [this.style];
        },
    },
    methods: {
        doZoom: function(direction = 1){
            const { base } = this.$refs;
            const { height, width } = base.getBoundingClientRect();

            base.parentNode.style.height = `${ height }px`;
            base.parentNode.style.width = `${ width }px`;

            switch(direction){
                case 1:
                    this.scale += 0.15;
                break;
                case -1:
                    this.scale += -0.1;
                break;
            }
            
            this.scale = Math.min(Math.max(0.2, this.scale), 4);

            base.style.transform = `scale(${this.scale})`;
        },
        doMove: function(e){
            if(e){
                this.keybind = null;
            }

            this.moveable = e;
        },
        doReset: function(){
            const { base } = this.$refs;
            const baseEl = d3.select(base);

            this.scale = 0.98;
            this.offsetX = 0;
            this.offsetY = 0;

            baseEl.style('transform', `scale(${ this.scale }) translate(${ this.offsetX }px, ${ this.offsetY }px)`);
        },
        doAction: function(action){
            const { tools } = this.$refs;

            if(action == this.keybind){
                this.keybind = null;
                return;
            }

            tools.useMove(false);
            this.keybind = action;
        },
        doResetModel: function(){
            this.collection.splice(0, this.collection.length);
            this.updateModel(clone(this.collection));
        },
        install: async function(){
            try{
                const { wrapper, base } = this.$refs;
                const target = DomHandler.findSingle(base, 'svg');
                const svg = d3.select(target);

                svg.call(d3.drag()
                    .subject(function(e){
                        const [x = 0, y = 0] = d3.pointer(e);
                        return { x, y };
                    })
                    .on('start', this.onSelectionStart)
                    .on('drag', this.onSelectionMove)
                    .on('end', this.onSelectionEnd)
                );

                svg.on("click", this.onClick);

                this.instance = svg;
            }catch(e){
                console.error(e);
            }
        },
        onClick: function(e){
            e.preventDefault();

            const self = this;
            const eventPath = (e.path || (e.composedPath && e.composedPath()));
            const parentEl = eventPath.find(c => c.classList && c.classList.contains('unit'));
            const keycontrol = (self.keyboardKey.id);

            if(parentEl){
                const shapeunit = DomHandler.findSingle(parentEl, this.shapeinvolve.join(','));

                if(shapeunit){
                    const selector = (d3.select(shapeunit));

                    switch(keycontrol){
                        case 'add':
                            self.highlighter({ node: selector, checked: true });
                        break;
                        case 'remove':
                            self.highlighter({ node: selector, checked: false });
                        break;
                    }
                }
            }
        },
        onSelectionStart: function(event){
            if(!this.activeEvent.includes('drag')) return;

            const [pointerX = 0, pointerY = 0] = d3.pointer(event, this.instance.node());

            this.selectionEl = this.instance.append('rect')
                .attr('x', pointerX)
                .attr('y', pointerY)
                .attr('width', 0)
                .attr('height', 0)
                .attr('stroke-width', '1')
                .attr('class', 'selector-area');
        },
        onSelectionEnd: function(){
            if(this.selectionEl){
                this.selectionEl.remove();
            }
        },
        onSelectionMove: function(event){
            const { base } = this.$refs;
            const selection = this.selectionEl;

            if(this.activeEvent.includes('drag')){
                const [x = 0, y = 0] = d3.pointer(event, this.instance.node());

                const startX = parseFloat(selection.attr('x'));
                const startY = parseFloat(selection.attr('y'));

                const width = (x - startX);
                const height = (y - startY);

                selection.attr('width', Math.abs(width));
                selection.attr('height', Math.abs(height));

                selection.attr('x', (width < 0 ? x : startX));
                selection.attr('y', (height < 0 ? y : startY));

                const selectionSize = selection.node().getBoundingClientRect();

                if((selectionSize.width * selectionSize.height) > 50){
                    this.emphasizeUnit();
                }
            }

            if(this.activeEvent.includes('drag-position')){
                const baseEl = d3.select(base);
                const [deltaX, deltaY] = [event.dx, event.dy];
                const scale = 0.5;

                this.offsetX += deltaX / scale;
                this.offsetY += deltaY / scale;

                baseEl.style('transform', `scale(${this.scale}) translate(${this.offsetX}px, ${this.offsetY}px)`);
            }
        },
        emphasizeUnit: function(){
            const self = this;
            const selection = this.selectionEl;
            const shapeTocheck = this.shapeinvolve.join(',');
            const selectableElements = this.instance.selectAll('.unit');
            const keycontrol = (this.keyboardKey.id);

            selectableElements.each(function(){
                const parentEl = this;
                const element = d3.select(DomHandler.findSingle(parentEl, shapeTocheck));
                
                if(!selection || !selection.node || !element || !element.node) return;

                const touched = helper.touch(selection.node().getBoundingClientRect(), element.node().getBoundingClientRect());

                if(touched){
                    self.highlighter({
                        node: element,
                        checked: (keycontrol == 'remove' ? false : touched),
                        swip: false
                    });
                }
            });
        },
        highlighter: async function ({ node = null, checked = false, swip = true }){
            const parent = node.select(function(){ return this.closest(".unit") });

            if(parent.size() > 0){
                const id = (parent.attr("id"));
                const currentDataIndex = this.collection.findIndex(c => c == id);

                var performChecked = () => {
                    node.classed('highlighted', true);

                    if(currentDataIndex == -1){
                        this.collection.push(id);
                    }else{
                        if(swip) performUnChecked();
                    }
                };

                var performUnChecked = () => {
                    node.classed('highlighted', false);

                    if(currentDataIndex >= 0) this.collection.splice(currentDataIndex, 1);
                };

                switch(checked){
                    case true:
                        performChecked();
                    break;
                    case false:
                        performUnChecked();
                    break;
                }

                await this.$nextTick();

                this.updateModel(clone(this.collection));
            }
        },
        updateModel: debounce(function(value){
            //# Internal -> External
            this.$emit('update:modelValue', value);
        }, 300)
    },
    setup: function(){
        const params = new URLSearchParams(window.location.search);
        const dummymap = (params.get('map') ?? null);

        if(dummymap){
            return { projectmap: dummymap };
        }
    },
    mounted: function(){
        window.addEventListener('keydown', ({ code }) => {
            this.keybind = code;
        });

        window.addEventListener('keyup', (event) => {
            if(this.holdKey){
                this.keybind = null;
            }
        });
    }
}
</script>