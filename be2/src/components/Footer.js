import React from "react";

function Footer() {
  return (
    <footer className="app-footer">
      <span>
        © {new Date().getFullYear()} Book Einstein. Crafted for Class 9–12 AI explorers.
      </span>
      <div className="footer-links">
        <button>Help</button>
        <button>Privacy</button>
        <button>Terms</button>
      </div>
    </footer>
  );
}

export default Footer;
