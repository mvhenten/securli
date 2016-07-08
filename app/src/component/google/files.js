import { h, Component } from 'preact';

var files = require("../../lib/store/files");
var download = require("../../lib/download");

var drive = require("../../lib/google/drive");


export default class GoogleFiles extends Component {
	componentDidMount(){
		files.observe(this.setState.bind(this));	
		drive.listFiles();
	}
	
	getFile(evt) {
		evt.preventDefault();
		download.getFile(evt.target.id);
	}

	render(){
		if(!this.state.files)
			return <div>authorize to see files</div>;
			
		return (
	          <div>
				<ul class="collection with-header">
					{this.state.files.map( (file) => {
						return <li class="collection-item"><a id={file.id} onClick={this.getFile} href={file.id}>{file.name}</a></li>;
					})}
				</ul>
			</div>		
		);
	}
}
