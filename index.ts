// Le 1 er code : Des API en utilisant des reqûets SQL

/*import express from 'express';
import mysql2 from 'mysql2/promise';

const app = express();

// Middleware pour parser le corps de la requête en JSON
app.use(express.json());

const connection = await mysql2.createConnection({
  host: 'lifesavermw.com',
  user: 'amine',
  password: 'amine123',
  database: 'amine',
  port: 3333
});

// Requête GET pour récupérer les utilisateurs
app.get('/', async (req, res) => {
    try {
        const [results, fields] = await connection.query('SELECT * FROM users;');
        res.json(results);  // Retourner les résultats de la requête en format JSON
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des utilisateurs' });
    }
});

// Requête POST pour insérer un utilisateur
app.post('/add', async (req, res) => {
    const { name, comment } = req.body;  // Extraire les données du corps de la requête

    try {
        const [results] = await connection.query(
            'INSERT INTO users (name, comment) VALUES (?, ?)',
            [name, comment]
        );
        res.status(201).json({ message: 'Utilisateur ajouté avec succès', id: results.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors de l\'ajout de l\'utilisateur' });
    }
});

// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});*/

// Le 2éme code : Des API en utilisant Prisma ( un model de l'ORM Prisma)

import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Middleware pour parser le corps de la requête en JSON
app.use(express.json());

// Route GET pour récupérer tous les utilisateurs
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { userposts: true },
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
    }
});

// Route POST pour ajouter un utilisateur
app.post('/users', async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const user = await prisma.user.create({
            data: { email, name, password },
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
    }
});

// Route GET pour récupérer tous les posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await prisma.posts.findMany({
            include: { user: true },
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des posts.' });
    }
});

// Route POST pour ajouter un post à un utilisateur
app.post('/posts', async (req, res) => {
    const { title, content, userId } = req.body;

    try {
        const post = await prisma.posts.create({
            data: { title, content, userId },
        });
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création du post.' });
    }
});

// **NOUVELLES ROUTES**

// Route PUT pour modifier une publication
app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const updatedPost = await prisma.posts.update({
            where: { id: parseInt(id) },
            data: { title, content },
        });
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la publication.' });
    }
});

// Route DELETE pour supprimer un utilisateur
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur.' });
    }
});

// Route DELETE pour supprimer une publication par l'utilisateur
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.posts.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Publication supprimée avec succès.' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la publication.' });
    }
});

// Route PUT pour changer une tâche d'un utilisateur à un autre
app.put('/posts/:id/transfer', async (req, res) => {
    const { id } = req.params;
    const { newUserId } = req.body;

    try {
        const updatedPost = await prisma.posts.update({
            where: { id: parseInt(id) },
            data: { userId: newUserId },
        });
        res.json({ message: 'Tâche transférée avec succès.', updatedPost });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors du transfert de la tâche.' });
    }
});

// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});
