"use strict";

import {
	h,
	render,
	Component
}
from 'preact';
import './style';

import GoogleLoader from "./component/google/loader";
import GoogleAuthorize from "./component/google/authorize";
import GoogleFiles from "./component/google/files";

var store = require("./lib/store/auth");
var downloadStore = require("./lib/store/download");
var progressStore = require("./lib/store/progress");

var upload = require("./lib/upload");


class Upload extends Component {
	componentDidMount() {
		store.observe(this.setState.bind(this));
	}

	getFile(evt) {
		upload.readFile(evt.target.files[0]);
	}

	render() {
		if (!this.state.authenticated)
			return <div />;

		return (
			<div class="card">
				<div class="card-body">
					Pick a file to upload
					<input type="file" id="input" onChange={this.getFile} />
				</div>
			</div>
		);
	}
}

class DownloadProgress extends Component {
	componentDidMount() {
		progressStore.observe(this.setState.bind(this));
	}

	render() {
		if (!this.state.download)
			return <div>Waiting for download progress</div>;

		if (this.state.download.done)
			return null;

		var style = {
			width: this.state.download.progress + "%"
		};

		return (
			<div class="progress">
				<div class="determinate" style={style}>{this.state}</div>
			</div>
		);
	}

}

class Download extends Component {
	componentDidMount() {
		downloadStore.observe(this.setState.bind(this));
	}

	render() {
		if (!this.state.file)
			return <div>waiting for file</div>;

		return (
			<div class="card">
				<div class="card-body">
					<a href={this.state.file.url} download={this.state.file.name}>download me</a>
				</div>
			</div>
		);
	}
}

class Header extends Component {
	render() {
		return (
			<nav class="light-blue lighten-1" role="navigation">
			<div class="nav-wrapper container"><a id="logo-container" href="#" class="brand-logo">Logo</a>
			<ul class="right hide-on-med-and-down">
			<li><a href="#">Navbar Link</a></li>
			</ul>
			
			<ul id="nav-mobile" class="side-nav">
			<li><a href="#">Navbar Link</a></li>
			</ul>
			<a href="#" data-activates="nav-mobile" class="button-collapse"><i class="material-icons">menu</i></a>
			</div>
			</nav>
		);
	}
}

render((
	<div id="outer">
		<Header />
		<GoogleLoader />
		<GoogleAuthorize />
		<div class="container">
		    <div class="section">
				<Upload />
				<Download />
				<DownloadProgress />
				<GoogleFiles />
		    </div>
		 </div>
		
	</div>
), document.body);
