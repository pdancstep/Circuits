function MakeOpMenu(xPos,yPos,wide,high) {
 	
 	this.x = xPos
 	this.y = yPos

 	this.mySlider = new MakeSlider(this.x+wide,this.y,high,0)

 	this.myOpMenuItems = []

 	this.myOpMenuItemsNames = ["Number","Addition","Multiplication","Subtraction"]

 	this.itemSpacing = 100
 	this.initialOffset = this.itemSpacing/2
 	
 	this.totalHeight = (numMenuItems*this.itemSpacing)-high

 	//OVERRIED with local numMenuItems
 	//this.totalHeight = (this.numMenuItems*this.itemSpacing)-high
 		

 	//present vertical displacement from slider
 	//FIX: Make starting position part of slider definition?
 	this.vertOffset = 0

 	//is scrolling activated for this menu?
 	this.activeScrolling = false

 	//...if stack is taller than window...
	if((this.totalHeight+high)>high){
		this.activeScrolling = true
	}



 	for(i=0;i<numMenuItems;i++){
 		//FIX: Should this definition be agnostic about this.vertOffset?!
 		this.myOpMenuItems.push(new MakeOpMenuItem(this.x+(wide/2)-80,this.y+this.initialOffset+i*this.itemSpacing-this.vertOffset))
  	}


  	this.clickMe = function(){
  		for(i=0;i<this.myOpMenuItems.length;i++){
  			this.myOpMenuItems[i].clickMe(this.vertOffset)
  		}
  	}




 	this.update = function(){

 		//reposition menu items based on slider position...
 		this.vertOffset = map(this.mySlider.dragDistance,0,high-this.mySlider.thumbHeight,0,this.totalHeight)


 		for(i=0;i<this.myOpMenuItems.length;i++){
 			//give vertical offset from slider so item knows its real postion...
 			this.myOpMenuItems[i].overMe(this.vertOffset)
 			this.myOpMenuItems[i].update()
 		}


 		if(this.activeScrolling){
 			this.mySlider.dragSlider()
 		}







 	}




	this.display = function(){


		//draw background for menu
		fill(242)
		rect(menuBreak,0,width,height)


		if(this.activeScrolling){
			this.mySlider.display()
		}


		//OVERRIDE...
		//for(i=0;i<this.numMenuItems;i++){
		for(i=0;i<numMenuItems;i++){
			this.myOpMenuItems[i].display(this.vertOffset)
			fill(0)
			noStroke()
			textSize(20)
			text(this.myOpMenuItemsNames[i],this.myOpMenuItems[i].menuX+125,this.myOpMenuItems[i].menuY-this.vertOffset)

		}

		//draw mask over environment
		noStroke()
		fill(62)

	
		beginShape()

			vertex(850,0)
			vertex(width,0)
			vertex(width,height)
			vertex(850,height)
	
			beginContour()

				vertex(this.x,this.y)
				vertex(this.x,this.y+high)
				vertex(this.x+wide,this.y+high)
				vertex(this.x+wide,this.y)

			endContour()
		
		endShape(CLOSE)



	}


}










