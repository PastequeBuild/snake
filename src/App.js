import React from 'react'
const firebase = require('firebase/app');
require('firebase/database')

import Home from './Home'
import Game from './Game'
import Ranking from './Ranking'
import Contact from './Contact'

import config from './config'

import './App.css'

class App extends React.Component {

	constructor() {
		super()
		this.state = {
			loggedAccount: null,
			page: 'home',
		}
		firebase.initializeApp(config)
	}

	togglePage = (page) => {
		this.setState({
			page: page,
		})
	}

	getFirebaseRef(ref) {
		return firebase.database().ref(ref)
	}

	changeLoggedAccount = (account) => {
		this.setState({
			loggedAccount: account,
		})
	}

	changeScore = (score) => {
		let { loggedAccount } = this.state
		loggedAccount.score = score
		this.setState({
			loggedAccount:  loggedAccount,
		})
	}
	
	render() {
		let { page } = this.state
		page = page[0].toUpperCase() + page.slice(1)
		return(
			<div id='appBackground'>
				{this.state.page !== 'game' &&
					<div>
						<nav>
							<button className='navButton' onClick={() => this.togglePage('home')}>Home</button>
							<button className='navButton' onClick={() => this.togglePage('ranking')}>Ranking</button>
							<button className='navButton' onClick={() => this.togglePage('contact')}>Contact</button>
						</nav>

						<header>
							<h1>SNAKE - {page} </h1>
							{this.state.loggedAccount === null ? 
								<p id='welcome'>Welcome !</p>
								: 
								<div>
									<p id='welcome'>Welcome, {this.state.loggedAccount.name} !</p>
									<p id='welcome'>Your best score is {this.state.loggedAccount.score}.</p>
								</div>
							}
						</header>
					</div>
				}
				{this.state.page === 'game' ?
					<Game
						togglePageFunction={this.togglePage}
						getFirebaseRefFunction={this.getFirebaseRef}
						loggedAccount={this.state.loggedAccount}
						changeScoreFunction={this.changeScore}
					/> : this.state.page === 'home' ?
					<Home 
						togglePageFunction={this.togglePage}
						getFirebaseRefFunction={this.getFirebaseRef}
						loggedAccount={this.state.loggedAccount}
						changeLoggedAccountFunction={this.changeLoggedAccount}
					/> : this.state.page === 'ranking' ?
					<Ranking
						getFirebaseRefFunction={this.getFirebaseRef} 
						loggedAccount={this.state.loggedAccount}
					/> : this.state.page === 'contact' && <Contact />
				}
				{this.state.page !== 'game' &&
					<footer><p>Snake made by PastequeBuild - geg.valentin@gmail.com</p></footer>
				}
			</div>
		)
	}
}

export default App