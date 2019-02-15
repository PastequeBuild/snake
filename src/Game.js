import React from 'react'
import PropTypes from 'prop-types'

import Square from './Square'

import './Game.css'

class Game extends React.Component {

	constructor(props) {
		super()
		this.state = {
			score: 0,
			player: {},
			pickup: null,
		}
		document.addEventListener('keydown', this.onKeyDown)
	}

	componentDidMount() {
		this.setState({
			player: {
				body: [new Square(38, 16, 'green')],
				speed: 15,
				direction: null,
				sense: null,
				movingInterval: null,	
			},
		}, function() {
			this.setState({
				pickup: this.generatePickup(),
			})
		})
	}

	move = () => {
		let body = this.state.player.body
		let { direction, sense } = this.state.player
		let { x, y } = body[0] 

		x = direction === 'horizontal' ? (sense === '+' ? x + 1 : x - 1) : x
		y = direction === 'vertical' ? (sense === '+' ? y + 1 : y - 1) : y

		body.unshift(new Square(x, y, 'green'))
		body.pop().erase()

		this.setState({
			player: {
				body: body,
				speed: this.state.player.speed,
				direction: this.state.player.direction,
				sense: this.state.player.sense,
				movingInterval: this.state.player.movingInterval,				
			}
		}, function() {
			const firstSquare = this.state.player.body[0]
			let { x, y } = firstSquare
			if (x === this.state.pickup.x && y === this.state.pickup.y) {
				this.pickup()
			}
			if (x < 0 || x >= 76 || y < 0 || y >= 32 ) {
				this.quit()
			}
			if (this.playerBodyIncludes(firstSquare, true)) {
				this.quit()
			}
		})
	}

	onKeyDown = (event) => {
		const key = event.key
		if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(key)) {

			const direction = key === 'ArrowUp' || key === 'ArrowDown' ? 'vertical' : 'horizontal'
			const sense = key === 'ArrowUp' || key === 'ArrowLeft' ? '-' : '+'

			if (this.state.player.body.length > 1 && this.state.player.direction === direction) {
				return
			}

			if (this.state.player.movingInterval === null) {
				this.setState({
					player: {
						body: this.state.player.body,
						speed: this.state.player.speed,
						direction: this.state.player.direction,
						sense: this.state.player.sense,
						movingInterval: setInterval(this.move, 1000 / this.state.player.speed)
					}	
				})
			}

			this.setState({
				player: {
					body: this.state.player.body,
					speed: this.state.player.speed,
					direction: direction,
					sense: sense,
					movingInterval: this.state.player.movingInterval,
				}
			})			
		}
	}

	pickup() {
		let i = 0
		const addSquares = setInterval(() => {
			let { body, direction, sense } = this.state.player
			let { x, y } = body[0]
			x = direction === 'horizontal' ? (sense === '+' ? x + 1 : x - 1) : x
			y = direction === 'vertical' ? (sense === '+' ? y + 1 : y - 1) : y

			body.unshift(new Square(x, y, 'green'))
			i++
			if (i > 5) {
				this.setState({
					score: this.state.score + 1,
					player: {
						body: body,
						speed: this.state.player.speed,
						direction: this.state.player.direction,
						sense: this.state.player.sense,
						movingInterval: this.state.player.movingInterval,
					},
					pickup: this.generatePickup(),
				})
				clearInterval(addSquares)
			}
		}, 1000 / this.state.player.speed * 2)
	}

	generatePickup() {
		const pickup = new Square( Math.floor(Math.random() * Math.floor(76)), Math.floor(Math.random() * Math.floor(32)), 'red')		
		if (this.playerBodyIncludes(pickup, false)) {
			return this.generatePickup()
		}
		return pickup
	}

	playerBodyIncludes(square, withoutFirstSquare) {
		let { x, y } = square
		let includes = false 
		this.state.player.body.map( (bodySquare) => {
			if (bodySquare.x === x && bodySquare.y === y && !withoutFirstSquare) {
				includes = true
			}
			withoutFirstSquare = false
			return []
		})
		return includes
	}

	quit = () => {
		document.removeEventListener('keydown', this.onKeyDown)
		clearInterval(this.state.player.movingInterval)
		this.eraseAllSquares()
		window.confirm('You finished with a score of ' + this.state.score)
		if (this.props.loggedAccount !== null) {
			const ref = this.props.getFirebaseRefFunction('users')
			const that = this
			ref.orderByChild('name').equalTo(this.props.loggedAccount.name).on('value', function(snapshot) {
				if (that.state.score > Object.values(snapshot.val())[0].score) {
					that.props.changeScoreFunction(that.state.score)
					const accountRef = that.props.getFirebaseRefFunction('users/' + Object.keys(snapshot.val())[0])
					accountRef.update({
						score: that.state.score,
					})
				}
			}, that.props.togglePageFunction('home'))
		} else {
			this.props.togglePageFunction('home')
		}
	}

	eraseAllSquares() {
		this.state.player.body.map( (bodySquare) => {
			bodySquare.erase()
			return []
		})
		this.state.pickup.erase()
	}

	render() {
		return (
			<div id='gameBackground'>
				<header id='gameHeader'>
					<p id='score'>Score: {this.state.score} </p>
					<button className='homeButton' onClick={this.quit}>Quit</button>
				</header>
				
				<canvas id='canvas' height='800%' width='1900%'></canvas>
			</div>			
		)
	}
}

Game.propTypes = {
	togglePageFunction: PropTypes.func.isRequired,
	getFirebaseRefFunction: PropTypes.func.isRequired,
	loggedAccount: PropTypes.object,
	changeScoreFunction: PropTypes.func.isRequired,
}

export default Game