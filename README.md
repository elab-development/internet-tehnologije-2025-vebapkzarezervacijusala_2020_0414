# ConferenceBook

ConferenceBook je web aplikacija za upravljanje rezervacijama
konferencijskih sala. Omogućava korisnicima pregled dostupnih zgrada i
sala, filtriranje po kapacitetu i tipu sale, kao i kreiranje, izmenu i
brisanje rezervacija u okviru radnog vremena sale.

Administratori imaju pristup dodatnim funkcionalnostima kao što su
upravljanje zgradama, tipovima sala, samim salama, kao i analitički
pregled (statistika rezervacija, KPI pokazatelji i grafikoni).

---

## Tehnologije

### Backend

- Node.js (Express 5)
- Prisma ORM
- MySQL 8
- JWT autentifikacija (httpOnly cookie)
- Swagger (OpenAPI dokumentacija)
- Docker

### Frontend

- React (Vite)
- Zustand (state management)
- Tailwind CSS
- Vitest + Testing Library
- Docker

### CI/CD

- GitHub Actions (testiranje i Docker build)

---

## Lokalno pokretanje (bez Docker-a)

### 1. Kloniranje projekta

```bash
git clone <repository-url>
cd conference-book
```

### 2. Backend (server)

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

Server će biti dostupan na:\
http://localhost:5000

Swagger dokumentacija:\
http://localhost:5000/docs

### 3. Frontend (client)

```bash
cd client
npm install
npm run dev
```

Frontend će biti dostupan na:\
http://localhost:5173

---

## Pokretanje pomoću Docker-a i docker-compose-a

### 1. Build i pokretanje svih servisa

Iz root direktorijuma projekta:

```bash
docker compose up --build
```

Za pokretanje u pozadini:

```bash
docker compose up --build -d
```

### 2. Servisi koji se pokreću

- **db** -- MySQL baza (port 3306)
- **server** -- Backend API (port 5000)
- **client** -- React frontend (port 5173)

Frontend:\
http://localhost:5173

Backend API:\
http://localhost:5000

Swagger dokumentacija:\
http://localhost:5000/docs

### 3. Gašenje servisa

```bash
docker compose down
```

Za brisanje i volumena (reset baze):

```bash
docker compose down -v
```

---

## Testiranje

Frontend testovi se pokreću komandom:

```bash
cd client
npm run test
```

U CI/CD pipeline-u testovi se izvršavaju automatski na svaki push i pull
request pre nego što se izgradi Docker image.
