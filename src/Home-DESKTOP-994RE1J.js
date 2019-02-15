import React from 'react'
import PropTypes from 'prop-types'

import RegisterForm from './RegisterForm'

import './Home.css'

class Home extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			displayedForm: 'logIn'
		}
	}

	isRecognized(name, password, callback) {
		const ref = this.props.getFirebaseRefFunction('users')
		ref.once('value').then(function(snapshot) {
			let isVerified = false
			let account = null
			const users = Object.values(snapshot.val())
			users.map(user => {
				if (user.name.toLowerCase() === name.toLowerCase()) {
					if (user.password === password) {
						isVerified = true
						account = user
						return []
					}
					isVerified = 'onlyName'
				}
				return []
			})
			callback(isVerified, account, ref)
		})
	}

	logIn = (name, password) => {
		this.isRecognized(name, password, function(isRecognized, account, ref) {
			if (isRecognized === true) {
				this.props.changeLoggedAccountFunction(account)
			}
		}.bind(this))
	}

	signIn = (name, password) => {
		const that = this
		this.isRecognized(name, password, function(isRecognized, account, ref) {
			if (isRecognized === false) {
				ref.push().set({
					name: name,
					password: password,
					score: 0,
				}).then( function() {
					that.logIn(name, password) 
				})
			} else {
				console.log('Ce compte existe déjà !')
			}
		})
	}

	disconnect = () => {
		this.props.changeLoggedAccountFunction(null)
	}

	getAllUsers() {
		const ref = this.props.getFirebaseRefFunction('users')
		ref.on('value', snapshot => {
			console.log(snapshot.val())
		})
	}

	toggleFormDisplaying = () => {
		this.setState({
			displayedForm: this.state.displayedForm === 'signIn' ? 'logIn' : 'signIn',
		})
	}
	
	play = () => {
		this.props.togglePlayingStateFunction()
	}

	render() {
		return(
			<div>
				<h1 id='homeTitle'>Snake</h1>
				{(this.props.loggedAccount === null ? (
						<p id='welcome'>Welcome !</p>
					) : (
					<div>
						<p id='welcome'>Welcome, {this.props.loggedAccount.name} !</p>
						<p>Your best score is {this.props.loggedAccount.score}.</p>
						<button id='disconnect' onClick={this.disconnect}>Disconnect</button>
					</div>
				))}

				<section id='registering'>
					<RegisterForm 
						registerType='logIn' 
						registerFunction={this.logIn} 
						toggleFormDisplayingFunction={this.toggleFormDisplaying} 
						formIsDisplayed={this.state.displayedForm === 'logIn' ? true : false} 
					/>
					<RegisterForm 
						registerType='signIn'  
						registerFunction={this.signIn} 
						toggleFormDisplayingFunction={this.toggleFormDisplaying} 
						formIsDisplayed={this.state.displayedForm === 'signIn' ? true : false}
					/>				
				</section>

				{!(this.props.loggedAccount === null) &&
					<div> 
						<button 
							id='play' 
							onClick={this.play}
						>Play !</button>
					</div>
				}
			</div>
		)
	}
}

Home.propTypes = {
	togglePlayingStateFunction: PropTypes.func.isRequired,
	getFirebaseRefFunction: PropTypes.func.isRequired,
	loggedAccount: PropTypes.object,
	changeLoggedAccountFunction: PropTypes.func.isRequired,
}

export default Home