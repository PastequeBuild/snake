import React from 'react'
import PropTypes from 'prop-types'	

import './RegisterForm.css'

const acceptedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'.split('')

class RegisterForm extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			name: '', 
			password: '',
			lastBadCharInName: '',
			nameIsEnoughLong: true,
			passwordIsAccepted: false,
		}
		this.displayForm = this.displayForm.bind(this)
		this.sendForm = this.sendForm.bind(this)
		this.handleNameChange = this.handleNameChange.bind(this)
		this.handlePasswordChange = this.handlePasswordChange.bind(this)
	}

	displayForm() {
		if (!this.props.formIsDisplayed) {
			this.props.toggleFormDisplayingFunction()
		}
	}

	handleNameChange(event) {
		const nameCharacters = event.target.value.split('')
		let lastBadCharInName = ''
		nameCharacters.map( nameChar => {
			if (!acceptedCharacters.includes(nameChar)) {
				lastBadCharInName = nameChar
			}
			return []
		})
		this.setState({
			name: event.target.value,
			lastBadCharInName: lastBadCharInName,
		})
	}

	handlePasswordChange(event) {
		this.setState({
			password: event.target.value,
		})

		if (event.target.value.split('').includes(' ')) {
			this.setState({
				passwordIsAccepted: false,
			})
		} else {
			this.setState({
				passwordIsAccepted: true,
			})
		}
		if (event.target.value === '') {
			this.setState({
				passwordIsAccepted: false,
			})
		}
	}

	sendForm(event) {
		event.preventDefault()
		const { name, password, lastBadCharInName, passwordIsAccepted } = this.state
		if (lastBadCharInName === '' && passwordIsAccepted && name.length >= 3) {
			this.props.registerFunction(name, password)
		} else if (name.length < 3) {
			this.setState({
				nameIsEnoughLong: false,
			})
		}
	}

	render() {
		const { registerType } = this.props
		return(
			<div id={registerType} >
				<button className='homeButton' onClick={this.displayForm}>{registerType === 'signIn' ? 'Sign In' : 'Log In'}</button>

				{this.props.formIsDisplayed && 
					<form id='form' onSubmit={this.sendForm}>
						<label>
							<p>Name:</p>
							<input type='text' onChange={this.handleNameChange} />
						</label>

						{this.state.lastBadCharInName === ' ' &&
							<p className='errorMessage'>The space character is not accepted in the name.</p>}
							
						{this.state.lastBadCharInName !== '' && this.state.lastBadCharInName !== ' ' && 
							<p className='errorMessage'>The character {this.state.lastBadCharInName} is not accepted in the name.</p>	
						}

						<label>
							<p>Password:</p>
							<input type='password' onChange={this.handlePasswordChange} />
						</label>

						{!this.state.passwordIsAccepted && 
							<p className='errorMessage'>You have to enter a password without space.</p>
						}

						<br/>
						<button id='submitButton' type='submit'>Submit</button>

						{!this.state.nameIsEnoughLong &&
							<p className='errorMessage'>This name is too short !</p>
						} 
					</form>
				}
			</div>
		)
	}
}

RegisterForm.propTypes = {
	registerType: PropTypes.oneOf(['signIn', 'logIn']).isRequired,
	registerFunction: PropTypes.func.isRequired,
	toggleFormDisplayingFunction: PropTypes.func.isRequired,
	formIsDisplayed: PropTypes.bool.isRequired,
}

export default RegisterForm 