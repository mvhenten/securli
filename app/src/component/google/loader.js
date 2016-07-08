"use strict";

import { h, Component } from 'preact';

var keeper = require("../../lib/keeper");

export default class GoogleLoader extends Component {
	
	
	render() {
		return (
			<script onload={keeper.restoreState} src="https://apis.google.com/js/client.js"></script>		
		);
	}
}