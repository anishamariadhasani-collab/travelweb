(() => {
  const form = document.getElementById("booking-form");
  if (!form) return;
  const destination = document.getElementById("package-select");
  const duration = document.getElementById("duration-select");
  const guests = document.getElementById("guests");
  const total = document.getElementById("booking-total");
  const summary = document.getElementById("booking-summary");
  const message = document.getElementById("booking-message");
  const userLabel = document.getElementById("booking-user");

  const params = new URLSearchParams(location.search);
  const chosen = params.get("package");
  if (chosen && [...destination.options].some(option => option.value === chosen)) {
    destination.value = chosen;
  }
  const savedUser = localStorage.getItem("jerryTravelUser");
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      userLabel.textContent = "Booking for " + (user.name || user.email);
    } catch { localStorage.removeItem("jerryTravelUser"); }
  }

  function updateTotal() {
    const count = Math.max(1, parseInt(guests.value, 10) || 1);
    const option = duration.selectedOptions[0];
    const days = Number(option.dataset.days);
    const nights = Number(option.dataset.nights);
    const packageOption = destination.selectedOptions[0];
    const amount = Number(packageOption.dataset.rate) * count * days / Number(packageOption.dataset.baseDays);
    total.textContent = new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0
    }).format(amount);
    summary.textContent = count + " traveller(s) · " + days + " days / " + nights + " nights";
    return { package: destination.value, guests: count, days, nights, amount };
  }

  [destination, duration, guests].forEach(input => {
    input.addEventListener("input", updateTotal);
    input.addEventListener("change", updateTotal);
  });
  updateTotal();

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!localStorage.getItem("jerryTravelUser")) {
      location.href = "login.html?next=booking&package=" + encodeURIComponent(destination.value);
      return;
    }
    const booking = updateTotal();
    const bookings = JSON.parse(localStorage.getItem("jerryTravelBookings") || "[]");
    bookings.push({ ...booking, bookedAt: new Date().toISOString() });
    localStorage.setItem("jerryTravelBookings", JSON.stringify(bookings));
    message.textContent = "Your booking request is saved. Estimated total: " + total.textContent;
  });
})();
