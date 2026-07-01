// ==========================================
// 0. RUNTIME DOM REPAIR: inject modals missing from index.html
// (success-modal + edit-modal). Without these, completing a booking or
// clicking "Edit" in the admin ledger threw a TypeError deep in this file
// (document.getElementById(...) returned null), which silently aborted
// the rest of the click handler -- the booking drawer never closed, no
// confirmation ever appeared, and edits never opened. This runs
// synchronously (NOT inside a DOMContentLoaded listener) so the elements
// already exist in the DOM before the DOMContentLoaded handler below
// queries them.
// ==========================================
(function () {
  try {
    if (!document.getElementById('success-modal')) {
      var successModal = document.createElement('div');
      successModal.id = 'success-modal';
      successModal.className = 'fixed inset-0 z-50 bg-black/70 hidden items-center justify-center p-6';
      successModal.innerHTML = `
        <div class="absolute inset-0"></div>
        <div class="relative bg-ivory-card dark:bg-[#141514] rounded-[2.5rem] max-w-md w-full border border-ivory-border dark:border-[#222522] shadow-2xl overflow-hidden p-10 text-center space-y-6">
          <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <svg class="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <div class="space-y-2">
            <span class="text-[9px] tracking-[0.3em] uppercase text-ivory-gold dark:text-evening-gold font-bold block">Reservation Secured</span>
            <h3 class="font-serif text-2xl font-light text-ivory-dark dark:text-white">Thank You For Booking</h3>
          </div>
          <div class="text-left bg-ivory-bg/40 dark:bg-[#090A09]/50 rounded-2xl border border-ivory-border dark:border-[#222522] p-5 space-y-2 text-xs">
            <div class="flex justify-between border-b border-ivory-border/50 pb-2"><span class="text-ivory-muted">Reservation ID:</span><span id="summary-id" class="font-mono font-medium text-ivory-dark dark:text-white">-</span></div>
            <div class="flex justify-between border-b border-ivory-border/50 pb-2"><span class="text-ivory-muted">Guest:</span><span id="summary-name" class="font-medium text-ivory-dark dark:text-white">-</span></div>
            <div class="flex justify-between border-b border-ivory-border/50 pb-2"><span class="text-ivory-muted">Sanctuary:</span><span id="summary-experience" class="font-medium text-ivory-dark dark:text-white">-</span></div>
            <div class="flex justify-between"><span class="text-ivory-muted">Arrival:</span><span id="summary-datetime" class="font-medium text-ivory-dark dark:text-white">-</span></div>
          </div>
          <p class="text-[10px] text-ivory-muted dark:text-evening-muted font-light leading-relaxed">A confirmation email with full itinerary details will be sent shortly. Our concierge team will reach out to finalize any bespoke requests.</p>
          <button id="close-success-btn" class="w-full py-3.5 rounded-xl bg-ivory-dark hover:bg-ivory-gold text-white text-[10px] tracking-widest uppercase font-medium transition-all cursor-pointer">Return to Sanctuary</button>
        </div>
      `;
      document.body.appendChild(successModal);
    }

    if (!document.getElementById('edit-modal')) {
      var editModal = document.createElement('div');
      editModal.id = 'edit-modal';
      editModal.className = 'fixed inset-0 z-50 bg-black/70 hidden items-center justify-center p-6';
      editModal.innerHTML = `
        <div class="absolute inset-0"></div>
        <div class="relative bg-ivory-card dark:bg-[#141514] rounded-[2.5rem] max-w-lg w-full border border-ivory-border dark:border-[#222522] shadow-2xl overflow-hidden p-8 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <div>
              <span class="text-[9px] tracking-[0.3em] uppercase text-ivory-gold dark:text-evening-gold font-bold block">Ledger Record</span>
              <h3 class="font-serif text-2xl font-light text-ivory-dark dark:text-white">Edit Reservation</h3>
            </div>
            <button id="close-edit-btn" class="p-2 rounded-full border border-ivory-border dark:border-[#222522] hover:bg-ivory-bg dark:hover:bg-[#090A09] transition-all cursor-pointer text-ivory-dark dark:text-white">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form id="edit-form" class="space-y-4 text-xs">
            <input type="hidden" id="edit-booking-id">
            <div class="space-y-1">
              <label class="text-[9px] uppercase tracking-widest text-ivory-muted dark:text-evening-muted font-medium">Guest Name</label>
              <input type="text" id="edit-guest-name" required class="w-full bg-ivory-bg/50 dark:bg-[#090A09] border border-ivory-border dark:border-[#222522] rounded-xl px-4 py-2.5 focus:outline-none focus:border-ivory-gold transition-colors text-xs text-ivory-dark dark:text-white">
            </div>
            <div class="space-y-1">
              <label class="text-[9px] uppercase tracking-widest text-ivory-muted dark:text-evening-muted font-medium">Email</label>
              <input type="email" id="edit-guest-email" required class="w-full bg-ivory-bg/50 dark:bg-[#090A09] border border-ivory-border dark:border-[#222522] rounded-xl px-4 py-2.5 focus:outline-none focus:border-ivory-gold transition-colors text-xs text-ivory-dark dark:text-white">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-[9px] uppercase tracking-widest text-ivory-muted dark:text-evening-muted font-medium">Experience</label>
                <select id="edit-guest-experience" class="w-full bg-ivory-bg/50 dark:bg-[#090A09] border border-ivory-border dark:border-[#222522] rounded-xl px-2 py-2.5 focus:outline-none focus:border-ivory-gold transition-colors text-xs text-ivory-dark dark:text-white cursor-pointer">
                  <option value="The Ocean Sanctuary">Ocean Observatory</option>
                  <option value="The Emerald Chamber">Emerald Chamber</option>
                  <option value="The Epicurean Atrium">Epicurean Atrium</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-[9px] uppercase tracking-widest text-ivory-muted dark:text-evening-muted font-medium">Guests Count</label>
                <select id="edit-guest-count" class="w-full bg-ivory-bg/50 dark:bg-[#090A09] border border-ivory-border dark:border-[#222522] rounded-xl px-2 py-2.5 focus:outline-none focus:border-ivory-gold transition-colors text-xs text-ivory-dark dark:text-white cursor-pointer">
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6+ (Private Lounge)</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-[9px] uppercase tracking-widest text-ivory-muted dark:text-evening-muted font-medium">Date</label>
                <input type="date" id="edit-guest-date" required class="w-full bg-ivory-bg/50 dark:bg-[#090A09] border border-ivory-border dark:border-[#222522] rounded-xl px-3 py-2.5 focus:outline-none focus:border-ivory-gold transition-colors text-xs text-ivory-dark dark:text-white cursor-pointer">
              </div>
              <div class="space-y-1">
                <label class="text-[9px] uppercase tracking-widest text-ivory-muted dark:text-evening-muted font-medium">Time Slot</label>
                <select id="edit-guest-time" class="w-full bg-ivory-bg/50 dark:bg-[#090A09] border border-ivory-border dark:border-[#222522] rounded-xl px-2 py-2.5 focus:outline-none focus:border-ivory-gold transition-colors text-xs text-ivory-dark dark:text-white cursor-pointer">
                  <option value="11:30 AM">11:30 AM (Brunch)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon)</option>
                  <option value="06:30 PM">06:30 PM (Sunset)</option>
                  <option value="08:30 PM">08:30 PM (Late Night)</option>
                </select>
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-[9px] uppercase tracking-widest text-ivory-muted dark:text-evening-muted font-medium">Booking Status</label>
              <select id="edit-guest-status" class="w-full bg-ivory-bg/50 dark:bg-[#090A09] border border-ivory-border dark:border-[#222522] rounded-xl px-2 py-2.5 focus:outline-none focus:border-ivory-gold transition-colors text-xs text-ivory-dark dark:text-white cursor-pointer">
                <option value="Pending">Pending Confirmation</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <button type="submit" class="w-full bg-ivory-dark hover:bg-ivory-gold text-white font-light tracking-[0.2em] text-[10px] uppercase py-3.5 rounded-xl transition-all cursor-pointer mt-2">Save Changes</button>
          </form>
        </div>
      `;
      document.body.appendChild(editModal);
    }
  } catch (e) {}
})();

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================
  // 1. DATA SEEDING & DATABASE DEFINITION
  // ==========================================
  const PRICE_MAP = {
    "The Ocean Sanctuary": 650,
    "The Emerald Chamber": 220,
    "The Epicurean Atrium": 195
  };

  // Approximate USD -> INR conversion for displaying dual currency pricing
  const USD_TO_INR_RATE = 83;
  function formatDualPrice(usdAmount) {
    const inrAmount = Math.round(usdAmount * USD_TO_INR_RATE);
    return `$${usdAmount.toLocaleString('en-US')} (\u20b9${inrAmount.toLocaleString('en-IN')})`;
  }

  const initialSeedBookings = [
    { id: "CRT-58190-Q", name: "Lord Hamilton", email: "hamilton@estate.co.uk", experience: "The Ocean Sanctuary", date: "2026-07-02", time: "06:30 PM", guests: "2", status: "Confirmed" },
    { id: "CRT-19204-Y", name: "Lady Beatrice", email: "beatrice@castle.net", experience: "The Emerald Chamber", date: "2026-07-04", time: "02:00 PM", guests: "1", status: "Pending" },
    { id: "CRT-77391-A", name: "Count Rostov", email: "rostov@winter.org", experience: "The Epicurean Atrium", date: "2026-07-06", time: "08:30 PM", guests: "4", status: "Confirmed" },
    { id: "CRT-30491-M", name: "Baroness Vane", email: "vane@manor.co", experience: "The Ocean Sanctuary", date: "2026-07-01", time: "11:30 AM", guests: "3", status: "Cancelled" },
    { id: "CRT-49210-Z", name: "Sir Alistair", email: "alistair@regent.co.uk", experience: "The Epicurean Atrium", date: "2026-07-03", time: "06:30 PM", guests: "2", status: "Pending" }
  ];

  function getBookings() {
    const data = localStorage.getItem('cartinus_bookings');
    if (!data) {
      localStorage.setItem('cartinus_bookings', JSON.stringify(initialSeedBookings));
      return initialSeedBookings;
    }
    return JSON.parse(data);
  }

  function saveBookings(bookings) {
    localStorage.setItem('cartinus_bookings', JSON.stringify(bookings));
    updateAdminStats();
    renderBookingsTable();
  }


  // ==========================================
  // 1.5 OVERLAY MUTUAL-EXCLUSION HELPER
  // ==========================================
  function closeAllOverlayPanels(exceptId) {
    const overlayConfigs = [
      { id: 'booking-drawer', hideClass: 'translate-x-full', showClass: 'translate-x-0' },
      { id: 'detail-modal', hideClass: 'scale-95', showClass: 'scale-100' },
      { id: 'dish-modal', hideClass: 'scale-95', showClass: 'scale-100' }
    ];

    overlayConfigs.forEach(cfg => {
      if (cfg.id === exceptId) return;
      const overlayEl = document.getElementById(cfg.id);
      if (!overlayEl || overlayEl.classList.contains('hidden')) return;

      const inner = overlayEl.querySelector('.relative');
      if (inner) {
        inner.classList.add(cfg.hideClass);
        inner.classList.remove(cfg.showClass);
      }
      overlayEl.classList.add('hidden');
      overlayEl.classList.remove('flex');
    });
  }


  // ==========================================
  // 2. LUXURY PRELOADER TIMELINE
  // ==========================================
  const preloader = document.getElementById('preloader');
  const loaderBrand = document.getElementById('loader-brand');

  if (loaderBrand) {
    setTimeout(() => {
      loaderBrand.classList.remove('opacity-0', 'translate-y-4');
      loaderBrand.classList.add('opacity-100', 'translate-y-0');
      loaderBrand.style.letterSpacing = '0.45em';
    }, 150);
  }

  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      setTimeout(() => {
        preloader.remove();
        const heroCurtain = document.getElementById('hero-curtain');
        if (heroCurtain) heroCurtain.classList.add('revealed');
      }, 400);
    }, 900);
  }


  // ==========================================
  // 3. LUXURY DECELLERATING CUSTOM MOUSE CURSOR
  // ==========================================
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function animateCursor() {
    let dx = mouseX - cursorX;
    let dy = mouseY - cursorY;
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    if (cursor) {
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  function hookCursorMicroInteractions() {
    const clickables = document.querySelectorAll('button, a, .hero-dot, .cartinus-dot, select, input, textarea, [onclick]');
    clickables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        if (cursor) {
          cursor.classList.add('scale-150', 'bg-ivory-gold/15', 'border-ivory-gold');
          cursor.style.borderColor = '#C5A880';
        }
      });
      item.addEventListener('mouseleave', () => {
        if (cursor) {
          cursor.classList.remove('scale-150', 'bg-ivory-gold/15', 'border-ivory-gold');
          cursor.style.borderColor = '';
        }
      });
    });

    const cardRoots = document.querySelectorAll('.luxury-card-shadow, [onclick^="openDishDetail"]');
    cardRoots.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (cursor) {
          cursor.classList.add('scale-225', 'bg-ivory-gold/20', 'border-ivory-gold');
          cursor.style.borderColor = '#C5A880';
        }
      });
      card.addEventListener('mouseleave', () => {
        if (cursor) {
          cursor.classList.remove('scale-225', 'bg-ivory-gold/20', 'border-ivory-gold');
          cursor.style.borderColor = '';
        }
      });
    });
  }

  hookCursorMicroInteractions();


  // ==========================================
  // 4. INTERSECTION OBSERVER SCROLL REVEALS
  // ==========================================
  const observerOptions = {
    root: null,
    threshold: 0.08,
    rootMargin: '0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        const innerCards = entry.target.querySelectorAll('.curtain-reveal-card');
        innerCards.forEach((c, index) => {
          setTimeout(() => {
            c.classList.add('revealed');
          }, index * 200 + 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    revealObserver.observe(el);
  });


  // ==========================================
  // 5. CINEMATIC HERO IMAGE SLIDER
  // ==========================================
  const heroSliderImg = document.getElementById('hero-slider-img');
  const heroTitle = document.getElementById('hero-title');
  const heroDesc = document.getElementById('hero-desc');
  const heroCurtain = document.getElementById('hero-curtain');

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1400&auto=format&fit=crop",
      title: "Refined Spaces,<br>Unrivaled Luxury",
      desc: "Cartinus fuses custom architecture with world-class hospitality, presenting bespoke dining suites and serene sanctuaries carved from pure nature."
    },
    {
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1400&auto=format&fit=crop",
      title: "Bespoke Sanctuaries,<br>Carved From Nature",
      desc: "Vast expanses of stone and warm cedar panels. Retreat into completely private hot springs, accompanied by organic pine aromatherapy."
    },
    {
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop",
      title: "Bespoke Gastronomy,<br>Somatic Pleasures",
      desc: "Gather under towering hand-blown glass art fixtures to enjoy curated organic harvest menus coupled with clay amphora cellars."
    }
  ];

  let currentHeroIndex = 0;

  window.switchHeroSlide = function (index) {
    if (index === currentHeroIndex || !heroSliderImg) return;
    if (heroCurtain) heroCurtain.classList.remove('revealed');
    currentHeroIndex = index;
    const slide = heroSlides[index];

    if (heroTitle) {
      heroTitle.style.opacity = '0';
      heroTitle.style.transform = 'translateY(15px)';
    }
    if (heroDesc) {
      heroDesc.style.opacity = '0';
      heroDesc.style.transform = 'translateY(15px)';
    }

    const dots = document.querySelectorAll('#hero-slider-dots .hero-dot');
    dots.forEach((dot, dotIdx) => {
      if (dotIdx === index) {
        dot.className = "hero-dot w-2.5 h-2.5 rounded-full bg-ivory-dark dark:bg-white cursor-pointer transition-all duration-300";
      } else {
        dot.className = "hero-dot w-2 h-2 rounded-full bg-ivory-muted/40 dark:bg-evening-muted/40 cursor-pointer transition-all duration-300";
      }
    });

    setTimeout(() => {
      heroSliderImg.src = slide.image;
      setTimeout(() => {
        if (heroCurtain) heroCurtain.classList.add('revealed');
        if (heroTitle) {
          heroTitle.innerHTML = slide.title;
          heroTitle.style.opacity = '1';
          heroTitle.style.transform = 'translateY(0)';
        }
        if (heroDesc) {
          heroDesc.innerHTML = slide.desc;
          heroDesc.style.opacity = '1';
          heroDesc.style.transform = 'translateY(0)';
        }
      }, 200);
    }, 450);
  };


  // ==========================================
  // 6. DYNAMIC HERO STAY PLANNER COMPONENT
  // ==========================================
  const planSuite = document.getElementById('plan-suite');
  const planDining = document.getElementById('plan-dining');
  const planSpa = document.getElementById('plan-spa');
  const planSummaryLabel = document.getElementById('plan-summary-label');
  const planSummaryPrice = document.getElementById('plan-summary-price');

  window.updatePlannerSummary = function() {
    if (!planSuite || !planDining || !planSpa) return;
    const suiteVal = planSuite.value;
    const diningVal = planDining.value;
    const spaVal = planSpa.value;
    let totalEst = PRICE_MAP[suiteVal] || 400;
    let labelParts = [];

    if (suiteVal === "The Ocean Sanctuary") labelParts.push("Ocean Observatory");
    else if (suiteVal === "The Emerald Chamber") labelParts.push("Emerald Chamber");
    else if (suiteVal === "The Epicurean Atrium") labelParts.push("Epicurean Atrium");

    if (diningVal === "Tasting") {
      totalEst += 195;
      labelParts.push("Seasonal Tasting");
    } else if (diningVal === "Wine") {
      totalEst += 120;
      labelParts.push("Cellar Flight");
    }

    if (spaVal === "Yes") {
      totalEst += 110;
      labelParts.push("Hot Springs");
    }

    planSummaryLabel.innerText = labelParts.join(" + ");
    planSummaryPrice.innerText = `Est. Investment: ${formatDualPrice(totalEst)} / Night`;
  };

  updatePlannerSummary();

  window.triggerPlannerBooking = function() {
    if (!planSuite) return;
    const selectedSuite = planSuite.value;
    openBookingModal(selectedSuite);
    const requestTextarea = document.getElementById('booking-requests');
    if (requestTextarea) {
      requestTextarea.value = `Stay Package: Suite: ${selectedSuite}. Dining Focus: ${planDining.value}. Geothermal Spa Ritual: ${planSpa.value}.`;
    }
  };


  // ==========================================
  // 7. SPEC ARCHITECTURAL BLUEPRINT ACCORDION
  // ==========================================
  const archTabHeaders = {
    materials: document.getElementById('btn-arch-materials'),
    acoustics: document.getElementById('btn-arch-acoustics'),
    geothermal: document.getElementById('btn-arch-geothermal')
  };

  const archTabContents = {
    materials: document.getElementById('arch-tab-materials'),
    acoustics: document.getElementById('arch-tab-acoustics'),
    geothermal: document.getElementById('arch-tab-geothermal')
  };

  window.switchArchitectTab = function(activeKey) {
    Object.keys(archTabHeaders).forEach(key => {
      const headerBtn = archTabHeaders[key];
      const contentBox = archTabContents[key];
      if (key === activeKey) {
        headerBtn.className = "pb-3 text-[10px] tracking-widest uppercase font-medium text-ivory-dark dark:text-white border-b-2 border-ivory-gold px-4 transition-all cursor-pointer";
        contentBox.classList.remove('hidden');
        contentBox.classList.add('block');
      } else {
        headerBtn.className = "pb-3 text-[10px] tracking-widest uppercase font-light text-ivory-muted dark:text-[#8E9890] border-b-2 border-transparent px-4 transition-all cursor-pointer";
        contentBox.classList.add('hidden');
        contentBox.classList.remove('block');
      }
    });
  };


  // ==========================================
  // 8. SPECTACULAR MICHELIN GASTRONOMY CARDS
  // ==========================================
  const dishModal = document.getElementById('dish-modal');
  const dishBackdrop = document.getElementById('dish-backdrop');
  const closeDishBtn = document.getElementById('close-dish-btn');
  const closeDishActionBtn = document.getElementById('close-dish-action-btn');

  const dishDetailImg = document.getElementById('dish-detail-img');
  const dishDetailTitle = document.getElementById('dish-detail-title');
  const dishDetailDesc = document.getElementById('dish-detail-desc');
  const dishDetailIngredients = document.getElementById('dish-detail-ingredients');
  const dishDetailPairing = document.getElementById('dish-detail-pairing');
  const dishDetailQuote = document.getElementById('dish-detail-quote');

  const michelinDishData = {
    charred_octopus: {
      title: "Glazed Hearth Octopus",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
      desc: "Our hearth-grilled Pacific octopus represents standard-setting culinary precision. Cooked sous-vide for eighteen hours in wild kelp broth, it is quickly charred over volcanic lava brick fire grids to create an ethereal, crisp surface glaze.",
      ingredients: "Pacific blue octopus, volcanic potato charcoal, kelp reductions, garden elderflowers.",
      pairing: "2019 Domaine de l'Ambre Amphora Orange",
      quote: "\"Texture leads context. Fire shapes the final boundary of the ocean's salt.\" — Chef de Cuisine, Alan Vane"
    },
    heritage_lamb: {
      title: "Hay-Smoked Heritage Lamb",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
      desc: "A true heritage masterpiece. Locally farmed lamb loin gently wrapped in mountain eucalyptus hay, slow roasted inside our artisanal stone dome hearth. Smoked wood vapors saturate the fibers, resulting in melt-in-your-mouth tenderness.",
      ingredients: "Heritage mountain sheep, dried eucalyptus hay, confit gold carrots, black truffle jus.",
      pairing: "2015 Bordeaux Reserve Chateaux Gold",
      quote: "\"Eucalyptus hay preserves the soil's warmth. The oven serves as the translator.\" — Chef de Cuisine, Alan Vane"
    },
    foraged_mushroom: {
      title: "Sanctuary Cloud Morels",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop",
      desc: "Foraged daily by our horticulturist team within the mist-bound cloud-forest canopies surrounding Cartinus. Sautéed lightly with fresh pine oil concentrates and served on caramelized organic root reductions.",
      ingredients: "Cloud forest morels, hand-pressed pine oil, organic heritage roots, toasted hazelnut dust.",
      pairing: "2020 Estate Chardonnay Organic Reserve",
      quote: "\"The cloud forest floor breathes directly into our morning plates.\" — Chef de Cuisine, Alan Vane"
    }
  };

  window.openDishDetail = function(dishKey) {
    const data = michelinDishData[dishKey];
    if (!data) return;
    closeAllOverlayPanels('dish-modal');
    document.body.classList.add('overlay-open');
    dishDetailImg.src = data.image;
    dishDetailTitle.innerText = data.title;
    dishDetailDesc.innerText = data.desc;
    dishDetailIngredients.innerText = data.ingredients;
    dishDetailPairing.innerText = data.pairing;
    dishDetailQuote.innerText = data.quote;
    dishModal.classList.remove('hidden');
    dishModal.classList.add('flex');
    setTimeout(() => {
      dishModal.querySelector('.relative').classList.remove('scale-95');
      dishModal.querySelector('.relative').classList.add('scale-100');
    }, 10);
  };

  window.closeDishDetail = function() {
    dishModal.querySelector('.relative').classList.add('scale-95');
    dishModal.querySelector('.relative').classList.remove('scale-100');
    document.body.classList.remove('overlay-open');
    setTimeout(() => {
      dishModal.classList.add('hidden');
      dishModal.classList.remove('flex');
    }, 200);
  };

  if (closeDishBtn) closeDishBtn.addEventListener('click', closeDishDetail);
  if (closeDishActionBtn) closeDishActionBtn.addEventListener('click', closeDishDetail);
  if (dishBackdrop) dishBackdrop.addEventListener('click', closeDishDetail);


  // ==========================================
  // 9. CLIENT GUEST STORIES CAROUSEL SLIDER
  // ==========================================
  window.switchTestimonial = function(index) {
    const slide0 = document.getElementById('testimonial-slide-0');
    const slide1 = document.getElementById('testimonial-slide-1');
    const dot0 = document.getElementById('testimonial-dot-0');
    const dot1 = document.getElementById('testimonial-dot-1');
    if (!slide0 || !slide1) return;

    if (index === 0) {
      slide0.className = "absolute inset-0 flex flex-col justify-between transition-all duration-700 opacity-100 translate-x-0";
      slide1.className = "absolute inset-0 flex flex-col justify-between transition-all duration-700 opacity-0 translate-x-12 pointer-events-none";
      dot0.className = "w-2.5 h-2.5 rounded-full bg-ivory-dark dark:bg-white cursor-pointer transition-all";
      dot1.className = "w-2 h-2 rounded-full bg-ivory-muted/40 dark:bg-evening-muted/40 cursor-pointer transition-all";
    } else {
      slide0.className = "absolute inset-0 flex flex-col justify-between transition-all duration-700 opacity-0 -translate-x-12 pointer-events-none";
      slide1.className = "absolute inset-0 flex flex-col justify-between transition-all duration-700 opacity-100 translate-x-0";
      dot0.className = "w-2 h-2 rounded-full bg-ivory-muted/40 dark:bg-evening-muted/40 cursor-pointer transition-all";
      dot1.className = "w-2.5 h-2.5 rounded-full bg-ivory-dark dark:bg-white cursor-pointer transition-all";
    }
  };


  // ==========================================
  // 10. INTERACTIVE FLOATING CONCIERGE WIZARD
  // ==========================================
  const conciergeWindow = document.getElementById('concierge-window');
  const conciergeToggleBtn = document.getElementById('concierge-toggle-btn');
  const closeConciergeBtn = document.getElementById('close-concierge-btn');
  const conciergeText = document.getElementById('concierge-text');
  const conciergeOptions = document.getElementById('concierge-options');

  let isConciergeOpen = false;
  let wizardStep = 0;
  let conciergeChosenSuite = '';
  let conciergeChosenDining = '';
  let conciergeChosenSpa = '';

  window.toggleConcierge = function() {
    if (!conciergeWindow) return;
    if (isConciergeOpen) {
      conciergeWindow.classList.add('scale-0', 'opacity-0', 'pointer-events-none');
      conciergeWindow.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
      isConciergeOpen = false;
    } else {
      conciergeWindow.classList.remove('scale-0', 'opacity-0', 'pointer-events-none');
      conciergeWindow.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
      isConciergeOpen = true;
      resetConciergeDialog();
    }
  };

  if (conciergeToggleBtn) conciergeToggleBtn.addEventListener('click', toggleConcierge);
  if (closeConciergeBtn) closeConciergeBtn.addEventListener('click', toggleConcierge);

  function resetConciergeDialog() {
    wizardStep = 0;
    conciergeText.innerText = `"Welcome to Cartinus. I am your digital steward. May I assist in curating your ideal sanctuary stay?"`;
    conciergeOptions.innerHTML = `
      <button onclick="startConciergeWizard()" class="w-full py-2.5 rounded-full btn-solid-dark text-[10px] tracking-widest uppercase transition-all font-light cursor-pointer shadow-md">
        Curate My Stay &rarr;
      </button>
    `;
    hookCursorMicroInteractions();
  }

  window.startConciergeWizard = function() {
    wizardStep = 1;
    conciergeText.innerText = `"Question 1 of 3: Which natural horizon calls to your soul?"`;
    conciergeOptions.innerHTML = `
      <button onclick="chooseConciergeSuite('The Ocean Sanctuary', 'Ocean Cliffside')" class="w-full py-2 rounded-full border border-ivory-border hover:border-ivory-gold text-[10px] tracking-widest uppercase transition-all font-light cursor-pointer text-ivory-dark dark:text-white">Ocean Observatory</button>
      <button onclick="chooseConciergeSuite('The Emerald Chamber', 'Emerald Forest')" class="w-full py-2 rounded-full border border-ivory-border hover:border-ivory-gold text-[10px] tracking-widest uppercase transition-all font-light cursor-pointer text-ivory-dark dark:text-white">Emerald Chamber</button>
      <button onclick="chooseConciergeSuite('The Epicurean Atrium', 'Gastronomy Atrium')" class="w-full py-2 rounded-full border border-ivory-border hover:border-ivory-gold text-[10px] tracking-widest uppercase transition-all font-light cursor-pointer text-ivory-dark dark:text-white">Epicurean Atrium</button>
    `;
    hookCursorMicroInteractions();
  };

  window.chooseConciergeSuite = function(rawKey, label) {
    conciergeChosenSuite = rawKey;
    wizardStep = 2;
    conciergeText.innerText = `"Question 2 of 3: Select your signature gastronomy flight to accompany ${label}."`;
    conciergeOptions.innerHTML = `
      <button onclick="chooseConciergeDining('Tasting Menu')" class="w-full py-2 rounded-full border border-ivory-border hover:border-ivory-gold text-[10px] tracking-widest uppercase transition-all font-light cursor-pointer text-ivory-dark dark:text-white">Seasonal Tasting Menu</button>
      <button onclick="chooseConciergeDining('Amphora Cellar Pairing')" class="w-full py-2 rounded-full border border-ivory-border hover:border-ivory-gold text-[10px] tracking-widest uppercase transition-all font-light cursor-pointer text-ivory-dark dark:text-white">Rare Cellar Wine flight</button>
      <button onclick="chooseConciergeDining('None')" class="w-full py-2 rounded-full border border-ivory-border hover:border-ivory-gold text-[10px] tracking-widest uppercase transition-all font-light cursor-pointer text-ivory-dark dark:text-white">Skip Dining Plans</button>
    `;
    hookCursorMicroInteractions();
  };

  window.chooseConciergeDining = function(diningPlan) {
    conciergeChosenDining = diningPlan;
    wizardStep = 3;
    conciergeText.innerText = `"Question 3 of 3: Shall we reserve a private volcanic spring spa ceremony?"`;
    conciergeOptions.innerHTML = `
      <button onclick="chooseConciergeSpa('Yes')" class="w-full py-2 rounded-full border border-ivory-border hover:border-ivory-gold text-[10px] tracking-widest uppercase transition-all font-light cursor-pointer text-ivory-dark dark:text-white">Geothermal Springs Bath</button>
      <button onclick="chooseConciergeSpa('No')" class="w-full py-2 rounded-full border border-ivory-border hover:border-ivory-gold text-[10px] tracking-widest uppercase transition-all font-light cursor-pointer text-ivory-dark dark:text-white">Skip Spa Ritual</button>
    `;
    hookCursorMicroInteractions();
  };

  window.chooseConciergeSpa = function(spaChoice) {
    conciergeChosenSpa = spaChoice;
    wizardStep = 4;
    conciergeText.innerText = `"Your curated package is ready. Ocean Suite + ${conciergeChosenDining} + Geothermal Bath. Shall we secure this in the ledger?"`;
    conciergeOptions.innerHTML = `
      <button onclick="triggerConciergeCompletion()" class="w-full py-2.5 rounded-full btn-solid-dark text-[10px] tracking-widest uppercase transition-all font-light cursor-pointer shadow-md btn-gold-sweep">Secure Ledger Reservation</button>
      <button onclick="resetConciergeDialog()" class="w-full py-1.5 text-[9px] uppercase tracking-widest font-light text-rose-400 hover:underline cursor-pointer">Restart Curation</button>
    `;
    hookCursorMicroInteractions();
  };

  window.triggerConciergeCompletion = function() {
    toggleConcierge();
    openBookingModal(conciergeChosenSuite);
    const requestTextarea = document.getElementById('booking-requests');
    if (requestTextarea) {
      requestTextarea.value = `Experience curated by Virtual Concierge. Selected Sanctuary Suite: ${conciergeChosenSuite}. Sommelier/Atelier Dining: ${conciergeChosenDining}. Spa Preparations: ${conciergeChosenSpa === "Yes" ? "Volcanic Geothermal Springs Required" : "None"}.`;
    }
  };


  // ==========================================
  // 11. AMBIENT PORTAL VIEW CONTROLLER
  // ==========================================
  window.toggleView = function (view) {
    const clientView = document.getElementById('client-view');
    const adminView = document.getElementById('admin-view');
    const adminBtn = document.getElementById('nav-admin-btn');
    closeMobileDrawer();

    if (view === 'admin') {
      clientView.classList.add('hidden');
      clientView.classList.remove('block');
      adminView.classList.remove('hidden');
      adminView.classList.add('block');
      if (adminBtn) adminBtn.classList.add('opacity-50', 'underline');
      updateAdminStats();
      renderBookingsTable();
      writeConsoleLog("System", "Administrator loaded dashboard control panel.");
    } else {
      adminView.classList.add('hidden');
      adminView.classList.remove('block');
      clientView.classList.remove('hidden');
      clientView.classList.add('block');
      if (adminBtn) adminBtn.classList.remove('opacity-50', 'underline');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    hookCursorMicroInteractions();
  };


  // ==========================================
  // 12. ADMIN STATS & DYNAMIC GRAPHS
  // ==========================================
  function updateAdminStats() {
    const bookings = getBookings();
    let totalRevenue = 0;
    let totalActive = 0;
    let pendingCount = 0;
    let confirmedCount = 0;
    let completedCount = 0;
    let countOcean = 0;
    let countEmerald = 0;
    let countAtrium = 0;

    bookings.forEach(b => {
      totalActive++;
      if (b.status === 'Pending') pendingCount++;
      if (b.status === 'Confirmed') confirmedCount++;
      if (b.status === 'Completed') completedCount++;

      if (b.status !== 'Cancelled') {
        const rate = PRICE_MAP[b.experience] || 150;
        const multiplier = b.experience === 'The Epicurean Atrium' ? parseInt(b.guests) : 1; 
        totalRevenue += (rate * multiplier);
      }

      if (b.status !== 'Cancelled') {
        if (b.experience === "The Ocean Sanctuary") countOcean++;
        if (b.experience === "The Emerald Chamber") countEmerald++;
        if (b.experience === "The Epicurean Atrium") countAtrium++;
      }
    });

    const occupancyPercentage = Math.round((confirmedCount / 15) * 100);

    document.getElementById('metric-revenue').innerText = formatDualPrice(totalRevenue);
    document.getElementById('metric-total').innerText = totalActive;
    document.getElementById('metric-completed-count').innerText = completedCount;
    document.getElementById('metric-pending').innerText = pendingCount;
    document.getElementById('metric-occupancy').innerText = `${occupancyPercentage}%`;

    const maxVal = Math.max(countOcean, countEmerald, countAtrium, 1);
    document.getElementById('chart-val-ocean').innerText = countOcean;
    document.getElementById('chart-bar-ocean').style.height = `${(countOcean / maxVal) * 100}%`;
    document.getElementById('chart-val-emerald').innerText = countEmerald;
    document.getElementById('chart-bar-emerald').style.height = `${(countEmerald / maxVal) * 100}%`;
    document.getElementById('chart-val-atrium').innerText = countAtrium;
    document.getElementById('chart-bar-atrium').style.height = `${(countAtrium / maxVal) * 100}%`;
  }


  // ==========================================
  // 13. SYSTEM TERMINAL FEED
  // ==========================================
  const consoleFeed = document.getElementById('simulation-console');

  function writeConsoleLog(source, message) {
    if (!consoleFeed) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    let colorClass = 'text-zinc-400';
    if (source === 'System') colorClass = 'text-blue-400';
    if (source === 'Simulator') colorClass = 'text-emerald-400';
    if (source === 'User') colorClass = 'text-amber-400';
    if (source === 'Error') colorClass = 'text-rose-400';

    const logDiv = document.createElement('div');
    logDiv.innerHTML = `<span class="text-zinc-600">[${timeStr}]</span> <span class="${colorClass} font-semibold">[${source}]</span> ${message}`;
    consoleFeed.appendChild(logDiv);
    consoleFeed.scrollTop = consoleFeed.scrollHeight;
  }


  // ==========================================
  // 14. TOAST NOTIFICATION CONTAINER SYSTEM
  // ==========================================
  const toastContainer = document.getElementById('toast-container');

  window.showToast = function (title, message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `p-4 rounded-2xl border luxury-card-shadow flex items-start space-x-3 text-xs bg-white dark:bg-zinc-900 pointer-events-auto animate-slide-in`;
    let accentBorder = 'border-emerald-500/30';
    let iconColor = 'text-emerald-500';
    let iconSvg = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

    if (type === 'warning') {
      accentBorder = 'border-rose-500/30';
      iconColor = 'text-rose-500';
      iconSvg = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
    } else if (type === 'info') {
      accentBorder = 'border-blue-500/30';
      iconColor = 'text-blue-500';
      iconSvg = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>`;
    }

    toast.classList.add(accentBorder);
    toast.innerHTML = `
      <div class="${iconColor} shrink-0 mt-0.5">
        ${iconSvg}
      </div>
      <div class="space-y-1 text-left">
        <h4 class="font-medium text-ivory-dark dark:text-white">${title}</h4>
        <p class="text-ivory-muted dark:text-[#8E9890] font-light leading-relaxed">${message}</p>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 5000);
  };


  // ==========================================
  // 15. LEDGER TABLE RENDER LOGIC
  // ==========================================
  const searchInput = document.getElementById('admin-search');
  const filterExperience = document.getElementById('admin-filter-experience');
  const filterStatus = document.getElementById('admin-filter-status');
  const tbody = document.getElementById('bookings-tbody');
  const emptyState = document.getElementById('ledger-empty-state');

  function renderBookingsTable() {
    if (!tbody) return;
    const bookings = getBookings();
    const query = searchInput.value.toLowerCase().trim();
    const expFilter = filterExperience.value;
    const statFilter = filterStatus.value;

    tbody.innerHTML = '';

    const filtered = bookings.filter(b => {
      const matchesSearch = b.id.toLowerCase().includes(query) || 
                            b.name.toLowerCase().includes(query) || 
                            b.email.toLowerCase().includes(query);
      const matchesExp = expFilter === 'All' || b.experience === expFilter;
      const matchesStat = statFilter === 'All' || b.status === statFilter;
      return matchesSearch && matchesExp && matchesStat;
    });

    if (filtered.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }
    emptyState.classList.add('hidden');

    filtered.forEach(b => {
      const tr = document.createElement('tr');
      tr.className = "hover:bg-ivory-card/60 dark:hover:bg-[#141514] transition-colors duration-200 text-xs text-ivory-dark dark:text-[#E0DFDB]";

      let statusBadge = '';
      if (b.status === 'Confirmed') {
        statusBadge = '<span class="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-medium">Confirmed</span>';
      } else if (b.status === 'Pending') {
        statusBadge = '<span class="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full font-medium animate-pulse">Pending</span>';
      } else {
        statusBadge = '<span class="bg-zinc-500/10 text-zinc-500 px-3 py-1 rounded-full font-medium">Cancelled</span>';
      }

      let actionsHtml = `<div class="flex items-center justify-end space-x-2">`;

      if (b.status === 'Pending') {
        actionsHtml += `
          <button onclick="approveBooking('${b.id}')" class="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer" title="Confirm Reservation">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </button>
        `;
      }

      actionsHtml += `
        <button onclick="editBookingModal('${b.id}')" class="p-1.5 rounded-lg border border-ivory-gold/30 text-ivory-gold hover:bg-ivory-gold/10 transition-colors cursor-pointer" title="Edit Booking">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
        </button>
      `;

      if (b.status !== 'Cancelled') {
        actionsHtml += `
          <button onclick="cancelBooking('${b.id}')" class="p-1.5 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer" title="Cancel Booking">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          </button>
        `;
      }

      actionsHtml += `
        <button onclick="deleteBooking('${b.id}')" class="p-1.5 rounded-lg border border-zinc-500/30 text-zinc-500 hover:bg-zinc-500/10 hover:text-zinc-800 transition-colors cursor-pointer" title="Delete Permanent">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478 -.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
        </button>
      `;

      actionsHtml += `</div>`;

      tr.innerHTML = `
        <td class="py-4 px-4 font-mono font-medium tracking-wide text-ivory-dark dark:text-white">${b.id}</td>
        <td class="py-4 px-4">
          <div class="font-medium text-ivory-dark dark:text-white text-xs">${b.name}</div>
          <div class="text-[10px] text-ivory-muted dark:text-evening-muted font-light mt-0.5">${b.email}</div>
        </td>
        <td class="py-4 px-4 text-[11px] font-medium text-ivory-gold">${b.experience}</td>
        <td class="py-4 px-4">
          <div class="font-light">${b.date}</div>
          <div class="text-[10px] text-ivory-muted dark:text-evening-muted font-light mt-0.5">${b.time}</div>
        </td>
        <td class="py-4 px-4 text-center font-light">${b.guests}</td>
        <td class="py-4 px-4 text-center">${statusBadge}</td>
        <td class="py-4 px-4 text-right">${actionsHtml}</td>
      `;

      tbody.appendChild(tr);
    });

    hookCursorMicroInteractions();
  }


  // ==========================================
  // 16. CRUD UTILITY OPERATIONS
  // ==========================================
  window.approveBooking = function (id) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index].status = 'Confirmed';
      saveBookings(bookings);
      const guest = bookings[index].name;
      writeConsoleLog("User", `Approved guest booking ${id} for ${guest}.`);
      showToast("Reservation Confirmed", `${guest}'s booking is officially confirmed in the ledger.`, 'success');
    }
  };

  window.cancelBooking = function (id) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index].status = 'Cancelled';
      saveBookings(bookings);
      const guest = bookings[index].name;
      writeConsoleLog("User", `Cancelled guest booking ${id} for ${guest}.`);
      showToast("Booking Cancelled", `${guest}'s itinerary was set to Cancelled.`, 'warning');
    }
  };

  window.deleteBooking = function (id) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      const guest = bookings[index].name;
      if (confirm(`Are you sure you want to permanently delete the reservation of ${guest} (${id})?`)) {
        bookings.splice(index, 1);
        saveBookings(bookings);
        writeConsoleLog("User", `Permanently purged record ${id} belonging to ${guest}.`);
        showToast("Purged Record", `Successfully purged ${guest}'s file.`, 'info');
      }
    }
  };


  // ==========================================
  // 17. DATABASE RESET & CSV EXPORTS
  // ==========================================
  const exportBtn = document.getElementById('admin-export-btn');
  const resetBtn = document.getElementById('admin-reset-btn');

  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      const bookings = getBookings();
      let csvContent = "Reservation ID,Guest Name,Email Address,Experience / Suite,Date,Time Slot,Guests Count,Status\n";
      bookings.forEach(b => {
        const row = [
          `"${b.id}"`,
          `"${b.name.replace(/"/g, '""')}"`,
          `"${b.email.replace(/"/g, '""')}"`,
          `"${b.experience}"`,
          `"${b.date}"`,
          `"${b.time}"`,
          `"${b.guests}"`,
          `"${b.status}"`
        ].join(",");
        csvContent += row + "\n";
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "cartinus_master_ledger.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      writeConsoleLog("System", "CSV file generated and exported to local client system.");
      showToast("Ledger Exported", "The master ledger database was successfully compiled and exported as CSV.", "success");
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (confirm("Are you sure you want to completely wipe the current browser database?")) {
        localStorage.removeItem('cartinus_bookings');
        updateAdminStats();
        renderBookingsTable();
        writeConsoleLog("System", "Database completely reset. Restored default demo records.");
        showToast("Database Restored", "Pruned existing dataset and re-seeded default demo records.", "success");
      }
    });
  }


  // ==========================================
  // 18. MANUAL CREATION DESK FORM (ADMIN)
  // ==========================================
  const adminAddForm = document.getElementById('admin-add-form');

  if (adminAddForm) {
    adminAddForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('admin-guest-name').value;
      const email = document.getElementById('admin-guest-email').value;
      const experience = document.getElementById('admin-guest-experience').value;
      const guests = document.getElementById('admin-guest-count').value;
      const date = document.getElementById('admin-guest-date').value;
      const time = document.getElementById('admin-guest-time').value;
      const status = document.getElementById('admin-guest-status').value;

      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const randomChar = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      const manualId = `CRT-${randomNum}-${randomChar}`;

      const newBooking = {
        id: manualId,
        name: name,
        email: email,
        experience: experience,
        date: date,
        time: time,
        guests: guests,
        status: status
      };

      const bookings = getBookings();
      bookings.unshift(newBooking);
      saveBookings(bookings);

      adminAddForm.reset();

      writeConsoleLog("User", `Manually added reservation ${manualId} for ${name}.`);
      showToast("Manual Ledger Added", `Added guest ${name} to ledger with status "${status}".`, 'success');
    });
  }


  // ==========================================
  // 19. DETAIL EDIT MODAL (ADMIN)
  // ==========================================
  const editModalEl = document.getElementById('edit-modal');
  const closeEditBtn = document.getElementById('close-edit-btn');
  const editForm = document.getElementById('edit-form');

  window.editBookingModal = function (id) {
    const bookings = getBookings();
    const b = bookings.find(item => item.id === id);
    if (!b) return;

    document.getElementById('edit-booking-id').value = b.id;
    document.getElementById('edit-guest-name').value = b.name;
    document.getElementById('edit-guest-email').value = b.email;
    document.getElementById('edit-guest-experience').value = b.experience;
    document.getElementById('edit-guest-count').value = b.guests;
    document.getElementById('edit-guest-date').value = b.date;
    document.getElementById('edit-guest-time').value = b.time;
    document.getElementById('edit-guest-status').value = b.status;

    editModalEl.classList.remove('hidden');
    editModalEl.classList.add('flex');
  };

  if (closeEditBtn) {
    closeEditBtn.addEventListener('click', () => {
      editModalEl.classList.add('hidden');
      editModalEl.classList.remove('flex');
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const id = document.getElementById('edit-booking-id').value;
      const bookings = getBookings();
      const index = bookings.findIndex(item => item.id === id);

      if (index !== -1) {
        bookings[index].name = document.getElementById('edit-guest-name').value;
        bookings[index].email = document.getElementById('edit-guest-email').value;
        bookings[index].experience = document.getElementById('edit-guest-experience').value;
        bookings[index].guests = document.getElementById('edit-guest-count').value;
        bookings[index].date = document.getElementById('edit-guest-date').value;
        bookings[index].time = document.getElementById('edit-guest-time').value;
        bookings[index].status = document.getElementById('edit-guest-status').value;

        saveBookings(bookings);
        writeConsoleLog("User", `Edited details on booking ledger card ${id}.`);
        showToast("Ledger Modified", `Saved changes to booking registry ID ${id}.`, 'success');
      }

      editModalEl.classList.add('hidden');
      editModalEl.classList.remove('flex');
    });
  }


  // ==========================================
  // 20. CLIENT STEPPER RESERVATION FORM ENGINE
  // ==========================================
  const clientBookingForm = document.getElementById('booking-form');
  const clientBookingDrawer = document.getElementById('booking-drawer');
  const clientSuccessModal = document.getElementById('success-modal');

  const btnNext = document.getElementById('btn-step-next');
  const btnPrev = document.getElementById('btn-step-prev');

  const stepDots = [
    document.getElementById('step-dot-1'),
    document.getElementById('step-dot-2'),
    document.getElementById('step-dot-3')
  ];
  const stepLines = [
    document.getElementById('step-line-1'),
    document.getElementById('step-line-2')
  ];

  let currentFormStep = 1;

  function updateStepperUI() {
    for (let step = 1; step <= 3; step++) {
      const panel = document.getElementById(`form-step-${step}`);
      if (step === currentFormStep) {
        panel.classList.remove('hidden');
        panel.classList.add('block');
      } else {
        panel.classList.add('hidden');
        panel.classList.remove('block');
      }
    }

    if (currentFormStep === 1) {
      btnPrev.classList.add('hidden');
      btnNext.classList.remove('w-2/3');
      btnNext.classList.add('w-full');
      btnNext.innerText = "Continue";
    } else {
      btnPrev.classList.remove('hidden');
      btnNext.classList.add('w-2/3');
      btnNext.classList.remove('w-full');
      if (currentFormStep === 2) {
        btnNext.innerText = "Continue";
      } else if (currentFormStep === 3) {
        btnNext.innerText = "Complete Booking";
        calculateFinalInvoiceSummary();
      }
    }

    stepDots.forEach((dot, idx) => {
      const circleNum = idx + 1;
      const stepCircleSpan = dot.querySelector('span');
      if (circleNum <= currentFormStep) {
        dot.className = "flex items-center space-x-1.5 text-ivory-dark dark:text-white font-semibold transition-all";
        if (stepCircleSpan) {
          stepCircleSpan.className = "w-5 h-5 rounded-full bg-ivory-gold text-white flex items-center justify-center text-[9px] font-bold";
        }
      } else {
        dot.className = "flex items-center space-x-1.5 text-ivory-muted dark:text-[#8E9890] transition-all";
        if (stepCircleSpan) {
          stepCircleSpan.className = "w-5 h-5 rounded-full bg-ivory-border dark:bg-[#222522] text-ivory-muted flex items-center justify-center text-[9px]";
        }
      }
    });

    stepLines.forEach((line, idx) => {
      const lineNum = idx + 1;
      if (lineNum < currentFormStep) {
        line.className = "w-10 h-[1.5px] bg-ivory-gold flex-1 mx-3";
      } else {
        line.className = "w-10 h-[1.5px] bg-ivory-border dark:bg-[#222522] flex-1 mx-3";
      }
    });
  }

  function calculateFinalInvoiceSummary() {
    const suiteVal = document.getElementById('booking-experience').value;
    const dateVal = document.getElementById('booking-date').value;
    const timeVal = document.getElementById('booking-time').value;
    const guestsVal = document.getElementById('booking-guests').value;

    const rate = PRICE_MAP[suiteVal] || 150;
    const multiplier = suiteVal === 'The Epicurean Atrium' ? parseInt(guestsVal) : 1;
    const totalEst = rate * multiplier;

    document.getElementById('review-experience').innerText = suiteVal;
    document.getElementById('review-datetime').innerText = `${dateVal} at ${timeVal}`;
    document.getElementById('review-guests').innerText = `${guestsVal} ${guestsVal == 1 ? 'Guest' : 'Guests'}`;
    document.getElementById('review-total-price').innerText = formatDualPrice(totalEst);
  }

  btnNext.addEventListener('click', () => {
    if (currentFormStep === 1) {
      const dateVal = document.getElementById('booking-date').value;
      if (!dateVal) {
        alert("Please select your check-in arrival date.");
        return;
      }
      const todayCheckStr = new Date().toISOString().split('T')[0];
      if (dateVal < todayCheckStr) {
        alert("Please select a check-in date that is today or later.");
        return;
      }
      currentFormStep = 2;
      updateStepperUI();
    } else if (currentFormStep === 2) {
      const nameVal = document.getElementById('booking-name').value;
      const emailVal = document.getElementById('booking-email').value;
      if (!nameVal || !emailVal) {
        alert("Please complete guest profile fields.");
        return;
      }
      currentFormStep = 3;
      updateStepperUI();
    } else if (currentFormStep === 3) {
      const agreeChecked = document.getElementById('booking-policy-agree').checked;
      if (!agreeChecked) {
        alert("Please verify and accept standard Cartinus policies before securing space.");
        return;
      }

      const name = document.getElementById('booking-name').value;
      const email = document.getElementById('booking-email').value;
      const guests = document.getElementById('booking-guests').value;
      const date = document.getElementById('booking-date').value;
      const experience = document.getElementById('booking-experience').value;
      const time = document.getElementById('booking-time').value;

      const randomIdNum = Math.floor(10000 + Math.random() * 90000);
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const randomChar = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      const customerId = `CRT-${randomIdNum}-${randomChar}`;

      const newBooking = {
        id: customerId,
        name: name,
        email: email,
        experience: experience,
        date: date,
        time: time,
        guests: guests,
        status: "Pending" 
      };

      const bookings = getBookings();
      bookings.unshift(newBooking);
      saveBookings(bookings);

      document.getElementById('summary-id').innerText = customerId;
      document.getElementById('summary-name').innerText = name;
      document.getElementById('summary-experience').innerText = `${experience} (${guests} ${guests == 1 ? 'Guest' : 'Guests'})`;
      document.getElementById('summary-datetime').innerText = `${date} at ${time}`;

      clientBookingForm.reset();
      currentFormStep = 1;
      updateStepperUI();

      closeBookingModal();
      setTimeout(() => {
        clientSuccessModal.classList.remove('hidden');
        clientSuccessModal.classList.add('flex');
      }, 350);
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentFormStep > 1) {
      currentFormStep--;
      updateStepperUI();
    }
  });


  // ==========================================
  // 21. CLIENT INTERACTIVE SCROLL & TABS
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  window.closeMobileDrawer = function () {
    if (mobileDrawer) {
      mobileDrawer.classList.add('translate-x-full');
      setTimeout(() => {
        if (mobileDrawer.classList.contains('translate-x-full')) {
          mobileDrawer.classList.add('hidden');
        }
      }, 500);
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (mobileDrawer) {
        mobileDrawer.classList.remove('hidden');
        setTimeout(() => {
          mobileDrawer.classList.remove('translate-x-full');
        }, 10);
      }
    });
  }
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeMobileDrawer);
  }

  const tabImage = document.getElementById('tab-image');
  const tabData = {
    tasting: {
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop',
      btnId: 'tab-btn-tasting',
      contentId: 'tab-content-tasting'
    },
    vintages: {
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop',
      btnId: 'tab-btn-vintages',
      contentId: 'tab-content-vintages'
    },
    wellness: {
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
      btnId: 'tab-btn-wellness',
      contentId: 'tab-content-wellness'
    }
  };

  window.switchTab = function (tabKey) {
    Object.keys(tabData).forEach(key => {
      const data = tabData[key];
      const btn = document.getElementById(data.btnId);
      const content = document.getElementById(data.contentId);
      content.classList.add('hidden');
      content.classList.remove('block');
      btn.classList.add('border-transparent', 'text-ivory-muted', 'dark:text-evening-muted');
      btn.classList.remove('border-ivory-gold', 'dark:border-evening-gold', 'text-ivory-dark', 'dark:text-evening-text');
    });

    const active = tabData[tabKey];
    const activeBtn = document.getElementById(active.btnId);
    const activeContent = document.getElementById(active.contentId);

    activeContent.classList.remove('hidden');
    activeContent.classList.add('block');
    activeBtn.classList.remove('border-transparent', 'text-ivory-muted', 'dark:text-evening-muted');
    activeBtn.classList.add('border-ivory-gold', 'dark:border-evening-gold', 'text-ivory-dark', 'dark:text-evening-text');

    tabImage.style.opacity = '0.3';
    setTimeout(() => {
      tabImage.src = active.image;
      tabImage.style.opacity = '1';
    }, 200);
  };


  // ==========================================
  // 22. CLIENT DRAWER SLIDES & MODALS
  // ==========================================
  const bookingExperienceSelect = document.getElementById('booking-experience');
  const closeBookingBtn = document.getElementById('close-booking-btn');
  const bookingBackdrop = document.getElementById('booking-backdrop');

  window.openBookingModal = function (prefilledExperience = '') {
    closeAllOverlayPanels('booking-drawer');
    document.body.classList.add('overlay-open');

    if (prefilledExperience) {
      bookingExperienceSelect.value = prefilledExperience;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const bookingDateInput = document.getElementById('booking-date');
    bookingDateInput.min = todayStr;
    bookingDateInput.value = tomorrow.toISOString().split('T')[0];

    clientBookingDrawer.classList.remove('hidden');
    setTimeout(() => {
      clientBookingDrawer.querySelector('.relative').classList.remove('translate-x-full');
    }, 10);
  };

  window.closeBookingModal = function () {
    clientBookingDrawer.querySelector('.relative').classList.add('translate-x-full');
    document.body.classList.remove('overlay-open');
    setTimeout(() => {
      clientBookingDrawer.classList.add('hidden');
    }, 300);
  };

  if (closeBookingBtn) closeBookingBtn.addEventListener('click', closeBookingModal);
  if (bookingBackdrop) bookingBackdrop.addEventListener('click', closeBookingModal);

  const closeSuccessBtn = document.getElementById('close-success-btn');
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      clientSuccessModal.classList.add('hidden');
      clientSuccessModal.classList.remove('flex');
    });
  }


  // ==========================================
  // 23. ROOM DETAIL MODAL & INTERACTIVE 360 PANORAMA
  // ==========================================
  const detailModal = document.getElementById('detail-modal');
  const detailBackdrop = document.getElementById('detail-backdrop');
  const closeDetailBtn = document.getElementById('close-detail-btn');
  const detailCloseActionBtn = document.getElementById('detail-close-action-btn');
  const detailBookActionBtn = document.getElementById('detail-book-action-btn');

  const detailImage = document.getElementById('detail-image');
  const detailPanoramaViewport = document.getElementById('detail-panorama-viewport');
  const btnViewOverview = document.getElementById('btn-modal-view-overview');
  const btnViewPanorama = document.getElementById('btn-modal-view-panorama');

  const detailCategory = document.getElementById('detail-category');
  const detailTitle = document.getElementById('detail-title');
  const detailDesc = document.getElementById('detail-desc');
  const detailFeat1 = document.getElementById('detail-feat1');
  const detailFeat2 = document.getElementById('detail-feat2');
  const detailFeat3 = document.getElementById('detail-feat3');
  const detailFeat4 = document.getElementById('detail-feat4');
  const detailRate = document.getElementById('detail-rate');

  const cardData = {
    gastronomy: {
      title: 'The Ocean Observatory',
      category: 'Scenic Sanctuary Escape',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop',
      panorama: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1600&auto=format&fit=crop',
      desc: 'Perched over crushing coastal cliffs. Includes custom floor heating networks, deep infinity hot tubs fed by nearby thermal vents, and continuous professional dining/butler service for your absolute retreat.',
      feat1: 'Volcanic mineral infinity pool',
      feat2: 'Oceanic cliffside view deck',
      feat3: 'Personal butler-led culinary service',
      feat4: 'Linen and sateen lounge sets',
      rate: formatDualPrice(650) + ' / night'
    },
    spa: {
      title: 'The Emerald Chamber',
      category: 'Somatic Health Suite',
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop',
      panorama: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1600&auto=format&fit=crop',
      desc: 'A therapeutic cocoon. Surrounded by forest aromas and private eucalyptus steam chambers. Included with your journey are sound therapists, hand-pressed herb oils, and volcanic stone hot massages.',
      feat1: 'Organic pine aromatherapy vapor',
      feat2: 'Deep mineral hot spring bath',
      feat3: 'Crystal bowl audio resonance',
      feat4: 'Personal sound wellness guides',
      rate: formatDualPrice(220) + ' / session'
    },
    sanctuary: {
      title: 'The Epicurean Atrium',
      category: 'Private Culinary Suite',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
      panorama: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1600&auto=format&fit=crop',
      desc: 'Bespoke gastronomy design. Dine beneath modern glass art structures as our chef de cuisine plates multi-course organic tasting cards paired with aged amphora amber wines and hand-pressed botanical liquors.',
      feat1: 'Private gastronomy-driven table',
      feat2: 'Multi-course organic dining menu',
      feat3: 'Hand-blown glass light structure',
      feat4: 'Clay terracotta amphora cellar flight',
      rate: formatDualPrice(195) + ' / guest'
    }
  };

  let activeModalOffering = '';
  let activeModalPanImage = '';

  window.openCardDetails = function (cardKey, autoView = 'overview') {
    const data = cardData[cardKey];
    if (!data) return;

    closeAllOverlayPanels('detail-modal');
    document.body.classList.add('overlay-open');

    activeModalOffering = data.title;
    activeModalPanImage = data.panorama;

    detailImage.src = data.image;
    detailPanoramaViewport.style.backgroundImage = `url('${data.panorama}')`;

    detailCategory.innerText = data.category;
    detailTitle.innerText = data.title;
    detailDesc.innerText = data.desc;
    detailFeat1.innerText = data.feat1;
    detailFeat2.innerText = data.feat2;
    detailFeat3.innerText = data.feat3;
    detailFeat4.innerText = data.feat4;
    detailRate.innerText = data.rate;

    switchRoomModalView(autoView);

    detailModal.classList.remove('hidden');
    detailModal.classList.add('flex');
    setTimeout(() => {
      detailModal.querySelector('.relative').classList.remove('scale-95');
      detailModal.querySelector('.relative').classList.add('scale-100');
    }, 10);
  };

  window.switchRoomModalView = function(viewMode) {
    if (viewMode === 'panorama') {
      detailImage.classList.add('hidden');
      detailImage.classList.remove('block');
      detailPanoramaViewport.classList.remove('hidden');
      detailPanoramaViewport.classList.add('block');

      btnViewPanorama.className = "px-3.5 py-1.5 rounded-full font-bold bg-white text-ivory-dark cursor-pointer transition-colors";
      btnViewOverview.className = "px-3.5 py-1.5 rounded-full text-white hover:text-ivory-gold cursor-pointer transition-colors";
      detailPanoramaViewport.style.backgroundPositionX = "50%";
    } else {
      detailPanoramaViewport.classList.add('hidden');
      detailPanoramaViewport.classList.remove('block');
      detailImage.classList.remove('hidden');
      detailImage.classList.add('block');

      btnViewOverview.className = "px-3.5 py-1.5 rounded-full font-bold bg-white text-ivory-dark cursor-pointer transition-colors";
      btnViewPanorama.className = "px-3.5 py-1.5 rounded-full text-white hover:text-ivory-gold cursor-pointer transition-colors";
    }
  };

  let isDraggingPanorama = false;
  let startDragX = 0;
  let startBgPosPercent = 50;
  let currentBgPosPercent = 50;

  if (detailPanoramaViewport) {
    detailPanoramaViewport.addEventListener('mousedown', (e) => {
      isDraggingPanorama = true;
      startDragX = e.clientX;
      startBgPosPercent = currentBgPosPercent;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDraggingPanorama) return;
      const deltaX = e.clientX - startDragX;
      let offsetPercent = deltaX * 0.1;
      currentBgPosPercent = startBgPosPercent - offsetPercent;
      if (currentBgPosPercent < 0) currentBgPosPercent = 100;
      if (currentBgPosPercent > 100) currentBgPosPercent = 0;
      detailPanoramaViewport.style.backgroundPositionX = `${currentBgPosPercent}%`;
    });

    document.addEventListener('mouseup', () => {
      isDraggingPanorama = false;
    });
  }

  window.closeCardDetails = function () {
    detailModal.querySelector('.relative').classList.add('scale-95');
    detailModal.querySelector('.relative').classList.remove('scale-100');
    document.body.classList.remove('overlay-open');
    setTimeout(() => {
      detailModal.classList.add('hidden');
      detailModal.classList.remove('flex');
    }, 200);
  };

  if (closeDetailBtn) closeDetailBtn.addEventListener('click', closeCardDetails);
  if (detailCloseActionBtn) detailCloseActionBtn.addEventListener('click', closeCardDetails);
  if (detailBackdrop) detailBackdrop.addEventListener('click', closeCardDetails);

  if (detailBookActionBtn) {
    detailBookActionBtn.addEventListener('click', () => {
      closeCardDetails();
      setTimeout(() => {
        openBookingModal(activeModalOffering);
      }, 250);
    });
  }


  // ==========================================
  // 24. MASTER INITIALIZATION
  // ==========================================
  updateAdminStats();
  renderBookingsTable();

});

document.addEventListener('DOMContentLoaded', function () {
  var s = document.createElement('script');
  s.src = 'enhancements.js';
  document.body.appendChild(s);
});
