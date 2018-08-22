import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const interact = require("interactjs");

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
		<div className="toolbox" >
			<img className="fBody" id="funcBody" alt="Test draggable" src="./functionBody.png" draggable="true" onDragStart={(event) => {drag(event)}}/>
			<img className="fExp" id="funcExp" alt="Test draggable" src="./expression.png" draggable="true" onDragStart={(event) => {drag(event)}}/>
			<img className="fNExp" id="funcNExp" alt="Test draggable" src="./nameExpression.png" draggable="true" onDragStart={(event) => {drag(event)}}/>
		</div>
        <div className="container" onDragStart = {(event) => {drag(event)}} onDrop={(event) => {drop(event)}} onDragOver={(event) => {allowDrop(event)}}>
		</div>

		
      </div>
    );
  }
}

class Board extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  input: props.value,
		  squares: Array(48).fill(null),
		};
	}
	
	render() {
		return (
			<div>
				<div className="board-row">
				  {this.renderSquare(0)}
				  {this.renderSquare(1)}
				  {this.renderSquare(2)}
				</div>
				<div className="board-row">
				  {this.renderSquare(3)}
				  {this.renderSquare(4)}
				  {this.renderSquare(5)}
				</div>
				<div className="board-row">
				  {this.renderSquare(6)}
				  {this.renderSquare(7)}
				  {this.renderSquare(8)}
				</div>
			</div>
		);
	}
	
	renderSquare(i) {
		return (
		  <Square
			value={this.state.squares[i]}
			onClick={() => this.handleClick(i)}
		  />
		);
	}
}
	
function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
		  {props.value}
		</button>
	);
}



function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
	if(data.includes("Img")) {
		data = document.getElementById(data).parentNode.id;
	}
	if(data.includes("func"))
	{
		var nodeCopy = document.getElementById(data).cloneNode(true);
		var copyID = "drag" + counter;
		nodeCopy.id = copyID;
		if(nodeCopy.hasChildNodes()) nodeCopy.childNodes[1].id = "dragImg" + counter;
		counter++;
		ev.target.appendChild(nodeCopy);
	} else {
		
		ev.target.appendChild(document.getElementById(data));
	}
	var element = document.getElementById(copyID),
		x = 0, y = 0;
	
	interact(element)
	  .draggable({
		snap: {
		  targets: [
			interact.createSnapGrid({ x: 2, y: 2 })
		  ],
		  range: Infinity,
		  relativePoints: [ { x: 0, y: 0 } ]
		},
		inertia: true,
		restrict: {
		  restriction: element.parentNode,
		  elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
		  endOnly: true
		}
	  })
	  .on('dragmove', function (event) {
		x += event.dx;
		y += event.dy;

		event.target.style.webkitTransform =
		event.target.style.transform =
			'translate(' + x + 'px, ' + y + 'px)';
	  })
}

var counter = 0;

export default App;

