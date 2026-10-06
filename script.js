(function () {
  // ---------- EDIT THESE ----------
  // Wedding date and time (month is 1-12)
  var W = { y: 2026, m: 11, d: 18, h: 15, mi: 0 };
  // --------------------------------

  var MONTHS = ["հունվար", "փետրվար", "մարտ", "ապրիլ", "մայիս", "հունիս", "հուլիս", "օգոստոս", "սեպտեմբեր", "հոկտեմբեր", "նոյեմբեր", "դեկտեմբեր"];
  var DAYS = ["Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ"];
  var WEEK_HEAD = ["Երկ", "Երք", "Չրք", "Հնգ", "Ուր", "Շբթ", "Կիր"];

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function $(id) {
    return document.getElementById(id);
  }

  var wedding = new Date(W.y, W.m - 1, W.d, W.h, W.mi);

  // ---------- Texts from the date ----------
  $("hd").textContent = pad(W.d) + " · " + pad(W.m) + " · " + W.y;
  $("wd").textContent = DAYS[wedding.getDay()];
  $("my").textContent = W.d + " " + MONTHS[W.m - 1] + ", " + W.y;
  $("tm").textContent = pad(W.h) + ":" + pad(W.mi);

  // ---------- Calendar ----------
  var cal = "";
  var firstDay = (new Date(W.y, W.m - 1, 1).getDay() + 6) % 7; // week starts on Monday
  var daysInMonth = new Date(W.y, W.m, 0).getDate();

  WEEK_HEAD.forEach(function (name) {
    cal += "<b>" + name + "</b>";
  });

  for (var i = 0; i < firstDay; i++) {
    cal += "<i></i>";
  }

  for (var n = 1; n <= daysInMonth; n++) {
    var mark = n === W.d ? ' class="on"' : "";
    cal += "<i" + mark + ">" + n + "</i>";
  }

  $("cal").innerHTML = cal;

  // ---------- Clock ----------
  var ticks = "";

  for (var k = 0; k < 12; k++) {
    var angle = (k * 30 * Math.PI) / 180;
    var x1 = (60 + 49 * Math.sin(angle)).toFixed(1);
    var y1 = (60 - 49 * Math.cos(angle)).toFixed(1);
    var x2 = (60 + 53 * Math.sin(angle)).toFixed(1);
    var y2 = (60 - 53 * Math.cos(angle)).toFixed(1);

    ticks += '<line class="tk" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>';
  }

  $("tks").innerHTML = ticks;

  var hourAngle = ((W.h % 12) + W.mi / 60) * 30;
  var minuteAngle = W.mi * 6;

  $("clk").querySelector(".hh").setAttribute("transform", "rotate(" + hourAngle + " 60 60)");
  $("clk").querySelector(".mh").setAttribute("transform", "rotate(" + minuteAngle + " 60 60)");

  // ---------- Countdown ----------
  function tick() {
    var left = Math.max(0, wedding.getTime() - Date.now());

    $("d").textContent = Math.floor(left / 864e5);
    $("h").textContent = pad(Math.floor((left % 864e5) / 36e5));
    $("m").textContent = pad(Math.floor((left % 36e5) / 6e4));
    $("s").textContent = pad(Math.floor((left % 6e4) / 1e3));
  }

  tick();
  setInterval(tick, 1000);

  // ---------- Reveal on scroll ----------
  var reveals = document.querySelectorAll(".rv");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  // ---------- Envelope ----------
  var intro = $("intro");
  var opened = false;

  try {
    history.scrollRestoration = "manual";
  } catch (e) {}

  window.scrollTo(0, 0);

  $("env").addEventListener("click", function () {
    if (opened) {
      return;
    }

    opened = true;
    intro.classList.add("open");

    setTimeout(function () {
      intro.classList.add("done");
      document.body.classList.remove("pre");
      window.scrollTo(0, 0);
    }, 2300);
  });
})();
