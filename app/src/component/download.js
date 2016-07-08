"use strict";

import { h, Component } from 'preact';

var downloadStore = require("../lib/store/download");

import Progress from "./util/progress";

export default class Download extends Component {
	componentDidMount() {
		downloadStore.clearState();
		downloadStore.observe(this.setState.bind(this));
	}

	render() {
		if (this.state.active)
			return <Progress progress={this.state.progress} status={this.state.status} active={this.state.active} />;

		if (!this.state.file)
			return <div />;

		return (
			<div>
				<a class="btn" href={this.state.file.url} download={this.state.file.name}>
					<i class="large material-icons left">file_download</i>download {this.state.file.name}</a>
			</div>
		);
	}
}