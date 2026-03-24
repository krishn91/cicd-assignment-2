const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// In-memory data store
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Express CI/CD API',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            health: '/api/health',
        },
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    res.json({
        success: true,
        count: users.length,
        data: users,
    });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
    const user = users.find((u) => u.id === parseInt(req.params.id));

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found',
        });
    }

    res.json({
        success: true,
        data: user,
    });
});

// Create new user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            error: 'Name and email are required',
        });
    }

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        name,
        email,
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        data: newUser,
    });
});

// Update user
app.put('/api/users/:id', (req, res) => {
    const user = users.find((u) => u.id === parseInt(req.params.id));

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found',
        });
    }

    const { name, email } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;

    res.json({
        success: true,
        data: user,
    });
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
    const index = users.findIndex((u) => u.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'User not found',
        });
    }

    users.splice(index, 1);

    res.json({
        success: true,
        message: 'User deleted successfully',
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

// Error handler
app.use((err, res) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
    });
});

module.exports = app;