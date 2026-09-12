#!/usr/bin/env node
import { createHash } from "node:crypto";

const sourceOrigin = new URL(process.env.SOURCE_ORIGIN ?? "https://cn.globalprotectionwall.com").origin;
const targetOrigin = new URL(process.env.TARGET_ORIGIN ?? "https://global-protection.jerryzuhow77.chatgpt.site").origin;
const secret = process.env.HK_SYNC_SECRET;
const apply = process.argv.includes("--apply");

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const LANGUAGES = new Set(["zh-Hant", "zh-Hans", "en", "ja"]);
const THEMES = new Set(["support", "listen", "system", "courage", "official", "bulletin", "custom"]);
const COLORS = new Set(["moon", "lotus", "apricot", "sage", "indigo", "clay", "lilac"]);
const CONTENT_KINDS = new Set(["guardian", "official", "bulletin"]);
const USER_AGENT = "GuardianWallScheduledSync/1";

const [sourcePublic, targetPublic] = await Promise.all([
  getPublicSnapshot(sourceOrigin, "hong-kong-data-site", "Hong Kong"),
  getPublicSnapshot(targetOrigin, "taiwan-hong-kong-shared", "Taiwan"),
]);

const sourceMessages = sourcePublic.messages;
const targetMessages = targetPublic.messages;
const sourceGuestMessages = sourceMessages.filter((message) => typeof message.id === "string" && UUID.test(message.id));
const targetIds = new Set(targetMessages.map((message) => string(message.id, "target message id")));
const sourceOnly = sourceGuestMessages.filter((message) => !targetIds.has(message.id));
const messageRows = [];
const versionRows = [];

for (const message of sourceOnly) {
  const id = uuid(message.id, "source message id");
  const publishedAt = iso(message.publishedAt, "publishedAt");
  const version = deterministicVersionId(id);
  const language = allowed(message.language, LANGUAGES, "language");
  const theme = allowed(message.theme, THEMES, "theme");
  const color = allowed(message.color, COLORS, "color");
  const contentKind = CONTENT_KINDS.has(message.contentKind) ? message.contentKind : "guardian";
  const consent = Boolean(message.regionConsent);
  messageRows.push({
    id,
    author_id: "public-guest",
    public_nickname: string(message.nickname, "nickname"),
    language,
    theme,
    color,
    region_code: consent ? optionalString(message.regionCode) : null,
    region_label: consent ? optionalString(message.region) : null,
    region_consent: consent,
    status: "published",
    current_published_version_id: version,
    published_at: publishedAt,
    created_at: publishedAt,
    updated_at: publishedAt,
  });
  versionRows.push({
    id: version,
    message_id: id,
    version_number: 1,
    title: string(message.title ?? "", "title"),
    content: string(message.content, "content"),
    theme,
    custom_theme: optionalString(message.customTheme),
    content_kind: contentKind,
    feature_days: safeInteger(message.featureDays),
    featured_until: optionalIso(message.featuredUntil),
    source: "author",
    moderation_state: "approved",
    risk_hints: "[]",
    created_at: publishedAt,
  });
}

const targetImageAssociations = new Set();
for (const image of imageEntries(targetMessages)) {
  targetImageAssociations.add(await imageAssociationHash(targetOrigin, image));
}
const imageRows = [];
for (const image of imageEntries(sourceGuestMessages)) {
  const association = await imageAssociationHash(sourceOrigin, image);
  if (targetImageAssociations.has(association)) continue;
  imageRows.push({
    id: uuid(image.id, "source image id"),
    message_id: uuid(image.messageId, "source image message id"),
    width: positiveInteger(image.width),
    height: positiveInteger(image.height),
    sort_order: safeInteger(image.sortOrder),
  });
  targetImageAssociations.add(association);
}

if (apply) {
  if (!secret || secret.length < 32) throw new Error("HK_SYNC_SECRET is required for --apply");
  for (const messageChunk of chunks(messageRows, 20)) {
    const ids = new Set(messageChunk.map((row) => row.id));
    await postBundle({
      messages: messageChunk,
      message_versions: versionRows.filter((row) => ids.has(row.message_id)),
      guest_submissions: [],
      moderation_reviews: [],
      message_images: [],
    });
  }
  for (const imageChunk of chunks(imageRows, 10)) {
    await postBundle({
      messages: [],
      message_versions: [],
      guest_submissions: [],
      moderation_reviews: [],
      message_images: imageChunk,
    });
  }
}

const [verifiedSource, verifiedTarget] = apply
  ? await Promise.all([
      getPublicSnapshot(sourceOrigin, "hong-kong-data-site", "verified Hong Kong"),
      getPublicSnapshot(targetOrigin, "taiwan-hong-kong-shared", "verified Taiwan"),
    ])
  : [sourcePublic, targetPublic];
const verifiedSourceMessages = verifiedSource.messages;
const verifiedTargetMessages = verifiedTarget.messages;
const verifiedSourceGuestMessages = verifiedSourceMessages.filter((message) => typeof message.id === "string" && UUID.test(message.id));
const verifiedTargetIds = new Set(verifiedTargetMessages.map((row) => string(row.id, "verified target id")));
const missingIds = verifiedSourceGuestMessages
  .map((row) => uuid(row.id, "verified source id"))
  .filter((id) => !verifiedTargetIds.has(id));

let missingImageCount = 0;
if (apply) {
  const verifiedTargetImageAssociations = new Set();
  for (const image of imageEntries(verifiedTargetMessages)) {
    verifiedTargetImageAssociations.add(await imageAssociationHash(targetOrigin, image));
  }
  for (const image of imageEntries(verifiedSourceGuestMessages)) {
    if (!verifiedTargetImageAssociations.has(await imageAssociationHash(sourceOrigin, image))) {
      missingImageCount += 1;
    }
  }
}

if (apply && missingIds.length) throw new Error(`Taiwan is missing ${missingIds.length} Hong Kong messages`);
if (apply && missingImageCount) throw new Error(`Taiwan is missing ${missingImageCount} Hong Kong images`);

console.log(JSON.stringify({
  synchronized: apply && missingIds.length === 0 && missingImageCount === 0,
  dryRun: !apply,
  importedMessages: apply ? messageRows.length : 0,
  importedImages: apply ? imageRows.length : 0,
  pendingMessageImports: messageRows.length,
  pendingImageImports: imageRows.length,
  hongKongPublished: verifiedSourceGuestMessages.length,
  taiwanPublished: verifiedTargetMessages.length,
  hongKongMessagesMissingInTaiwan: missingIds.length,
  hongKongImagesMissingInTaiwan: apply ? missingImageCount : null,
}));

async function getJson(url) {
  const response = await fetch(url, { headers: { accept: "application/json", "user-agent": USER_AGENT }, cache: "no-store" });
  if (!response.ok) throw new Error(`GET failed ${response.status} ${new URL(url).pathname}`);
  return response.json();
}

async function getPublicSnapshot(origin, expectedScope, label) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const publishedBefore = await getPublishedCount(origin, expectedScope, label);
    const url = new URL("/api/public/messages", origin);
    url.searchParams.set("limit", String(Math.max(publishedBefore, 1)));
    const payload = await getJson(url);
    const messages = array(payload.messages, `${label} messages`);
    const publishedAfter = await getPublishedCount(origin, expectedScope, label);
    if (publishedBefore !== publishedAfter) continue;
    if (messages.length < publishedAfter) {
      throw new Error(`${label} messages incomplete: expected at least ${publishedAfter}, received ${messages.length}`);
    }
    return { messages };
  }
  throw new Error(`${label} published count did not stabilize`);
}

async function getPublishedCount(origin, expectedScope, label) {
  const stats = await getJson(`${origin}/api/public/submission-stats`);
  if (stats.scope !== expectedScope) throw new Error(`${label} scope changed`);
  const published = Number(stats.published);
  if (!Number.isSafeInteger(published) || published < 0) throw new Error(`Invalid ${label} published count`);
  return published;
}

async function postBundle(bundle) {
  const response = await fetch(`${targetOrigin}/api/internal/hong-kong-reconcile`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-hk-sync-secret": secret, "user-agent": USER_AGENT },
    body: JSON.stringify(bundle),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Reconcile failed ${response.status}: ${body.error ?? "unknown"}`);
}

function imageEntries(messages) {
  return messages
    .flatMap((message) => array(message.images ?? [], "images").map((image) => ({ ...image, messageId: message.id })))
    .filter((image) => typeof image.id === "string" && UUID.test(image.id));
}

async function imageAssociationHash(origin, image) {
  return `${uuid(image.messageId, "image message id")}:${await imageHash(origin, image)}`;
}

async function imageHash(origin, image) {
  const id = uuid(image.id, "image id");
  const url = new URL(string(image.url, "image url"), origin);
  if (url.origin !== origin || url.pathname !== `/api/images/${id}`) throw new Error("Unexpected image URL");
  const response = await fetch(url, { headers: { accept: "image/webp", "user-agent": USER_AGENT }, cache: "no-store" });
  if (!response.ok) throw new Error(`Image fetch failed ${response.status}`);
  return createHash("sha256").update(Buffer.from(await response.arrayBuffer())).digest("hex");
}

function deterministicVersionId(messageId) {
  const bytes = Buffer.from(createHash("sha256").update(`hk-public-version:${messageId}`).digest().subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function chunks(items, size) {
  const output = [];
  for (let index = 0; index < items.length; index += size) output.push(items.slice(index, index + size));
  return output;
}
function array(value, label) { if (!Array.isArray(value)) throw new Error(`${label} unavailable`); return value; }
function string(value, label) { if (typeof value !== "string") throw new Error(`Invalid ${label}`); return value; }
function optionalString(value) { return value == null ? null : string(value, "optional text"); }
function uuid(value, label) { const id = string(value, label); if (!UUID.test(id)) throw new Error(`Invalid ${label}`); return id; }
function iso(value, label) { const timestamp = string(value, label); if (!Number.isFinite(Date.parse(timestamp))) throw new Error(`Invalid ${label}`); return timestamp; }
function optionalIso(value) { return value == null ? null : iso(value, "featuredUntil"); }
function allowed(value, values, label) { const item = string(value, label); if (!values.has(item)) throw new Error(`Unsupported ${label}`); return item; }
function safeInteger(value) { const number = Number(value ?? 0); if (!Number.isInteger(number) || number < 0 || number > 3650) throw new Error("Invalid integer"); return number; }
function positiveInteger(value) { const number = Number(value); if (!Number.isInteger(number) || number < 1 || number > 16384) throw new Error("Invalid image dimension"); return number; }
