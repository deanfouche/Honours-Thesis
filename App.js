import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

const interact = require("interactjs");

const funcBody = 0, 
	funcExp = 1, 
	funcNExp = 2, 
	funcRec = 3;

var counter = 0;
var copyID = "";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
		<Toolbox />
		<Context />
      </div>
    );
  }
}

class Toolbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  input: props.value,
		};
	}
	
	render() {
		return (
			<div className="toolbox" >
				<img className="fBody" id="funcBody" alt="Test draggable" src="./functionBody.png" draggable="true" onDragStart={(event) => {drag(event)}}/>
				<img className="fExp" id="funcExp" alt="Test draggable" src="./expression.png" draggable="true" onDragStart={(event) => {drag(event)}}/>
				<img className="fExp" id="funcNExp" alt="Test draggable" src="./nameExpression.png" draggable="true" onDragStart={(event) => {drag(event)}}/>
			</div>
		);
	}
}

class Context extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  input: props.value,
		  functionList: [],
		};
	}
	
	appendData(newType, newID, X, Y) {
		var functionList = this.state.functionList;
		
        const newData = {type: newType, id: newID, x: X, y: Y, needInteract: true};
		
		this.setState({
			functionList: functionList.concat([newData]),
		});
	}
	
	//Make new diagram components interact-able when added to context
	componentDidUpdate() {
		{this.state.functionList.map(func => {
			if(func.needInteract) {
				this.newInteract(func.id);
				func.needInteract = false;
			}
		})}
	}
	
	render() {
		var functionList = this.state.functionList;
		if(functionList.length == 0) {
			return (
				<div>
					<div className="container" id="context" onDragStart = {(event) => {drag(event)}} onDrop={(event) => {this.drop(event)}} onDragOver={(event) => {allowDrop(event)}}>
						
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<div className="container" id="context" onDrop={(event) => {this.drop(event)}} onDragOver={(event) => {allowDrop(event)}} style={{position:"relative"}}>
						{this.state.functionList.map(func => {
							return ( <FuncComp key={func.id} type={func.type} id={func.id} x={func.x} y={func.y}/>);
						})}
					</div>
				</div>
			);
		}
	}
	
	drop(ev) {
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");
		if(data.includes("func"))
		{
			copyID = "drag" + counter;
			counter++;
			var offLeft = document.getElementById("context").offsetLeft;
			var offTop = document.getElementById("context").offsetTop;
			var x = ev.clientX - offLeft;     // Get the horizontal coordinate of mouse
			var y = ev.clientY - offTop;     // Get the vertical coordinate of mouse
			
			// console.log("Left =" + offLeft + ", Top =" + offTop );
			// console.log("X =" + x + ", Y =" + y );
			
			switch (data) {
				case "funcBody":
					var elem = document.getElementById("funcBody");
					x -= elem.offsetWidth/2;
					y -= elem.offsetHeight/2;
					this.appendData(funcBody, copyID, x, y);
					break;
				case "funcExp":
					var elem = document.getElementById("funcExp");
					x -= elem.offsetWidth/2;
					y -= elem.offsetHeight/2;
					this.appendData(funcExp, copyID, x, y);
					break;
				case "funcNExp":
					var elem = document.getElementById("funcNExp");
					x -= elem.offsetWidth/2;
					y -= elem.offsetHeight/2;
					this.appendData(funcNExp, copyID, x, y);
					break;
				default:
					console.log("Invalid drop");
					break;
			}
		}
	}
	
	newInteract(id) {
		// setting initial x & y coordinates to dropped location
		var index = this.state.functionList.findIndex(x => x.id==id);
		var element = document.getElementById(id),
				x = this.state.functionList[index].x, y = this.state.functionList[index].y;
		
		//setting up element as interact-able		
		interact(element)
		  .draggable({
			snap: {
			  targets: [
				interact.createSnapGrid({ x: 1, y: 1 })
			  ],
			  range: Infinity,
			  relativePoints: [ { x: 0, y: 0 } ]
			},
			inertia: false,
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
}


class functionComponent extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
		  type: null,
		  id: null,
		  
		};
	}
	
	render() {
		return (<div></div>)
	}
	
}

// function newInteract(id) {
	// var element = document.getElementById(id),
			// x = 0, y = 0;
		
	// interact(element)
	  // .draggable({
		// snap: {
		  // targets: [
			// interact.createSnapGrid({ x: 1, y: 1 })
		  // ],
		  // range: Infinity,
		  // relativePoints: [ { x: 0, y: 0 } ]
		// },
		// inertia: false,
		// restrict: {
		  // restriction: element.parentNode,
		  // elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
		  // endOnly: true
		// }
	  // })
	  // .on('dragmove', function (event) {
		// x += event.dx;
		// y += event.dy;

		// event.target.style.webkitTransform =
		// event.target.style.transform =
			// 'translate(' + x + 'px, ' + y + 'px)';
	  // })
// }

function FuncComp(props) {
	var tempID = props.id;
	switch(props.type) {
		case funcBody:
			return (<img 
				key={props.id} 
				className="fBody" 
				id={props.id} alt="Test draggable" 
				src="./functionBody.png" 
				draggable="true" 
				style={{position:"absolute", top:0, left:0, transform: 'translate(' + props.x + 'px, ' + props.y + 'px)'}}
				onDragStart={(event) => {drag(event)}}/>);
		case funcExp:
			return (<img 
				key={props.id} 
				className="fExp" 
				id={props.id} 
				alt="Test draggable" 
				src="./expression.png" 
				draggable="true" 
				style={{position:"absolute", top:0, left:0, transform: 'translate(' + props.x + 'px, ' + props.y + 'px)'}}
				onDragStart={(event) => {drag(event)}}/>);
		case funcNExp:
			return (<img 
				key={props.id} 
				className="fNExp" 
				id={props.id} alt="Test draggable" 
				src="./nameExpression.png" 
				draggable="true" 
				style={{position:"absolute", top:0, left:0, transform: 'translate(' + props.x + 'px, ' + props.y + 'px)'}}
				onDragStart={(event) => {drag(event)}}/>);
		default:
			break;
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

//Copy id of object being dragged
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}


export default App;

// function drop(ev) {
    // ev.preventDefault();
    // var data = ev.dataTransfer.getData("text");
	// if(data.includes("Img")) {
		// data = document.getElementById(data).parentNode.id;
	// }
	// if(data.includes("func"))
	// {
		// var nodeCopy = document.getElementById(data).cloneNode(true);
		// var copyID = "drag" + counter;
		// nodeCopy.id = copyID;
		// if(nodeCopy.hasChildNodes()) nodeCopy.childNodes[1].id = "dragImg" + counter;
		// counter++;
		// ev.target.appendChild(nodeCopy);
	// } else {
		
		// ev.target.appendChild(document.getElementById(data));
	// }
	// var element = document.getElementById(copyID),
		// x = 0, y = 0;
	
	// interact(element)
	  // .draggable({
		// snap: {
		  // targets: [
			// interact.createSnapGrid({ x: 2, y: 2 })
		  // ],
		  // range: Infinity,
		  // relativePoints: [ { x: 0, y: 0 } ]
		// },
		// inertia: true,
		// restrict: {
		  // restriction: element.parentNode,
		  // elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
		  // endOnly: true
		// }
	  // })
	  // .on('dragmove', function (event) {
		// x += event.dx;
		// y += event.dy;

		// event.target.style.webkitTransform =
		// event.target.style.transform =
			// 'translate(' + x + 'px, ' + y + 'px)';
	  // })
// }

// class Employee extends React.Component {
   // state = {
      // employeeList: [{name: 'user-1', age: '22', company:'abc', url: "https://avatars.githubusercontent.com/u/k8297" }]
   // }
   // appendData = () => {
        // const newData = {name: 's', age: '21', company:'xyz', url: "https://avatars.githubusercontent.com/u/k8297"}
        // this.setState(prevState => ({employeeList: [...prevState.employeeList, newData]}))
   // }
   // render() {
       // <div>
           // {this.state.employeeList.map(employee => {
                // return (
                    // <Card key={employee.name} name={employee.name} company={employee.company} url={employee.url}/>
                // )
           // })}
           // <button onClick={this.appendData}>Append</button>
       // </div>
   // }
// }

// class Board extends Component {
	// constructor(props) {
		// super(props);
		// this.state = {
		  // input: props.value,
		  // squares: Array(48).fill(null),
		// };
	// }
	
	// render() {
		// return (
			// <div>
				// <div className="board-row">
				  // {this.renderSquare(0)}
				  // {this.renderSquare(1)}
				  // {this.renderSquare(2)}
				// </div>
				// <div className="board-row">
				  // {this.renderSquare(3)}
				  // {this.renderSquare(4)}
				  // {this.renderSquare(5)}
				// </div>
				// <div className="board-row">
				  // {this.renderSquare(6)}
				  // {this.renderSquare(7)}
				  // {this.renderSquare(8)}
				// </div>
			// </div>
		// );
	// }
	
	// renderSquare(i) {
		// return (
		  // <Square
			// value={this.state.squares[i]}
			// onClick={() => this.handleClick(i)}
		  // />
		// );
	// }
// }
