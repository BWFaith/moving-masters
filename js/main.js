(function () {
  var d = document,
    $ = function (s, c) {
      return (c || d).querySelector(s);
    },
    $$ = function (s, c) {
      return [].slice.call((c || d).querySelectorAll(s));
    };
  var rm = matchMedia(
    "(prefers-reduced-motion:reduce)",
  ).matches;
  /* header + menu */
  var hd = $(".hd"),
    ul = $(".nav ul"),
    bg = $(".bg");
  function sc() {
    hd.classList.toggle("sc", scrollY > 40);
  }
  sc();
  addEventListener("scroll", sc, { passive: true });
  bg &&
    bg.addEventListener("click", function () {
      ul.classList.toggle("o");
    });
  $$(".nav ul a").forEach(function (a) {
    a.addEventListener("click", function () {
      ul.classList.remove("o");
    });
  });
  /* reveal on scroll */
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  $$(".rv").forEach(function (el, i) {
    el.style.setProperty("--dl", (i % 4) * 0.09 + "s");
    io.observe(el);
  });
  /* counters */
  var co = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var el = e.target,
          t = +el.dataset.n,
          s = el.dataset.s || "",
          st = performance.now();
        (function f(n) {
          var p = Math.min((n - st) / 1600, 1);
          el.textContent =
            Math.round(t * (1 - Math.pow(1 - p, 3))) + s;
          if (p < 1) requestAnimationFrame(f);
        })(st);
      });
    },
    { threshold: 0.5 },
  );
  $$("[data-n]").forEach(function (el) {
    co.observe(el);
  });
  /* hero: split headline, parallax, falling leaves */
  var h1 = $(".hero h1");
  if (h1) {
    var n = 0;
    h1.innerHTML = h1.innerHTML.replace(
      /(<em>)?([^<\s]+)(<\/em>)?/g,
      function (m, a, w, b) {
        return (
          (a || "") +
          '<span class="w"><i style="--d:' +
          n++ +
          '">' +
          w +
          "</i></span>" +
          (b || "") +
          " "
        );
      },
    );
    var bgi = $(".hero .bgimg");
    if (!rm && matchMedia("(pointer:fine)").matches)
      addEventListener("mousemove", function (e) {
        bgi.style.translate =
          (e.clientX / innerWidth - 0.5) * -18 +
          "px " +
          (e.clientY / innerHeight - 0.5) * -12 +
          "px";
      });
    var cv = $("#leaves");
    if (cv && !rm) {
      var x = cv.getContext("2d"),
        W,
        H,
        L = [],
        cols = ["#f5b800", "#e07b1a", "#b8481c", "#d9a21b"];
      function rs() {
        W = cv.width = cv.offsetWidth;
        H = cv.height = cv.offsetHeight;
      }
      rs();
      addEventListener("resize", rs);
      for (var i = 0; i < (innerWidth < 700 ? 14 : 28); i++)
        L.push({
          x: Math.random() * W,
          y: Math.random() * H,
          s: 6 + Math.random() * 10,
          v: 0.5 + Math.random() * 1.1,
          r: Math.random() * 6,
          a: Math.random() * 2,
          c: cols[i % 4],
        });
      (function f() {
        x.clearRect(0, 0, W, H);
        L.forEach(function (l) {
          l.y += l.v;
          l.x += Math.sin((l.a += 0.02)) * 0.9 + 0.35;
          l.r += 0.03;
          if (l.y > H + 20) {
            l.y = -20;
            l.x = Math.random() * W;
          }
          x.save();
          x.translate(l.x, l.y);
          x.rotate(l.r);
          x.fillStyle = l.c;
          x.globalAlpha = 0.75;
          x.beginPath();
          x.ellipse(0, 0, l.s, l.s * 0.55, 0, 0, 6.3);
          x.fill();
          x.restore();
        });
        if (!document.hidden) requestAnimationFrame(f);
        else setTimeout(f, 300);
      })();
    }
  }
  /* gallery filter + lightbox */
  $$(".fl button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".fl button").forEach(function (x) {
        x.classList.remove("on");
      });
      b.classList.add("on");
      $$(".gal figure").forEach(function (f) {
        f.classList.toggle(
          "h",
          b.dataset.f !== "all" &&
            f.dataset.c !== b.dataset.f,
        );
      });
    });
  });
  var lb = $(".lb");
  if (lb) {
    $$(".gal img").forEach(function (i) {
      i.addEventListener("click", function () {
        $("img", lb).src = i.src;
        lb.classList.add("o");
      });
    });
    lb.addEventListener("click", function () {
      lb.classList.remove("o");
    });
  }
  /* before / after sliders */
  $$(".ba").forEach(function (b) {
    var r = $("input", b);
    r.addEventListener("input", function () {
      $(".af", b).style.clipPath =
        "inset(0 0 0 " + r.value + "%)";
      $(".ln", b).style.left = r.value + "%";
    });
  });
  /* quote calculator */
  var qf = $("#quote");
  function money(n) {
    return "$" + n.toLocaleString();
  }
  function calc() {
    if (!qf) return null;
    var C = window.MM,
      lc = +qf.loadCrew.value,
      lh = Math.max(
        C.minHours,
        +qf.loadHours.value || C.minHours,
      ),
      pc = +qf.packCrew.value,
      ph = pc
        ? Math.max(
            C.minHours,
            +qf.packHours.value || C.minHours,
          )
        : 0;
    var a = C.loadRates[lc] * lh,
      b = C.packRates[pc] * ph,
      t = a + b;
    $("#ql").textContent =
      lc + "-man crew × " + lh + " hrs";
    $("#qlv").textContent = money(a);
    $("#qp").textContent = pc
      ? pc + "-man packing × " + ph + " hrs"
      : "Packing (none)";
    $("#qpv").textContent = money(b);
    $("#qt").textContent = money(t);
    qf.packHours.parentNode.style.display = pc
      ? ""
      : "none";
    return {
      total: t,
      load: lc + "-man crew, " + lh + " hrs = " + money(a),
      pack: pc
        ? pc + "-man packing, " + ph + " hrs = " + money(b)
        : "No packing",
      lh: lh,
    };
  }
  if (qf) {
    qf.addEventListener("input", calc);
    calc();
  }
  /* email (FormSubmit: owner gets the booking, client gets an auto-reply copy of the quote) */
  function send(f, extra, ok) {
    var C = window.MM,
      fd = new FormData(f),
      btn = $("button[type=submit]", f),
      m = $(".msg", f);
    Object.keys(extra || {}).forEach(function (k) {
      fd.append(k, extra[k]);
    });
    fd.append("_captcha", "false");
    fd.append("_template", "table");
    fd.append("_replyto", fd.get("email"));
    btn.disabled = true;
    btn.textContent = "Sending…";
    fetch("https://formsubmit.co/ajax/" + C.ownerEmail, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: fd,
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        if (j.success === "false" || j.success === false)
          throw 0;
        ok(fd);
      })
      .catch(function () {
        m.style.color = "#b00020";
        m.textContent =
          "Could not send. Please call " +
          C.phone +
          " or try again.";
        btn.disabled = false;
        btn.textContent = "Try again";
      });
  }
  $$("form[data-mail]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = f.id === "quote" ? calc() : null,
        ex = {};
      if (q) {
        ex = {
          _subject:
            "New Moving Masters booking – " + f.name.value,
          "Estimated total": money(q.total),
          "Load/unload": q.load,
          Packing: q.pack,
          _autoresponse:
            "Hi " +
            f.name.value +
            ", thank you for booking with Moving Masters! Your estimated quote is " +
            money(q.total) +
            " (" +
            q.load +
            "; " +
            q.pack +
            "). Requested date: " +
            f.date.value +
            ". We will call or text you shortly to confirm. Questions? Call " +
            window.MM.phone +
            ". – Moving Masters, Fayetteville NC",
        };
      } else
        ex = {
          _subject:
            "New Moving Masters message – " + f.name.value,
          _autoresponse:
            "Hi " +
            f.name.value +
            ", thanks for contacting Moving Masters. We received your message and will reply shortly. Need us faster? Call or text " +
            window.MM.phone +
            ".",
        };
      send(f, ex, function () {
        f.style.display = "none";
        var o = $(".ok", f.parentNode);
        o.style.display = "block";
        if (q) $("#okq", o).textContent = money(q.total);
        o.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    });
  });
})();
