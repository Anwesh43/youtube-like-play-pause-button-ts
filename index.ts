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
