const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes');
const leadRoutes = require('./routes/leadRoutes');
const outputRoutes = require('./routes/outputRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/output', outputRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    features: {
      aiChat: true,
      leadManagement: true,
      mongodbIntegration: true,
      openaiIntegration: true
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🤖 AI Chat system active`);
  console.log(`📊 Lead management ready`);
  console.log(`🌐 Dashboard available at http://localhost:${PORT}/leads.html`);
});