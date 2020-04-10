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
        return canvasImage
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

class YTPlayPauseButton {

    div : HTMLDivElement = document.createElement('div')
    img : HTMLImageElement = document.createElement('img')
    pauseImage : CanvasImage
    playImage : CanvasImage
    animator : Animator = new Animator()
    state : State = new State()

    constructor(private w : number, private h : number, elem : HTMLElement) {
        this.initElements(elem)
    }

    initElements(elem : HTMLElement) {
        const divSizeFactor = 20
        const imageSizeFactor = 45
        const divSize = Math.min(this.w, this.h) / divSizeFactor
        const imageSize = Math.min(this.w, this.h) / imageSizeFactor
        this.div.style.position = 'absolute'
        this.div.style.left = `${this.w / 2 - divSize / 2}px`
        this.div.style.top = `${this.h / 2 - divSize / 2}px`
        this.div.style.width = `${divSize}px`
        this.div.style.height = `${divSize}px`
        this.div.style.background = '#E1E1E1'
        this.img.style.position = 'absolute'
        this.img.style.left = `${divSize / 2 - imageSize / 2}px`
        this.img.style.top = `${divSize / 2 - imageSize / 2}px`
        this.img.width = imageSize
        this.img.height = imageSize
        this.pauseImage = PauseImage.create(imageSize, this.img)
        this.playImage = PlayImage.create(imageSize, this.img)
        elem.appendChild(this.div)
        this.div.appendChild(this.img)

    }
    updateParams() {
        const dir : number = this.state.dir
        const sc : number = (1 - dir) / 2 + dir * this.state.scale
        this.div.style.opacity = `${1 - sc}`
        this.div.style.transform = `scaleZ(${sc})`
    }

    start() {
        this.state.startUpdating(() => {
            const canvasImage : CanvasImage = this.state.dir == 1 ? this.playImage : this.pauseImage
            canvasImage.attachTo(this.img)
            this.animator.start(() => {
                this.updateParams()
                this.state.update(() => {
                    this.animator.stop()
                    this.updateParams()
                })
            })
        })
    }
}
