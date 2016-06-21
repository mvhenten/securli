"use strict";

import { h, Component } from 'preact';

export default class GoogleLoader extends Component {
	render() {
		return (
			<script src="https://apis.google.com/js/client.js"></script>		
		);
	}
}