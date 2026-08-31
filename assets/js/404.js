const requestedTarget = document.querySelector('#requested-url');
const messageTarget = document.querySelector('#random-message');
const trigger = document.querySelector('#shatter-trigger');
const number = document.querySelector('#error-number');
const layer = document.querySelector('#shatter-layer');

const messages = [
  'what the fuck are you looking for?',
  'you found absolutely nothing.',
  'this URL is cooked.',
  'congratulations. you found the void.',
  'bro, this page is not real.',
  'somehow, you missed the entire website.',
  'the page left without saying goodbye.',
  'nothing lives here. impressive.',
  'you have discovered premium-grade nothing.',
  '404 doing 404 things.'
];

function setRequestedUrl() {
  if (!requestedTarget) return;

  const url = new URL(window.location.href);
  const host = url.host || 'what-the-fuck.men';
  const path = `${url.pathname}${url.search}${url.hash}`;

  requestedTarget.textContent = `${host}${path || '/'}`;
}

function setRandomMessage() {
  if (!messageTarget) return;

  let last = null;

  try {
    last = sessionStorage.getItem('wtf404-message');
  } catch {
    // Ignore storage restrictions.
  }

  const choices = messages.filter((message) => message !== last);
  const next = choices[Math.floor(Math.random() * choices.length)] || messages[0];

  messageTarget.textContent = next;

  try {
    sessionStorage.setItem('wtf404-message', next);
  } catch {
    // The message still works when sessionStorage is unavailable.
  }
}

function shardCountFor(width, height) {
  const area = width * height;
  return Math.max(26, Math.min(54, Math.round(area / 2200)));
}

function createShards() {
  if (!trigger || !number || !layer) return [];
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return [];

  const rect = number.getBoundingClientRect();
  if (!rect.width || !rect.height) return [];

  const styles = getComputedStyle(number);
  const cols = Math.max(7, Math.round(Math.sqrt(shardCountFor(rect.width, rect.height) * 1.7)));
  const rows = Math.max(4, Math.round(cols * rect.height / rect.width * 1.35));
  const cellW = rect.width / cols;
  const cellH = rect.height / rows;
  const shards = [];

  // Slightly irregular rectangular fragments: stable, fast, and works on iOS Safari.
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (Math.random() < 0.13) continue;

      const jitterX = cellW * 0.14;
      const jitterY = cellH * 0.14;

      const x0 = Math.max(0, col * cellW - Math.random() * jitterX);
      const y0 = Math.max(0, row * cellH - Math.random() * jitterY);
      const x1 = Math.min(rect.width, (col + 1) * cellW + Math.random() * jitterX);
      const y1 = Math.min(rect.height, (row + 1) * cellH + Math.random() * jitterY);

      const w = Math.max(2, x1 - x0);
      const h = Math.max(2, y1 - y0);

      const shard = document.createElement('span');
      shard.className = 'shard';
      shard.style.left = `${rect.left + x0}px`;
      shard.style.top = `${rect.top + y0}px`;
      shard.style.width = `${w}px`;
      shard.style.height = `${h}px`;

      // Make the fragment edges less grid-like.
      const a = 4 + Math.random() * 18;
      const b = 82 + Math.random() * 14;
      const c = 82 + Math.random() * 14;
      const d = 4 + Math.random() * 18;
      shard.style.clipPath = `polygon(${a}% 0, 100% ${d}%, ${c}% 100%, 0 ${b}%)`;

      const inner = document.createElement('span');
      inner.className = 'shard-inner';
      inner.textContent = '404';
      inner.style.left = `${-x0}px`;
      inner.style.top = `${-y0}px`;
      inner.style.width = `${rect.width}px`;
      inner.style.height = `${rect.height}px`;
      inner.style.fontSize = styles.fontSize;

      shard.appendChild(inner);
      layer.appendChild(shard);
      shards.push({ shard, x0, y0, w, h, rect });
    }
  }

  return shards;
}

let running = false;
let clickCount = 0;
let alternateMode = false;

function getExplosionVector(shardRect, numberRect) {
  const shardCenterX = shardRect.left + shardRect.width / 2;
  const shardCenterY = shardRect.top + shardRect.height / 2;
  const numberCenterX = numberRect.left + numberRect.width / 2;
  const numberCenterY = numberRect.top + numberRect.height / 2;

  let dx = shardCenterX - numberCenterX;
  let dy = shardCenterY - numberCenterY;
  const length = Math.hypot(dx, dy) || 1;

  dx /= length;
  dy /= length;

  // Push every shard comfortably beyond the nearest viewport edge.
  const viewportRadius = Math.hypot(window.innerWidth, window.innerHeight);
  const force = viewportRadius * (.72 + Math.random() * .42);

  return {
    x: dx * force + (Math.random() - .5) * 260,
    y: dy * force + (Math.random() - .5) * 220
  };
}

async function shatter404() {
  if (running || !trigger || !number || !layer) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    number.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(.96)' },
        { transform: 'scale(1)' }
      ],
      { duration: 260, easing: 'ease-out' }
    );
    return;
  }

  running = true;
  clickCount += 1;

  const shouldSwitchToEnough = !alternateMode && clickCount >= 5;
  const shouldReturnTo404 = alternateMode;

  trigger.classList.add('is-shattering');

  const shards = createShards();

  if (!shards.length) {
    trigger.classList.remove('is-shattering');
    running = false;
    return;
  }

  const numberRect = number.getBoundingClientRect();

  const animations = shards.map(({ shard }) => {
    const shardRect = shard.getBoundingClientRect();
    const vector = getExplosionVector(shardRect, numberRect);
    const rotation = (Math.random() - .5) * 420;
    const scale = .58 + Math.random() * .52;

    return shard.animate(
      [
        {
          transform: 'translate3d(0, 0, 0) rotate(0deg) scale(1)',
          opacity: 1,
          offset: 0
        },
        {
          transform: `translate3d(${vector.x * .46}px, ${vector.y * .46}px, 0) rotate(${rotation * .45}deg) scale(${scale})`,
          opacity: 1,
          offset: .19
        },
        {
          transform: `translate3d(${vector.x}px, ${vector.y}px, 0) rotate(${rotation}deg) scale(${scale * .88})`,
          opacity: .92,
          offset: .34
        },
        {
          transform: `translate3d(${vector.x}px, ${vector.y}px, 0) rotate(${rotation}deg) scale(${scale * .88})`,
          opacity: .86,
          offset: .54
        },
        {
          transform: `translate3d(${vector.x * .34}px, ${vector.y * .34}px, 0) rotate(${rotation * .27}deg) scale(.92)`,
          opacity: 1,
          offset: .83
        },
        {
          transform: 'translate3d(0, 0, 0) rotate(0deg) scale(1)',
          opacity: 1,
          offset: 1
        }
      ],
      {
        duration: 2450 + Math.random() * 350,
        easing: 'cubic-bezier(.16,.72,.18,1)',
        fill: 'forwards'
      }
    );
  });

  // Swap the hidden text while the fragments are still off-screen.
  await new Promise((resolve) => setTimeout(resolve, 1350));

  if (shouldSwitchToEnough) {
    number.textContent = 'ENOUGH.';
    messageTarget.textContent = 'you happy now?';
    alternateMode = true;
    clickCount = 0;
  } else if (shouldReturnTo404) {
    number.textContent = '404';
    setRandomMessage();
    alternateMode = false;
    clickCount = 0;
  }

  await Promise.allSettled(animations.map((animation) => animation.finished));

  layer.replaceChildren();
  trigger.classList.remove('is-shattering');
  running = false;
}

setRequestedUrl();
setRandomMessage();

trigger?.addEventListener('click', shatter404);
