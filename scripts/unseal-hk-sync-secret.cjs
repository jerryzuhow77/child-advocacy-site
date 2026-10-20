#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const keyPath = process.argv[2];
const sealed = process.argv[3] || process.env.SEALED_SYNC_SECRET;
if (!keyPath || !sealed) throw new Error("Key path and sealed credential are required");

const keyText = fs.readFileSync(keyPath, "utf8");
const raw = Buffer.from(keyText.replace(/-----[^-]+-----/g, "").replace(/\s+/g, ""), "base64");
const magic = Buffer.from("openssh-key-v1\0");
if (!raw.subarray(0, magic.length).equals(magic)) throw new Error("Unsupported SSH key container");

let offset = magic.length;
function take() {
  const size = raw.readUInt32BE(offset);
  offset += 4;
  const value = raw.subarray(offset, offset + size);
  offset += size;
  return value;
}

const cipher = take().toString();
const kdf = take().toString();
take();
if (cipher !== "none" || kdf !== "none") throw new Error("Encrypted SSH key is unsupported");
const keyCount = raw.readUInt32BE(offset);
offset += 4;
for (let index = 0; index < keyCount; index += 1) take();

const block = take();
let blockOffset = 0;
function takeUint32() {
  const value = block.readUInt32BE(blockOffset);
  blockOffset += 4;
  return value;
}
function takeBlock() {
  const size = takeUint32();
  const value = block.subarray(blockOffset, blockOffset + size);
  blockOffset += size;
  return value;
}

if (takeUint32() !== takeUint32()) throw new Error("SSH key check failed");
if (takeBlock().toString() !== "ssh-ed25519") throw new Error("Expected ED25519 deployment key");
takeBlock();
const edPrivate = takeBlock();
const seed = edPrivate.subarray(0, 32);
const scalar = crypto.createHash("sha512").update(seed).digest();
scalar[0] &= 248;
scalar[31] &= 127;
scalar[31] |= 64;

const privateDer = Buffer.concat([
  Buffer.from("302e020100300506032b656e04220420", "hex"),
  scalar.subarray(0, 32),
]);
const xPrivate = crypto.createPrivateKey({ key: privateDer, format: "der", type: "pkcs8" });
const xPublic = crypto.createPublicKey(xPrivate).export({ format: "der", type: "spki" }).subarray(-32);

const parts = sealed.split(".");
if (parts.length !== 4 || parts[0] !== "v1") throw new Error("Unsupported sealed credential");
const ephemeralRaw = Buffer.from(parts[1], "base64url");
const nonce = Buffer.from(parts[2], "base64url");
const encrypted = Buffer.from(parts[3], "base64url");
const ephemeralKey = crypto.createPublicKey({
  key: Buffer.concat([Buffer.from("302a300506032b656e032100", "hex"), ephemeralRaw]),
  format: "der",
  type: "spki",
});
const shared = crypto.diffieHellman({ privateKey: xPrivate, publicKey: ephemeralKey });
const info = Buffer.from("gpw-hk-to-tw-sync:v1");
const derived = Buffer.from(crypto.hkdfSync("sha256", shared, Buffer.concat([ephemeralRaw, xPublic]), info, 32));
const tag = encrypted.subarray(-16);
const ciphertext = encrypted.subarray(0, -16);
const decipher = crypto.createDecipheriv("aes-256-gcm", derived, nonce);
decipher.setAAD(info);
decipher.setAuthTag(tag);
process.stdout.write(Buffer.concat([decipher.update(ciphertext), decipher.final()]));
