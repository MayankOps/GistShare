import express from 'express';
import Paste from '../models/Paste.js';
import { nanoid } from 'nanoid';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { message: null });
});

router.post('/new', async (req, res) => {
  const { content, expire } = req.body;
  if (!content.trim()) return res.render('index', { message: "Paste cannot be empty." });

  const pasteId = nanoid(8);
  let expiresAt = null;
  if (expire) {
    const minutes = parseInt(expire);
    expiresAt = new Date(Date.now() + minutes * 60000);
  }

  const paste = new Paste({ pasteId, content, expiresAt });
  await paste.save();
  res.redirect(`/paste/${pasteId}`);
});

router.get('/paste/:id', async (req, res) => {
  const paste = await Paste.findOne({ pasteId: req.params.id });
  if (!paste || (paste.expiresAt && new Date() > paste.expiresAt)) {
    return res.status(404).send("Paste not found or expired.");
  }
  res.render('paste', { paste });
});

router.post('/delete/:id', async (req, res) => {
  await Paste.deleteOne({ pasteId: req.params.id });
  res.redirect('/');
});

export default router;
