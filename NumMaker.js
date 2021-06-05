//setType will offer three options:
//0: naked number
//1: number as input to an operator
//2: number as output from an operrator

function MakeNumber(xPos,yPos,setCount,setColor,setType){
	
	//this is a naked number
	this.myType = 0

	this.stageX = xPos
	this.stageY = yPos

	this.globalX = stageToGlobalX(xPos)
	this.globalY = stageToGlobalY(yPos)

	this.upperStemHeight = 200
	this.lowerStemHeight = 200

	//used only for naked numbers, or operator inputs, when they become bound
	this.myDriver

	this.count = setCount

	//Setting number attributes
	//FIX: Are these necessary, or can we just use the setType argument?

	//naked number
	if(setType==0){
		this.inOperator = false
		this.free = true
	//input number
	}else if(setType==1){
		this.inOperator = true
		this.input = true
		this.free = true
	//output number	
	}else if(setType==2){
		this.inOperator = true
		this.input = false
		this.free = false
	}



	this.dragging = false
	//offsets for dragging
	this.offsetX = 0
	this.offsetY = 0


	this.selected = false

	//scrubbing variables
	this.scrubbing = false
	this.numAnchor
	this.touchDown
	this.travelDistance
	this.travelRate = 35 //the bigger the slower


	//boolean for when mouse is over adjustment arrow
	this.overAdjuster = false
	//boolean for when mouse is over draggable region
	this.overBody = false
	//boolean for when mouse is over wirepull
	this.overExtension = false
	//boolean for when mouse is over ANY part of number(for arresting panning)
	this.overOperator = false
	//boolean for whether wire is being pulled
	this.wirePull = false
	//measure of bezier curve aggressiveness
	this.mouseToTipDistance
	this.controlPointRadius


	this.overMe = function(){

		//set to false...
		this.overOperator = false


		if(setType==0||setType==1){
			//mouse is over a free adjuster...
			if(this.free&&mouseX>this.stageX-135*globalScale&&mouseX<this.stageX+135*globalScale&&mouseY>(this.stageY+(this.lowerStemHeight-33)*globalScale)&&mouseY<(this.stageY+(this.lowerStemHeight+33)*globalScale)){
				this.overAdjuster = true
				this.overOperator = true
	  		}else{
	  			this.overAdjuster = false
	  		}
	  	}


	  	if(setType==0||setType==2){
	  		if(mouseX>this.stageX-90*globalScale&&mouseX<this.stageX+90*globalScale&&mouseY>(this.stageY+(-this.upperStemHeight-33)*globalScale)&&mouseY<(this.stageY+(-this.upperStemHeight+33)*globalScale)){
				this.overExtension = true
				this.overOperator = true
	  		}else{
	  			this.overExtension = false
	  		}
	  	}

	  	//Body of number can only be clicked if number is NOT in an operator. This prevents in-operator numbers from getting selected.
	  	if(setType==0){
	  		if(dist(mouseX,mouseY,this.stageX,this.stageY)<90*globalScale){
	      		this.overBody = true
	      		this.overOperator = true
	    	}else{
	    		this.overBody = false
	    	}
	    }

	}

	this.clickMe = function(){
		
		if(this.overAdjuster){
		  	this.scrubbing = true
  			this.numAnchor = this.count
  			this.touchDown = mouseX
  			operatorManipulation = true
  		}

  		if(this.overExtension){
		  	this.wirePull = true
		  	operatorManipulation = true
  		}



  		//Selected operator management funciton:

  		if(this.overBody){
		  //if shift is pressed...
		  if(shiftSelect){
		    //if predicate is selected, unselect.
		    if(this.selected){
		      this.selected = false
		      this.dragging = false
		    //if predicate is unselected, select.
		    }else{
		      this.selected = true
		      this.dragMe()
		    }


		  //if shift is not pressed...
		  }else{
		    //if predicate is selected, prep for dragging
		    if(this.selected){
		      this.dragMe()
		    //if predicate is unselected, clear all all other selections.  
		    }else{
		      this.selected = true
		      this.dragMe()
		      clearSelected = true
		    }
		  }


		//for operators NOT under click
		}else{
			//if this is selected...
			if(this.selected){
				//if pulling selection rectangle or zooming with slider...
				if(selectionRectangle||mySlider.dragging){
				  //stop this operator from dragging...
				  this.arrestDragging()
				}else{
				  this.dragMe()
				}
			}
		}
	}


	//called to activate dragging for all selected predicates...
  	this.dragMe = function(){
		this.dragging = true
		this.offsetX = this.stageX-mouseX
		this.offsetY = this.stageY-mouseY
	}


	this.arrestDragging = function(){
		this.dragging=false
	}

	this.allFalse = function(){
		
		this.dragging = false
		this.scrubbing = false
		this.wirePull = false
  	}

	//opertor decides if it is "selected" based on whether it is inside of selection rectangle...
  	this.unselectedInRectangle = function(){

	    if(mouseX>selectionRectangleX&&mouseY>selectionRectangleY){
			if(this.stageX>selectionRectangleX&&this.stageX<mouseX&&this.stageY>selectionRectangleY&&this.stageY<mouseY){
				this.selected = true
			}else{
				this.selected = false
			}
	    }

	    if(mouseX<selectionRectangleX&&mouseY>selectionRectangleY){
			if(this.stageX<selectionRectangleX&&this.stageX>mouseX&&this.stageY>selectionRectangleY&&this.stageY<mouseY){
				this.selected = true
			}else{
				this.selected = false
			}
	    }

	    if(mouseX>selectionRectangleX&&mouseY<selectionRectangleY){
			if(this.stageX>selectionRectangleX&&this.stageX<mouseX&&this.stageY<selectionRectangleY&&this.stageY>mouseY){
				this.selected = true
			}else{
				this.selected = false
			}
		}

	    if(mouseX<selectionRectangleX&&mouseY<selectionRectangleY){
			if(this.stageX<selectionRectangleX&&this.stageX>mouseX&&this.stageY<selectionRectangleY&&this.stageY>mouseY){
				this.selected = true
			}else{
				this.selected = false
			}
	    }

  	}

	//operator decides if it is "unselected" based on whether it is inside of selection rectangle...
	this.selectedInRectangle = function(){

		if(mouseX>selectionRectangleX&&mouseY>selectionRectangleY){
			if(this.stageX>selectionRectangleX&&this.stageX<mouseX&&this.stageY>selectionRectangleY&&this.stageY<mouseY){
				this.selected = false
			}else{
				this.selected = true
			}
		}

		if(mouseX<selectionRectangleX&&mouseY>selectionRectangleY){
			if(this.stageX<selectionRectangleX&&this.stageX>mouseX&&this.stageY>selectionRectangleY&&this.stageY<mouseY){
				this.selected = false
			}else{
				this.selected = true
			}
		}

		if(mouseX>selectionRectangleX&&mouseY<selectionRectangleY){
			if(this.stageX>selectionRectangleX&&this.stageX<mouseX&&this.stageY<selectionRectangleY&&this.stageY>mouseY){
				this.selected = false
			}else{
				this.selected = true
			}
		}

		if(mouseX<selectionRectangleX&&mouseY<selectionRectangleY){
			if(this.stageX<selectionRectangleX&&this.stageX>mouseX&&this.stageY<selectionRectangleY&&this.stageY>mouseY){
				this.selected = false
			}else{
				this.selected = true
			}
		}

	}





	this.update = function(){

		//cursor change and state change
		if(this.overAdjuster){
			cursor('ew-resize')
		}
			

		if(this.dragging){
	        this.stageX = mouseX + this.offsetX
	        this.stageY = mouseY + this.offsetY
	        this.globalX = stageToGlobalX(this.stageX)
	        this.globalY = stageToGlobalY(this.stageY)
		}


		//update count
		if(this.scrubbing){
			this.travelDistance = mouseX-this.touchDown
			this.count = floor(this.numAnchor + (this.travelDistance/this.travelRate))
			//if(this.count<0){
			//	this.count = 0
			//}
		}
	}

	

	this.display = function(){

	rectMode(CORNER)

	this.stageX = globalToStageX(this.globalX)
    this.stageY = globalToStageY(this.globalY)

    

	//Draw wires...
	if(this.wirePull){

		this.mouseToTipDistance = dist(globalToStageX(this.globalX),globalToStageY(this.globalY-this.upperStemHeight),mouseX,mouseY)
		this.controlPointRadius = map(this.mouseToTipDistance,0,300*globalScale,0,300*globalScale)
		if(this.controlPointRadius>300*globalScale){
			this.controlPointRadius = 300*globalScale
		}

		noFill()
		stroke(0)
		strokeWeight(24*globalScale)
		bezier(globalToStageX(this.globalX),globalToStageY(this.globalY-this.upperStemHeight),globalToStageX(this.globalX),globalToStageY(this.globalY-this.upperStemHeight)-this.controlPointRadius,mouseX,mouseY+this.controlPointRadius,mouseX,mouseY)
		stroke(colorArray[setColor][0],colorArray[setColor][1],colorArray[setColor][2])
		strokeWeight(12*globalScale)
		bezier(globalToStageX(this.globalX),globalToStageY(this.globalY-this.upperStemHeight),globalToStageX(this.globalX),globalToStageY(this.globalY-this.upperStemHeight)-this.controlPointRadius,mouseX,mouseY+this.controlPointRadius,mouseX,mouseY)
	}



	push()

		translate(this.stageX,this.stageY)

		scale(globalScale)

	
		//LOWER STEM and ADJUSTMENT ARROW:
		

		if(!this.inOperator||this.inOperator&&this.input){
			//main stem
			fill(colorArray[setColor][0],colorArray[setColor][1],colorArray[setColor][2])
			stroke(0)
			strokeWeight(6)

			rect(-9,0,18,240)


			//lower controls...
			push()

				translate(0,this.lowerStemHeight)


				//SIDE-TO-SIDE ARROW	

				if(this.free){

					noStroke()
					fill(0)


					beginShape()
						vertex(-135,0)
						vertex(-78,-33)
						vertex(-78,-12)
						vertex(78,-12)
						vertex(78,-33)
						vertex(135,0)
						vertex(78,33)
						vertex(78,12)
						vertex(-78,12)
						vertex(-78,33)
					endShape(CLOSE)
				}

				//Thick circle
				fill(255)
				stroke(0)
				strokeWeight(12)
				ellipse(0,0,90,90)

				//Inner circle
				if(this.overAdjuster){
					fill(colorArray[setColor][0],colorArray[setColor][1],colorArray[setColor][2])
				}else{
					fill(255)
				}
				strokeWeight(6)
				ellipse(0,0,57,57)

			pop()
		}


		//UPPER WIRE PORT:
		//upper stem

		if(!this.inOperator||(this.inOperator&&!this.input)){

			fill(colorArray[setColor][0],colorArray[setColor][1],colorArray[setColor][2])
			stroke(0)
			strokeWeight(6)

			rect(-9,0,18,-192)

			push()

				translate(0,-this.upperStemHeight)


				if(!this.wirePull){
					//UPWARD ARROW	
					noStroke()
					fill(0)

					beginShape()
						vertex(-12,0)
						vertex(-12,-78)
						vertex(-33,-78)
						vertex(0,-135)
						vertex(33,-78)
						vertex(12,-78)
						vertex(12,0)
					endShape(CLOSE)
				}

				//Thick circle
				fill(255)
				stroke(0)
				strokeWeight(12)
				ellipse(0,0,90,90)

				//Inner circle
				if(this.overExtension){
					fill(colorArray[setColor][0],colorArray[setColor][1],colorArray[setColor][2])
				}else{
					fill(255)
				}
				strokeWeight(6)
				ellipse(0,0,57,57)

			pop()
		}

		//main bubble

		if(this.selected){
			fill(255,0,0)
		}else{
			fill(colorArray[setColor][0],colorArray[setColor][1],colorArray[setColor][2])
		}
		ellipse(0,0,180,180)


		//the number itself
		textAlign(CENTER,CENTER)
		if(abs(this.count)<10){
			textSize(130)
		}else if(abs(this.count)<100){
			textSize(100)
		}else if(abs(this.count)<1000){
			textSize(75)
		}else if(abs(this.count)<10000){
			textSize(60)
		}else if(abs(this.count)<100000){
			textSize(50)
		}else if(abs(this.count)<1000000){
			textSize(42)
		}else if(abs(this.count)<10000000){
			textSize(35)
		}else if(abs(this.count)<100000000){
			textSize(30)
		}else if(abs(this.count)<1000000000){
			textSize(25)
		}else if(abs(this.count)<10000000000){
			textSize(20)
		}else{
			textSize(17)
		}

		if((setType==0||setType==1)&&!this.free){
			this.count = this.myDriver.count
		}

		noStroke()
		fill(0)
		text(this.count,0,0)
		fill(255,0,0)
		//text(this.overAdjuster,0,100)	
		

	pop()

	}
}


