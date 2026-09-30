import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./Header";

const PasswordField = ({
  placeholder,
  value,
  onChange,
  required,
  showPassword,
  toggleShowPassword,
}) => (
  <div style={{ position: "relative", width: "100%" }}>
    <input
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      style={{
        width: "100%",
        padding: "10px 40px 10px 10px",
        boxSizing: "border-box",
        border: "1px solid #e5d8c8",
        borderRadius: "10px",
        fontSize: "14px",
        background: "#fff",
      }}
    />
    {value && value.length > 0 && (
      <span
        onClick={toggleShowPassword}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          color: "#666",
          userSelect: "none",
        }}
        title={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
          </svg>
        )}
      </span>
    )}
  </div>
);

function App() {
  const [role, setRole] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [checkoutStage, setCheckoutStage] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [forgotUserId, setForgotUserId] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [adminForgotLoading, setAdminForgotLoading] = useState(false);
  const [forgotSuccessEmail, setForgotSuccessEmail] = useState("");
  const [forgotRole, setForgotRole] = useState("user");
  const [resetToken, setResetToken] = useState("");
  const [resetRole, setResetRole] = useState("user");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [showMyOrders, setShowMyOrders] = useState(false);

  const [adminUserId, setAdminUserId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showAdminSecret, setShowAdminSecret] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showAdminSignupPassword, setShowAdminSignupPassword] = useState(false);

  const [signupUserId, setSignupUserId] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  const [adminSignupId, setAdminSignupId] = useState("");
  const [adminSignupPassword, setAdminSignupPassword] = useState("");
  const [adminSignupConfirm, setAdminSignupConfirm] = useState("");
  const [forgotAdminUserId, setForgotAdminUserId] = useState("");
  const [adminView, setAdminView] = useState("home");
  const [selectedAdminCategory, setSelectedAdminCategory] = useState(null);

  const [editingItemId, setEditingItemId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editImage, setEditImage] = useState("");

  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("BREAKFAST");
  const [image, setImage] = useState("");

  const categories = [
    "BREAKFAST",
    "SMOOTHIES & SHAKES",
    "PUFFS & BURGERS",
    "LUNCH",
    "CHOCOLATES",
    "PASTRIES & CAKES",
    "FRANKIES",
    "TEA & SNACKS",
    "COLD DRINKS",
    "BISCUITS",
    "CHINESE FAST FOOD",
    "FRUIT BOWL",
  ];

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const API = `${API_BASE}/api/items`;

  const fetchItems = () => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };
  const fetchUserOrders = async () => {
    try {
      const uid = userId || loggedInUser?.userId;
      if (!uid) return;
      const res = await fetch(`${API_BASE}/api/orders/user/${uid}`);
      const data = await res.json();
      setUserOrders(data);
    } catch (err) {
      console.error("Failed to load your orders:", err);
    }
  };
  const deleteOrder = async (id) => {
    if (!window.confirm("Remove this order after handing over?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/orders/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
      } else {
        alert("Failed to delete order");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchItems();
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlRole = params.get("role");
    if (urlToken && window.location.pathname === "/reset") {
      setResetToken(urlToken);
      setResetRole(urlRole === "admin" ? "admin" : "user");
      setRole(urlRole === "admin" ? "admin-reset-password" : "reset-password");
      return;
    }

    const savedToken = localStorage.getItem("token");
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setLoggedInUser(savedUser);
      setUserId(savedUser.userId);
      if (savedUser.role === "admin") {
        setRole("admin-dash");
      } else {
        setRole("user-menu");
      }
    }
  }, []);

  const handleUserLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password, role: "user" }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Invalid User ID or password");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setLoggedInUser(data.user);
      setRole("user-menu");
      setSelectedCategory(null);
    } catch (err) {
      console.error(err);
      alert("Could not connect to server");
    }
  };

  const handleUserSignup = async (e) => {
    e.preventDefault();
    const userId = signupUserId.trim();
    const password = signupPassword;
    const confirmPassword = signupConfirm;

    if (!userId || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
      }
      alert("Signup successful! Please login now.");
      setSignupUserId("");
      setSignupPassword("");
      setSignupConfirm("");
      setRole("user-login");
    } catch (err) {
      console.error(err);
      alert("Could not connect to server");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (forgotLoading) return;
    if (!forgotUserId.trim() || !forgotEmail.trim()) {
      alert("Please enter both User ID and Email");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: forgotUserId.trim(),
          email: forgotEmail.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Could not send reset link");
        return;
      }
      setForgotSuccessEmail(data.email || forgotEmail.trim());
      setForgotUserId("");
      setForgotEmail("");
      setForgotRole("user");
      setRole("forgot-success");
    } catch (err) {
      console.error(err);
      alert("Could not connect to server");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleAdminSignup = async (e) => {
    e.preventDefault();
    const adminId = adminSignupId.trim();
    const password = adminSignupPassword;
    const confirmPassword = adminSignupConfirm;

    if (!adminId || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: adminId,
          password,
          confirmPassword,
          role: "admin",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Admin signup failed");
        return;
      }
      alert("Admin signup successful! Please login now.");
      setAdminSignupId("");
      setAdminSignupPassword("");
      setAdminSignupConfirm("");
      setRole("admin-login");
    } catch (err) {
      console.error(err);
      alert("Could not connect to server");
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!adminSecret) {
      alert("Please enter the admin secret code");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: adminUserId,
          password: adminPassword,
          role: "admin",
          adminSecret,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Invalid credentials");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setLoggedInUser(data.user);
      setRole("admin-dash");
      setAdminView("home");
    } catch (err) {
      console.error(err);
      alert("Could not connect to server");
    }
  };

  const handleAdminForgotPassword = async (e) => {
    e.preventDefault();
    if (adminForgotLoading) return;
    if (!forgotAdminUserId.trim()) {
      alert("Please enter your Gmail ID");
      return;
    }
    setAdminForgotLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: forgotAdminUserId.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Could not send reset link");
        return;
      }
      setForgotSuccessEmail(data.email || forgotAdminUserId.trim());
      setForgotAdminUserId("");
      setRole("admin-forgot-success");
    } catch (err) {
      console.error(err);
      alert("Could not connect to server");
    } finally {
      setAdminForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmNewPassword) {
      alert("Please fill all fields");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken,
          newPassword,
          confirmPassword: confirmNewPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Could not reset password");
        return;
      }
      alert(
        "Password updated successfully! Please login with your new password.",
      );
      setResetToken("");
      setNewPassword("");
      setConfirmNewPassword("");
      window.history.replaceState({}, "", "/");
      setRole(resetRole === "admin" ? "admin-login" : "user-login");
    } catch (err) {
      console.error(err);
      alert("Could not connect to server");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setLoggedInUser(null);
    setCart([]);
    setIsCartOpen(false);
    setSelectedCategory(null);
    setUserId("");
    setPassword("");
    setAdminUserId("");
    setAdminPassword("");
    setAdminSecret("");
    setRole(null);
  };

  const clearForms = () => {
    setUserId("");
    setPassword("");
    setSignupUserId("");
    setSignupPassword("");
    setSignupConfirm("");

    setForgotUserId("");
    setForgotEmail("");
    setForgotSuccessEmail("");

    setAdminUserId("");
    setAdminPassword("");
    setAdminSecret("");
    setAdminSignupId("");
    setAdminSignupPassword("");
    setAdminSignupConfirm("");

    setForgotAdminUserId("");

    setResetToken("");
    setNewPassword("");
    setConfirmNewPassword("");
    setResetRole("user");

    setShowPassword(false);
    setShowAdminPassword(false);
    setShowAdminSecret(false);
    setShowSignupPassword(false);
    setShowAdminSignupPassword(false);
    setShowResetPassword(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image for the item.");
      return;
    }
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_title: title,
        price: Number(price),
        quantity: Number(quantity),
        type,
        image,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setTitle("");
        setPrice("");
        setQuantity("");
        setImage("");
        fetchItems();
        alert("Food item added successfully!");
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateItem = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_title: editTitle,
          price: Number(editPrice),
          quantity: Number(editQuantity),
          image: editImage,
          type: selectedAdminCategory,
        }),
      });
      if (response.ok) {
        alert("Item updated successfully!");
        setEditingItemId(null);
        fetchItems();
      } else {
        alert("Failed to update item");
      }
    } catch (err) {
      console.error("Error updating item:", err);
      alert("Failed to update item");
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      fetch(`${API}/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => {
          fetchItems();
          alert("Item deleted successfully!");
        })
        .catch((err) => console.log(err));
    }
  };

  const getCartItem = (id) => cart.find((c) => c._id === id);
  const getCartCount = () => cart.reduce((sum, c) => sum + c.quantity, 0);
  const getCartTotal = () =>
    cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c._id === item._id);
      if (existing) {
        return prev.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decrementCart = (id) => {
    setCart((prev) => {
      const existing = prev.find((c) => c._id === id);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((c) => c._id !== id);
      }
      return prev.map((c) =>
        c._id === id ? { ...c, quantity: c.quantity - 1 } : c,
      );
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c._id !== id));
  };

  const startCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setCheckoutStage("payment");
  };

  const placeOrder = async (method) => {
    const orderData = {
      userId: userId,
      items: cart.map((c) => ({
        productId: c._id,
        product_title: c.product_title,
        price: c.price,
        quantity: c.quantity,
        image: c.image,
        type: c.type,
      })),
      total: getCartTotal(),
      method,
    };

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Failed to place order: " + (err.error || "Server error"));
        return;
      }

      const savedOrder = await res.json();
      setPlacedOrder({
        userId: savedOrder.userId,
        items: savedOrder.items,
        total: savedOrder.total,
        method: savedOrder.method,
        placedAt: savedOrder.placedAt,
      });

      setCart([]);
      setCheckoutStage("success");
    } catch (err) {
      console.error(err);
      alert("Could not place order. Is the backend running?");
    }
  };

  const CartDrawer = () => {
    if (!isCartOpen) return null;

    return (
      <>
        <div
          onClick={() => setIsCartOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 999,
          }}
        />
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "380px",
            maxWidth: "90vw",
            height: "100vh",
            background: "#fff",
            boxShadow: "-4px 0 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #f0e8e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>Your Cart</h3>
            <button
              onClick={() => setIsCartOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "22px",
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            {cart.length === 0 ? (
              <p
                style={{
                  color: "#9a8a7d",
                  textAlign: "center",
                  marginTop: "40px",
                }}
              >
                Your cart is empty.
              </p>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "10px 0",
                    borderBottom: "1px solid #f0e8e0",
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.product_title}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        background: "#f0e8e0",
                        borderRadius: "6px",
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px" }}>
                      {item.product_title}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        color: "#e85d2f",
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                    >
                      ₹{item.price}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "6px",
                      }}
                    >
                      <button
                        onClick={() => decrementCart(item._id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#e85d2f",
                          fontSize: "22px",
                          cursor: "pointer",
                          padding: "0 8px",
                          lineHeight: 1,
                        }}
                      >
                        −
                      </button>
                      <span style={{ minWidth: "20px", textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#28a745",
                          fontSize: "22px",
                          cursor: "pointer",
                          padding: "0 8px",
                          lineHeight: 1,
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{
                          marginLeft: "auto",
                          background: "transparent",
                          border: "none",
                          color: "#dc3545",
                          cursor: "pointer",
                          fontSize: "12px",
                          textDecoration: "underline",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div
              style={{ borderTop: "1px solid #f0e8e0", padding: "16px 20px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                <span>Total</span>
                <span style={{ color: "#e85d2f" }}>₹{getCartTotal()}</span>
              </div>
              <button
                onClick={startCheckout}
                style={{
                  width: "100%",
                  padding: "12px",
                  background:
                    "linear-gradient(135deg, #e85d2f 0%, #d94a1c 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </>
    );
  };
  // HOME
  if (!role) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />

        <div
          className="fade-in home-hero"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "80px 24px 60px",
            textAlign: "center",
          }}
        >
          <h1
            className="home-title"
            style={{
              fontSize: "42px",
              fontWeight: 700,
              color: "#2d1a11",
              margin: "0 0 16px",
              letterSpacing: "-0.5px",
            }}
          >
            Welcome to Canteen Corner 👋
          </h1>
          <p
            className="home-subtitle-1"
            style={{
              fontSize: "18px",
              color: "#6b5b4f",
              maxWidth: "520px",
              margin: "0 auto 12px",
              lineHeight: 1.5,
            }}
          >
            Hungry? We got you
          </p>
          <p
            className="home-subtitle-2"
            style={{
              fontSize: "15px",
              color: "#9a8a7d",
              margin: "0 auto 60px",
            }}
          >
            Order. Collect. Enjoy
          </p>

          <div
            className="role-cards-wrapper"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <div
              onClick={() => {
                clearForms();
                setRole("user-login");
              }}
              className="card-shadow role-card"
              style={{
                width: "240px",
                padding: "36px 24px",
                background: "#fff",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                border: "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "#e85d2f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <div
                className="role-card-icon"
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #e85d2f 0%, #d94a1c 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "32px",
                }}
              >
                👤
              </div>
              <h3
                className="role-card-title"
                style={{
                  margin: "0 0 8px",
                  fontSize: "20px",
                  color: "#2d1a11",
                  fontWeight: 700,
                }}
              >
                I'm a User
              </h3>
              <p
                className="role-card-desc"
                style={{
                  margin: "0 0 20px",
                  fontSize: "13px",
                  color: "#9a8a7d",
                }}
              >
                Order food, pay, and collect
              </p>
              <div
                className="role-card-link"
                style={{
                  fontSize: "14px",
                  color: "#e85d2f",
                  fontWeight: 600,
                }}
              >
                Login / Sign up →
              </div>
            </div>
            <div
              onClick={() => {
                clearForms();
                setRole("admin-login");
              }}
              className="card-shadow role-card"
              style={{
                width: "240px",
                padding: "36px 24px",
                background: "#fff",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                border: "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "#333";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <div
                className="role-card-icon"
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #333 0%, #1a1a1a 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "32px",
                }}
              >
                🔐
              </div>
              <h3
                className="role-card-title"
                style={{
                  margin: "0 0 8px",
                  fontSize: "20px",
                  color: "#2d1a11",
                  fontWeight: 700,
                }}
              >
                I'm an Admin
              </h3>
              <p
                className="role-card-desc"
                style={{
                  margin: "0 0 20px",
                  fontSize: "13px",
                  color: "#9a8a7d",
                }}
              >
                Manage menu & orders
              </p>
              <div
                className="role-card-link"
                style={{
                  fontSize: "14px",
                  color: "#333",
                  fontWeight: 600,
                }}
              >
                Login / Sign up →
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // USER LOGIN
  if (role === "user-login") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />

        <div
          className="fade-in auth-page-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px 24px",
          }}
        >
          <div
            className="card-shadow"
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px 36px",
            }}
          >
            <div
              onClick={() => {
                clearForms();
                setRole(null);
              }}
              style={{
                fontSize: "14px",
                color: "#9a8a7d",
                cursor: "pointer",
                marginBottom: "24px",
                display: "inline-block",
              }}
            >
              ← Back
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "28px",
                fontWeight: 700,
                color: "#e85d2f",
              }}
            >
              User Login
            </h2>
            <p
              style={{
                margin: "0 0 32px",
                fontSize: "14px",
                color: "#9a8a7d",
              }}
            >
              Login to your account
            </p>

            <form
              onSubmit={handleUserLogin}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  User ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    boxSizing: "border-box",
                    border: "1px solid #e5d8c8",
                    borderRadius: "10px",
                    fontSize: "14px",
                    background: "#fff",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  Password
                </label>
                <PasswordField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  showPassword={showPassword}
                  toggleShowPassword={() => setShowPassword((s) => !s)}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "8px",
                  padding: "13px",
                  background:
                    "linear-gradient(135deg, #e85d2f 0%, #d94a1c 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Log In
              </button>
            </form>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "24px",
                fontSize: "13px",
              }}
            >
              <span
                onClick={() => setRole("forgot-password")}
                style={{
                  color: "#e85d2f",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Forgot password?
              </span>
              <span
                onClick={() => {
                  clearForms();
                  setRole("user-signup");
                }}
                style={{
                  color: "#e85d2f",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Sign up
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // USER FORGOT PASSWORD
  if (role === "forgot-password") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />

        <div
          className="fade-in auth-page-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px 24px",
          }}
        >
          <div
            className="card-shadow"
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px 36px",
            }}
          >
            <div
              onClick={() => setRole("user-login")}
              style={{
                fontSize: "14px",
                color: "#9a8a7d",
                cursor: "pointer",
                marginBottom: "24px",
                display: "inline-block",
              }}
            >
              ← Back
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "28px",
                fontWeight: 700,
                color: "#e85d2f",
              }}
            >
              Reset Password
            </h2>
            <p
              style={{
                margin: "0 0 32px",
                fontSize: "14px",
                color: "#9a8a7d",
              }}
            >
              Enter your details and we'll send a reset link to your email.
            </p>

            <form
              onSubmit={handleForgotPassword}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  User ID
                </label>
                <input
                  type="text"
                  value={forgotUserId}
                  onChange={(e) => setForgotUserId(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    boxSizing: "border-box",
                    border: "1px solid #e5d8c8",
                    borderRadius: "10px",
                    fontSize: "14px",
                    background: "#fff",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    boxSizing: "border-box",
                    border: "1px solid #e5d8c8",
                    borderRadius: "10px",
                    fontSize: "14px",
                    background: "#fff",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                style={{
                  marginTop: "8px",
                  padding: "13px",
                  background: forgotLoading
                    ? "#d4c4b0"
                    : "linear-gradient(135deg, #e85d2f 0%, #d94a1c 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: forgotLoading ? "not-allowed" : "pointer",
                }}
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div
              style={{
                marginTop: "24px",
                fontSize: "13px",
                textAlign: "center",
                color: "#9a8a7d",
              }}
            >
              Remembered your password?{" "}
              <span
                onClick={() => setRole("user-login")}
                style={{
                  color: "#e85d2f",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Log In
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // FORGOT PASSWORD SUCCESS
  if (role === "forgot-success") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />

        <div
          className="fade-in auth-page-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px 24px",
          }}
        >
          <div
            className="card-shadow"
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px 36px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>📧</div>

            <h2
              style={{
                margin: "0 0 12px",
                color: "#e85d2f",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              Check Your Email
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                fontSize: "14px",
                color: "#9a8a7d",
                lineHeight: 1.6,
              }}
            >
              We sent a password reset link to
              <br />
              <strong style={{ color: "#2d1a11" }}>{forgotSuccessEmail}</strong>
            </p>

            <p
              style={{
                margin: "0 0 24px",
                fontSize: "13px",
                color: "#9a8a7d",
              }}
            >
              Didn't receive it? Check your spam folder.
            </p>

            <button
              onClick={() => {
                clearForms();
                setRole("user-login");
              }}
              style={{
                padding: "12px 32px",
                background: "linear-gradient(135deg, #e85d2f 0%, #d94a1c 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RESET PASSWORD SCREEN
  if (role === "reset-password") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />

        <div
          className="fade-in auth-page-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px 24px",
          }}
        >
          <div
            className="card-shadow"
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px 36px",
            }}
          >
            <div
              onClick={() => {
                clearForms();
                setRole("user-login");
              }}
              style={{
                fontSize: "14px",
                color: "#9a8a7d",
                cursor: "pointer",
                marginBottom: "24px",
                display: "inline-block",
              }}
            >
              ← Back to Login
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "28px",
                fontWeight: 700,
                color: "#e85d2f",
              }}
            >
              Set New Password
            </h2>
            <p
              style={{
                margin: "0 0 32px",
                fontSize: "14px",
                color: "#9a8a7d",
              }}
            >
              Enter your new password below.
            </p>

            <form
              onSubmit={handleResetPassword}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  New Password
                </label>
                <PasswordField
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  showPassword={showResetPassword}
                  toggleShowPassword={() => setShowResetPassword((s) => !s)}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  Confirm Password
                </label>
                <PasswordField
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  showPassword={showResetPassword}
                  toggleShowPassword={() => setShowResetPassword((s) => !s)}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "8px",
                  padding: "13px",
                  background:
                    "linear-gradient(135deg, #e85d2f 0%, #d94a1c 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset Password
              </button>
            </form>

            <div
              style={{
                marginTop: "24px",
                fontSize: "13px",
                textAlign: "center",
                color: "#9a8a7d",
              }}
            >
              Remembered your password?{" "}
              <span
                onClick={() => {
                  clearForms();
                  setRole("user-login");
                }}
                style={{
                  color: "#e85d2f",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Log In
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // USER SIGNUP
  if (role === "user-signup") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />

        <div
          className="fade-in auth-page-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px 24px",
          }}
        >
          <div
            className="card-shadow"
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px 36px",
            }}
          >
            <div
              onClick={() => setRole("user-login")}
              style={{
                fontSize: "14px",
                color: "#9a8a7d",
                cursor: "pointer",
                marginBottom: "24px",
                display: "inline-block",
              }}
            >
              ← Back
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "28px",
                fontWeight: 700,
                color: "#e85d2f",
              }}
            >
              User Sign Up
            </h2>
            <p
              style={{
                margin: "0 0 32px",
                fontSize: "14px",
                color: "#9a8a7d",
              }}
            >
              Create your account to start ordering
            </p>

            <form
              onSubmit={handleUserSignup}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  User ID
                </label>
                <input
                  type="text"
                  value={signupUserId}
                  onChange={(e) => setSignupUserId(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    boxSizing: "border-box",
                    border: "1px solid #e5d8c8",
                    borderRadius: "10px",
                    fontSize: "14px",
                    background: "#fff",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  New Password
                </label>
                <PasswordField
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  showPassword={showSignupPassword}
                  toggleShowPassword={() => setShowSignupPassword((s) => !s)}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  Confirm Password
                </label>
                <PasswordField
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  required
                  showPassword={showSignupPassword}
                  toggleShowPassword={() => setShowSignupPassword((s) => !s)}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "8px",
                  padding: "13px",
                  background:
                    "linear-gradient(135deg, #e85d2f 0%, #d94a1c 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Sign Up
              </button>
            </form>

            <div
              style={{
                marginTop: "24px",
                fontSize: "13px",
                textAlign: "center",
                color: "#9a8a7d",
              }}
            >
              Already have an account?{" "}
              <span
                onClick={() => setRole("user-login")}
                style={{
                  color: "#e85d2f",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Log In
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PAYMENT METHOD SCREEN
  if (role === "user-menu" && checkoutStage === "payment") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />

        <div
          className="fade-in"
          style={{
            padding: "40px 20px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <button
            onClick={() => setCheckoutStage(null)}
            style={{
              marginBottom: "20px",
              padding: "8px 16px",
              background: "#fff",
              color: "#9a8a7d",
              border: "1px solid #e5d8c8",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            ← Back to Menu
          </button>

          <h2
            style={{
              textAlign: "center",
              marginBottom: "10px",
              color: "#2d1a11",
              fontSize: "26px",
            }}
          >
            Select Payment Method
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#6b5b4f",
              marginBottom: "5px",
              fontSize: "14px",
            }}
          >
            <strong>User ID:</strong> {userId}
          </p>
          <p
            style={{
              textAlign: "center",
              color: "#9a8a7d",
              marginBottom: "30px",
              fontSize: "14px",
            }}
          >
            Total:{" "}
            <strong style={{ color: "#e85d2f", fontSize: "18px" }}>
              ₹{getCartTotal()}
            </strong>{" "}
            ({getCartCount()} {getCartCount() === 1 ? "item" : "items"})
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <button
              onClick={() => placeOrder("Cash (pay at counter)")}
              className="card-shadow"
              style={{
                padding: "20px",
                fontSize: "16px",
                cursor: "pointer",
                background: "#fff",
                color: "#2d1a11",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "28px" }}>💵</span>
              <div>
                <div>Pay by Cash</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#9a8a7d",
                    fontWeight: "normal",
                  }}
                >
                  Pay at the counter when you collect your order
                </div>
              </div>
            </button>

            <button
              onClick={() => placeOrder("UPI (pay at counter)")}
              className="card-shadow"
              style={{
                padding: "20px",
                fontSize: "16px",
                cursor: "pointer",
                background: "#fff",
                color: "#2d1a11",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "28px" }}>📱</span>
              <div>
                <div>Pay by UPI</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#9a8a7d",
                    fontWeight: "normal",
                  }}
                >
                  Pay at the counter when you collect your order
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ORDER SUCCESS SCREEN
  if (role === "user-menu" && checkoutStage === "success" && placedOrder) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />

        <div
          className="fade-in"
          style={{
            padding: "40px 20px",
            maxWidth: "600px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "10px" }}>✅</div>
          <h2
            style={{
              color: "#e85d2f",
              marginBottom: "5px",
              fontSize: "26px",
            }}
          >
            Order Placed Successfully!
          </h2>
          <p style={{ color: "#9a8a7d", fontSize: "14px" }}>
            Your order has been confirmed. Please collect it from the counter
            and pay there.
          </p>

          <div
            className="card-shadow"
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "24px",
              marginTop: "25px",
              textAlign: "left",
            }}
          >
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>User ID:</strong> {placedOrder.userId}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>Payment:</strong> {placedOrder.method}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>Pickup:</strong> Canteen Corner
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>Placed At:</strong> {placedOrder.placedAt}
            </p>

            <hr
              style={{
                margin: "15px 0",
                border: "none",
                borderTop: "1px solid #f0e8e0",
              }}
            />

            <h4 style={{ margin: "10px 0", color: "#2d1a11" }}>Items:</h4>
            {placedOrder.items.map((it, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "6px 0",
                  fontSize: "14px",
                  color: "#2d1a11",
                }}
              >
                <span>
                  {it.product_title} × {it.quantity}
                </span>
                <span>₹{it.price * it.quantity}</span>
              </div>
            ))}

            <hr
              style={{
                margin: "15px 0",
                border: "none",
                borderTop: "1px solid #f0e8e0",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              <span style={{ color: "#2d1a11" }}>Total</span>
              <span style={{ color: "#e85d2f" }}>₹{placedOrder.total}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setPlacedOrder(null);
              setCheckoutStage(null);
              setSelectedCategory(null);
            }}
            style={{
              marginTop: "25px",
              padding: "12px 32px",
              background: "linear-gradient(135deg, #e85d2f 0%, #d94a1c 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }
  // MY ORDERS
  if (role === "user-menu" && showMyOrders) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />
        <div
          className="fade-in"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "40px 24px 60px",
          }}
        >
          <button
            onClick={() => setShowMyOrders(false)}
            style={{
              marginBottom: "20px",
              padding: "8px 16px",
              background: "#fff",
              color: "#9a8a7d",
              border: "1px solid #e5d8c8",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            ← Back to Menu
          </button>

          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "32px",
              fontWeight: 700,
              color: "#2d1a11",
            }}
          >
            My Orders
          </h1>
          <p style={{ margin: "0 0 32px", fontSize: "15px", color: "#9a8a7d" }}>
            All your past orders appear here
          </p>

          {userOrders.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                color: "#9a8a7d",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🍽️</div>
              <p
                style={{
                  margin: 0,
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "#2d1a11",
                }}
              >
                No orders yet
              </p>
              <p style={{ margin: "8px 0 0", fontSize: "14px" }}>
                Your past orders will show up here
              </p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {userOrders.map((order) => (
                <div
                  key={order._id}
                  className="card-shadow"
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid #f0e8e0",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#9a8a7d",
                          fontWeight: 600,
                        }}
                      >
                        Placed At
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#2d1a11",
                        }}
                      >
                        {order.placedAt}
                      </div>
                    </div>
                    <div
                      style={{
                        background: "#fff5e6",
                        color: "#e85d2f",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {order.method}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "8px",
                      color: "#2d1a11",
                    }}
                  >
                    Items ({order.items.length})
                  </div>
                  {order.items.map((it, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        margin: "4px 0",
                        color: "#2d1a11",
                      }}
                    >
                      <span>
                        {it.product_title} × {it.quantity}
                      </span>
                      <span>₹{it.price * it.quantity}</span>
                    </div>
                  ))}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "12px",
                      paddingTop: "12px",
                      borderTop: "1px solid #f0e8e0",
                      fontSize: "17px",
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ color: "#2d1a11" }}>Total</span>
                    <span style={{ color: "#e85d2f" }}>₹{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  // USER MENU
  if (role === "user-menu") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header
          rightContent={
            <>
              <button
                className="header-btn"
                onClick={() => setIsCartOpen(true)}
                style={{
                  background: "#fff5e6",
                  color: "#e85d2f",
                  border: "1px solid #f5d8c0",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                🛒 Cart ({getCartCount()})
              </button>
              <button
                className="header-btn"
                onClick={() => {
                  fetchUserOrders();
                  setShowMyOrders(true);
                }}
                style={{
                  background: "#fdf6ee",
                  color: "#8b5e34",
                  border: "1px solid #e8d5c0",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                My Orders
              </button>
              <button
                className="header-btn"
                onClick={handleLogout}
                style={{
                  background: "#f3f4f6",
                  color: "#6b7280",
                  border: "1px solid #e5e7eb",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Logout
              </button>
            </>
          }
        />

        <CartDrawer />

        <div
          className="fade-in"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "40px 24px 60px",
          }}
        >
          <div style={{ marginBottom: "40px" }}>
            <h1
              style={{
                margin: "0 0 8px",
                fontSize: "32px",
                fontWeight: 700,
                color: "#2d1a11",
              }}
            >
              Hi {userId || loggedInUser?.userId || "there"} 👋
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                color: "#9a8a7d",
              }}
            >
              What are you craving today?
            </p>
          </div>

          {!selectedCategory ? (
            <div>
              <h3
                style={{
                  borderBottom: "2px solid #e85d2f",
                  paddingBottom: "10px",
                  color: "#2d1a11",
                  fontSize: "20px",
                  maxWidth: "900px",
                  margin: "0 auto 24px",
                  textAlign: "left",
                }}
              >
                Food Categories
              </h3>
              <div
                className="category-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "20px",
                  maxWidth: "900px",
                  margin: "0 auto",
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="card-shadow"
                    style={{
                      padding: "32px 20px",
                      background: "#fff",
                      borderRadius: "16px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      border: "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor = "#e85d2f";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        color: "#2d1a11",
                        fontSize: "15px",
                        fontWeight: 600,
                        letterSpacing: "0.3px",
                      }}
                    >
                      {cat}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  marginBottom: "20px",
                  padding: "8px 16px",
                  background: "#fff",
                  color: "#9a8a7d",
                  border: "1px solid #e5d8c8",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                ← Back to Categories
              </button>

              <h3
                style={{
                  borderBottom: "2px solid #e85d2f",
                  paddingBottom: "10px",
                  color: "#2d1a11",
                  fontSize: "20px",
                  maxWidth: "900px",
                  margin: "0 auto 24px",
                  textAlign: "left",
                  textTransform: "uppercase",
                }}
              >
                {selectedCategory}
              </h3>

              <div
                className="items-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "20px",
                  maxWidth: "900px",
                  margin: "0 auto",
                }}
              >
                {products.filter((item) => item.type === selectedCategory)
                  .length === 0 ? (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      padding: "60px 20px",
                      color: "#9a8a7d",
                    }}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                      🍽️
                    </div>
                    <p style={{ margin: 0, fontSize: "15px" }}>
                      No items in this category yet.
                    </p>
                    <p style={{ margin: "8px 0 0", fontSize: "13px" }}>
                      Check back soon!
                    </p>
                  </div>
                ) : (
                  products
                    .filter((item) => item.type === selectedCategory)
                    .map((item, index) => (
                      <div
                        key={item._id || index}
                        className="card-shadow"
                        style={{
                          background: "#fff",
                          borderRadius: "16px",
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.product_title}
                            className="item-image"
                            style={{
                              width: "100%",
                              height: "170px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "170px",
                              background: "#f0e8e0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "40px",
                            }}
                          >
                            🍽️
                          </div>
                        )}

                        <div style={{ padding: "16px 18px", flex: 1 }}>
                          <h4
                            style={{
                              margin: "0 0 6px",
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#2d1a11",
                            }}
                          >
                            {item.product_title}
                          </h4>
                          <p
                            style={{
                              margin: "0 0 4px",
                              fontSize: "17px",
                              fontWeight: 700,
                              color: "#e85d2f",
                            }}
                          >
                            ₹{item.price}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "12px",
                              color: "#9a8a7d",
                            }}
                          >
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <div style={{ padding: "0 18px 18px" }}>
                          {(() => {
                            const cartItem = getCartItem(item._id);
                            if (cartItem) {
                              return (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    background: "#fdfaf6",
                                    borderRadius: "12px",
                                    padding: "8px 16px",
                                    border: "1px solid #f0e8e0",
                                  }}
                                >
                                  <button
                                    onClick={() => decrementCart(item._id)}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      color: "#e85d2f",
                                      fontSize: "26px",
                                      fontWeight: 400,
                                      cursor: "pointer",
                                      padding: "0 12px",
                                      lineHeight: 1,
                                    }}
                                  >
                                    −
                                  </button>
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      fontSize: "17px",
                                      color: "#2d1a11",
                                    }}
                                  >
                                    {cartItem.quantity}
                                  </span>
                                  <button
                                    onClick={() => addToCart(item)}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      color: "#28a745",
                                      fontSize: "26px",
                                      fontWeight: 400,
                                      cursor: "pointer",
                                      padding: "0 12px",
                                      lineHeight: 1,
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              );
                            }
                            return (
                              <button
                                onClick={() => addToCart(item)}
                                style={{
                                  width: "100%",
                                  padding: "11px",
                                  background:
                                    "linear-gradient(135deg, #e85d2f 0%, #d94a1c 100%)",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "10px",
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                Add to Cart
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ADMIN LOGIN
  if (role === "admin-login") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />

        <div
          className="fade-in auth-page-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px 24px",
          }}
        >
          <div
            className="card-shadow"
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px 36px",
            }}
          >
            <div
              onClick={() => {
                clearForms();
                setRole(null);
              }}
              style={{
                fontSize: "14px",
                color: "#9a8a7d",
                cursor: "pointer",
                marginBottom: "24px",
                display: "inline-block",
              }}
            >
              ← Back
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "28px",
                fontWeight: 700,
                color: "#2d1a11",
              }}
            >
              Admin Login
            </h2>
            <p
              style={{
                margin: "0 0 32px",
                fontSize: "14px",
                color: "#9a8a7d",
              }}
            >
              Login to manage menu & orders
            </p>

            <form
              onSubmit={handleAdminLogin}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  User ID
                </label>
                <input
                  type="text"
                  value={adminUserId}
                  onChange={(e) => setAdminUserId(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    boxSizing: "border-box",
                    border: "1px solid #e5d8c8",
                    borderRadius: "10px",
                    fontSize: "14px",
                    background: "#fff",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  Password
                </label>
                <PasswordField
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  showPassword={showAdminPassword}
                  toggleShowPassword={() => setShowAdminPassword((s) => !s)}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  Admin Secret Code
                </label>
                <PasswordField
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  required
                  showPassword={showAdminSecret}
                  toggleShowPassword={() => setShowAdminSecret((s) => !s)}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "8px",
                  padding: "13px",
                  background:
                    "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Log In
              </button>
            </form>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "24px",
                fontSize: "13px",
              }}
            >
              <span
                onClick={() => setRole("admin-forgot")}
                style={{
                  color: "#2d1a11",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Forgot password?
              </span>
              <span
                onClick={() => {
                  clearForms();
                  setRole("admin-signup");
                }}
                style={{
                  color: "#2d1a11",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Sign up
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN FORGOT
  if (role === "admin-forgot") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />

        <div
          className="fade-in auth-page-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px 24px",
          }}
        >
          <div
            className="card-shadow"
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px 36px",
            }}
          >
            <div
              onClick={() => setRole("admin-login")}
              style={{
                fontSize: "14px",
                color: "#9a8a7d",
                cursor: "pointer",
                marginBottom: "24px",
                display: "inline-block",
              }}
            >
              ← Back
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "28px",
                fontWeight: 700,
                color: "#2d1a11",
              }}
            >
              Reset Admin Password
            </h2>
            <p
              style={{
                margin: "0 0 32px",
                fontSize: "14px",
                color: "#9a8a7d",
              }}
            >
              Enter your Gmail ID. We'll send a reset link there.
            </p>

            <form
              onSubmit={handleAdminForgotPassword}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  Gmail ID
                </label>
                <input
                  type="email"
                  value={forgotAdminUserId}
                  onChange={(e) => setForgotAdminUserId(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    boxSizing: "border-box",
                    border: "1px solid #e5d8c8",
                    borderRadius: "10px",
                    fontSize: "14px",
                    background: "#fff",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={adminForgotLoading}
                style={{
                  marginTop: "8px",
                  padding: "13px",
                  background: adminForgotLoading
                    ? "#d4c4b0"
                    : "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: adminForgotLoading ? "not-allowed" : "pointer",
                }}
              >
                {adminForgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div
              style={{
                marginTop: "24px",
                fontSize: "13px",
                textAlign: "center",
                color: "#9a8a7d",
              }}
            >
              Remembered your password?{" "}
              <span
                onClick={() => setRole("admin-login")}
                style={{
                  color: "#2d1a11",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Log In
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // ADMIN FORGOT SUCCESS
  if (role === "admin-forgot-success") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />

        <div
          className="fade-in auth-page-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px 24px",
          }}
        >
          <div
            className="card-shadow"
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px 36px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>📧</div>

            <h2
              style={{
                margin: "0 0 12px",
                color: "#2d1a11",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              Check Your Email
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                fontSize: "14px",
                color: "#9a8a7d",
                lineHeight: 1.6,
              }}
            >
              We sent a password reset link to
              <br />
              <strong style={{ color: "#2d1a11" }}>{forgotSuccessEmail}</strong>
            </p>

            <p
              style={{
                margin: "0 0 24px",
                fontSize: "13px",
                color: "#9a8a7d",
              }}
            >
              Didn't receive it? Check your spam folder.
            </p>

            <button
              onClick={() => {
                clearForms();
                setRole("admin-login");
              }}
              style={{
                padding: "12px 32px",
                background: "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              Back to Admin Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN RESET PASSWORD
  if (role === "admin-reset-password") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />

        <div
          className="fade-in auth-page-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px 24px",
          }}
        >
          <div
            className="card-shadow"
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px 36px",
            }}
          >
            <div
              onClick={() => {
                clearForms();
                setRole("admin-login");
              }}
              style={{
                fontSize: "14px",
                color: "#9a8a7d",
                cursor: "pointer",
                marginBottom: "24px",
                display: "inline-block",
              }}
            >
              ← Back to Admin Login
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "28px",
                fontWeight: 700,
                color: "#2d1a11",
              }}
            >
              Set New Admin Password
            </h2>
            <p
              style={{
                margin: "0 0 32px",
                fontSize: "14px",
                color: "#9a8a7d",
              }}
            >
              Enter your new admin password below.
            </p>

            <form
              onSubmit={handleResetPassword}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  New Password
                </label>
                <PasswordField
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  showPassword={showResetPassword}
                  toggleShowPassword={() => setShowResetPassword((s) => !s)}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  Confirm Password
                </label>
                <PasswordField
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  showPassword={showResetPassword}
                  toggleShowPassword={() => setShowResetPassword((s) => !s)}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "8px",
                  padding: "13px",
                  background:
                    "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset Admin Password
              </button>
            </form>

            <div
              style={{
                marginTop: "24px",
                fontSize: "13px",
                textAlign: "center",
                color: "#9a8a7d",
              }}
            >
              Remembered your password?{" "}
              <span
                onClick={() => {
                  clearForms();
                  setRole("admin-login");
                }}
                style={{
                  color: "#2d1a11",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Log In
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN SIGNUP
  if (role === "admin-signup") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />

        <div
          className="fade-in auth-page-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px 24px",
          }}
        >
          <div
            className="card-shadow"
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px 36px",
            }}
          >
            <div
              onClick={() => setRole("admin-login")}
              style={{
                fontSize: "14px",
                color: "#9a8a7d",
                cursor: "pointer",
                marginBottom: "24px",
                display: "inline-block",
              }}
            >
              ← Back
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "28px",
                fontWeight: 700,
                color: "#2d1a11",
              }}
            >
              Admin Sign Up
            </h2>
            <p
              style={{
                margin: "0 0 32px",
                fontSize: "14px",
                color: "#9a8a7d",
              }}
            >
              Create an admin account
            </p>

            <form
              onSubmit={handleAdminSignup}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  Gmail ID
                </label>
                <input
                  type="email"
                  value={adminSignupId}
                  onChange={(e) => setAdminSignupId(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    boxSizing: "border-box",
                    border: "1px solid #e5d8c8",
                    borderRadius: "10px",
                    fontSize: "14px",
                    background: "#fff",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  New Password
                </label>
                <PasswordField
                  value={adminSignupPassword}
                  onChange={(e) => setAdminSignupPassword(e.target.value)}
                  required
                  showPassword={showAdminSignupPassword}
                  toggleShowPassword={() =>
                    setShowAdminSignupPassword((s) => !s)
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2d1a11",
                  }}
                >
                  Confirm Password
                </label>
                <PasswordField
                  value={adminSignupConfirm}
                  onChange={(e) => setAdminSignupConfirm(e.target.value)}
                  required
                  showPassword={showAdminSignupPassword}
                  toggleShowPassword={() =>
                    setShowAdminSignupPassword((s) => !s)
                  }
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "8px",
                  padding: "13px",
                  background:
                    "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Sign Up as Admin
              </button>
            </form>

            <div
              style={{
                marginTop: "24px",
                fontSize: "13px",
                textAlign: "center",
                color: "#9a8a7d",
              }}
            >
              Already have an account?{" "}
              <span
                onClick={() => setRole("admin-login")}
                style={{
                  color: "#2d1a11",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Log In
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // ADMIN DASHBOARD
  if (role === "admin-dash") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header
          rightContent={
            <button
              className="header-btn"
              onClick={handleLogout}
              style={{
                background: "#f3f4f6",
                color: "#6b7280",
                border: "1px solid #e5e7eb",
                padding: "10px 18px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Logout
            </button>
          }
        />

        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "40px 24px",
          }}
        >
          {adminView === "home" && (
            <div className="fade-in">
              <div style={{ marginBottom: "36px" }}>
                <h1
                  style={{
                    margin: "0 0 8px",
                    fontSize: "32px",
                    fontWeight: 700,
                    color: "#2d1a11",
                  }}
                >
                  Hey Admin 👋
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    color: "#9a8a7d",
                  }}
                >
                  Manage your canteen menu and orders
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "20px",
                }}
              >
                <div
                  onClick={() => setAdminView("add")}
                  className="card-shadow"
                  style={{
                    padding: "32px 24px",
                    background: "#fff",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderTop: "4px solid #e85d2f",
                    textAlign: "center",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#2d1a11",
                    }}
                  >
                    Add Items
                  </h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#9a8a7d" }}>
                    Add new food to the menu
                  </p>
                </div>

                <div
                  onClick={() => {
                    setSelectedAdminCategory(null);
                    setAdminView("update");
                  }}
                  className="card-shadow"
                  style={{
                    padding: "32px 24px",
                    background: "#fff",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderTop: "4px solid #e85d2f",
                    textAlign: "center",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#2d1a11",
                    }}
                  >
                    Update Items
                  </h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#9a8a7d" }}>
                    Edit or delete existing items
                  </p>
                </div>

                <div
                  onClick={() => {
                    fetchOrders();
                    setAdminView("orders");
                  }}
                  className="card-shadow"
                  style={{
                    padding: "32px 24px",
                    background: "#fff",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderTop: "4px solid #e85d2f",
                    textAlign: "center",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#2d1a11",
                    }}
                  >
                    Orders
                  </h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#9a8a7d" }}>
                    View incoming customer orders
                  </p>
                </div>
              </div>
            </div>
          )}

          {adminView !== "home" && (
            <button
              onClick={() => {
                if (adminView === "update" && selectedAdminCategory) {
                  setSelectedAdminCategory(null);
                } else {
                  setAdminView("home");
                  setSelectedAdminCategory(null);
                }
              }}
              style={{
                marginBottom: "20px",
                padding: "8px 16px",
                background: "#fff",
                color: "#9a8a7d",
                border: "1px solid #e5d8c8",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {adminView === "update" && selectedAdminCategory
                ? "← Back to Categories"
                : "← Back to Dashboard"}
            </button>
          )}

          {adminView === "add" && (
            <div
              className="card-shadow fade-in"
              style={{
                background: "#fff",
                padding: "40px",
                borderRadius: "16px",
                maxWidth: "640px",
                margin: "0 auto",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#2d1a11",
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                Add New Item
              </h3>
              <p
                style={{
                  margin: "0 0 32px",
                  fontSize: "13px",
                  color: "#9a8a7d",
                }}
              >
                Fill in the details to add a new food item
              </p>

              <form
                onSubmit={addItem}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#2d1a11",
                    }}
                  >
                    Food Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dosa"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      boxSizing: "border-box",
                      border: "1px solid #e5d8c8",
                      borderRadius: "10px",
                      fontSize: "14px",
                      background: "#fff",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#2d1a11",
                      }}
                    >
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        boxSizing: "border-box",
                        border: "1px solid #e5d8c8",
                        borderRadius: "10px",
                        fontSize: "14px",
                        background: "#fff",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#2d1a11",
                      }}
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        boxSizing: "border-box",
                        border: "1px solid #e5d8c8",
                        borderRadius: "10px",
                        fontSize: "14px",
                        background: "#fff",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#2d1a11",
                    }}
                  >
                    Category
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      boxSizing: "border-box",
                      border: "1px solid #e5d8c8",
                      borderRadius: "10px",
                      fontSize: "14px",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#2d1a11",
                    }}
                  >
                    Image
                  </label>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "24px",
                      border: "2px dashed #e5d8c8",
                      borderRadius: "10px",
                      background: "#fdfaf6",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#e85d2f";
                      e.currentTarget.style.background = "#fff5e6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e5d8c8";
                      e.currentTarget.style.background = "#fdfaf6";
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                    {image ? (
                      <>
                        <img
                          src={image}
                          alt="Preview"
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            marginBottom: "12px",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#e85d2f",
                            fontWeight: 600,
                          }}
                        >
                          Change Image
                        </span>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: "36px", marginBottom: "8px" }}>
                          📷
                        </div>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#2d1a11",
                            fontWeight: 600,
                            marginBottom: "4px",
                          }}
                        >
                          Click to upload
                        </span>
                        <span style={{ fontSize: "12px", color: "#9a8a7d" }}>
                          JPG, PNG or any image
                        </span>
                      </>
                    )}
                  </label>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: "12px",
                    padding: "14px",
                    background:
                      "linear-gradient(135deg, #e85d2f 0%, #d94a1c 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Add Item
                </button>
              </form>
            </div>
          )}

          {adminView === "update" && (
            <div>
              {!selectedAdminCategory ? (
                <div>
                  <h3
                    style={{
                      borderBottom: "2px solid #e85d2f",
                      paddingBottom: "10px",
                      color: "#2d1a11",
                      fontSize: "20px",
                      marginBottom: "24px",
                      fontWeight: 700,
                    }}
                  >
                    Select a Category
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {categories.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => setSelectedAdminCategory(cat)}
                        className="card-shadow"
                        style={{
                          padding: "32px 20px",
                          background: "#fff",
                          borderRadius: "16px",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          border: "2px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.borderColor = "#e85d2f";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.borderColor = "transparent";
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            color: "#2d1a11",
                            fontSize: "15px",
                            fontWeight: 600,
                            letterSpacing: "0.3px",
                          }}
                        >
                          {cat}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3
                    style={{
                      borderBottom: "2px solid #e85d2f",
                      paddingBottom: "10px",
                      color: "#2d1a11",
                      fontSize: "20px",
                      marginBottom: "24px",
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    {selectedAdminCategory} Items
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(240px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {products.filter(
                      (item) => item.type === selectedAdminCategory,
                    ).length === 0 ? (
                      <div
                        style={{
                          gridColumn: "1 / -1",
                          textAlign: "center",
                          padding: "60px 20px",
                          color: "#9a8a7d",
                        }}
                      >
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                          🍽️
                        </div>
                        <p style={{ margin: 0 }}>
                          No items in this category yet.
                        </p>
                      </div>
                    ) : (
                      products
                        .filter((item) => item.type === selectedAdminCategory)
                        .map((item) => {
                          const isEditing =
                            editingItemId === (item._id || item.id);

                          return (
                            <div
                              key={item._id || item.id}
                              className="card-shadow"
                              style={{
                                background: "#fff",
                                borderRadius: "16px",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {isEditing ? (
                                <div
                                  style={{
                                    padding: "16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                  }}
                                >
                                  <label
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: 600,
                                      color: "#2d1a11",
                                    }}
                                  >
                                    Change Image
                                  </label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageUpload}
                                    style={{ fontSize: "11px" }}
                                  />
                                  {editImage && (
                                    <img
                                      src={editImage}
                                      alt="Preview"
                                      style={{
                                        width: "100%",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                      }}
                                    />
                                  )}
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) =>
                                      setEditTitle(e.target.value)
                                    }
                                    placeholder="Name"
                                    style={{
                                      padding: "10px",
                                      fontSize: "13px",
                                      border: "1px solid #e5d8c8",
                                      borderRadius: "8px",
                                    }}
                                  />
                                  <input
                                    type="number"
                                    value={editPrice}
                                    onChange={(e) =>
                                      setEditPrice(e.target.value)
                                    }
                                    placeholder="Price"
                                    style={{
                                      padding: "10px",
                                      fontSize: "13px",
                                      border: "1px solid #e5d8c8",
                                      borderRadius: "8px",
                                    }}
                                  />
                                  <input
                                    type="number"
                                    value={editQuantity}
                                    onChange={(e) =>
                                      setEditQuantity(e.target.value)
                                    }
                                    placeholder="Quantity"
                                    style={{
                                      padding: "10px",
                                      fontSize: "13px",
                                      border: "1px solid #e5d8c8",
                                      borderRadius: "8px",
                                    }}
                                  />
                                  <button
                                    onClick={() =>
                                      handleUpdateItem(item._id || item.id)
                                    }
                                    style={{
                                      padding: "10px",
                                      background: "#28a745",
                                      color: "#fff",
                                      border: "none",
                                      borderRadius: "8px",
                                      cursor: "pointer",
                                      fontSize: "13px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Save Changes
                                  </button>
                                  <button
                                    onClick={() => setEditingItemId(null)}
                                    style={{
                                      padding: "10px",
                                      background: "#f3f4f6",
                                      color: "#374151",
                                      border: "none",
                                      borderRadius: "8px",
                                      cursor: "pointer",
                                      fontSize: "13px",
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.product_title}
                                      style={{
                                        width: "100%",
                                        height: "170px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    <div
                                      style={{
                                        width: "100%",
                                        height: "170px",
                                        background: "#f0e8e0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "40px",
                                      }}
                                    >
                                      🍽️
                                    </div>
                                  )}

                                  <div
                                    style={{
                                      padding: "16px 18px",
                                      flex: 1,
                                    }}
                                  >
                                    <h4
                                      style={{
                                        margin: "0 0 6px",
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        color: "#2d1a11",
                                      }}
                                    >
                                      {item.product_title}
                                    </h4>
                                    <p
                                      style={{
                                        margin: "0 0 4px",
                                        fontSize: "17px",
                                        fontWeight: 700,
                                        color: "#e85d2f",
                                      }}
                                    >
                                      ₹{item.price}
                                    </p>
                                    <p
                                      style={{
                                        margin: 0,
                                        fontSize: "12px",
                                        color: "#9a8a7d",
                                      }}
                                    >
                                      Quantity: {item.quantity}
                                    </p>
                                  </div>

                                  <div
                                    style={{
                                      padding: "0 18px 18px",
                                      display: "flex",
                                      gap: "8px",
                                    }}
                                  >
                                    <button
                                      onClick={() => {
                                        setEditingItemId(item._id || item.id);
                                        setEditTitle(item.product_title);
                                        setEditPrice(item.price);
                                        setEditQuantity(item.quantity);
                                        setEditImage(item.image);
                                      }}
                                      style={{
                                        flex: 1,
                                        padding: "10px",
                                        background: "#fff",
                                        color: "#2d1a11",
                                        border: "1px solid #e5d8c8",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        deleteItem(item._id || item.id)
                                      }
                                      style={{
                                        flex: 1,
                                        padding: "10px",
                                        background: "#fff",
                                        color: "#dc3545",
                                        border: "1px solid #fecaca",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {adminView === "orders" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#2d1a11",
                    fontSize: "20px",
                  }}
                >
                  Customer Orders ({orders.length})
                </h3>
                <button
                  onClick={fetchOrders}
                  style={{
                    padding: "8px 16px",
                    background: "#fff",
                    color: "#9a8a7d",
                    border: "1px solid #e5d8c8",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  🔄 Refresh
                </button>
              </div>

              {orders.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#9a8a7d",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    📭
                  </div>
                  <p style={{ margin: 0 }}>No orders yet.</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="card-shadow"
                      style={{
                        position: "relative",
                        background: "#fff",
                        borderRadius: "14px",
                        padding: "20px",
                      }}
                    >
                      <button
                        onClick={() => deleteOrder(order._id)}
                        title="Remove order"
                        style={{
                          position: "absolute",
                          top: "14px",
                          right: "14px",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#fee2e2",
                          color: "#dc2626",
                          fontSize: "16px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ✕
                      </button>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                          paddingBottom: "12px",
                          borderBottom: "1px solid #f0e8e0",
                          paddingRight: "40px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#9a8a7d",
                              fontWeight: 600,
                            }}
                          >
                            User ID
                          </div>
                          <div
                            style={{
                              fontSize: "18px",
                              fontWeight: 700,
                              color: "#2d1a11",
                            }}
                          >
                            {order.userId}
                          </div>
                        </div>
                        <div
                          style={{
                            background: "#fff5e6",
                            color: "#e85d2f",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          {order.method}
                        </div>
                      </div>

                      <p
                        style={{
                          margin: "4px 0",
                          fontSize: "13px",
                          color: "#6b5b4f",
                        }}
                      >
                        <strong>Placed At:</strong> {order.placedAt}
                      </p>
                      <p
                        style={{
                          margin: "4px 0",
                          fontSize: "13px",
                          color: "#6b5b4f",
                        }}
                      >
                        <strong>Pickup:</strong> Canteen Corner
                      </p>

                      <div
                        style={{
                          marginTop: "14px",
                          paddingTop: "12px",
                          borderTop: "1px dashed #e5d8c8",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            marginBottom: "8px",
                            color: "#2d1a11",
                          }}
                        >
                          Items ({order.items.length})
                        </div>
                        {order.items.map((it, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "14px",
                              margin: "4px 0",
                              color: "#2d1a11",
                            }}
                          >
                            <span>
                              {it.product_title} × {it.quantity}
                            </span>
                            <span>₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "14px",
                          paddingTop: "12px",
                          borderTop: "1px solid #f0e8e0",
                          fontSize: "17px",
                          fontWeight: 700,
                        }}
                      >
                        <span style={{ color: "#2d1a11" }}>Total</span>
                        <span style={{ color: "#e85d2f" }}>₹{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default App;
