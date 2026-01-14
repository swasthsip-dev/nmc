/* ============================================
   Namma Millets Café - Main JavaScript
   Handles navigation, animations, and interactions
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  /* ============================================
       Page Loader Logic
       ============================================ */
  const loader = document.getElementById("loader")

  if (loader) {
    // Ensure loader stays for at least 800ms for branding visibility
    const updatedLoadTime = new Date().getTime()

    window.addEventListener("load", () => {
      const currentTime = new Date().getTime()
      const timeDiff = currentTime - updatedLoadTime
      const minTime = 800 // Minimum time in ms
      const delay = Math.max(0, minTime - timeDiff)

      setTimeout(() => {
        loader.classList.add("hidden")
        // Optional: Remove from DOM after fade out
        setTimeout(() => {
          loader.style.display = "none"
        }, 500)
      }, delay)
    })

    // Fallback: Force hide after 5 seconds if load event doesn't fire
    setTimeout(() => {
      if (!loader.classList.contains("hidden")) {
        loader.classList.add("hidden")
      }
    }, 5000)
  }
  /* ============================================
       Mobile Navigation Toggle
       ============================================ */
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")
  const navClose = document.getElementById("nav-close")
  const navLinks = document.querySelectorAll(".nav-link")

  // Create overlay element for mobile menu
  const overlay = document.createElement("div")
  overlay.className = "nav-overlay"
  document.body.appendChild(overlay)

  // Open mobile menu
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("active")
      overlay.classList.add("active")
      document.body.style.overflow = "hidden" // Prevent scroll when menu open
    })
  }

  // Close mobile menu function
  function closeMenu() {
    navMenu.classList.remove("active")
    overlay.classList.remove("active")
    document.body.style.overflow = "" // Restore scroll
  }

  // Close menu on close button click
  if (navClose) {
    navClose.addEventListener("click", closeMenu)
  }

  // Close menu on overlay click
  overlay.addEventListener("click", closeMenu)

  // Close menu when clicking on a nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu)
  })

  /* ============================================
       Header Scroll Effect
       Add shadow and background change on scroll
       ============================================ */
  const header = document.getElementById("header")

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  }

  window.addEventListener("scroll", handleScroll)

  /* ============================================
       Back to Top Button
       Show/hide and scroll functionality
       ============================================ */
  const backToTop = document.getElementById("back-to-top")

  // Show/hide button based on scroll position
  function handleBackToTopVisibility() {
    if (window.scrollY > 400) {
      backToTop.classList.add("visible")
    } else {
      backToTop.classList.remove("visible")
    }
  }

  window.addEventListener("scroll", handleBackToTopVisibility)

  // Scroll to top on click
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  /* ============================================
       Smooth Scroll for Anchor Links
       ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")

      // Skip if href is just "#"
      if (href === "#") return

      const target = document.querySelector(href)

      if (target) {
        e.preventDefault()

        const headerHeight = header.offsetHeight
        const targetPosition = target.offsetTop - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  /* ============================================
       Contact Form Handling
       Basic form validation and submission feedback
       ============================================ */
  const contactForm = document.getElementById("contact-form")
  const formStatus = document.getElementById("form-status")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("name").value.trim()
      const email = document.getElementById("email").value.trim()
      const message = document.getElementById("message").value.trim()

      // Basic validation
      if (!name || !email || !message) {
        showFormStatus("Please fill in all fields.", "error")
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        showFormStatus("Please enter a valid email address.", "error")
        return
      }

      // Google Apps Script URL
      const scriptURL = "https://script.google.com/macros/s/AKfycbypL8DiLhPG29jn4l5fe5jlbb1j_u_Slud1raZXmQmgbb34H6OriymSM2BiwW8V8tJSgQ/exec"

      // UI Elements
      const loader = document.getElementById("formLoader")
      const successMsg = document.getElementById("formSuccess")
      const errorMsg = document.getElementById("formError")
      const submitBtn = contactForm.querySelector("button[type='submit']")

      // Reset UI
      successMsg.style.display = "none"
      errorMsg.style.display = "none"
      loader.style.display = "block"
      submitBtn.disabled = true

      // Create FormData object
      const formData = new FormData(contactForm)

      // Send data to Google Apps Script
      fetch(scriptURL, {
        method: "POST",
        body: formData,
        mode: "no-cors"
      })
        .then(() => {
          loader.style.display = "none"
          successMsg.style.display = "block"
          contactForm.reset()
        })
        .catch(error => {
          console.error('Error!', error.message)
          loader.style.display = "none"
          errorMsg.style.display = "block"
        })
        .finally(() => {
          submitBtn.disabled = false
          // Hide success message after 5 seconds
          setTimeout(() => {
            successMsg.style.display = "none"
            errorMsg.style.display = "none"
          }, 5000)
        })
    })
  }

  // Show form status message
  function showFormStatus(message, type) {
    formStatus.textContent = message
    formStatus.className = "form-status " + type
    formStatus.style.display = "block"
  }

  /* ============================================
       Intersection Observer for Animations
       Animate elements when they come into view
       ============================================ */
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".featured-card, .menu-category, .menu-card, .benefit-card, .vm-card, .contact-card",
  )

  animateElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  // Add animate-in styles
  const style = document.createElement("style")
  style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `
  document.head.appendChild(style)

  /* ============================================
       Social Page Link Animation
       Staggered animation for social links
       ============================================ */
  const socialLinks = document.querySelectorAll(".social-link-card")

  socialLinks.forEach((link, index) => {
    link.style.opacity = "0"
    link.style.transform = "translateY(20px)"
    link.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    link.style.transitionDelay = index * 0.1 + "s"

    // Trigger animation after a short delay
    setTimeout(() => {
      link.style.opacity = "1"
      link.style.transform = "translateY(0)"
    }, 100)
  })

  /* ============================================
       Active Navigation Link Highlight
       Highlight current section in navigation
       ============================================ */
  const sections = document.querySelectorAll("section[id]")

  function highlightNavLink() {
    const scrollY = window.scrollY

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight
      const sectionTop = section.offsetTop - 100
      const sectionId = section.getAttribute("id")
      const navLink = document.querySelector('.nav-link[href="#' + sectionId + '"]')

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add("active")
        } else {
          navLink.classList.remove("active")
        }
      }
    })
  }

  window.addEventListener("scroll", highlightNavLink)

  // Add active link styles
  const activeStyle = document.createElement("style")
  activeStyle.textContent = `
        .nav-link.active {
            color: var(--color-primary);
            background-color: var(--color-cream);
        }
    `
  document.head.appendChild(activeStyle)

  /* ============================================
       Console Welcome Message
       For developers inspecting the site
       ============================================ */
  console.log("%c🌾 Namma Millets Café", "color: #8B5A2B; font-size: 24px; font-weight: bold;")
  console.log("%cOrganic & Homely Food - Rooted in Karnataka's Heritage", "color: #666; font-size: 14px;")
  console.log("%c📍 16th Cross, BTM 2nd Stage, Bengaluru", "color: #999; font-size: 12px;")
  /* ============================================
       Hero Background Slideshow
       ============================================ */
  const heroBg = document.querySelector(".hero-bg-image")
  if (heroBg) {
    const images = [
      "images/bg2.jpg",
      "images/bg1.png"
    ]
    let currentIndex = 0

    // Preload images
    images.forEach(src => {
      const img = new Image()
      img.src = src
    })

    // Set initial image immediately
    heroBg.style.backgroundImage = `url("${images[0]}")`

    setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length
      heroBg.style.backgroundImage = `url("${images[currentIndex]}")`
    }, 5000) // Change image every 5 seconds
  }

  /* ============================================
       Parallax Effect for Hero Background
       ============================================ */
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroBg = document.querySelector(".hero-bg-image")
    if (heroBg) {
      // Move background at 50% speed of scroll
      heroBg.style.transform = `translateY(${scrolled * 0.5}px)`
    }
  })

  /* ============================================
       Button Ripple Effect
       ============================================ */
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach(btn => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
})
