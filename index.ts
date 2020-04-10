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
