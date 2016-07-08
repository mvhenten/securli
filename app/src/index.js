"use strict";

import { h, render, Component } from 'preact';

import './style';

import GoogleLoader from "./component/google/loader";
import GoogleAuthorize from "./component/google/authorize";
import GoogleFiles from "./component/google/files";

import Upload from "./component/upload";
import Download from "./component/download";
import Search from "./component/search";

render((
	<div class="" id="outer">


	  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />


		<GoogleLoader />

	  <nav class="white ">
	  </nav>
	  <div class="navbar">
		  <nav class="teal">
		   	<div class="container">
			    <form class="col s12">
			    	<Search />
			    </form>
		    </div>
		   </nav>
		</div>
 		<Upload />
		<div class="container">
		    <div class="section">
        		<Download />
				<GoogleAuthorize />
				<GoogleFiles />
		    </div>
		 </div>
	</div>
), document.body);
