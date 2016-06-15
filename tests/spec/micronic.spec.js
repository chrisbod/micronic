describe("micronic", function() {
  var container,
      target,
      classNames = ["zero-width","xx-small-width","x-small-width","small-width","medium-width","large-width","x-large-width","xx-large-width"],
      classWidths = {
        "zero-width": [0,0],
        "xx-small-width": [1,96],
        "x-small-width": [97,288],
        "small-width": [289,768],
        "medium-width": [769,1200],
        "large-width": [1201,1600],
        "x-large-width": [1601,2560],
        "xx-large-width": [2561,10000]
    };
  function setDimensions(width,height) {
    if (typeof width != "undefined") container.style.width = width;
    if (typeof height != "undefined") container.style.height = height;
  }

  function mockResize(width,height) {
    document.body.style.width = width? width +"px" : "";
    document.body.style.height = height? height +"px" : "";
    var resizeEvent = new Event("resize")
    window.dispatchEvent(resizeEvent)
  }

  beforeEach(function() {
    loadFixtures('init.html')
    
    target=document.querySelector("#container [micronic]");
    container = target.offsetParent
    micronic.init()

  });
  afterEach(function () {
    setDimensions("")
  })
    classNames.forEach(function (className) {
         it("should set "+className+" as a classname when the container is "+classWidths[className][1]+"px wide", function (done) {
          setDimensions(classWidths[className][0]+"px");
          setTimeout(function () {
            expect(target.className).toBe(className);
            setTimeout(done,100)
          },50)
      })
  });
    it("should not fire on a non-micronic element", function (done) {
      var div = document.createElement("div")
      div.className = "other"
      document.body.appendChild(div)
      setTimeout(function () {
        expect(div.className).toBe("other");
        setTimeout(done,100)
      },50)
    });
    it("should be able to add inline class definitions", function (done) {
      var custom = document.querySelector("#custom");
      setTimeout(function () {
        //console.log(custom.className)
      expect(custom.classList.contains("custom")).toBe(true)
      expect(custom.classList.contains("xx-small-width")).toBe(true)
              setTimeout(done,100)
            },50)
    });
    it("should be able to disable default additions", function (done) {
      var custom = document.querySelector("#customDefault");
      setTimeout(function () {
      expect(custom.classList.contains("xx-small-width")).toBe(false)
              setTimeout(done,100)
            },50)

    });
    it("should be able to update classes when the window is resized", function (done) {
      var scaling = document.querySelector("#scaling");
      mockResize(400,400)
      setTimeout(function () {
        expect(scaling.className).toBe("small-width");
        mockResize("1000","1000")
        setTimeout(function () {
          expect(scaling.className).toBe("medium-width");
          done()
        },50)
        
      },50)
    });
    it("should be able to update classes if reflow detection is enabled", function () {
      
    })
  
 

  

});
