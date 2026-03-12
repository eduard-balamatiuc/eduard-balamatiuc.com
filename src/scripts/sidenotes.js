let observer = null;
let sentinelObserver = null;
let observerReady = false;

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

  // Wide screen: show sidenotes as collapsed bars
  sidenotes.forEach((sidenote) => {
    sidenote.style.display = 'block';
  });

  repositionSidenotes(main);

  // Set up click handlers and observer
  setupClickHandlers(main);
  if (!observer) {
    setupObserver(main);
  }
}

function setupClickHandlers(main) {
  const sidenotes = main.querySelectorAll('.sidenote');
  sidenotes.forEach((sidenote) => {
    if (sidenote.dataset.clickBound) return;
    sidenote.dataset.clickBound = 'true';

    sidenote.addEventListener('click', (e) => {
      // Don't collapse when clicking a link inside an expanded sidenote
      if (e.target.closest('a') && sidenote.classList.contains('visible')) return;

      if (sidenote.classList.contains('visible')) {
        // Animated collapse
        collapseSidenote(sidenote, main);
      } else {
        sidenote.classList.add('visible');
      }
      // Mark as manually toggled so the observer doesn't override
      sidenote.dataset.manualToggle = 'true';
    });
  });
}

function repositionSidenotes(main) {
  const sidenotes = main.querySelectorAll('.sidenote');
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
}

function setupObserver(main) {
  observerReady = false;

  observer = new IntersectionObserver(
    (entries) => {
      if (!observerReady) {
        // Skip the initial callback that fires for all observed elements
        // on setup — we want everything to start as collapsed bars.
        observerReady = true;
        return;
      }

      let changed = false;

      entries.forEach((entry) => {
        const sup = entry.target;
        const link = sup.querySelector('a[data-footnote-ref]');
        if (!link) return;

        const fnId = link.getAttribute('href')?.replace('#', '');
        if (!fnId) return;

        const sidenote = main.querySelector(`.sidenote[data-footnote-id="${fnId}"]`);
        if (!sidenote) return;

        // Skip if user manually toggled this sidenote
        if (sidenote.dataset.manualToggle === 'true') {
          // Clear the flag once the element leaves the intersection zone
          // so scroll takes over again on next pass
          if (!entry.isIntersecting) {
            delete sidenote.dataset.manualToggle;
          }
          return;
        }

        if (entry.isIntersecting) {
          // Footnote is in the top half → expand
          sidenote.classList.remove('collapsing');
          sidenote.classList.add('visible');
          changed = true;
        } else {
          // Footnote left the top half — check why:
          if (entry.boundingClientRect.top < 0) {
            // Scrolled off above viewport → keep expanded (do nothing)
          } else {
            // Dropped below midpoint → collapse with animation
            if (sidenote.classList.contains('visible')) {
              collapseSidenote(sidenote, main);
            }
          }
        }
      });

      if (changed) {
        requestAnimationFrame(() => repositionSidenotes(main));
      }
    },
    {
      // Bottom margin cuts off the bottom 50% of the viewport — the element
      // must cross into the top half before it counts as intersecting.
      rootMargin: '0px 0px -50% 0px',
    }
  );

  // Observe each <sup> that contains a footnote reference
  const sups = main.querySelectorAll('sup:has(a[data-footnote-ref])');
  sups.forEach((sup) => observer.observe(sup));

  // Bottom sentinel: when user scrolls to the end, expand remaining sidenotes
  let sentinel = main.querySelector('.sidenote-sentinel');
  if (!sentinel) {
    sentinel = document.createElement('div');
    sentinel.className = 'sidenote-sentinel';
    main.appendChild(sentinel);
  }

  sentinelObserver = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;

      let changed = false;
      main.querySelectorAll('.sidenote:not(.visible):not(.collapsing)').forEach((sidenote) => {
        if (sidenote.style.display === 'none') return;
        sidenote.classList.add('visible');
        changed = true;
      });

      if (changed) {
        requestAnimationFrame(() => repositionSidenotes(main));
      }
    },
    { rootMargin: '0px 0px 0px 0px' }
  );
  sentinelObserver.observe(sentinel);
}

function collapseSidenote(sidenote, main) {
  if (sidenote.classList.contains('collapsing')) return;
  sidenote.classList.add('collapsing');
  sidenote.addEventListener(
    'animationend',
    () => {
      sidenote.classList.remove('collapsing', 'visible');
      repositionSidenotes(main);
    },
    { once: true }
  );
}

function teardownObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
    observerReady = false;
  }
  if (sentinelObserver) {
    sentinelObserver.disconnect();
    sentinelObserver = null;
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
