const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  title: String,
  description: String,
  userEmail: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.String,
    ref: 'Employee',
    required: true
  }
});

module.exports = mongoose.model('Ticket', TicketSchema);
