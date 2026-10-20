/* =========================================================
   APP.JS - CLEAN STREAMLINED ORCHESTRATION CONTROLLER
   - Pure touch interactions:
     1. Touch photo -> Opens greeting card directly
     2. Touch center flower -> Garden blossoms up from bottom
   ========================================================= */

(function() {
  'use strict';

  let currentPersonId = 'me';
  let typewriterInterval = null;

  // DOM Elements
  const personCards = document.querySelectorAll('.person-card');
  const sceneCard = document.getElementById('scene-card');
  const cardTag = document.getElementById('card-tag');
  const displayRecipient = document.getElementById('display-recipient');
  const displayRoleTag = document.getElementById('display-role-tag');
  const cardAvatarImg = document.getElementById('card-avatar-img');
  const typewriterMessage = document.getElementById('typewriter-message');
  const typewriterCursor = document.getElementById('typewriter-cursor');
  const cardQuoteText = document.getElementById('card-quote-text');
  const gardenHintText = document.getElementById('garden-hint-text');
  const gardenStatusText = document.getElementById('garden-status-text');

  function init() {
    setupPerson(currentPersonId, false);
    bindEvents();
  }

  function bindEvents() {
    // Touch on person cards to directly open their card & garden
    personCards.forEach(card => {
      card.addEventListener('click', () => {
        const personId = card.getAttribute('data-person');
        if (personId) {
          selectAndOpenPerson(personId);
        }
      });
    });
  }

  function selectAndOpenPerson(personId) {
    if (!RECIPIENTS_DATA[personId]) return;
    currentPersonId = personId;

    // Update active highlight on cards
    personCards.forEach(card => {
      card.classList.toggle('active', card.getAttribute('data-person') === personId);
    });

    setupPerson(personId, true);

    // Start background music if not playing yet
    if (window.romanticAudio && !window.romanticAudio.isPlaying) {
      window.romanticAudio.start();
    }

    // Smoothly scroll down to greeting card
    if (sceneCard) {
      sceneCard.classList.remove('hidden');
      sceneCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Reset garden canvas to idle (1 flower)
    if (window.resetGarden) {
      window.resetGarden();
    }

    // Start typewriter
    startTypewriter(RECIPIENTS_DATA[personId].message);
  }

  function setupPerson(personId) {
    const data = RECIPIENTS_DATA[personId];
    if (!data) return;

    window.activeRecipientData = data;

    if (cardTag) cardTag.textContent = data.cardTag;
    if (displayRecipient) displayRecipient.textContent = data.name;
    if (displayRoleTag) displayRoleTag.textContent = data.roleTag;
    if (cardAvatarImg) {
      cardAvatarImg.src = data.photo;
      cardAvatarImg.alt = data.name;
    }
    if (cardQuoteText) cardQuoteText.textContent = `"${data.quote}"`;
    if (gardenHintText) gardenHintText.textContent = data.gardenHint;
    if (gardenStatusText) gardenStatusText.textContent = data.gardenHint;
  }

  function startTypewriter(text) {
    if (!typewriterMessage) return;
    if (typewriterInterval) clearInterval(typewriterInterval);

    typewriterMessage.textContent = '';
    if (typewriterCursor) typewriterCursor.style.display = 'inline-block';

    let index = 0;
    const speed = 25; // ms per char

    typewriterInterval = setInterval(() => {
      if (index < text.length) {
        typewriterMessage.textContent += text.charAt(index);
        index++;
        if (index % 5 === 0 && window.romanticAudio) {
          window.romanticAudio.playTypeTick();
        }
      } else {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
        if (typewriterCursor) {
          setTimeout(() => { typewriterCursor.style.display = 'none'; }, 2000);
        }
      }
    }, speed);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
