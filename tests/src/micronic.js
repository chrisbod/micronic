this.micronic = {
	document: this.document,
	prefixes: ["webkit", "moz", "MS", "o", ""],
	classNames:["none","nano","micro","mini","norm","high","ultra"],
	classSizes: {
        none: [0,0],
        nano: [1,96],
        micro: [97,288],
        mini: [289,768],
        norm: [769,1200],
        high: [1201,1600],
        ultra: [1601,10000]
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
	},
	handleEvent: function (event) {
		var target = event.target;
		if (target.hasAttribute("micronic")) {
			var container = target.offsetParent;
			var width = container.getBoundingClientRect().width,
				classList = target.classList
			var customDefs = target.getAttribute("micronic")
			if (customDefs) {
				var customDefinitions = Function("return {"+customDefs+"}")();
				var disableDefault = customDefinitions.default === false;
				delete customDefinitions.default;
				Object.keys(customDefinitions).forEach(this.determineClassBySize.bind(this,target,classList,width,customDefinitions))

			}
			console.log(disableDefault)
			if (!disableDefault) {
			this.classNames.forEach(this.determineClassBySize.bind(this,target,classList,width,this.classSizes))
	
			}
			
		}
	},
	determineClassBySize: function (target,classList,width,classSizes,className) {
		var dimensions = classSizes[className];
		if (width>=dimensions[0] && width <= dimensions[1]) {
			classList.add(className)
			console.log(className,dimensions,width)
		} else {
			classList.remove(className)
		}
	}
	


}