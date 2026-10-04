// The sky behind every page. Stars sit in 3D; scrolling flies you forward through them
// (the faster you scroll, the longer the streaks). Reads scroll once per frame; no scroll listener.
(() => {
  const cv = document.querySelector('canvas.stars')
  if (!cv) return
  const cx = cv.getContext('2d')
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const flight = cv.dataset.flight !== 'calm'
  let W, H, DPR, lastY = scrollY, speed = 0
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  const spawn = (s, far) => {
    s.x = (Math.random() - .5) * 2.4; s.y = (Math.random() - .5) * 2.4
    s.z = far ? 1 : .05 + Math.random() * .95; s.pz = s.z
    s.warm = Math.random() < .16; s.r = .5 + Math.random() * .9; s.p = Math.random() * 6.28
  }
  const stars = Array.from({ length: 900 }, () => { const s = {}; spawn(s, false); return s })
  function size() {
    DPR = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight
    cv.width = W * DPR; cv.height = H * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0)
  }
  function frame(t) {
    const y = scrollY, v = y - lastY; lastY = y
    const gain = flight ? .00045 : .00012
    speed += ((reduce ? 0 : Math.min(Math.abs(v), 120) * gain) - speed) * .12
    const drift = reduce ? 0 : .00018
    pointer.x += (pointer.tx - pointer.x) * .05; pointer.y += (pointer.ty - pointer.y) * .05
    const f = Math.min(W, H) * .62, ox = W / 2 - pointer.x * 30, oy = H / 2 - pointer.y * 20
    cx.clearRect(0, 0, W, H)
    for (const s of stars) {
      s.pz = s.z; s.z -= drift + speed
      if (s.z <= .02) { spawn(s, true); s.pz = s.z }
      const sx = ox + s.x / s.z * f, sy = oy + s.y / s.z * f
      if (sx < -50 || sx > W + 50 || sy < -50 || sy > H + 50) { if (s.z < .5) { spawn(s, true); s.pz = s.z } continue }
      const near = 1 - s.z, tw = reduce ? .85 : .6 + .4 * Math.sin(t / 900 + s.p)
      const a = Math.min(1, (.15 + near * .95) * tw), col = s.warm ? '255,226,189' : '238,242,255'
      if (speed > .002) {
        const px = ox + s.x / s.pz * f, py = oy + s.y / s.pz * f
        cx.strokeStyle = `rgba(${col},${a})`; cx.lineWidth = s.r * (.4 + near * 1.6)
        cx.beginPath(); cx.moveTo(px, py); cx.lineTo(sx, sy); cx.stroke()
      } else {
        cx.fillStyle = `rgba(${col},${a})`
        cx.beginPath(); cx.arc(sx, sy, s.r * (.35 + near * 1.3), 0, 6.283); cx.fill()
      }
    }
    if (window.onSkyFrame) window.onSkyFrame(y, H)
    requestAnimationFrame(frame)
  }
  addEventListener('resize', size)
  addEventListener('pointermove', e => { pointer.tx = e.clientX / W - .5; pointer.ty = e.clientY / H - .5 })
  size(); requestAnimationFrame(frame)
})()
