import { h, Component } from 'preact';

var store = require("../../lib/store/files");
var download = require("../../lib/download");

export default class GoogleFiles extends Component {
	componentDidMount(){
		store.observe(this.setState.bind(this));		
	}
	
	getFile(evt) {
		evt.preventDefault();
		download.getFile(evt.target.id);
	}

	render(){
		console.log('render render');
		if(!this.state.files)
			return <div>authorize to see files</div>;
			
		return (
	          <div class="card darken-1">
	        	<div class="card-content">
				<ul class="collection">
					{this.state.files.map( (file) => {
						return <li class="collection-item"><a id={file.id} onClick={this.getFile} href={file.id}>{file.name}</a></li>;
					})}
				</ul>
	        	</div>
			</div>		
		);
	}
}
