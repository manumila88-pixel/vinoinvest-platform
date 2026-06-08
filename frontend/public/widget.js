(function () {
  'use strict';

  var API_BASE = 'https://vinoinvest-backend-2.onrender.com';
  var APP_BASE = 'https://vinoinvest-platform.vercel.app';

  function getSignal(score) {
    if (score >= 70) return { label: 'BUY', color: '#22c55e' };
    if (score >= 40) return { label: 'HOLD', color: '#eab308' };
    return { label: 'SELL', color: '#ef4444' };
  }

  function getScoreColor(score) {
    if (score >= 70) return '#22c55e';
    if (score >= 40) return '#eab308';
    return '#ef4444';
  }

  // Validate that a value is a safe CSS hex color (#rrggbb)
  function safeColor(val) {
    return /^#[0-9a-f]{6}$/i.test(val) ? val : '#888888';
  }

  // Validate that a numeric value is within 0-100
  function safeScore(val) {
    var n = Number(val);
    return isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0;
  }

  function buildStyles() {
    return [
      ':host { all: initial; display: block; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }',
      '*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }',
      '.vi-card {',
      '  --bg: #1a1a2e;',
      '  --surface: #16213e;',
      '  --border: #0f3460;',
      '  --text: #e2e8f0;',
      '  --muted: #94a3b8;',
      '  --accent: #c0392b;',
      '  background: var(--bg);',
      '  border: 1px solid var(--border);',
      '  border-radius: 12px;',
      '  padding: 16px;',
      '  max-width: 300px;',
      '  width: 100%;',
      '  color: var(--text);',
      '  box-shadow: 0 4px 24px rgba(0,0,0,0.4);',
      '}',
      '.vi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }',
      '.vi-logo { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: var(--accent); text-transform: uppercase; }',
      '.vi-signal { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; padding: 2px 8px; border-radius: 4px; color: #fff; }',
      '.vi-name { font-size: 15px; font-weight: 600; line-height: 1.3; color: var(--text); margin-bottom: 2px; }',
      '.vi-producer { font-size: 12px; color: var(--muted); margin-bottom: 14px; }',
      '.vi-price { font-size: 22px; font-weight: 700; color: var(--text); margin-bottom: 12px; }',
      '.vi-price-label { font-size: 13px; font-weight: 400; color: var(--muted); }',
      '.vi-score-label { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-bottom: 4px; }',
      '.vi-score-track { background: var(--surface); border-radius: 4px; height: 6px; overflow: hidden; margin-bottom: 14px; }',
      '.vi-score-fill { height: 100%; border-radius: 4px; transition: width 0.4s ease; }',
      '.vi-link { display: block; text-align: center; font-size: 12px; font-weight: 600; color: var(--accent); text-decoration: none; border: 1px solid var(--accent); border-radius: 6px; padding: 6px 0; transition: background 0.2s; }',
      '.vi-link:hover { background: rgba(192,57,43,0.15); }',
      '.vi-error { font-size: 13px; color: var(--muted); text-align: center; padding: 8px 0; }',
      '.vi-spinner { display: flex; justify-content: center; align-items: center; height: 80px; }',
      '.vi-spinner::after {',
      '  content: "";',
      '  width: 28px; height: 28px;',
      '  border: 3px solid var(--border);',
      '  border-top-color: var(--accent);',
      '  border-radius: 50%;',
      '  animation: vi-spin 0.7s linear infinite;',
      '}',
      '@keyframes vi-spin { to { transform: rotate(360deg); } }'
    ].join('\n');
  }

  function el(tag, cls) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    return node;
  }

  function clearCard(card) {
    while (card.firstChild) card.removeChild(card.firstChild);
  }

  function makeHeader(card, signalLabel, signalColor) {
    var header = el('div', 'vi-header');
    var logo = el('span', 'vi-logo');
    logo.textContent = 'VinoInvest';
    header.appendChild(logo);
    if (signalLabel) {
      var badge = el('span', 'vi-signal');
      badge.textContent = signalLabel;
      badge.style.background = safeColor(signalColor);
      header.appendChild(badge);
    }
    card.appendChild(header);
  }

  function renderLoading(card) {
    clearCard(card);
    makeHeader(card, null, null);
    card.appendChild(el('div', 'vi-spinner'));
  }

  function renderError(card) {
    clearCard(card);
    makeHeader(card, null, null);
    var msg = el('p', 'vi-error');
    msg.textContent = 'Dati non disponibili';
    card.appendChild(msg);
  }

  function renderWine(card, wine, appBase) {
    var score = safeScore(wine.investment_score);
    var signal = getSignal(score);
    var scoreColor = safeColor(getScoreColor(score));
    var priceNum = typeof wine.current_price === 'number' ? wine.current_price : null;
    var priceText = priceNum !== null
      ? priceNum.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €'
      : 'N/A';

    var producerText = (wine.producer || '');
    if (wine.vintage) producerText += (producerText ? ' · ' : '') + wine.vintage;

    clearCard(card);
    makeHeader(card, signal.label, signal.color);

    var name = el('div', 'vi-name');
    name.textContent = wine.name || '';
    card.appendChild(name);

    var producer = el('div', 'vi-producer');
    producer.textContent = producerText;
    card.appendChild(producer);

    var priceEl = el('div', 'vi-price');
    priceEl.textContent = priceText + ' ';
    var priceLabel = el('span', 'vi-price-label');
    priceLabel.textContent = 'prezzo corrente';
    priceEl.appendChild(priceLabel);
    card.appendChild(priceEl);

    var scoreLabelRow = el('div', 'vi-score-label');
    var scoreLabelL = el('span');
    scoreLabelL.textContent = 'AI Score';
    var scoreLabelR = el('span');
    scoreLabelR.textContent = score + '/100';
    scoreLabelRow.appendChild(scoreLabelL);
    scoreLabelRow.appendChild(scoreLabelR);
    card.appendChild(scoreLabelRow);

    var track = el('div', 'vi-score-track');
    var fill = el('div', 'vi-score-fill');
    fill.style.width = score + '%';
    fill.style.background = scoreColor;
    track.appendChild(fill);
    card.appendChild(track);

    var link = el('a', 'vi-link');
    link.href = appBase + '/?wine=' + encodeURIComponent(wine.name || '');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Analisi completa →';
    card.appendChild(link);
  }

  function initWidget(scriptEl) {
    var wineName = scriptEl.getAttribute('data-wine') || '';
    if (!wineName) return;

    var host = document.createElement('div');
    scriptEl.parentNode.insertBefore(host, scriptEl.nextSibling);

    var shadow = host.attachShadow({ mode: 'open' });

    var style = document.createElement('style');
    style.textContent = buildStyles();
    shadow.appendChild(style);

    var card = document.createElement('div');
    card.className = 'vi-card';
    shadow.appendChild(card);

    renderLoading(card);

    var url = API_BASE + '/api/wines?search=' + encodeURIComponent(wineName) + '&limit=1';

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var wines = data.wines || data;
        var wine = Array.isArray(wines) ? wines[0] : null;
        if (!wine) { renderError(card); return; }
        renderWine(card, wine, APP_BASE);
      })
      .catch(function () {
        renderError(card);
      });
  }

  function bootstrap() {
    var scripts = document.querySelectorAll('script[data-wine]');
    for (var i = 0; i < scripts.length; i++) {
      initWidget(scripts[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
