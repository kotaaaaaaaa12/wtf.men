(() => {
  // Always enter the hub from the top instead of restoring an old scroll position.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const forceTop = () => window.scrollTo(0, 0);
  forceTop();
  window.addEventListener('pageshow', forceTop);
  window.addEventListener('load', () => requestAnimationFrame(forceTop), { once: true });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const title = document.querySelector('#hero-title');
  const homeLink = document.querySelector('#home-link');
  const aboutDialog = document.querySelector('#about-dialog');

  homeLink?.addEventListener('click', (event) => {
    event.preventDefault();
    history.replaceState(null, '', `${location.pathname}${location.search}`);
    window.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  function openAboutDialog() {
    if (!aboutDialog || aboutDialog.open) return;

    // Keep Safari from auto-focusing the first button (and drawing a large
    // focus ring around the close control) when the native dialog opens.
    aboutDialog.tabIndex = -1;
    aboutDialog.showModal();
    try {
      aboutDialog.focus({ preventScroll: true });
    } catch {
      aboutDialog.focus();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => aboutDialog.classList.add('is-visible'));
    });
  }

  function closeAboutDialog() {
    if (!aboutDialog?.open) return;
    aboutDialog.classList.remove('is-visible');
    if (reducedMotion) {
      aboutDialog.close();
      return;
    }
    window.setTimeout(() => {
      if (aboutDialog.open) aboutDialog.close();
    }, 220);
  }

  document.querySelectorAll('[data-about-open]').forEach((button) => {
    button.addEventListener('click', openAboutDialog);
  });

  document.querySelectorAll('[data-about-close]').forEach((button) => {
    button.addEventListener('click', closeAboutDialog);
  });

  aboutDialog?.addEventListener('click', (event) => {
    if (event.target === aboutDialog) closeAboutDialog();
  });

  aboutDialog?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeAboutDialog();
  });

  if (title && !reducedMotion) {
    const text = title.textContent;
    title.textContent = '';
    title.setAttribute('aria-label', text);

    const characters = [];
    const fragment = document.createDocumentFragment();

    for (const character of text) {
      const span = document.createElement('span');
      span.className = 'type-char';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = character;
      fragment.appendChild(span);
      characters.push(span);
    }

    const caret = document.createElement('span');
    caret.className = 'typing-caret';
    caret.setAttribute('aria-hidden', 'true');
    fragment.insertBefore(caret, fragment.firstChild);
    title.appendChild(fragment);

    let index = 0;
    const speed = 52;

    function typeNext() {
      if (index >= characters.length) {
        window.setTimeout(() => caret.remove(), 3200);
        return;
      }
      characters[index].classList.add('visible');
      characters[index].after(caret);
      index += 1;
      window.setTimeout(typeNext, speed);
    }

    window.setTimeout(typeNext, 430);
  }

  if (!reducedMotion && window.gsap) {
    const projectsCard = document.querySelector('.projects-card');
    const projectTags = projectsCard?.querySelectorAll('.tag') ?? [];
    const statsCard = document.querySelector('.stats-card');
    const statHalves = statsCard?.querySelectorAll('.stat-half') ?? [];
    const darkNumber = statsCard?.querySelector('.stat-dark .stat-number');
    const lightNumber = statsCard?.querySelector('.stat-light .stat-number');
    const ownerCard = document.querySelector('.owner-card');
    const githubLogo = ownerCard?.querySelector('.owner-avatar img') ?? null;
    const footer = document.querySelector('.footer');

    // Stage the whole card area only when GSAP is available. The first real
    // scroll intent starts one CodePen-style sequence for desktop and mobile.
    if (projectsCard) gsap.set(projectsCard, { autoAlpha: 0, y: 34, scale: 0.965 });
    if (projectTags.length) gsap.set(projectTags, { autoAlpha: 0 });
    // Hide the complete stats card, not only its two inner halves. Otherwise
    // the parent border remains visible as an empty rounded rectangle.
    if (statsCard) gsap.set(statsCard, { autoAlpha: 0, y: 30, scale: 0.97 });
    if (ownerCard) gsap.set(ownerCard, { autoAlpha: 0, y: 30, scale: 0.97 });
    if (footer) gsap.set(footer, { autoAlpha: 0, y: 14 });
    if (darkNumber) darkNumber.textContent = '0';
    if (lightNumber) lightNumber.textContent = '0%';

    let ownerCardIntroComplete = !ownerCard;
    let githubLogoInView = !githubLogo;
    let githubSpinStarted = false;
    let githubSpinAnimation = null;
    let githubObserver = null;

    function stopGithubSpin() {
      githubSpinAnimation?.cancel();
      githubSpinAnimation = null;
      githubSpinStarted = false;

      if (!githubLogo || !ownerCard) return;
      ownerCard.classList.remove('github-spin-active');
      githubLogo.style.animation = 'none';
      githubLogo.style.transform = 'rotate(0deg)';
    }

    function startGithubSpinWhenReady() {
      if (
        githubSpinStarted ||
        !githubLogo ||
        !ownerCard ||
        !ownerCardIntroComplete ||
        !githubLogoInView
      ) {
        return;
      }

      githubSpinStarted = true;

      // Use the Web Animations API instead of a CSS class animation.
      // This guarantees there is no hidden pre-roll and no visible snap back
      // to 0deg before the spin begins.
      githubSpinAnimation = githubLogo.animate(
        [
          { transform: 'rotate(0deg)' },
          { transform: 'rotate(360deg)' }
        ],
        {
          duration: 20000,
          iterations: Infinity,
          easing: 'linear'
        }
      );
    }

    if (githubLogo) {
      // Keep the logo frozen at exactly 0deg until it is actually visible.
      stopGithubSpin();

      if ('IntersectionObserver' in window) {
        githubObserver = new IntersectionObserver((entries) => {
          const entry = entries[0];
          githubLogoInView = Boolean(
            entry?.isIntersecting && entry.intersectionRatio >= 0.5
          );
          startGithubSpinWhenReady();
        }, {
          threshold: [0, 0.5, 1]
        });

        githubObserver.observe(githubLogo);
      } else {
        // Old browsers fall back to starting after the owner card intro.
        githubLogoInView = true;
      }

      // Prevent a spinning state from being frozen into the back-forward cache.
      window.addEventListener('pagehide', stopGithubSpin);
      window.addEventListener('pageshow', (event) => {
        if (!event.persisted) return;
        stopGithubSpin();

        requestAnimationFrame(() => {
          const rect = githubLogo.getBoundingClientRect();
          const visibleHeight = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
          githubLogoInView = rect.height > 0 && visibleHeight >= rect.height * 0.5;
          startGithubSpinWhenReady();
        });
      });
    }

    let cardIntroPlayed = false;

    const playCardIntro = () => {
      if (cardIntroPlayed) return;
      cardIntroPlayed = true;

      window.removeEventListener('scroll', playCardIntro);
      window.removeEventListener('wheel', playCardIntro);
      window.removeEventListener('touchmove', playCardIntro);
      window.removeEventListener('keydown', handleScrollKey);

      const counter = { projects: 0, percent: 0 };
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (projectsCard) {
        timeline.to(projectsCard, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.60,
          ease: 'back.out(1.35)',
          clearProps: 'transform'
        });
      }

      if (projectTags.length) {
        timeline.to(projectTags, {
          autoAlpha: 1,
          duration: 0.42,
          stagger: 0.07
        }, '-=0.30');
      }

      if (statsCard) {
        timeline.to(statsCard, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.60,
          ease: 'back.out(1.3)',
          clearProps: 'transform'
        }, '-=0.14');

        timeline.to(counter, {
          projects: 7,
          percent: 100,
          duration: 0.78,
          ease: 'power2.out',
          onUpdate() {
            if (darkNumber) darkNumber.textContent = String(Math.round(counter.projects));
            if (lightNumber) lightNumber.textContent = `${Math.round(counter.percent)}%`;
          }
        }, '-=0.42');
      }

      if (ownerCard) {
        timeline.to(ownerCard, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.56,
          ease: 'back.out(1.3)',
          clearProps: 'transform',
          onComplete() {
            ownerCardIntroComplete = true;
            startGithubSpinWhenReady();
          }
        }, '-=0.32');
      }

      if (footer) {
        timeline.to(footer, {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          clearProps: 'transform'
        }, '-=0.24');
      }
    };

    function handleScrollKey(event) {
      if (['ArrowDown', 'PageDown', 'End', ' '].includes(event.key)) playCardIntro();
    }

    // scroll covers normal movement; wheel/touchmove make the first tiny intent
    // responsive even before the browser has committed a new scroll position.
    window.addEventListener('scroll', playCardIntro, { passive: true });
    window.addEventListener('wheel', playCardIntro, { passive: true });
    window.addEventListener('touchmove', playCardIntro, { passive: true });
    window.addEventListener('keydown', handleScrollKey);
  }

})();
