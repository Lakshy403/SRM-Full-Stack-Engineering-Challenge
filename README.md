# SRM Full Stack Engineering Challenge Solution

This repository contains a complete full-stack solution for the SRM Full Stack Engineering Challenge.

## Folder Structure

```text
.
├── backend
│   ├── package.json
│   ├── .env.example
│   ├── src
│   │   ├── config
│   │   │   └── identity.js
│   │   ├── routes
│   │   │   └── bfhl.js
│   │   ├── services
│   │   │   └── hierarchyAnalyzer.js
│   │   ├── utils
│   │   │   └── treeBuilder.js
│   │   └── server.js
│   └── tests
│       └── runExamples.js
├── frontend
│   ├── package.json
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── src
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       └── components
│           └── TreeNode.jsx
└── README.md
```

## Features

- `POST /bfhl` REST API built with Node.js and Express
- CORS enabled for frontend integration
- Validation for malformed entries, self-loops, duplicates, and multi-parent cases
- Cycle detection using DFS
- Multiple tree support with root detection
- Tree depth calculation
- React frontend with:
  - textarea input
  - loading state
  - API error handling
  - nested tree display
  - summary cards

## Backend API

### Endpoint

`POST /bfhl`

### Request Body

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

### Response Shape

```json
{
  "is_success": true,
  "user_id": "your_full_name_01012000",
  "email_id": "yourname@srmist.edu.in",
  "college_roll_number": "RA0000000000000",
  "hierarchies": [
    {
      "has_cycle": false,
      "root": "A",
      "depth": 3,
      "node_count": 4,
      "tree": {
        "name": "A",
        "children": [
          {
            "name": "B",
            "children": [
              {
                "name": "D",
                "children": []
              }
            ]
          },
          {
            "name": "C",
            "children": []
          }
        ]
      }
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

## Logic Covered

### Validation

The backend marks an entry as invalid if it:

- does not match `X->Y`
- uses lowercase letters or numbers
- contains multiple characters in a node
- uses the wrong separator
- has missing nodes
- is empty
- is a self-loop like `A->A`

### Duplicate Handling

- The first valid occurrence is kept
- Repeated duplicates are stored once in `duplicate_edges`

### Multi-parent Handling

- If a child appears with multiple parents, the first valid parent is used
- Later parent assignments are ignored

### Cycle Handling

- DFS is used for cycle detection
- If a connected component contains a cycle:
  - `has_cycle` is `true`
  - `tree` is returned as `{}`
  - `depth` is omitted for that component

## Local Setup

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Update `.env` with your own:

- `FULL_NAME`
- `DOB_DDMMYYYY`
- `COLLEGE_EMAIL`
- `COLLEGE_ROLL_NUMBER`
- `FRONTEND_URL`

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` inside `frontend/.env`, for example:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Example Test Cases

### Case 1: Simple tree

Input:

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

Expected highlights:

- 1 tree
- root `A`
- depth `3`
- no invalid entries

### Case 2: Duplicate and invalid data

Input:

```json
{
  "data": ["A->B", "A->B", "bad", "A=>C", "A->A"]
}
```

Expected highlights:

- duplicate: `A->B`
- invalid: `bad`, `A=>C`, `A->A`

### Case 3: Cycle

Input:

```json
{
  "data": ["A->B", "B->C", "C->A", "D->E"]
}
```

Expected highlights:

- 1 cyclic component
- 1 valid tree rooted at `D`

### Run bundled examples

```bash
cd backend
npm install
npm run examples
```

## Deployment Instructions

### Option 1: Backend on Render, Frontend on Netlify

#### Backend on Render

1. Push the repository to GitHub.
2. Create a new Web Service on Render.
3. Set the root directory to `backend`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from `backend/.env.example`.

#### Frontend on Netlify

1. Create a new site from GitHub.
2. Set the base directory to `frontend`.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add `VITE_API_BASE_URL` pointing to your deployed backend URL.

### Option 2: Both services on Vercel

- Deploy `frontend` as a Vite project.
- Deploy `backend` as a separate Node project.
- Add the deployed backend URL to `frontend/.env`.

## Notes Before Submission

- Replace placeholder identity values in `backend/.env`
- Push this project to a public GitHub repository
- Add your deployed frontend and backend URLs to the submission form
