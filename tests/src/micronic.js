this.micronic = {
	document: this.document,
	prefixes: ["webkit", "moz", "MS", "o", ""],
	classNames:["zero-width","xx-small-width","x-small-width","small-width","medium-width","large-width","x-large-width","xx-large-width"],
	classSizes: {
        "zero-width": [0,0],
        "xx-small-width": [1,96],
        "x-small-width": [97,288],
        "small-width": [289,768],
        "medium-width": [769,1200],
        "large-width": [1201,1600],
        "x-large-width": [1601,2560],
        "xx-large-width": [2561,10000]
    },
    watchedElements: [],
    boxes: [],
    addClass: function (name,dimensions) {
    	this.classNames.push(name);
    	this.classSizes[name] = dimensions;
    },
	init: function () {
		this.attachEvents();
	},
	attachEvents: function () {
		for (var p = 0, prefixes = this.prefixes, type = "AnimationStart"; p < prefixes.length; p++) {
			if (!prefixes[p]) type = type.toLowerCase();
			window.addEventListener(prefixes[p]+type, this, true);
		}
		window.addEventListener("resize",this,true)
	},
	update: function (target) {


	},
		handleEvent: function (event) {
		var target = event.target;
		if (event.type=="resize") {
			return this.recalc()
		}
		
		if (target.hasAttribute("micronic")) {
			var container = target.offsetParent;
			var width = container.getBoundingClientRect().width,
				classList = target.classList
			var customDefs = target.getAttribute("micronic")
			if (customDefs) {
				var customDefinitions = Function("return {"+customDefs+"}")();

				var disableDefault = customDefinitions.default === false;
				var dontReflow = customDefinitions.watch === false;
				delete customDefinitions.reflowing
				delete customDefinitions.default;
				if (customDefinitions.classes) Object.keys(customDefinitions.classes).forEach(this.determineClassBySize.bind(this,target,classList,width,customDefinitions.classes))

			}
			if (!disableDefault) {
			this.classNames.forEach(this.determineClassBySize.bind(this,target,classList,width,this.classSizes))
			}
			if (!dontReflow) {
				this.watch(target)
			}
			
		}
	},
	watch: function (target) {
		var elements = this.watchedElements
		if (elements.indexOf(target)==-1) {
			elements.push(target)
			var box = target.offsetParent.getBoundingClientRect()
			this.boxes.push({width:box.width,height:box.height})
		}
		if (!this.watching) {
			requestAnimationFrame(this.checkWatches.bind(this,elements,this.boxes))
			this.watching = true
		}
	},
	checkWatches: function (elements,boxes) {
		elements.forEach(function (element,index) {
			if (element.offsetParent) {
				var box = element.offsetParent.getBoundingClientRect()
				var oldBox = boxes[index];
				if (box.width!=oldBox.width) {
					boxes[index] = {
						width: box.width,
						height: box.height
					}
					this.handleEvent({target:element})
				}
			} else {//detached
				delete elements[index]
				delete boxes[index]
			}
		},this);
		//this.unwatchByIndices(unwatches)
		//console.log(unwatches)
		requestAnimationFrame(this.checkWatches.bind(this,elements,boxes))
	},
	determineClassBySize: function (target,classList,width,classSizes,className) {
		var dimensions = classSizes[className],
			minWidth = dimensions[0],
			maxWidth = 1 in dimensions ? dimensions[1] : -1;
		if (typeof dimensions != "object") return;
		if (maxWidth == -1) maxWidth = Number.POSITIVE_INFINITY;
		
		
		if (width>=minWidth && width <= maxWidth) {
			classList.add(className)
		} else {
			classList.remove(className)
		}
	},
	recalc: function () {
		var micronics = document.querySelectorAll("[micronic]");
		[].forEach.call(micronics,function (element) {
			this.handleEvent({target:element})
		},this)
	}
	


}


