/* Salon services, specialists and slot availability shared by salon detail, cart and booking. */
(function () {
  var SALONS = {
    luxe: {
      name: 'Luxe Curls — Indiranagar',
      short: 'Luxe Curls',
      area: '12th Main, Indiranagar',
      phone: '+91 98765 43120',
      photo: 'assets/photos/salon-interior.jpg',
      pos: '50% 30%',
      note: 'From past visits: you rated <strong>Priya ★5</strong>.',
      services: [
        { key: 'mens-cut', name: "Men's Signature Cut", group: 'Men Hair Cuts', price: 699, off: 100, offTag: '₹100 OFF', mins: 40, thumb: 'assets/photos/salon-mens.jpg', desc: 'Consult, wash, precision cut and styled finish.' },
        { key: 'beard', name: 'Beard Trim & Shape', group: 'Men Hair Cuts', price: 349, mins: 25, thumb: 'assets/photos/salon-mens.jpg', desc: 'Shape and line-up with a hot-towel finish.' },
        { key: 'fade', name: 'Skin Fade', group: 'Men Hair Cuts', price: 799, mins: 45, thumb: 'assets/photos/salon-mens.jpg', desc: 'Clean skin fade with scissor detail on top.' },
        { key: 'haircut', name: 'Haircut & Style', group: 'Women Hair Cut', price: 899, off: 180, offTag: '20% OFF', mins: 45, thumb: 'assets/photos/salon-color.jpg', desc: 'Consultation, wash, precision cut and blow-dry finish.' },
        { key: 'layered', name: 'Layered Cut', group: 'Women Hair Cut', price: 999, mins: 50, thumb: 'assets/photos/salon-hair.jpg', desc: 'Face-framing layers shaped to your hair type.' },
        { key: 'blowdry', name: 'Blow Dry', group: 'Women Hair Cut', price: 499, mins: 30, thumb: 'assets/photos/salon-interior.jpg', desc: 'Wash and blow-dry — sleek or soft waves.' },
        { key: 'color', name: 'Global Color', group: 'Colour & Finish', price: 2499, mins: 90, thumb: 'assets/photos/salon-spa.jpg', desc: 'All-over shade with ammonia-free colour and shine gloss.' },
        { key: 'highlights', name: 'Highlights', group: 'Colour & Finish', price: 3199, off: 300, offTag: 'Flat ₹300 OFF', mins: 120, thumb: 'assets/photos/salon-color.jpg', desc: 'Foil highlights with tone and gloss finish.' },
        { key: 'keratin', name: 'Keratin Smooth', group: 'Treatments', price: 3499, mins: 120, thumb: 'assets/photos/salon-color.jpg', desc: 'Frizz-control keratin for smooth hair up to 3 months.' },
        { key: 'hairspa', name: 'Hair Spa', group: 'Treatments', price: 1299, off: 200, offTag: 'Flat ₹200 OFF', mins: 60, thumb: 'assets/photos/salon-spa.jpg', desc: 'Deep conditioning spa with scalp massage.' }
      ],
      specs: [
        { name: 'Priya S.', role: 'Senior stylist', photo: 'assets/photos/stylist-1.jpg', rate: '4.9', reviews: 128, years: 9, liked: 'You liked ★5', about: 'Precision cuts, layered styles and curly-hair care.', for: ['haircut', 'layered', 'blowdry', 'hairspa'] },
        { name: 'Kavya M.', role: 'Colorist', photo: 'assets/photos/stylist-3.jpg', rate: '4.8', reviews: 96, years: 6, liked: '', about: 'Balayage, global colour and highlights.', for: ['color', 'highlights', 'haircut'] },
        { name: 'Sneha J.', role: 'Hair stylist', photo: 'assets/photos/stylist-4.jpg', rate: '4.6', reviews: 54, years: 4, liked: '', about: 'Blow-dries, braids and party styling.', for: ['blowdry', 'haircut', 'layered'] },
        { name: 'Rahul V.', role: 'Barber stylist', photo: 'assets/photos/stylist-2.jpg', rate: '4.3', reviews: 37, years: 3, liked: '', about: 'Short cuts, fades and beard grooming.', for: ['mens-cut', 'beard', 'fade', 'haircut'] }
      ]
    },
    bloom: {
      name: 'Bloom & Brow',
      short: 'Bloom & Brow',
      area: '100 Feet Rd, Indiranagar',
      phone: '+91 98765 43121',
      photo: 'assets/photos/salon-facial.jpg',
      pos: '50% 35%',
      note: 'Glow specialists for skin, brows and makeup.',
      services: [
        { key: 'facial', name: 'Hydra Facial', group: 'Skin', price: 1299, off: 200, offTag: 'Flat ₹200 OFF', mins: 60, thumb: 'assets/photos/salon-facial.jpg', desc: 'Deep cleanse, gentle exfoliation and hydrating serum.' },
        { key: 'cleanup', name: 'Clean-up', group: 'Skin', price: 599, mins: 35, thumb: 'assets/photos/salon-facial.jpg', desc: 'Quick clean-up with de-tan and glow mask.' },
        { key: 'brow', name: 'Brow Threading', group: 'Brows', price: 249, mins: 20, thumb: 'assets/photos/salon-makeup.jpg', desc: 'Clean brow shaping with soothing aloe gel.' },
        { key: 'lamination', name: 'Brow Lamination', group: 'Brows', price: 899, mins: 40, thumb: 'assets/photos/salon-makeup.jpg', desc: 'Lifted, fuller brows that last for weeks.' },
        { key: 'makeup', name: 'Soft Glam Makeup', group: 'Makeup', price: 1799, mins: 75, thumb: 'assets/photos/salon-nails.jpg', desc: 'Skin prep, long-wear base and soft-glam eyes.' },
        { key: 'hd', name: 'HD Makeup', group: 'Makeup', price: 2499, off: 250, offTag: 'Flat ₹250 OFF', mins: 90, thumb: 'assets/photos/salon-makeup.jpg', desc: 'Camera-ready HD makeup for events.' }
      ],
      specs: [
        { name: 'Neha R.', role: 'Facial expert', photo: 'assets/photos/stylist-3.jpg', rate: '4.8', reviews: 88, years: 7, liked: '', about: 'Hydra facials and clean-ups matched to your skin type.', for: ['facial', 'cleanup'] },
        { name: 'Ananya M.', role: 'Brow artist', photo: 'assets/photos/stylist-4.jpg', rate: '4.7', reviews: 71, years: 5, liked: 'You liked ★5', about: 'Brow mapping, threading and lamination.', for: ['brow', 'lamination'] },
        { name: 'Pooja K.', role: 'Makeup artist', photo: 'assets/photos/stylist-1.jpg', rate: '4.8', reviews: 63, years: 6, liked: '', about: 'Soft glam and HD event makeup.', for: ['makeup', 'hd'] },
        { name: 'Tara S.', role: 'Skin therapist', photo: 'assets/photos/stylist-3.jpg', rate: '4.4', reviews: 29, years: 2, liked: '', about: 'Clean-ups, de-tan and gentle facials.', for: ['facial', 'cleanup'] }
      ]
    },
    nord: {
      name: 'Nord Hair Lab',
      short: 'Nord Hair Lab',
      area: 'Koramangala 5th Block',
      phone: '+91 98765 43122',
      photo: 'assets/photos/salon-mens.jpg',
      pos: '40% 55%',
      note: 'From past visits: you rated <strong>Arjun ★4</strong>.',
      services: [
        { key: 'haircut', name: 'Signature Cut', group: 'Men Hair Cuts', price: 699, mins: 40, thumb: 'assets/photos/salon-mens.jpg', desc: 'Consult, scissor or clipper cut, wash and styled finish.' },
        { key: 'beard', name: 'Beard Trim', group: 'Men Hair Cuts', price: 349, mins: 25, thumb: 'assets/photos/salon-interior.jpg', desc: 'Shape and line-up with a hot-towel finish.' },
        { key: 'keratin', name: 'Keratin Smooth', group: 'Treatments', price: 3499, mins: 120, thumb: 'assets/photos/salon-color.jpg', desc: 'Frizz-control keratin for smooth, manageable hair.' }
      ],
      specs: [
        { name: 'Arjun K.', role: 'Lead barber', photo: 'assets/photos/stylist-2.jpg', rate: '4.7', reviews: 142, years: 10, liked: 'You liked ★4', about: 'Skin fades, classic cuts and sharp beard sculpting.', for: ['haircut', 'beard'] },
        { name: 'Rohan P.', role: 'Keratin specialist', photo: 'assets/photos/stylist-1.jpg', rate: '4.6', reviews: 58, years: 5, liked: '', about: 'Keratin, smoothing and scalp treatments.', for: ['keratin'] },
        { name: 'Imran S.', role: 'Barber', photo: 'assets/photos/stylist-2.jpg', rate: '4.5', reviews: 44, years: 4, liked: '', about: 'Crew cuts, tapers and hot-towel shaves.', for: ['haircut', 'beard'] },
        { name: 'Vikram D.', role: 'Junior barber', photo: 'assets/photos/stylist-1.jpg', rate: '3.9', reviews: 12, years: 1, liked: '', about: 'Quick trims and line-ups for express slots.', for: ['haircut', 'beard'] }
      ]
    },
    aura: {
      name: 'Aura Spa Retreat',
      short: 'Aura Spa',
      area: 'HSR Layout Sector 2',
      phone: '+91 98765 43123',
      photo: 'assets/photos/salon-spa.jpg',
      pos: '10% 20%',
      note: 'Therapist-led rituals — every therapist is certified.',
      services: [
        { key: 'deep', name: 'Deep Tissue', group: 'Massage', price: 1899, off: 570, offTag: '30% OFF', mins: 60, thumb: 'assets/photos/salon-spa.jpg', desc: 'Firm-pressure massage for back, neck and shoulders.' },
        { key: 'swedish', name: 'Swedish Massage', group: 'Massage', price: 1499, mins: 50, thumb: 'assets/photos/salon-interior.jpg', desc: 'Full-body relaxation with long, gentle strokes.' },
        { key: 'stone', name: 'Hot Stone Ritual', group: 'Rituals', price: 2299, mins: 75, thumb: 'assets/photos/salon-nails.jpg', desc: 'Warm basalt stones with oil massage.' }
      ],
      specs: [
        { name: 'Meera D.', role: 'Lead therapist', photo: 'assets/photos/stylist-4.jpg', rate: '4.9', reviews: 117, years: 8, liked: 'You liked ★5', about: 'Deep tissue and sports massage.', for: ['deep', 'swedish'] },
        { name: 'Divya L.', role: 'Hot stone', photo: 'assets/photos/stylist-3.jpg', rate: '4.8', reviews: 82, years: 6, liked: '', about: 'Hot stone and aromatherapy rituals.', for: ['stone', 'swedish'] },
        { name: 'Asha N.', role: 'Spa therapist', photo: 'assets/photos/stylist-1.jpg', rate: '4.6', reviews: 47, years: 4, liked: '', about: 'Swedish and Balinese massage.', for: ['swedish', 'deep'] },
        { name: 'Kiran B.', role: 'Reflexologist', photo: 'assets/photos/stylist-2.jpg', rate: '4.2', reviews: 19, years: 2, liked: '', about: 'Foot reflexology and head relief.', for: ['swedish'] }
      ]
    }
  };

  Object.keys(SALONS).forEach(function (k) {
    SALONS[k].services.forEach(function (s) {
      s.off = s.off || 0;
      s.offTag = s.offTag || '';
      s.dur = duration(s.mins);
    });
  });

  var SLOT_GROUPS = [
    ['Morning', ['10:00 AM', '10:45 AM', '11:30 AM', '12:15 PM']],
    ['Afternoon', ['2:00 PM', '3:30 PM', '4:00 PM']],
    ['Evening', ['5:00 PM', '6:30 PM', '7:15 PM']]
  ];
  var DAYS = 7;

  function duration(mins) {
    if (mins < 60) return mins + ' min';
    var h = Math.floor(mins / 60), m = mins % 60;
    return h + ' hr' + (m ? ' ' + m + ' min' : '');
  }

  function rupees(n) { return '₹' + n.toLocaleString('en-IN'); }

  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    h ^= h >>> 15;
    h = Math.imul(h, 0x2c1b3c6d);
    h ^= h >>> 12;
    return h >>> 0;
  }

  // Demo availability: deterministic per salon, specialist, day and time.
  function slotStatus(salon, spec, day, time) {
    return hash(salon + '|' + spec + '|' + day + '|' + time) % 10 < 6 ? 'Full' : 'Open';
  }

  function dayDate(i) {
    var d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  }

  function dayLabel(i) {
    if (i === 0) return 'Today';
    if (i === 1) return 'Tomorrow';
    var d = dayDate(i);
    var label = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] + ' ' + d.getDate();
    return d.getMonth() === new Date().getMonth() ? label
      : label + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
  }

  function nextFree(salon, spec) {
    for (var d = 0; d < DAYS; d++) {
      for (var g = 0; g < SLOT_GROUPS.length; g++) {
        var times = SLOT_GROUPS[g][1];
        for (var t = 0; t < times.length; t++) {
          if (slotStatus(salon, spec, d, times[t]) !== 'Full') return { day: d, time: times[t], label: dayLabel(d) + ', ' + times[t] };
        }
      }
    }
    return null;
  }

  function service(salon, key) {
    var s = SALONS[salon];
    return s ? s.services.filter(function (x) { return x.key === key; })[0] : null;
  }

  // Specialists who perform a given service (falls back to everyone if `for` is missing).
  function specsFor(salon, svcKey) {
    var s = SALONS[salon];
    if (!s) return [];
    if (!svcKey) return s.specs.slice();
    return s.specs.filter(function (sp) {
      return !sp.for || !sp.for.length || sp.for.indexOf(svcKey) !== -1;
    });
  }

  // Totals for a list of services booked together in one appointment.
  function totals(list) {
    var t = { price: 0, off: 0, mins: 0 };
    list.forEach(function (s) { t.price += s.price; t.off += s.off; t.mins += s.mins; });
    t.total = t.price - t.off;
    t.dur = duration(t.mins);
    return t;
  }

  window.GTCatalog = {
    SALONS: SALONS, SLOT_GROUPS: SLOT_GROUPS, DAYS: DAYS,
    duration: duration, rupees: rupees, slotStatus: slotStatus, dayDate: dayDate, dayLabel: dayLabel,
    nextFree: nextFree, service: service, specsFor: specsFor, totals: totals
  };
})();
