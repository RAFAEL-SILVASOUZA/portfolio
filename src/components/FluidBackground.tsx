import React, { useEffect, useRef, useCallback } from 'react';

interface FluidBackgroundProps {
  className?: string;
}

interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: { r: number; g: number; b: number };
}

const FluidBackground: React.FC<FluidBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const extRef = useRef<any>(null);
  const pointerRef = useRef<Pointer>({
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
    color: { r: 0.2, g: 0.6, b: 1.0 }, // Azul vibrante
  });

  const config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    DENSITY_DISSIPATION: 3.5,
    VELOCITY_DISSIPATION: 2,
    PRESSURE: 0.1,
    PRESSURE_ITERATIONS: 20,
    CURL: 10,
    SPLAT_RADIUS: 0.3,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLOR_UPDATE_SPEED: 10,
    PAUSED: false,
    BACK_COLOR: { r: 0.05, g: 0.05, b: 0.1 }, // Fundo mais escuro
    TRANSPARENT: true,
  };

  const getWebGLContext = useCallback((canvas: HTMLCanvasElement) => {
    const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };

    let gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext;
    const isWebGL2 = !!gl;
    if (!isWebGL2) {
      gl = (canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params)) as WebGL2RenderingContext;
    }

    if (!gl) {
      // Fallback para canvas 2D se WebGL não estiver disponível
      console.warn('WebGL not supported, using canvas 2D fallback');
      return null;
    }

    let halfFloat: any;
    let supportLinearFiltering: boolean;

    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = !!gl.getExtension('OES_texture_float_linear');
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = !!gl.getExtension('OES_texture_half_float_linear');
    }

    gl.clearColor(0.05, 0.05, 0.1, 1.0); // Fundo escuro azulado

    const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat?.HALF_FLOAT_OES;
    let formatRGBA: any;
    let formatRG: any;
    let formatR: any;

    if (isWebGL2) {
      formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
      formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    return {
      gl,
      ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering },
    };
  }, []);

  const getSupportedFormat = (gl: WebGLRenderingContext | WebGL2RenderingContext, internalFormat: number, format: number, type: number) => {
    if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
      if ((gl as WebGL2RenderingContext).RG16F !== undefined) {
        return getSupportedFormat(gl, (gl as WebGL2RenderingContext).RG16F, (gl as WebGL2RenderingContext).RG, type);
      }
      return null;
    }
    return { internalFormat, format };
  };

  const supportRenderTextureFormat = (gl: WebGLRenderingContext | WebGL2RenderingContext, internalFormat: number, format: number, type: number) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    return status === gl.FRAMEBUFFER_COMPLETE;
  };

  const compileShader = (gl: WebGLRenderingContext | WebGL2RenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  const createProgram = (gl: WebGLRenderingContext | WebGL2RenderingContext, vertexShader: WebGLShader | null, fragmentShader: WebGLShader | null) => {
    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return null;
    }

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = gl.getActiveUniform(program, i)?.name;
      if (uniformName) {
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
      }
    }

    return { program, uniforms };
  };

  const createDoubleFBO = (gl: WebGLRenderingContext | WebGL2RenderingContext, width: number, height: number, internalFormat: number, format: number, type: number, filter: number) => {
    let fbo1 = createFBO(gl, width, height, internalFormat, format, type, filter);
    let fbo2 = createFBO(gl, width, height, internalFormat, format, type, filter);

    return {
      width,
      height,
      texelSizeX: 1.0 / width,
      texelSizeY: 1.0 / height,
      get read() { return fbo1; },
      set read(value) { fbo1 = value; },
      get write() { return fbo2; },
      set write(value) { fbo2 = value; },
      swap() {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      },
    };
  };

  const createFBO = (gl: WebGLRenderingContext | WebGL2RenderingContext, width: number, height: number, internalFormat: number, format: number, type: number, filter: number) => {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const texelSizeX = 1.0 / width;
    const texelSizeY = 1.0 / height;

    return {
      texture,
      fbo,
      width,
      height,
      texelSizeX,
      texelSizeY,
      attach(id: number) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
    };
  };

  const blit = (gl: WebGLRenderingContext | WebGL2RenderingContext, target: any) => {
    if (!target) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    } else {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = getWebGLContext(canvas);
    if (!context) {
      console.warn('WebGL not supported');
      return;
    }

    const { gl, ext } = context;
    glRef.current = gl;
    extRef.current = ext;

    // Resize canvas
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking - usar documento inteiro para capturar mouse em toda a página
    const handleMouseMove = (e: MouseEvent) => {
      // Normalizar coordenadas para o canvas (0-1) - usar toda a viewport
      pointerRef.current.prevTexcoordX = pointerRef.current.texcoordX;
      pointerRef.current.prevTexcoordY = pointerRef.current.texcoordY;
      
      // Coordenadas normalizadas (0-1) baseadas na viewport inteira
      pointerRef.current.texcoordX = e.clientX / window.innerWidth;
      pointerRef.current.texcoordY = 1.0 - (e.clientY / window.innerHeight);
      
      // Calcular delta para efeito de fluido
      pointerRef.current.deltaX = pointerRef.current.texcoordX - pointerRef.current.prevTexcoordX;
      pointerRef.current.deltaY = pointerRef.current.texcoordY - pointerRef.current.prevTexcoordY;
      
      // Verificar se houve movimento significativo
      const moved = Math.abs(pointerRef.current.deltaX) > 0.001 || Math.abs(pointerRef.current.deltaY) > 0.001;
      pointerRef.current.moved = moved;
      pointerRef.current.down = true;
    };

    const handleMouseLeave = () => {
      pointerRef.current.down = false;
    };

    // Adicionar eventos ao documento para capturar mouse em toda a página
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Shaders
    const baseVertexShader = compileShader(gl, gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

    const clearShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `);

    const splatShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `);

    const advectionShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;

      void main () {
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
      }
    `);

    const divergenceShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;

          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }

          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `);

    const curlShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `);

    const vorticityShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;

          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;

          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

    const pressureShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `);

    const gradientSubtractShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

    const displayShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a * 0.8);
      }
    `);

    // Create programs
    const clearProgram = createProgram(gl, baseVertexShader, clearShader);
    const splatProgram = createProgram(gl, baseVertexShader, splatShader);
    const advectionProgram = createProgram(gl, baseVertexShader, advectionShader);
    const divergenceProgram = createProgram(gl, baseVertexShader, divergenceShader);
    const curlProgram = createProgram(gl, baseVertexShader, curlShader);
    const vorticityProgram = createProgram(gl, baseVertexShader, vorticityShader);
    const pressureProgram = createProgram(gl, baseVertexShader, pressureShader);
    const gradientSubtractProgram = createProgram(gl, baseVertexShader, gradientSubtractShader);
    const displayProgram = createProgram(gl, baseVertexShader, displayShader);

    // Create geometry
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    // Create framebuffers
    let simWidth = config.SIM_RESOLUTION;
    let simHeight = config.SIM_RESOLUTION;
    let dyeWidth = config.DYE_RESOLUTION;
    let dyeHeight = config.DYE_RESOLUTION;

    const texelSizeX = 1.0 / simWidth;
    const texelSizeY = 1.0 / simHeight;

    const density = createDoubleFBO(gl, dyeWidth, dyeHeight, ext.formatRGBA.internalFormat, ext.formatRGBA.format, ext.halfFloatTexType, ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST);
    const velocity = createDoubleFBO(gl, simWidth, simHeight, ext.formatRG.internalFormat, ext.formatRG.format, ext.halfFloatTexType, ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST);
    const divergence = createFBO(gl, simWidth, simHeight, ext.formatR.internalFormat, ext.formatR.format, ext.halfFloatTexType, gl.NEAREST);
    const curl = createFBO(gl, simWidth, simHeight, ext.formatR.internalFormat, ext.formatR.format, ext.halfFloatTexType, gl.NEAREST);
    const pressure = createDoubleFBO(gl, simWidth, simHeight, ext.formatR.internalFormat, ext.formatR.format, ext.halfFloatTexType, gl.NEAREST);

    // Helper functions
    const splat = (x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) => {
      if (!splatProgram) return;
      gl.useProgram(splatProgram.program);
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS / 100.0);
      blit(gl, velocity.write);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, density.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(gl, density.write);
      density.swap();
    };

    const HSVtoRGB = (h: number, s: number, v: number) => {
      let r: number, g: number, b: number;
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);

      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        default: r = 0; g = 0; b = 0;
      }

      return { r: r!, g: g!, b: b! };
    };

    let lastTime = Date.now();
    let colorUpdateTimer = 0;

    const update = () => {
      const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
      lastTime = Date.now();

      if (!config.PAUSED) {
        // Update color
        colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
        if (colorUpdateTimer >= 1) {
          colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
          pointerRef.current.color = HSVtoRGB(Math.random(), 1.0, 1.0);
        }

        // Apply splat from mouse
        if (pointerRef.current.moved) {
          pointerRef.current.moved = false;
          const dx = pointerRef.current.deltaX * config.SPLAT_FORCE;
          const dy = pointerRef.current.deltaY * config.SPLAT_FORCE;
          splat(pointerRef.current.texcoordX, pointerRef.current.texcoordY, dx, dy, pointerRef.current.color);
        }

        // Curl
        if (curlProgram) {
          gl.useProgram(curlProgram.program);
          gl.uniform2f(curlProgram.uniforms.texelSize, texelSizeX, texelSizeY);
          gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
          blit(gl, curl);
        }

        // Vorticity
        if (vorticityProgram) {
          gl.useProgram(vorticityProgram.program);
          gl.uniform2f(vorticityProgram.uniforms.texelSize, texelSizeX, texelSizeY);
          gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
          gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
          gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
          gl.uniform1f(vorticityProgram.uniforms.dt, dt);
          blit(gl, velocity.write);
          velocity.swap();
        }

        // Divergence
        if (divergenceProgram) {
          gl.useProgram(divergenceProgram.program);
          gl.uniform2f(divergenceProgram.uniforms.texelSize, texelSizeX, texelSizeY);
          gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
          blit(gl, divergence);
        }

        // Clear pressure
        if (clearProgram) {
          gl.useProgram(clearProgram.program);
          gl.uniform2f(clearProgram.uniforms.texelSize, texelSizeX, texelSizeY);
          gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
          gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
          blit(gl, pressure.write);
          pressure.swap();
        }

        // Pressure
        if (pressureProgram) {
          gl.useProgram(pressureProgram.program);
          gl.uniform2f(pressureProgram.uniforms.texelSize, texelSizeX, texelSizeY);
          gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
          for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
            gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
            blit(gl, pressure.write);
            pressure.swap();
          }
        }

        // Gradient Subtract
        if (gradientSubtractProgram) {
          gl.useProgram(gradientSubtractProgram.program);
          gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, texelSizeX, texelSizeY);
          gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
          gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
          blit(gl, velocity.write);
          velocity.swap();
        }

        // Advection
        if (advectionProgram) {
          gl.useProgram(advectionProgram.program);
          gl.uniform2f(advectionProgram.uniforms.texelSize, texelSizeX, texelSizeY);
          gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, texelSizeX, texelSizeY);
          gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
          gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0));
          gl.uniform1f(advectionProgram.uniforms.dt, dt);
          gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
          blit(gl, velocity.write);
          velocity.swap();

          gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
          gl.uniform1i(advectionProgram.uniforms.uSource, density.read.attach(1));
          gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
          blit(gl, density.write);
          density.swap();
        }
      }

      // Display
      if (displayProgram) {
        gl.useProgram(displayProgram.program);
        gl.uniform1i(displayProgram.uniforms.uTexture, density.read.attach(0));
        blit(gl, null);
      }

      animationRef.current = requestAnimationFrame(update);
    };

    const wrap = (value: number, min: number, max: number) => {
      const range = max - min;
      if (range === 0) return min;
      return ((value - min) % range + range) % range + min;
    };

    // Initial splat
    const initialSplat = () => {
      const color = HSVtoRGB(Math.random(), 1.0, 1.0);
      splat(0.5, 0.5, 0.0, 1000.0, color);
    };

    initialSplat();
    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [getWebGLContext]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      style={{ 
        opacity: 1,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f23 100%)'
      }}
    />
  );
};

export default FluidBackground;