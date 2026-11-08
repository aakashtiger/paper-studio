/* THE RUN — s08. Day 6, the hideout.

   He turns the wall calendar from five to six on "calendar,"; on "door" a
   knock lands — two feet fill the gap under the door, the bulb dips, and he
   freezes with one hand half raised, choosing not to answer. The banded money
   and the packed bag stay on the table; his flat cap hangs on the chair. No
   knife: the murder is three days behind him. */

/* One page of "THE RUN" taped over the window. */
function newsPage(ctx, x, y, w, h, rot, tone) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  paper(ctx, () => tornRectPath(ctx, -w / 2, -h / 2, w, h, 3, 9), { fill: tone, edge: C.rgba(INK, 0.55), edgeW: 2, shadow: C.rgba(INK, 0.3), sx: 5, sy: 8 });
  const head = Math.max(20, h * 0.11);
  ctx.fillStyle = "#B8382A"; ctx.fillRect(-w / 2, -h / 2, w, head);
  // a newspaper masthead, not the film's title: the paper is a prop in the room
  TY.text(ctx, "DAILY", -w / 2 + 12, -h / 2 + head * 0.72, Math.min(20, head * 0.8), { family: "Archivo Black", color: PAL.cream, letter: 1 });
  // body lines, split by a column rule
  ctx.strokeStyle = C.rgba(INK, 0.35); ctx.lineWidth = 1.4;
  const top = -h / 2 + head + 12;
  const rows = Math.max(3, Math.floor((h - head - 30) / 16));
  for (let i = 0; i < rows; i++) {
    const yy = top + i * 16;
    if (yy > h / 2 - 12) break;
    ctx.beginPath(); ctx.moveTo(-w / 2 + 10, yy); ctx.lineTo(w / 2 - 10, yy); ctx.stroke();
  }
  ctx.strokeStyle = C.rgba(INK, 0.22); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, top + 4); ctx.lineTo(0, h / 2 - 10); ctx.stroke();
  // pins at the corners
  ctx.fillStyle = "#B8382A";
  for (const [px, py] of [[-w / 2 + 9, -h / 2 + 9], [w / 2 - 9, -h / 2 + 9], [-w / 2 + 9, h / 2 - 9], [w / 2 - 9, h / 2 - 9]]) {
    ctx.beginPath(); ctx.arc(px, py, 4.5, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

/* Four overlapping pages paper the whole window, edge to edge, without
   covering the wanted poster, the shelf or the clock. Shared by s08 and s09. */
function windowPaperFull(ctx) {
  newsPage(ctx, 1345, 285, 230, 250, -0.040, "#E8DCC4");
  newsPage(ctx, 1535, 280, 250, 240, 0.050, "#E0D2B4");
  newsPage(ctx, 1400, 410, 250, 170, -0.030, "#EFE4CC");
  newsPage(ctx, 1550, 405, 220, 180, 0.060, "#E4D6B8");
}

/* Kept for s15, which still carries the old hat under the detective's arm.
   s08–s14 use the rig's flat cap and flatCapProp() instead. */
function grayHat(ctx, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  paper(ctx, () => { ctx.beginPath(); ctx.ellipse(0, 0, 100, 16, 0, 0, TAU); }, { fill: "#5F5B54", edge: C.rgba(INK, 0.72), edgeW: 2 });
  paper(ctx, () => roundRectPath(ctx, -52, -56, 104, 56, 11), { fill: "#6A665E", edge: C.rgba(INK, 0.72), edgeW: 2 });
  ctx.fillStyle = "#3E3A34"; ctx.fillRect(-52, -12, 104, 7);
  ctx.restore();
}

/* A soft grip bag, drawn as a bag and not a bundle: a canvas body sitting on
   (x,y), two straps, a buckled pocket, a packed shirt and a handle. `open`
   0..1 lifts the flap, so the bag can be shown packed on screen. */
function bagProp(ctx, x, y, s = 1, rot = 0, o = {}) {
  const open = C.clamp(o.open || 0);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (o.shadow !== false) shadowEllipse(ctx, 0, 2, 66, 9, 0.26);
  // the shirt, visible in the mouth of the bag while the flap is up
  if (open > 0.01) {
    ctx.save(); ctx.globalAlpha = open;
    paper(ctx, () => tornRectPath(ctx, -30, -114, 60, 32, 2, 5), { fill: "#D9D2C3", edge: C.rgba(INK, 0.5), edgeW: 1.4 });
    ctx.fillStyle = "#B9AE97"; ctx.fillRect(-25, -108, 50, 7);
    ctx.restore();
  }
  // the body: a soft trapezoid, wider at the top
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-58, -96); ctx.quadraticCurveTo(-66, -60, -60, -8);
    ctx.quadraticCurveTo(-56, 0, -44, 0);
    ctx.lineTo(44, 0); ctx.quadraticCurveTo(56, 0, 60, -8);
    ctx.quadraticCurveTo(66, -60, 58, -96); ctx.closePath();
  }, { fill: "#4A3428", edge: PAL.ink, edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.32), sx: 4, sy: 7 });
  // the front panel, so the bag has a face the eye can read
  paper(ctx, () => roundRectPath(ctx, -44, -86, 88, 72, 8), { fill: "#5A4030", edge: C.rgba(PAL.ink, 0.55), edgeW: 1.6 });
  ctx.strokeStyle = C.rgba("#8A6A4A", 0.35); ctx.lineWidth = 1.2;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-36, -70 + i * 18); ctx.lineTo(36, -70 + i * 18); ctx.stroke(); }
  // the two vertical straps
  for (const sx of [-1, 1]) {
    ctx.fillStyle = "#2E2318"; ctx.fillRect(sx * 34 - 4.5, -96, 9, 92);
    ctx.fillStyle = C.rgba("#8A6A4A", 0.5); ctx.fillRect(sx * 34 - 2.5, -94, 3, 86);
  }
  // the buckle on the right strap
  ctx.fillStyle = "#C8A86A"; ctx.fillRect(24, -54, 15, 12);
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.4; ctx.strokeRect(24, -54, 15, 12);
  // the top flap, hinged at the back edge
  ctx.save(); ctx.translate(0, -96); ctx.rotate(-open * 1.15);
  paper(ctx, () => roundRectPath(ctx, -56, -18, 112, 26, 6), { fill: "#5F4632", edge: PAL.ink, edgeW: 2.2, shadow: C.rgba(PAL.ink, 0.28), sx: 2, sy: 4 });
  ctx.fillStyle = C.rgba("#8A6A4A", 0.5); ctx.fillRect(-52, -14, 104, 4);
  ctx.restore();
  // the near handle, in front, so there is something for the hand to hold
  ctx.strokeStyle = "#6A4A32"; ctx.lineWidth = 6; ctx.lineCap = "round";
  ctx.beginPath(); ctx.arc(0, -98, 30, Math.PI, TAU); ctx.stroke();
  ctx.strokeStyle = C.rgba("#C8B8A0", 0.5); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, -98, 30, Math.PI * 1.08, TAU * 0.92); ctx.stroke();
  for (const sx of [-1, 1]) {
    ctx.fillStyle = "#2E2318"; ctx.fillRect(sx * 27 - 5, -104, 10, 16);
    ctx.fillStyle = "#C8A86A"; ctx.beginPath(); ctx.arc(sx * 27, -98, 2.6, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

/* Where man() draws the grey flat cap for a pose, in root-local units. The rig
   puts the brim at head-frame (0,-680); this replays the head group, the waist
   lean and the yaw so a prop cap can sit exactly where the painted one does. */
function flatCapRig(pose) {
  const yaw = pose.yaw || 0, lean = pose.lean || 0, bounce = pose.bounce || 0;
  const A = (pose.headTilt || 0) + (pose.headTurn || 0) * 0.16 + yaw * 0.1;
  let x = 0, y = -680 + 530;
  const rx = x * Math.cos(A) - y * Math.sin(A) + yaw * 10;
  const ry = x * Math.sin(A) + y * Math.cos(A) - 530;
  let yy = ry + 280;
  let tx = rx * Math.cos(lean) - yy * Math.sin(lean);
  let ty = rx * Math.sin(lean) + yy * Math.cos(lean);
  const k = Math.abs(yaw);
  tx = tx * (1 - k * 0.12) - yaw * 0.06 * ty;
  return { dx: tx, dy: ty - 280 + bounce, rot: A + lean };
}

/* The rig's flat cap, placed on the head for an arbitrary pose. */
function flatCapAt(ctx, x, y, s, pose, tilt = 0) {
  const r = flatCapRig(pose);
  flatCapProp(ctx, x + s * r.dx, y + s * r.dy, s, r.rot + tilt);
}

/* The hand position man() really draws, including the waist lean and yaw.
   manHand() ignores both, so a prop anchored with it floats as soon as the
   body leans; every hand prop in s08–s14 uses this instead. */
function armHandAt(x, y, s, pose, side) {
  const yaw = pose.yaw || 0, lean = pose.lean || 0, bounce = pose.bounce || 0;
  const arm = side === "L" ? (pose.armL || [0.28, -0.35]) : (pose.armR || [-0.32, 0.45]);
  const sx = side === "L" ? -80 : 80;
  const a1 = arm[0], a2 = a1 + arm[1];
  const wx = sx - Math.sin(a1) * 104 - Math.sin(a2) * 88;
  const wy = -500 + Math.cos(a1) * 104 + Math.cos(a2) * 88;
  let px = wx, py = wy + 280;
  let rx = px * Math.cos(lean) - py * Math.sin(lean);
  let ry = px * Math.sin(lean) + py * Math.cos(lean);
  const k = Math.abs(yaw);
  rx = rx * (1 - k * 0.12) - yaw * 0.06 * ry;
  return [x + s * rx, y + s * (ry - 280 + bounce)];
}

/* The chair s07, s08 and s09 share, so the room does not rearrange itself
   between shots. A dark frame and a red seat keep it reading as a chair, and
   the grey flat cap hangs on its lowered top rail. */
function roomChair(ctx, t) {
  shadowEllipse(ctx, 700, 900, 92, 12, 0.26);
  paper(ctx, () => roundRectPath(ctx, 625, 700, 150, 22, 3), { fill: "#3E2C1E", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 0, sy: 6 });
  ctx.fillStyle = "#7A3A2A"; ctx.fillRect(630, 704, 140, 14);
  ctx.fillStyle = "#4A3428"; ctx.fillRect(637, 722, 16, 178); ctx.fillRect(747, 722, 16, 178);
  ctx.fillStyle = "#3E2C1E"; ctx.fillRect(625, 560, 20, 140); ctx.fillRect(755, 560, 20, 140);
  ctx.fillStyle = "#3E2C1E"; ctx.fillRect(625, 560, 150, 16);
  ctx.fillStyle = "#4A3428"; ctx.fillRect(625, 620, 150, 10);
  ctx.strokeStyle = C.rgba(INK, 0.25); ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(625, 632); ctx.lineTo(775, 632); ctx.stroke();
}

scene({
  id: "s08", start: 19.7, end: 22.22, line: 7, cast: "MAN",
  draw(t, lt, dur) {
    const calT = syncLocal("s08", "e0");    // 0.20 — "calendar,"
    const doorT = syncLocal("s08", "e1");   // 1.00 — "door"
    const heT = syncLocal("s08", "e2");     // 1.36 — "he"
    const didT = syncLocal("s08", "e3");    // 1.52 — "did"
    const answerT = syncLocal("s08", "e4"); // 1.70 — "answer."

    // Two feet arrive under the door on the knock and leave after "answer".
    const knockK = C.ease(C.clamp((lt - doorT + 0.03) / 0.14)) *
                   (1 - C.ease(C.clamp((lt - (answerT + 0.10)) / 0.34)));
    // The bulb holds, dips on the knock, dips again on "answer", and never dies.
    const dip = Math.exp(-Math.pow((lt - doorT) / 0.09, 2));
    const dip2 = Math.exp(-Math.pow((lt - answerT) / 0.12, 2));
    const flick = C.clamp(1 - 0.58 * dip - 0.34 * dip2 - 0.07 * Math.abs(Math.sin(t * 23.1)), 0.22, 1);

    // closer and from his side of the room, so the room is a different place
    // from s07's wide: the door is at the frame's left edge and he is the subject
    setCam(
      C.kf(lt, [[0, 1010], [dur, 1036]]),
      C.kf(lt, [[0, 512], [dur, 500]]),
      C.kf(lt, [[0, 1.14], [dur, 1.18]]),
      C.kf(lt, [[0, 0.006], [dur, -0.010]]),
      1.0, t
    );
    ctx.fillStyle = "#32261C"; ctx.fillRect(0, 0, W, H);
    beginCam(ctx);
    hideoutSet(ctx, t, { flicker: flick, doorShadow: knockK, clock: { h: 5, m: 40 } });
    windowPaperFull(ctx);

    // the wall calendar: page five lifts away, six is left on the wall
    const turn = C.ease(C.clamp((lt - calT) / 0.45));
    calendarProp(ctx, 960, 290, 1.0, 6, t, turn, { oldDay: 5 });
    if (turn > 0.55) {
      const k = C.clamp((lt - calT - 0.35) / 0.55);
      ctx.save(); ctx.globalAlpha = 1 - k;
      ctx.translate(960 + 56 * k, 290 + 196 * k); ctx.rotate(0.9 * k + 0.15);
      paper(ctx, () => roundRectPath(ctx, -30, -42, 60, 84, 3), { fill: "#F2E8D5", edge: PAL.ink, edgeW: 1.6, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 5 });
      TY.text(ctx, "5", 0, 16, 40, { family: "Archivo Black", color: PAL.ink, align: "center" });
      ctx.restore();
    }

    // the chair, with the grey flat cap hung on its top rail — he is bare-headed
    roomChair(ctx, t);
    // the cap stays at 760 on the rail, the spot s07 sets it down on and s09
    // lifts it from; the near arm is raised clear of it (see the freeze pose)
    flatCapProp(ctx, 760, 574, 0.82, -0.06);

    // the banded money stays on the table: notes, 100s, the red band
    moneyProp(ctx, 560, 605, 0.9, -0.04);

    // the bag, packed for the morning, at the table's right edge
    bagProp(ctx, 940, 636, 0.8, -0.03, { open: 0.28 });

    // he reaches the calendar with his right hand, then the knock lands and he
    // steps back off the door, so the chair and the cap stay in clear view
    const step = C.ease(C.clamp((lt - doorT) / 0.26));
    const x = 780 + 70 * step + 12 * C.ease(C.clamp((lt - (answerT + 0.22)) / 0.40));
    const mp = poseAt(lt, [
      [0, { ...MAN_POSES.stand, armR: [-2.20, 0.30], armL: [0.10, -0.08], headTilt: -0.03, headTurn: 0.02, lean: 0.02 }],
      [calT - 0.04, { ...MAN_POSES.stand, armR: [-2.90, 0.10], armL: [0.10, -0.08], headTilt: -0.05, headTurn: 0.04, lean: 0.01 }],
      [calT + 0.42, { ...MAN_POSES.stand, armR: [-2.95, 0.10], armL: [0.10, -0.08], headTilt: -0.06, headTurn: 0.06, lean: 0.01 }],
      [calT + 0.72, { ...MAN_POSES.stand, armR: [-1.20, 0.60], armL: [0.10, -0.08], headTilt: 0.02, headTurn: 0.02, lean: 0.03 }],
      [doorT - 0.08, { ...MAN_POSES.stand, armR: [-0.10, 0.10], armL: [0.30, 0.30], headTilt: 0.02, headTurn: -0.10, lean: 0.02 }],
      // one hand half raised, palm toward the door: this is the freeze the
      // script asks for, and it lifts the near sleeve clear of the cap at 760
      [doorT + 0.12, { ...MAN_POSES.stand, armL: [0.50, 0.80], armR: [-0.05, 0.00], headTilt: 0.04, headTurn: -0.52, yaw: -0.10, lean: 0.00, footL: [-44, -8], footR: [22, -8] }],
      [heT, { ...MAN_POSES.stand, armL: [0.80, 1.20], armR: [-0.08, 0.02], headTilt: 0.05, headTurn: -0.60, yaw: -0.12, lean: -0.01, footL: [-44, -8], footR: [22, -8] }],
      [answerT, { ...MAN_POSES.stand, armL: [0.80, 1.20], armR: [-0.08, 0.02], headTilt: 0.04, headTurn: -0.64, yaw: -0.13, lean: -0.01, footL: [-44, -8], footR: [22, -8] }],
      [answerT + 0.26, { ...MAN_POSES.stand, armL: [0.42, -0.50], headTilt: 0.03, headTurn: -0.56, yaw: -0.10, lean: 0.01, footL: [-40, -8], footR: [26, -8] }],
      [dur, { ...MAN_POSES.stand, armL: [0.16, -0.12], headTilt: 0.02, headTurn: -0.50, yaw: -0.08, lean: 0.02, footL: [-38, -8], footR: [28, -8] }],
    ]);
    // a held body, not a switched-off one: breath and a tremble under the bulb
    mp.bounce += Math.sin(t * 5.9) * 0.8;
    mp.sway += 0.9 * Math.sin(t * 1.9);
    if (lt > doorT) mp.armL[0] += 0.02 * Math.sin(t * 9.3);
    man(ctx, x, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, -1] } },
        { t: calT - 0.08, f: { eyes: "wide", mouth: "o", look: [1, -1] } },
        { t: calT + 0.50, f: { eyes: "normal", mouth: "flat", look: [1, -1] } },
        { t: doorT, f: { eyes: "wide", mouth: "o", look: [-1, 0] } },
        { t: heT, f: { eyes: "wide", mouth: "flat", look: [-1, 0] } },
        { t: answerT, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
      ]),
      role: "thief", hat: null, costume: "coat", hair: "#1E1610",
    });

    // the knock: three raps on the door frame, and the dust they shake loose
    for (let i = 0; i < 3; i++) {
      const age = lt - (doorT + i * 0.12);
      if (age > 0 && age < 0.30) {
        const k = age / 0.30;
        ctx.save(); ctx.strokeStyle = C.rgba(CREAM, (1 - k) * 0.75); ctx.lineWidth = 4; ctx.lineCap = "round";
        for (let j = 0; j < 2; j++) {
          ctx.beginPath(); ctx.arc(300, 470, 22 + k * 52 + j * 16, -0.85, 0.85); ctx.stroke();
        }
        ctx.restore();
        for (let d = 0; d < 5; d++) {
          const dx = 300 + Math.cos(-0.8 + d * 0.4) * (24 + k * 46);
          const dy = 470 + Math.sin(-0.8 + d * 0.4) * (24 + k * 46) + k * k * 26;
          ctx.fillStyle = C.rgba(CREAM, (1 - k) * 0.5);
          ctx.beginPath(); ctx.arc(dx, dy, 1.6 + k * 1.6, 0, TAU); ctx.fill();
        }
      }
    }
    // a breath of warm light along the gap when the feet are there
    if (knockK > 0.01) {
      ctx.fillStyle = C.rgba("#FFD27A", 0.10 * knockK);
      ctx.fillRect(74, 698, 302, 3);
    }

    endCam(ctx);

    // No DAY n heading: the torn calendar page is the only day counter.
    TY.type(ctx, "THE HIDEOUT", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 31,
      perChar: (i) => C.clamp((t - 19.9 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "A DOOR HE DID NOT ANSWER", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    // the sticker sits where the knock lands, not on the empty chair
    TY.sticker(ctx, "NO ANSWER", 330, 800, 26, { fill: MUSTARD, text: INK, seed: 31, rot: 0.04, time: t });
  },
});
