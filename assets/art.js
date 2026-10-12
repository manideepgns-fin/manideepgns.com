// The section drawings: small constellations, drawn the same way on every page that has a [data-art] figure.
// Shared helpers (mk, reduce, rng) are globals so a page's own script can use them too.
const NS = 'http://www.w3.org/2000/svg', mk = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent.appendChild(n); return n }
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const rng = s => () => (s = s * 16807 % 2147483647) / 2147483647

/* Each section's drawing: stars and lines in local units, every name printed, nothing behind a hover */
const star = (svg, x, y, lit) => { mk('circle', { class: 'ha' + (lit ? ' lit' : ''), cx: x, cy: y, r: lit ? 26 : 14 }, svg); mk('circle', { class: 'st' + (lit ? ' lit' : ''), cx: x, cy: y, r: lit ? 4 : 2.6 }, svg) }
const line = (svg, [x1, y1], [x2, y2]) => mk('line', { class: 'ln', x1, y1, x2, y2 }, svg)
const text = (svg, x, y, s, size, cls = '', anchor = 'middle') => { mk('text', { class: 'tx ' + cls, x, y, 'text-anchor': anchor, 'font-size': size }, svg).textContent = s }
const ART = {
  countries(svg) {
    svg.setAttribute('viewBox', '0 0 520 300')
    const P = [['The US', 70, 150], ['The UK', 210, 82], ['The Middle East', 330, 178], ['India', 450, 128]]
    P.slice(1).forEach((p, i) => line(svg, [P[i][1], P[i][2]], [p[1], p[2]]))
    P.forEach(([n, x, y]) => { star(svg, x, y); text(svg, x, y + 30, n, 15, 'it') })
  },
  loop(svg) {
    const w = svg.parentNode.clientWidth, wide = w >= 700, k = 1000 / Math.max(w, 1) // labels hold about 15px whatever the column width
    const L = ['I describe it', 'Claude Code builds it', 'I review every change', 'It ships']
    if (wide) {
      svg.setAttribute('viewBox', '0 0 1000 190')
      const X = [90, 360, 630, 900], y = 70
      for (let i = 1; i < 4; i++) line(svg, [X[i - 1], y], [X[i], y])
      mk('path', { class: 'ln back', d: `M ${X[3]} ${y + 12} C ${X[3]} 175, ${X[0]} 175, ${X[0]} ${y + 12}` }, svg)
      X.forEach((x, i) => { star(svg, x, y, i === 2); text(svg, x, y - 30, L[i], Math.max(19, 15 * k), 'it') })
      text(svg, 495, 182, 'and back to the next problem', Math.max(13, 12 * k))
    } else {
      svg.setAttribute('viewBox', '0 0 340 330')
      const Y = [30, 110, 190, 270], x = 40
      for (let i = 1; i < 4; i++) line(svg, [x, Y[i - 1]], [x, Y[i]])
      Y.forEach((y, i) => { star(svg, x, y, i === 2); text(svg, x + 28, y + 6, L[i], 18, 'it', 'start') })
      text(svg, x + 28, 318, 'and back to the next problem', 13, '', 'start')
    }
  },
  flow(svg) {
    const wide = svg.parentNode.clientWidth >= 380, rnd = rng(11)
    svg.setAttribute('viewBox', wide ? '0 0 560 400' : '0 0 420 460')
    const T = wide ? [[420, 95], [330, 252], [510, 252]] : [[210, 205], [110, 380], [310, 380]]
    const cx = (T[0][0] + T[1][0] + T[2][0]) / 3, cy = (T[0][1] + T[1][1] + T[2][1]) / 3
    const SRC = ['Zoho Books', 'Salesforce', 'Stripe', 'Ramp', 'Google Sheets', 'Gmail', 'Metabase']
    SRC.forEach((name, i) => {
      const [x, y] = wide ? [110 + (i % 2) * 22, 50 + i * 50] : [30 + i * 60, 40 + (i % 2) * 30]
      const d = wide ? `M ${x} ${y} C ${x + 120} ${y}, ${cx - 110} ${cy}, ${cx - 20} ${cy}` : `M ${x} ${y} C ${x} ${y + 70}, ${cx} ${cy - 100}, ${cx} ${cy - 16}`
      mk('path', { class: 'flow', d }, svg)
      if (!reduce) for (let k = 0; k < 2; k++) {
        const dot = mk('circle', { class: 'packet', r: 1.8 }, svg)
        mk('animateMotion', { dur: `${(3.4 + rnd() * 2.2).toFixed(2)}s`, begin: `${(k * 1.9 + rnd() * 2).toFixed(2)}s`, repeatCount: 'indefinite', path: d }, dot)
      }
      mk('circle', { class: 'st', cx: x, cy: y, r: 2.2 }, svg)
      if (wide) text(svg, x - 10, y + 4.5, name, 13, '', 'end')
    })
    if (!wide) text(svg, 210, 18, 'Zoho, Salesforce, Stripe and more', 14)
    ;[[T[0], T[1]], [T[1], T[2]], [T[2], T[0]]].forEach(([p, q]) => line(svg, p, q))
    T.forEach(([x, y], i) => { star(svg, x, y, true)
      text(svg, i === 0 ? x : i === 1 ? x - 14 : x + 14, i === 0 ? y - 20 : y + 6, ['Operate', 'Analyse', 'Report'][i], 19, 'it', i === 0 ? 'middle' : i === 1 ? 'end' : 'start') })
    text(svg, cx, cy + 9, 'Atlance', 26, 'big')
    text(svg, cx, T[1][1] + 28, 'one database underneath', 13)
  },
}
const drawArt = () => document.querySelectorAll('[data-art]').forEach(f => { const svg = f.querySelector('svg'); svg.replaceChildren(); ART[f.dataset.art](svg) })
