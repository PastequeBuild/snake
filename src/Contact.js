import React from 'react'

import './Contact.css'

class Contact extends React.Component {

	render() {
		return (
			<div id='contactBackground'>
				<h2>About the developer</h2>
				<p className='presentation'>I'm PastequeBuild, (Valentin IRL), beginner in JS frontend and specialized in React. I used Firebase to store the snake's data (a free database created recently by Google for the small developers like me :D).
				I have a lot of projects ideas, but I can also join a team who need a developer: I can build a small infrastructure like this website with React and Firebase, but I can also adapt me and learn !</p>
				<h2>Where can you see me</h2>
				<ul>
					<li><span className='boldSpan'>Mail:</span> <span className='italicSpan'>geg.valentin@gmail.com</span></li>
					<li><span className='boldSpan'>Discord:</span> <span className='italicSpan'>PastequeBuild#4086</span></li>
					<li><span className='boldSpan'>Instagram (drawing):</span> <span className='italicSpan'>gegoux_creations</span></li>
				</ul>
			</div>
		)
	}
}

export default Contact