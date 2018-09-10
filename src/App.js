import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

const interact = require("interactjs");

const funcBody = 0, 
	funcExp = 1, 
	funcNExp = 2, 
	funcRec = 3,
	funcOp = 4,
	varNames = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	
// const fList = window.context.state.functionList;

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
	render() {
		return (
			<div className="toolbox" >
				<img className="fBody" id="funcBody" alt="Test draggable" src="./functionBody.png" draggable="true" onDragStart={(event) => {drag(event)}}/>
				<img className="rfBody" id="funcRec" alt="Test draggable" src="./recFunctionBody.png" draggable="true" onDragStart={(event) => {drag(event)}}/>
				<img className="opfBody" id="funcOp" alt="Test draggable" src="./opFunctionBody2.png" draggable="true" onDragStart={(event) => {drag(event)}}/>
				<img className="fExp" id="funcExp" alt="Test draggable" src="./expression.png" draggable="true" onDragStart={(event) => {drag(event)}}/>				
			</div>
		);
	}
}

var rightClick;

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
		var Op = "", vT = "";
		if(newType === funcOp) Op = "+", vT = "int";
        const newData = {type: newType, id: newID, x: X, y: Y, needInteract: true, input: {}, input2: {}, output: {}, op: Op, full: false, hasParent: false, name: "", valueType: vT};
		
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
				elem.addEventListener('contextmenu', rightClick = function(event) {
					event.preventDefault();
					var deleteComp = prompt("Remove diagram component? (y/n)");
					switch (deleteComp) {
						case "y":
						case "Y":
							window.context.setState(prevState => ({
								functionList: prevState.functionList.filter(el => el.id != this.id )
							}));
							alert("Component " + this.id + " successfully removed");
							break;
						case "n":
						case "N":
						default:
							alert("Component " + this.id + " was not removed");
							break;
					}
				});
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
							return ( <FuncComp key={func.id} type={func.type} id={func.id} x={func.x} y={func.y} valueType={func.valueType} op={func.op} name={func.name}/>);
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
				case "funcOp":
					elem = document.getElementById("funcOp");
					// console.log(elem.offsetWidth + " " + elem.offsetHeight);
					x = Math.round((x-elem.offsetWidth/2) / 10) * 10;
					y = Math.round((y-elem.offsetHeight/2) / 10) * 10;
					// console.log(x + " " + y);
					this.appendData(funcOp, copyID, x, y);
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
			
			event.target.parentNode.style.webkitTransform =
			event.target.parentNode.style.transform =
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

//Create HTML element for function component
function FuncComp(props) {
	var nameID = "name" + props.id;
	var typeID = "type" + props.id;
	var opID = "op" + props.id;
	switch(props.type) {
		case funcBody:
			return (<div 
						className="compContainer"
						style={{position:"absolute", top:0, left:0, transform: 'translate(' + props.x + 'px, ' + props.y + 'px)'}}>
						<img 
							key={props.id} 
							className="fBody" 
							id={props.id}
							style={{position:"absolute", top:0, left:0}}
							draggable="true" 						
							onDragStart={(event) => {drag(event)}}
							alt="Test draggable" 
							src="./functionBody.png" />
						<div 
							className="txtComp"
							id={nameID}
							style={{position:"absolute", top:0, left:0, transform: 'translate(' + 50 + 'px, ' + 20 + 'px)'}}
							dangerouslySetInnerHTML={{__html: props.name}}></div>
					</div>);
		case funcRec:
			return (<div 
						className="compContainer"
						style={{position:"absolute", top:0, left:0, transform: 'translate(' + props.x + 'px, ' + props.y + 'px)'}}>
						<img 
							key={props.id} 
							className="fBody" 
							id={props.id}
							style={{position:"absolute", top:0, left:0}}
							draggable="true" 						
							onDragStart={(event) => {drag(event)}}
							alt="Test draggable" 
							src="./recFunctionBody.png" />
						<div 
							className="txtComp"
							id={nameID}
							style={{position:"absolute", top:0, left:0, transform: 'translate(' + 50 + 'px, ' + 20 + 'px)'}}
							dangerouslySetInnerHTML={{__html: props.name}}></div>
					</div>);
		case funcOp:
			var testText = "Hallelujah";
			return (<div 
						className="compContainer"
						style={{position:"absolute", top:0, left:0, transform: 'translate(' + props.x + 'px, ' + props.y + 'px)'}}>
						<img 
							key={props.id} 
							className="opfBody" 
							id={props.id}
							style={{position:"absolute", top:0, left:0}}
							draggable="true" 						
							onDragStart={(event) => {drag(event)}}
							alt="Test draggable" 
							src="./opFunctionBody2.png" />
						<div 
							className="txtComp"
							id={nameID}
							style={{position:"absolute", top:0, left:0, transform: 'translate(' + 50 + 'px, ' + 20 + 'px)'}}
							dangerouslySetInnerHTML={{__html: props.name}}></div>
						<div 
							className="txtComp"
							id={opID}
							style={{position:"absolute", top:0, left:0, fontSize:"100%", transform: 'translate(' + 130 + 'px, ' + 90 + 'px)'}}
							dangerouslySetInnerHTML={{__html: "(" + props.op +")"}}></div>
						<div 
							className="txtComp"
							id={typeID}
							style={{position:"absolute", top:0, left:0, transform: 'translate(' + 180 + 'px, ' + 150 + 'px)'}}
							dangerouslySetInnerHTML={{__html: props.valueType}}></div>
					</div>);
		case funcExp:
			return (<div 
						className="compContainer"
						style={{position:"absolute", top:0, left:0, transform: 'translate(' + props.x + 'px, ' + props.y + 'px)'}}>
						<img 
							key={props.id} 
							className="fExp" 
							id={props.id}
							style={{position:"absolute", top:0, left:0}}
							draggable="true" 						
							onDragStart={(event) => {drag(event)}}
							alt="Test draggable" 
							src="./expression.png" />
						<div 
							className="txtComp"
							id={nameID}
							style={{position:"absolute", top:0, left:0, transform: 'translate(' + 3 + 'px, ' + 10 + 'px)'}}
							dangerouslySetInnerHTML={{__html: props.name}}></div>
						<div 
							className="txtComp"
							id={typeID}
							style={{position:"absolute", top:0, left:0, transform: 'translate(' + 15 + 'px, ' + 10 + 'px)'}}
							dangerouslySetInnerHTML={{__html: props.valueType}}></div>
					</div>);
		case funcNExp:
			return (<div 
						className="compContainer"
						style={{position:"absolute", top:0, left:0, transform: 'translate(' + props.x + 'px, ' + props.y + 'px)'}}>
						<img 
							key={props.id} 
							className="fNExp" 
							id={props.id}
							style={{position:"absolute", top:0, left:0}}
							draggable="true" 						
							onDragStart={(event) => {drag(event)}}
							alt="Test draggable" 
							src="./nameExpression.png" />
						<div 
							className="txtComp"
							id={nameID}
							style={{position:"absolute", top:0, left:0, transform: 'translate(' + 3 + 'px, ' + 10 + 'px)'}}
							dangerouslySetInnerHTML={{__html: props.name}}></div>
						<div 
							className="txtComp"
							id={typeID}
							style={{position:"absolute", top:0, left:0, transform: 'translate(' + 44 + 'px, ' + 10 + 'px)', fontSize:"60%"}}
							dangerouslySetInnerHTML={{__html: props.valueType}}></div>
					</div>);
		default:
			break;
	}
	
}

//Code for "Generate Code" button. 
//Updates state of functions in the functionList of the context component, and calls genFunc function
window.onload = function(){
	const generateBtn = document.getElementById("generateButton");
	generateBtn.addEventListener("click", event => {
		var fList = window.context.state.functionList;
		if(fList.length > 0) {
			var fullFunc, index1, index2, index3, index4, elem;
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
							fList[index1].hasParent = true;
							func.input = fList[index1];
							elem = document.getElementById("type" + fList[index1].id);
							// elem.innerHTML = "";
							func.valueType = "";
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
									fList[index2].hasParent = true;
									func.output = fList[index2];
									elem = document.getElementById("type" + fList[index1].id);
									// elem.innerHTML = "";
									func.valueType = "";
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
					case funcOp:
						fullFunc = true;
						index1 = fList.findIndex(func2 => func2.x === (func.x) && func2.y === (func.y) && func2.id !== func.id);
						if(index1>-1) {
							fullFunc = false;
							func.input = {};
							func.output = {};
							break;
						}
						index1 = fList.findIndex(func2 => func2.x === (func.x-40) && func2.y === (func.y+70));
						index2 = fList.findIndex(func2 => func2.x === (func.x+30) && func2.y === (func.y+140));
						//index3 = fList.findIndex(func2 => func2.x === (func.x+70) && func2.y === (func.y+70));
						index4 = fList.findIndex(func2 => func2.x === (func.x-70) && func2.y === (func.y-70));
						if(index1 === (-1)) {
							fullFunc = false;
							func.input = {};
							break;
						} else {
							fList[index1].hasParent = true;
							func.input = fList[index1];
							//console.log("Input = " + fList[index1].id);
						}
						if(index2 === (-1)) {
							fullFunc = false;
							func.input2 = {};
							break;
						} else {
							fList[index2].hasParent = true;
							func.input2 = fList[index2];
						}
						if(index4 > -1) {
							if(fList[index4].type === funcBody || fList[index4].type === funcRec) {
								func.hasParent = true;
							} else func.hasParent = false;
						} else func.hasParent = false;
						break;
					default:
						elem = document.getElementById("type" + func.id);
						index1 = fList.findIndex(func2 => func2.x === (func.x+40) && func2.y === (func.y-70));
						index2 = fList.findIndex(func2 => func2.x === (func.x-30) && func2.y === (func.y-140));
						var checkParent = false;
						if(index1 !== (-1)) {
							checkParent = true;
							break;
						}
						if(index2 !== (-1)) {
							if(fList[index2].type === funcOp) checkParent = true;
							break;
						}
						// elem.innerHTML = "";
						func.valueType = "";
						
						fullFunc = func.full;
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
			window.context.setState({
				functionList: window.context.state.functionList,
			});
			window.codeblock.setState({
				code: newCode,
			});
		}
	});
}

//Generates code which represents full function expressions modeled in the context
function genFunc(funcCode, index, tabCount) {
	var fList = window.context.state.functionList;
	var component = fList[index];
	if(component.type === funcNExp) {
		if(!component.hasParent && component.name.includes("=")) funcCode = funcCode + "let " + component.name + "<br/>"; else funcCode = funcCode + component.name + "<br/>";
		return funcCode;
	}
	var inp, inp2;
	if(!component.full) return "not valid";
	var inputName;
	var inputName2;
	var funcType;
	var hasChild = false;
	var childIsOp = false;
	if(component.input.name === "") {
		inputName = varNames[currentVar];
	} else inputName = component.input.name;
	if(component.type === funcOp) {
		inp = document.getElementById("type" + component.input.id);
		inp2 = document.getElementById("type" + component.input2.id);
		if(component.input2.name === "") {
			inputName2 = varNames[++currentVar];
		} else inputName2 = component.input2.name;
	}	

	if(component.name === "") {
		if(component.type === funcBody) {;
			funcCode = funcCode + "fun " + inputName + " =<br/>";
		} else if(component.type === funcRec) {
			var funcName = varNames[++currentVar];
			funcCode = funcCode + "let rec " + funcName + " " + inputName + " =<br/>";
		} else if(component.type === funcOp) {
			if(component.op === "") return "not valid";
			funcType = document.getElementById("type" + component.id);
			component.input.valueType = component.valueType;
			component.input2.valueType = component.valueType;
			var funcOpName = "(" + component.op + ")";
			funcCode = funcCode + funcOpName + " " + inputName + " " + inputName2 + "<br/>";
		}
	} else {
		if(component.type === funcBody) {
			funcCode = funcCode + "let " + component.name + " " + inputName + " =<br/>";
		} else if(component.type === funcRec) {
			funcCode = funcCode + "let rec " + component.name + " " + inputName + " =<br/>";
		} else if(component.type === funcOp) {
			if(component.op === "") return "not valid";
			funcType = document.getElementById("type" + component.id);
			component.input.valueType = component.valueType;
			component.input2.valueType = component.valueType;
			var funcOpName = "(" + component.op + ")";
			funcCode = funcCode + "let " + component.name + " = " + funcOpName + " " + inputName + " " + inputName2 + "<br/>";
		}
	}
	tabCount++;
	var i;
	var hasTabs = false;
	if(component.type === funcOp) hasTabs = true;
	
	if(!hasTabs) {
		for(i = 0; i < tabCount; i++) {
			funcCode = funcCode + "&emsp;";
		}
		hasTabs = true;
	} else {
		for(i = 0; i < tabCount-1; i++) {
			funcCode = funcCode + "&emsp;";
		}
	}
	
	if(component.output.type === funcBody || component.output.type === funcRec || component.output.type === funcOp) {
		var outputIndex = fList.findIndex(func => func.id === component.output.id);
		currentVar++;
		var temp = genFunc(funcCode, outputIndex, tabCount);
		if(temp === "not valid") {
			return temp;
		}
		funcCode = temp;
		if(component.output.type === funcBody || component.output.type === funcRec) hasTabs = false;
		if(component.output.name !== "") hasChild = true;
		if(component.output.type === funcOp) {
			if(component.input.name !== "" && (component.output.input.name === component.input.name || component.output.input2.name === component.input.name)) childIsOp = true;
			component.input.valueType = component.output.valueType;
		}
	}
	
	if(!hasTabs) {
		for(i = 0; i < tabCount; i++) {
			funcCode = funcCode + "&emsp;";
			hasTabs = true;
		}
	}
	
	if(childIsOp) {
		if(component.output.name === "") funcCode = funcCode + "<br/>"; else funcCode = funcCode + component.output.name + "<br/>";
	} else if(hasChild) {
		if(component.output.type === funcOp && component.output.name !== "") {
			funcCode = funcCode + inputName + "<br/>";
		}else if(component.type === funcBody || component.type === funcRec) funcCode = funcCode + component.output.name + " " + inputName + "<br/>";
	} else {
		if(component.type === funcBody || component.type === funcRec) funcCode = funcCode + inputName + "<br/>";
	}
	currentVar++;
	return funcCode;
}

//prompt user to edit the name of a diagram component
function toggleFuncCode() {
	var fList = window.context.state.functionList;
	var index = fList.findIndex(func2 => func2.id === this.id);
	var elem = fList[index];
	var elemTxt;
	var elemType;
	if(elem.type === funcOp) {
		elemTxt = document.getElementById("op" + this.id);
		elemType = document.getElementById("type" + this.id);
		var newOperator = prompt("Operator:", elem.op);
		if(newOperator === null || newOperator === elem.op) {
			if(newOperator === "") {
				// elemTxt.innerHTML = "(?)";
				elem.op = "";
				elemTxt.style.fontSize = "100%";
				alert("The component operator is unset");
			} else if(newOperator === elem.op){
				alert("The component operator remains unchanged");
			} 
		} else if(newOperator.length > 1 || newOperator.includes(" ")) {
			alert("Invalid operator!\nMust be only one of the following:\n\"+\", \"-\", \"*\", \"\/\"");
		} else {
			switch(newOperator) {
				case "+":
					// elemTxt.innerHTML = "(" + newOperator + ")";
					//elemType.innerHTML = "int";
					elem.op = newOperator;
					elem.valueType = "int";
					elemTxt.style.fontSize = "100%";
					alert("The component operator is " + newOperator);
					break;
				case "-":
					// elemTxt.innerHTML = "(" + newOperator + ")";
					// elemType.innerHTML = "int";
					elem.op = newOperator;
					elem.valueType = "int";
					elemTxt.style.fontSize = "100%";
					alert("The component operator is " + newOperator);
					break;
				case "*":
					// elemTxt.innerHTML = "(" + newOperator + ")";
					// elemType.innerHTML = "decimal";
					elem.op = newOperator;
					elem.valueType = "decimal";
					elemTxt.style.fontSize = "100%";
					alert("The component operator is " + newOperator);
					break;
				case "\/":
					// elemTxt.innerHTML = "(" + newOperator + ")";
					// elemType.innerHTML = "decimal";
					elem.op = newOperator;
					elem.valueType = "decimal";
					elemTxt.style.fontSize = "100%";
					alert("The component operator is " + newOperator);
					break;
				case "":
					// elemTxt.innerHTML = "(?)";
					// elemType.innerHTML = "";
					elem.op = newOperator;
					elem.valueType = "";
					elemTxt.style.fontSize = "100%";
					alert("The component operator is unset");
					break;
				default:
					alert("Invalid operator!\nMust be only one of the following:\n\"+\", \"-\", \"*\", \"\\\"");
			}
		}
	}
	
	elemTxt = document.getElementById("name" + this.id);
	var newName = prompt("Name:", elem.name);
	if(newName === null || newName === elem.name) {
		if(newName === "") {
			// elemTxt.innerHTML = newName;
			elem.name = newName;
			elemTxt.style.fontSize = "100%";
			if(elem.type === funcBody || elem.type === funcRec) {
				alert("The component is now a lambda function");
			} else {
				alert("Component remains unnamed");
			}
		} else if(newName === elem.name){	
			alert("The component name remains: " + elem.name);
		}
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
			if(spaceCount > 3 || onlySpaces) {
				alert("Invalid expression");
			} else {
				if(newName.length < 20) {
					if(elem.type === funcExp) elem.type = funcNExp;
					if(spaceCount > 0 && newName.length >= 2*spaceCount) {
						elem.full = true;
					} else elem.full = false;
					elem.name = newName;
					var nameSplit = newName.split(" ");
					var x;
					newName = nameSplit[0];
					for(x = 1; x < nameSplit.length; x++) newName += "&nbsp" + nameSplit[x];
					// elemTxt.innerHTML = newName;
					elem.name = newName;
					elemTxt.style.fontSize = "100%"
					if(newName.length > 4) elemTxt.style.fontSize = "70%";
					if(newName.length > 6) elemTxt.style.fontSize = "60%";
					alert("The new name is: " + elem.name);
				} else alert("Name too long");
			}
		} else {
			alert("Invalid function name");
		}
	} else {
		if(newName === "") {
			if(elem.type === funcNExp) elem.type = funcExp;
			elem.name = newName;
			// elemTxt.innerHTML = newName;
			elemTxt.style.fontSize = "100%";
			if(elem.type === funcBody || elem.type === funcRec) {
				alert("The component is now a lambda function");
			} else {
				alert("Component is now unnamed");
			}
		} else {
			if(newName.length > 7) {
				alert("Name too long");
			} else {					
				if(elem.type === funcExp) {
					elemTxt.style.fontSize = "80%"
					elem.type = funcNExp;
				} else elemTxt.style.fontSize = "100%"
				elem.name = newName;
				// elemTxt.innerHTML = newName;
				if(newName.length > 6) elemTxt.style.fontSize = "70%";
				alert("The new name is: " + elem.name);
			}
		}
	}
	window.context.forceUpdate();
}

//used to allow dropping draggable elements into drop-zones
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

