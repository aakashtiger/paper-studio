# Third-party notices and provenance

**Project:** Paper Studio — S1b watercolor pilot.
**Pack:** `styles/watercolor/`.
**Last updated:** 2026-10-26.

This is the repo-level index. The pack carries its own self-contained copy in `styles/watercolor/LICENSE-THIRD-PARTY.txt`, because a pack may travel alone.

---

## 1. Lemo-Opuscar

- **Repository:** `https://github.com/lemomo-ai/lemo-opuscar`
- **Style:** `watercolor` — “Watercolor Brush”
- **Style path:** `https://github.com/lemomo-ai/lemo-opuscar/tree/main/styles/watercolor`
- **Licence:** MIT.
- **Copyright:** Copyright (c) 2026 LemoLab.
- **Full notice:** `sources/lemo/LICENSE-MIT.txt`.
- **What we used:** the prose style bible and demo notes as reference for the D01–D27 conversion. The autopsy is `sources/lemo/watercolor-source.md`.
- **What we did not use:** Lemo demo code, film, stills, subtitles, music, voice, vendor data or fonts. The autopsy lists every excluded path.

The MIT notice is included in full because the source documentation is MIT and because the pack may travel without this repository. The pack does not copy Lemo software, but it does convert the documented style grammar, so the notice travels with it.

The source snapshot is identified by the file hashes in section 7. The archive has no `.git` directory, so no commit SHA is asserted.

---

## 2. Demo film and stills

- **Film:** *Follow the Rain* — 113.6 s, 1920×1080, 60 fps.
- **Stills and poster:** `poster.jpg`, `demo/stills/styleframe.jpg`.
- **Licence:** CC BY 4.0, LemoLab. The repository README’s licence section says demo films and their stills are CC BY 4.0; commercial reuse is allowed with credit to LemoLab, a link to the repository, and a note of any changes.
- **Status:** **not reproduced.** No Lemo film, frame, still, poster or subtitle is in this repository or in the pack.
- **Attribution:** Because nothing is reproduced, no CC BY attribution is required for non-use. The pack nevertheless credits Lemo-Opuscar watercolor as the source grammar in `capabilities.identity.lineage` and on the card. The demo story, characters and assets were not used.
- **If that changes:** if a still or frame is ever reproduced, add the CC BY 4.0 attribution, the source URL, the changes made, and the date here before the file enters the pack.

The demo’s music, voice and map data are separate third-party assets, not part of the film/stills licence. They are not reproduced. See section 5.

---

## 3. Fonts

All four delivered font files are licensed under the **SIL Open Font License, Version 1.1**. They are downloaded from the upstream `google/fonts` repository, not from the Lemo demo subset. Fonts are assets, not npm packages; the pilot adds no npm dependency.

### 3.1 Cormorant Garamond

- **Copyright:** Copyright 2015 the Cormorant Project Authors (`github.com/CatharsisFonts/Cormorant`). Christian Thalmann / Catharsis Fonts.
- **Upstream directory:** `https://github.com/google/fonts/tree/main/ofl/cormorantgaramond`
- **Files:**
  - Upstream `CormorantGaramond[wght].ttf` → delivered as `CormorantGaramond-Variable.ttf` — `https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf`
  - Upstream `CormorantGaramond-Italic[wght].ttf` → delivered as `CormorantGaramond-Italic-Variable.ttf` — `https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond-Italic%5Bwght%5D.ttf`
- **Licence text:** `https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt`
- **Licence:** SIL OFL 1.1.

### 3.2 Caveat

- **Copyright:** Copyright 2014 The Caveat Project Authors (`https://github.com/googlefonts/caveat`). Impallari Type.
- **Upstream directory:** `https://github.com/google/fonts/tree/main/ofl/caveat`
- **File:** upstream `Caveat[wght].ttf` → delivered as `Caveat-Variable.ttf` — `https://raw.githubusercontent.com/google/fonts/main/ofl/caveat/Caveat%5Bwght%5D.ttf`
- **Licence text:** `https://raw.githubusercontent.com/google/fonts/main/ofl/caveat/OFL.txt`
- **Licence:** SIL OFL 1.1.

### 3.3 IBM Plex Mono

- **Copyright:** Copyright © 2017 IBM Corp. with Reserved Font Name "Plex". IBM / Mike Abbink, Bold Monday.
- **Upstream directory:** `https://github.com/google/fonts/tree/main/ofl/ibmplexmono`
- **File:** `IBMPlexMono-Regular.ttf` (same upstream and in the pack) — `https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf`
- **Licence text:** `https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/OFL.txt`
- **Licence:** SIL OFL 1.1.

### 3.4 Where the notices and hashes live

- The full OFL text is in `styles/watercolor/fonts/OFL.txt`; the per-family texts are `OFL-Cormorant.txt`, `OFL-Caveat.txt` and `OFL-IBMPlexMono.txt`.
- Each family’s copyright line, upstream URL and the **SHA-256 of every delivered font file** are recorded in `styles/watercolor/fonts/FONT-LICENSES.md`.
- This file does not restate the font hashes. They live next to the files so a font change is visible in the pack hash.
- If a film subsets a font, the OFL notice must travel with the subset.
- The pack’s self-contained notice is `styles/watercolor/LICENSE-THIRD-PARTY.txt`.

---

## 4. Public-domain reference categories

The style’s reference grammar comes from three categories. They are **described, not reproduced**. No scan, plate, painting, page or manual is in this repository or in the pack.

1. **Naturalist field journals and botanical plates.** The specimen-plus-note layout: one hero form, a hand-written label, a leader line, a measured value.
2. **Long horizontal handscroll panoramas.** One continuous painted world read by a lateral walk, rather than a sequence of framed pictures.
3. **Watercolour technique manuals.** Paper as the white, transparent layering, flying white, pooled edges, and the discipline of leaving the paper unpainted for light.

The source bible’s own rule is the rule here: “Borrow the grammar, never a specific artwork.” A category is not a licence to reproduce a particular work.

**If a specific work is ever reproduced:** record the creator, title, date, institution or accession, source URL and the licence or public-domain basis here **before** the file enters the pack. A category description is not enough.

---

## 5. No music, voice, lyrics or third-party media

The pack contains **no** music, voice, lyrics, sound effects, photographs, film frames, stills, maps, geodata, vendor libraries or subtitles.

- The demo’s Scott Buckley track (*Wildflowers*, CC BY 4.0) is not reproduced.
- The demo’s Kokoro voice and voice lines are not reproduced.
- The demo’s Natural Earth coastline, `world-atlas` and `topojson-client` vendor files are not reproduced. Their public-domain and ISC notices are therefore not carried.
- The demo’s subtitles and `watercolor.srt` are not reproduced.
- The pack’s sound section describes a palette and foley character; it ships no audio files.
- If a film using the pack needs music or voice, it is cleared per film. The style supplies none.

This is deliberate. The pack is a definition, not a media bundle.

---

## 6. Pack licence

**Proprietary — Paper Studio internal pilot; third-party notices in `styles/watercolor/LICENSE-THIRD-PARTY.txt`.**

- The pack’s own text, tokens, recipes and card, and the two formats, are Paper Studio work.
- Lemo-Opuscar watercolor is credited as the source grammar. The demo story, characters and assets were not used.
- The Lemo MIT notice and the OFL font notices travel with the pack.
- Legal review is required before commercial sale.

---

## 7. How to verify

The source is read-only. These hashes identify the snapshot this autopsy describes.

| File | SHA-256 |
|---|---|
| `STYLE.md` | `662D57568408A7C82EF8F64980CA85798B8BB239DF3DC3A6715283D7F4555EF0` |
| `DEMO.md` | `DF9AC7B2FE814F1E70F8EEFA1641D7B55480D5CC158E7CD300A52D32F203B7A6` |
| `style.json` | `FE64241069DE6AAF0173DE56B6FF038AE03EB131EF96C799512A5EFEA7821B47` |
| `LICENSE` (repo root) | `14C9FF6F14BFB2391E74FEDB01C256891D2A3BBA1C2ACF5789901BDF77E54E33` |
| `demo/CREDITS` | `F6853A6BE52E259299D58E0D99F4C3F2AADB574AD7AED6ECB634383B3323504A` |

Run from PowerShell:

```powershell
$base = "C:\Users\Aakash\Downloads\Compressed\lemo-opuscar-main\lemo-opuscar-main"
Get-FileHash "$base\styles\watercolor\STYLE.md", "$base\styles\watercolor\DEMO.md", "$base\styles\watercolor\style.json", "$base\LICENSE", "$base\styles\watercolor\demo\CREDITS" -Algorithm SHA256
```

Expected values are the table above.

Then check the pack’s own notices:

```powershell
Get-Content sources\lemo\LICENSE-MIT.txt
Get-Content styles\watercolor\fonts\FONT-LICENSES.md
Get-Content styles\watercolor\LICENSE-THIRD-PARTY.txt
```

- `LICENSE-MIT.txt` is byte-identical to the repo-root MIT text, including `Copyright (c) 2026 LemoLab`; both hash to `14C9FF6F14BFB2391E74FEDB01C256891D2A3BBA1C2ACF5789901BDF77E54E33`.
- `FONT-LICENSES.md` should list the four font files, their upstream URLs and their SHA-256 values.
- `LICENSE-THIRD-PARTY.txt` should carry the MIT and OFL notices without needing this repository.

The gate test also checks that no Lemo media file is inside the pack.

---

## 8. Summary

| Item | Licence | Reproduced? | Notice carried? |
|---|---|---|---|
| Lemo-Opuscar code and docs | MIT, Copyright (c) 2026 LemoLab | No code; short quotations only | Yes, full MIT text. |
| *Follow the Rain* film and stills | CC BY 4.0, LemoLab | No | No attribution required for non-use; source grammar credited. |
| Cormorant Garamond | SIL OFL 1.1 | Yes, two delivered font files | Yes, OFL text and copyright. |
| Caveat | SIL OFL 1.1 | Yes, delivered font file | Yes, OFL text and copyright. |
| IBM Plex Mono | SIL OFL 1.1 | Yes, delivered font file | Yes, OFL text and copyright. |
| Public-domain reference categories | Described categories; no work reproduced | No | No; described only. |
| Demo music, voice, lyrics, map data, vendor files | Separate licences | No | No; nothing carried. |
| Paper Studio pack | Proprietary — internal pilot | Yes | Pack licence plus third-party notices. |
