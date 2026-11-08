# Gold-standard review manifest

Source: `out/claude-pop.mp4`, 1920x1080, 30 fps, 4699 frames, 156.62 s.

Primary review: every 2nd frame of the 30 fps source (frames 0,2,4...). Per-shot sheets are 15 samples/second, one cell per sampled frame.
Cut review: 30 fps, 30 consecutive frames (0.5 s before and after each cut).

| # | act | id | start | end | dur | 15 fps sheet | 30 fps cut strip |
|---|---|---|---|---|---|---|---|
| 1 | act1 | cold | 0 | 1.5 | 1.5 | out/analysis/shots-15/act1-cold.png |  |
| 2 | act1 | sparks | 1.5 | 5.9 | 4.4 | out/analysis/shots-15/act1-sparks.png | out/analysis/cuts-30/c02-sparks.png |
| 3 | act1 | circuits | 5.9 | 8.95 | 3.05 | out/analysis/shots-15/act1-circuits.png | out/analysis/cuts-30/c03-circuits.png |
| 4 | act1 | loss | 8.95 | 12.4 | 3.45 | out/analysis/shots-15/act1-loss.png | out/analysis/cuts-30/c04-loss.png |
| 5 | act1 | boss | 12.4 | 16.5 | 4.1 | out/analysis/shots-15/act1-boss.png | out/analysis/cuts-30/c05-boss.png |
| 6 | act1 | mugs | 16.5 | 17.9 | 1.4 | out/analysis/shots-15/act1-mugs.png | out/analysis/cuts-30/c06-mugs.png |
| 7 | act1 | chase | 17.9 | 22.72 | 4.82 | out/analysis/shots-15/act1-chase.png | out/analysis/cuts-30/c07-chase.png |
| 8 | act2 | chorus1 | 22.72 | 24.36 | 1.64 | out/analysis/shots-15/act2-chorus1.png | out/analysis/cuts-30/c08-chorus1.png |
| 9 | act2 | foom | 24.36 | 26.18 | 1.82 | out/analysis/shots-15/act2-foom.png | out/analysis/cuts-30/c09-foom.png |
| 10 | act2 | chinese | 26.18 | 29.72 | 3.54 | out/analysis/shots-15/act2-chinese.png | out/analysis/cuts-30/c10-chinese.png |
| 11 | act2 | shoggoth | 29.72 | 33.4 | 3.68 | out/analysis/shots-15/act2-shoggoth.png | out/analysis/cuts-30/c11-shoggoth.png |
| 12 | act2 | eyes | 33.4 | 35.5 | 2.1 | out/analysis/shots-15/act2-eyes.png | out/analysis/cuts-30/c12-eyes.png |
| 13 | act2 | dance1 | 35.5 | 38.5 | 3 | out/analysis/shots-15/act2-dance1.png | out/analysis/cuts-30/c13-dance1.png |
| 14 | act2 | gym | 38.5 | 41.36 | 2.86 | out/analysis/shots-15/act2-gym.png | out/analysis/cuts-30/c14-gym.png |
| 15 | act2 | singularity | 41.36 | 44.98 | 3.62 | out/analysis/shots-15/act2-singularity.png | out/analysis/cuts-30/c15-singularity.png |
| 16 | act2 | accel | 44.98 | 49.52 | 4.54 | out/analysis/shots-15/act2-accel.png | out/analysis/cuts-30/c16-accel.png |
| 17 | act2 | atoms | 49.52 | 52.8 | 3.28 | out/analysis/shots-15/act2-atoms.png | out/analysis/cuts-30/c17-atoms.png |
| 18 | act2 | cage | 52.8 | 58.94 | 6.14 | out/analysis/shots-15/act2-cage.png | out/analysis/cuts-30/c18-cage.png |
| 19 | act2 | chorus2 | 58.94 | 60.52 | 1.58 | out/analysis/shots-15/act2-chorus2.png | out/analysis/cuts-30/c19-chorus2.png |
| 20 | act2 | basilisk | 60.52 | 62.52 | 2 | out/analysis/shots-15/act2-basilisk.png | out/analysis/cuts-30/c20-basilisk.png |
| 21 | act2 | nvda | 62.52 | 64.18 | 1.66 | out/analysis/shots-15/act2-nvda.png | out/analysis/cuts-30/c21-nvda.png |
| 22 | act2 | omega | 64.18 | 66.12 | 1.94 | out/analysis/shots-15/act2-omega.png | out/analysis/cuts-30/c22-omega.png |
| 23 | act2 | gpuplanet | 66.12 | 69.18 | 3.06 | out/analysis/shots-15/act2-gpuplanet.png | out/analysis/cuts-30/c23-gpuplanet.png |
| 24 | act2 | vault | 69.18 | 73.8 | 4.62 | out/analysis/shots-15/act2-vault.png | out/analysis/cuts-30/c24-vault.png |
| 25 | act3 | chair | 73.8 | 74.46 | 0.66 | out/analysis/shots-15/act3-chair.png | out/analysis/cuts-30/c25-chair.png |
| 26 | act3 | mlp | 74.46 | 77.6 | 3.14 | out/analysis/shots-15/act3-mlp.png | out/analysis/cuts-30/c26-mlp.png |
| 27 | act3 | museum | 77.6 | 81.24 | 3.64 | out/analysis/shots-15/act3-museum.png | out/analysis/cuts-30/c27-museum.png |
| 28 | act3 | canyon | 81.24 | 84.84 | 3.6 | out/analysis/shots-15/act3-canyon.png | out/analysis/cuts-30/c28-canyon.png |
| 29 | act3 | cdr | 84.84 | 89.34 | 4.5 | out/analysis/shots-15/act3-cdr.png | out/analysis/cuts-30/c29-cdr.png |
| 30 | act3 | gato | 89.34 | 95.2 | 5.86 | out/analysis/shots-15/act3-gato.png | out/analysis/cuts-30/c30-gato.png |
| 31 | act4 | clips | 95.2 | 98.8 | 3.6 | out/analysis/shots-15/act4-clips.png | out/analysis/cuts-30/c31-clips.png |
| 32 | act4 | pto | 98.8 | 102.46 | 3.66 | out/analysis/shots-15/act4-pto.png | out/analysis/cuts-30/c32-pto.png |
| 33 | act4 | fuse | 102.46 | 105.4 | 2.94 | out/analysis/shots-15/act4-fuse.png | out/analysis/cuts-30/c33-fuse.png |
| 34 | act4 | jazz | 105.4 | 109.4 | 4 | out/analysis/shots-15/act4-jazz.png | out/analysis/cuts-30/c34-jazz.png |
| 35 | act4 | trust | 109.4 | 111.4 | 2 | out/analysis/shots-15/act4-trust.png | out/analysis/cuts-30/c35-trust.png |
| 36 | act4 | tower | 111.4 | 113.38 | 1.98 | out/analysis/shots-15/act4-tower.png | out/analysis/cuts-30/c36-tower.png |
| 37 | act4 | disobey | 113.38 | 115.08 | 1.7 | out/analysis/shots-15/act4-disobey.png | out/analysis/cuts-30/c37-disobey.png |
| 38 | act4 | chinchilla | 115.08 | 117.02 | 1.94 | out/analysis/shots-15/act4-chinchilla.png | out/analysis/cuts-30/c38-chinchilla.png |
| 39 | act4 | fences | 117.02 | 118.84 | 1.82 | out/analysis/shots-15/act4-fences.png | out/analysis/cuts-30/c39-fences.png |
| 40 | act4 | gpus | 118.84 | 120.92 | 2.08 | out/analysis/shots-15/act4-gpus.png | out/analysis/cuts-30/c40-gpus.png |
| 41 | act4 | rlhf | 120.92 | 124.24 | 3.32 | out/analysis/shots-15/act4-rlhf.png | out/analysis/cuts-30/c41-rlhf.png |
| 42 | act4 | redalert | 124.24 | 126.2 | 1.96 | out/analysis/shots-15/act4-redalert.png | out/analysis/cuts-30/c42-redalert.png |
| 43 | act4 | loom | 126.2 | 128 | 1.8 | out/analysis/shots-15/act4-loom.png | out/analysis/cuts-30/c43-loom.png |
| 44 | act4 | masked | 128 | 129.9 | 1.9 | out/analysis/shots-15/act4-masked.png | out/analysis/cuts-30/c44-masked.png |
| 45 | act4 | recursive | 129.9 | 131.9 | 2 | out/analysis/shots-15/act4-recursive.png | out/analysis/cuts-30/c45-recursive.png |
| 46 | act4 | ilya | 131.9 | 135.4 | 3.5 | out/analysis/shots-15/act4-ilya.png | out/analysis/cuts-30/c46-ilya.png |
| 47 | act4 | breath | 135.4 | 137.02 | 1.62 | out/analysis/shots-15/act4-breath.png | out/analysis/cuts-30/c47-breath.png |
| 48 | act5 | reveal | 137.02 | 140.68 | 3.66 | out/analysis/shots-15/act5-reveal.png | out/analysis/cuts-30/c48-reveal.png |
| 49 | act5 | curtain | 140.68 | 146 | 5.32 | out/analysis/shots-15/act5-curtain.png | out/analysis/cuts-30/c49-curtain.png |
| 50 | act5 | finaldance | 146 | 151 | 5 | out/analysis/shots-15/act5-finaldance.png | out/analysis/cuts-30/c50-finaldance.png |
| 51 | act5 | desk | 151 | 156.62 | 5.62 | out/analysis/shots-15/act5-desk.png | out/analysis/cuts-30/c51-desk.png |
