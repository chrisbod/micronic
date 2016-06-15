describe("micronic", function() {
  var container,
      target,
      classNames = ["none","nano","micro","mini","norm","high","ultra"],
      classWidths = {
        none: [0,0],
        nano: [0,96],
        micro: [97,288],
        mini: [289,768],
        norm: [769,1200],
        high: [1201,1600],
        ultra: [1601]
      };
  function setDimensions(width,height) {
    if (typeof width != "undefined") container.style.width = width;
    if (typeof height != "undefined") container.style.height = height;
  }

  beforeEach(function() {
    loadFixtures('init.html')
    container = document.querySelector("#container")
    target=document.querySelector("#container [micronic]")

  });
  //it("should set default classnames appropriately", function () {
    classNames.forEach(function (className) {
         it("should set "+className+" as a classname when the container is "+classWidths[className][1]+"px wide", function () {
          setDimensions(classWidths[className]+"px");
          expect(container.classList.contains(className)).toBe(true);


         
      })

  
  });
  
 

  

});
