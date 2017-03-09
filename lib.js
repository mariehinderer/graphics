
function isChrome() {
   return navigator.userAgent.toLowerCase().indexOf('chrome/') > -1
}

var fragmentShaderHeader = [''               // SHADER HEADER
,'   precision highp float;'
,''
].join('\n');

var uniformData = {};

function declareUniform(name, type, size) {
   uniformData[name] = {type:type, size:size};
}

function setUniform(name, data) {
   uniformData[name].data = data;
}

function gl_start(canvas, vertexShader, update) {           // START WEBGL RUNNING IN A CANVAS
   gl_vertexShader = vertexShader;
   fragmentShader = textArea.fss[1];

   for (var name in uniformData) {
      let u = uniformData[name];
      fragmentShaderHeader += '#define ' + name + '_length ' + u.size + '\n' +
                              '   uniform ' + u.type + ' ' + name + (u.size > 0 ? '[' + u.size + ']' : '') + ';\n';
   }

   setTimeout(function() {
      try { 
         canvas.gl = canvas.getContext('experimental-webgl');                 // Make sure WebGl is supported.
      } catch (e) { throw 'Sorry, your browser does not support WebGL.'; }

      canvas.setFragmentShader = function(fragmentShader) {
         this.setShaders(gl_vertexShader, fragmentShader);
      }

      function address(name) { var gl = canvas.gl; return gl.getUniformLocation(gl.program, name); }

      canvas.setShaders = function(vertexShader, fragmentShader) {            // Add the vertex and fragment shaders:
         var gl = this.gl, program = gl.createProgram();                           // Create the WebGL program.
    gl.program = program;
         var shaderError = '';
    errorLineNumber = -1;

         function addshader(type, src) {                                           // Create and attach a WebGL shader.
            var shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          shaderError = gl.getShaderInfoLog(shader);
               console.log('Cannot compile shader:\n\n' + shaderError);
            }
            gl.attachShader(program, shader);
         };

         addshader(gl.VERTEX_SHADER  , vertexShader  );                            // Add the vertex and fragment shaders.
         addshader(gl.FRAGMENT_SHADER, fragmentShaderHeader + fragmentShader);

         gl.linkProgram(program);                                                  // Link the program and report any errors.
         if (! gl.getProgramParameter(program, gl.LINK_STATUS))
            console.log('Could not link the shader program!');

         else {
            gl.useProgram(program);

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());                        // Create a square as a triangle strip
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(                          //    consisting of two triangles.
                          [ -1,1,0, 1,1,0, -1,-1,0, 1,-1,0 ]), gl.STATIC_DRAW);

            var aPos = gl.getAttribLocation(program, 'aPos');                         // Assign aPos attribute to each vertex.
            gl.enableVertexAttribArray(aPos);
            gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
         }

    textArea.style.color = shaderError.length == 0 ? 'white' : '#ffffa0';
    if (shaderError.length == 0)
       errorMessage.innerHTML = '';
         else {
       var message = shaderError.substring(9, shaderError.length);
       errorLineNumber = parseInt(message) - 2;
       message = message.substring(message.indexOf(' '), message.length);
       var nE = message.indexOf('ERROR');
       if (nE > 0)
          message = message.substring(0, nE);
       errorMessage.innerHTML = '<font face=courier>'
                              + message.substring(0, Math.min(60, message.length))
               + '</font>';
    }
         highlight.setHighlight(highlightPattern);
      }

      canvas.setShaders(vertexShader, fragmentShader);                        // Initialize everything,

      setInterval(function() {                                                // Start the animation loop.
         time = (Date.now() - _startTime) / 1000;
         var gl = canvas.gl;
         gl.uniform1f(address('uTime'), time);                                // Set time for the shaders.

    update();

         for (var name in uniformData) {
       let u = uniformData[name];
       switch (u.type) {
       case 'float': gl.uniform1fv(address(name), u.data); break;
       case 'vec2' : gl.uniform2fv(address(name), u.data); break;
       case 'vec3' : gl.uniform3fv(address(name), u.data); break;
       case 'vec4' : gl.uniform4fv(address(name), u.data); break;
       }
    }

         gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);                                   // Render the square.
      }, 30);

   }, 100); // Wait 100 milliseconds after page has loaded before starting WebGL.
}

var _startTime = Date.now(), time = 0;
var errorLineNumber = -1;
var highlightPattern = '  ';
var index = 0;
function prevIndex() { setIndex(index - 3); }
function nextIndex() { setIndex(index + 3); }

function setIndex(i) {
   var fss = textArea.fss;
   index = Math.max(0, Math.min(fss.length - 3, i));
   highlightPattern = fss[index];
   textArea.setCode(fss[index + 1]);
   narrative.innerHTML = fss[index + 2];
   prevButton.style.background = index == 0 ? 'black' : accentColor(true); 
   nextButton.style.background = index == fss.length - 3 ? 'black' : accentColor(true);
   canvas1.setShaders(gl_vertexShader, fss[index + 1], fss[index + 2]);
   for (i = 0 ; i < fss.length ; i += 3)
      window['indexButton' + i].style.background = accentColor(i == index);
}  

function accentColor(isTrue) { return isTrue ? '#aaddff' : '#006080'; }
function addTextEditor(code, callback) {                                // Add a text editor to the web page:
   document.body.innerHTML = [''
      ,'<table><tr><td width=10></td><td valign=top>'                         // Insert new html for textArea into the page.
      ,'<textArea id=textArea '
      ,'style="font:13px courier;outline-width:0;border-style:none;resize:none;overflow:scroll;"'
      ,'></textArea>'
      ,'</td><td valign=top>' + document.body.innerHTML + '</td></tr></table>'
      ].join('');

   textArea.value = code;                                                    // Set its current text to user-provided code.

   var i = 0, text = textArea.value.split('\n');                             // Set the correct number of rows and columns.
   textArea.rows = Math.max(text.length, 50);
   while (i < text.length)
      textArea.cols = Math.max(textArea.cols, text[i++].length);

   textArea.style.backgroundColor = 'black';                                 // Set the text editor's text and bg colors.
   textArea.style.color = 'white';

   textArea.onkeyup = callback;                                              // User-provided callback function on keystroke.
}

