# Moving Masters Website
Pages: index, about, services, pricing, gallery, areas, faq, contact, booking.
Open index.html, or upload the folder to any host.

## Edit
- Prices, crew sizes, owner email: js/config.js
- Colors: css/style.css (:root variables)
- Gallery images: replace files in assets/img (moving1-9.jpg). Before/after sliders on gallery.html use placeholders.

## Booking & email setup (important)
Forms use FormSubmit.co: the owner receives each booking and the client gets an auto-reply with their quote.
1. Upload the site to a live host.
2. Submit one test booking – FormSubmit emails Khariharris003@gmail.com an activation link; click it once.
3. Done. (Prefer EmailJS/Formspree? swap the fetch URL in js/main.js `send()`.)
Note: packing rates ($125/$150) are treated as hourly – adjust in config.js if they are flat.
