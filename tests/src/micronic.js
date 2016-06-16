this.micronic = {
	document: this.document,
	prefixes: ["webkit", "moz", "MS", "o", ""],
	classNames:[
	"zero-width",
	"xx-small-width",
	"x-small-width",
	"small-width",
	"medium-width",
	"large-width",
	"x-large-width",
	"xx-large-width",
	"zero-height",
	"xx-small-height",
	"x-small-height",
	"small-height",
	"medium-height",
	"large-height",
	"x-large-height",
	"xx-large-height",
	"portrait",
	"landscape"
	],
	classSizes: {
        "zero-width": [0,0],
        "xx-small-width": [1,96],
        "x-small-width": [97,288],
        "small-width": [289,768],
        "medium-width": [769,1200],
        "large-width": [1201,1600],
        "x-large-width": [1601,2560],
        "xx-large-width": [2561,10000],
        "zero-height": [0,-1,0,0],
        "xx-small-height": [0,-1,1,96],
        "x-small-height": [0,-1,97,288],
        "small-height": [0,-1,289,768],
        "medium-height": [0,-1,769,1200],
        "large-height": [0,-1,1201,1600],
        "x-large-height": [0,-1,1601,2560],
        "xx-large-height": [0,-1,2561,10000]
    },
    watchedElements: [],
    boxes: [],
    values: [],
    presets: [],
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
	},
	getCustomDefinitions: function (element) {
		var customDefs = element.getAttribute("micronic");
		if (customDefs) {
			return Function("return {"+customDefs+"}")();
		}
		return null
		
	},
	initElement: function (target) {

	},
	initCustomDefs: function (target) {
		var customDefs = this.getCustomDefinitions(target);
		if (customDefs) {
				var customDefinitions = Function("return {"+target.getAttribute("micronic")+"}")();

				var disableDefault = customDefinitions.default === false;
				var dontReflow = customDefinitions.watch === false;
				delete customDefinitions.reflowing
				delete customDefinitions.default;
				if (customDefinitions.classes) Object.keys(customDefinitions.classes).forEach(this.determineClassBySize.bind(this,target,classList,box,customDefinitions.classes))

			}
	},


	handleEvent: function (event) {
		var target = event.target;
		
		if (target.hasAttribute("micronic")) {
			var container = target.offsetParent || target.parentNode,
				box = container.getBoundingClientRect(),
				classList = target.classList,
				customDefinitions = this.getCustomDefinitions(target),
				dontReflow,
				disableDefault;
			this.checkOrientation(target,box)
			if (customDefinitions) {
				
				disableDefault = customDefinitions.default === false;
				dontReflow = customDefinitions.watch === false;
				delete customDefinitions.reflowing
				delete customDefinitions.default;
				if (customDefinitions.classes) Object.keys(customDefinitions.classes).forEach(this.determineClassBySize.bind(this,target,classList,box,customDefinitions.classes))

			}
		if (!dontReflow) {
				this.watch(target)
			}
			if (!disableDefault) {
			this.classNames.forEach(this.determineClassBySize.bind(this,target,classList,box,this.classSizes))
			}
			
			
		}
	},
	checkOrientation: function (target,box) {
		if (target.tagName == "BODY") {
				if (box.width<=box.height) {
					target.classList.remove("landscape");
					target.classList.add("portrait");
				} else {
					target.classList.remove("portrait");
					target.classList.add("landscape")
				}
			}
		},
	getMicronicClasses: function (element) {
		var classes = [];
		[].push.apply(classes,element.classList);
		return classes.filter(function (className) {
			return this.indexOf(className)!=-1;
		},this.classNames)
	},
	watch: function (target) {
		var elements = this.watchedElements;
		if (elements.indexOf(target)==-1) {

			elements.push(target)
			var box = (target.offsetParent||target.parentNode).getBoundingClientRect()
			this.boxes.push({width:box.width,height:box.height})
			this.values.push(target.getAttribute("micronic"))
			this.presets.push(this.getMicronicClasses(target))
		}
		if (!this.watching) {
			requestAnimationFrame(this.checkWatches.bind(this,elements,this.boxes,this.values,this.presets))
			this.watching = true
		}
	},
	cleanElement: function (element,presetClasses) {
		this.classNames.forEach(function (name) {
			this.remove(name);
		}, element.classList);
		if (presetClasses) {
			presetClasses.forEach(function (name) {
				this.add(name);
			},element.classList);
		}

	},
	checkWatches: function (elements,boxes,values,presets) {
		elements.forEach(function (element,index) {
			if (!element.hasAttribute("micronic")) {
				this.cleanElement(element,presets[index])
				delete elements[index];
				delete boxes[index];
				delete values[index];
				delete presets[index];
				return
			}
			if (values[index]!=element.getAttribute("micronic")) {
				this.cleanElement(element,presets[index]);
				values[index] = element.getAttribute("micronic")
			}
			if (element.ownerDocument) {
				var box = (element.offsetParent||element.parentNode).getBoundingClientRect()
				var oldBox = boxes[index];
				if (box.width!=oldBox.width) {
					boxes[index] = {
						width: box.width,
						height: box.height
					}
					this.handleEvent({target:element})
				}
			} else {//detached
				this.cleanElement(element,presets[index])
				delete elements[index];
				delete boxes[index];
				delete values[index];
				delete presets[index]
			}
		},this);
		//this.unwatchByIndices(unwatches)
		//console.log(unwatches)
		requestAnimationFrame(this.checkWatches.bind(this,elements,boxes,values,presets))
	},
	determineClassBySize: function (target,classList,box,classSizes,className) {
		if (!classSizes[className]) {//none dimensional class
			return;
		}
		var dimensions = classSizes[className],
			width = box.width,
			height = box.height,
			minWidth = dimensions[0],
			maxWidth = 1 in dimensions ? dimensions[1] : -1,
			minHeight = 2 in dimensions ? dimensions[2] : -1,
			maxHeight = 3 in dimensions ? dimensions[3] : -1
		if (typeof dimensions != "object") return;
		if (maxWidth == -1) maxWidth = Number.POSITIVE_INFINITY;
		if (maxHeight == -1) maxHeight = Number.POSITIVE_INFINITY

		
		if (width>=minWidth && width <= maxWidth && minHeight && height >= minHeight && height <= maxHeight) {
			classList.add(className)
		} else {
			classList.remove(className)
		}
	}
	


}


