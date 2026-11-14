(function () {
  "use strict";

  // 20 Desember 2026, 08:00 WIB (UTC+7)
  var weddingDate = new Date("2026-12-20T08:00:00+07:00").getTime();

  var els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
    wrap: document.getElementById("countdown"),
    done: document.getElementById("countdown-done")
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  var timer;
  function tick() {
    var diff = weddingDate - Date.now();
    if (diff <= 0) {
      clearInterval(timer);
      els.wrap.hidden = true;
      els.done.hidden = false;
      return;
    }
    els.days.textContent = Math.floor(diff / 86400000);
    els.hours.textContent = pad(Math.floor((diff / 3600000) % 24));
    els.minutes.textContent = pad(Math.floor((diff / 60000) % 60));
    els.seconds.textContent = pad(Math.floor((diff / 1000) % 60));
  }
  tick();
  timer = setInterval(tick, 1000);

  // Nama tamu dari URL, contoh: ?to=Bapak%20Ahmad
  var guest = new URLSearchParams(window.location.search).get("to");
  if (guest) {
    document.getElementById("guest-name").textContent = guest;
    document.getElementById("rsvp-name").value = guest;
  }

  // Tombol "Buka Undangan" -> scroll halus ke detail acara
  var openBtn = document.getElementById("open-invitation");
  var eventSection = document.getElementById("acara");
  if (openBtn && eventSection) {
    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      eventSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      eventSection.focus({ preventScroll: true });
    });
  }

  // Animasi muncul saat scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  // RSVP
  var form = document.getElementById("rsvp-form");
  var status = document.getElementById("form-status");
  var list = document.getElementById("wishes");

  var attendanceLabel = {
    hadir: "Hadir",
    tidak: "Tidak Hadir",
    ragu: "Masih Ragu"
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var attendance = data.get("attendance");
    var guests = data.get("guests");
    var message = String(data.get("message") || "").trim();

    status.classList.remove("error");

    if (!name) {
      status.textContent = "Mohon isi nama Anda.";
      status.classList.add("error");
      document.getElementById("rsvp-name").focus();
      return;
    }
    if (!attendance) {
      status.textContent = "Mohon pilih konfirmasi kehadiran.";
      status.classList.add("error");
      return;
    }

    var li = document.createElement("li");
    var strong = document.createElement("strong");
    strong.textContent = name;
    var badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = " · " + attendanceLabel[attendance] +
      (attendance === "hadir" ? " (" + guests + " orang)" : "");
    li.appendChild(strong);
    li.appendChild(badge);
    if (message) {
      var p = document.createElement("p");
      p.textContent = message;
      li.appendChild(p);
    }
    list.prepend(li);

    status.textContent = "Terima kasih, " + name + "! Konfirmasi Anda telah kami terima.";
    form.reset();
  });
})();
