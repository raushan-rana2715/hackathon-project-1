TWIGGY FRONTEND DEMO - UPDATED

SETUP
1. Extract this ZIP.
2. Open the extracted folder in VS Code.
3. Open Terminal in this folder and run:
   npm install
   npm run dev
4. Open the localhost URL shown by Vite.

DEMO LOGIN
Admin: admin@twiggy.demo / admin123
Pizza Palace: pizza@twiggy.demo / pizza123
Biryani House: biryani@twiggy.demo / biryani123
Burger Hub: burger@twiggy.demo / burger123
Wok Express: wok@twiggy.demo / wok123
Sweet Treats: sweet@twiggy.demo / sweet123
User: select User > Sign up and create an account.

NEW FEATURES
- Checkout city field with browser location permission and reverse city lookup.
- Manual city entry fallback.
- Bill breakdown: subtotal, delivery fee, platform fee and total.
- Restaurant dashboard has Accept / Reject buttons for new orders.
- User order history shows confirmation, preparation or unavailable-food messages.
- LocalStorage storage events sync orders/statuses between tabs in the same browser.

IMPORTANT LIMITATIONS
This is still a frontend-only prototype. Browser geolocation requires user permission and usually a secure context (HTTPS or localhost). City reverse lookup uses the OpenStreetMap Nominatim public service and may be rate-limited; manual city entry is available as fallback.

LocalStorage is NOT a real backend. Cross-device notifications (customer phone -> restaurant's separate phone/computer), reliable live order sync, push notifications, real payments and courier tracking require a backend such as Firebase or Supabase, plus appropriate authentication and server-side access rules. In this demo, order sync is limited to tabs in the same browser profile.

Passwords are stored in LocalStorage for demonstration only. Never use real passwords or payment details. Delivery/platform fees are demo values and should be configured to match your actual business rules.
