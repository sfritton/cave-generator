/// <reference types="@webgpu/types" />

async function init() {
  /*
   ┍━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┑
   │ 0. CANVAS & DEVICE SETUP        │
   ┕━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┙
   */
  if (!navigator.gpu) throw Error('WebGPU not supported');

  const adapter = await navigator.gpu.requestAdapter();

  if (!adapter) throw Error("Couldn't request WebGPU adapter");

  const canvas = document.querySelector<HTMLCanvasElement>('canvas.cave-generator');

  if (!canvas) throw Error("Couldn't find the canvas");

  const device = await adapter.requestDevice();
  const context = canvas.getContext('webgpu');

  if (!context) throw Error("Couldn't get canvas context");

  const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format: canvasFormat });

  /*
   ┍━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┑
   │ 1. DRAW A SQUARE                │
   ┕━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┙
   */
  const vertices = new Float32Array([
    // Triangle 1 [ x,y, x,y, ...]
    -0.8, -0.8, 0.8, -0.8, 0.8, 0.8,
    // Triangle 2 [ x,y, x,y, ...]
    -0.8, -0.8, 0.8, 0.8, -0.8, 0.8,
  ]);

  const vertexBuffer = device.createBuffer({
    label: 'Cell vertices',
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/ 0, vertices);

  const vertexBufferLayout: GPUVertexBufferLayout = {
    arrayStride: 8,
    attributes: [
      {
        format: 'float32x2',
        offset: 0,
        shaderLocation: 0, // Position, see vertex shader
      },
    ],
  };

  const cellShaderModule = device.createShaderModule({
    label: 'Cell shader',
    code: /*wgsl*/ `
      @vertex
      fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
        return vec4f(pos, 0, 1);
      }

      @fragment
      fn fragmentMain() -> @location(0) vec4f {
        return vec4f(1, 0, 0, 1); // (Red, Green, Blue, Alpha)
      }
    `,
  });

  const cellPipeline = device.createRenderPipeline({
    label: 'Cell pipeline',
    layout: 'auto',
    vertex: {
      module: cellShaderModule,
      entryPoint: 'vertexMain',
      buffers: [vertexBufferLayout],
    },
    fragment: {
      module: cellShaderModule,
      entryPoint: 'fragmentMain',
      targets: [{ format: canvasFormat }],
    },
  });

  const encoder = device.createCommandEncoder();

  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        loadOp: 'clear',
        clearValue: { r: 0, g: 0, b: 0.4, a: 1 },
        storeOp: 'store',
      },
    ],
  });

  pass.setPipeline(cellPipeline);
  pass.setVertexBuffer(0, vertexBuffer);
  pass.draw(vertices.length / 2);

  pass.end();

  // Finish the command buffer and immediately submit it.
  device.queue.submit([encoder.finish()]);
}

init();
