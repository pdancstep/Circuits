var myOperators = []
var myWires = []


//an inventory of selected/unselected operators allows selections to toggle on and off while selection rectangle is being adjusted...
var selectedOperators = []
var unselectedOperators = []

//stage coordinates of global coordinates origin...
var currentZeroX = 0
var currentZeroY = 0

var globalScale = 1

//boolean for dragging screen around
var panning = false
var panningOffsetX
var panningOffsetY

//boolean for when scrubbing/wirepull is happening; arrests dragging on other selected operators when wirepulling or scrubbing and individual operator
var operatorManipulation = false


//boolean for slider adjustment
var zooming = false
var zoomRefX
var zoomRefY

//scale of maximum zoom out
var zoomUpperBound = .7
var zoomLowerBound = .05

//x,y coordinates for center of zoom (initailize inside setup())
var zoomCenterX
var zoomCenterY

//x-coords for menu, zoom bar position...
var menuBreak = 850
var zoomBreak = 125


//TEMPORARY:
var numMenuItems = 4

var indicator = 242

var selectionRectangle = false
var selectionRectangleX
var selectionRectangleY

//boolean for selecting multiple predicates...
var shiftSelect = false


var colorArray = [
		[144,29,14],
		[225,47,46],
		[245,161,52],
		[239,247,145],
		[130,171,175],
		[153,203,158],
		[116,119,78],
		[19,91,169],
	]





function setup() {
	createCanvas(1200,800)
	textAlign(CENTER,CENTER)

	//zooming slider
	mySlider = new MakeSlider(75,75,650,.35)
  	//initialize global scale...
  	globalScale = map(mySlider.dragDistance,0,mySlider.dragLimit,zoomUpperBound,zoomLowerBound)

  	myOpMenu = new MakeOpMenu(menuBreak+(width-menuBreak-300)/2,75,300,580)

	zoomCenterX = zoomBreak+(width-zoomBreak-(width-menuBreak))/2
	zoomCenterY = height/2

}

//size of grid square
var gridSpace = 50

function draw() {


	//default to arrow cursor
	cursor(ARROW)

	//manual zooming
	if(zooming){
		currentZeroX = globalScale*zoomRefX+zoomCenterX
		currentZeroY = globalScale*zoomRefY+zoomCenterY
	} 


	if(panning){
		currentZeroX = mouseX + panningOffsetX
		currentZeroY = mouseY + panningOffsetY
	}




	//updates on canvas elements

	for(i=0;i<myOperators.length;i++){
		myOperators[i].overMe()
		myOperators[i].update()
	}


	//graphics...
	drawGrid()

	//drawing canvas elements
	for(i=0;i<myWires.length;i++){
		myWires[i].display()
	}


	for(i=0;i<myOperators.length;i++){
		myOperators[i].overMe()
		myOperators[i].update()
		myOperators[i].display()
	}


	
	//make backdrop for slider
	noStroke()
	fill(62)
	rect(0,0,125,height)

	mySlider.dragSlider()
	mySlider.display()

	myOpMenu.update()
	myOpMenu.display()




	//If we're drawing a selection rectangle on the canvas...
	if(selectionRectangle){

		//draw rectangle
		noStroke()
		fill(150,150)
		rectMode(CORNERS)
		rect(selectionRectangleX,selectionRectangleY,mouseX,mouseY)

		//look through unselected predicates for possible selections...
		for(i=0;i<unselectedOperators.length;i++){
			unselectedOperators[i].unselectedInRectangle()
		}
		//look through selected predicates for possible unselections...
		for(i=0;i<selectedOperators.length;i++){
			selectedOperators[i].selectedInRectangle()
		}
	}

}




function keyPressed(){
	if(keyCode === SHIFT){
		shiftSelect = true
	}



	//Delete operators
	if(keyCode === 8){
		for(i=0;i<myOperators.length;i++){
			if(myOperators[i].selected){

				//delete all existing wires associated with that operator

				//for naked numbers...
				if(myOperators[i].myType==0){
					for(j=0;j<myWires.length;j++){
						if(myWires[j].mySource==myOperators[i]||myWires[j].myTarget==myOperators[i]){
							//free up unlinked operator...
							myWires[j].myTarget.free = true
							//delete link	
							myWires.splice(j,1)
							//step back counter
							j -= 1
						}
					}
				//for all other operators...
				}else{
					for(j=0;j<myWires.length;j++){
						if(myWires[j].mySource==myOperators[i].myOutput||myWires[j].myTarget==myOperators[i].myInput1||myWires[j].myTarget==myOperators[i].myInput2){
							//free up unlinked operator...
							myWires[j].myTarget.free = true
							//delete link	
							myWires.splice(j,1)
							//step back counter
							j -= 1
						}
					}

					



				}

				//delete operator
				myOperators.splice(i,1)
				//step back counter
				i -= 1

			}
		}

		//empty selection arrays so things don't go haywire if "home" key is pressed next
		updateSelectionArrays()

	}
}



function keyReleased(){
	shiftSelect = false
}



//boolean for clearing all other selections except the one being made (in event of single click operator)...
var clearSelected = false
var canvasClick = false
var canvasClickDeselect = false

function touchStarted(){

	//if mouse is over canvas...
	if(mouseX>zoomBreak&&mouseX<menuBreak){

		updateSelectionArrays()

		canvasClick = true
		for(i=0;i<myOperators.length;i++){
			
			if(myOperators[i].overOperator){
				canvasClick = false
			}	


			myOperators[i].clickMe()


			//if clickMe() calls for clearing all other selected predicates...
			if(clearSelected){
				for(j=0;j<myOperators.length;j++){
					if(i!=j){
						myOperators[j].selected = false
						myOperators[j].arrestDragging()
					}
				}
			}
			//turn off call to clear selections...
			clearSelected = false
		}

		//if something is scrubbing, turn off dragging on all selected operators...
		if(operatorManipulation){
			for(i=0;i<myOperators.length;i++){
				if(myOperators[i].selected){
					  myOperators[i].arrestDragging()
				}
			}		
		}
		



		if(canvasClick){
			//open up the possibility of deselecting all predicates...
			canvasClickDeselect = true
			//if shift is down, begin rectangle selection...
			if(shiftSelect){
				//cancel general deselection
				canvasClickDeselect = false

				//initialize rectangle...
				selectionRectangle = true
				selectionRectangleX = mouseX
				selectionRectangleY = mouseY

				//this "click me" serves to arrest the motion of selected operators while rectangle is getting pulled
				for(i=0;i<myOperators.length;i++){
					myOperators[i].clickMe()
				}



			//if shift is NOT down, make canvasclick turn on pan...
			}else{

				panning = true
				panningOffsetX = currentZeroX-mouseX
				panningOffsetY = currentZeroY-mouseY
			}
		}
	}


	//adjust zoom
	mySlider.clickMe()
	if(mySlider.dragging){
		zoomRefX = (currentZeroX - zoomCenterX)/globalScale
      	zoomRefY = (currentZeroY - zoomCenterY)/globalScale
      	zooming = true
	}

	myOpMenu.mySlider.clickMe()
	myOpMenu.clickMe()

}

function touchMoved(){

	//cancel deselect if panning is executed...
	if(panning){
		canvasClickDeselect = false
	}

	//set global scale
	if(mySlider.dragging){
		globalScale = map(mySlider.dragDistance,0,mySlider.dragLimit,zoomUpperBound,zoomLowerBound)
	}
}


function touchEnded(){

	//add wire if we've connected two operators...
	for(i=0;i<myOperators.length;i++){

		if(myOperators[i].wirePull){
			for(j=0;j<myOperators.length;j++){
				if(myOperators[j].overAdjuster){
					//add wire to myWires, referencing the two linked operators.
					myWires.push(new MakeWire(i,j))

				}
			}
		}
	}

	//falsify all attributes, and deselect in case of canvas click...
	for(i=0;i<myOperators.length;i++){
		myOperators[i].allFalse()
		if(canvasClickDeselect){
			myOperators[i].selected = false
		}
	}
	canvasClickDeselect = false
	canvasClick=false

	//top level falsifications...
	mySlider.dragging = false
	panning = false
	zooming = false
	operatorManipulation = false
	myOpMenu.mySlider.dragging = false


	//add operator to canvas if it's been dropped from menu...
	for(i=0;i<myOpMenu.myOpMenuItems.length;i++){
  		//if operator is dropped on canvas, add new operator to canvas
  		if(myOpMenu.myOpMenuItems[i].dragging){
  			if(myOpMenu.myOpMenuItems[i].x>zoomBreak&&myOpMenu.myOpMenuItems[i].x<menuBreak){
  				if(i==0){
  					myOperators.push(new MakeNumber(myOpMenu.myOpMenuItems[i].x,myOpMenu.myOpMenuItems[i].y,0,2,0))
  				}else{
  					myOperators.push(new MakeOperator(myOpMenu.myOpMenuItems[i].x,myOpMenu.myOpMenuItems[i].y,i))
  				}
  			}
  		}

  		myOpMenu.myOpMenuItems[i].dragging = false
		myOpMenu.myOpMenuItems[i].resetToMenu()
	}

	//turn dragging back on for selected operators after releasing selection rectangle
	if(selectionRectangle){
		for(i=0;i<myOperators.length;i++){
			if(myOperators[i].selected){
				myOperators[i].dragging = true
			}
		}
	}

	selectionRectangle = false

	updateSelectionArrays()

}



//takes x coordinate from stage and returns unit-scale global x position
function stageToGlobalX(xCoordIn){
	return (xCoordIn-currentZeroX)/(globalScale)
}
//takes y coordinate from stage and returns unit-scale global y position
function stageToGlobalY(yCoordIn){
	return (yCoordIn-currentZeroY)/(globalScale)
}

//takes x position from unit global position and returns stage x-coordinate
function globalToStageX(xCoordIn){
	return (xCoordIn*globalScale)+currentZeroX
}
//takes y position from unit global position and returns stage y-coordinate
function globalToStageY(yCoordIn){
	return (yCoordIn*globalScale)+currentZeroY
}




//offsets from current (0,0) position to begin drawing grid lines
var gridStartOffsetX
var gridStartOffsetY
//adaptively draw gridpaper on board
function drawGrid() {

	//background(indicator)

	background(255,255,200)

	strokeWeight(5)
	//LIGHT colored lines...
	stroke(193,215,180)


	gridStartOffsetX = floor(-currentZeroX/(gridSpace*globalScale))
	gridStartOffsetY = floor(-currentZeroY/(gridSpace*globalScale))
	
	push()

		translate(currentZeroX,currentZeroY)
		scale(globalScale)

		for(a=0;a<ceil(width/(gridSpace*globalScale))+1;a++){
			line((gridStartOffsetX+a)*gridSpace,-currentZeroY/globalScale,(gridStartOffsetX+a)*gridSpace,(height-currentZeroY)/globalScale)
		}

	    for(a=0;a<ceil(height/(gridSpace*globalScale))+1;a++){
			line(-currentZeroX/globalScale,(gridStartOffsetY+a)*gridSpace,(width-currentZeroX)/globalScale,(gridStartOffsetY+a)*gridSpace)
	    }


	pop()
}




function updateSelectionArrays() {
	//empty arrays
	unselectedOperators.splice(0,unselectedOperators.length)
	selectedOperators.splice(0,selectedOperators.length)
	//then refill arrays
	for(i=0;i<myOperators.length;i++){
		//add unselected predicates to a "unselected" array...
		if(!myOperators[i].selected){
			unselectedOperators.push(myOperators[i])
		//turn off dragging on all currently selected predicates, and add each to "selected" array...
		}else{
			myOperators[i].dragging = false
			selectedOperators.push(myOperators[i])
		}
	}
}













