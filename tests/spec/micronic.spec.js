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
    },
    colors = {
        "zero-width": [0,0,0],
        "xx-small-width": [31,31,31],
        "x-small-width": [63,63,63],
        "small-width": [95,95,95],
        "medium-width": [127,127,127],
        "large-width": [159,159,159],
        "x-large-width": [191,191,191],
        "xx-large-width": [223,223,223]
    };
  function fifty() {
    var args = []
    args.push.apply(args,arguments);
    args.forEach(function (func,index) {
      setTimeout(func,(index+1)*50)
    })

  }
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
    
    target=document.querySelector("#container [micronic]"),
    colorTarget = document.querySelector(".color")
    container = target.offsetParent
    micronic.init()

  });
  afterEach(function () {
    setDimensions("")
  })
  var timer = 1;
    classNames.forEach(function (className) {
         it("should set "+className+" as a classname when the container is "+classWidths[className][1]+"px wide", function (done) {
          setDimensions(classWidths[className][0]+"px");
          fifty(
            function () {
              expect(target.classList.length).toBe(2)
              expect(target.classList.contains(className)).toBe(true);
              expect(getComputedStyle(colorTarget).color).toBe("rgb("+colors[className].join(', ').replace(/\[|\]/g,'')+")");
            },
            done

          );

      })
  });
    it("should not fire on a non-micronic element", function (done) {
      var div = document.createElement("div")
      div.className = "other"
      document.body.appendChild(div);
      fifty(
        function () {
          expect(div.className).toBe("other");
        },
        done
      )
    });
    it("should be able to add inline class definitions", function (done) {
      var custom = document.querySelector("#custom");
      fifty(
         function () {
           expect(custom.classList.contains("custom")).toBe(true)
            expect(custom.classList.contains("xx-small-width")).toBe(true)
            },
          done
      )
    });
    it("should be able to disable default additions", function (done) {
      var custom = document.querySelector("#customDefault");
      fifty(
          function () {
              expect(custom.classList.contains("xx-small-width")).toBe(false)
            },
          done
      )
        

    });
    it("should be able to update classes when the window is resized", function (done) {
      var scaling = document.querySelector("#scaling");
      mockResize(400,400);
      fifty(
        function () {
          expect(scaling.className).toBe("small-width small-height");
          mockResize("1000","1000");
        },
        function () {
          expect(scaling.className).toBe("medium-width medium-height");
          done()
        }

      )
      
    });

    it("should be able to update classes on a reflowing floated element", function (done) {
      var reflow = document.querySelector("#reflow")
      fifty(
        function () {
           expect(reflow.classList.contains("xx-small-width")).toBe(true)
           reflow.innerText = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        
        },
        function () {

          expect(reflow.classList.contains("small-width")).toBe(true)
          done()
        }
        

      );
      
    });
    it("should handle absent values and -1 values",function (done) {
      var nomax1 = document.querySelector("#nomax1"),
          nomax2 = document.querySelector("#nomax2");
      expect(nomax1.classList.contains("nomax")).toBe(false)
      expect(nomax2.classList.contains("nomax")).toBe(false)
      nomax1.style.width = "100px";
      nomax2.style.width = "100px";
      fifty(    
        function () {
          expect(nomax1.classList.contains("nomax")).toBe(true)
          expect(nomax2.classList.contains("nomax")).toBe(true)
          done()
        }
      )
    })
  
 

  

});
