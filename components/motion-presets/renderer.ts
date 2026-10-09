/** Draws one frame of a motion preset with WebGL: textured, rounded cards in 3D. */

import { cardAspect, clamp, layoutFrame, type CounterStyle, type Look, type Settings } from "./engine";

export interface MediaItem {
  id: number;
  texture: WebGLTexture;
  /** width over height */
  aspect: number;
  video?: HTMLVideoElement;
  /** object URL of an uploaded file, also used for its thumbnail */
  url?: string;
  /** a small canvas each video frame is drawn down to for the preview */
  frame?: HTMLCanvasElement;
  /** the object URL a video plays from, released when the video is removed */
  videoUrl?: string;
  /** the uploaded picture file, re-read at full quality for an export; no decoded pixels are held */
  file?: File;
  /** the original picture's long side, in pixels */
  longest?: number;
}

export interface Scene extends Settings {
  look: Look;
  media: MediaItem[];
  /** Share of the full canvas size to draw at, 0 to 1. The preview draws small; an export draws at 1. */
  resolution?: number;
  /** An export: video frames go to the GPU at their own size, not drawn down first. */
  fullQuality?: boolean;
  /** How many pictures and videos are uploaded. The number overlay counts these; without any it counts cards. */
  uploads?: number;
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
uniform sampler2D uTexture; uniform vec2 uSize; uniform vec4 uCrop; uniform float uRadius, uAlpha, uShade, uOverlay;
void main() {
  // The number overlay: a picture with its own transparency, drawn flat on the screen.
  if (uOverlay > 0.5) { color = texture(uTexture, vUv) * uAlpha; return; }
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

const UNIFORMS = ["uMatrix", "uSize", "uCrop", "uRadius", "uAlpha", "uShade", "uOverlay"] as const;

const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const SERIF = 'Georgia, "Times New Roman", serif';

/** Draws the number in one of the overlay styles. Returns a canvas cut close around it. */
function counterPicture(text: string, style: CounterStyle, px: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const font = style === "tag" ? `600 ${px * 0.8}px ${MONO}` : style === "serif" ? `italic 700 ${px * 1.05}px ${SERIF}` : `800 ${px}px ${SANS}`;
  ctx.font = font;
  const pad = Math.ceil(px * 0.6); // room for outlines, shadows and the pill
  canvas.width = Math.ceil(ctx.measureText(text).width) + pad * 2;
  canvas.height = Math.ceil(px * 1.2) + pad * 2;
  // Sizing a canvas clears its settings.
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.lineJoin = "round";
  const x = canvas.width / 2;
  const y = canvas.height / 2 + px * 0.04;
  const fill = (colour: string, dx = 0, dy = 0) => {
    ctx.fillStyle = colour;
    ctx.fillText(text, x + dx, y + dy);
  };
  const stroke = (colour: string, width: number) => {
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.strokeText(text, x, y);
  };
  switch (style) {
    case "white":
      fill("#fff");
      break;
    case "black":
      fill("#000");
      break;
    case "outline":
      stroke("#000", px * 0.16);
      fill("#fff");
      break;
    case "outline-dark":
      stroke("#fff", px * 0.16);
      fill("#000");
      break;
    case "hollow":
      stroke("#fff", px * 0.05);
      break;
    case "shadow":
      ctx.shadowColor = "rgb(0 0 0 / 0.65)";
      ctx.shadowBlur = px * 0.28;
      ctx.shadowOffsetY = px * 0.07;
      fill("#fff");
      break;
    case "block": {
      // A stack of black copies stepping down and right reads as a solid edge.
      const depth = Math.max(2, Math.round(px * 0.11));
      for (let step = depth; step >= 1; step--) fill("#000", step, step);
      stroke("#000", px * 0.05);
      fill("#fff");
      break;
    }
    case "tag": {
      const w = ctx.measureText(text).width + px * 0.7;
      const h = px * 1.15;
      ctx.fillStyle = "rgb(0 0 0 / 0.72)";
      ctx.beginPath();
      ctx.roundRect(x - w / 2, canvas.height / 2 - h / 2, w, h, h / 2);
      ctx.fill();
      fill("#fff");
      break;
    }
    case "serif":
      ctx.shadowColor = "rgb(0 0 0 / 0.5)";
      ctx.shadowBlur = px * 0.2;
      fill("#fff");
      break;
  }
  return canvas;
}

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

  let frames = 0;
  // The number overlay's picture, redrawn only when what it shows changes.
  const counter: { key: string; texture: WebGLTexture | null; width: number; height: number } = { key: "", texture: null, width: 0, height: 0 };

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

      // While editing, video cards refresh on every other frame: half the copying,
      // and at card size 30 pictures a second reads the same as 60. Exports refresh on all.
      frames++;
      const refreshVideos = scene.fullQuality || frames % 2 === 0;
      for (const item of media) {
        if (refreshVideos && item.video && item.video.readyState >= 2) {
          // Sending a 4K frame to the GPU sixty times a second is the slow part of
          // a video card, so the preview sends a small copy of each frame instead.
          let source: TexImageSource = item.video;
          if (!scene.fullQuality && item.frame) {
            item.frame.getContext("2d")?.drawImage(item.video, 0, 0, item.frame.width, item.frame.height);
            source = item.frame;
          }
          gl.bindTexture(gl.TEXTURE_2D, item.texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        }
      }

      const aspect = width / height;
      const shape = cardAspect(look);
      const { w, h, items, camera, cards, lead, curtain } = layoutFrame(scene, seconds, aspect, shape);
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

      if (look.counter === "off" || lead === null) return;
      const of = scene.uploads ?? cards;
      const digits = Math.max(2, String(of).length);
      const current = String((lead % of) + 1).padStart(digits, "0");
      const text = look.counter === "fraction" ? `${current}/${String(of).padStart(digits, "0")}` : current;
      // Sized from the canvas actually being drawn, so the preview and the export match.
      const px = Math.round(Math.min(width, height) * 0.08 * look.counterScale);
      const key = `${text}|${look.counterStyle}|${px}`;
      if (key !== counter.key) {
        const picture = counterPicture(text, look.counterStyle, px);
        if (counter.texture) gl.deleteTexture(counter.texture);
        counter.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, counter.texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, picture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        Object.assign(counter, { key, width: picture.width, height: picture.height });
      }
      // Its place on the canvas, in pixels from the top left. The picture carries its own padding.
      const inset = Math.min(width, height) * 0.05 - px * 0.6;
      const [row, column] = look.counterPosition.includes("-") ? look.counterPosition.split("-") : look.counterPosition === "top" || look.counterPosition === "bottom" ? [look.counterPosition, "centre"] : ["centre", look.counterPosition];
      const cx = column === "left" ? inset + counter.width / 2 : column === "right" ? width - inset - counter.width / 2 : width / 2;
      const cy = row === "top" ? inset + counter.height / 2 : row === "bottom" ? height - inset - counter.height / 2 : height / 2;
      gl.disable(gl.DEPTH_TEST);
      gl.polygonOffset(0, 0);
      gl.bindTexture(gl.TEXTURE_2D, counter.texture);
      gl.uniform1f(uniform.uOverlay, 1);
      gl.uniform1f(uniform.uAlpha, curtain);
      gl.uniformMatrix4fv(uniform.uMatrix, false, multiply(translate((cx / width) * 2 - 1, 1 - (cy / height) * 2, 0), scale((counter.width / width) * 2, (counter.height / height) * 2)));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.uniform1f(uniform.uOverlay, 0);
      gl.enable(gl.DEPTH_TEST);
    },
  };
}
