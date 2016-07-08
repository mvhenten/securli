"use strict";

import { h, Component } from 'preact';
import Progress from "./util/progress";

var auth = require("../lib/store/auth");
var uploads = require("../lib/store/upload");

var upload = require("../lib/upload");


export default class Upload extends Component {
	componentDidMount() {
		auth.observe(this.setState.bind(this));
		uploads.observe(this.setState.bind(this));
	}

	getFile(evt) {
		upload.readFile(evt.target.files[0]);
	}

	render() {
		if (!this.state.authenticated)
			return <div />;
			
		if(this.state.active)
			return (
				<div class="container">
	   				<Progress progress={this.state.progress} status={this.state.status} active={this.state.active} />	
				 </div>
			);
		
			
		return (
			<div class="container">
				<div class="row" style={{ marginTop: "20px", marginBottom:0}}>
					 <div class="btn-floating btn-large horizontal waves-effect waves-light right">
						<input style={{opacity:0, position: "absolute", height: "100%"}} type="file" id="input" onChange={this.getFile} />
						<i class="material-icons">add</i>
					 </div>
				</div>
			 </div>
		);
	}
}

