# Rewind SFX Sources (CC0)

Download links (Freesound, CC0):

1. Rewind sound (0.927s)
- https://freesound.org/people/hotpin7/sounds/819769/
- Suggested local file: `rewind_short_01.wav`

2. Rewind Short.wav (1.840s)
- https://freesound.org/s/700527/
- Suggested local file: `rewind_short_02.wav`

3. Tape Rewind #1 (2.225s)
- https://freesound.org/people/Hajisounds/sounds/679970/
- Suggested local file: `rewind_tape_01.wav`

4. tape rewind imitation (3.455s)
- https://freesound.org/people/nic_navr08/sounds/832279/
- Suggested local file: `rewind_tape_02.wav`

5. Rewind (8.045s)
- https://freesound.org/people/kasa90/sounds/174363/
- Suggested local file: `rewind_long_01.wav` (trim later)

Notes:
- Freesound usually requires login before download.
- Keep original downloaded files in this folder.
- If you export edited versions, put them in `rewind_sfx_sources/processed/`.

## Select Tone Stair (Low -> Mid -> High + Fail Low)

Place your downloaded files in `rewind_sfx_sources/raw/` with these stems:

- `select_low.*` -> first card select (`cardSelect1.ogg`)
- `select_mid.*` -> second card select (`cardSelect2.ogg`)
- `select_ok_high.*` -> third card success (`cardSelectOK.ogg`)
- `select_fail_low.*` -> invalid third-card fail (`cardSelectFail.ogg`)

Then run:

```bash
./rewind_sfx_sources/convert_select_sfx.sh
```

The script will normalize and export directly to `app/sounds/`.
