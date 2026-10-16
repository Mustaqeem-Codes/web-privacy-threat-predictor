# API Contract (v0.1)

This file is the single source of truth for how the parts of the system talk to each other.
**Rule:** to change an endpoint or a JSON shape, update this file first (in a pull request) and tell the team.

Parts:
- **Extension / React frontend** call the **Express backend**.
- **Express backend** calls the **FastAPI ML service**.
- Only the backend talks to MongoDB and to the LLM API.

| Part | Local base URL |
|------|----------------|
| Express backend | `http://localhost:5000/api` |
| FastAPI ML service | `http://localhost:8000` |

---

## 0. Conventions

- All requests and responses are JSON (`Content-Type: application/json`).
- Protected backend endpoints need the header: `Authorization: Bearer <JWT>`.
- Times are ISO 8601 strings in UTC, for example `"2026-10-16T09:30:00Z"`.
- Names use `camelCase` in the backend API. Feature names use `snake_case` exactly as in the dataset.
- **Privacy rule:** we store only the site's **hostname** (for example `example.com`), never the full URL, query string, or page content.

### Verdict values

`"safe"`, `"suspicious"`, `"threat"` (always lowercase).

### Error format (every endpoint)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "features.canvas_toDataURL must be a number",
    "details": {}
  }
}
```

| HTTP status | `code` | When |
|-------------|--------|------|
| 400 | `VALIDATION_ERROR` | Missing or wrong fields |
| 401 | `UNAUTHORIZED` | Missing, invalid, or expired token |
| 403 | `FORBIDDEN` | Resource belongs to another user |
| 404 | `NOT_FOUND` | Scan or user does not exist |
| 409 | `EMAIL_TAKEN` | Register with an email that exists |
| 429 | `RATE_LIMITED` | Too many requests |
| 502 | `ML_SERVICE_ERROR` | Backend could not get an answer from the ML service |
| 500 | `INTERNAL_ERROR` | Anything unexpected |

---

## 1. The 60 features

Used by `POST /predict` (ML service) and `POST /scan` (backend). They are sent as an **object with names**, not as a list, so the order in the request does not matter. The ML service puts them in the right order using `feature_columns.json`, which is saved together with the model.

All values are numbers. `first_api_ms` may be `null` (the page never called a sensitive API). All other features must be numbers (use `0` when nothing was counted). **No other keys are allowed** and **no key may be missing**.

**Hook counts (33):**
`canvas_toDataURL`, `canvas_toBlob`, `canvas_getImageData`, `canvas_text_draw`, `canvas_measureText`, `canvas_text_before_read`, `webgl_getParameter`, `webgl_getExtension`, `webgl_readPixels`, `webgl_debug_renderer`, `audio_oscillator`, `audio_analyser`, `audio_offline`, `nav_hardwareConcurrency`, `nav_deviceMemory`, `nav_plugins`, `nav_languages`, `screen_reads`, `geo_calls`, `notif_requests`, `media_requests`, `ls_get`, `ls_set`, `ss_get`, `ss_set`, `cookie_writes`, `cookie_reads`, `idb_open`, `beacon_calls`, `beacon_bytes`, `fetch_calls`, `xhr_calls`, `first_api_ms`

**Flag (1):** `has_api_calls` (0 or 1)

**Third-party frame counts (8):**
`tp_canvas_reads`, `tp_canvas_text`, `tp_measureText`, `tp_webgl_debug`, `tp_audio`, `tp_beacon_calls`, `tp_storage_ops`, `tp_geo_calls`

**Frames (2):** `frames_n`, `frames_third`

**Page structure (6):**
`page_n_scripts`, `page_n_inline`, `page_inline_chars`, `page_n_iframes`, `page_n_links`, `page_inline_ratio`

**Network (10):**
`net_req_total`, `net_req_third`, `net_post_third`, `net_post_bytes_third`, `net_pixel_req`, `net_script_req`, `net_script_req_third`, `net_img_req_third`, `net_unique_third`, `net_third_ratio`

> The extension MUST produce exactly these 60 names with the same meaning as the crawler. If a feature is added or removed, bump `modelVersion` and update this file.

### Example `features` object (shortened here, real requests contain all 60)

```json
{
  "canvas_toDataURL": 2,
  "canvas_getImageData": 1,
  "webgl_debug_renderer": 1,
  "beacon_calls": 4,
  "first_api_ms": 812,
  "has_api_calls": 1,
  "tp_canvas_reads": 2,
  "net_req_total": 143,
  "net_req_third": 97,
  "net_unique_third": 23,
  "net_third_ratio": 0.68
}
```

---

## 2. ML service (FastAPI), called only by the backend

### GET `/health`

Response `200`:

```json
{ "status": "ok", "modelVersion": "rf-2026-10-v1", "nFeatures": 60 }
```

### POST `/predict`

Request:

```json
{
  "features": { "canvas_toDataURL": 2, "...": "all 60 features" }
}
```

Response `200`:

```json
{
  "verdict": "threat",
  "probability": 0.91,
  "uncertain": false,
  "reasons": [
    { "feature": "net_unique_third", "value": 23, "impact": 0.34, "direction": "increases_risk" },
    { "feature": "tp_canvas_reads",  "value": 2,  "impact": 0.21, "direction": "increases_risk" },
    { "feature": "beacon_calls",     "value": 4,  "impact": 0.12, "direction": "increases_risk" },
    { "feature": "cookie_reads",     "value": 0,  "impact": -0.05, "direction": "decreases_risk" },
    { "feature": "geo_calls",        "value": 0,  "impact": -0.02, "direction": "decreases_risk" }
  ],
  "modelVersion": "rf-2026-10-v1"
}
```

Field meanings:

| Field | Meaning |
|-------|---------|
| `verdict` | `safe`, `suspicious`, or `threat` |
| `probability` | Model's calibrated probability that the site is a **threat** (0 to 1) |
| `uncertain` | `true` when the probability is too close to a threshold. The UI then shows "I'm not sure" |
| `reasons` | Top 5 SHAP values for this site, sorted by absolute `impact` |
| `impact` | SHAP value. Positive pushes toward threat, negative toward safe |
| `modelVersion` | Which saved model produced the answer |

How `verdict` is chosen (thresholds are decided in Phase 2 and written here once final):

```
probability < T_low            -> safe
T_low <= probability < T_high  -> suspicious
probability >= T_high          -> threat
(T_low and T_high are TBD)
```

Errors: `422` if a feature is missing, unknown, or not a number (FastAPI default shape is wrapped into the error format above).

---

## 3. Backend (Express), called by the extension and the React dashboard

### 3.1 Auth

#### POST `/auth/register`

Request:

```json
{ "email": "student@example.com", "password": "at-least-8-chars", "name": "Sara" }
```

Response `201`:

```json
{
  "token": "<JWT>",
  "user": { "id": "665f...", "email": "student@example.com", "name": "Sara" }
}
```

Errors: `400 VALIDATION_ERROR`, `409 EMAIL_TAKEN`.

#### POST `/auth/login`

Request:

```json
{ "email": "student@example.com", "password": "at-least-8-chars" }
```

Response `200`: same shape as register.
Errors: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED` (wrong email or password).

### 3.2 Scan (protected)

#### POST `/scan`

The extension sends the 60 features it measured. The backend validates them, calls the ML service, saves the scan, and returns the result.

Request:

```json
{
  "domain": "example.com",
  "source": "extension",
  "features": { "canvas_toDataURL": 2, "...": "all 60 features" }
}
```

Response `201`:

```json
{
  "scanId": "6660a1...",
  "domain": "example.com",
  "verdict": "threat",
  "probability": 0.91,
  "uncertain": false,
  "reasons": [
    { "feature": "net_unique_third", "value": 23, "impact": 0.34, "direction": "increases_risk" }
  ],
  "modelVersion": "rf-2026-10-v1",
  "createdAt": "2026-10-16T09:30:00Z"
}
```

Errors: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `429 RATE_LIMITED`, `502 ML_SERVICE_ERROR`.

### 3.3 History (protected)

#### GET `/history?page=1&limit=20&verdict=threat`

`page` (default 1), `limit` (default 20, max 100), and `verdict` are optional. Returns only the logged-in user's scans, newest first.

Response `200`:

```json
{
  "items": [
    {
      "scanId": "6660a1...",
      "domain": "example.com",
      "verdict": "threat",
      "probability": 0.91,
      "uncertain": false,
      "createdAt": "2026-10-16T09:30:00Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 57
}
```

#### GET `/history/:scanId`

Response `200`: the full scan, same shape as the `POST /scan` response plus the saved `features` object and `feedback` (or `null`):

```json
{
  "scanId": "6660a1...",
  "domain": "example.com",
  "verdict": "threat",
  "probability": 0.91,
  "uncertain": false,
  "reasons": [],
  "features": {},
  "modelVersion": "rf-2026-10-v1",
  "createdAt": "2026-10-16T09:30:00Z",
  "feedback": { "correct": false, "suggestedVerdict": "suspicious", "comment": "I trust this site" }
}
```

Errors: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 NOT_FOUND`.

### 3.4 Feedback (protected)

#### POST `/feedback`

The user answers "Was this right?". Saved for future retraining. One feedback per scan per user (sending again replaces the old one).

Request:

```json
{
  "scanId": "6660a1...",
  "correct": false,
  "suggestedVerdict": "suspicious",
  "comment": "I trust this site"
}
```

`suggestedVerdict` and `comment` are optional. `comment` max 500 characters.

Response `201`:

```json
{ "feedbackId": "6661b2...", "scanId": "6660a1...", "createdAt": "2026-10-16T09:35:00Z" }
```

Errors: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 NOT_FOUND`.

### 3.5 AI explanation (protected)

The LLM only rewrites the model's reasons in plain English. It never changes the verdict, probability, or reasons. The response always includes the confidence next to the text.

#### POST `/explain`

Request:

```json
{ "scanId": "6660a1..." }
```

Response `200`:

```json
{
  "scanId": "6660a1...",
  "verdict": "threat",
  "probability": 0.91,
  "uncertain": false,
  "explanation": "This site contacts many third-party trackers and reads your browser's canvas, which is a common way to identify a device.",
  "cached": true,
  "createdAt": "2026-10-16T09:31:00Z"
}
```

`cached` is `true` when the text came from the `explanations` collection instead of a new LLM call.
Errors: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `429 RATE_LIMITED`, `502 LLM_ERROR`.

#### POST `/explain/chat` (draft, Phase 6)

Follow-up questions about one scan. Shape may change when we reach Phase 6.

Request: `{ "scanId": "6660a1...", "message": "What is canvas fingerprinting?" }`
Response: `{ "reply": "..." }`

### 3.6 Health

#### GET `/health`

Response `200`: `{ "status": "ok" }`

---

## 4. MongoDB collections (for reference)

| Collection | Main fields |
|------------|-------------|
| `users` | `email` (unique), `passwordHash`, `name`, `createdAt` |
| `scans` | `userId`, `domain`, `features`, `verdict`, `probability`, `uncertain`, `reasons`, `modelVersion`, `source`, `createdAt` |
| `feedback` | `scanId`, `userId`, `correct`, `suggestedVerdict`, `comment`, `createdAt` |
| `explanations` | `scanId`, `text`, `model`, `createdAt` |

---

## 5. Mock data for parallel work

Until the real parts exist, everyone uses the example JSON in this file as fake data:
- The **frontend** person builds pages from the `POST /scan`, `GET /history`, and `POST /explain` examples.
- The **backend** person fakes the ML service with the `POST /predict` example.
- The **ML service** person tests with a request that has all 60 features.

## 6. Change log

| Date | Version | Change | Who |
|------|---------|--------|-----|
| 2026-10-16 | 0.1 | First draft | team |