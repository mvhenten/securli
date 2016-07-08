"use strict";

import { h, Component } from 'preact';

export default class Progress extends Component {
	render() {
		if (!this.props.active)
			return <div />;
		
		var style = {
			width: this.props.progress + "%"
		};
		
		console.log(this.props.status, 'status');

		return (
			<div>
				{this.props.status}
				<div class="progress">
					<div class="determinate" style={style}>{this.state}</div>
				</div>
			</div>
		);
	}
}