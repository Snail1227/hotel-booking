import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type FooterProps = {
  isSignUpActive?: boolean;
  isLogInActive?: boolean;
  isAddRoomActive?: boolean;
  isBookingConfirmation?: boolean;
  isBookingHistory?: boolean;
};

export function Footer({
  isSignUpActive,
  isLogInActive,
  isAddRoomActive,
  isBookingConfirmation,
  isBookingHistory,
}: FooterProps) {
  return (
    <footer
      className={
        isSignUpActive ||
        isLogInActive ||
        isAddRoomActive ||
        isBookingConfirmation ||
        isBookingHistory
          ? "footer footer-at-bottom"
          : "footer"
      }
    >
      <small>
        <p>Privacy Policy</p> • <p>Terms of Service</p> • <p>Contact Us</p>
      </small>
      <div className="footer-2nd">
        <p>Follow us on social media: </p>
        <FontAwesomeIcon className="footer-icon" icon={faInstagram} />
        <FontAwesomeIcon className="footer-icon" icon={faFacebook} />
        <FontAwesomeIcon className="footer-icon" icon={faTwitter} />
      </div>
    </footer>
  );
}
