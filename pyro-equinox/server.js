import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3001;

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
  origin: process.env.VITE_FRONTEND_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

// Verify connection on startup
transporter.verify()
    .then(() => console.log('✅ Gmail SMTP connecté'))
    .catch((err) => console.error('❌ Erreur SMTP:', err.message));

// POST /api/contact
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    const mailOptions = {
        from: `"${name}" <${process.env.GMAIL_USER}>`,
        replyTo: email,
        to: process.env.CONTACT_RECEIVER_EMAIL || process.env.GMAIL_USER,
        subject: `[LUMIÈRE] Nouveau message de ${name}`,
        html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 8px;">
          Nouveau message de contact
        </h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-wrap; background: #f9f9f9; padding: 16px; border-radius: 4px;">${message}</p>
        <p style="font-size: 12px; color: #999; margin-top: 24px;">
          Envoyé depuis le formulaire de contact — lumiere.studio
        </p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur envoi email:', error);
        res.status(500).json({ error: 'Échec de l\'envoi. Réessayez plus tard.' });
    }
});

// Supabase media endpoints
app.get('/api/media', async (req, res) => {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur chargement médias:', error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post('/api/media', async (req, res) => {
  const mediaData = req.body;
  const { data, error } = await supabase
    .from('media')
    .insert([mediaData])
    .select();

  if (error) {
    console.error('Erreur création média:', error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data?.[0] ?? null);
});

app.put('/api/media/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase
    .from('media')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Erreur mise à jour média:', error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data?.[0] ?? null);
});

app.delete('/api/media/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erreur suppression média:', error);
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
});

app.post('/api/media/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Fichier manquant.' });
  }

  const fileExt = req.file.originalname.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(fileName, req.file.buffer, {
      contentType: req.file.mimetype,
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Erreur upload fichier:', uploadError);
    return res.status(500).json({ error: uploadError.message });
  }

  const { data } = supabase.storage.from('media').getPublicUrl(fileName);
  res.json({ publicUrl: data.publicUrl });
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
