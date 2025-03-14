import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>Your Personal Designer</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about-rita">About Rita</a></li>
            <li><a href="/unique-brides">Unique Brides</a></li>
            <li><a href="/bespoke-collection">Bespoke Collection</a></li>
            <li><a href="/the-experience">The Experience</a></li>
            <li><a href="/testimonials">Testimonials</a></li>
            <li><a href="/journal">Journal</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2023 Your Personal Designer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;