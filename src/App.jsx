import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";

const STORAGE = {
  users: "twiggy-users-v2",
  restaurants: "twiggy-restaurants-v2",
  foods: "twiggy-foods-v2",
  orders: "twiggy-orders-v2",
  session: "twiggy-session-v2",
  budget: "twiggy-budget-v2",
  spend: "twiggy-spend-v2",
};

const seedRestaurants = [
  { id: "r1", name: "Pizza Palace", cuisine: "Italian • Pizza", rating: 4.8, time: "25–35 min", location: "Benz Circle", active: true, ownerEmail: "pizza@twiggy.demo", password: "pizza123", emoji: "🍕", description: "Wood-fired favourites and cheesy classics." },
  { id: "r2", name: "Biryani House", cuisine: "Indian • Biryani", rating: 4.7, time: "30–40 min", location: "M.G. Road", active: true, ownerEmail: "biryani@twiggy.demo", password: "biryani123", emoji: "🍛", description: "Aromatic rice, slow-cooked spices and comfort." },
  { id: "r3", name: "Burger Hub", cuisine: "Fast Food • Burgers", rating: 4.6, time: "20–30 min", location: "Labbipet", active: true, ownerEmail: "burger@twiggy.demo", password: "burger123", emoji: "🍔", description: "Juicy burgers, crispy sides and shakes." },
  { id: "r4", name: "Wok Express", cuisine: "Asian • Chinese", rating: 4.5, time: "20–30 min", location: "Governorpet", active: true, ownerEmail: "wok@twiggy.demo", password: "wok123", emoji: "🍜", description: "Fresh wok-tossed noodles and Asian bowls." },
  { id: "r5", name: "Sweet Treats", cuisine: "Desserts • Bakery", rating: 4.9, time: "15–25 min", location: "Suryaraopet", active: true, ownerEmail: "sweet@twiggy.demo", password: "sweet123", emoji: "🍰", description: "Desserts, pancakes and little celebrations." },
];

const seedFoods = [
  { id: "f1", restaurantId: "r1", name: "Margherita Pizza", description: "Classic cheese, basil and tomato", price: 249, category: "Pizza", emoji: "🍕", rating: 4.8, mood: ["happy"], available: true, freshness: 97, isLeftover: false },
  { id: "f2", restaurantId: "r1", name: "Farmhouse Pizza", description: "Bell peppers, onion and mushrooms", price: 319, category: "Pizza", emoji: "🍕", rating: 4.7, mood: ["happy", "hungry"], available: true, freshness: 96, isLeftover: false },
  { id: "f3", restaurantId: "r2", name: "Veg Dum Biryani", description: "Aromatic basmati, dum spices and raita", price: 229, category: "Indian", emoji: "🍛", rating: 4.9, mood: ["hungry"], available: true, freshness: 98, isLeftover: false },
  { id: "f4", restaurantId: "r2", name: "Paneer Rice Bowl", description: "Paneer, fragrant rice and fresh herbs", price: 209, category: "Indian", emoji: "🥘", rating: 4.7, mood: ["happy", "hungry"], available: true, freshness: 95, isLeftover: false },
  { id: "f5", restaurantId: "r3", name: "Classic Veg Burger", description: "Crispy patty, lettuce and house sauce", price: 159, category: "Burgers", emoji: "🍔", rating: 4.6, mood: ["hungry"], available: true, freshness: 96, isLeftover: false },
  { id: "f6", restaurantId: "r3", name: "Paneer Tikka Burger", description: "Smoky paneer, mint mayo and slaw", price: 199, category: "Burgers", emoji: "🍔", rating: 4.8, mood: ["hungry", "happy"], available: true, freshness: 97, isLeftover: false },
  { id: "f7", restaurantId: "r4", name: "Chilli Garlic Noodles", description: "Wok-tossed noodles with vegetables", price: 179, category: "Asian", emoji: "🍜", rating: 4.5, mood: ["rainy", "hungry"], available: true, freshness: 95, isLeftover: false },
  { id: "f8", restaurantId: "r4", name: "Hot & Sour Soup", description: "Comforting broth, vegetables and pepper", price: 129, category: "Asian", emoji: "🍲", rating: 4.6, mood: ["rainy", "sad"], available: true, freshness: 98, isLeftover: false },
  { id: "f9", restaurantId: "r5", name: "Chocolate Sundae", description: "Chocolate, vanilla and crunchy toppings", price: 119, category: "Desserts", emoji: "🍨", rating: 4.8, mood: ["sad", "happy"], available: true, freshness: 97, isLeftover: false },
  { id: "f10", restaurantId: "r5", name: "Classic Pancakes", description: "Fluffy pancakes with maple drizzle", price: 149, category: "Desserts", emoji: "🥞", rating: 4.5, mood: ["sad"], available: true, freshness: 96, isLeftover: false },
  { id: "f11", restaurantId: "r2", name: "Chef's Saver Meal", description: "A discounted end-of-service meal box", price: 99, category: "Leftover Saver", emoji: "🥡", rating: 4.5, mood: ["hungry"], available: true, freshness: 91, isLeftover: true },
];

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const makeId = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function App() {
  const [restaurants, setRestaurants] = useState(() => read(STORAGE.restaurants, seedRestaurants));
  const [foods, setFoods] = useState(() => read(STORAGE.foods, seedFoods));
  const [users, setUsers] = useState(() => read(STORAGE.users, []));
  const [orders, setOrders] = useState(() => read(STORAGE.orders, []));
  const [session, setSession] = useState(() => read(STORAGE.session, null));
  const [budget, setBudget] = useState(() => read(STORAGE.budget, 2500));
  const [spent, setSpent] = useState(() => read(STORAGE.spend, 0));
  const [authMode, setAuthMode] = useState("login");
  const [authRole, setAuthRole] = useState("user");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [activeRestaurant, setActiveRestaurant] = useState("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutName, setCheckoutName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [payment, setPayment] = useState("Cash on delivery (demo)");
  const [mood, setMood] = useState("happy");
  const [surpriseBudget, setSurpriseBudget] = useState("250");
  const [surprise, setSurprise] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState(["You"]);
  const [memberName, setMemberName] = useState("");
  const [groupItems, setGroupItems] = useState([]);
  const [adminTab, setAdminTab] = useState("overview");
  const [restaurantForm, setRestaurantForm] = useState({ name: "", cuisine: "", location: "", emoji: "🍽️", ownerEmail: "", password: "welcome123" });
  const [foodForm, setFoodForm] = useState({ restaurantId: "", name: "", description: "", price: "", category: "Indian", emoji: "🍽️", freshness: 95, isLeftover: false });
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [weeklyBudgetInput, setWeeklyBudgetInput] = useState(String(budget));

  useEffect(() => { localStorage.setItem(STORAGE.restaurants, JSON.stringify(restaurants)); }, [restaurants]);
  useEffect(() => { localStorage.setItem(STORAGE.foods, JSON.stringify(foods)); }, [foods]);
  useEffect(() => { localStorage.setItem(STORAGE.users, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(STORAGE.orders, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(STORAGE.budget, JSON.stringify(budget)); }, [budget]);
  useEffect(() => { localStorage.setItem(STORAGE.spend, JSON.stringify(spent)); }, [spent]);
  useEffect(() => { if (session) localStorage.setItem(STORAGE.session, JSON.stringify(session)); else localStorage.removeItem(STORAGE.session); }, [session]);
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(""), 4200); return () => clearTimeout(t); }, [notice]);

  // LocalStorage changes are shared between tabs of the same browser.
  useEffect(() => {
    function syncOrders(event) {
      if (event.key !== STORAGE.orders || !event.newValue) return;
      try {
        const latest = JSON.parse(event.newValue);
        setOrders(latest);
        if (session?.role === "restaurant") {
          const oldOrders = JSON.parse(event.oldValue || "[]");
          const oldIds = new Set(oldOrders.map((o) => o.id));
          const incoming = latest.filter((o) => o.restaurantId === session.restaurantId && !oldIds.has(o.id));
          if (incoming.length) setNotice(`New order received: ${incoming[0].id}. Please review it.`);
        }
      } catch { /* Ignore invalid LocalStorage data. */ }
    }
    window.addEventListener("storage", syncOrders);
    return () => window.removeEventListener("storage", syncOrders);
  }, [session]);

  const availableRestaurants = restaurants.filter((r) => r.active);
  const foodWithRestaurant = foods.map((f) => ({ ...f, restaurant: restaurants.find((r) => r.id === f.restaurantId) })).filter((f) => f.restaurant);
  const visibleFoods = foodWithRestaurant.filter((f) => f.available && (!f.isLeftover || category === "Leftover Saver" || category === "All") &&
    (activeRestaurant === "all" || f.restaurantId === activeRestaurant) &&
    (category === "All" || f.category === category || (category === "Leftover Saver" && f.isLeftover)) &&
    (!search || `${f.name} ${f.description} ${f.restaurant.name} ${f.category}`.toLowerCase().includes(search.toLowerCase())));
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length ? (cartSubtotal >= 499 ? 0 : 30) : 0;
  const platformFee = cart.length ? 5 : 0;
  const cartTotal = cartSubtotal + deliveryFee + platformFee;
  const currentRestaurant = session?.role === "restaurant" ? restaurants.find((r) => r.id === session.restaurantId) : null;
  const myOrders = orders.filter((o) => session?.role === "restaurant" ? o.restaurantId === session.restaurantId : o.userEmail === session?.email);

  function login(event) {
    event.preventDefault(); setError("");
    const email = authEmail.trim().toLowerCase();
    if (authRole === "admin") {
      if (email === "admin@twiggy.demo" && authPassword === "admin123") {
        setSession({ role: "admin", name: "TWIGGY Admin", email }); setNotice("Admin portal opened."); return;
      }
      setError("Admin demo login: admin@twiggy.demo / admin123"); return;
    }
    if (authRole === "restaurant") {
      const r = restaurants.find((item) => item.ownerEmail?.toLowerCase() === email && item.password === authPassword);
      if (!r) { setError("Restaurant login details are incorrect."); return; }
      setSession({ role: "restaurant", name: r.name, email, restaurantId: r.id }); setNotice(`${r.name} portal opened.`); return;
    }
    if (authMode === "signup") {
      if (!authName.trim()) { setError("Please enter your name."); return; }
      if (users.some((u) => u.email === email)) { setError("This email is already registered."); return; }
      const user = { id: makeId("u"), name: authName.trim(), email, password: authPassword, role: "user" };
      setUsers((prev) => [...prev, user]); setSession({ role: "user", name: user.name, email }); setNotice("Your TWIGGY account is ready.");
    } else {
      const user = users.find((u) => u.email === email && u.password === authPassword);
      if (!user) { setError("Account not found. Please sign up first."); return; }
      setSession({ role: "user", name: user.name, email }); setNotice(`Welcome back, ${user.name}!`);
    }
  }
  function logout() { setSession(null); setCart([]); setShowCart(false); setNotice("Logged out."); }
  function addToCart(food) {
    if (cart.length && cart[0].restaurantId !== food.restaurantId) {
      const ok = window.confirm("Your bag has items from another restaurant. Clear the bag and add this restaurant's food?");
      if (!ok) return;
      setCart([{ ...food, quantity: 1 }]);
    } else {
      setCart((prev) => {
        const found = prev.find((item) => item.id === food.id);
        return found ? prev.map((item) => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item) : [...prev, { ...food, quantity: 1 }];
      });
    }
    setNotice(`${food.name} added to your bag.`);
  }
  function updateQty(id, delta) { setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + delta } : i).filter((i) => i.quantity > 0)); }
  async function detectCity() {
    if (!navigator.geolocation) { setNotice("Location is not supported by this browser. Please enter your city."); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        if (!response.ok) throw new Error("Location lookup failed");
        const data = await response.json();
        const a = data.address || {};
        const detected = a.city || a.town || a.village || a.municipality || a.county || "";
        if (!detected) throw new Error("City name not found");
        setCity(detected);
        setNotice(`Your city detected: ${detected}`);
      } catch {
        setNotice("Could not detect the city name. Please enter it manually.");
      } finally { setLocationLoading(false); }
    }, () => {
      setLocationLoading(false);
      setNotice("Location permission was denied. Please enter your city manually.");
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  }
  function placeOrder(event) {
    event.preventDefault();
    if (!cart.length) return;
    if (!city.trim()) { setNotice("Please detect or enter your delivery city."); return; }
    const order = {
      id: makeId("TW").toUpperCase(), userEmail: session.email, customerName: checkoutName || session.name,
      address, city: city.trim(), payment, restaurantId: cart[0].restaurantId, restaurantName: cart[0].restaurant.name,
      items: cart.map(({ id, name, price, emoji, quantity }) => ({ id, name, price, emoji, quantity })),
      subtotal: cartSubtotal, deliveryFee, platformFee, total: cartTotal, status: "Order placed", customerMessage: "Your order has been sent to the restaurant for confirmation.", createdAt: new Date().toLocaleString(),
      freshness: Math.round(cart.reduce((sum, i) => sum + i.freshness * i.quantity, 0) / cart.reduce((sum, i) => sum + i.quantity, 0)),
    };
    setOrders((prev) => [order, ...prev]); setSpent((prev) => prev + cartTotal); setCart([]); setShowCart(false); setAddress(""); setCheckoutName("");
    setNotice(`Order ${order.id} placed. Waiting for restaurant confirmation.`);
  }
  function updateOrderStatus(orderId, status) {
    const messages = {
      "Accepted": "Great news! The restaurant has confirmed your order and will start preparing it.",
      "Rejected": "Sorry! The restaurant cannot prepare this order because the food is currently unavailable. Please choose another item or restaurant.",
      "Preparing": "Your food is being freshly prepared.",
      "Ready for pickup": "Your order is ready and will be dispatched soon.",
      "Out for delivery": "Your order is on the way. Get ready!",
      "Delivered": "Your order has been delivered. Enjoy your meal!",
      "Cancelled": "Your order was cancelled by the restaurant. We are sorry for the inconvenience."
    };
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status, customerMessage: messages[status] || `Your order status is now ${status}.` } : o));
    setNotice(status === "Accepted" ? "Order accepted. The customer will see the confirmation." : status === "Rejected" ? "Order rejected. The customer will see the unavailable-food message." : `Order status updated: ${status}`);
  }
  function saveRestaurant(event) {
    event.preventDefault();
    const item = { ...restaurantForm, id: makeId("r"), rating: 4.5, time: "25–35 min", active: true, description: "Restaurant partner on TWIGGY." };
    setRestaurants((prev) => [...prev, item]); setRestaurantForm({ name: "", cuisine: "", location: "", emoji: "🍽️", ownerEmail: "", password: "welcome123" }); setNotice("Restaurant added. Share its owner login credentials securely.");
  }
  function saveFood(event) {
    event.preventDefault();
    const payload = { ...foodForm, id: editingFoodId || makeId("f"), price: Number(foodForm.price), freshness: Number(foodForm.freshness), available: true, mood: ["happy", "hungry"], rating: 4.5 };
    setFoods((prev) => editingFoodId ? prev.map((f) => f.id === editingFoodId ? { ...f, ...payload } : f) : [...prev, payload]);
    setFoodForm({ restaurantId: session?.role === "restaurant" ? session.restaurantId : "", name: "", description: "", price: "", category: "Indian", emoji: "🍽️", freshness: 95, isLeftover: false }); setEditingFoodId(null); setNotice("Food item saved.");
  }
  function editFood(food) { setEditingFoodId(food.id); setFoodForm({ restaurantId: food.restaurantId, name: food.name, description: food.description, price: String(food.price), category: food.category, emoji: food.emoji, freshness: food.freshness, isLeftover: food.isLeftover }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function removeFood(id) { if (window.confirm("Delete this food item?")) setFoods((prev) => prev.filter((f) => f.id !== id)); }
  function getSurprise() { const choices = foodWithRestaurant.filter((f) => f.available && f.price <= Number(surpriseBudget)); setSurprise(choices.length ? choices[Math.floor(Math.random() * choices.length)] : null); if (!choices.length) setNotice("No meal found in this budget. Try a higher amount."); }
  function setNewBudget() { const v = Number(weeklyBudgetInput); if (v > 0) { setBudget(v); setNotice("Weekly budget updated."); } }
  function addGroupMember() { if (memberName.trim() && !groupMembers.includes(memberName.trim())) { setGroupMembers((p) => [...p, memberName.trim()]); setMemberName(""); } }
  function addGroupFood(foodId) { const f = foodWithRestaurant.find((x) => x.id === foodId); if (f) setGroupItems((p) => [...p, f]); }

  if (!session) return <div className="auth-wrap"><div className="auth-card"><div className="brand"><span className="brand-icon">t</span>twiggy<span className="orange">.</span></div><p className="eyebrow">GOOD FOOD. GOOD MOOD.</p><h1>{authMode === "signup" && authRole === "user" ? "Join the table." : "Welcome to TWIGGY."}</h1><p className="muted">Choose your portal and sign in to continue.</p>
    <div className="role-tabs">{["user", "admin", "restaurant"].map((role) => <button key={role} className={authRole === role ? "selected" : ""} onClick={() => { setAuthRole(role); setError(""); setAuthMode("login"); }}>{role === "user" ? "User" : role === "admin" ? "Admin" : "Restaurant"}</button>)}</div>
    {authRole === "user" && <div className="role-tabs slim"><button className={authMode === "login" ? "selected" : ""} onClick={() => setAuthMode("login")}>Login</button><button className={authMode === "signup" ? "selected" : ""} onClick={() => setAuthMode("signup")}>Sign up</button></div>}
    <form onSubmit={login} className="form-stack">
      {authMode === "signup" && authRole === "user" && <label>Full name<input required value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder="Your name" /></label>}
      <label>Email<input required type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="you@example.com" /></label>
      <label>Password<input required minLength="6" type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="At least 6 characters" /></label>
      {error && <p className="error">{error}</p>}
      <button className="btn primary full">{authMode === "signup" && authRole === "user" ? "Create account" : "Continue"} →</button>
    </form>
    <div className="demo-credentials"><b>Frontend demo credentials</b><br/>Admin: admin@twiggy.demo / admin123<br/>Pizza Palace: pizza@twiggy.demo / pizza123<br/>Biryani House: biryani@twiggy.demo / biryani123<br/>Burger Hub: burger@twiggy.demo / burger123<br/>Wok Express: wok@twiggy.demo / wok123<br/>Sweet Treats: sweet@twiggy.demo / sweet123</div>
    <small className="muted">Frontend simulation only. Data is saved in this browser's LocalStorage. Do not use real passwords or payment details.</small>
  </div><div className="auth-aside"><span>✳</span><h2>Cravings worth<br/><em>coming home to.</em></h2><p>One place for local flavours, thoughtful picks and feel-good food experiences.</p></div></div>;

  if (session.role === "admin") return <div className="portal"><Header session={session} onLogout={logout} /><main className="container"><div className="page-title"><div><p className="eyebrow">CONTROL CENTRE</p><h1>Admin dashboard</h1><p className="muted">Manage restaurant partners, food listings and customer orders.</p></div><span className="pill">Super Admin</span></div>
    <div className="stats"><Stat label="Restaurants" value={restaurants.length}/><Stat label="Food items" value={foods.length}/><Stat label="Total orders" value={orders.length}/><Stat label="Demo revenue" value={money(orders.reduce((s,o)=>s+o.total,0))}/></div>
    <div className="tabs">{["overview","restaurants","foods","orders"].map(t=><button className={adminTab===t?"active":""} onClick={()=>setAdminTab(t)} key={t}>{t[0].toUpperCase()+t.slice(1)}</button>)}</div>
    {adminTab==="overview" && <div className="panel"><h2>Platform overview</h2><p className="muted">This dashboard uses browser LocalStorage. New restaurants and menu items are visible in the user portal on this browser.</p><div className="quick-grid"><div><b>Restaurant partners</b><strong>{restaurants.filter(r=>r.active).length} active</strong></div><div><b>Pending orders</b><strong>{orders.filter(o=>o.status!=="Delivered" && o.status!=="Cancelled").length}</strong></div><div><b>Registered users</b><strong>{users.length}</strong></div></div></div>}
    {adminTab==="restaurants" && <><form className="panel form-grid" onSubmit={saveRestaurant}><h2 className="span-all">Add restaurant partner</h2><label>Restaurant name<input required value={restaurantForm.name} onChange={e=>setRestaurantForm({...restaurantForm,name:e.target.value})}/></label><label>Cuisine<input required value={restaurantForm.cuisine} onChange={e=>setRestaurantForm({...restaurantForm,cuisine:e.target.value})}/></label><label>Location<input required value={restaurantForm.location} onChange={e=>setRestaurantForm({...restaurantForm,location:e.target.value})}/></label><label>Emoji<input value={restaurantForm.emoji} onChange={e=>setRestaurantForm({...restaurantForm,emoji:e.target.value})}/></label><label>Owner email<input required type="email" value={restaurantForm.ownerEmail} onChange={e=>setRestaurantForm({...restaurantForm,ownerEmail:e.target.value})}/></label><label>Temporary password<input required value={restaurantForm.password} onChange={e=>setRestaurantForm({...restaurantForm,password:e.target.value})}/></label><button className="btn primary span-all">Add restaurant</button></form><div className="panel"><h2>Restaurant partners</h2>{restaurants.map(r=><div className="list-row" key={r.id}><span className="big-emoji">{r.emoji}</span><div className="grow"><b>{r.name}</b><small>{r.cuisine} · {r.location} · {r.ownerEmail}</small></div><button className="btn light" onClick={()=>setRestaurants(p=>p.map(x=>x.id===r.id?{...x,active:!x.active}:x))}>{r.active?"Disable":"Enable"}</button></div>)}</div></>}
    {adminTab==="foods" && <><FoodEditor form={foodForm} setForm={setFoodForm} restaurants={restaurants} onSave={saveFood} editing={editingFoodId} onCancel={()=>{setEditingFoodId(null);setFoodForm({restaurantId:"",name:"",description:"",price:"",category:"Indian",emoji:"🍽️",freshness:95,isLeftover:false})}}/><FoodList foods={foodWithRestaurant} onEdit={editFood} onDelete={removeFood}/></>}
    {adminTab==="orders" && <OrdersTable orders={orders} onStatus={updateOrderStatus} admin/>}
  </main><Toast notice={notice}/></div>;

  if (session.role === "restaurant") {
    const restaurantFoods = foods.filter(f=>f.restaurantId===session.restaurantId).map(f=>({...f,restaurant:currentRestaurant}));
    const restaurantOrders = orders.filter(o=>o.restaurantId===session.restaurantId);
    return <div className="portal"><Header session={session} onLogout={logout}/><main className="container"><div className="page-title"><div><p className="eyebrow">PARTNER PORTAL</p><h1>{currentRestaurant?.name || session.name}</h1><p className="muted">Manage your menu and update orders from your restaurant.</p></div><span className="pill">Restaurant Partner</span></div><div className="stats"><Stat label="Menu items" value={restaurantFoods.length}/><Stat label="Orders received" value={restaurantOrders.length}/><Stat label="Preparing" value={restaurantOrders.filter(o=>o.status==="Preparing").length}/><Stat label="Delivered" value={restaurantOrders.filter(o=>o.status==="Delivered").length}/></div><FoodEditor form={foodForm.restaurantId?foodForm:{...foodForm,restaurantId:session.restaurantId}} setForm={setFoodForm} restaurants={[currentRestaurant].filter(Boolean)} onSave={saveFood} editing={editingFoodId} onCancel={()=>{setEditingFoodId(null);setFoodForm({restaurantId:session.restaurantId,name:"",description:"",price:"",category:"Indian",emoji:"🍽️",freshness:95,isLeftover:false})}}/><FoodList foods={restaurantFoods} onEdit={editFood} onDelete={removeFood}/><OrdersTable orders={restaurantOrders} onStatus={updateOrderStatus} restaurant/></main><Toast notice={notice}/></div>;
  }

  const moodFoods = foodWithRestaurant.filter(f=>f.available && f.mood?.includes(mood));
  const userOrders = orders.filter(o=>o.userEmail===session.email);
  return <div className="portal"><Header session={session} onLogout={logout} cartCount={cart.reduce((s,i)=>s+i.quantity,0)} onCart={()=>setShowCart(true)}/><main>
    <section className="hero container"><div><p className="eyebrow">GOOD FOOD. GOOD MOOD.</p><h1>Cravings worth<br/><em>coming home to.</em></h1><p className="muted">Explore multiple restaurants, choose your favourite kitchen and order from its menu.</p><a className="btn primary" href="#restaurants">Explore restaurants ↓</a></div><div className="hero-plate">🍱<span>✦ Fresh picks daily</span></div></section>
    <section className="container section" id="restaurants"><SectionTitle eyebrow="DISCOVER LOCAL KITCHENS" title="Choose your restaurant" desc="Each restaurant has its own menu, prices and orders."/><div className="restaurant-grid">{availableRestaurants.map(r=><button className={`restaurant-card ${activeRestaurant===r.id?"chosen":""}`} key={r.id} onClick={()=>{setActiveRestaurant(activeRestaurant===r.id?"all":r.id);document.getElementById("food-menu")?.scrollIntoView({behavior:"smooth"})}}><span className="restaurant-emoji">{r.emoji}</span><span className="restaurant-name">{r.name}</span><small>{r.cuisine}</small><span className="restaurant-meta">★ {r.rating} · {r.time}</span><small>📍 {r.location}</small></button>)}</div><button className="text-btn" onClick={()=>setActiveRestaurant("all")}>Show all restaurants</button></section>
    <section className="container section" id="food-menu"><SectionTitle eyebrow="RESTAURANT-WISE MENU" title={activeRestaurant==="all"?"Explore our food":restaurants.find(r=>r.id===activeRestaurant)?.name+" menu"} desc="A food item is linked to one restaurant. Your bag can contain items from one restaurant at a time."/><div className="toolbar"><input placeholder="Search food or restaurant..." value={search} onChange={e=>setSearch(e.target.value)}/><select value={category} onChange={e=>setCategory(e.target.value)}>{["All","Pizza","Burgers","Indian","Asian","Desserts","Leftover Saver"].map(c=><option key={c}>{c}</option>)}</select></div><div className="food-grid">{visibleFoods.map(f=><FoodCard key={f.id} food={f} onAdd={addToCart}/>)}</div>{!visibleFoods.length&&<div className="panel">No food found. Try another filter.</div>}</section>
    <section className="container section feature-grid" id="features"><div className="feature-card dark"><p className="eyebrow">FEATURE 01 · PERSONAL PICKS</p><h2>Mood-to-Meal</h2><p className="muted">Tell TWIGGY how you feel and get a dish recommendation.</p><div className="mood-buttons">{[["happy","😄 Happy"],["sad","🫶 Comfort"],["rainy","🌧️ Rainy"],["hungry","🤤 Hungry"]].map(([v,l])=><button className={mood===v?"selected":""} onClick={()=>setMood(v)} key={v}>{l}</button>)}</div>{moodFoods.slice(0,2).map(f=><div className="mini-food" key={f.id}><span>{f.emoji}</span><div className="grow"><b>{f.name}</b><small>{f.restaurant.name}</small></div><button className="btn light" onClick={()=>addToCart(f)}>Add {money(f.price)}</button></div>)}</div>
      <div className="feature-card"><p className="eyebrow">FEATURE 02 · RANDOM JOY</p><h2>Surprise Meal Box</h2><p className="muted">Set your budget and let TWIGGY choose a meal.</p><div className="inline"><input type="number" min="1" value={surpriseBudget} onChange={e=>setSurpriseBudget(e.target.value)}/><button className="btn primary" onClick={getSurprise}>Surprise me</button></div>{surprise&&<div className="mini-food"><span>{surprise.emoji}</span><div className="grow"><b>{surprise.name}</b><small>{surprise.restaurant.name} · {money(surprise.price)}</small></div><button className="btn light" onClick={()=>addToCart(surprise)}>Add</button></div>}</div>
      <div className="feature-card"><p className="eyebrow">FEATURE 03 · FRIENDS & FOOD</p><h2>Group Feast</h2><p className="muted">Create a shared list and add friends. Demo collaboration on this browser.</p><div className="inline"><input placeholder="Group name" value={groupName} onChange={e=>setGroupName(e.target.value)}/><button className="btn primary" onClick={()=>{if(groupName.trim()){setGroupMembers(["You"]);setGroupItems([]);setNotice("Group created.");}}}>Create</button></div><div className="inline"><input placeholder="Friend name" value={memberName} onChange={e=>setMemberName(e.target.value)}/><button className="btn light" onClick={addGroupMember}>Add person</button></div><small className="muted">{groupName?`${groupName}: `:""}{groupMembers.join(" · ")}</small><select onChange={e=>addGroupFood(e.target.value)} defaultValue=""><option value="" disabled>Add food to group list</option>{foodWithRestaurant.map(f=><option value={f.id} key={f.id}>{f.name} — {f.restaurant.name}</option>)}</select>{groupItems.map((f,i)=><small key={i}>{f.emoji} {f.name} · {money(f.price)}</small>)}</div>
      <div className="feature-card"><p className="eyebrow">FEATURE 04 · SMART SPENDING</p><h2>Food Budget Guardian</h2><p className="muted">Your demo weekly budget and spending.</p><div className="inline"><input type="number" value={weeklyBudgetInput} onChange={e=>setWeeklyBudgetInput(e.target.value)}/><button className="btn primary" onClick={setNewBudget}>Save</button></div><div className="budget-track"><span style={{width:`${Math.min(100,budget?spent/budget*100:0)}%`}}/></div><b>{money(spent)} spent / {money(budget)} budget</b><small className="muted">{money(budget-spent)} remaining</small></div>
      <div className="feature-card"><p className="eyebrow">FEATURE 05 · FOOD CARE</p><h2>Food Freshness Journey</h2><p className="muted">Illustrative freshness information from each listed dish (not a live safety measurement).</p><div className="fresh-list">{foodWithRestaurant.slice(0,5).map(f=><span key={f.id}>{f.emoji} {f.name}<b>{f.freshness}/100</b></span>)}</div></div>
      <div className="feature-card dark"><p className="eyebrow">FEATURE 06 · LESS WASTE</p><h2>Leftover Saver</h2><p className="muted">Discounted end-of-service meal boxes listed by partner restaurants.</p>{foodWithRestaurant.filter(f=>f.isLeftover&&f.available).map(f=><div className="mini-food" key={f.id}><span>{f.emoji}</span><div className="grow"><b>{f.name}</b><small>{f.restaurant.name} · limited demo listing</small></div><button className="btn light" onClick={()=>addToCart(f)}>Add {money(f.price)}</button></div>)}</div>
    </section>
    <section className="container section"><SectionTitle eyebrow="YOUR ORDERS" title="Order history" desc="Track demo orders and their current status."/><OrdersTable orders={userOrders} onStatus={()=>{}} user/></section>
  </main><Footer/><Toast notice={notice}/>
  {showCart&&<div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setShowCart(false)}><div className="cart-drawer"><div className="drawer-head"><h2>Your bag</h2><button className="close" onClick={()=>setShowCart(false)}>×</button></div>{cart.length===0?<p className="muted">Your bag is empty.</p>:<><p className="muted">Restaurant: <b>{cart[0].restaurant.name}</b></p>{cart.map(i=><div className="cart-line" key={i.id}><span>{i.emoji}</span><div className="grow"><b>{i.name}</b><small>{money(i.price)} each</small></div><button onClick={()=>updateQty(i.id,-1)}>−</button><b>{i.quantity}</b><button onClick={()=>updateQty(i.id,1)}>+</button></div>)}<div className="bill"><span>Subtotal</span><b>{money(cartSubtotal)}</b></div><div className="bill"><span>Delivery fee</span><b>{deliveryFee?money(deliveryFee):"FREE"}</b></div><div className="bill"><span>Platform fee</span><b>{money(platformFee)}</b></div><div className="bill total"><span>Total</span><b>{money(cartTotal)}</b></div><form className="form-stack" onSubmit={placeOrder}><label>Name<input value={checkoutName} onChange={e=>setCheckoutName(e.target.value)} placeholder={session.name}/></label><div className="location-field"><label>Delivery city<input required value={city} onChange={e=>setCity(e.target.value)} placeholder="Enter city, e.g. Vijayawada"/></label><button type="button" className="btn light" onClick={detectCity} disabled={locationLoading}>{locationLoading ? "Detecting..." : "📍 Get my location"}</button><small className="muted">Allow location access to detect your city automatically, or enter it manually.</small></div><label>Delivery address<textarea required value={address} onChange={e=>setAddress(e.target.value)} placeholder="House, street, area..."/></label><label>Payment method<select value={payment} onChange={e=>setPayment(e.target.value)}><option>Cash on delivery (demo)</option><option>UPI (demo - no payment)</option><option>Card (demo - no payment)</option></select></label><button className="btn primary full">Place demo order · {money(cartTotal)}</button><small className="muted">No real payment or delivery request is made.</small></form></>}</div></div>}
  </div>;
}

function Header({session,onLogout,cartCount=0,onCart}) { return <header className="topbar"><a className="brand" href="#"><span className="brand-icon">t</span>twiggy<span className="orange">.</span></a><nav><a href="#restaurants">Restaurants</a><a href="#food-menu">Menu</a><a href="#features">Six features</a></nav><div className="header-actions"><span>Hi, {session.name?.split(" ")[0]}</span>{onCart&&<button className="btn dark-btn" onClick={onCart}>Bag ({cartCount})</button>}<button className="btn light" onClick={onLogout}>Logout</button></div></header>; }
function SectionTitle({eyebrow,title,desc}) { return <div className="section-title"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p className="muted">{desc}</p></div>; }
function Stat({label,value}) { return <div className="stat"><small>{label}</small><strong>{value}</strong></div>; }
function FoodCard({food,onAdd}) { return <article className="food-card"><div className="food-art">{food.emoji}<span>★ {food.rating}</span></div><div className="food-body"><div className="food-title"><h3>{food.name}</h3><b>{money(food.price)}</b></div><p>{food.description}</p><small className="muted">🏠 {food.restaurant.name} · {food.category}</small><div className="food-bottom"><small>Freshness info: {food.freshness}/100</small><button className="btn primary" onClick={()=>onAdd(food)}>Add +</button></div></div></article>; }
function FoodEditor({form,setForm,restaurants,onSave,editing,onCancel}) { return <form className="panel form-grid" onSubmit={onSave}><h2 className="span-all">{editing?"Edit food item":"Add food item"}</h2><label>Restaurant<select required value={form.restaurantId} onChange={e=>setForm({...form,restaurantId:e.target.value})}><option value="">Choose restaurant</option>{restaurants.map(r=><option value={r.id} key={r.id}>{r.name}</option>)}</select></label><label>Food name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Description<input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><label>Price (₹)<input required type="number" min="1" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>Category<input required value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></label><label>Emoji<input value={form.emoji} onChange={e=>setForm({...form,emoji:e.target.value})}/></label><label>Freshness info (0–100)<input type="number" min="0" max="100" value={form.freshness} onChange={e=>setForm({...form,freshness:e.target.value})}/></label><label className="check-label"><input type="checkbox" checked={form.isLeftover} onChange={e=>setForm({...form,isLeftover:e.target.checked})}/> List in Leftover Saver</label><div className="span-all inline"><button className="btn primary">{editing?"Update food":"Save food"}</button>{editing&&<button type="button" className="btn light" onClick={onCancel}>Cancel edit</button>}</div></form>; }
function FoodList({foods,onEdit,onDelete}) { return <div className="panel"><h2>Menu items</h2>{foods.map(f=><div className="list-row" key={f.id}><span className="big-emoji">{f.emoji}</span><div className="grow"><b>{f.name}</b><small>{f.restaurant?.name} · {money(f.price)} · {f.category}</small></div><button className="btn light" onClick={()=>onEdit(f)}>Edit</button><button className="btn danger" onClick={()=>onDelete(f.id)}>Delete</button></div>)}{!foods.length&&<p className="muted">No food items yet.</p>}</div>; }
function OrdersTable({orders,onStatus,admin=false,user=false,restaurant=false}) {
  const statuses=["Accepted","Preparing","Ready for pickup","Out for delivery","Delivered","Cancelled"];
  return <div className="panel"><h2>{user?"Your orders":restaurant?"Incoming restaurant orders":"Orders"}</h2>
    {orders.length===0?<p className="muted">No orders yet.</p>:orders.map(o=><div className="order-row" key={o.id}>
      <div className="grow"><b>{o.id} · {o.restaurantName}</b><small>{o.customerName} · {o.createdAt} · {o.items.map(i=>`${i.name} ×${i.quantity}`).join(", ")}</small><small>{money(o.total)} · {o.city ? `${o.city}, ` : ""}{o.address}</small>
      {user&&o.customerMessage&&<p className={`order-message ${o.status==="Rejected"||o.status==="Cancelled"?"negative":""}`}>{o.status==="Accepted"?"✓ ":o.status==="Rejected"?"! ":"ℹ "}{o.customerMessage}</p>}</div>
      <div className="order-actions"><strong className={`pill ${o.status==="Rejected"?"rejected":""}`}>{o.status}</strong>
        {restaurant&&o.status==="Order placed"&&<div className="decision-buttons"><button className="btn primary" onClick={()=>onStatus(o.id,"Accepted")}>Accept</button><button className="btn danger" onClick={()=>onStatus(o.id,"Rejected")}>Reject</button></div>}
        {restaurant&&o.status!=="Order placed"&&o.status!=="Rejected"&&<select value={o.status} onChange={e=>onStatus(o.id,e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select>}
        {admin&&<select value={o.status} onChange={e=>onStatus(o.id,e.target.value)}>{["Order placed",...statuses,"Rejected"].map(s=><option key={s}>{s}</option>)}</select>}
      </div></div>)}</div>;
}
function Footer() { return <footer className="footer"><b>twiggy<span className="orange">.</span></b><p>Good food has a way of making a day.</p><small>© 2026 TWIGGY · Frontend demo project</small></footer>; }
function Toast({notice}) { return notice?<div className="toast">{notice}</div>:null; }
export default App;
