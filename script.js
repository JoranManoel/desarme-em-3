const ic = () => { try { lucide.createIcons() } catch (e) { } }; const $ = s => document.querySelector(s), pick = a => a[Math.floor(Math.random() * a.length)], rnd = n => 1 + Math.floor(Math.random() * n);
const fmt = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') };
const C = { Vermelho: '#d8343a', Azul: '#2f6fd6', Amarelo: '#f4c20d', Verde: '#2e9e4f', Preto: '#222222', Branco: '#ffffff' };
const WIRES = ['Vermelho', 'Azul', 'Amarelo', 'Preto', 'Branco'], C4 = ['Vermelho', 'Azul', 'Amarelo', 'Verde'];
const HD = { FIOS: '#b5303a', 'BOTÕES': '#2f6fd6', INTERRUPTORES: '#2e7d4f', DISCO: '#7b4fa3' };
const B4 = ['FIOS', 'BOTÕES', 'INTERRUPTORES', 'DISCO'];
const LV = [{ n: 'Estagiário', m: 1, t: 140, d: 0 }, { n: 'Iniciante', m: 2, t: 120, d: 0 }, { n: 'Técnico', m: 3, t: 200, d: 1 }, { n: 'Especialista', m: 4, t: 200, d: 2 }, { n: 'Mestre', m: 5, t: 230, d: 2 }, { n: 'Lenda', m: 6, t: 260, d: 3 }];
const DEF = [['MÃO TROCADA', 'O Cego só usa a mão que NÃO usa para escrever.'], ['SÓ CORPO', 'O Mudo não pode usar as mãos: só cabeça, rosto e corpo.'], ['CORES SECRETAS', 'O Surdo não pode dizer nomes de cores. Inventem apelidos.'], ['SUSSURRO', 'O Surdo só pode falar sussurrando.'], ['PRESSA!', 'Esta bomba tem 30 segundos a menos.'], ['BANANA PRIMEIRO', 'O Cego começa toda frase com "Banana!". Esqueceu 3 vezes = 1 Estrago.']];

/* ---------- regras (iguais ao Manual) ---------- */
function sF(l, w) {
    if (l === 'Verde') { const r = w.map((x, i) => x === 'Vermelho' ? i : -1).filter(i => i >= 0); return r.length >= 2 ? r[r.length - 1] + 1 : 3 }
    if (l === 'Vermelho') { if (w[0] === 'Azul') return 5; return w.includes('Amarelo') ? w.indexOf('Amarelo') + 1 : 2 }
    if (!w.includes('Branco')) return 4; const i = w.indexOf('Branco'); return i === 4 ? 1 : i + 2
}
function sB(s, c) {
    const L = 'ABCD'; if (s === 'Sol') return 'Apertar 1 vez o botão ' + (c.includes('Vermelho') ? L[c.indexOf('Vermelho')] : 'A');
    if (s === 'Lua') { const i = c.lastIndexOf('Azul'); return 'Segurar 3 segundos o botão ' + L[i < 0 ? 3 : i] }
    const n = c.filter(x => x === 'Amarelo').length; return 'Apertar 2 vezes o botão ' + L[(n === 0 || n === 4) ? 3 : n - 1]
}
function sI(f, c) {
    const q = new Set(['Vermelho', 'Amarelo']); let on = c.map((x, i) => (q.has(x) === (f % 2 === 0)) ? i + 1 : 0).filter(Boolean); if (!on.length) on = [2];
    return on.length === 3 ? 'Ligar os 3 interruptores' : 'Ligar: interruptor ' + on.join(' e ')
}
function sD(c, n) { const p = { Vermelho: n, Azul: (n + 1) % 8 + 1, Amarelo: ((n - 2) % 8 + 8) % 8 + 1, Verde: 9 - n }[c]; return 'Pino na casa ' + p }
function mk(t) {
    if (t === 'FIOS') { const led = pick(['Verde', 'Vermelho', 'Azul']), w = [0, 1, 2, 3, 4].map(() => pick(WIRES)); return { t, led, w, ans: 'Cortar o fio ' + sF(led, w), s: 'p' } }
    if (t === 'BOTÕES') { const sl = pick(['Sol', 'Lua', 'Estrela']), c = [0, 1, 2, 3].map(() => pick(C4)); return { t, sl, c, ans: sB(sl, c), s: 'p' } }
    if (t === 'INTERRUPTORES') { const f = rnd(6), c = [0, 1, 2].map(() => pick(C4)); return { t, f, c, ans: sI(f, c), s: 'p' } }
    const col = pick(C4), n = rnd(8); return { t, col, n, ans: sD(col, n), s: 'p' }
}

/* ---------- desenho das cartas (SVG) ---------- */
const T = (x, y, s, pt, w = '400', f = '#111', a = 'middle') => `<text x="${x}" y="${y}" font-size="${pt / 2.835}" font-weight="${w}" fill="${f}" text-anchor="${a}" font-family="Arial,Helvetica,sans-serif">${s}</text>`;
function svg(d, n) {
    let o = `<rect x=".6" y=".6" width="60.8" height="86.8" rx="3" fill="#fff" stroke="#111"/><path d="M.6 10V3.6Q.6.6 3.6.6H58.4Q61.4.6 61.4 3.6V10Z" fill="${HD[d.t]}"/>` + T(4, 7, d.t, 11, '700', '#fff', 'start') + T(58, 7, '#' + n, 8, '400', '#fff', 'end');
    if (d.t === 'FIOS') {
        o += T(6, 22, 'LED', 9, '700', '#111', 'start') + `<circle cx="24" cy="20.5" r="4.5" fill="${C[d.led]}" stroke="#111" stroke-width=".35"/>` + T(31, 22.5, d.led.toUpperCase(), 10, '700', '#111', 'start');
        d.w.forEach((w, i) => { const x = 62 * (i + .5) / 5; o += `<line x1="${x}" y1="30" x2="${x}" y2="61" stroke="#111" stroke-width="3.35"/><line x1="${x}" y1="30" x2="${x}" y2="61" stroke="${C[w]}" stroke-width="2.3"/><circle cx="${x}" cy="30" r="2" fill="#8a8a8a" stroke="#111" stroke-width=".3"/><circle cx="${x}" cy="61" r="2" fill="#8a8a8a" stroke="#111" stroke-width=".3"/>` + T(x, 70.5, i + 1, 11, '700') + T(x, 76.5, w.toLowerCase(), 6.5) });
        o += T(31, 83.5, 'posição 1 = esquerda', 6.5, '400', '#666')
    }
    if (d.t === 'BOTÕES') {
        if (d.sl === 'Sol') { for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; o += `<line x1="${14 + 5.2 * Math.cos(a)}" y1="${24 + 5.2 * Math.sin(a)}" x2="${14 + 7.8 * Math.cos(a)}" y2="${24 + 7.8 * Math.sin(a)}" stroke="#111" stroke-width=".55"/>` } o += `<circle cx="14" cy="24" r="4.3" fill="#f4c20d" stroke="#111" stroke-width=".35"/>` }
        else if (d.sl === 'Lua') o += `<circle cx="14" cy="24" r="6.5" fill="#e8c84a" stroke="#111" stroke-width=".35"/><circle cx="17.2" cy="22.2" r="5.4" fill="#fff"/>`;
        else { let p = ''; for (let k = 0; k < 10; k++) { const a = (90 + k * 36) * Math.PI / 180, r = k % 2 ? 3.15 : 7.5; p += (14 + r * Math.cos(a)) + ',' + (24 - r * Math.sin(a)) + ' ' } o += `<polygon points="${p}" fill="#f4a20d" stroke="#111" stroke-width=".35"/>` }
        o += T(27, 19, 'SELO', 7, '400', '#666', 'start') + T(27, 26, d.sl.toUpperCase(), 14, '700', '#111', 'start');
        d.c.forEach((c, i) => { const x = 62 * (i + .5) / 4; o += `<circle cx="${x}" cy="52" r="6.4" fill="${C[c]}" stroke="#111" stroke-width=".45"/>` + T(x, 67, 'ABCD'[i], 13, '700') + T(x, 74, c.toLowerCase(), 6.5) });
        o += T(31, 83.5, 'A = esquerda', 6.5, '400', '#666')
    }
    if (d.t === 'INTERRUPTORES') {
        o += T(6, 26, 'FUSÍVEL', 9, '700', '#111', 'start') + `<rect x="30" y="15" width="22" height="20" rx="2" fill="#f2f2f2" stroke="#111" stroke-width=".45"/>` + T(41, 31, d.f, 28, '700');
        d.c.forEach((c, i) => { const x = 62 * (i + .5) / 3; o += `<rect x="${x - 6}" y="40" width="12" height="28" rx="2" fill="${C[c]}" stroke="#111" stroke-width=".45"/><circle cx="${x}" cy="54" r="3.2" fill="#fff" stroke="#111" stroke-width=".3"/>` + T(x, 75.5, i + 1, 11, '700') + T(x, 81.5, c.toLowerCase(), 6.5) })
    }
    if (d.t === 'DISCO') {
        const tc = (d.col === 'Amarelo') ? '#111' : '#fff';
        o += T(31, 17, 'NÚMERO', 7, '400', '#666') + `<circle cx="31" cy="43" r="21" fill="${C[d.col]}" stroke="#111" stroke-width=".55"/>` + T(31, 52, d.n, 60, '700', tc) + T(31, 74, 'cor: ' + d.col.toLowerCase(), 11, '700')
    }
    return `<svg viewBox="0 0 62 88" role="img" aria-label="Carta de ${d.t}">${o}</svg>`
}

/* ---------- áudio (tudo sintetizado, sem arquivos) ---------- */
let ac, mg, nb, bpm = 118, step = 0, nt = 0, mt = 0, playing = false, vol = .8, muted = false;
const SIL = 'data:audio/wav;base64,UklGRmQfAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YUAfAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==';
function A() { try { navigator.audioSession.type = 'playback' } catch (e) { } try { if (!window.__sil) { window.__sil = new Audio(SIL); window.__sil.loop = true } if (window.__sil.paused) window.__sil.play().catch(() => { }) } catch (e) { } if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); const cp = ac.createDynamicsCompressor(); mg = ac.createGain(); mg.connect(cp); cp.connect(ac.destination); nb = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++)d[i] = Math.random() * 2 - 1 } ac.resume(); mg.gain.value = muted ? 0 : vol }
function osc(ty, f, t, d, g, f2) { const o = ac.createOscillator(), e = ac.createGain(); o.type = ty; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); e.gain.setValueAtTime(g, t); e.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(e); e.connect(mg); o.start(t); o.stop(t + d + .02) }
function noise(t, d, g, hp) { const s = ac.createBufferSource(), e = ac.createGain(), f = ac.createBiquadFilter(); s.buffer = nb; f.type = 'highpass'; f.frequency.value = hp; e.gain.setValueAtTime(g, t); e.gain.exponentialRampToValueAtTime(.001, t + d); s.connect(f); f.connect(e); e.connect(mg); s.start(t); s.stop(t + d) }
const BASS = [55, 55, 65.41, 55, 73.42, 55, 65.41, 49], LEAD = [220, 0, 261.6, 0, 329.6, 261.6, 0, 293.7, 220, 0, 246.9, 0, 329.6, 0, 392, 329.6];
function sched() {
    if (!playing) return; while (nt < ac.currentTime + .25) {
        const s = step % 16, t = nt;
        if (s % 4 === 0) osc('sine', 150, t, .18, 1, 40); if (s % 2 === 1) noise(t, .05, .35, 7000); if (s % 4 === 2) noise(t, .1, .25, 2500);
        if (s % 2 === 0) osc('sawtooth', BASS[(s >> 1) % 8], t, .2, .35); if (LEAD[s]) osc('square', LEAD[s], t, .12, .12); nt += 60 / bpm / 4; step++
    }
    mt = setTimeout(sched, 80)
}
function music(on) { playing = on; clearTimeout(mt); if (on) { A(); step = 0; nt = ac.currentTime + .05; sched() } }
function beep(f = 1000, d = .08, g = .5) { A(); osc('square', f, ac.currentTime, d, g) }
function boom() { A(); const t = ac.currentTime; noise(t, .5, 1, 100); noise(t + .05, 1.8, .8, 60); osc('sine', 90, t, 1.8, 1.4, 22); osc('sawtooth', 160, t, 1.4, .9, 28); osc('square', 70, t + .1, 1.2, .6, 20); for (let i = 0; i < 6; i++)noise(t + .3 + i * .12, .08, .5, 2000 + i * 500) }
function buzz() { A(); const t = ac.currentTime; osc('sawtooth', 260, t, .28, .9, 110); osc('square', 110, t + .14, .4, .8); document.body.classList.add('shk'); setTimeout(() => document.body.classList.remove('shk'), 900) }
function ding() { A(); const t = ac.currentTime; osc('triangle', 880, t, .25, .8); osc('triangle', 1320, t + .12, .4, .8) }
function win() { A();[523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => osc('triangle', f, ac.currentTime + i * .13, .35, .8)) }
function setVol() { if (mg) mg.gain.value = muted ? 0 : vol }

/* ---------- sincronização com a tela do Mudo ---------- */
let conns = [], code = String(1000 + Math.floor(Math.random() * 9000));
const bound = () => (Math.floor(Date.now() / 60000) + 1) * 60000;
function send() {
    if (!conns.length) return; const rem = !S ? 0 : S.run ? Math.max(0, (S.end - Date.now()) / 1000) : S.rem;
    const P = !S ? { idle: true } : { rem, run: S.run, st: S.st, left: S.cards.filter(c => c.s !== 'd').length, n: S.cards.length, res: S.res, lv: S.lv + 1, df: S.df.map(i => DEF[i][0] + ': ' + DEF[i][1]) }; conns.forEach(c => { try { if (c.open) c.send(P) } catch (e) { } })
}
function startNet() {
    if (!window.Peer) { $('#rs').textContent = 'Sem sincronização (biblioteca não carregou). Use o início no próximo minuto.'; return }
    const p = new Peer('desarme-' + code);
    p.on('open', () => $('#rs').textContent = 'Sincronização ativa. Aguardando o Mudo...');
    p.on('disconnected', () => { try { p.reconnect() } catch (e) { } });
    p.on('connection', c => {
        const isCego = c.metadata && c.metadata.role === 'cego';
        c.on('open', () => {
            if (isCego) { cegos.push(c); rsUpdate() }
            else { conns.push(c); rsUpdate() }
            send()
        });
        c.on('data', m => { if (isCego) onCego(m) });
        c.on('close', () => {
            if (isCego) cegos = cegos.filter(x => x !== c);
            else conns = conns.filter(x => x !== c);
            rsUpdate()
        })
    });
    p.on('error', e => { if (e.type === 'unavailable-id') { code = String(1000 + Math.floor(Math.random() * 9000)); $('#code').textContent = code; startNet() } else $('#rs').textContent = 'Erro de sincronização: ' + e.type })
}

/* ---------- jogo ---------- */
let S = null, lv = 0, tick = 0, lastSec = -1;
const show = id => ['menu', 'brief', 'game', 'end'].forEach(x => $('#' + x).classList.toggle('hide', x !== id));
$('#lvs').innerHTML = LV.map((l, i) => `<button class="lv${i === 0 ? ' on' : ''}" data-i="${i}"><b>${l.n}</b><span>${l.m} módulos, ${l.d} defeito${l.d === 1 ? '' : 's'}<p>tempo: ${fmt(l.t)}</p></span></button>`).join('');
$('#lvs').onclick = e => { const b = e.target.closest('.lv'); if (!b) return; lv = +b.dataset.i; document.querySelectorAll('.lv').forEach(x => x.classList.toggle('on', x === b)) };
$('#code').textContent = code;
$('#vol').oninput = e => { vol = +e.target.value; setVol() };
$('#mute').onclick = e => { muted = !muted; $('#mute').innerHTML = '<i data-lucide="' + (muted ? 'volume-x' : 'volume-2') + '"></i> Música: ' + (muted ? 'desligada' : 'ligada'); ic(); setVol() };
$('#test').onclick = () => { A(); music(true); setTimeout(() => music(false), 2500) };
startNet();

function build() {
    const L = LV[lv]; let types = [];
    while (types.length < L.m) types.push(pick(B4));
    const df = [];
    while (df.length < L.d) {
        const i = Math.floor(Math.random() * DEF.length);
        if (!df.includes(i)) df.push(i)
    }
    const total = L.t - (df.includes(4) ? 30 : 0);
    S = { lv, cards: types.map(mk), st: 0, df, total, rem: total, run: false, res: null, end: 0 };
    const dh = df.length ? df.map(i => `<div class="df"><i data-lucide="triangle-alert"></i> DEFEITO - ${DEF[i][0]}: ${DEF[i][1]}</div>`).join('') : '<p class="note">Sem defeitos nesta bomba.</p>';
    $('#bi').innerHTML = `<b>Nível ${lv + 1} - ${L.n}</b><br>${types.length} módulos: ${types.join(', ')}<br>Tempo: ${fmt(total)}`;
    $('#bdf').innerHTML = dh; $('#gdf').innerHTML = df.length ? dh : ''; show('brief'); ic()
}
$('#go').onclick = () => { A(); build() }; $('#back').onclick = () => show('menu'); $('#tomenu').onclick = () => show('menu');
$('#again').onclick = () => { A(); build() };

function go(t0) { $('#game').classList.remove('alarm'); S.run = true; S.end = t0 + S.total * 1000; lastSec = -1; $('#pause').innerHTML = '<i data-lucide="pause"></i> Pausar'; ic(); show('game'); render(); music(true); clearInterval(tick); tick = setInterval(loop, 200); send() }
$('#start').onclick = () => { A(); go(Date.now()) };
$('#sync').onclick = () => { A(); const ts = bound(), b = $('#sync'); b.disabled = true; const iv = setInterval(() => { b.textContent = 'Começa às ' + new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' (em ' + Math.max(0, Math.ceil((ts - Date.now()) / 1000)) + 's)' }, 200); setTimeout(() => { clearInterval(iv); b.disabled = false; b.innerHTML = '<i data-lucide="clock"></i> INICIAR NO PRÓXIMO MINUTO'; ic(); go(ts) }, Math.max(0, ts - Date.now())) };
$('#pause').onclick = () => { if (!S || S.res) return; const b = $('#pause'); if (S.run) { S.rem = (S.end - Date.now()) / 1000; S.run = false; music(false); b.innerHTML = '<i data-lucide="play"></i> Continuar'; ic() } else { S.end = Date.now() + S.rem * 1000; S.run = true; lastSec = -1; music(true); b.innerHTML = '<i data-lucide="pause"></i> Pausar'; ic() } send() };
function loop() {
    if (!S.run) return; const rem = (S.end - Date.now()) / 1000; S.rem = rem;
    bpm = 118 + (1 - rem / S.total) * 70; const s = Math.ceil(rem);
    if (s !== lastSec) { lastSec = s; if (s <= 10 && s > 0) { beep(s <= 3 ? 1500 : 1000, .1, .6) } if (s % 2 === 0 || s <= 15) send() }
    $('#tm').textContent = fmt(rem); $('#tm').classList.toggle('hot', rem <= 30); $('#game').classList.toggle('alarm', rem <= 30 && rem > 0);
    if (rem <= 0) finish('lose', 'O tempo acabou')
}
function dots() { $('#dots').innerHTML = [0, 1, 2].map(i => `<div class="dot${i < S.st ? ' x' : ''}"></div>`).join(''); $('#lvn').textContent = 'Nível ' + (S.lv + 1) + ' - ' + LV[S.lv].n + ' | Estragos' }
function render() {
    dots(); $('#grid').innerHTML = S.cards.map((c, i) => {
        let a = ''; if (c.s === 'p') a = `<button class="btn ok" data-a="r" data-i="${i}" style="width:100%"><i data-lucide="eye"></i> PRONTO! Ver resposta</button>`;
        else if (c.s === 'r') a = `<div class="ans">${c.ans}</div><div class="row" style="justify-content:center"><button class="btn ok" data-a="y" data-i="${i}"><i data-lucide="check"></i> Certo</button><button class="btn" data-a="n" data-i="${i}"><i data-lucide="x"></i> Errou</button></div>`;
        else a = '<div class="stamp"><i data-lucide="shield-check"></i> DESARMADO</div>';
        return `<div class="mod ${c.s === 'd' ? 'd' : ''}"><i class="cap"></i><i class="fuse"></i><i class="spark"></i><div class="plate">${svg(c, i + 1)}</div>${a}</div>`
    }).join(''); ic()
}
$('#grid').onclick = e => {
    const b = e.target.closest('button'); if (!b || !S.run) return; const i = +b.dataset.i, c = S.cards[i];
    if (b.dataset.a === 'r') c.s = 'r';
    if (b.dataset.a === 'y') { c.s = 'd'; ding(); if (S.cards.every(x => x.s === 'd')) return finish('win', 'Bomba desarmada!') }
    if (b.dataset.a === 'n') { buzz(); S.cards[i] = mk(c.t); if (++S.st >= 3) { render(); return finish('lose', '3 Estragos') } }
    render(); send()
};
$('#rule').onclick = () => { if (!S || !S.run) return; buzz(); if (++S.st >= 3) { render(); return finish('lose', '3 Estragos') } render(); send() };
$('#quit').onclick = () => { if (S && !S.res && confirm('Desistir desta bomba?')) finish('lose', 'Vocês desistiram') };
function fx(k) {
    const d = document.createElement('div'); d.className = 'fx'; let h = '';
    if (k === 'boom') { h = '<i class="flash"></i><i class="ball"></i><i class="ring"></i><i class="ring r2"></i><b class="bm">BOOM!</b>'; for (let i = 0; i < 28; i++) { const a = Math.random() * 6.283, r = 120 + Math.random() * 260; h += `<u style="--x:${Math.cos(a) * r}px;--y:${Math.sin(a) * r}px;--d:${Math.random() * .2}s"></u>` } document.body.classList.add('shk'); setTimeout(() => document.body.classList.remove('shk'), 900) }
    else { for (let i = 0; i < 50; i++)h += `<s style="--l:${Math.random() * 100}%;--c:${pick(['#ff3b5c', '#ffd23f', '#3bd16f', '#3ba4ff', '#b86bff'])};--t:${2 + Math.random() * 2}s;--d:${Math.random()}s"></s>`; h += '<b class="bm ok">DESARMADA!</b>' }
    d.innerHTML = h; document.body.appendChild(d); setTimeout(() => d.remove(), k === 'boom' ? 3000 : 4500)
}
function finish(r, why) {
    clearInterval(tick); S.run = false; S.res = r; S.rem = Math.max(0, (S.end - Date.now()) / 1000); music(false);
    let stars = 0; if (r === 'win') { stars = 1; if (S.st <= 1) stars = 2; if (S.st === 0 && S.rem >= 60) stars = 3; win(); fx('win') } else { boom(); fx('boom') }
    $('#et').textContent = r === 'win' ? 'DESARMADA!' : 'BOOM!'; $('#et').style.color = r === 'win' ? 'var(--ok)' : 'var(--ac)';
    $('#es').innerHTML = r === 'win' ? '<i data-lucide="star" class="on"></i>'.repeat(stars) + '<i data-lucide="star"></i>'.repeat(3 - stars) : ''; ic();
    $('#ed').textContent = why + ' | Estragos: ' + S.st + (r === 'win' ? ' | Tempo restante: ' + fmt(S.rem) : '');
    show('end'); send(); send()
}

/* ---------- tela do Mudo ---------- */
let M = { end: 0, run: false, rem: 0 }, mt2 = 0;
function mdraw() {
    const pre = M.start && Date.now() < M.start;
    $('#mtm').classList.toggle('pre', !!pre);
    if (pre) {
        $('#mtm').textContent = fmt((M.start - Date.now()) / 1000);
        return
    }
    const rem = M.run ? Math.max(0, (M.end - Date.now()) / 1000) : M.rem;
    $('#mtm').textContent = fmt(rem);
    $('#mtm').classList.toggle('hot', M.run && rem <= 30);
    $('#man').classList.toggle('tremer', M.run && rem <= 30 && rem > 0);
    $('#man').classList.toggle('urgente', M.run && rem <= 10 && rem > 0);
    if (M.run && M.start && rem <= 0 && M.fx !== 'boom') {
        M.fx = 'boom'; boom(); fx('boom')
    }
    if (M.run && rem > 0) {
        const q = Math.ceil(rem);
        if (q !== M.ls) {
            M.ls = q;
            if (ac && mg) q <= 10 ? beep(q <= 3 ? 1500 : 1000, .1, .5) : osc('sine', 800, ac.currentTime, .04, .12)
        }
    }
}

function mset(d) {
    M.start = 0; if (d.idle) { M.run = false; $('#mtm').textContent = '--:--'; $('#mmod').textContent = 'Aguardando a bomba iniciar...'; return } if (M.pst !== undefined) { if (d.st > M.pst) buzz(); else if (d.left < M.pl) ding() } M.pst = d.st; M.pl = d.left; M.run = !!d.run; M.rem = d.rem; M.end = Date.now() + d.rem * 1000; $('#mj').classList.add('hide');
    $('#mdots').innerHTML = [0, 1, 2].map(i => `<div class="dot${i < d.st ? ' x' : ''}"></div>`).join('');
    $('#mmod').innerHTML = `Módulos desarmados: <b>${d.n - d.left} de ${d.n}</b>` + (d.lv ? ` | Nível ${d.lv}` : '');
    $('#mdf').innerHTML = (d.df || []).map(x => `<div class="df"><i data-lucide="triangle-alert"></i> ${x}</div>`).join(''); ic();
    $('#mres').textContent = d.res === 'win' ? 'DESARMADA!' : d.res === 'lose' ? 'BOOM!' : ''; $('#mres').style.color = d.res === 'win' ? 'var(--ok)' : 'var(--ac)'; if (d.res && M.fx !== d.res) { M.fx = d.res; d.res === 'win' ? win() : boom(); fx(d.res === 'win' ? 'win' : 'boom') } if (!d.res) M.fx = null; mdraw()
}
$('#mlv').innerHTML = LV.map((l, i) => `<option value="${i}">Nível ${i + 1} - ${l.n} (${fmt(l.t)})</option>`).join('');
$('#mjb').onclick = () => {
    A(); const c = $('#mc').value.trim();
    if (!window.Peer) { $('#mst').textContent = 'A biblioteca de conexão não carregou. Use o timer no próximo minuto abaixo.'; return }
    $('#mst').textContent = 'Conectando...'; const p = new Peer();
    p.on('open', () => {
        const k = p.connect('desarme-' + c, { reliable: true });
        const to = setTimeout(() => { $('#mst').textContent = 'Não encontrei esse código. Confira e tente de novo.' }, 9000);
        k.on('open', () => { clearTimeout(to); $('#mst').textContent = 'Conectado ao Surdo ✓'; $('#mmod').textContent = 'Aguardando a bomba iniciar...' });
        k.on('data', m => { $('#mst').textContent = 'Conectado ao Surdo ✓'; mset(m) });
        k.on('close', () => { $('#mst').textContent = 'Conexão perdida. Toque em Conectar de novo.'; $('#mj').classList.remove('hide') })
    });
    p.on('error', e => { $('#mst').textContent = 'Erro: ' + e.type })
};
$('#mman').onclick = () => { A(); const ts = bound(), t = LV[+$('#mlv').value].t - ($('#mpr').checked ? 30 : 0); M = { run: true, start: ts, end: ts + t * 1000, rem: t }; $('#mj').classList.add('hide'); $('#mdots').innerHTML = ''; $('#mmod').textContent = 'Timer pelo relógio. Começa às ' + new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); mdraw() };
const MAN = [['FIOS (fios 1 a 5, da esquerda para a direita)', [['LED verde', 'Se houver 2 ou mais fios vermelhos, corte o ÚLTIMO fio vermelho. Senão, corte o fio 3.'], ['LED vermelho', 'Se o fio 1 for azul, corte o fio 5. Senão, corte o PRIMEIRO fio amarelo; se não houver amarelo, corte o fio 2.'], ['LED azul', 'Se não houver fio branco, corte o fio 4. Senão, corte o fio logo À DIREITA do primeiro fio branco. Se esse branco for o fio 5, corte o fio 1.']]],
['BOTÕES (A, B, C e D, da esquerda para a direita)', [['Selo Sol', 'Aperte 1 vez o primeiro botão vermelho. Se não houver vermelho, aperte o botão A 1 vez.'], ['Selo Lua', 'Segure por 3 segundos o ÚLTIMO botão azul (o mais à direita). Se não houver azul, segure o botão D.'], ['Selo Estrela', 'Conte os botões amarelos: 1 = botão A, 2 = B, 3 = C. Com 0 ou 4 amarelos, é o botão D. Aperte esse botão 2 vezes.']]],
['INTERRUPTORES (1 a 3, da esquerda para a direita)', [['Fusível par (2, 4, 6)', 'Ligue os interruptores de cor QUENTE: vermelho e amarelo.'], ['Fusível ímpar (1, 3, 5)', 'Ligue os interruptores de cor FRIA: azul e verde.'], ['Sempre', 'Se nenhum interruptor se encaixar, ligue só o interruptor 2. Os demais ficam desligados.']]],
['DISCO (casas 1 a 8, N = número da carta)', [['Vermelho', 'Casa N.'], ['Azul', 'Casa N + 2. Se passar de 8, volte ao 1 (7 vira 1, 8 vira 2).'], ['Amarelo', 'Casa N - 1. Se der 0, é a casa 8.'], ['Verde', 'Casa 9 - N (1 vira 8, 8 vira 1).']]]];
const MC = ['#d8343a', '#2f6fd6', '#2e9e4f', '#7b4fa3'];
const PG = [`<div class="cov"><small>TOP SECRET</small><h2>MANUAL DE DESARME</h2><p>Só para os olhos do Macaco Mudo</p><span class="bomb">&#128163;</span></div>`, ...MAN.map(([t, rows], i) => `<h3 style="background:${MC[i]}">${t}</h3>${rows.map(r => `<div class="rl"><b>${r[0]}</b><span>${r[1]}</span></div>`).join('')}`), `<div class="cov"><h2>Boa sorte!</h2><p>Gestos claros salvam bananas.</p></div>`];
let bk = 0;
$('#man').innerHTML = `<div class="book"><div class="pgs">${PG.map((p, i) => `<div class="pg" style="z-index:${PG.length - i}"><div class="pf">${p}<em>${i + 1}/${PG.length}</em></div><div class="pb"></div></div>`).join('')}</div></div>`;

const E = [...document.querySelectorAll('.pg')], N = E.length, PGS = $('.pgs'); let D = null;
function setAng(i, a, anim) {
    const e = E[i]; e.style.transition = anim ? 'transform .55s cubic-bezier(.22,.8,.25,1)' : 'none'; e.style.transform = 'rotateY(' + (-a) + 'deg)'; e.style.setProperty('--sh', (Math.sin(a * Math.PI / 180) * .6).toFixed(3));
    if (E[i + 1]) E[i + 1].style.setProperty('--sh', a > 0 && a < 180 ? (.55 * (1 - a / 180)).toFixed(3) : 0);
    clearTimeout(e._t); if (a >= 180) e._t = setTimeout(() => { e.style.visibility = 'hidden' }, 650); else e.style.visibility = ''
}
function settle(i, flip) { setAng(i, flip ? 180 : 0, true); bk = flip ? i + 1 : i; if (ac) noise(ac.currentTime, .15, .25, 1800) }
PGS.addEventListener('pointerdown', e => { D = { id: e.pointerId, x: e.clientX, i: null, a: 0, v: 0, lx: e.clientX, lt: performance.now(), w: PGS.clientWidth } });
PGS.addEventListener('pointermove', e => {
    if (!D || e.pointerId !== D.id) return; const dx = e.clientX - D.x, t = performance.now();
    D.v = (e.clientX - D.lx) / Math.max(1, t - D.lt) * .6 + D.v * .4; D.lx = e.clientX; D.lt = t;
    if (D.i === null) { if (Math.abs(dx) < 8) return; D.fw = dx < 0; if (D.fw ? bk >= N - 1 : bk < 1) { D = null; return } D.i = D.fw ? bk : bk - 1; try { PGS.setPointerCapture(e.pointerId) } catch (x) { } }
    const p = Math.min(1, Math.max(0, (D.fw ? -dx : dx) - 8) / (D.w * .8)); D.a = D.fw ? p * 180 : 180 - p * 180;
    if (!D.raf) D.raf = requestAnimationFrame(() => { if (D) { D.raf = 0; setAng(D.i, D.a, false) } })
});
function endDrag(e) {
    if (!D || e.pointerId !== D.id) return; const d = D; D = null; if (d.i === null) return; cancelAnimationFrame(d.raf);
    const fast = Math.abs(d.v) > .5; settle(d.i, d.fw ? (d.v < -.5 || (!fast && d.a > 70)) : !(d.v > .5 || (!fast && d.a < 110)))
}
PGS.addEventListener('pointerup', endDrag); PGS.addEventListener('pointercancel', endDrag);
function fit() { document.querySelectorAll('.pf').forEach(e => { e.style.fontSize = ''; let f = parseFloat(getComputedStyle(e).fontSize); while (e.scrollHeight > e.clientHeight + 1 && f > 9) { f -= .5; e.style.fontSize = f + 'px' } }) }
addEventListener('resize', () => { if (!$('#mudo').classList.contains('hide')) fit() });
if (document.fonts) document.fonts.ready.then(() => { if (!$('#mudo').classList.contains('hide')) fit() });

$('#mset').onclick = () => $('#mj').classList.toggle('hide'); $('#mj').classList.add('ativo'); $('#mclose').onclick = () => $('#mj').classList.add('hide');
$('#msnd').onclick = () => { A(); muted = !muted; setVol(); $('#msnd').innerHTML = '<i data-lucide="' + (muted ? 'volume-x' : 'volume-2') + '"></i>'; ic() };
document.addEventListener('click', e0 => {
    if (!e0.target.closest('.fsbtn')) return; const d = document, e = d.documentElement, rq = e.requestFullscreen || e.webkitRequestFullscreen;
    try { if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d); else if (rq) rq.call(e); else alert('Este navegador não permite tela cheia. No iPhone, use Compartilhar > Adicionar à Tela de Início.') } catch (x) { }
});
function asMudo() { $('#surdo').classList.add('hide'); $('#mudo').classList.remove('hide'); document.documentElement.classList.add('mu-on'); fit(); setInterval(mdraw, 250) }
$('#toMudo').onclick = () => { asMudo(); try { history.replaceState(null, '', '#mudo') } catch (e) { } };
$('#toSurdo').onclick = () => { location.hash = ''; location.reload() };
ic(); if (location.hash === '#mudo') asMudo();
addEventListener('hashchange', () => location.reload());