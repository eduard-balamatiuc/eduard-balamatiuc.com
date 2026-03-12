let observer = null;

function positionSidenotes() {
  const main = document.querySelector('main.dispatch-content');
  if (!main) return;

  const sidenotes = main.querySelectorAll('.sidenote');
  if (!sidenotes.length) return;

  const isWide = window.innerWidth >= 1300;

  // Tear down observer when switching to narrow
  if (!isWide) {
    teardownObserver();
    sidenotes.forEach((sidenote) => {
      sidenote.style.display = 'none';
      sidenote.classList.remove('visible');
    });
    return;
  }

  // Wide screen: show sidenotes (display: block) but keep them invisible (opacity handles reveal)
  sidenotes.forEach((sidenote) => {
    sidenote.style.display = 'block';
  });

  // Compute positions aligned to each footnote's <sup> element
  let lastBottom = 0;
  const gap = 12;

  sidenotes.forEach((sidenote) => {
    const fnId = sidenote.dataset.footnoteId;
    if (!fnId) return;

    const link = main.querySelector(`a[href="#${fnId}"]`);
    const sup = link?.closest('sup');
    if (!sup) return;

    const supTop = getOffsetRelativeTo(sup, main);

    let top = supTop;
    if (top < lastBottom + gap) {
      top = lastBottom + gap;
    }

    sidenote.style.top = `${top}px`;
    lastBottom = top + sidenote.offsetHeight;
  });

  // Set up IntersectionObserver if not already active
  if (!observer) {
    setupObserver(main);
  }
}

function setupObserver(main) {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const sup = entry.target;
        const link = sup.querySelector('a[data-footnote-ref]');
        if (!link) return;

        const fnId = link.getAttribute('href')?.replace('#', '');
        if (!fnId) return;

        const sidenote = main.querySelector(`.sidenote[data-footnote-id="${fnId}"]`);
        if (!sidenote) return;

        if (entry.isIntersecting) {
          sidenote.classList.add('visible');
        } else {
          sidenote.classList.remove('visible');
        }
      });
    },
    { rootMargin: '-10% 0px -10% 0px' }
  );

  // Observe each <sup> that contains a footnote reference
  const sups = main.querySelectorAll('sup:has(a[data-footnote-ref])');
  sups.forEach((sup) => observer.observe(sup));
}

function teardownObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

/** Walk the offsetParent chain to compute offset relative to an ancestor */
function getOffsetRelativeTo(element, ancestor) {
  let top = 0;
  let el = element;
  while (el && el !== ancestor) {
    top += el.offsetTop;
    el = el.offsetParent;
  }
  return top;
}

// Run after DOM is ready and on resize
document.addEventListener('DOMContentLoaded', positionSidenotes);
window.addEventListener('resize', positionSidenotes);
// Also run after full load (images etc. may shift layout)
window.addEventListener('load', positionSidenotes);
