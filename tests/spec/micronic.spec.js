describe("micronic", function() {
  var container,
      target,
      classNames = ["none","nano","micro","mini","norm","high","ultra"],
      classWidths = {
        none: [0,0],
        nano: [1,96],
        micro: [97,288],
        mini: [289,768],
        norm: [769,1200],
        high: [1201,1600],
        ultra: [1601,10000]
      };
  function setDimensions(width,height) {
    if (typeof width != "undefined") container.style.width = width;
    if (typeof height != "undefined") container.style.height = height;
  }

  beforeEach(function() {
    loadFixtures('init.html')
    
    target=document.querySelector("#container [micronic]");
    container = target.offsetParent
    micronic.init()

  });
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
      expect(custom.classList.contains("nano")).toBe(true)
              setTimeout(done,100)
            },50)
    });
    it("should be able to disable default additions", function (done) {
      var custom = document.querySelector("#customDefault");
      setTimeout(function () {
      expect(custom.classList.contains("nano")).toBe(false)
              setTimeout(done,100)
            },50)

    })
  
 

  

});
