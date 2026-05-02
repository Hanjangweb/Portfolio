import Contact from "../models/Contact.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";

// Submit contact form
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  // Try sending email notification to admin
  try {
    const adminEmail = process.env.CONTACT_RECEIVER || 'admin@example.com';
    await sendEmail({
      email: adminEmail,
      subject: `New Contact Inquiry: ${subject}`,
      html: `
        <h2>New Contact Message from ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr />
        <p>This message was sent from your portfolio website.</p>
      `,
      message: `New Contact Message from ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
    });
  } catch (error) {
    console.error("Email notification failed:", error.message);
  }

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: contact,
  });
});

// Get all contacts (Admin)
export const getContacts = asyncHandler(async (req, res) => {
  const { read, replied } = req.query;
  const query = {};

  if (read !== undefined) {
    query.read = read === "true";
  }
  if (replied !== undefined) {
    query.replied = replied === "true";
  }

  const contacts = await Contact.find(query).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: contacts.length,
    data: contacts,
  });
});

// Get single contact (Admin)
export const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  // Mark as read
  if (!contact.read) {
    contact.read = true;
    await contact.save();
  }

  res.json({
    success: true,
    data: contact,
  });
});

// Update contact (Admin)
export const updateContact = asyncHandler(async (req, res) => {
  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Contact updated",
    data: contact,
  });
});

// Delete contact (Admin)
export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  res.json({
    success: true,
    message: "Contact deleted",
  });
});

// Reply to contact (Admin)
export const replyContact = asyncHandler(async (req, res) => {
  const { reply } = req.body;

  if (!reply) {
    return res.status(400).json({ message: "Please provide a reply" });
  }

  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  contact.reply = reply;
  contact.replied = true;
  await contact.save();

  res.json({
    success: true,
    message: "Reply sent",
    data: contact,
  });
});
