/**
 * "For Prachi 🌸 | I'm So Sorry" Interactive Experience
 * Pure JavaScript, Web Audio API, Canvas Confetti & LocalStorage
 */

(function () {
  'use strict';

  // ==========================================
  // 1. DATE FORMATTING
  // ==========================================
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const letterDateEl = document.getElementById('letter-date');
  if (letterDateEl) letterDateEl.textContent = formattedDate;

  const certDateEl = document.getElementById('cert-date');
  if (certDateEl) certDateEl.textContent = formattedDate;

  // ==========================================
  // 2. WEB AUDIO API SYNTHESIZER (Gentle Lofi Chords & SFX)
  // ==========================================
  let audioCtx = null;
  let isPlayingMusic = false;
  let melodyTimeout = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a soft bell/kalimba note
  function playNote(freq, time, duration = 1.2, volume = 0.08) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      // Low pass filter for warm cozy sound
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, time);

      // Soft envelope: fast attack, gentle decay
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(volume, time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {
      console.warn("Audio playNote error", e);
    }
  }

  // Sweet Lofi Acoustic Progression (Cmaj7 -> Am7 -> Fmaj7 -> G)
  const chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
    [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
    [174.61, 261.63, 329.63, 349.23], // Fmaj7 (F3, C4, E4, F4)
    [196.00, 246.94, 293.66, 392.00]  // G (G3, B3, D4, G4)
  ];

  let chordIndex = 0;
  function scheduleMelodyLoop() {
    if (!isPlayingMusic || !audioCtx) return;
    
    const now = audioCtx.currentTime;
    const currentChord = chords[chordIndex % chords.length];

    // Arpeggiate chord gently
    currentChord.forEach((freq, idx) => {
      playNote(freq, now + idx * 0.45, 1.8, 0.06);
    });
    // Add high sparkle note
    playNote(currentChord[1] * 2, now + 1.2, 1.5, 0.04);

    chordIndex++;
    melodyTimeout = setTimeout(scheduleMelodyLoop, 2200);
  }

  // Cute SFX: Runaway Button Boing / Poof
  function playBoing() {
    initAudio();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  // Cute SFX: Sparkle Chime for Redeem & Reasons
  function playChime() {
    initAudio();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        playNote(freq, now + i * 0.08, 0.8, 0.07);
      });
    } catch (e) {}
  }

  // Grand Fanfare on "YES" Forgive
  function playFanfare() {
    initAudio();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const notes = [
        { f: 523.25, d: 0.2, t: 0.0 },
        { f: 659.25, d: 0.2, t: 0.15 },
        { f: 783.99, d: 0.2, t: 0.3 },
        { f: 1046.5, d: 0.7, t: 0.45 },
        { f: 880.00, d: 0.2, t: 0.75 },
        { f: 1046.5, d: 1.2, t: 0.95 }
      ];
      notes.forEach(n => {
        playNote(n.f, now + n.t, n.d, 0.12);
      });
    } catch (e) {}
  }

  // Music toggle button
  const musicToggleBtn = document.getElementById('music-toggle');
  const musicText = document.getElementById('music-text');
  const visualizer = document.getElementById('audio-visualizer');

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      initAudio();
      isPlayingMusic = !isPlayingMusic;

      if (isPlayingMusic) {
        musicText.textContent = "Music: Playing";
        visualizer.classList.remove('hidden');
        musicToggleBtn.classList.add('bg-rose-100', 'text-rose-800');
        scheduleMelodyLoop();
      } else {
        musicText.textContent = "Play Music";
        visualizer.classList.add('hidden');
        musicToggleBtn.classList.remove('bg-rose-100', 'text-rose-800');
        if (melodyTimeout) clearTimeout(melodyTimeout);
      }
    });
  }

  // ==========================================
  // 3. BACKGROUND FLOATING SPARKLE CANVAS
  // ==========================================
  const canvas = document.getElementById('sparkle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(30, Math.floor(window.innerWidth / 35));

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 20;
        this.size = Math.random() * 12 + 8;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.symbol = Math.random() > 0.4 ? '🌸' : (Math.random() > 0.5 ? '💖' : '✨');
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotSpeed;
        if (this.y < -30) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, 0, 0);
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      const p = new Particle();
      p.y = Math.random() * height; // initial spread
      particles.push(p);
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }

  // ==========================================
  // 4. MASCOT INTERACTIONS
  // ==========================================
  const mascotContainer = document.getElementById('mascot-container');
  const mascotSpeech = document.getElementById('mascot-speech');
  const bearMouthSad = document.getElementById('bear-mouth-sad');
  const bearMouthHappy = document.getElementById('bear-mouth-happy');
  const bearEyesSad = document.getElementById('bear-eyes-sad');
  const bearEyesHappy = document.getElementById('bear-eyes-happy');
  const bearTear = document.getElementById('bear-tear');

  const tickleQuotes = [
    "Prachi, your touch always melts my heart... 👉👈",
    "*giggles* Hehe! Please don't stay mad at me!",
    "I'm giving you the biggest bear hug in spirit right now! 🧸",
    "Look at these puppy eyes, how could you resist? 🥺",
    "I promise to be the sweetest boyfriend ever from now on! 💕"
  ];
  let quoteIndex = 0;

  if (mascotContainer) {
    mascotContainer.addEventListener('click', () => {
      mascotContainer.classList.remove('bear-tickled');
      void mascotContainer.offsetWidth; // trigger reflow
      mascotContainer.classList.add('bear-tickled');

      playChime();
      spawnClickHeart(event.clientX, event.clientY);

      mascotSpeech.textContent = tickleQuotes[quoteIndex % tickleQuotes.length];
      quoteIndex++;
    });
  }

  function setMascotForgiven() {
    if (bearMouthSad) bearMouthSad.style.display = 'none';
    if (bearMouthHappy) bearMouthHappy.style.display = 'block';
    if (bearEyesSad) bearEyesSad.style.display = 'none';
    if (bearEyesHappy) bearEyesHappy.style.display = 'block';
    if (bearTear) bearTear.style.display = 'none';

    if (mascotSpeech) {
      mascotSpeech.textContent = "YAYYY! She forgave me! I love you so much, Prachi! 💖🎉";
      mascotSpeech.className = "speech-bubble inline-block bg-emerald-100 border border-emerald-300 text-emerald-800 text-sm font-bold px-5 py-2.5 rounded-2xl shadow-md";
    }

    if (mascotContainer) {
      mascotContainer.classList.add('animate-bounce');
    }
  }

  // ==========================================
  // 5. INTERACTIVE ENVELOPE & LETTER
  // ==========================================
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('wax-seal');
  const toggleLetterBtn = document.getElementById('toggle-letter-btn');

  function toggleEnvelope() {
    if (!envelope) return;
    const isOpen = envelope.classList.toggle('open');
    initAudio();
    playChime();

    if (toggleLetterBtn) {
      toggleLetterBtn.textContent = isOpen ? "📬 Click to Close Letter" : "📬 Click to Open Letter";
    }
  }

  if (waxSeal) waxSeal.addEventListener('click', toggleEnvelope);
  if (toggleLetterBtn) toggleLetterBtn.addEventListener('click', toggleEnvelope);

  // Custom Letter modal and LocalStorage
  const customizeBtn = document.getElementById('customize-letter-btn');
  const customizeModal = document.getElementById('customize-modal');
  const closeCustomizeBtn = document.getElementById('close-customize-modal');
  const saveLetterBtn = document.getElementById('save-letter-btn');
  const resetLetterBtn = document.getElementById('reset-letter-btn');
  const customLetterInput = document.getElementById('custom-letter-input');
  const letterBodyText = document.getElementById('letter-body-text');

  const defaultLetterHTML = `
    <p><strong>My Dearest Prachi,</strong></p>
    <p>I am writing this because my heart genuinely aches knowing that I upset you or made you feel anything less than completely cherished. You are the brightest light in my life, and hurting you is the absolute last thing I ever want to do.</p>
    <p>I know saying "sorry" doesn't magically undo a mistake, but I want you to know that I truly, deeply understand where I went wrong. Your feelings will always matter the world to me, and seeing you disappointed breaks my heart.</p>
    <p>I promise to listen more attentively, to be more patient, and to always prioritize your smile. You deserve gentle love, immense respect, and all the happiness this world has to offer.</p>
    <p>Thank you for being my favorite person, my confidante, and my best friend. I hope you can find it in your warm, kind heart to forgive me.</p>
    <p class="pt-2 text-right">
      <span class="block text-slate-500 text-xs">With all my love & sincerity,</span>
      <span class="font-handwriting text-2xl text-rose-600 block mt-1">Harshwardhan ❤️</span>
    </p>
  `;

  // Load custom letter if present
  const savedLetter = localStorage.getItem('prachi_sorry_custom_letter');
  if (savedLetter && letterBodyText) {
    letterBodyText.innerHTML = savedLetter;
  }

  if (customizeBtn && customizeModal) {
    customizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      customLetterInput.value = letterBodyText.innerText.trim();
      customizeModal.classList.remove('hidden');
    });

    closeCustomizeBtn.addEventListener('click', () => {
      customizeModal.classList.add('hidden');
    });

    saveLetterBtn.addEventListener('click', () => {
      const text = customLetterInput.value.trim();
      if (text) {
        // Convert line breaks to paragraphs
        const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
        const formatted = paragraphs.map(p => `<p>${p}</p>`).join('');
        letterBodyText.innerHTML = formatted;
        localStorage.setItem('prachi_sorry_custom_letter', formatted);
      }
      customizeModal.classList.add('hidden');
      playChime();
    });

    resetLetterBtn.addEventListener('click', () => {
      letterBodyText.innerHTML = defaultLetterHTML;
      localStorage.removeItem('prachi_sorry_custom_letter');
      customizeModal.classList.add('hidden');
    });
  }

  // ==========================================
  // 6. RUNAWAY "NO" BUTTON MINIGAME
  // ==========================================
  const btnNo = document.getElementById('btn-no');
  const btnNoText = document.getElementById('btn-no-text');
  const btnYes = document.getElementById('btn-yes');
  const playground = document.getElementById('buttons-playground');
  const dodgesHint = document.getElementById('dodges-hint');

  const runawayMessages = [
    "No 😤",
    "Are you sure? 🥺",
    "Think about it again! 👉👈",
    "What if I get you chocolates? 🍫",
    "Look at the poor bear! 😭",
    "I promise 100 cuddles! 🧸",
    "Your finger slipped, right? 🙈",
    "You can't catch me! 💨",
    "I'll do all the chores! 🧹",
    "Error 404: 'No' not found! 😉",
    "Pretty please with a cherry on top? 🍒",
    "Just click the green one already! 🥰"
  ];

  let dodgeCount = 0;

  function dodgeNoButton(e) {
    if (e) e.preventDefault();
    initAudio();
    playBoing();

    dodgeCount++;

    // Update text
    const msg = runawayMessages[dodgeCount % runawayMessages.length];
    btnNoText.textContent = msg;

    // Get boundaries
    const rect = playground.getBoundingClientRect();
    const btnWidth = btnNo.offsetWidth;
    const btnHeight = btnNo.offsetHeight;

    // Constrain random coords safely inside playground area
    const maxX = Math.max(20, rect.width - btnWidth - 30);
    const maxY = Math.max(10, rect.height - btnHeight - 10);

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    btnNo.style.position = 'absolute';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;

    // Make the YES button grow invitingly!
    const yesScale = Math.min(1.4, 1 + dodgeCount * 0.04);
    btnYes.style.transform = `scale(${yesScale})`;

    // Show funny hint
    if (dodgesHint) {
      dodgesHint.style.opacity = '1';
      dodgesHint.textContent = `Dodged ${dodgeCount} time${dodgeCount > 1 ? 's' : ''}! The green button looks so much friendlier 💚`;
    }
  }

  if (btnNo) {
    // Desktop hover escape
    btnNo.addEventListener('mouseenter', dodgeNoButton);
    // Mobile tap escape (prevents click, forces escape)
    btnNo.addEventListener('touchstart', dodgeNoButton, { passive: false });
    btnNo.addEventListener('click', dodgeNoButton);
  }

  // ==========================================
  // 7. "YES" FORGIVENESS CELEBRATION & MODAL
  // ==========================================
  const certificateModal = document.getElementById('certificate-modal');
  const closeCertBtn = document.getElementById('close-cert-btn');
  const replayConfettiBtn = document.getElementById('replay-confetti-btn');

  function triggerConfettiBlast() {
    if (typeof confetti === 'function') {
      // Big multi-stage confetti explosion
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }));
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#ff6b8b', '#ff477e', '#ffd166']
      });
      fire(0.2, {
        spread: 60,
        colors: ['#f43f5e', '#ec4899', '#a855f7']
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        colors: ['#ffe4e6', '#fb7185', '#22c55e']
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } else {
      // Fallback: burst of floating hearts and sparkles
      for (let i = 0; i < 45; i++) {
        setTimeout(() => {
          const rx = Math.random() * window.innerWidth;
          const ry = window.innerHeight * 0.7 + (Math.random() - 0.5) * 150;
          spawnClickHeart(rx, ry);
        }, i * 25);
      }
    }
  }

  if (btnYes) {
    btnYes.addEventListener('click', () => {
      initAudio();
      playFanfare();
      triggerConfettiBlast();
      setMascotForgiven();

      // Show certificate modal after brief delay
      setTimeout(() => {
        if (certificateModal) {
          certificateModal.classList.remove('hidden');
          triggerConfettiBlast();
        }
      }, 700);
    });
  }

  if (closeCertBtn && certificateModal) {
    closeCertBtn.addEventListener('click', () => {
      certificateModal.classList.add('hidden');
    });
  }

  if (replayConfettiBtn) {
    replayConfettiBtn.addEventListener('click', () => {
      triggerConfettiBlast();
      playFanfare();
    });
  }

  // ==========================================
  // 8. REDEEMABLE LOVE COUPONS
  // ==========================================
  const coupons = document.querySelectorAll('.coupon-card');
  const redeemedStorageKey = 'prachi_redeemed_coupons_v1';
  let redeemedList = [];

  try {
    redeemedList = JSON.parse(localStorage.getItem(redeemedStorageKey)) || [];
  } catch (e) {
    redeemedList = [];
  }

  // Restore saved redeemed state
  coupons.forEach(card => {
    const id = card.getAttribute('data-coupon-id');
    if (redeemedList.includes(id)) {
      const stamp = card.querySelector('.stamp-overlay');
      if (stamp) stamp.classList.remove('hidden');
    }

    const redeemBtn = card.querySelector('.redeem-btn');
    if (redeemBtn) {
      redeemBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        initAudio();
        playChime();
        triggerConfettiBlast();

        const stamp = card.querySelector('.stamp-overlay');
        if (stamp) stamp.classList.remove('hidden');

        if (!redeemedList.includes(id)) {
          redeemedList.push(id);
          localStorage.setItem(redeemedStorageKey, JSON.stringify(redeemedList));
        }

        // Spawn hearts on the button
        spawnClickHeart(e.clientX, e.clientY);
      });
    }
  });

  // ==========================================
  // 9. THE "WHY YOU'RE IRREPLACEABLE" REASONS JAR
  // ==========================================
  const reasons = [
    "The way your eyes light up whenever you see your favorite food 🍜",
    "Your incredible kindness and how deeply you care for the people in your life 💖",
    "How your laugh is genuinely the most contagious, sweetest sound in the universe 🎶",
    "The comfort of knowing you're always there to listen when things get tough ☁️",
    "How you make even mundane errands like grocery shopping feel like cute adventures 🛒",
    "Your silly jokes and shared looks that only the two of us understand 😂",
    "How patient and understanding you are with me (even when I'm being a goof) 🥺",
    "The way you scrunch your nose when you're focusing hard on something 🐰",
    "Your warm hugs that make all my worries and anxieties instantly vanish 🫂",
    "Because you believe in me even when I doubt myself 🌟",
    "The cute voice notes you send me that I replay ten times with a stupid grin 🎧",
    "How effortlessly gorgeous you look, especially in cozy oversized clothes 🌸",
    "Because you are my best friend, my favorite secret-keeper, and my home 🏡",
    "The little happy dances you do when you take the first bite of something delicious 💃",
    "Because life before meeting you was nowhere near as vibrant and joyful 🌈",
    "How you always know how to make me smile, even across a screen 📱",
    "The deep passion and heart you put into the things you love 🔥",
    "Because every cheesy romantic song suddenly makes sense because of you 🎵",
    "The way you hold my hand like you never want to let go 🤝",
    "Simply because you are Prachi — unique, irreplaceable, and my whole world ❤️"
  ];

  let currentReasonIndex = 0;
  const reasonsText = document.getElementById('reasons-text');
  const nextReasonBtn = document.getElementById('next-reason-btn');
  const reasonCounter = document.getElementById('reason-counter');
  const reasonsBox = document.getElementById('reasons-box');

  if (nextReasonBtn && reasonsText) {
    nextReasonBtn.addEventListener('click', (e) => {
      initAudio();
      playChime();
      spawnClickHeart(e.clientX, e.clientY);

      reasonsBox.style.opacity = '0';
      reasonsBox.style.transform = 'translateY(8px)';

      setTimeout(() => {
        currentReasonIndex = (currentReasonIndex + 1) % reasons.length;
        reasonsText.textContent = `"${reasons[currentReasonIndex]}"`;
        if (reasonCounter) {
          reasonCounter.textContent = `Note ${currentReasonIndex + 1} of ${reasons.length}`;
        }
        reasonsBox.style.opacity = '1';
        reasonsBox.style.transform = 'translateY(0)';
      }, 150);
    });
  }

  // ==========================================
  // 10. POLAROID MEMORY PHOTO UPLOAD
  // ==========================================
  const photoInput = document.getElementById('photo-upload-input');
  const polaroidsContainer = document.getElementById('polaroids-container');
  const customPhotosKey = 'prachi_custom_photos_v1';

  function renderCustomPhotos() {
    let savedPhotos = [];
    try {
      savedPhotos = JSON.parse(localStorage.getItem(customPhotosKey)) || [];
    } catch (e) {
      savedPhotos = [];
    }

    savedPhotos.forEach((dataUrl, idx) => {
      addPolaroidCard(dataUrl, `Our Precious Memory #${idx + 1} 💫`, false);
    });
  }

  function addPolaroidCard(dataUrl, caption, save = true) {
    if (!polaroidsContainer) return;
    const card = document.createElement('div');
    card.className = "polaroid-card bg-white p-3.5 pb-6 rounded-lg shadow-lg border border-slate-100 rotate-[-1.5deg] hover:rotate-0 hover:scale-105 transition-all relative";
    
    card.innerHTML = `
      <div class="tape-strip"></div>
      <div class="aspect-square bg-slate-100 rounded-md overflow-hidden relative">
        <img src="${dataUrl}" alt="Our Memory" class="w-full h-full object-cover">
      </div>
      <p class="font-handwriting text-xl text-center text-slate-700 mt-4">${caption}</p>
    `;

    polaroidsContainer.appendChild(card);

    if (save) {
      try {
        let photos = JSON.parse(localStorage.getItem(customPhotosKey)) || [];
        photos.push(dataUrl);
        localStorage.setItem(customPhotosKey, JSON.stringify(photos));
      } catch (e) {
        console.warn("Storage quota exceeded or error", e);
      }
    }
  }

  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          addPolaroidCard(event.target.result, "You & Me Forever 💕", true);
          initAudio();
          playChime();
          triggerConfettiBlast();
        };
        reader.readAsDataURL(file);
      }
    });
    renderCustomPhotos();
  }

  // ==========================================
  // 11. CLICK / TAP ANYWHERE FLOATING HEARTS
  // ==========================================
  const heartEmojis = ['💖', '🌸', '✨', '💕', '🥰', '🌷'];
  function spawnClickHeart(x, y) {
    const heart = document.createElement('span');
    heart.className = 'click-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1200);
  }

  document.addEventListener('pointerdown', (e) => {
    // Only spawn if not clicking an input or textarea
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    spawnClickHeart(e.clientX, e.clientY);
  });

})();
