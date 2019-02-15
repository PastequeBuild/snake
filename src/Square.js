class Square {

	constructor(x, y, color) {
		this.x = x
		this.y = y
		this.color = color

		const canvas = document.getElementById('canvas')
		const ctx = canvas.getContext('2d')

		ctx.beginPath()
		ctx.fillStyle = this.color
		ctx.rect(this.x*25, this.y*25, 25, 25)
		
		ctx.strokeStyle = 'black'
		ctx.lineWidth = 2
		ctx.strokeRect(this.x*25, this.y*25, 25, 25)
		ctx.fill()
		ctx.closePath()
	}

	erase() {
		const canvas = document.getElementById('canvas')
		const ctx = canvas.getContext('2d')

		ctx.beginPath()
		ctx.fillStyle = '#8ECEDA'
		ctx.rect(this.x*25, this.y*25, 25, 25)
		
		ctx.strokeStyle = '#8ECEDA'
		ctx.lineWidth = 2
		ctx.strokeRect(this.x*25, this.y*25, 25, 25)
		ctx.fill()
		ctx.closePath()		
	}
}

export default Square