const vsSource = `
	attribute vec4 aVertexPosition;
	
	uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;
	
	void main() {
		gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
	}
`;
const fsSource = `
	void main() {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
`;

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
	// Create the shader program

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

  return shaderProgram;

}

class GLError extends Error {}

class ShaderProgram {
	constructor(gl, {vsSource, fsSource, attribs, uniforms}) {
		this.gl = gl;
		this._shaders = {}
		this.addShader(gl.VERTEX_SHADER, vsSource);
		this.addShader(gl.FRAGMENT_SHADER, fsSource);
		this.attribLocations = {}
		this.initShaderProgram();
		if (attribs) for (i of attribs) {
			this.attribLocations[i] = this.getAttribLocation(i);
		}
		this.uniformLocations = {}
		if (uniforms) for (i of uniforms) {
			this.uniformLocations[i] = this.getUniformLocation(i);
		}
	}
	getAttribLocation(name) {
		return gl.getAttribLocation(this._program, name);
	}
	getUniformLocation(name) {
		return gl.getUniformLocation(this._program, name);
	}
	addShader(type, source) {
		if (type in this._shaders) throw new GLError('Program already has this type of shader');
		const gl = this.gl;
		const shader = gl.createShader(type);

		// Send the source to the shader object

		gl.shaderSource(shader, source);

		// Compile the shader program

		gl.compileShader(shader);

		// See if it compiled successfully

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			const info = gl.getShaderInfoLog(shader)
			gl.deleteShader(shader);
			throw new GLError('An error occurred compiling the shaders: ' + info);
		}

		this._shaders[type] = shader;
	}
	initShaderProgram() {
		const gl = this.gl;

		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, this._shaders[gl.VERTEX_SHADER]);
		gl.attachShader(shaderProgram, this._shaders[gl.FRAGMENT_SHADER]);
		gl.linkProgram(shaderProgram);
		this._program = shaderProgram;

		// If creating the shader program failed, alert

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			throw new GLError('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		}
	}
	
}


function main() {
	const canvas = document.getElementById('c');
	const gl = canvas.getContext('webgl');
	
	const shaderProgram = new ShaderProgram(gl, {vsSource, fsSource});
}