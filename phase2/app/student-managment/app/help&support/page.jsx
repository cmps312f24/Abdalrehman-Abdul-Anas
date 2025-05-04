export default function Help() {
    return (
      <div className="support-card container">
        <div className="support-header">
          <h2>Help & Support</h2>
          <p>We're here to assist you</p>
        </div>
  
        <div className="support-content">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <p><i className="fas fa-envelope"></i> support@university.edu</p>
            <p><i className="fas fa-phone"></i> +974 1234 5678</p>
            <p><i className="fas fa-map-marker-alt"></i> Qatar, Al-Duhail, Qatar University</p>
          </div>
  
          <div className="location">
            <h3>Location</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.415544936126!2d51.49042927608074!3d25.377178177563713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45e69c6a9f4f0d%3A0x77ebd9e0157e4f3d!2sQatar%20University!5e0!3m2!1sen!2sqa!4v1710000000000!5m2!1sen!2sqa"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
  
        <div className="social-media">
          <h3>Social Media</h3>
          <div className="icons">
            <a href="https://www.facebook.com/share/1AJqjcoKGS/" target="_blank" rel="noreferrer">
            <i className="fab fa-facebook"></i>
            </a>
            <a href="https://x.com/qataruniversity?s=21" target="_blank" rel="noreferrer">
            <i className="fab fa-x-twitter"></i>
            </a>
            <a href="https://www.instagram.com/qataruniversity" target="_blank" rel="noreferrer">
            <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.linkedin.com/school/qatar-university/" target="_blank" rel="noreferrer">
            <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    );
}