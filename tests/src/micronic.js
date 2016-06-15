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
				var disableDefault = customDefinitions.$default === false;
				var reflowing = customDefinitions.$reflowing;
				delete customDefinitions.$reflowing
				delete customDefinitions.$default;
				Object.keys(customDefinitions).forEach(this.determineClassBySize.bind(this,target,classList,width,customDefinitions))

			}
			if (!disableDefault) {
			this.classNames.forEach(this.determineClassBySize.bind(this,target,classList,width,this.classSizes))
			}
			if (reflowing) {
				this.watch(target)
			}
			
		}
	},
	watch: function (target) {
		
	},
	determineClassBySize: function (target,classList,width,classSizes,className) {
		var dimensions = classSizes[className];
		if (typeof dimensions != "object") return;
		if (width>=dimensions[0] && width <= dimensions[1]) {
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


