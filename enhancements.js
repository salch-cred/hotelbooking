(function () {
  'use strict';

  // 1. Favicon (brand monogram)
  try {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23090A09'/%3E%3Ctext x='50' y='68' font-size='58' font-family='Georgia,serif' fill='%23C5A880' text-anchor='middle'%3EC%3C/text%3E%3C/svg%3E";
  } catch (e) {}

  // 2. Meta description (on-page/basic crawler value)
  try {
    var desc = document.querySelector("meta[name='description']");
    if (!desc) {
      desc = document.createElement('meta');
      desc.name = 'description';
      document.head.appendChild(desc);
    }
    desc.content = "Cartinus is a bespoke luxury sanctuary offering refined suites, Michelin-inspired dining, and geothermal spa experiences nestled in mist-shrouded valleys.";
  } catch (e) {}

  var FAQ_HTML = "<div style='text-align:left'><p><strong>What time is check-in/check-out?</strong><br>Check-in is 3:00 PM, check-out is 12:00 PM.</p><p><strong>Do you accommodate dietary restrictions?</strong><br>Yes, note this in the booking request field and our culinary team will prepare accordingly.</p><p><strong>Is the geothermal spa included?</strong><br>Spa access can be added during booking or via the Concierge planner.</p></div>";
  var PRIVACY_HTML = "<div style='text-align:left'><p>Cartinus collects only the information you provide when making a reservation (name, email, stay preferences) to process your booking. We do not sell or share your data with third parties. Data is stored securely and used solely to manage your reservation experience.</p></div>";

  function showInfoModal(title, bodyHtml) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;padding:24px;';
    overlay.innerHTML = '<div style="background:#141514;color:#E0DFDB;max-width:520px;width:100%;border-radius:24px;padding:32px;font-family:sans-serif;font-size:13px;line-height:1.6;position:relative;">' +
      '<button aria-label="Close" style="position:absolute;top:16px;right:16px;background:none;border:none;color:#E0DFDB;font-size:18px;cursor:pointer;">&times;</button>' +
      '<h3 style="font-size:20px;margin-bottom:16px;font-weight:300;">' + title + '</h3>' + bodyHtml + '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('button').addEventListener('click', function () { overlay.remove(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
  }

  // 3. Footer link fixes
  try {
    var footerLinks = document.querySelectorAll('footer a');
    footerLinks.forEach(function (a) {
      var label = a.textContent.trim();
      if (label === 'Contact') {
        a.href = 'mailto:reservations@cartinus.com';
      } else if (label === 'FAQ') {
        a.href = '#';
        a.addEventListener('click', function (e) { e.preventDefault(); showInfoModal('Frequently Asked Questions', FAQ_HTML); });
      } else if (label === 'Privacy') {
        a.href = '#';
        a.addEventListener('click', function (e) { e.preventDefault(); showInfoModal('Privacy Policy', PRIVACY_HTML); });
      }
    });

    var footerSpans = document.querySelectorAll('footer span.cursor-pointer');
    footerSpans.forEach(function (span) {
      var label = span.textContent.trim();
      var url = label === 'Instagram' ? 'https://instagram.com/cartinus' : (label === 'Twitter' ? 'https://twitter.com/cartinus' : null);
      if (url) {
        span.addEventListener('click', function () { window.open(url, '_blank', 'noopener'); });
      }
    });
  } catch (e) {}

  // 4. Admin panel access lock (front-end deterrent, not a backend security measure)
  try {
    var ADMIN_PASSCODE = 'cartinus2026';
    var originalToggleView = window.toggleView;
    var adminUnlocked = sessionStorage.getItem('cartinus_admin_unlocked') === 'yes';
    window.toggleView = function (view) {
      if (view === 'admin' && !adminUnlocked) {
        var entered = window.prompt('Enter admin passcode to access the Portal Admin dashboard:');
        if (entered === ADMIN_PASSCODE) {
          adminUnlocked = true;
          sessionStorage.setItem('cartinus_admin_unlocked', 'yes');
        } else {
          if (entered !== null) { window.alert('Incorrect passcode. Access denied.'); }
          return;
        }
      }
      return originalToggleView(view);
    };
  } catch (e) {}

  // 5. Booking notification draft email (no-backend business notification)
  try {
    document.addEventListener('submit', function (e) {
      if (e.target && e.target.id === 'booking-form') {
        var nameEl = document.getElementById('booking-name');
        var emailEl = document.getElementById('booking-email');
        var expEl = document.getElementById('booking-experience');
        var dateEl = document.getElementById('booking-date');
        var timeEl = document.getElementById('booking-time');
        var guestsEl = document.getElementById('booking-guests');
        var requestsEl = document.getElementById('booking-requests');

        var name = nameEl ? nameEl.value : '';
        var email = emailEl ? emailEl.value : '';
        var exp = expEl ? expEl.value : '';
        var date = dateEl ? dateEl.value : '';
        var time = timeEl ? timeEl.value : '';
        var guests = guestsEl ? guestsEl.value : '';
        var requests = requestsEl ? requestsEl.value : '';

        var subject = encodeURIComponent('New Cartinus Reservation Request: ' + name);
        var body = encodeURIComponent(
          'New reservation request received:\n\n' +
          'Guest: ' + name + '\n' +
          'Email: ' + email + '\n' +
          'Sanctuary: ' + exp + '\n' +
          'Date: ' + date + '\n' +
          'Time: ' + time + '\n' +
          'Guests: ' + guests + '\n' +
          'Requests: ' + requests
        );
        var mailto = 'mailto:reservations@cartinus.com?subject=' + subject + '&body=' + body;
        setTimeout(function () { window.open(mailto, '_blank'); }, 900);
      }
    }, true);
  } catch (e) {}

})();

(function () {
  'use strict';

  var OVERLAY_IDS = ['mobile-drawer', 'booking-drawer', 'detail-modal', 'dish-modal'];

  function anyOverlayVisible() {
    for (var i = 0; i < OVERLAY_IDS.length; i++) {
      var el = document.getElementById(OVERLAY_IDS[i]);
      if (el && !el.classList.contains('hidden')) return true;
    }
    return false;
  }

  function syncOverlayState() {
    document.body.classList.toggle('overlay-open', anyOverlayVisible());
  }

  // 6. Fix: reliably keep the fixed header from ever visually overlapping
  // or being clickable through an open drawer/modal, regardless of which
  // app.js function triggered the open/close. This watches each overlay's
  // class attribute directly instead of hooking every open/close function.
  try {
    OVERLAY_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var observer = new MutationObserver(syncOverlayState);
      observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    });
    syncOverlayState();
  } catch (e) {}

  // 7. Escape key closes whichever overlay is currently open.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    try {
      var mobileDrawer = document.getElementById('mobile-drawer');
      if (mobileDrawer && !mobileDrawer.classList.contains('hidden') && typeof window.closeMobileDrawer === 'function') {
        window.closeMobileDrawer();
      }
      var bookingDrawer = document.getElementById('booking-drawer');
      var closeBookingBtn = document.getElementById('close-booking-btn');
      if (bookingDrawer && !bookingDrawer.classList.contains('hidden') && closeBookingBtn) closeBookingBtn.click();
      var detailModal = document.getElementById('detail-modal');
      var closeDetailBtn = document.getElementById('close-detail-btn');
      if (detailModal && !detailModal.classList.contains('hidden') && closeDetailBtn) closeDetailBtn.click();
      var dishModal = document.getElementById('dish-modal');
      var closeDishBtn = document.getElementById('close-dish-btn');
      if (dishModal && !dishModal.classList.contains('hidden') && closeDishBtn) closeDishBtn.click();
    } catch (err) {}
  });

  // 8. If the window is resized up to desktop width while the mobile drawer
  // is open, close it automatically so it can never get stuck open behind
  // (or on top of) the desktop nav.
  window.addEventListener('resize', function () {
    try {
      if (window.innerWidth >= 768) {
        var mobileDrawer = document.getElementById('mobile-drawer');
        if (mobileDrawer && !mobileDrawer.classList.contains('hidden') && typeof window.closeMobileDrawer === 'function') {
          window.closeMobileDrawer();
        }
      }
    } catch (e) {}
  });

  // 9. Header gains a soft shadow once the page scrolls (visual polish).
  try {
    var headerEl = document.querySelector('header');
    function syncHeaderScroll() {
      if (!headerEl) return;
      headerEl.classList.toggle('header-scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', syncHeaderScroll, { passive: true });
    syncHeaderScroll();
  } catch (e) {}

  // 10. Active-page nav highlight (scrollspy) across desktop + mobile nav links.
  try {
    var sectionIds = ['hero', 'sanctuaries', 'atelier', 'architect'];
    function clearActiveLinks() {
      document.querySelectorAll('.nav-link-active').forEach(function (a) {
        a.classList.remove('nav-link-active');
      });
    }
    function setActiveSection(id) {
      clearActiveLinks();
      document.querySelectorAll('a[href="#' + id + '"]').forEach(function (a) {
        a.classList.add('nav-link-active');
      });
    }
    var sectionEls = sectionIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (sectionEls.length && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (en) { return en.isIntersecting; })
          .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
        if (visible.length) setActiveSection(visible[0].target.id);
      }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
      sectionEls.forEach(function (el) { io.observe(el); });
    }
  } catch (e) {}

})();
