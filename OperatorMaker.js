function MakeOperator(xPos,yPos,setType) {

/*
setType numbers:

1 :: Adder
2 :: Multiplier
3 :: Subtractor

*/



  //this is an adder...
  this.myType = setType

  this.stageX = xPos
  this.stageY = yPos

  this.globalX = stageToGlobalX(xPos)
  this.globalY = stageToGlobalY(yPos)


  this.myInput1 = new MakeNumber(this.stageX-210*globalScale,this.stageY+210*globalScale,3,5,1)
  this.myInput2 = new MakeNumber(this.stageX+210*globalScale,this.stageY+210*globalScale,2,7,1)
  this.myOutput = new MakeNumber(this.stageX,this.stageY-210*globalScale,1,4,2)




  this.dragging = false
  //offsets for dragging
  this.offsetX = 0
  this.offsetY = 0

  //catchall boolean for any kind of operator manipulationg (drag, wirepull, scrub); used to arrest panning
  this.overOperator = false
  //boolean for whether this item is selected
  this.selected = false
  //boolean for when mouse is over draggable region
  this.overBody

  //booleans get promoted if one of the input/output numbers is being pulled/scrubbed
  this.wirePull
  this.overAdjuster


  this.overMe = function() {
    this.overOperator = false
    if(mouseX>this.stageX-(720/2)*globalScale&&mouseX<this.stageX+(720/2)*globalScale&&mouseY>this.stageY-(630/2)*globalScale&&mouseY<this.stageY+(630/2)*globalScale){
      this.overBody = true
      this.overOperator = true
    }else{
      this.overBody = false
    }

    this.myInput1.overMe()
    this.myInput2.overMe()
    this.myOutput.overMe()

    if(this.myInput1.overAdjuster||this.myInput2.overAdjuster){
      this.overAdjuster = true
    }else{
      this.overAdjuster = false
    }

    if(this.myInput1.overOperator||this.myInput2.overOperator||this.myOutput.overOperator){
      this.overOperator = true
    }


  }




  this.clickMe = function() {
    if(this.overBody){
      //if shift is pressed...
      if(shiftSelect){
        //if predicate is selected, unselect.
        if(this.selected){
          this.selected = false
          this.arrestDragging()
        //if predicate is unselected, select.
        }else{
          this.selected = true
          this.dragMe()
        }


      //if shift is not pressed...
      }else{
        //if operator is selected, prep for dragging
        if(this.selected){
          this.dragMe()
        //if operator is unselected, clear all all other selections.  
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

    this.myInput1.clickMe()
    this.myInput2.clickMe()
    this.myOutput.clickMe()

    if(this.myOutput.wirePull){
      this.wirePull = true
    }else{
      this.wirePull = false
    }

  }


  //called to activate dragging for all selected predicates...
  this.dragMe = function(){
    this.dragging = true
    this.offsetX = this.stageX-mouseX
    this.offsetY = this.stageY-mouseY
    this.myInput1.dragMe()
    this.myInput2.dragMe()
    this.myOutput.dragMe()
  }


  this.arrestDragging = function(){
    this.dragging = false
    this.myInput1.arrestDragging()
    this.myInput2.arrestDragging()
    this.myOutput.arrestDragging()

  }

  this.allFalse = function(){
    
    this.dragging = false

    this.myInput1.allFalse()
    this.myInput2.allFalse()
    this.myOutput.allFalse()

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
    if(this.dragging){
        this.stageX = mouseX + this.offsetX
        this.stageY = mouseY + this.offsetY
        this.globalX = stageToGlobalX(this.stageX)
        this.globalY = stageToGlobalY(this.stageY)
    }

    this.myInput1.update()
    this.myInput2.update()
    this.myOutput.update()
  }


  this.display = function(){

    rectMode(CORNER)

    this.stageX = globalToStageX(this.globalX)
    this.stageY = globalToStageY(this.globalY)

    if(setType == 1){
      this.myOutput.count = this.myInput1.count + this.myInput2.count
    }else if(setType == 2){
      this.myOutput.count = this.myInput1.count * this.myInput2.count
    }else if(setType == 3){
      this.myOutput.count = this.myInput1.count - this.myInput2.count
    }


    //move center of coordinate system to center of box
    push()

      translate(this.stageX,this.stageY)
      scale(globalScale)

      //box

      if(setType==1){
        if(!this.selected){
          fill(203,222,199)
        }else{
          fill(200,255,230)
        }
      }else if(setType==2){
        if(!this.selected){
          fill(240,200,32)
        }else{
          fill(255,230,13)
        }
      }else if(setType==3){
        if(!this.selected){
          fill(100)
        }else{
          fill(200)
        }
      }
      stroke(0)
      strokeWeight(6)
      rect(-720/2,-630/2,720,630,90)


      if(setType==1||setType==2){
        //piping from input1
        noFill()
        stroke(0)
        strokeWeight(24)
        arc(-90,120,240,240,PI,-HALF_PI)
        line(0,0,-90,0)
        stroke(153,203,158)
        strokeWeight(12)
        arc(-90,120,240,240,PI,-HALF_PI)
        line(0,0,-90,0)

        //piping from input2
        noFill()
        stroke(0)
        strokeWeight(24)
        arc(90,120,240,240,-HALF_PI,0)
        line(0,0,90,0)
        stroke(19,91,169)
        strokeWeight(12)
        arc(90,120,240,240,-HALF_PI,0)
        line(0,0,90,0)

        //piping to output
        fill(130,171,175)
        strokeWeight(6)
        stroke(0)
        rect(-9,0,18,-210)



        //plus sign bubble
        stroke(0)
        strokeWeight(6)
        fill(60,144,108)
        ellipse(0,0,120,120)
      }
      
      //addition/multiplication sign

      push()

        if(setType==2){
          rotate(HALF_PI/2)
        }

        if(setType==1||setType==2){
          noStroke()
          fill(203,222,199)
          beginShape()
            vertex(-6,36)
            vertex(-6,6)
            vertex(-36,6)
            vertex(-36,-6)
            vertex(-6,-6)
            vertex(-6,-36)
            vertex(6,-36)
            vertex(6,-6)
            vertex(36,-6)
            vertex(36,6)
            vertex(6,6)
            vertex(6,36)
          endShape(CLOSE)
        }

      pop()  

      if(setType==3){
        fill(0)
        noStroke()
        textSize(100)
        text("subtract",0,0)
      }

    pop()


    this.myInput1.display()
    this.myInput2.display()

    this.myOutput.display()

  }


}










