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

(function () {
  'use strict';

  // 11. Graceful branded fallback for any photograph that fails to load.
  // Replaces the browser's plain grey "broken image" box with an elegant
  // on-brand placeholder so a failed or slow photo never breaks the layout.
  try {
    var FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%232A2A27'/%3E%3Cstop offset='100%25' stop-color='%23141514'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23g)'/%3E%3Ctext x='400' y='320' font-family='Georgia,serif' font-size='120' fill='%23C5A880' fill-opacity='0.55' text-anchor='middle'%3EC%3C/text%3E%3Ctext x='400' y='380' font-family='Arial,sans-serif' font-size='16' letter-spacing='6' fill='%23C5A880' fill-opacity='0.4' text-anchor='middle'%3ECARTINUS%3C/text%3E%3C/svg%3E";

    document.addEventListener('error', function (e) {
      var target = e.target;
      if (target && target.tagName === 'IMG' && target.src.indexOf('data:image/svg+xml') !== 0) {
        target.src = FALLBACK_IMG;
        target.classList.add('img-fallback-active');
      }
    }, true);
  } catch (e) {}

  // 12. Floating "back to top" button for the long client-facing page.
  try {
    var backToTop = document.createElement('button');
    backToTop.id = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.title = 'Back to top';
    backToTop.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function syncBackToTop() {
      var clientView = document.getElementById('client-view');
      var isClientVisible = clientView && !clientView.classList.contains('hidden');
      backToTop.classList.toggle('visible', isClientVisible && window.scrollY > 500);
    }
    window.addEventListener('scroll', syncBackToTop, { passive: true });
    syncBackToTop();
  } catch (e) {}

})();

(function () {
  'use strict';

  // 13. Wire up the curtain-reveal photo effect. Elements bearing
  // .curtain-reveal or .curtain-reveal-card are styled in CSS to stay
  // covered until a "revealed" class is added, but nothing was previously
  // triggering that class -- this observes them (including ones rendered
  // dynamically later) and reveals each as it scrolls into view, with a
  // hard timeout safety net so a photo can never stay hidden behind a
  // plain covered panel indefinitely.
  try {
    function revealCurtain(el) { el.classList.add('revealed'); }

    function observeCurtains(io) {
      document.querySelectorAll('.curtain-reveal, .curtain-reveal-card').forEach(function (el) {
        if (!el.dataset.curtainObserved) {
          el.dataset.curtainObserved = '1';
          io.observe(el);
        }
      });
    }

    if ('IntersectionObserver' in window) {
      var curtainIO = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealCurtain(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

      observeCurtains(curtainIO);
      var curtainMo = new MutationObserver(function () { observeCurtains(curtainIO); });
      curtainMo.observe(document.body, { childList: true, subtree: true });
    } else {
      document.querySelectorAll('.curtain-reveal, .curtain-reveal-card').forEach(revealCurtain);
    }

    setTimeout(function () {
      document.querySelectorAll('.curtain-reveal, .curtain-reveal-card').forEach(revealCurtain);
    }, 1800);
  } catch (e) {}

  // 14. Repair any photo that is already broken (loaded with zero natural
  // size) even if no error event ever fired for it.
  try {
    function repairBrokenImages() {
      document.querySelectorAll('img').forEach(function (img) {
        if (img.complete && img.naturalWidth === 0 && img.src.indexOf('data:image/svg+xml') !== 0 && !img.dataset.repaired) {
          img.dataset.repaired = '1';
          img.dispatchEvent(new Event('error'));
        }
      });
    }
    setTimeout(repairBrokenImages, 1200);
    setTimeout(repairBrokenImages, 3000);
  } catch (e) {}

  // 15. Auto-close the mobile drawer whenever a nav link inside it is
  // tapped, so navigation always lands smoothly on the section instead of
  // leaving the drawer open over the content.
  try {
    var mobileDrawerEl = document.getElementById('mobile-drawer');
    if (mobileDrawerEl) {
      mobileDrawerEl.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function () {
          if (typeof window.closeMobileDrawer === 'function') {
            setTimeout(window.closeMobileDrawer, 150);
          }
        });
      });
    }
  } catch (e) {}

  // 16. Slim scroll-progress indicator for clearer wayfinding on the long
  // client-facing page.
  try {
    var progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.appendChild(progressBar);
    function syncScrollProgress() {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressBar.style.width = pct + '%';
    }
    window.addEventListener('scroll', syncScrollProgress, { passive: true });
    window.addEventListener('resize', syncScrollProgress);
    syncScrollProgress();
  } catch (e) {}

  // 17. Booking-flow polish: guest count clamping, inline email validation
  // feedback, and a friendly confirmation toast once a request is sent.
  try {
    var guestsInput = document.getElementById('booking-guests');
    if (guestsInput) {
      guestsInput.addEventListener('input', function () {
        var v = parseInt(guestsInput.value, 10);
        if (!isNaN(v) && v < 1) guestsInput.value = 1;
        if (!isNaN(v) && v > 20) guestsInput.value = 20;
      });
    }

    var emailInput = document.getElementById('booking-email');
    function isValidBookingEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    if (emailInput) {
      emailInput.addEventListener('blur', function () {
        var valid = emailInput.value === '' || isValidBookingEmail(emailInput.value);
        emailInput.style.borderColor = valid ? '' : '#E15B5B';
      });
      emailInput.addEventListener('input', function () {
        if (emailInput.style.borderColor) emailInput.style.borderColor = '';
      });
    }

    document.addEventListener('submit', function (e) {
      if (e.target && e.target.id === 'booking-form') {
        var toast = document.createElement('div');
        toast.textContent = 'Reservation request received \u2014 we will confirm shortly.';
        toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#1A1A1A;color:#fff;padding:14px 28px;border-radius:999px;font-size:13px;letter-spacing:0.03em;z-index:9999;box-shadow:0 15px 35px -10px rgba(0,0,0,0.5);opacity:0;transition:opacity 0.4s ease;';
        document.body.appendChild(toast);
        requestAnimationFrame(function () { toast.style.opacity = '1'; });
        setTimeout(function () {
          toast.style.opacity = '0';
          setTimeout(function () { toast.remove(); }, 400);
        }, 3600);
      }
    }, true);
  } catch (e) {}

})();
