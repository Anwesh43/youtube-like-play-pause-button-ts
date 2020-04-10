class DimensionController {
    w : number = window.innerWidth
    h : number = window.innerHeight

    enableResize() {
        window.onresize = () => {
            this.w = window.innerWidth
            this.h = window.innerHeight
        }
    }
}

const dimensionController = new DimensionController()
dimensionController.enableResize()

const scGap : number = 0.02
const delay : number = 30

class CanvasImage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    constructor(protected size : number) {

    }

    draw() {

    }

    attachTo(img : HTMLImageElement) {
        img.src = this.canvas.toDataURL()
    }

    static create(size : number, img : HTMLImageElement) {
        const canvasImage = new CanvasImage(size)
        canvasImage.draw()
        canvasImage.attachTo(img)
    }
}

class PauseImage extends CanvasImage {

    draw() {
        const barW : number = this.size / 20
        this.context.fillStyle = 'white'
        for (var i = 0; i < 2; i++) {
            this.context.save()
            this.context.translate((this.size - barW) * i, 0)
            this.context.fillRect(0, 0, barW, this.size)
            this.context.restore()
        }
    }
}

class PlayImage extends CanvasImage {

    draw() {
        const context : CanvasRenderingContext2D = this.context
        const size : number = this.size
        context.fillStyle = 'white'
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(0, size)
        context.lineTo(size, size / 2)
        context.lineTo(0, 0)
        context.fill()
    }
}

class State {

    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += scGap * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {

    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
