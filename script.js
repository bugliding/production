// Airplane scroll indicator that you can also DRAG to scroll the page.
(function () {
  const track = document.querySelector(".scroll-track");
  const plane = document.querySelector(".scroll-track .plane");
  if (!track || !plane) return;

  const root = document.documentElement;
  let dragging = false;

  function range() {
    return track.clientHeight - plane.offsetHeight;
  }

  function scrollable() {
    return root.scrollHeight - window.innerHeight;
  }

  // reflect current scroll position on the plane (when not dragging)
  function update() {
    if (dragging) return;
    const progress = scrollable() > 0 ? window.scrollY / scrollable() : 0;
    plane.style.top = progress * range() + "px";
  }

  // convert a pointer Y position into a scroll position
  function scrollFromPointer(clientY) {
    const rect = track.getBoundingClientRect();
    let top = clientY - rect.top - plane.offsetHeight / 2;
    top = Math.max(0, Math.min(range(), top));
    plane.style.top = top + "px";
    const progress = range() > 0 ? top / range() : 0;
    window.scrollTo(0, progress * scrollable());
  }

  plane.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    dragging = true;
    plane.setPointerCapture(e.pointerId);
    plane.classList.add("dragging");
    root.style.scrollBehavior = "auto"; // avoid laggy smooth-scroll while dragging
    scrollFromPointer(e.clientY);
  });

  plane.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    scrollFromPointer(e.clientY);
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    try { plane.releasePointerCapture(e.pointerId); } catch (_) {}
    plane.classList.remove("dragging");
    root.style.scrollBehavior = "";
  }

  plane.addEventListener("pointerup", endDrag);
  plane.addEventListener("pointercancel", endDrag);

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
