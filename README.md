# App Paiement de Facture - Campay

App (React + Express + MongoDB) pour initier un paiement via l'API Campay et stocker l'historique.

## Installation (local)
1. Cloner le repo
2. Backend:
   - `cd backend`
   - `npm install`
   - Copier `.env.example` en `.env` et remplir les valeurs (`CAMPAY_USERNAME`, `CAMPAY_PASSWORD`, `MONGO_URI` ou `MOCK=true` pour tester)
   - `npm start`
3. Frontend:
   - `cd frontend`
   - `npm install`
   - Copier `.env.example` en `.env.local` et adapter `REACT_APP_API_URL` si besoin
   - `npm start`

## Routes utiles
- `POST /api/pay` : initier paiement (body: `{ name, phone, amount }`)
- `GET  /api/payments` : récupérer historique

## Sécurité
Ne jamais committer `.env` contenant tes identifiants. Utilise `.env.example` comme modèle public.
