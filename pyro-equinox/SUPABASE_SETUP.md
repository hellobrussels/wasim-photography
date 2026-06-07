# Configuration Supabase

## Tables créées

### `media`
Table pour stocker les médias (photos, vidéos, etc.)

**Colonnes:**
- `id` (UUID) - Clé primaire
- `title` (text) - Titre du média
- `description` (text) - Description optionnelle
- `url` (text) - URL du fichier (stockage Supabase ou externe)
- `type` (text) - 'photo' ou 'video'
- `category` (text) - 'photo', 'video' ou 'script'
- `section` (text) - 'portfolio', 'hero' ou 'home'
- `created_at` (timestamp) - Date de création
- `updated_at` (timestamp) - Date de dernière modification

### `storage.buckets.media`
Bucket de stockage pour les fichiers médias (images, vidéos)

## Installation

### Option 1: Via Supabase Dashboard (plus simple)

1. Va sur https://app.supabase.com et ouvre ton projet
2. Clique sur **SQL Editor** dans le menu de gauche
3. Crée une nouvelle requête
4. Copie-colle le contenu de `supabase/migrations/001_init_tables.sql`
5. Clique sur **Run**

### Option 2: Via Supabase CLI (recommandé pour la prod)

```bash
# Installe Supabase CLI si ce n'est pas fait
npm install -g supabase

# Initialise ou mets à jour les migrations
supabase db push
```

## Variables d'environnement requises

Ajoute ces variables à `.env`:

```env
# Dans .env pour le backend
SUPABASE_URL=https://jljsbkiydvyhrplkrthh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<ta_clé_service_role_key>

# Dans .env.local (Vite frontend)
VITE_SUPABASE_URL=https://jljsbkiydvyhrplkrthh.supabase.co
VITE_SUPABASE_ANON_KEY=<ta_clé_anon_publique>
```

### Où trouver les clés Supabase?

1. Va sur https://app.supabase.com
2. Ouvre ton projet
3. Clique sur **Settings** > **API**
4. Copie:
   - `Project URL` → `SUPABASE_URL`
   - `anon public key` → `VITE_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ garde secret!)

## Test des tables

Une fois créées, tu peux tester:

```bash
# Démarre le backend
npm run server

# Dans un autre terminal, démarre le frontend
npm run dev
```

Accède à http://localhost:5173/admin pour tester la création de médias!
