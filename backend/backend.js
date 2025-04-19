const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const portfinder = require('portfinder');

const app = express();

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/portfolioDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Contact Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    submittedAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// Handle Contact Form Submission
app.post('/submit-form', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        console.log('New Contact Submission:', { name, email, message });
        res.json({ message: 'Message submitted successfully!' });
    } catch (error) {
        console.error('Error in /submit-form:', error);
        res.status(500).json({ message: 'Error submitting message. Please try again.' });
    }
});

// Route to get all submissions (for admin dashboard)
app.get('/admin/submissions', async (req, res) => {
    try {
        const submissions = await Contact.find();
        res.json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Error fetching submissions' });
    }
});

// Find a free port and start the server
portfinder.getPort((err, port) => {
    if (err) {
        console.error('Error finding a free port:', err);
        return;
    }
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});