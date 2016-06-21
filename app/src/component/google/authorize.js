"use strict";

import { h, Component } from 'preact';

import { authorize } from '../../lib/google/auth';

var store = require("../../lib/store/auth");

export default class GoogleAuthorize extends Component {
	componentDidMount(){
		store.observe(this.setState.bind(this));		
	}

	render() {
		if (this.state.authenticated)
			return null;

		return (
		  <div class="section no-pad-bot" id="index-banner">
		    <div class="container">
		      <div class="row center">
		        <h5 class="header col s12 light">Login using Google Drive to store your files encrypted</h5>
		      </div>
		      <div class="row center">
				<button class="btn-large waves-effect waves-light orang" onClick={authorize}>authorize</button>
		      </div>
		    </div>
		  </div>
		);
	}
}
