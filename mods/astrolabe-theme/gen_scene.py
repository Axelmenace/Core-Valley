"""Generates hooks/scene.js: the Astrolabe backdrop as one pure-vector SVG string."""
import math
import random
import sys

OUT = sys.argv[1]
rnd = random.Random(1172)  # fixed seed, so the sky is the same every build

W, H = 1600, 1000
CX, CY, R = 1415, 165, 262  # the instrument, pinned to the top-right corner


def f(n):
    s = f"{n:.1f}"
    return s[:-2] if s.endswith(".0") else s


def pol(r, deg, cx=CX, cy=CY):
    a = math.radians(deg - 90)
    return cx + r * math.cos(a), cy + r * math.sin(a)


parts = []
add = parts.append

# ---- style -------------------------------------------------------------
STYLE = f"""
.sky{{fill:#eceef3}}
.n1{{stop-color:#0b6f7c;stop-opacity:.10}}
.n2{{stop-color:#8a6216;stop-opacity:.09}}
.n0{{stop-color:#eceef3;stop-opacity:0}}
.st{{fill:#5d4a22}}
.stars{{opacity:.42}}
.lines{{stroke:#8a6216;stroke-width:.8;fill:none;opacity:.28}}
.equator{{stroke:#0b6f7c;stroke-width:1;fill:none;opacity:.22;stroke-dasharray:2 7}}
.astro{{opacity:.42}}
.ink{{stroke:#8a6216;fill:none}}
.inkf{{fill:#8a6216}}
.glow{{stroke:#0b6f7c;fill:none}}
.glowf{{fill:#0b6f7c}}
@media (prefers-color-scheme: dark){{
.sky{{fill:#080a14}}
.n1{{stop-color:#6fd6da;stop-opacity:.07}}
.n2{{stop-color:#d8ac5d;stop-opacity:.07}}
.n0{{stop-color:#080a14;stop-opacity:0}}
.st{{fill:#fff1d6}}
.stars{{opacity:.85}}
.lines{{stroke:#d8ac5d;opacity:.22}}
.equator{{stroke:#6fd6da;opacity:.2}}
.astro{{opacity:.5}}
.ink{{stroke:#d8ac5d}}
.inkf{{fill:#d8ac5d}}
.glow{{stroke:#6fd6da}}
.glowf{{fill:#6fd6da}}
}}
@media (max-aspect-ratio: 4/5){{
.astro{{transform-box:view-box;transform-origin:{W}px 0px;transform:scale(.62)}}
.equator{{display:none}}
}}
.rete{{transform-box:view-box;transform-origin:{CX}px {CY}px;animation:turn 720s linear infinite}}
.rule{{transform-box:view-box;transform-origin:{CX}px {CY}px;animation:turn 1300s linear infinite reverse}}
.tw1{{animation:tw 11s ease-in-out infinite}}
.tw2{{animation:tw 14s ease-in-out -5s infinite}}
.tw3{{animation:tw 17s ease-in-out -9s infinite}}
@keyframes turn{{from{{transform:rotate(0deg)}}to{{transform:rotate(360deg)}}}}
@keyframes tw{{0%,100%{{opacity:1}}50%{{opacity:.35}}}}
"""

add(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
    f'preserveAspectRatio="xMaxYMin slice">'
)
add(f"<style>{STYLE.strip()}</style>")
add(
    "<defs>"
    '<radialGradient id="nebA"><stop offset="0" class="n1"/><stop offset="1" class="n0"/></radialGradient>'
    '<radialGradient id="nebB"><stop offset="0" class="n2"/><stop offset="1" class="n0"/></radialGradient>'
    "</defs>"
)
add(f'<rect class="sky" width="{W}" height="{H}"/>')
add('<ellipse cx="330" cy="260" rx="520" ry="330" fill="url(#nebA)"/>')
add('<ellipse cx="1180" cy="760" rx="560" ry="300" fill="url(#nebB)"/>')

# ---- the celestial equator, one long faint arc across the sky ----------
add(
    f'<path class="equator" d="M -40 {f(H * 0.62)} Q {f(W * 0.45)} {f(H * 0.05)} {f(CX)} {f(CY + R * 0.53)}"/>'
)

# ---- stars -------------------------------------------------------------
stars = []
while len(stars) < 150:
    x, y = rnd.uniform(0, W), rnd.uniform(0, H)
    if math.hypot(x - CX, y - CY) < R + 18:
        continue  # leave the instrument its own sky
    r = rnd.choice([0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.3, 1.5, 1.8])
    stars.append((x, y, r))

add('<g class="stars">')
groups = {"": [], "tw1": [], "tw2": [], "tw3": []}
for i, (x, y, r) in enumerate(stars):
    key = ["", "", "tw1", "", "tw2", "", "tw3"][i % 7]
    base = 0.55 + 0.45 * rnd.random()
    groups[key].append(f'<circle class="st" cx="{f(x)}" cy="{f(y)}" r="{f(r)}" opacity="{base:.2f}"/>')
for key, items in groups.items():
    if key:
        add(f'<g class="{key}">' + "".join(items) + "</g>")
    else:
        add("".join(items))

# a few brighter four-pointed stars
for x, y, s in [(212, 138, 7), (640, 92, 5.5), (96, 520, 5), (1010, 420, 6), (470, 690, 4.5), (1500, 640, 5.5)]:
    d = (
        f"M {f(x)} {f(y - s)} Q {f(x + s * 0.18)} {f(y - s * 0.18)} {f(x + s)} {f(y)} "
        f"Q {f(x + s * 0.18)} {f(y + s * 0.18)} {f(x)} {f(y + s)} "
        f"Q {f(x - s * 0.18)} {f(y + s * 0.18)} {f(x - s)} {f(y)} "
        f"Q {f(x - s * 0.18)} {f(y - s * 0.18)} {f(x)} {f(y - s)} Z"
    )
    add(f'<path class="st tw2" d="{d}"/>')
add("</g>")

# ---- two invented constellations, upper left ---------------------------
add('<g class="lines">')
for pts in (
    [(150, 210), (212, 138), (298, 176), (352, 118), (430, 150)],
    [(560, 230), (640, 92), (716, 180), (640, 258), (560, 230)],
):
    add('<polyline points="' + " ".join(f"{f(a)},{f(b)}" for a, b in pts) + '"/>')
add("</g>")
add('<g class="stars">')
for pts in ([(150, 210), (298, 176), (352, 118), (430, 150)], [(560, 230), (716, 180), (640, 258)]):
    for a, b in pts:
        add(f'<circle class="st" cx="{a}" cy="{b}" r="1.8"/>')
add("</g>")

# ---- the astrolabe -----------------------------------------------------
add('<g class="astro">')

# mater: the outer rings and the degree scale
add(f'<circle class="ink" cx="{CX}" cy="{CY}" r="{R}" stroke-width="2"/>')
add(f'<circle class="ink" cx="{CX}" cy="{CY}" r="{R - 12}" stroke-width="1"/>')
add(f'<circle class="ink" cx="{CX}" cy="{CY}" r="{R - 30}" stroke-width=".8"/>')
ticks = []
for i in range(180):
    deg = i * 2
    inner = R - (24 if i % 15 == 0 else 18 if i % 5 == 0 else 12)
    x1, y1 = pol(inner, deg)
    x2, y2 = pol(R, deg)
    ticks.append(f"M{f(x1)} {f(y1)}L{f(x2)} {f(y2)}")
add(f'<path class="ink" stroke-width=".7" d="{"".join(ticks)}"/>')

# the hour ring: a small lozenge every fifteen degrees
loz = []
for i in range(24):
    deg = i * 15
    x, y = pol(R - 40, deg)
    s = 4 if i % 6 == 0 else 2.6
    a = math.radians(deg - 90)
    ux, uy = math.cos(a), math.sin(a)
    vx, vy = -uy, ux
    loz.append(
        f"M{f(x + ux * s * 1.6)} {f(y + uy * s * 1.6)}L{f(x + vx * s)} {f(y + vy * s)}"
        f"L{f(x - ux * s * 1.6)} {f(y - uy * s * 1.6)}L{f(x - vx * s)} {f(y - vy * s)}Z"
    )
add(f'<path class="inkf" d="{"".join(loz)}"/>')

# the plate: tropics, equator, horizon and almucantars
add(f'<circle class="ink" cx="{CX}" cy="{CY}" r="205" stroke-width=".8"/>')
add(f'<circle class="glow" cx="{CX}" cy="{CY}" r="148" stroke-width="1"/>')
add(f'<circle class="ink" cx="{CX}" cy="{CY}" r="98" stroke-width=".8"/>')
for k in range(1, 8):
    rr = 150 - k * 17
    oy = -k * 13
    add(
        f'<circle class="ink" cx="{CX}" cy="{f(CY + oy - 20)}" r="{f(rr)}" stroke-width=".55" opacity=".8"/>'
    )
add(f'<path class="ink" stroke-width=".8" d="M{CX - 205} {CY}H{CX + 205}M{CX} {CY - 205}V{CY + 205}"/>')

# the rete: ecliptic ring, fretwork and star pointers, turning slowly
add('<g class="rete">')
add(f'<circle class="glow" cx="{CX}" cy="{CY - 52}" r="150" stroke-width="2.2"/>')
add(f'<circle class="glow" cx="{CX}" cy="{CY - 52}" r="138" stroke-width=".7"/>')
add(f'<circle class="ink" cx="{CX}" cy="{CY}" r="196" stroke-width="1.6"/>')
fret = []
for deg in (0, 90, 180, 270):
    x1, y1 = pol(98, deg)
    x2, y2 = pol(196, deg)
    fret.append(f"M{f(x1)} {f(y1)}L{f(x2)} {f(y2)}")
add(f'<path class="ink" stroke-width="1.4" d="{"".join(fret)}"/>')
pointers = []
tips = []
for deg, rr in [(24, 176), (63, 120), (112, 168), (151, 132), (203, 182), (238, 112), (291, 158), (332, 124)]:
    bx, by = pol(196, deg - 7)
    ex, ey = pol(196, deg + 7)
    tx, ty = pol(rr, deg)
    mx, my = pol((196 + rr) / 2 + 4, deg + 3)
    pointers.append(f"M{f(bx)} {f(by)}Q{f(mx)} {f(my)} {f(tx)} {f(ty)}Q{f(mx)} {f(my)} {f(ex)} {f(ey)}Z")
    tips.append(f'<circle class="glowf" cx="{f(tx)}" cy="{f(ty)}" r="3.2"/>')
add(f'<path class="inkf" opacity=".55" d="{"".join(pointers)}"/>')
add("".join(tips))
add("</g>")

# the rule: a long alidade, turning the other way more slowly still
add('<g class="rule">')
a1x, a1y = pol(R - 6, 300)
a2x, a2y = pol(R - 6, 120)
w1x, w1y = pol(7, 30)
w2x, w2y = pol(7, 210)
add(
    f'<path class="inkf" opacity=".7" d="M{f(a1x)} {f(a1y)}L{f(w1x)} {f(w1y)}L{f(a2x)} {f(a2y)}L{f(w2x)} {f(w2y)}Z"/>'
)
add("</g>")
add(f'<circle class="inkf" cx="{CX}" cy="{CY}" r="6.5"/>')
add(f'<circle class="glowf" cx="{CX}" cy="{CY}" r="2.4"/>')
add("</g>")
add("</svg>")

svg = "".join(parts)
assert "\\" not in svg and "&" not in svg and "<!" not in svg and "`" not in svg and "${" not in svg

with open(OUT, "w") as fh:
    fh.write("// Generated: the Astrolabe backdrop, a pure-vector star chart and a slowly turning\n")
    fh.write("// astrolabe pinned to the top-right corner. Light and dark both live in its <style>.\n")
    fh.write("export const SCENE = `" + svg + "`\n")
print(f"{len(svg)} characters")
