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
  const socialsDialog = document.querySelector('#socials-dialog');
  const projectDialog = document.querySelector('#project-dialog');

  homeLink?.addEventListener('click', (event) => {
    event.preventDefault();
    history.replaceState(null, '', `${location.pathname}${location.search}`);
    window.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });


  const projectData = {
    wishlist: {
      title: 'Amazon Wishlist',
      built: 'JavaScript / HTML / CSS',
      framework: 'None',
      hosted: 'Cloudflare Workers + D1',
      repo: 'https://github.com/kotaaaaaaaa12/amazon-wishlist-sync',
      page: 'https://wishlist.what-the-fuck.men/'
    },
    dakuten: {
      title: 'Dakutenizer',
      built: 'HTML / CSS / JavaScript',
      framework: 'None',
      hosted: 'Cloudflare Pages',
      repo: 'https://github.com/kotaaaaaaaa12/DaKuTeN',
      page: 'https://dakuten.what-the-fuck.men/'
    },
    emulatorjs: {
      title: 'Retro Games',
      built: 'HTML / CSS / JavaScript',
      framework: 'EmulatorJS',
      hosted: 'Cloudflare Pages',
      repo: 'https://github.com/kotaaaaaaaa12/EmulatorJS',
      page: 'https://emulatorjs.what-the-fuck.men/'
    },
    aamaker: {
      title: 'AA Maker',
      built: 'HTML / CSS / JavaScript',
      framework: 'None',
      hosted: 'Cloudflare Pages',
      repo: 'https://github.com/kotaaaaaaaa12/AA-maker',
      page: 'https://aamaker.what-the-fuck.men/'
    },
    'chaos-texture': {
      title: '2muu Chaos Texture',
      built: 'HTML / CSS / JavaScript',
      framework: 'None',
      hosted: 'Cloudflare Pages',
      repo: 'https://github.com/kotaaaaaaaa12/2muu-Texture-Chaos-Page',
      page: 'https://2muu-texture-chaos.what-the-fuck.men/'
    },
    'chaos-maker': {
      title: 'MC Chaos Maker',
      built: 'HTML / CSS / JavaScript',
      framework: 'JSZip',
      hosted: 'Cloudflare Pages',
      repo: 'https://github.com/kotaaaaaaaa12/minecraft-chaos-texture-maker',
      page: 'https://mc-chaos-texture-maker.what-the-fuck.men/'
    },
    'booth-downloader': {
      title: 'BOOTH Downloader',
      built: 'HTML / CSS / JavaScript',
      framework: 'None',
      hosted: 'Cloudflare Pages',
      repo: 'https://github.com/kotaaaaaaaa12/booth-downloader',
      page: 'https://booth-downloader.what-the-fuck.men/'
    },
    pinless: {
      title: 'Pinless',
      built: 'Go',
      framework: 'None',
      hosted: 'Cloudflare Workers + Containers',
      repo: 'https://github.com/kotaaaaaaaa12/pinless',
      page: 'https://pinless.what-the-fuck.men/'
    },
    browserjs: {
      title: 'Browser.js',
      built: 'JavaScript / TypeScript',
      framework: 'DreamlandJS / Scramjet',
      hosted: 'Cloudflare Workers + Containers',
      repo: 'https://github.com/kotaaaaaaaa12/browser.js',
      page: 'https://browser.what-the-fuck.men/'
    },
    bugshot: {
      title: 'BugShot Roulette',
      built: 'React / TypeScript / Three.js',
      framework: 'React + Vite',
      hosted: 'Cloudflare Workers + Containers + D1',
      repo: 'https://github.com/kotaaaaaaaa12/BugShot-Roulette',
      page: 'https://bugshot.what-the-fuck.men/'
    },
    techmino: {
      title: 'Techmino',
      built: 'Lua / JavaScript',
      framework: 'LÖVE / love.js',
      hosted: 'Cloudflare Pages + multiplayer backend',
      repo: 'https://github.com/kotaaaaaaaa12/Techmino',
      page: 'https://techmino.what-the-fuck.men/'
    },
    ytdownloader: {
      title: 'YouTube Downloader',
      built: 'JavaScript / yt-dlp / FFmpeg',
      framework: 'None',
      hosted: 'Cloudflare Workers + Containers',
      repo: 'https://github.com/kotaaaaaaaa12/ytdownloader',
      page: 'https://ytdownloader.what-the-fuck.men/'
    },
    whitebophir: {
      title: 'Whitebophir',
      built: 'Node.js / JavaScript',
      framework: 'Socket.IO',
      hosted: 'Cloudflare Workers + Containers',
      repo: 'https://github.com/kotaaaaaaaa12/whitebophir',
      page: 'https://whitebophir.what-the-fuck.men/'
    },
    redlib: {
      title: 'Redlib',
      built: 'Rust',
      framework: 'Askama / Tokio',
      hosted: 'Cloudflare Workers + Containers',
      repo: 'https://github.com/kotaaaaaaaa12/redlib',
      page: 'https://redlib.what-the-fuck.men/'
    }
  };

  function openProjectDialog(key) {
    const data = projectData[key];
    if (!projectDialog || !data || projectDialog.open) return;

    projectDialog.querySelector('#project-title').textContent = data.title;
    projectDialog.querySelector('#project-built').textContent = data.built;
    projectDialog.querySelector('#project-framework').textContent = data.framework;
    projectDialog.querySelector('#project-hosted').textContent = data.hosted;
    projectDialog.querySelector('#project-repo').href = data.repo;
    projectDialog.querySelector('#project-page').href = data.page;

    projectDialog.tabIndex = -1;
    projectDialog.showModal();

    try {
      projectDialog.focus({ preventScroll: true });
    } catch {
      projectDialog.focus();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => projectDialog.classList.add('is-visible'));
    });
  }

  function closeProjectDialog() {
    if (!projectDialog?.open) return;
    projectDialog.classList.remove('is-visible');

    if (reducedMotion) {
      projectDialog.close();
      return;
    }

    window.setTimeout(() => {
      if (projectDialog.open) projectDialog.close();
    }, 220);
  }

  document.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => {
      openProjectDialog(button.getAttribute('data-project'));
    });
  });

  document.querySelectorAll('[data-project-close]').forEach((button) => {
    button.addEventListener('click', closeProjectDialog);
  });

  projectDialog?.addEventListener('click', (event) => {
    if (event.target === projectDialog) closeProjectDialog();
  });

  projectDialog?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeProjectDialog();
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


  function openSocialsDialog() {
    if (!socialsDialog || socialsDialog.open) return;

    socialsDialog.tabIndex = -1;
    socialsDialog.showModal();

    try {
      socialsDialog.focus({ preventScroll: true });
    } catch {
      socialsDialog.focus();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => socialsDialog.classList.add('is-visible'));
    });
  }

  function closeSocialsDialog() {
    if (!socialsDialog?.open) return;

    socialsDialog.classList.remove('is-visible');

    if (reducedMotion) {
      socialsDialog.close();
      return;
    }

    window.setTimeout(() => {
      if (socialsDialog.open) socialsDialog.close();
    }, 220);
  }

  document.querySelectorAll('[data-socials-open]').forEach((button) => {
    let openedFromPointer = false;

    button.addEventListener('pointerup', (event) => {
      if (event.pointerType === 'touch' || event.pointerType === 'pen') {
        openedFromPointer = true;
        openSocialsDialog();
      }
    });

    button.addEventListener('click', (event) => {
      if (openedFromPointer) {
        openedFromPointer = false;
        event.preventDefault();
        return;
      }

      openSocialsDialog();
    });
  });

  document.querySelectorAll('[data-socials-close]').forEach((button) => {
    button.addEventListener('click', closeSocialsDialog);
  });

  socialsDialog?.addEventListener('click', (event) => {
    if (event.target === socialsDialog) closeSocialsDialog();
  });

  socialsDialog?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeSocialsDialog();
  });

  document.querySelectorAll('[data-copy-value]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy-value') || '';
      if (!value) return;

      const originalLabel = button.textContent;

      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }

      button.textContent = 'Copied';
      button.classList.add('is-copied');

      window.setTimeout(() => {
        button.textContent = originalLabel;
        button.classList.remove('is-copied');
      }, 1300);
    });
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
    const socialAvatar = ownerCard?.querySelector('.owner-avatar img') ?? null;
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
    let socialAvatarInView = !socialAvatar;
    let avatarSpinStarted = false;
    let avatarSpinAnimation = null;
    let avatarObserver = null;

    function stopAvatarSpin() {
      avatarSpinAnimation?.cancel();
      avatarSpinAnimation = null;
      avatarSpinStarted = false;

      if (!socialAvatar || !ownerCard) return;
      ownerCard.classList.remove('github-spin-active');
      socialAvatar.style.animation = 'none';
      socialAvatar.style.transform = 'rotate(0deg)';
    }

    function startAvatarSpinWhenReady() {
      if (
        avatarSpinStarted ||
        !socialAvatar ||
        !ownerCard ||
        !ownerCardIntroComplete ||
        !socialAvatarInView
      ) {
        return;
      }

      avatarSpinStarted = true;

      // Use the Web Animations API instead of a CSS class animation.
      // This guarantees there is no hidden pre-roll and no visible snap back
      // to 0deg before the spin begins.
      avatarSpinAnimation = socialAvatar.animate(
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

    if (socialAvatar) {
      // Keep the avatar frozen at exactly 0deg until it is actually visible.
      stopAvatarSpin();

      if ('IntersectionObserver' in window) {
        avatarObserver = new IntersectionObserver((entries) => {
          const entry = entries[0];
          socialAvatarInView = Boolean(
            entry?.isIntersecting && entry.intersectionRatio >= 0.5
          );
          startAvatarSpinWhenReady();
        }, {
          threshold: [0, 0.5, 1]
        });

        avatarObserver.observe(socialAvatar);
      } else {
        // Old browsers fall back to starting after the owner card intro.
        socialAvatarInView = true;
      }

      // Prevent a spinning state from being frozen into the back-forward cache.
      window.addEventListener('pagehide', stopAvatarSpin);
      window.addEventListener('pageshow', (event) => {
        if (!event.persisted) return;
        stopAvatarSpin();

        requestAnimationFrame(() => {
          const rect = socialAvatar.getBoundingClientRect();
          const visibleHeight = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
          socialAvatarInView = rect.height > 0 && visibleHeight >= rect.height * 0.5;
          startAvatarSpinWhenReady();
        });
      });
    }

    let cardIntroPlayed = false;
    const mobileCardsMode = window.matchMedia('(max-width: 680px)').matches;

    const animateProjectsCard = () => {
      if (!projectsCard) return;

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline.to(projectsCard, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.60,
        ease: 'back.out(1.35)',
        clearProps: 'transform'
      });

      if (projectTags.length) {
        timeline.to(projectTags, {
          autoAlpha: 1,
          duration: 0.42,
          stagger: 0.07
        }, '-=0.30');
      }
    };

    const animateStatsCard = () => {
      if (!statsCard) return;

      const counter = { projects: 0, percent: 0 };
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      timeline.to(statsCard, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.60,
        ease: 'back.out(1.3)',
        clearProps: 'transform'
      });

      timeline.to(counter, {
        projects: 14,
        percent: 100,
        duration: 0.78,
        ease: 'power2.out',
        onUpdate() {
          if (darkNumber) darkNumber.textContent = String(Math.round(counter.projects));
          if (lightNumber) lightNumber.textContent = `${Math.round(counter.percent)}%`;
        }
      }, '-=0.42');
    };

    const animateOwnerCard = () => {
      if (!ownerCard) return;

      gsap.to(ownerCard, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.56,
        ease: 'back.out(1.3)',
        clearProps: 'transform',
        onComplete() {
          ownerCardIntroComplete = true;
          startAvatarSpinWhenReady();
        }
      });
    };

    const animateFooter = () => {
      if (!footer) return;

      gsap.to(footer, {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
        ease: 'power3.out',
        clearProps: 'transform'
      });
    };

    if (mobileCardsMode && 'IntersectionObserver' in window) {
      // On phones/tablets, reveal each section only as the user actually
      // reaches it instead of firing the whole stack on the first scroll.
      const mobileRevealItems = [
        [projectsCard, animateProjectsCard],
        [statsCard, animateStatsCard],
        [ownerCard, animateOwnerCard],
        [footer, animateFooter]
      ].filter(([element]) => Boolean(element));

      const revealed = new WeakSet();

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.18) return;
          if (revealed.has(entry.target)) return;

          revealed.add(entry.target);

          const item = mobileRevealItems.find(([element]) => element === entry.target);
          item?.[1]();
          observer.unobserve(entry.target);
        });
      }, {
        threshold: [0, 0.18, 0.35],
        rootMargin: '0px 0px -8% 0px'
      });

      mobileRevealItems.forEach(([element]) => revealObserver.observe(element));
    } else {
      // Desktop keeps the original single-scroll cinematic sequence.
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
            projects: 14,
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
              startAvatarSpinWhenReady();
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

      window.addEventListener('scroll', playCardIntro, { passive: true });
      window.addEventListener('wheel', playCardIntro, { passive: true });
      window.addEventListener('touchmove', playCardIntro, { passive: true });
      window.addEventListener('keydown', handleScrollKey);
    }
  }

})();


// v35: Scroll to projects without adding #projects to the URL.
const scrollProjectsButton = document.querySelector("[data-scroll-projects]");
const projectsSection = document.getElementById("projects");

if (scrollProjectsButton && projectsSection) {
  scrollProjectsButton.addEventListener("click", () => {
    projectsSection.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
  });
}
