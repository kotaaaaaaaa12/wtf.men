const requestedTarget = document.querySelector('#requested-url');
const messageTarget = document.querySelector('#random-message');
const trigger = document.querySelector('#shatter-trigger');
const number = document.querySelector('#error-number');
const layer = document.querySelector('#shatter-layer');

function syncShatterLayerSize() {
  if (!layer) return;
  const height = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    window.innerHeight
  );
  layer.style.height = `${height}px`;
}

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

function getTextMetrics(text) {
  const original = number.textContent;
  const hadEnough = number.classList.contains('is-enough');

  number.textContent = text;
  number.classList.toggle('is-enough', text === 'ENOUGH.');

  const rect = number.getBoundingClientRect();
  const styles = getComputedStyle(number);

  number.textContent = original;
  number.classList.toggle('is-enough', hadEnough);

  return {
    rect,
    fontSize: styles.fontSize,
    letterSpacing: styles.letterSpacing,
    lineHeight: styles.lineHeight,
    fontWeight: styles.fontWeight,
    fontFamily: styles.fontFamily
  };
}

function createShards(text) {
  if (!trigger || !number || !layer) return [];
  syncShatterLayerSize();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return [];

  const metrics = getTextMetrics(text);
  const glyphRect = metrics.rect;
  if (!glyphRect.width || !glyphRect.height) return [];

  /*
    Capture beyond the element's line box. Large Funnel Display numerals
    visually extend below/above the measured line box, especially on iOS.
    The extra bleed makes the shard mosaic cover every visible pixel.
  */
  const bleedX = Math.max(8, glyphRect.width * 0.018);
  const bleedTop = Math.max(8, glyphRect.height * 0.08);
  const bleedBottom = Math.max(18, glyphRect.height * 0.18);

  const rect = {
    left: glyphRect.left - bleedX,
    top: glyphRect.top - bleedTop,
    width: glyphRect.width + bleedX * 2,
    height: glyphRect.height + bleedTop + bleedBottom
  };

  const cols = Math.max(10, Math.round(Math.sqrt(shardCountFor(rect.width, rect.height) * 2.2)));
  const rows = Math.max(6, Math.round(cols * rect.height / rect.width * 1.45));
  const cellW = rect.width / cols;
  const cellH = rect.height / rows;
  const shards = [];

  const pageLeft = rect.left + window.scrollX;
  const pageTop = rect.top + window.scrollY;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x0 = col * cellW;
      const y0 = row * cellH;
      const x1 = col === cols - 1 ? rect.width : (col + 1) * cellW;
      const y1 = row === rows - 1 ? rect.height : (row + 1) * cellH;

      const shard = document.createElement('span');
      shard.className = 'shard';
      shard.style.left = `${pageLeft + x0}px`;
      shard.style.top = `${pageTop + y0}px`;
      shard.style.width = `${x1 - x0}px`;
      shard.style.height = `${y1 - y0}px`;

      const inner = document.createElement('span');
      inner.className = 'shard-inner';
      inner.dataset.text = text;
      inner.textContent = text;

      /*
        The cloned text is positioned relative to the oversized capture box,
        not the original line box.
      */
      inner.style.left = `${bleedX - x0}px`;
      inner.style.top = `${bleedTop - y0}px`;
      inner.style.width = `${glyphRect.width}px`;
      inner.style.height = `${glyphRect.height}px`;
      inner.style.fontSize = metrics.fontSize;
      inner.style.letterSpacing = metrics.letterSpacing;
      inner.style.lineHeight = metrics.lineHeight;
      inner.style.fontWeight = metrics.fontWeight;
      inner.style.fontFamily = metrics.fontFamily;

      shard.appendChild(inner);
      layer.appendChild(shard);
      shards.push({ shard, rect: glyphRect });
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

  const viewportRadius = Math.hypot(window.innerWidth, window.innerHeight);
  const force = viewportRadius * (.66 + Math.random() * .34);

  return {
    x: dx * force + (Math.random() - .5) * 220,
    y: dy * force + (Math.random() - .5) * 180
  };
}

async function shatter404() {
  if (running || !trigger || !number || !layer) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    number.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(.97)' },
        { transform: 'scale(1)' }
      ],
      { duration: 280, easing: 'ease-out' }
    );
    return;
  }

  running = true;
  clickCount += 1;

  const shouldSwitchToEnough = !alternateMode && clickCount >= 5;
  const shouldReturnTo404 = alternateMode;
  const targetText = shouldSwitchToEnough ? 'ENOUGH.' : '404';

  // Outgoing shards use the current text.
  const outgoingText = number.textContent;
  const outgoingShards = createShards(outgoingText);
  const outgoingRect = number.getBoundingClientRect();

  if (!outgoingShards.length) {
    running = false;
    return;
  }

  trigger.classList.add('is-shattering');

  const flightData = outgoingShards.map(({ shard }) => {
    const shardRect = shard.getBoundingClientRect();
    return {
      shard,
      vector: getExplosionVector(shardRect, outgoingRect),
      rotation: (Math.random() - .5) * 360,
      scale: .62 + Math.random() * .42
    };
  });

  // Slower launch: nearly one second before reaching the edge.
  const outgoingAnimations = flightData.map(({ shard, vector, rotation, scale }) =>
    shard.animate(
      [
        {
          transform: 'translate3d(0, 0, 0) rotate(0deg) scale(1)',
          opacity: 1,
          offset: 0
        },
        {
          transform: `translate3d(${vector.x * .14}px, ${vector.y * .14}px, 0) rotate(${rotation * .10}deg) scale(.98)`,
          opacity: 1,
          offset: .20
        },
        {
          transform: `translate3d(${vector.x * .46}px, ${vector.y * .46}px, 0) rotate(${rotation * .42}deg) scale(${scale})`,
          opacity: 1,
          offset: .52
        },
        {
          transform: `translate3d(${vector.x}px, ${vector.y}px, 0) rotate(${rotation}deg) scale(${scale * .9})`,
          opacity: .9,
          offset: 1
        }
      ],
      {
        duration: 1080 + Math.random() * 180,
        easing: 'cubic-bezier(.24,.62,.28,1)',
        fill: 'forwards'
      }
    )
  );

  await Promise.allSettled(outgoingAnimations.map((animation) => animation.finished));

  // Keep the screen empty for a beat.
  await new Promise((resolve) => setTimeout(resolve, 420));

  layer.replaceChildren();

  // Change the hidden DOM text BEFORE creating the returning pieces.
  number.textContent = targetText;
  number.classList.toggle('is-enough', targetText === 'ENOUGH.');

  if (shouldSwitchToEnough) {
    alternateMode = true;
    clickCount = 0;
  } else if (shouldReturnTo404) {
    alternateMode = false;
    clickCount = 0;
  }

  // Returning shards are already made from the final text, so there is no snap.
  const returningShards = createShards(targetText);
  const targetRect = number.getBoundingClientRect();

  const returningAnimations = returningShards.map(({ shard }) => {
    const shardRect = shard.getBoundingClientRect();
    const vector = getExplosionVector(shardRect, targetRect);
    const rotation = (Math.random() - .5) * 320;
    const scale = .62 + Math.random() * .42;

    return shard.animate(
      [
        {
          transform: `translate3d(${vector.x}px, ${vector.y}px, 0) rotate(${rotation}deg) scale(${scale * .9})`,
          opacity: .88,
          offset: 0
        },
        {
          transform: `translate3d(${vector.x * .54}px, ${vector.y * .54}px, 0) rotate(${rotation * .48}deg) scale(${scale})`,
          opacity: 1,
          offset: .42
        },
        {
          transform: `translate3d(${vector.x * .16}px, ${vector.y * .16}px, 0) rotate(${rotation * .12}deg) scale(.98)`,
          opacity: 1,
          offset: .79
        },
        {
          transform: 'translate3d(0, 0, 0) rotate(0deg) scale(1)',
          opacity: 1,
          offset: 1
        }
      ],
      {
        duration: 1380 + Math.random() * 220,
        easing: 'cubic-bezier(.16,.74,.2,1)',
        fill: 'forwards'
      }
    );
  });

  await Promise.allSettled(returningAnimations.map((animation) => animation.finished));

  // Keep the completed shard mosaic on-screen while the real text is revealed
  // with transitions disabled. Update the message at this exact handoff.
  trigger.classList.add('is-handoff');
  trigger.classList.remove('is-shattering');

  if (shouldSwitchToEnough) {
    messageTarget.textContent = 'you happy now?';
  } else if (shouldReturnTo404) {
    setRandomMessage();
  }

  await new Promise((resolve) => requestAnimationFrame(resolve));
  layer.replaceChildren();

  await new Promise((resolve) => requestAnimationFrame(resolve));
  trigger.classList.remove('is-handoff');

  running = false;
}

setRequestedUrl();
setRandomMessage();

trigger?.addEventListener('click', shatter404);
window.addEventListener('resize', syncShatterLayerSize);
syncShatterLayerSize();
