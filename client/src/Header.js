import React from "react";

function Header({ rightContent }) {
  return (
    <div
      className="header-bar"
      style={{
        width: "100%",
        padding: "8px 35px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#ffffff",
        borderBottom: "1px solid #f0e8e0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo.png"
          alt="Canteen Corner"
          className="header-logo"
          style={{
            height: "100px",
            width: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {rightContent}
      </div>
    </div>
  );
}

export default Header;
