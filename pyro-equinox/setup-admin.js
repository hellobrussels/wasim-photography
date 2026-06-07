#!/usr/bin/env node
/**
 * Script pour créer un utilisateur admin Supabase
 * Usage: node setup-admin.js
 * 
 * Définis ces variables d'environnement avant de lancer:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - ADMIN_EMAIL (optionnel, par défaut: admin@lumiere.studio)
 * - ADMIN_PASSWORD (optionnel, par défaut: généré aléatoirement)
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL || 'admin@lumiere.studio';
const adminPassword = process.env.ADMIN_PASSWORD || generatePassword();

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY manquent dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function generatePassword() {
  return Math.random().toString(36).slice(-12);
}

async function createAdmin() {
  console.log('🔐 Création du compte admin...\n');

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.warn(`⚠️  L'utilisateur ${adminEmail} existe déjà`);
        return;
      }
      throw error;
    }

    console.log('✅ Admin créé avec succès!\n');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Mot de passe:', adminPassword);
    console.log('\n💡 URL de connexion: http://localhost:5173/admin/login');
    console.log('\n⚠️  Sauvegarde ces informations en sécurité!');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

createAdmin();
