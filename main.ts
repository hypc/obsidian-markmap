import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'
import { Plugin } from 'obsidian'

export default class MarkmapPlugin extends Plugin {
    async onload () {
        this.registerMarkdownCodeBlockProcessor('markmap', async (source, el) => {
            await this.refreshEl(el)
            await this.render(source, el)
        })
    }

    async render (source: string, el: HTMLElement) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as unknown as SVGElement
        svg.setAttr('style', 'width: 100%; height: 100%; border: 1px solid darkgray;')
        el.appendChild(svg)

        const { root } = new Transformer().transform(source)
        const markmapSVG = Markmap.create(svg, null, root)
        const height = markmapSVG.state.maxY - markmapSVG.state.minY
        svg.style.height = `${height}px`

        await markmapSVG.fit()
    }

    async refreshEl (el: HTMLElement) {
        // Important: prepare enviroment for markmap
        el.querySelector('code.language-markmap')
    }

    onunload () {
    }
}
