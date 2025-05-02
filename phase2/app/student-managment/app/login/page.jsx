'use client';

import { useState, useEffect } from 'react';
import { loginAction } from '@/app/actions/Login-actions';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    createBackgroundElements();
  }, []);

  const login = async () => {

    const user = await loginAction(email,password);
    if (!user) {
        alert('Incorrect email or password');
        return;
    }
    localStorage.setItem('user', JSON.stringify(user));
    switch (user.role) {
      case 'ADMIN':
        router.push('/Admin');
        break;
      case 'INSTRUCTOR':
        router.push('/Instructor');
        break;
      case 'STUDENT':
        router.push('/Student');
        break;
    }
  };

  const togglePassword = () => {
    const passwordInput = document.getElementById('user-password');
    const eyeIcon = document.getElementById('eye-icon');

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-10-7-10-7a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 10 7 10 7a18.5 18.5 0 01-2.16 3.19" />
        <path d="M14.12 14.12A3 3 0 119.88 9.88" />
        <line x1="1" y1="1" x2="23" y2="23" />
      `;
    } else {
      passwordInput.type = 'password';
      eyeIcon.innerHTML = `
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      `;
    }
  };

  return (
    <>
      <div className="background-container" id="background">
        <div className="particles" id="particles"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please sign in to your account</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); login(); }}>
          <div className="form-group">
            <label htmlFor="user-email">Email</label>
            <div className="input-group">
              <div className="input-icon">
                <svg className="icon" viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 5-10-5" />
                </svg>
              </div>
              <input
                type="email"
                id="user-email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="user-password">Password</label>
            <div className="input-group">
              <div className="input-icon">
                <svg className="icon" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <input
                type="password"
                id="user-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="password-toggle" onClick={togglePassword}>
                <svg className="icon" id="eye-icon" viewBox="0 0 24 24">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" id="Login-btn">Sign in</button>
        </form>
      </div>
    </>
  );
}

function createBackgroundElements() {
  const background = document.getElementById('background');
  const particlesContainer = document.getElementById('particles');
  createParticles(particlesContainer, 100);
  createGlowingOrbs(background, 5);
  createShootingStars(background, 5);
  createFloatingShapes(background, 15);
  addMouseInteraction();
}

 // Create particles
 function createParticles(container, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2px and 8px
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random starting position
        const posX = Math.random() * 100;
        particle.style.left = `${posX}%`;
        
        // Random animation duration between 10s and 30s
        const duration = Math.random() * 20 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay so they don't all start at once
        const delay = Math.random() * 10;
        particle.style.animationDelay = `${delay}s`;
        
        // Random opacity
        const opacity = Math.random() * 0.5 + 0.1;
        particle.style.opacity = opacity;
        
        // Add particle to container
        container.appendChild(particle);
    }
}

// Create glowing orbs
function createGlowingOrbs(container, count) {
    const colors = [
        'rgba(30, 144, 255, 0.2)',
        'rgba(138, 43, 226, 0.2)',
        'rgba(255, 105, 180, 0.2)',
        'rgba(50, 205, 50, 0.2)',
        'rgba(255, 215, 0, 0.2)'
    ];
    
    for (let i = 0; i < count; i++) {
        const orb = document.createElement('div');
        orb.className = 'glow';
        
        // Random size between 100px and 300px
        const size = Math.random() * 200 + 100;
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        
        // Random position
        orb.style.top = `${Math.random() * 100}%`;
        orb.style.left = `${Math.random() * 100}%`;
        
        // Random color
        const colorIndex = Math.floor(Math.random() * colors.length);
        orb.style.background = `radial-gradient(circle, ${colors[colorIndex]} 0%, rgba(30, 144, 255, 0) 70%)`;
        
        // Random animation duration and delay
        const duration = Math.random() * 10 + 5;
        orb.style.animationDuration = `${duration}s`;
        orb.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(orb);
    }
}

// Create shooting stars
function createShootingStars(container, count) {
    for (let i = 0; i < count; i++) {
        createShootingStar(container);
    }
    
    // Create new shooting stars periodically
    setInterval(() => {
        const stars = document.querySelectorAll('.shooting-star');
        if (stars.length < 10) { // Limit the number of stars
            createShootingStar(container);
        }
    }, 3000);
}

function createShootingStar(container) {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    
    // Random position
    star.style.top = `${Math.random() * 50}%`;
    
    // Random animation duration
    const duration = Math.random() * 3 + 2;
    star.style.animationDuration = `${duration}s`;
    
    // Random rotation
    const rotation = Math.random() * 20 - 10;
    star.style.transform = `rotate(${rotation}deg)`;
    
    container.appendChild(star);
    
    // Remove the star after animation completes
    setTimeout(() => {
        if (star.parentNode === container) {
            container.removeChild(star);
        }
    }, duration * 1000);
}

// Create floating shapes
function createFloatingShapes(container, count) {
    const shapeTypes = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < count; i++) {
        const shape = document.createElement('div');
        
        // Random shape type
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        shape.className = `shape ${shapeType}`;
        
        // Random size between 20px and 80px
        const size = Math.random() * 60 + 20;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        
        // Random position
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.left = `${Math.random() * 100}%`;
        
        // Random animation duration and delay
        const duration = Math.random() * 10 + 5;
        shape.style.animationDuration = `${duration}s`;
        shape.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(shape);
    }
}

// Add mouse interaction
function addMouseInteraction() {
    const background = document.getElementById('background');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Move particles slightly based on mouse position
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 20;
            particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        // Create a new particle occasionally on mouse move
        if (Math.random() > 0.95) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.left = `${e.clientX}px`;
            particle.style.top = `${e.clientY}px`;
            particle.style.opacity = '0.8';
            particle.style.animation = 'none';
            
            // Animate the particle away from the cursor
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 100 + 50;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            particle.animate([
                { transform: 'translate(0, 0)', opacity: 0.8 },
                { transform: `translate(${vx}px, ${vy}px)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            });
            
            background.appendChild(particle);
            
            // Remove the particle after animation
            setTimeout(() => {
                if (particle.parentNode === background) {
                    background.removeChild(particle);
                }
            }, 1000);
        }
    });
}

