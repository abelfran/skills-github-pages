(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = reduceMotion ? 'auto' : 'smooth';

  const letter = $('#love-letter');
  const cover = $('#envelope-cover');
  $('#open-letter').addEventListener('click', () => {
    cover.hidden = true;
    letter.hidden = false;
    $('#letter-greeting').focus({ preventScroll: true });
    $('#letter-package').scrollIntoView({ behavior: motion, block: 'start' });
  });
  $('#fold-letter').addEventListener('click', () => {
    letter.hidden = true;
    cover.hidden = false;
    $('#open-letter').focus({ preventScroll: true });
    $('#letter-package').scrollIntoView({ behavior: motion, block: 'start' });
  });

  const reasons = $$('.reason');
  const discovered = new Set();
  const storageKey = 'ale-abel-nine-reasons-v1';
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) saved.forEach(n => {
      if (Number.isInteger(n) && n >= 0 && n < reasons.length) discovered.add(n);
    });
  } catch { /* The surprises also work without local storage. */ }
  function updateProgress() {
    const count = discovered.size;
    const status = $('#reason-progress');
    status.textContent = count === 9
      ? 'Los nueve son tuyos. Y me quedan muchos más por decirte. ♡'
      : `${count} de 9 pequeños secretos descubiertos`;
    status.classList.toggle('complete', count === 9);
  }
  function revealReason(button, index) {
    button.classList.add('opened');
    button.setAttribute('aria-expanded', 'true');
    $('.reason-text', button).hidden = false;
    $('.reason-prompt', button).hidden = true;
    discovered.add(index);
    updateProgress();
    try { localStorage.setItem(storageKey, JSON.stringify([...discovered])); } catch { /* Optional memory only. */ }
  }
  reasons.forEach((button, index) => {
    if (discovered.has(index)) revealReason(button, index);
    button.addEventListener('click', () => revealReason(button, index));
  });
  updateProgress();

  function openDialog(dialog) {
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
  }
  $$('dialog').forEach(dialog => {
    $('[data-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
  });

  const memoryButtons = $$('.memory');
  const memories = memoryButtons.map(button => ({
    src: $('img', button).getAttribute('src'),
    alt: $('img', button).alt,
    caption: $('span', button).childNodes[1].textContent.trim()
  }));
  const photoDialog = $('#photo-dialog');
  let photoIndex = 0;
  function showPhoto(index) {
    photoIndex = (index + memories.length) % memories.length;
    const memory = memories[photoIndex];
    $('#large-photo').src = memory.src;
    $('#large-photo').alt = memory.alt;
    $('#photo-caption').textContent = memory.caption;
    $('#photo-count').textContent = `${String(photoIndex + 1).padStart(2, '0')} / ${String(memories.length).padStart(2, '0')}`;
  }
  memoryButtons.forEach((button, index) => button.addEventListener('click', () => {
    showPhoto(index);
    openDialog(photoDialog);
  }));
  $('#photo-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
  $('#photo-next').addEventListener('click', () => showPhoto(photoIndex + 1));
  photoDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex - 1); }
  });
  $('.photo-dialog-inner').addEventListener('click', event => {
    if (event.target === $('.photo-dialog-inner')) photoDialog.close();
  });
  let touchStart = null;
  $('#large-photo').addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  $('#large-photo').addEventListener('touchend', event => {
    if (touchStart === null) return;
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 55) showPhoto(photoIndex + (distance < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });

  const letters = {
    'extrañes': {
      title: 'Ven, acércate un poquito.',
      paragraphs: [
        'Si estás leyendo esto porque me extrañas, imagina que te estoy haciendo un espacio junto a mí. Ven con tu voz de niña, con tus ganas de abrazarme, con todo eso que a veces una llamada se queda corta para decir.',
        'Yo también quiero volver a tenerte cerca. Darte un beso en la cabeza, abrazarte por detrás y quedarme ahí mientras me cuentas cualquier cosa de tu día.',
        'Cuando podamos, hagamos una llamada. Y mientras llega el abrazo de verdad, aquí te dejo uno escrito. Es largo. De esos de los que cuesta soltarse.'
      ]
    },
    'triste': {
      title: 'Hoy también puedes descansar.',
      paragraphs: [
        'Mi nena, si el día estuvo difícil, ojalá pudiera sentarme a tu lado y preguntarte qué pasó. Escucharte, aunque lo cuentes desordenado, aunque solamente tengas ganas de quedarte callada.',
        'Conmigo puedes tener días de esos en los que todo pesa un poquito más. Quiero conocer también esa parte de ti y aprender qué te ayuda, qué te calma, cómo te gusta que te acompañe.',
        'Por ahora, afloja los hombros. Respira. Toma un poquito de agua. Y si te nace, cuéntame cómo estás. Me importas, Ale. También cuando el día no te deja sonreír.'
      ]
    },
    'dudes': {
      title: 'Podemos hablarlo, amor.',
      paragraphs: [
        'Si llegaste aquí con dudas, quiero escucharlas. Qué te duele, qué te falta, qué necesitas que cambie. Me importa que puedas decirme cómo estás viviendo lo nuestro.',
        'Yo también tengo miedos y días de cansancio. Quiero que aprendamos a sentarnos a conversar antes de que todo se haga más grande en nuestras cabezas.',
        'Me ilusiona seguir contigo. Y quiero poner de mi parte para que eso se note en la forma en que te trato, en los acuerdos que cumplo y en el espacio que te hago. Busquemos un momento tranquilo para escucharnos bien.'
      ]
    },
    'sonreir': {
      title: 'Oye, tú. Sí, tú.',
      paragraphs: [
        'La señorita que escribió que a veces me saca de control… jajaja. La misma que luego habla como niña pequeña y me deja a mí hablando igual.',
        'Mira la foto con Shrek. Salimos los tres muy serios para la cantidad de tonterías que caben en esta historia. Y mira también la foto movida. Esa tiene el encanto de que la felicidad a veces ni se queda quieta para la cámara.',
        'Ahora imagina mi voz diciéndote «mi nena» con ese tono nuestro. Sí, ese. Ya sabes cuál. Te debo una sesión de ocurrencias, besos y risas. Y una foto más. Esa siempre.'
      ]
    }
  };
  const messageDialog = $('#message-dialog');
  function showMessage(title, paragraphs, kicker = 'UN SOBRE PARA TI') {
    $('#message-kicker').textContent = kicker;
    $('#message-title').textContent = title;
    const body = $('#message-body');
    body.replaceChildren(...paragraphs.map(text => {
      const p = document.createElement('p'); p.textContent = text; return p;
    }));
    messageDialog.scrollTop = 0;
    openDialog(messageDialog);
    messageDialog.scrollTop = 0;
  }
  $$('.when-card').forEach(button => button.addEventListener('click', () => {
    const data = letters[button.dataset.letter];
    showMessage(data.title, data.paragraphs);
  }));

  const plans = [
    ['Un abrazo<br>sin reloj.', 'De esos en los que llegamos y se nos olvida todo lo que tardamos en vernos.'],
    ['Un desayuno<br>sin apuro.', 'Tú, yo y tiempo de sobra para seguir conversando después del último sorbo.'],
    ['Otro viaje<br>contigo.', 'Un lugar que todavía no sea nuestro. Y la ilusión de estrenarlo juntos.'],
    ['Una noche<br>en un parque.', 'Encontrar una banca, contarnos el día y dejar que la conversación nos lleve.'],
    ['Una canción<br>más, nuestra.', 'Dejar que nos encuentre una de esas canciones que después van a tener tu nombre.'],
    ['Una foto<br>porque sí.', 'Sin una ocasión especial. Solo porque estamos juntos y quiero acordarme.'],
    ['Una noche<br>de tonterías.', 'Hablar como niños, reírnos demasiado y quedarnos cerquita un rato más.'],
    ['Volver<br>a Cangallo.', 'Mirarnos, sonreír y decir: aquí empezó una parte muy bonita de nuestra vida.']
  ];
  let planIndex = 0;
  $('#next-plan').addEventListener('click', () => {
    planIndex = (planIndex + 1) % plans.length;
    $('#plan-title').innerHTML = plans[planIndex][0];
    $('#plan-desc').textContent = plans[planIndex][1];
    const ticket = $('.ticket');
    ticket.classList.remove('changed');
    requestAnimationFrame(() => requestAnimationFrame(() => ticket.classList.add('changed')));
  });

  function hearts() {
    if (reduceMotion) return;
    const layer = $('#confetti-layer');
    layer.replaceChildren();
    for (let i = 0; i < 27; i++) {
      const heart = document.createElement('span');
      heart.className = 'confetti-heart';
      heart.textContent = i % 3 === 0 ? '♡' : '♥';
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.fontSize = `${12 + Math.random() * 19}px`;
      heart.style.animationDelay = `${Math.random() * 1.5}s`;
      heart.style.color = ['#d8bd83', '#91b5ce', '#f0e4c6'][i % 3];
      heart.addEventListener('animationend', () => heart.remove(), { once: true });
      layer.append(heart);
    }
  }
  $('#final-surprise').addEventListener('click', () => {
    showMessage('Todavía quiero muchas cosas contigo.', [
      'Me gustan estas diez fotos. Pero hay una que me hace mucha ilusión: la próxima. Esa que todavía no tomamos, en un día que aún no llega, cuando volvamos a estar juntos.',
      'Quiero llegar a ese momento y abrazarte. Escuchar tu risa cerquita. Mirarte cuando no te des cuenta, como tú haces conmigo.',
      'Felices nueve meses, Alexandra Isabel. Te amo. Y todavía quiero seguir aumentando nuestra colección contigo.'
    ], 'LA PRÓXIMA FOTO NOS ESTÁ ESPERANDO');
    hearts();
  });

  // A quiet original piano-like phrase, synthesized locally after a deliberate tap.
  // This is independent of the linked Camila song and never starts automatically.
  let audioContext = null;
  let master = null;
  let isPlaying = false;
  let scheduler = null;
  let nextNoteTime = 0;
  let noteIndex = 0;
  const phrase = [
    [48,60],[55],[64],[67],[52,59],[62],[64],[67],
    [45,57],[60],[64],[69],[53,60],[65],[69],[67],
    [48,60],[64],[67],[72],[55,59],[62],[67],[71],
    [45,60],[64],[69],[67],[53,60],[65],[64],[60]
  ];
  function playTone(midi, start, intensity) {
    const frequency = 440 * Math.pow(2, (midi - 69) / 12);
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(intensity, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 2.75);
    gain.connect(master);
    const fundamental = audioContext.createOscillator();
    fundamental.type = 'triangle';
    fundamental.frequency.value = frequency;
    fundamental.connect(gain);
    fundamental.start(start);
    fundamental.stop(start + 3);
    fundamental.onended = () => { fundamental.disconnect(); gain.disconnect(); };
  }
  function schedule() {
    if (!isPlaying) return;
    while (nextNoteTime < audioContext.currentTime + 0.75) {
      phrase[noteIndex % phrase.length].forEach((midi, index) => playTone(midi, nextNoteTime + index * 0.025, midi < 57 ? 0.4 : 0.6));
      nextNoteTime += 0.62;
      noteIndex++;
    }
  }
  function syncSoundUI() {
    const button = $('#sound-toggle');
    button.setAttribute('aria-pressed', String(isPlaying));
    $('span', button).textContent = isPlaying ? 'Pausar piano suave' : 'Activar piano suave';
    $('i', button).textContent = isPlaying ? 'Ⅱ' : '▷';
    $('#floating-sound').hidden = !isPlaying;
    $('.vinyl').classList.toggle('playing', isPlaying);
  }
  async function stopSound() {
    isPlaying = false;
    if (scheduler !== null) clearInterval(scheduler);
    scheduler = null;
    if (audioContext?.state === 'running') await audioContext.suspend();
    syncSoundUI();
  }
  $('#sound-toggle').addEventListener('click', async () => {
    if (isPlaying) { await stopSound(); return; }
    try {
      const AudioEngine = window.AudioContext || window.webkitAudioContext;
      if (!AudioEngine) throw new Error('Audio unavailable');
      if (!audioContext) {
        audioContext = new AudioEngine();
        master = audioContext.createGain();
        master.gain.value = 0.085;
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = 1800;
        master.connect(filter); filter.connect(audioContext.destination);
      }
      await audioContext.resume();
      isPlaying = true;
      nextNoteTime = audioContext.currentTime + 0.1;
      noteIndex = 0;
      schedule();
      scheduler = setInterval(schedule, 250);
      syncSoundUI();
    } catch {
      $('.sound-note').textContent = 'El piano no está disponible en este navegador. Puedes seguir disfrutando la carta.';
      await stopSound();
    }
  });
  $('#stop-sound').addEventListener('click', stopSound);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying) stopSound();
  });
})();
