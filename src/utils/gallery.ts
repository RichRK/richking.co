/**
 * Filmstrip navigation.
 *
 * Replaces www/js/photoGallery.js, which was ~250 lines of jQuery that stamped
 * pixel widths onto every image from hardcoded aspect ratios, tracked
 * `scrollLeft` offsets in parallel arrays, and ran a 500ms `setInterval` to
 * recompute all of it while images loaded. CSS scroll-snap handles the layout
 * and centring, so what is left is: track which slide is current, keep the
 * thumbnail strip in step, and move on arrow keys or clicks.
 */

const SMALL_SCREEN = '(max-width: 48rem)';

export function initFilmstrip(): void {
  const track = document.querySelector<HTMLElement>('.filmstrip');
  if (!track) return;

  const slides = Array.from(track.children) as HTMLElement[];
  if (slides.length === 0) return;

  const thumbs = Array.from(document.querySelectorAll<HTMLAnchorElement>('.thumbstrip__item'));
  const thumbstrip = document.querySelector<HTMLElement>('.thumbstrip');
  const prev = document.querySelector<HTMLButtonElement>('.filmstrip__arrow--prev');
  const next = document.querySelector<HTMLButtonElement>('.filmstrip__arrow--next');

  let current = 0;

  /*
   * Set while a programmatic scroll is in flight. Smooth scrolling passes over
   * intermediate slides, and without this the observer below would report each
   * one as "current" and fight the destination — pressing the arrow key twice
   * quickly would land short of where it should.
   */
  let navigating = false;
  let settle: ReturnType<typeof setTimeout> | undefined;

  const isStacked = () => window.matchMedia(SMALL_SCREEN).matches;

  function setCurrent(index: number): void {
    current = index;

    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('is-current', i === index);
      if (i === index) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });

    // The original faded the arrows out and set visibility:hidden at each end.
    if (prev) prev.hidden = index === 0;
    if (next) next.hidden = index === slides.length - 1;

    const thumb = thumbs[index];
    if (thumb && thumbstrip) {
      const offset = thumb.offsetLeft + thumb.offsetWidth / 2 - thumbstrip.clientWidth / 2;
      thumbstrip.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }

  function goTo(index: number): void {
    const target = slides[Math.min(Math.max(index, 0), slides.length - 1)];
    if (!target) return;

    navigating = true;
    clearTimeout(settle);
    // `scrollend` would be cleaner but is not universally available; this
    // releases the guard once the smooth scroll has had time to finish.
    settle = setTimeout(() => {
      navigating = false;
    }, 700);

    target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    setCurrent(slides.indexOf(target));
  }

  // One observer replaces the offset bookkeeping the jQuery version maintained
  // by hand. `scrollIntoView` and plain user scrolling both flow through here,
  // so the thumbnail strip stays correct however the photo was reached.
  const observer = new IntersectionObserver(
    (entries) => {
      if (navigating) return;

      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const index = slides.indexOf(visible.target as HTMLElement);
      if (index !== -1 && index !== current) setCurrent(index);
    },
    { root: isStacked() ? null : track, threshold: 0.5 },
  );

  slides.forEach((slide) => observer.observe(slide));

  for (const arrow of [prev, next]) {
    arrow?.addEventListener('click', () => {
      goTo(current + Number(arrow.dataset.step ?? 0));
    });
  }

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', (event) => {
      event.preventDefault();
      goTo(index);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || isStacked()) return;
    if (event.target instanceof HTMLElement && event.target.closest('input, textarea')) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(current + 1);
    }
  });

  // Deep links like /photo/nicaragua#photo-12 still work, as they did in 2014.
  const fromHash = Number(location.hash.match(/^#photo-(\d+)$/)?.[1]);
  if (!Number.isNaN(fromHash)) goTo(fromHash);
  else setCurrent(0);
}
