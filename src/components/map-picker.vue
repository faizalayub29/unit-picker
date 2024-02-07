<template>
    <div :style="containerStyle" :class="containerClass">
        <!-- Action Tools -->
        <map-tools
            @select-project="doSvg"
            @tool-move="((e) => moveable = e)"
            @tool-zoom="doZoom"
            @tool-reset="doReset">
        </map-tools>

        <!-- Map Body -->
        <div ref="wrapper" class="flex-1 h-screen w-full overflow-hidden">
            <div
                ref="base"
                :class="['h-full w-full transition-all transition-duration-100 transition-linear content-map', {
                    'shadow-3 border-1 border-orange-400': moveable
                }]"
                :style="{
                    transform: `scale(${ scale }) translate(${ offsetX }px, ${ offsetY }px)`
                }">
            </div>
        </div>

        <!-- Footer Info -->
        <div
            v-html="(keyboardKey.message ? keyboardKey.message : '')"
            class="text-right w-full text-600 px-3 line-height-3"
            :style="{
                fontSize: '10px',
                height: '16px'
            }">
        </div>
    </div>

    <ol class="flex m-0 list-none p-0 flex-wrap">
        <li v-for="(data, index) in collection" :key="index" class="pr-3">{{ data }}</li>
    </ol>
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
        modelValue: {
            type: Array,
            default: []
        }
    },
    data: () => ({
        instance: null,
        collection: [],
        shapeinvolve: ['rect', 'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'text', 'image'],
        selectionEl: null,
        keybind: null,
        moveable: false,

        scale: 0.98,
        offsetX: 0,
        offsetY: 10,
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
        }
    },
    computed: {
        keyboardKey: function(){
            const key = (this.keybind);
            const output = { id: null, message: '' };

            if(key == KeyCode.CODE_META_LEFT){
                output.id = 'add';
            }

            if(key == KeyCode.CODE_SHIFT_LEFT){
                output.id = 'remove';
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
        doSvg: async function(filepath = null){
            try{
                const { base } = this.$refs;
                const response = await fetch(`../src/assets/svg/${ filepath }`);
                const svgContent = await response.text();
                
                let styleSwiper = svgContent.replace(/<svg[^>]*>/, match => match.replace(/ style="[^"]*"/, '')); //# Remove Style <svg style="">
                    styleSwiper = styleSwiper.replace(/class="([^"]*\bland\b[^"]*)"/g, 'class="unit-selector"'); //# Remove Unit Color

                //# Remove Pins
                const parser = new DOMParser();
                const parsedSVG = parser.parseFromString(styleSwiper, 'image/svg+xml');
                const mapPins = parsedSVG.querySelectorAll('.pin');

                mapPins.forEach(e => e.parentNode.removeChild(e));

                styleSwiper = new XMLSerializer().serializeToString(parsedSVG);

                //# Clear Model
                this.collection.splice(0, this.collection.length);
                this.updateModel(clone(this.collection));

                //# Final
                base.innerHTML = styleSwiper;

                await helper.sleep(600);

                await this.install();

                return styleSwiper;
            }catch(e){
                return e;
            }
        },
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
        doReset: function(){
            const { base } = this.$refs;
            const baseEl = d3.select(base);

            this.scale = 0.98;
            this.offsetX = 0;
            this.offsetY = 0;

            baseEl.style('transform', `scale(${ this.scale }) translate(${ this.offsetX }px, ${ this.offsetY }px)`);
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
    mounted: function(){
        window.addEventListener('keydown', ({ code }) => {
            this.keybind = code;
        });

        window.addEventListener('keyup', (event) => {
            this.keybind = null;
        });
    }
}
</script>