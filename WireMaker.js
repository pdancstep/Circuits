function MakeWire(source,target) {

	//FIX: This will need retooling when we consider multi-input/output functions...

	if(myOperators[source].myType==0){
		this.mySource = myOperators[source]
	}else if(myOperators[source].myType>0){
		this.mySource = myOperators[source].myOutput
	}

	if(myOperators[target].myType==0&&myOperators[target].free){
		this.myTarget = myOperators[target]
	}else if(myOperators[target].myType>0){
		if(myOperators[target].myInput1.overAdjuster&&myOperators[target].myInput1.free){
			this.myTarget = myOperators[target].myInput1
		}else if(myOperators[target].myInput2.overAdjuster&&myOperators[target].myInput2.free){
			this.myTarget = myOperators[target].myInput2
		}
	}

	this.myTarget.free = false
	this.myTarget.myDriver = this.mySource


	this.tipToTipDistance
	//"Aggressiveness" of bezier curve -- the "length" of the control point
	this.controlPointRadius


	this.setColor = 2

	this.update = function(){



	}


	this.display = function(){

		this.tipToTipDistance = dist(globalToStageX(this.mySource.globalX),globalToStageY(this.mySource.globalY-192),globalToStageX(this.myTarget.globalX),globalToStageY(this.myTarget.globalY+240))
		this.controlPointRadius = map(this.tipToTipDistance,0,300*globalScale,0,300*globalScale)
		if(this.controlPointRadius>300*globalScale){
			this.controlPointRadius = 300*globalScale
		}


		noFill()
		stroke(0)
		strokeWeight(24*globalScale)
		bezier(globalToStageX(this.mySource.globalX),globalToStageY(this.mySource.globalY-this.mySource.upperStemHeight),globalToStageX(this.mySource.globalX),globalToStageY(this.mySource.globalY-this.mySource.upperStemHeight)-this.controlPointRadius,
			globalToStageX(this.myTarget.globalX),globalToStageY(this.myTarget.globalY+this.myTarget.lowerStemHeight)+this.controlPointRadius,globalToStageX(this.myTarget.globalX),globalToStageY(this.myTarget.globalY+this.myTarget.lowerStemHeight))
		strokeWeight(12*globalScale)
		stroke(colorArray[this.setColor][0],colorArray[this.setColor][1],colorArray[this.setColor][2])
		bezier(globalToStageX(this.mySource.globalX),globalToStageY(this.mySource.globalY-this.mySource.upperStemHeight),globalToStageX(this.mySource.globalX),globalToStageY(this.mySource.globalY-this.mySource.upperStemHeight)-this.controlPointRadius,
			globalToStageX(this.myTarget.globalX),globalToStageY(this.myTarget.globalY+this.myTarget.lowerStemHeight)+this.controlPointRadius,globalToStageX(this.myTarget.globalX),globalToStageY(this.myTarget.globalY+this.myTarget.lowerStemHeight))

	}


}