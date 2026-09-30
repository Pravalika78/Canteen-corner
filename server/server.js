require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");

const app = express();
app.use(express.json({ limit: "10gb" }));
app.use(express.urlencoded({ limit: "10gb", extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected (Atlas)"))
  .catch((err) => console.log("MongoDB error:", err));

const ItemSchema = new mongoose.Schema({
  product_title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  type: { type: String, required: true },
  image: { type: String },
});
const Item = mongoose.model("Item", ItemSchema);

const OrderItemSchema = new mongoose.Schema(
  {
    productId: String,
    product_title: String,
    price: Number,
    quantity: Number,
    image: String,
    type: String,
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    method: { type: String, required: true },
    placedAt: { type: String, default: () => new Date().toLocaleString() },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", OrderSchema);

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true },
);
const User = mongoose.model("User", UserSchema);

app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        product_title: req.body.product_title,
        price: req.body.price,
        quantity: req.body.quantity,
        image: req.body.image,
        type: req.body.type,
      },
      { new: true },
    );
    res.json(updatedItem);
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { userId, items, total, method } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = new Order({ userId, items, total, method });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { userId, password, confirmPassword, role } = req.body;

    if (!userId || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const finalRole = role === "admin" ? "admin" : "user";

    const existing = await User.findOne({ userId: userId.trim() });
    if (existing) {
      return res
        .status(400)
        .json({ error: "User ID / Gmail already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId: userId.trim(),
      password: hashedPassword,
      role: finalRole,
    });

    res.status(201).json({
      message: "Signup successful",
      user: { userId: user.userId, role: user.role },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed. Try again." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { userId, password, role, adminSecret } = req.body;

    if (!userId || !password) {
      return res
        .status(400)
        .json({ error: "User ID and Password are required" });
    }

    if (role === "admin" && adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: "Invalid admin secret code" });
    }

    const user = await User.findOne({ userId: userId.trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid User ID or password" });
    }

    if (role && user.role !== role) {
      return res
        .status(403)
        .json({ error: `This account is not registered as ${role}` });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid User ID or password" });
    }

    const token = jwt.sign(
      { id: user._id, userId: user.userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful",
      token,
      user: { userId: user.userId, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Try again." });
  }
});

const resend = new Resend(process.env.RESEND_API_KEY);

// Forgot password — generate token & send email
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findOne({ userId: userId.trim() });
    if (!user) {
      return res
        .status(404)
        .json({ error: "No account found with this User ID" });
    }

    const targetEmail = user.role === "admin" ? user.userId : email;

    if (!targetEmail) {
      return res.status(400).json({ error: "Email is required" });
    }

    const TWO_MINUTES = 2 * 60 * 1000;
    if (
      user.resetTokenExpiry &&
      user.resetTokenExpiry - Date.now() > 15 * 60 * 1000 - TWO_MINUTES
    ) {
      return res.status(429).json({
        error:
          "A reset link was already sent. Please check your inbox and spam folder.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${frontendUrl}/reset?token=${resetToken}&role=${user.role}`;

    res.json({
      message: `Reset link sent to ${targetEmail}. Check your inbox.`,
      email: targetEmail,
    });

    resend.emails
      .send({
        from: "Canteen Corner <onboarding@resend.dev>",
        to: targetEmail,
        subject: "Reset your Canteen Corner password",
        html: `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;"><h2 style="color: #e85d2f;">Canteen Corner</h2><p>You requested to reset the password for your account</p><p style="text-align: center; margin: 30px 0;"><a href="${resetLink}" style="background: #e85d2f; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a></p><p style="color: #666; font-size: 13px;">This link expires in <strong>15 minutes</strong>.</p><p style="color: #666; font-size: 13px;">If you didn't request this, you can ignore this email.</p><p style="color: #999; font-size: 12px;">Canteen Corner — Order. Collect. Enjoy</p></div>`,
      })
      .then((result) => {
        console.log("Resend response:", JSON.stringify(result));
      })
      .catch((err) => {
        console.error("Resend email error:", err);
      });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Could not send reset email. Try again." });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }
    if (!user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ error: "Reset link has expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password updated successfully. You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Could not reset password. Try again." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
