function MakeOpMenuItem(xPos,yPos) {
  
  //mutable drag values for ghosted type
  this.x = xPos
  this.y = yPos
  //permanent values for menu location
  this.menuX = xPos
  this.menuY = yPos


  //dimensions of draggable region...
  this.radius = 30


  this.dragging = false
    
  this.offsetX = 0
  this.offsetY = 0

  //boolean for if mouse is over this menu item...
  this.overMenuItem = false

  this.overMe = function(vertOffset){
    if(dist(mouseX,mouseY,this.menuX,this.menuY-vertOffset)<this.radius){
      this.overMenuItem = true
    }else{
      this.overMenuItem = false
    }
  }

  //when mouse is clicked
  this.clickMe = function(vertOffset) {

    if(this.overMenuItem){
      this.dragging = true
      this.offsetX = this.menuX-mouseX
      this.offsetY = this.menuY-vertOffset-mouseY
    }


  }

  this.update = function(){


    //dragging shells
    if(this.dragging){
      this.x = mouseX + this.offsetX
      this.y = mouseY + this.offsetY
    }

  }

  //when drag-and-drop is released, reset coords to menu location so dragging can happen again...
  this.resetToMenu = function(){
    this.x = this.menuX
    this.y = this.menuY
  }


  this.display = function(vertOffset) {

    strokeWeight(3)
    //display menu item...
    //stroke(highlightColor[this.whichPred][0],highlightColor[this.whichPred][1],highlightColor[this.whichPred][2])


    if(this.overMenuItem){
      stroke(0)
      fill(255)
    }else{
      stroke(200,0,0)
      fill(0)
    }
    ellipse(this.menuX,this.menuY-vertOffset,this.radius*2,this.radius*2)

    //display ghost...
    if(this.dragging){
      //stroke(highlightColor[this.whichPred][0],highlightColor[this.whichPred][1],highlightColor[this.whichPred][2],150)
      stroke(0,150)
      fill(255,150)
      ellipse(this.x,this.y,this.radius*2,this.radius*2)
    }


  }

}










