'use client';

import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { WonderLogo } from './Header';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandColumn}>
          <Link href="/" aria-label="WonderWraps home"><WonderLogo /></Link>
          <p>Personalised books made for your little ones!</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Instagram"><Instagram /></a>
            <a href="#" aria-label="Facebook"><Facebook /></a>
            <a href="#" aria-label="TikTok"><FaTiktok /></a>
          </div>
        </div>

        <FooterLinks title="About WonderWraps" links={[["Contact us", "/support"], ["FAQs", "/support"], ["Blog", "/"], ["Support", "/support"]]} />
        <FooterLinks title="Customer Area" links={[["My Account", "/account"], ["Orders", "/orders"], ["Terms", "/support"], ["Privacy Policy", "/support"]]} />

        <div className={styles.newsletter}>
          <h3>Subscribe to Our Newsletter</h3>
          <p>Don’t miss out on the newest books</p>
          <form onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="footer-email">Enter your email</label>
            <input id="footer-email" type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
          <div className={styles.payments}><span>PayPal</span><span className={styles.mastercard}>●●</span><span>VISA</span></div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div className={styles.links}>
      <h3>{title}</h3>
      {links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
    </div>
  );
}
