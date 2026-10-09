/** Draws one frame of a motion preset with WebGL: textured, rounded cards in 3D. */

import { cardAspect, clamp, layoutFrame, type Look, type Settings } from "./engine";

export interface MediaItem {
  id: number;
  texture: WebGLTexture;
  /** width over height */
  aspect: number;
  video?: HTMLVideoElement;
  /** object URL of an uploaded file, also used for its thumbnail */
  url?: string;
  /** the decoded picture, kept so an export can be drawn from it at full quality */
  image?: HTMLImageElement;
}

export interface Scene extends Settings {
  look: Look;
  media: MediaItem[];
  /** Share of the full canvas size to draw at, 0 to 1. The preview draws small; an export draws at 1. */
  resolution?: number;
}

type Matrix = number[];

function multiply(a: Matrix, b: Matrix): Matrix {
  const out = new Array<number>(16);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      out[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
  }
  return out;
}
const translate = (x: number, y: number, z: number): Matrix => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
const scale = (x: number, y: number): Matrix => [x, 0, 0, 0, 0, y, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const rotateX = (a: number): Matrix => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
};
const rotateY = (a: number): Matrix => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
};
const rotateZ = (a: number): Matrix => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};
function perspective(fovY: number, aspect: number, near: number, far: number): Matrix {
  const t = 1 / Math.tan(fovY / 2);
  return [t / aspect, 0, 0, 0, 0, t, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0];
}

const VERTEX = `#version 300 es
in vec2 aPos; uniform mat4 uMatrix; out vec2 vUv;
void main() { vUv = aPos + 0.5; gl_Position = uMatrix * vec4(aPos, 0.0, 1.0); }`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 color;
uniform sampler2D uTexture; uniform vec2 uSize; uniform vec4 uCrop; uniform float uRadius, uAlpha, uShade;
void main() {
  vec2 q = abs((vUv - 0.5) * uSize) - uSize * 0.5 + uRadius;
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  float mask = 1.0 - smoothstep(-fwidth(d), fwidth(d), d);
  // Seen from behind, a card would show its picture mirrored.
  vec2 uv = gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y);
  // Nothing of this card here: leave the depth buffer alone so cards behind still show.
  if (mask * uAlpha < 0.004) discard;
  vec3 rgb = texture(uTexture, uCrop.xy + uv * uCrop.zw).rgb * uShade;
  color = vec4(rgb, 1.0) * mask * uAlpha;
}`;

const UNIFORMS = ["uMatrix", "uSize", "uCrop", "uRadius", "uAlpha", "uShade"] as const;

export interface Renderer {
  texture(source: TexImageSource, mipmaps: boolean): WebGLTexture;
  deleteTexture(texture: WebGLTexture): void;
  draw(seconds: number, scene: Scene): void;
}

/** Returns null when the browser has no WebGL 2. */
export function createRenderer(canvas: HTMLCanvasElement): Renderer | null {
  const gl = canvas.getContext("webgl2", { alpha: false, antialias: true });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Could not create a shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "Shader failed");
    return shader;
  };
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  gl.useProgram(program);
  const uniform = Object.fromEntries(UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)])) as Record<
    (typeof UNIFORMS)[number],
    WebGLUniformLocation | null
  >;

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  // Cards that cross are settled pixel by pixel by depth, not by which was drawn last.
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  return {
    texture(source, mipmaps) {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipmaps ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      if (mipmaps) gl.generateMipmap(gl.TEXTURE_2D);
      return texture;
    },

    deleteTexture(texture) {
      gl.deleteTexture(texture);
    },

    draw(seconds, scene) {
      const { look, media } = scene;
      // Sides stay even at any resolution: H.264 cannot encode an odd one.
      const resolution = clamp(scene.resolution ?? 1, 0.1, 1);
      const width = Math.max(2, Math.round((look.width * resolution) / 2) * 2);
      const height = Math.max(2, Math.round((look.height * resolution) / 2) * 2);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      const bg = look.background;
      gl.clearColor(parseInt(bg.slice(1, 3), 16) / 255, parseInt(bg.slice(3, 5), 16) / 255, parseInt(bg.slice(5, 7), 16) / 255, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (!media.length) return;

      for (const item of media) {
        if (item.video && item.video.readyState >= 2) {
          gl.bindTexture(gl.TEXTURE_2D, item.texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, item.video);
        }
      }

      const aspect = width / height;
      const shape = cardAspect(look);
      const { w, h, items, camera } = layoutFrame(scene, seconds, aspect, shape);
      const distance = camera.distance;
      // The camera turns about the point it looks at, then steps back from it.
      let view = translate(0, 0, -distance);
      view = multiply(view, rotateX(camera.tilt));
      view = multiply(view, rotateY(camera.yaw));
      view = multiply(view, rotateZ(camera.roll));
      view = multiply(view, translate(-camera.x, -camera.y, 0));
      const projection = perspective(camera.fov, aspect, 0.1, 100);

      const drawn: { i: number; depth: number; alpha: number; s: number; matrix: Matrix }[] = [];
      for (const t of items) {
        let model = translate(t.x, t.y, t.z);
        if (t.ry) model = multiply(model, rotateY(t.ry));
        if (t.rx) model = multiply(model, rotateX(t.rx));
        if (t.rz) model = multiply(model, rotateZ(t.rz));
        const modelView = multiply(view, multiply(model, scale(w * t.s, h * t.s)));
        const depth = modelView[14];
        if (depth > -0.2) continue; // at or behind the camera
        drawn.push({ i: t.i, depth, alpha: t.a, s: t.s, matrix: multiply(projection, modelView) });
      }
      drawn.sort((a, b) => a.depth - b.depth); // far to near

      for (const [order, item] of drawn.entries()) {
        // Cards on the same plane would flicker; the later, nearer one wins by a hair.
        gl.polygonOffset(0, -order);
        const source = media[item.i % media.length];
        const cover = source.aspect / shape;
        const crop = cover > 1 ? [(1 - 1 / cover) / 2, 0, 1 / cover, 1] : [0, (1 - cover) / 2, 1, cover];
        gl.bindTexture(gl.TEXTURE_2D, source.texture);
        gl.uniformMatrix4fv(uniform.uMatrix, false, item.matrix);
        gl.uniform2f(uniform.uSize, w * item.s, h * item.s);
        gl.uniform4fv(uniform.uCrop, crop);
        gl.uniform1f(uniform.uRadius, look.radius * Math.min(w, h) * item.s);
        gl.uniform1f(uniform.uAlpha, item.alpha);
        gl.uniform1f(uniform.uShade, clamp(1 + (item.depth + distance) * 0.1, 0.4, 1)); // dimmer further away
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    },
  };
}
