/* ===== CEGO DIGITAL (acrescenta o 3º aparelho ao jogo) =====*/

let cegos = [], uid = 0, CG = { mods: [], sig: '', st: 0, k: null, end: 0, run: false, connected: false, fx: null, ls: 0 };
const CS = {}, vib = p => { try { navigator.vibrate && navigator.vibrate(p) } catch (e) { } };

/* --- ganchos no lado do Surdo --- */
const _mk = mk; mk = t => { const c = _mk(t); c.id = ++uid; return c };
const _send = send;
send = function () {
    _send(); if (!cegos.length || !S) return;
    const P = { mods: S.cards.map(c => ({ t: c.t, s: c.s, id: c.id })), st: S.st, run: S.run, res: S.res, rem: S.run ? Math.max(0, (S.end - Date.now()) / 1000) : S.rem };
    cegos.forEach(k => { try { if (k.open) k.send(P) } catch (e) { } })
};
function rsUpdate() { $('#rs').textContent = (conns.length || cegos.length) ? 'Conectados: ' + (conns.length ? 'Mudo ✓ ' : '') + (cegos.length ? 'Cego ✓' : '') : 'Aguardando o Mudo e o Cego...' }

/* Confere a ação do Cego com o gabarito (o texto da resposta) */
function judge(c, a) {
    const m = c.ans;
    if (c.t === 'FIOS') return a.cuts.length === 1 && a.cuts[0] === +m.match(/fio (\d)/)[1];
    if (c.t === 'BOTÕES') {
        const b = 'ABCD'.indexOf(m.match(/botão ([A-D])/)[1]), hold = /Segurar/.test(m), n = hold ? 0 : (/2 vezes/.test(m) ? 2 : 1);
        return a.btn.every((x, i) => i === b ? (hold ? x.hold && x.tap === 0 : x.tap === n && !x.hold) : (x.tap === 0 && !x.hold))
    }
    if (c.t === 'INTERRUPTORES') { const on = /os 3/.test(m) ? [1, 2, 3] : m.match(/\d/g).map(Number); return [1, 2, 3].every(i => a.sw[i - 1] === on.includes(i)) }
    return a.pin === +m.match(/casa (\d)/)[1]
}
function onCego(m) {
    if (!S || !S.run || m.a !== 'ready') return; const i = m.i, c = S.cards[i];
    if (!c || c.id !== m.id || c.s === 'd') return;
    const ok = judge(c, m.act);
    if (ok) { c.s = 'd'; ding(); if (S.cards.every(x => x.s === 'd')) { render(); return finish('win', 'Bomba desarmada!') } }
    else { buzz(); S.cards[i] = mk(c.t); if (++S.st >= 3) { render(); return finish('lose', '3 Estragos') } }
    render(); send(); cegos.forEach(k => { try { k.send({ r: ok ? 1 : 0, i }) } catch (e) { } })
}

/* --- visual (injetado) --- */
document.head.insertAdjacentHTML('beforeend', `<style>
#cego{position:fixed;inset:0;z-index:20;display:flex;flex-direction:column;gap:8px;padding:max(8px,env(safe-area-inset-top)) 8px max(8px,env(safe-area-inset-bottom));background:#161616;color:#ddd;-webkit-user-select:none;user-select:none;touch-action:manipulation}
@supports(height:100dvh){#cego{height:100dvh}}
#cego .ch{display:flex;align-items:center;justify-content:space-between;gap:8px}
#cgrid{flex:1;min-height:0;overflow:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;align-content:start;touch-action:pan-y}
.cwait{grid-column:1/-1;min-height:40vh;display:grid;place-items:center;padding:24px;color:#aaa;text-align:center;font-size:clamp(18px,4vw,28px)}
.cm{background:#262626;border:3px solid #6b6b6b;border-radius:20px;padding:12px;display:flex;flex-direction:column;gap:12px;align-items:center}
.cm.d{opacity:.45;pointer-events:none;font-family:Bangers,Impact,sans-serif;font-size:28px;padding:22px}
.cm .row2{display:flex;gap:8px;width:100%}.cm .row2 .btn{flex:1;padding:10px;font-size:18px;background:linear-gradient(#777,#4d4d4d);box-shadow:0 4px 0 #222}.cm .row2 .btn.ok{background:linear-gradient(#ddd,#999);color:#111;text-shadow:none}
.cwr{display:flex;gap:18px;align-items:center;justify-content:center}
.cw{width:34px;height:150px;border:0;padding:0;border-radius:6px;background:linear-gradient(90deg,#555,#a5a5a5,#555)}
.cw.cut{background:linear-gradient(#a5a5a5 0 36%,transparent 36% 64%,#a5a5a5 64%)}
.cb{width:62px;height:62px;border-radius:50%;border:3px solid #bbb;background:#777;color:#fff;font:900 22px system-ui;padding:0}
.cb.t0{background:repeating-radial-gradient(#777 0 3px,#a0a0a0 3px 6px)}.cb.t1{background:repeating-linear-gradient(45deg,#777 0 4px,#a0a0a0 4px 8px)}.cb.t2{background:#8a8a8a}.cb.t3{background:radial-gradient(#ccc 0 30%,#666 32%)}
.cb.hold{animation:hp 3s linear}@keyframes hp{from{box-shadow:0 0 0 0 #fff}to{box-shadow:0 0 0 14px #fff}}
.cs{width:52px;height:110px;border-radius:14px;border:3px solid #aaa;background:#3a3a3a;position:relative;padding:0}
.cs::after{content:'';position:absolute;left:6px;right:6px;height:44px;border-radius:10px;background:#999;bottom:6px}
.cs.on::after{bottom:auto;top:6px;background:#fff}
.cdisc{position:relative;width:230px;height:230px;border-radius:50%;border:3px solid #888;background:#2f2f2f}
.cdk{position:absolute;width:38px;height:38px;margin:-19px 0 0 -19px;border-radius:50%;border:3px solid #999;background:#555;padding:0}
.cdk.p1{width:48px;height:48px;margin:-24px 0 0 -24px;background:#999}.cdk.on{background:#fff;border-color:#fff;box-shadow:0 0 0 6px #fff4}
</style>`);
$('#app').insertAdjacentHTML('beforeend', `<div id="cego" class="hide">
 <div class="ch"><div class="dots" id="cdots"></div><div class="mbtns"><button class="btn g sm" id="csnd" aria-label="Som"><i data-lucide="volume-2"></i></button><button class="btn g sm fsbtn" aria-label="Tela cheia"><i data-lucide="maximize"></i></button><button class="btn g sm" id="cset" aria-label="Conexão"><i data-lucide="settings"></i></button></div></div>
 <div id="cgrid"></div>
 <div class="modal-overlay ativo" id="cj"><div class="box modal"><h2>🙈 Macaco Cego</h2>
  <p class="s">Digite o código que aparece na tela do Surdo:</p>
  <input class="cd" id="cc" inputmode="numeric" maxlength="4" placeholder="0000">
  <p><button class="btn" id="cjb"><i data-lucide="plug"></i> Conectar</button></p><p class="note" id="cstat"></p>
  <p><button class="btn g sm" id="cclose"><i data-lucide="x"></i> Fechar</button> <button class="btn g sm" id="ctosurdo">🙉 Sou o Surdo</button></p></div></div>
</div>`);
$('#toMudo').insertAdjacentHTML('afterend', '<button class="btn small" id="toCego">🙈 Sou o Cego</button>');

/* --- painel cinza (sem cores nem letras) --- */
const st0 = () => ({ cuts: [], btn: [0, 1, 2, 3].map(() => ({ tap: 0, hold: false })), sw: [false, false, false], pin: 0 });
const cst = id => CS[id] || (CS[id] = st0());
const cdots = () => { $('#cdots').innerHTML = [0, 1, 2].map(i => `<div class="dot${i < CG.st ? ' x' : ''}"></div>`).join('') };
function cdraw() {
    cdots();
    if (!CG.mods.length) {
        $('#cgrid').innerHTML = `<div class="cwait">${CG.connected ? 'Conectado! Aguardando a bomba começar na tela do Surdo…' : 'Toque em Conexão e digite o código exibido na tela do Surdo.'}</div>`;
        return
    }
    $('#cgrid').innerHTML = CG.mods.map((m, i) => {
        if (m.s === 'd') return '<div class="cm d">✔ DESARMADO</div>';
        const s = cst(m.id); let b = '';
        if (m.t === 'FIOS') b = `<div class="cwr">${[1, 2, 3, 4, 5].map(n => `<button class="cw${s.cuts.includes(n) ? ' cut' : ''}" data-i="${i}" data-n="${n}" aria-label="fio ${n}"></button>`).join('')}</div>`;
        if (m.t === 'BOTÕES') b = `<div class="cwr">${s.btn.map((x, n) => `<button class="cb t${n}" data-i="${i}" data-n="${n}">${x.hold ? '3s' : x.tap || ''}</button>`).join('')}</div>`;
        if (m.t === 'INTERRUPTORES') b = `<div class="cwr">${s.sw.map((x, n) => `<button class="cs${x ? ' on' : ''}" data-i="${i}" data-n="${n}"></button>`).join('')}</div>`;
        if (m.t === 'DISCO') b = `<div class="cdisc">${[0, 1, 2, 3, 4, 5, 6, 7].map(k => { const a = (90 - 45 * k) * Math.PI / 180; return `<button class="cdk${k === 0 ? ' p1' : ''}${s.pin === k + 1 ? ' on' : ''}" style="left:${50 + 38 * Math.cos(a)}%;top:${50 - 38 * Math.sin(a)}%" data-i="${i}" data-n="${k + 1}"></button>` }).join('')}</div>`;
        return `<div class="cm">${b}<div class="row2"><button class="btn g" data-a="clr" data-i="${i}">Limpar</button><button class="btn ok" data-a="rdy" data-i="${i}">PRONTO!</button></div></div>`
    }).join('')
}
$('#cgrid').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; const i = +b.dataset.i, m = CG.mods[i]; if (!m || m.s === 'd') return; const s = cst(m.id), n = +b.dataset.n;
    if (b.classList.contains('cw')) { const k = s.cuts.indexOf(n); k < 0 ? s.cuts.push(n) : s.cuts.splice(k, 1); vib(20) }
    else if (b.classList.contains('cs')) { s.sw[n] = !s.sw[n]; vib(20) }
    else if (b.classList.contains('cdk')) { s.pin = s.pin === n ? 0 : n; vib(20) }
    else if (b.dataset.a === 'clr') CS[m.id] = st0();
    else if (b.dataset.a === 'rdy') { if (CG.k && CG.k.open) CG.k.send({ a: 'ready', i, id: m.id, act: s }); vib(40); return }
    else return;
    cdraw()
});
/* botão de apertar/segurar: toque curto = 1 aperto, 3 s segurando = "segurar" */
let H = null;
$('#cgrid').addEventListener('pointerdown', e => { const b = e.target.closest('.cb'); if (!b) return; H = { b, t: performance.now() }; b.classList.add('hold'); try { b.setPointerCapture(e.pointerId) } catch (x) { } });
const endH = () => { if (!H) return; const { b, t } = H; H = null; b.classList.remove('hold'); const m = CG.mods[+b.dataset.i]; if (!m || m.s === 'd') return; const x = cst(m.id).btn[+b.dataset.n]; if (performance.now() - t >= 3000) { x.hold = true; vib([60, 40, 60]) } else { x.tap++; vib(20) } cdraw() };
$('#cgrid').addEventListener('pointerup', endH); $('#cgrid').addEventListener('pointercancel', endH);
$('#cego').addEventListener('contextmenu', e => e.preventDefault());

/* --- conexão do Cego --- */
function cMsg(m) {
    if (m.r !== undefined) { if (m.r) { ding(); vib(60) } else { buzz(); vib([200, 80, 200]) } return }
    CG.connected = true;
    CG.st = m.st; CG.run = !!m.run; CG.end = Date.now() + m.rem * 1000;
    const sig = JSON.stringify(m.mods); if (sig !== CG.sig) { CG.sig = sig; CG.mods = m.mods; cdraw() } else cdots();
    if (m.res && CG.fx !== m.res) { CG.fx = m.res; m.res === 'win' ? win() : boom(); fx(m.res === 'win' ? 'win' : 'boom') } if (!m.res) CG.fx = null
}
$('#cjb').onclick = () => {
    A(); const c = $('#cc').value.trim();
    if (!window.Peer) { $('#cstat').textContent = 'A biblioteca de conexão não carregou.'; return }
    $('#cstat').textContent = 'Conectando...'; const p = new Peer();
    p.on('open', () => {
        const k = p.connect('desarme-' + c, { reliable: true, metadata: { role: 'cego' } }); CG.k = k;
        const to = setTimeout(() => { $('#cstat').textContent = 'Não encontrei esse código. Confira e tente de novo.' }, 9000);
        k.on('open', () => { clearTimeout(to); CG.connected = true; $('#cstat').textContent = 'Conectado ao Surdo ✓'; $('#cj').classList.add('hide'); cdraw() });
        k.on('data', cMsg);
        k.on('close', () => { CG.connected = false; CG.mods = []; CG.sig = ''; cdraw(); $('#cstat').textContent = 'Conexão perdida. Toque em Conectar de novo.'; $('#cj').classList.remove('hide') })
    });
    p.on('error', e => { $('#cstat').textContent = 'Erro: ' + e.type })
};
const cTick = () => { if (!CG.run) return; const q = Math.ceil((CG.end - Date.now()) / 1000); if (q !== CG.ls) { CG.ls = q; if (q > 0 && q <= 10) beep(q <= 3 ? 1500 : 1000, .1, .5) } };
$('#cset').onclick = () => $('#cj').classList.toggle('hide'); $('#cclose').onclick = () => $('#cj').classList.add('hide');
$('#csnd').onclick = () => { A(); muted = !muted; setVol(); $('#csnd').innerHTML = '<i data-lucide="' + (muted ? 'volume-x' : 'volume-2') + '"></i>'; ic() };
$('#ctosurdo').onclick = () => { location.hash = ''; location.reload() };
function toCego() { $('#surdo').classList.add('hide'); $('#cego').classList.remove('hide'); document.documentElement.classList.add('mu-on'); setInterval(cTick, 300); cdraw(); ic() }
$('#toCego').onclick = () => { toCego(); try { history.replaceState(null, '', '#cego') } catch (e) { } };
ic(); if (location.hash === '#cego') toCego();