(() => {
  document.addEventListener("DOMContentLoaded", () => {
    initSidebarToggle();
    initActiveNav();
    initFormValidation();
    initOtpGenerator();
  });

  function initSidebarToggle() {
    if (!document.body.classList.contains("dashboard-page")) return;

    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    const toggle = document.createElement("button");
    toggle.className = "sidebar-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Toggle navigation");

    const bar = document.createElement("span");
    toggle.appendChild(bar);
    document.body.appendChild(toggle);

    const closeSidebar = () => document.body.classList.remove("sidebar-open");

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      document.body.classList.toggle("sidebar-open");
    });

    document.addEventListener("click", (event) => {
      if (
        !document.body.classList.contains("sidebar-open") ||
        sidebar.contains(event.target) ||
        toggle.contains(event.target)
      ) {
        return;
      }
      closeSidebar();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeSidebar();
      }
    });
  }

  function initActiveNav() {
    const current = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-item[href]").forEach((link) => {
      const target = link.getAttribute("href");
      if (!target) return;
      const targetName = target.split("/").pop();
      if (targetName === current) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initFormValidation() {
    const forms = document.querySelectorAll("form[data-validate='basic']");
    if (!forms.length) return;

    forms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        const requiredFields = Array.from(
          form.querySelectorAll("[required]")
        );

        const invalid = requiredFields.filter(
          (field) => !field.value || !field.value.trim()
        );

        if (invalid.length) {
          event.preventDefault();
          invalid[0].focus();
          showToast("Please fill all required fields", "error");
          return;
        }

        showToast("Form submitted successfully!", "success");
      });
    });
  }

  function initOtpGenerator() {
    const triggers = document.querySelectorAll(".otp-trigger[data-otp-target]");
    if (!triggers.length) return;

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", async () => {
        if (trigger.dataset.cooldownActive === "true") return;

        const targetSelector = trigger.getAttribute("data-otp-target");
        const contactSelector = trigger.getAttribute("data-otp-contact");
        const channel = trigger.getAttribute("data-otp-channel") || "sms";

        if (!targetSelector || !contactSelector) {
          showToast("OTP configuration is incomplete", "error");
          return;
        }

        const targetInput = document.querySelector(targetSelector);
        const contactInput = document.querySelector(contactSelector);

        if (!targetInput || !contactInput) {
          showToast("OTP field not found", "error");
          return;
        }

        const contactValue = (contactInput.value || "").trim();
        if (!contactValue) {
          showToast("Please enter your phone number before requesting OTP", "error");
          contactInput.focus();
          return;
        }

        if (channel === "sms" && !isValidPhone(contactValue)) {
          showToast("Enter a valid phone number to receive OTP", "error");
          contactInput.focus();
          return;
        }

        const length =
          parseInt(trigger.getAttribute("data-otp-length"), 10) || 6;
        const otp = generateOtp(length);

        try {
          trigger.disabled = true;
          trigger.textContent = "Sending...";
          await sendOtp(contactValue, otp, channel);
          targetInput.value = "";
          startOtpCooldown(trigger);
          showToast(`OTP sent to ${contactValue}`, "success");
        } catch (error) {
          console.error(error);
          trigger.disabled = false;
          trigger.textContent = trigger.dataset.originalText || "Send OTP";
          showToast("Failed to send OTP. Please try again.", "error");
        }
      });
    });
  }

  function isValidPhone(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 14;
  }

  function generateOtp(length = 6) {
    const digits = Math.max(1, length);
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  function sendOtp(contact, otp, channel = "sms") {
    // Placeholder for real API integration.
    // Replace this block with an actual fetch call to your backend SMS/Email service.
    console.info(`Sending ${channel.toUpperCase()} OTP ${otp} to ${contact}`);
    return new Promise((resolve) => setTimeout(resolve, 1200));
  }

  function startOtpCooldown(button) {
    const cooldown = parseInt(button.getAttribute("data-otp-cooldown"), 10) || 30;
    const originalText = button.dataset.originalText || button.textContent.trim();

    button.dataset.originalText = originalText;
    button.dataset.cooldownActive = "true";
    button.disabled = true;

    let remaining = cooldown;
    button.textContent = `Sent (${remaining}s)`;

    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(interval);
        button.disabled = false;
        button.textContent = originalText;
        delete button.dataset.cooldownActive;
        return;
      }
      button.textContent = `Sent (${remaining}s)`;
    }, 1000);
  }

  let toastTimeout;
  function showToast(message, type = "success") {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
})();

