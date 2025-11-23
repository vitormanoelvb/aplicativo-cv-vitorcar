function playTransitionAndGo(targetUrl) {
  const overlay = document.getElementById("vc-transition");
  const video = document.getElementById("vc-transition-video");
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!overlay || !video || prefersReduced) {
    window.location.href = targetUrl;
    return;
  }

  document.body.classList.remove("vc-page-enter");

  overlay.classList.remove("d-none");
  overlay.classList.add("d-flex", "vc-transition-active");
  overlay.classList.remove("vc-transition-leave");

  video.currentTime = 0;
  video.play().catch(() => {
    window.location.href = targetUrl;
  });

  const finalizarTransicao = () => {
    overlay.classList.remove("vc-transition-active");
    overlay.classList.add("vc-transition-leave");

    setTimeout(() => {
      window.location.href = targetUrl;
    }, 400);
  };

  video.onended = finalizarTransicao;

  setTimeout(() => {
    if (document.body.contains(overlay)) {
      finalizarTransicao();
    }
  }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) return;

  document.body.classList.add("vc-page-enter");
});
