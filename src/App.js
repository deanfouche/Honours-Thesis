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
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
		<Board />
      </div>
    );
  }
}

class Board extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  input: props.value,
		  squares: Array(9).fill(null),
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


export default App;
