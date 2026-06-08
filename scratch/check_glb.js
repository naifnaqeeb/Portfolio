const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, '..', 'public', 'models', 'hacker-room.glb');
const buffer = fs.readFileSync(glbPath);

// Header check
const magic = buffer.readUInt32LE(0);
if (magic !== 0x46546c67) {
  console.error('Not a valid GLB file');
  process.exit(1);
}

const length = buffer.readUInt32LE(8);
const chunkLength = buffer.readUInt32LE(12);
const chunkBuffer = buffer.slice(20, 20 + chunkLength);
const gltf = JSON.parse(chunkBuffer.toString('utf8'));

// Chunk 1 (Binary Buffer)
const binHeaderOffset = 20 + chunkLength;
const binLength = buffer.readUInt32LE(binHeaderOffset);
const binBuffer = buffer.slice(binHeaderOffset + 8, binHeaderOffset + 8 + binLength);

// Let's get the screen mesh (Mesh [0]) POSITION and TEXCOORD_0 accessors
const mesh = gltf.meshes[0];
const prim = mesh.primitives[0];

const posAccessorIndex = prim.attributes.POSITION;
const uvAccessorIndex = prim.attributes.TEXCOORD_0;

const posAccessor = gltf.accessors[posAccessorIndex];
const uvAccessor = gltf.accessors[uvAccessorIndex];

console.log('posAccessor:', posAccessor);
console.log('uvAccessor:', uvAccessor);
console.log('bufferViews count:', gltf.bufferViews ? gltf.bufferViews.length : 0);

if (!posAccessor || !uvAccessor) {
  console.error('Accessor not found');
  process.exit(1);
}
const posView = gltf.bufferViews ? gltf.bufferViews[posAccessor.bufferView] : null;
const uvView = gltf.bufferViews ? gltf.bufferViews[uvAccessor.bufferView] : null;

if (!posView || !uvView) {
  console.error('bufferView not found for position or uv');
  process.exit(1);
}
const posBuffer = binBuffer.slice(posView.byteOffset || 0, (posView.byteOffset || 0) + posView.byteLength);
const uvBuffer = binBuffer.slice(uvView.byteOffset || 0, (uvView.byteOffset || 0) + uvView.byteLength);

// Parse positions (FLOAT, 3 components) and UVs (FLOAT, 2 components)
const posCount = posAccessor.count;
let minU = Infinity, maxU = -Infinity;
let minV = Infinity, maxV = -Infinity;

let tvVertexCount = 0;

for (let i = 0; i < posCount; i++) {
  const px = posBuffer.readFloatLE(i * 12);
  const py = posBuffer.readFloatLE(i * 12 + 4);
  const pz = posBuffer.readFloatLE(i * 12 + 8);

  const u = uvBuffer.readFloatLE(i * 8);
  const v = uvBuffer.readFloatLE(i * 8 + 4);

  // Filter TV screen vertices (X > 35.0)
  if (px > 35.0) {
    tvVertexCount++;
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
    if (v < minV) minV = v;
    if (v > maxV) maxV = v;
  }
}

console.log(`TV Screen Vertices count: ${tvVertexCount}`);
console.log(`UV Bounds for TV Screen:`);
console.log(`  U: [${minU}, ${maxU}]`);
console.log(`  V: [${minV}, ${maxV}]`);
