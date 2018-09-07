import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

const interact = require("interactjs");

const funcBody = 0, 
	funcExp = 1, 
	funcNExp = 2, 
	funcRec = 3,
	varNames = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

var counter = 0;
var currentVar = 0;
var copyID = "";
var toggleFuncCode;

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Visual Functional Programming</h1>
		  <button id="generateButton">Generate Code</button>
        </header>
		<Toolbox />
		<Context ref={(context) => {window.context = context}}/>
		<Codeblock ref={(codeblock) => {window.codeblock = codeblock}}/>
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
				<img className="rfBody" id="funcRec" alt="Test draggable" src="./recFunctionBody.png" draggable="true" onDragStart={(event) => {drag(event)}}/>
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
		  functionList: [],
		};
	}
	
	//Add new diagram component to context state
	appendData(newType, newID, X, Y) {
		var functionList = this.state.functionList;
		
        const newData = {type: newType, id: newID, x: X, y: Y, needInteract: true, input: {}, output: {}, full: false, hasParent: false, name: ""};
		
		this.setState({
			functionList: functionList.concat([newData]),
		});
	}
	
	//Make new diagram components interact-able when added to context
	componentDidUpdate() {
		{this.state.functionList.map(func => {
			if(func.needInteract) {
				this.newInteract(func.id);
				var elem = document.getElementById(func.id);
				elem.addEventListener('dblclick', toggleFuncCode);
				func.needInteract = false;
			}
		})}
	}
	
	//Render context and diagram components
	render() {
		var functionList = this.state.functionList;
		if(functionList.length === 0) {
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
	
	//Handle diagram components dropped in context from toolbox
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
			var elem;
			switch (data) {
				case "funcBody":
					elem = document.getElementById("funcBody");
					// console.log(elem.offsetWidth + " " + elem.offsetHeight);
					x = Math.round((x-elem.offsetWidth/2) / 10) * 10;
					y = Math.round((y-elem.offsetHeight/2) / 10) * 10;
					// console.log(x + " " + y);
					// x -= elem.offsetWidth/2;
					// y -= elem.offsetHeight/2;
					this.appendData(funcBody, copyID, x, y);
					break;
				case "funcRec":
					elem = document.getElementById("funcRec");
					// console.log(elem.offsetWidth + " " + elem.offsetHeight);
					x = Math.round((x-elem.offsetWidth/2) / 10) * 10;
					y = Math.round((y-elem.offsetHeight/2) / 10) * 10;
					// console.log(x + " " + y);
					this.appendData(funcRec, copyID, x, y);
					break;
				case "funcExp":
					elem = document.getElementById("funcExp");
					x = Math.round((x-elem.offsetWidth/2) / 10) * 10;
					y = Math.round((y-elem.offsetHeight/2) / 10) * 10;
					this.appendData(funcExp, copyID, x, y);
					break;
				case "funcNExp":
					elem = document.getElementById("funcNExp");
					x = Math.round((x-elem.offsetWidth/2) / 10) * 10;
					y = Math.round((y-elem.offsetHeight/2) / 10) * 10;
					this.appendData(funcNExp, copyID, x, y);
					break;
				default:
					console.log("Invalid drop");
					break;
			}
		}
	}
	
	//Set up draggable diagram component
	newInteract(id) {
		// setting initial x & y coordinates to dropped location
		var index = this.state.functionList.findIndex(x => x.id===id);
		var element = document.getElementById(id),
				x = this.state.functionList[index].x, y = this.state.functionList[index].y;
		
		//setting up element as interact-able		
		interact(element)
		  .draggable({
			snap: {
			  targets: [
				interact.createSnapGrid({ x: 10, y: 10 }),
				function (x, y) {
				  return { x: x,
						   y: (75 + 50 * Math.sin(x * 0.04)),
						   range: 40 };
				}
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
			
			var fList = window.context.state.functionList;
			var tempInd = fList.findIndex(x => x.id === event.target.id);
			fList[tempInd].x = x;
			fList[tempInd].y = y;
			
			event.target.style.webkitTransform =
			event.target.style.transform =
				'translate(' + x + 'px, ' + y + 'px)';
		  })
	}
}

class Codeblock extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  functionList: [],
		  code: "",
		};
	}
	
	render() {
		return (
			<div>
				<div className="txtArea" id="code" dangerouslySetInnerHTML={{__html: this.state.code}}>
					
				</div>
			</div>
		);
	}
}

// {this.state.functionList.map(func => {
	// return ( <FuncComp key={func.id} type={func.type} id={func.id} x={func.x} y={func.y}/>);
// })}

//Create HTML element for function component
function FuncComp(props) {
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
		case funcRec:
			return (<img 
				key={props.id} 
				className="fBody" 
				id={props.id} alt="Test draggable" 
				src="./recFunctionBody.png" 
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

window.onload = function(){
	const generateBtn = document.getElementById("generateButton");
	generateBtn.addEventListener("click", event => {
		var fList = window.context.state.functionList;
		if(fList.length > 0) {
			var fullFunc, index1, index2, index3, index4;
			{fList.map(func => {
				switch (func.type) {
					case funcBody:
					case funcRec:
						//console.log(func.id);
						fullFunc = true;
						index1 = fList.findIndex(func2 => func2.x === (func.x) && func2.y === (func.y) && func2.id !== func.id);
						if(index1>-1) {
							fullFunc = false;
							func.input = {};
							func.output = {};
							break;
						}
						index1 = fList.findIndex(func2 => func2.x === (func.x-40) && func2.y === (func.y+70));
						index2 = fList.findIndex(func2 => func2.x === (func.x+100) && func2.y === (func.y+70));
						index3 = fList.findIndex(func2 => func2.x === (func.x+70) && func2.y === (func.y+70));
						index4 = fList.findIndex(func2 => func2.x === (func.x-70) && func2.y === (func.y-70));
						if(index1 === (-1)) {
							fullFunc = false;
							func.input = {};
							break;
						} else {
							func.input = fList[index1];
							//console.log("Input = " + fList[index1].id);
						}
						if(index2 === (-1) && index3 === (-1)) {
							fullFunc = false;
							func.output = {};
							break;
						} else {
							if(index2 > -1 && index3 > -1) {
								fullFunc = false;
								func.output = {};
								break;
							} else {
								if(index2 > -1) {
									func.output = fList[index2];
									//console.log("Normal output = " + fList[index2].id);
								}
								if(index3 > -1) {
									func.output = fList[index3];
									//console.log("Function output = " + fList[index3].id);
								}
							}
						}
						if(index4 > -1) {
							if(fList[index4].type === funcBody || fList[index4].type === funcRec) {
								func.hasParent = true;
							} else func.hasParent = false;
						} else func.hasParent = false;
						break;
					default:
						fullFunc = false;
						break;
				}
				func.full = fullFunc;
				fullFunc = true;
				
			})}
			var newCode = "";
			var count = 0; 
			currentVar = 0;
			{fList.map(func => {
				if(func.full && !func.hasParent) {
					var temp = genFunc(newCode, count, 0);
					if(temp !== "not valid") {
						newCode = temp;
					}
					newCode += "<br/>"
				}
				count++;
			})}
			window.codeblock.setState({
				code: newCode,
			});
		}
	});
}

function genFunc(funcCode, index, tabCount) {
	//var funcCode = "";
	var fList = window.context.state.functionList;
	var component = fList[index];
	if(!component.full) return "not valid";
	var inputName;
	if(component.input.name === "") {
		inputName = varNames[currentVar];
	} else inputName = component.input.name;
	
	if(component.name === "") {
		if(component.type === funcBody) {;
			funcCode = funcCode + "fun " + inputName + " =<br/>";
		} else if(component.type === funcRec) {
			var funcName = varNames[++currentVar];
			funcCode = funcCode + "let rec " + funcName + " " + inputName + " =<br/>";
		}
		
	} else {
		if(component.type === funcBody) {
			funcCode = funcCode + "let " + component.name + " " + inputName + " =<br/>";
		} else if(component.type === funcRec) {
			funcCode = funcCode + "let rec " + component.name + " " + inputName + " =<br/>";
		}
	}
	tabCount++;
	var i;
	var hasTabs = false;
	for(i = 0; i < tabCount; i++) {
		funcCode = funcCode + "&emsp;";
		hasTabs = true;
	}
	if(component.output.type === funcBody || component.output.type === funcRec) {
		var outputIndex = fList.findIndex(func => func.id === component.output.id);
		currentVar++;
		var temp = genFunc(funcCode, outputIndex, tabCount);
		if(temp === "not valid") {
			return temp;
		}
		funcCode = temp;
		hasTabs = false;
	}
	if(!hasTabs) {
		for(i = 0; i < tabCount; i++) {
			funcCode = funcCode + "&emsp;";
			hasTabs = true;
		}
	}
	funcCode = funcCode + inputName + "<br/>";
	currentVar++;
	return funcCode;
}

var popupWindow=null;

function toggleFuncCode() {
	//alert("You double-clicked element " + this.id);
	var fList = window.context.state.functionList;
	var index = fList.findIndex(func2 => func2.id === this.id);
	var elem = fList[index];
    var newName = prompt("Name:", elem.name);
	if(newName === null || newName === elem.name) {
			alert("The component name remains: " + elem.name);
	} else if(newName.includes(" ")) {
		if(elem.type === funcExp || elem.type === funcNExp) {
			var spaceCount = 0;
			var onlySpaces = true;
			var i;
			for (i = 0; i < newName.length; i++) {
				if(newName.charAt(i) === ' ') {
					spaceCount++;
				} else {
					onlySpaces = false;
				}
			}
			if(spaceCount > 1 || onlySpaces) {
				alert("Invalid expression");
			} else {
				elem.name = newName;
				alert("The new name is: " + elem.name);
			}
		} else {
			alert("Invalid function name");
		}
	} else {
		if(newName === "") {
			elem.name = newName;
			if(elem.type === funcBody || elem.type === funcRec) {
				alert("The component is now a lambda function");
			} else {
				alert("Component is now unnamed");
			}
		} else {
			elem.name = newName;
			alert("The new name is: " + elem.name);
		}
	}
}

function allowDrop(ev) {
    ev.preventDefault();
}

//Copy id of object being dragged
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}


export default App;

// class functionComponent extends Component {
	
	// constructor(props) {
		// super(props);
		// this.state = {
		  // type: null,
		  // id: null,
		  
		// };
	// }
	
	// render() {
		// return (<div></div>)
	// }
	
// }

// function Square(props) {
	// return (
		// <button className="square" onClick={props.onClick}>
		  // {props.value}
		// </button>
	// );
// }

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

