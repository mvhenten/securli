import { h, Component } from 'preact';

var files = require("../lib/store/files");
var drive = require("../lib/google/drive");

function debounce(){
	var t;
	
	return function(fn, ms){
		clearTimeout(t);
		t = setTimeout(fn, ms);
	};
}

export default class Search extends Component {
	componentDidMount() {
		this.debounce = debounce();
	}
	
	onKeyUp(evt) {
		this.debounce(() => {
			files.setState({ query: evt.target.value });
			drive.listFiles();
		}, 200);
	}

	render() {
		return (
			<div class="row">
				<div class="input-field col s8">
		          <i class="material-icons prefix">search</i>
	   		      <input onKeyUp={::this.onKeyUp} type="text" style={{marginRight: "1em"}}/>
				</div>
			</div>
		);
	}
}