import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
		<div className="toolbox" >
			<div className="funcSym" id="originalFunc" draggable="true" onDragStart={(event) => {drag(event)}}>
				<div className="smallSquare" onDrop={(event) => {drop(event)}} onDragOver={(event) => {allowDrop(event)}}></div>
				<img className="dragObj" id="originalFuncImg" alt="Test draggable" src="./test_img.png" />
				<div className="smallSquare" onDrop={(event) => {drop(event)}} onDragOver={(event) => {allowDrop(event)}}></div>
			</div>
			<img className="dragObj" id="original2" alt="Test draggable" src="./test_img.jpg" draggable="true" onDragStart={(event) => {drag(event)}} />
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
	console.log(data);
	if(data.includes("original"))
	{
		var nodeCopy = document.getElementById(data).cloneNode(true);
		nodeCopy.id = "drag" + counter;
		if(nodeCopy.hasChildNodes()) nodeCopy.childNodes[1].id = "dragImg" + counter;
		counter++;
		ev.target.appendChild(nodeCopy);
	} else {
		
		ev.target.appendChild(document.getElementById(data));
	}
}

var counter = 0;

export default App;
