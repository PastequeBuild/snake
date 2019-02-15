import React from 'react'
import PropTypes from 'prop-types'

import './Ranking.css'

class Ranking extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			ranking: 'loading',
		}
	}

	componentWillMount() {
		const ref = this.props.getFirebaseRefFunction('users')
		ref.on('value', snapshot => {
			const users = Object.values(snapshot.val())
			let ranking = users
			users.map( (userToPlace) => {
				let place = null
				ranking.map( (userToCompare) => {
					if ((userToPlace.score > userToCompare.score || userToPlace.score === userToCompare.score) && place === null) {
						place = ranking.indexOf(userToCompare)
					}
					return []
				})
				ranking.splice(ranking.indexOf(userToPlace), 1)
				if (place == null) {
					ranking.push(userToPlace)
				} else {
					ranking.splice(place, 0, userToPlace)
				}
				return []
			})
			this.setState({
				ranking: ranking,
			})
		})		
	}

	render() {
		const { ranking } = this.state
		return (
			<div id='rankingBackground'>
				{ranking === 'loading' ? 
					<p id='loading'>Loading...</p> :

					<li id='ranking'>
					{ranking.map( (user, id) => {
						return this.props.loggedAccount === null || this.props.loggedAccount.name !== user.name ? 
							<ul key={id}>{ranking.indexOf(user) + 1} - {user.name} : {user.score}</ul>
							: 
							<ul id='loggedAccountrankingPosition' key={id}>{ranking.indexOf(user) + 1} - {user.name} : {user.score}</ul>
					}
							
					)}
					</li>
				}
			</div>
		)
	}
}

Ranking.propTypes = {
	getFirebaseRefFunction: PropTypes.func.isRequired,
	loggedAccount: PropTypes.object,
}
export default Ranking