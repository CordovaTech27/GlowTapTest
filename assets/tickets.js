(function () {
  var BOOKINGS = [
    { id: 'GT-48291', group: 'Upcoming', salon: 'Luxe Curls — Indiranagar', svc: 'Haircut & Style', day: 'Tomorrow', when: 'Tomorrow · 11:30 AM', photo: 'assets/photos/salon-interior.jpg', pos: '50% 30%' },
    { id: 'GT-48302', group: 'Upcoming', salon: 'Bloom & Brow', svc: 'Hydra Facial', day: '29 Aug', when: 'Sat, 29 Aug · 4:00 PM', photo: 'assets/photos/salon-facial.jpg', pos: '50% 35%' },
    { id: 'GT-48310', group: 'Upcoming', salon: 'Nord Hair Lab', svc: 'Signature Cut', day: '1 Sep', when: 'Mon, 1 Sep · 6:30 PM', photo: 'assets/photos/salon-mens.jpg', pos: '40% 55%' },
    { id: 'GT-48322', group: 'Upcoming', salon: 'Aura Spa Retreat', svc: 'Deep Tissue', day: '3 Sep', when: 'Wed, 3 Sep · 10:00 AM', photo: 'assets/photos/salon-spa.jpg', pos: '10% 20%' },
    { id: 'GT-48140', group: 'Past', salon: 'Bloom & Brow', svc: 'Brow Threading', day: '20 Aug', when: '20 Aug · 5:00 PM · Cancelled', photo: 'assets/photos/salon-makeup.jpg', pos: '50% 50%' },
    { id: 'GT-48110', group: 'Past', salon: 'Luxe Curls — Indiranagar', svc: 'Blow Dry', day: '12 Aug', when: '12 Aug · 2:00 PM', photo: 'assets/photos/salon-color.jpg', pos: '50% 40%' },
    { id: 'GT-48088', group: 'Past', salon: 'Aura Spa Retreat', svc: 'Swedish Massage', day: '3 Aug', when: '3 Aug · 11:00 AM · Cancelled', photo: 'assets/photos/salon-spa.jpg', pos: '60% 40%' },
    { id: 'GT-48055', group: 'Past', salon: 'Luxe Curls — Indiranagar', svc: 'Haircut & Style', day: '28 Jul', when: '28 Jul · 11:30 AM', photo: 'assets/photos/salon-interior.jpg', pos: '50% 30%' },
    { id: 'GT-47940', group: 'Past', salon: 'Nord Hair Lab', svc: 'Signature Cut', day: '15 Jul', when: '15 Jul · 6:00 PM', photo: 'assets/photos/salon-mens.jpg', pos: '40% 55%' }
  ];

  var SEED = [
    {
      id: 'TK-2041', title: 'Refund not reflected', reason: 'Payment / refund', booking: 'GT-48088',
      status: 'progress', waiting: 'you', updated: 'Updated 2 hr ago',
      thread: [
        { from: 'you', at: '22 Aug, 4:10 PM', text: 'I cancelled my Aura Spa booking but the refund of ₹1,899 hasn’t shown on my card yet.' },
        { event: 'open', at: '22 Aug, 4:10 PM' },
        { from: 'care', name: 'Neha', at: '22 Aug, 6:02 PM', text: 'Thanks for reaching out, and sorry for the trouble. Could you share the last 4 digits of the card you paid with?' },
        { event: 'progress', at: '22 Aug, 6:02 PM' },
        { from: 'you', at: '22 Aug, 6:20 PM', text: 'It’s the card ending 4421.' },
        { from: 'care', name: 'Neha', at: 'Today, 10:15 AM', text: 'Thanks! The refund was sent to your card ending 4421 on 4 Aug. Could you share a screenshot of your card statement from 4–12 Aug? Our payments team will trace it with your bank.' }
      ]
    },
    {
      id: 'TK-1988', title: 'Wrong specialist assigned', reason: 'Booking issue', booking: 'GT-48291',
      status: 'open', waiting: 'care', updated: 'Created yesterday',
      thread: [
        { from: 'you', at: 'Yesterday, 8:45 PM', text: 'I booked Priya S. for my haircut tomorrow, but the salon messaged saying another stylist will do it. I’d like to keep Priya.' },
        { event: 'open', at: 'Yesterday, 8:45 PM' }
      ]
    },
    {
      id: 'TK-1902', title: 'Unable to reschedule', reason: 'Booking issue', booking: 'GT-47940',
      status: 'resolved', waiting: '', updated: 'Resolved 13 Jul',
      thread: [
        { from: 'you', at: '12 Jul, 7:05 PM', text: 'The Reschedule button keeps showing an error for my Nord Hair Lab booking. I want to move it to 15 Jul evening.' },
        { event: 'open', at: '12 Jul, 7:05 PM' },
        { from: 'care', name: 'Rahul', at: '12 Jul, 8:30 PM', text: 'Sorry about that! We’ve moved your booking to 15 Jul, 6:00 PM with Arjun K. Can you check it shows correctly in My bookings?' },
        { event: 'progress', at: '12 Jul, 8:30 PM' },
        { from: 'you', at: '12 Jul, 8:41 PM', text: 'Yes, I can see it now. Thanks!' },
        { from: 'care', name: 'Rahul', at: '13 Jul, 9:10 AM', text: 'Glad it’s sorted. We’re closing this ticket — reopen it anytime if you need more help.' },
        { event: 'resolved', at: '13 Jul, 9:10 AM' }
      ]
    }
  ];

  var STATUS = { open: 'Open', progress: 'In progress', resolved: 'Resolved' };
  var EVENT = { open: 'Ticket raised', progress: 'Status changed to In progress', resolved: 'Marked as resolved', reopened: 'You reopened this ticket' };

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  function nowLabel() {
    var d = new Date(), h = d.getHours(), m = d.getMinutes();
    return 'Today, ' + ((h % 12) || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h < 12 ? 'AM' : 'PM');
  }

  function merge(t) {
    var log = load('gt-ticket-log', {})[t.id];
    var out = JSON.parse(JSON.stringify(t));
    if (log) {
      out.thread = out.thread.concat(log.add || []);
      if (log.status) out.status = log.status;
      if (log.waiting !== undefined) out.waiting = log.waiting;
      if (log.updated) out.updated = log.updated;
    }
    return out;
  }

  function all() {
    return load('gt-tickets', []).slice().reverse().concat(SEED).map(merge);
  }

  function get(id) {
    var list = all();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function booking(id) {
    for (var i = 0; i < BOOKINGS.length; i++) if (BOOKINGS[i].id === id) return BOOKINGS[i];
    return null;
  }

  function bookingLabel(b) {
    return b.salon.split(' — ')[0] + ' · ' + b.svc + ' · ' + b.day;
  }

  function active() {
    var map = {};
    all().forEach(function (t) { if (t.status !== 'resolved' && !map[t.reason]) map[t.reason] = t; });
    return map;
  }

  function openTicket(reason, bookingId) {
    if (!reason) return null;
    var key = !bookingId || bookingId === 'none' ? '' : bookingId;
    var found = null;
    all().forEach(function (t) {
      if (found || t.status === 'resolved' || t.reason !== reason) return;
      if ((t.booking || '') !== key) return;
      found = t;
    });
    return found;
  }

  function create(data) {
    var mine = load('gt-tickets', []);
    var id = 'TK-' + (2042 + mine.length);
    var at = nowLabel();
    mine.push({
      id: id, title: data.title, reason: data.reason, booking: data.booking || '',
      status: 'open', waiting: 'care', updated: 'Created just now',
      thread: [{ from: 'you', at: at, text: data.text }, { event: 'open', at: at }]
    });
    save('gt-tickets', mine);
    return id;
  }

  function patch(id, fn) {
    var logs = load('gt-ticket-log', {});
    logs[id] = logs[id] || { add: [] };
    fn(logs[id]);
    save('gt-ticket-log', logs);
  }

  function reply(id, text) {
    patch(id, function (l) {
      l.add.push({ from: 'you', at: nowLabel(), text: text });
      l.waiting = 'care';
      l.updated = 'Updated just now';
    });
  }

  function reopen(id) {
    patch(id, function (l) {
      l.add.push({ event: 'reopened', at: nowLabel() });
      l.status = 'open';
      l.waiting = 'care';
      l.updated = 'Reopened just now';
    });
  }

  function lastMessage(t) {
    for (var i = t.thread.length - 1; i >= 0; i--) if (t.thread[i].text) return t.thread[i];
    return null;
  }

  window.GTTickets = {
    BOOKINGS: BOOKINGS, STATUS: STATUS, EVENT: EVENT,
    all: all, get: get, booking: booking, bookingLabel: bookingLabel, active: active, openTicket: openTicket,
    create: create, reply: reply, reopen: reopen, lastMessage: lastMessage
  };
})();
