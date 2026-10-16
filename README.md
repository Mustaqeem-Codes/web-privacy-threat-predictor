# Web Privacy Threat Predictor

Real-Time Web Data Exfiltration & Privacy Threat Predictor.

A Chrome extension (Manifest V3) and a web platform that watch what a website does in the browser (canvas / WebGL / audio fingerprinting, geolocation, storage use, beacons, third-party network traffic) and predict whether the site is harvesting user data.

Each scan shows one of three alert levels: **safe**, **suspicious**, or **threat**, together with the model's confidence, the top reasons (SHAP), and a plain-language explanation written by an AI assistant.

> The AI assistant only rewrites the model's reasons in plain English. It never decides or changes the verdict.

This is one semester project covering three courses:

| Course | Focus |
|--------|-------|
| Data Science | Data collection, cleaning, EDA, preprocessing |
| Machine Learning | Classical ML (Random Forest, XGBoost, logistic regression), evaluation, SHAP |
| HCI | Dashboard and extension design, accessibility, usability study |

---

## Architecture

```
Chrome extension -> Express API (Node) -> Python ML service (FastAPI) -> verdict + probability + SHAP reasons
                         |                                                  |
                      MongoDB                                  LLM writes a plain-language explanation
                         |
                   React dashboard
```

## Tech stack

- **Frontend:** React
- **Backend:** Node.js + Express.js (JWT auth, REST API)
- **Database:** MongoDB (Atlas for deployment)
- **ML:** Python (pandas, scikit-learn, xgboost, shap, joblib)
- **ML service:** FastAPI (Express calls it over HTTP)
- **Extension:** Chrome Manifest V3
- **AI explanation:** Google Gemini (or another LLM API)

## Repository structure

```
web-privacy-threat-predictor/
├── ml/            # notebooks, training code, saved model + feature list
├── ml-service/    # FastAPI microservice that serves the model
├── backend/       # Express API (auth, scan, history, feedback, explain)
├── frontend/      # React dashboard
├── extension/     # Chrome extension (Manifest V3)
├── crawler/       # Playwright crawler used to build the dataset
├── data/          # datasets (dataset.csv, features_final.csv)
└── docs/          # API contract, reports, wireframes, usability study
```

## Prerequisites

- Git
- Node.js 18 or newer
- Python 3.10 or newer
- A MongoDB Atlas account (or a local MongoDB)
- VS Code (recommended) with the Python and Jupyter extensions
- Google Chrome (for the extension)

## Getting started (Windows PowerShell)

### 1. Clone the repo

```powershell
git clone https://github.com/Mustaqeem-Codes/web-privacy-threat-predictor
cd web-privacy-threat-predictor
```

### 2. Environment variables

Never commit `.env` files. Copy each example file and fill in your own values.

```powershell
copy backend\.env.example backend\.env
copy ml-service\.env.example ml-service\.env
copy frontend\.env.example frontend\.env
```

Keys we will use (details added as each part is built):

| File | Variable | Purpose |
|------|----------|---------|
| `backend/.env` | `MONGODB_URI` | MongoDB connection string |
| `backend/.env` | `JWT_SECRET` | Secret for signing login tokens |
| `backend/.env` | `GEMINI_API_KEY` | AI explanation API key |
| `backend/.env` | `ML_SERVICE_URL` | Address of the FastAPI service |
| `frontend/.env` | `VITE_API_URL` | Address of the Express API |

### 3. ML / data science (`ml/`)

```powershell
cd ml
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Open the notebooks in VS Code and select the `venv` interpreter as the kernel.

### 4. ML service (`ml-service/`)

```powershell
cd ml-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 5. Backend (`backend/`)

```powershell
cd backend
npm install
npm run dev
```

### 6. Frontend (`frontend/`)

```powershell
cd frontend
npm install
npm run dev
```

### 7. Extension (`extension/`)

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select the `extension/` folder.

### 8. Crawler (`crawler/`)

```powershell
cd crawler
npm install
npx playwright install chromium
node crawler.js
```

> Ports above are defaults and may change. The README is updated as each phase is completed.

## Team workflow

- `main` is protected. Nobody pushes to it directly.
- Create a feature branch for every task: `feature/<short-name>`, for example `feature/scan-endpoint`.
- Open a pull request into `main`. At least one teammate reviews it before merging.
- Write clear commit messages, for example `feat(backend): add POST /scan endpoint`.
- Never commit secrets, `venv/`, or `node_modules/`.

## API contract

All endpoints and JSON shapes are written down in [`docs/api-contract.md`](docs/api-contract.md) before coding starts. If you need to change an endpoint, update that file first and tell the team.

## Known limitations

- The dataset is small (a few hundred rows), so results are a proof of concept.
- Labels come from public tracker-domain lists (Disconnect), not from observed behavior.
- The crawler visits homepages only, with no clicks, in a headless browser, and does not accept consent banners.
- The model must see the same 60 features in the same order from both the crawler and the extension.

## Team

| Name | Role |
|------|------|
| (add name) | (add role) |
| (add name) | (add role) |
| (add name) | (add role) |

## License

For academic use only.