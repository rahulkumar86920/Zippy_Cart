import React from "react";
import { footerStyles } from "../assets/dummyStyles";
import {
  FaApplePay,
  FaCcAmex,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLink,
  FaMapMarkerAlt,
  FaPhone,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { FiBookmark, FiMail } from "react-icons/fi";
import { BiMailSend } from "react-icons/bi";

const Footer = () => {
  const socialLinks = [
    {
      icon: FaFacebookF,
      url: "https://www.facebook.com/profile.php?id=100084933447489",
    },
    {
      icon: FaTwitter,
      url: "https://x.com/rahulkumar86920",
    },
    {
      icon: FaInstagram,
      url: "https://www.instagram.com/mr_rahhul/",
    },
    {
      icon: FaYoutube,
      url: "https://www.youtube.com/@Rahul86920",
    },
  ];

  return (
    <footer className={footerStyles.footer}>
      {/* this div is for the border */}
      <div className={footerStyles.topBorder} />

      {/* Floating shapes */}
      <div
        className={`${footerStyles.floatingShape} -top-24 -right-24 w-80 h-80 opacity-20`}
      ></div>
      <div
        className={`${footerStyles.floatingShape} -bottom-40 -left-24 w-96 h-96 opacity-15 animation-delay-2000`}
      ></div>
      <div
        className={`${footerStyles.floatingShape} top-1/4 left-1/3 w-64 h-64 bg-emerald-600 opacity-10 animate-pulse animation-delay-1000`}
      ></div>

      <div className={footerStyles.container}>
        <div className={footerStyles.grid}>
          <div className="">
            {/* Brand  */}
            <h2 className={footerStyles.brandTitle}>
              Zippy<span className={footerStyles.brandSpan}>Cart</span>
            </h2>
            <p className={footerStyles.brandText}>
              Delivering the purest organic freshness, from farm to your
              doorstep — since 2025. <br />
              At ZippyCart, we believe healthy living begins with what you eat.
            </p>

            {/* Links and icon of the footer */}
            <div className="space-x-3 flex">
              {socialLinks.map((social, idx) => (
                <a
                  href={social.url}
                  key={idx}
                  target="_blank"
                  aria-label={`Visit Our ${social.icon.name.replace(
                    "Fa",
                    ""
                  )}page`}
                  className={footerStyles.socialLink}
                >
                  <social.icon
                    className={footerStyles.socialIcon}
                  ></social.icon>
                </a>
              ))}
            </div>
          </div>
          {/* Quick Links  */}
          <div>
            <h3 className={footerStyles.sectionTitle}>
              <FaLink className={footerStyles.sectionIcon} /> Quick Links
            </h3>
            <ul className={footerStyles.linkList}>
              {["Home", "Items", "Contact"].map((item, idx) => (
                <li key={idx}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className={footerStyles.linkItem}
                  >
                    <span className={footerStyles.linkBullet}></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact information */}
          <div>
            <h3 className={footerStyles.sectionTitle}>
              {/* <BsTelephone className={footerStyles.sectionIcon}/> Cantact Us */}{" "}
              Cantact Us
            </h3>
            <ul className="space-y-4 text-sm sm:text-base">
              <li className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <FaMapMarkerAlt className={footerStyles.contactIcon} />
                </div>
                <div>
                  <p>Juhu Koliwada Santacruz West Mumbai 400049 </p>
                </div>
              </li>
              <li className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <FaPhone className={footerStyles.contactIcon} />
                </div>

                <div>
                  <p>8291651134 </p>
                </div>
              </li>
              <li className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <FaEnvelope className={footerStyles.contactIcon} />
                </div>

                <div>
                  <p>rahulkumar86920@gmail.com </p>
                </div>
              </li>
            </ul>
          </div>
          {/* News Letter  */}
          <div>
            <h3 className={footerStyles.sectionTitle}>
              <FiMail className={footerStyles.sectionIcon} /> NewsLetter
            </h3>
            <p className={footerStyles.newsletterText}>
              Stay connected with ZippyCart — get fresh updates, special offers,
              and delicious seasonal recipes in your inbox.{" "}
            </p>
            <div className={footerStyles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter Your Email Address :)"
                className={footerStyles.newsletterInput}
              />
              <button className={footerStyles.newsletterButton}>
                <BiMailSend className="mr-2 text-lg" />
                <span>Subcribe</span>
              </button>
            </div>
            <span className={footerStyles.privacyText}>
              We value your privacy. You’re free to unsubscribe whenever you
              wish.{" "}
            </span>
          </div>
        </div>

        {/* Payment method  */}
        <div className={footerStyles.paymentSection}>
          <h4 className={footerStyles.paymentTitle}>
            <FiBookmark
              className={footerStyles.paymentIcon}
              We
              Accept
              All
              Major
              Payment
              method
            />
          </h4>
          <div className={footerStyles.paymentMethods}>
            {[FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex, FaApplePay].map(
              (Icon, idx) => (
                <div key={idx} className={footerStyles.paymentItem}>
                  <Icon className={footerStyles.paymentIcon} />
                </div>
              )
            )}
          </div>
        </div>
        {/* HR */}
        <div className={footerStyles.attribution}>
          <div className={footerStyles.attributionBadge}>
            <span className={footerStyles.attributionText}>
              Desing By Rahul Sah
            </span>
          </div>
        </div>
      </div>
      <style>{footerStyles.customCSS}</style>
    </footer>
  );
};

export default Footer;
