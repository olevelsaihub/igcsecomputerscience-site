/* Group G06 mastery bank: File sizes, units and compression; Hexadecimal, shifts, characters, sound and RLE; Ciphers: Caesar, Pigpen and Rail Fence. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function bits(n, w) { w = w || 8; var s = (n >>> 0).toString(2); while (s.length < w) s = '0' + s; return s.slice(-w); }
  function sp(s) { return s.length === 8 ? s.slice(0, 4) + ' ' + s.slice(4) : (s.length === 16 ? s.slice(0, 4) + ' ' + s.slice(4, 8) + ' ' + s.slice(8, 12) + ' ' + s.slice(12) : s); }
  function b8(n) { return sp(bits(((n % 256) + 256) % 256, 8)); }
  function hx(n, w) { var s = n.toString(16).toUpperCase(); while (s.length < (w || 1)) s = '0' + s; return s; }
  function rev(s) { return s.split('').reverse().join(''); }
  function minus(v) { return v < 0 ? '&minus;' + (-v) : String(v); }
  function fmt(x) { var s = String(x), p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function mc(q, correct, wrongs, why, fill, n) {
    n = n || 4;
    var opts = [String(correct)];
    function add(w) { w = String(w); if (opts.map(function (o) { return o.toLowerCase(); }).indexOf(w.toLowerCase()) < 0 && opts.length < n) opts.push(w); }
    wrongs.forEach(add);
    var guard = 0;
    while (opts.length < n && fill && guard++ < 300) add(fill());
    return { kind: 'mcq', q: q, options: opts, answer: 0, why: why };
  }
  function num(q, answer, why, unit, tol, display) {
    var o = { kind: 'num', q: q, answer: answer, unit: unit || '', why: why };
    if (tol != null) o.tol = tol;
    if (display != null) o.display = display;
    return o;
  }
  function multi(q, opts, correctFlags, why) {
    return { kind: 'multi', q: q, options: opts, answers: correctFlags.map(function (f, i) { return f ? i : -1; }).filter(function (i) { return i >= 0; }), why: why };
  }
  function pl(n, w) { return n + ' ' + (n === 1 ? w.replace(/s$/, '') : w); }
  function st(skill, q, options, why) { return { skill: skill, kind: 'mcq', q: q, options: options, answer: 0, why: why }; }
  function table(head, rows) {
    return '<table class="mc-table">' + (head ? '<tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' : '') +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  var INK = '#303a4c', RED = '#e4464f', BLUE = '#195d9b', GREY = '#9aa5b8';

  // ======================================================================
  // CSC-T3-10 Pixels, resolution and colour depth
  // ======================================================================
  B['CSC-T3-10'] = { title: 'Pixels, resolution and colour depth', items: [
    st('pixels', 'What is a <b>pixel</b>?', ['The smallest element of a bitmap image, with one colour', 'A part of the screen used to show menus, icons and windows to the user', 'The number of bits used to store each colour', 'A measure of how many dots fit into one inch'],
      'A pixel (picture element) is the smallest single square of colour in a bitmap image. The other options describe colour depth and resolution.'),
    st('pixels', 'A bitmap photo is zoomed in until it looks like a grid of small coloured squares. What is each square called?', ['A pixel', 'A bit', 'A byte', 'A vector'],
      'Each square is a pixel, the smallest element of a bitmap image. Its colour is stored as a binary code.'),
    st('pixels', 'The word pixel is short for which phrase?', ['Picture element', 'Pixel index', 'Picture extension', 'Printed cell'],
      'Pixel comes from "picture element": one element of the grid that makes up a bitmap image.'),
    { skill: 'resolution', gen: function () {
      var right = pick(['Pixels per inch (ppi)', 'Dots per inch (dpi)', 'Pixels per centimetre', 'Width &times; height in pixels']);
      return mc('Which of these is a measure of image <b>resolution</b>?', right, shuf(['Megabytes (MB)', 'Square centimetres (cm&sup2;)', 'Bits per pixel', 'Hertz (Hz)', 'Frames per second']).slice(0, 3),
        'Resolution describes how much detail an image holds: how many pixels (or dots) there are in a given length, or the width and height in pixels. ' + right + ' is one such measure.');
    } },
    { skill: 'resolution', kind: 'multi', q: 'Select <b>every</b> option that can be used to describe the resolution of a bitmap image.',
      options: ['Pixels per inch', 'Dots per inch', '1920 &times; 1080 pixels', 'Kilobytes', 'Colour depth in bits'], answers: [0, 1, 2],
      why: 'Resolution is given as pixels (or dots) per unit length, or as width &times; height in pixels. File size and colour depth are different properties.' },
    st('colour depth and file size', 'What is meant by the <b>colour depth</b> of an image?', ['The number of bits used to store the colour of each pixel', 'The number of pixels across the width of the image', 'How dark the colours in the image appear', 'The number of different colours that actually appear in the picture'],
      'Colour depth is the number of bits per pixel. With n bits, each pixel can be one of 2<sup>n</sup> colours.'),
    st('colour depth and file size', 'An artist increases the colour depth of an image. Which is the best description of why the file gets bigger?', ['Each pixel needs more bits to store its colour', 'The image gains extra pixels across its width', 'The image is automatically saved without compression', 'The file now stores the date and time it was made'],
      'The number of pixels stays the same, but every pixel uses more bits, so the total number of bits for the image goes up.'),
    { skill: 'colour depth and file size', kind: 'multi', q: 'Select the <b>two</b> points that together give a linked description of why a higher colour depth makes an image file larger.',
      options: ['Each pixel can be one of more colours', 'So more bits are needed to store every pixel', 'The image will contain more pixels', 'The image is easier to compress', 'The image becomes a vector graphic'], answers: [0, 1],
      why: 'More possible colours per pixel means a longer binary code for each pixel. Multiplied over every pixel, that makes a bigger file. The number of pixels does not change.' },
    st('effect of changes', 'A student writes: "Increasing the colour depth gives the image more pixels, so the file is bigger." What is wrong with this answer?', ['The number of pixels does not change; each pixel just uses more bits', 'Colour depth has no effect at all on the file size', 'The file actually becomes smaller whenever the colour depth is increased', 'The answer should mention the sampling frequency'],
      'Colour depth changes how many bits describe each pixel, not how many pixels there are.'),
    st('effect of changes', 'A scanner setting is changed from 150 dpi to 600 dpi for the same photo. What is the effect?', ['More detail is captured, and the file is larger', 'Less detail is captured, and the file is smaller', 'More colours are available, but the file is the same size', 'The image has fewer pixels, so it loads faster'],
      'A higher resolution samples more dots in each inch, so there are more pixels: more detail, but more data to store.'),
    st('effect of changes', 'A designer reduces the colour depth of an icon from 24 bits to 8 bits without changing its width or height. Which statement is correct?', ['Fewer colours, a smaller file, and the same number of pixels', 'More colours are possible and the file is larger', 'The icon has fewer pixels, so the file becomes smaller overall', 'Nothing changes because the dimensions are the same'],
      '8 bits allow 2<sup>8</sup> = 256 colours instead of over 16 million, and each pixel uses fewer bits. The grid of pixels is unchanged.'),
    { skill: 'colour depth and file size', gen: function () {
      var w = pick([800, 1024, 1200, 1600]), h = pick([600, 768, 900, 1200]), d1 = pick([4, 8]), d2 = pick([16, 24]);
      return mc('Photo A and Photo B are both ' + w + ' &times; ' + h + ' pixels. Photo A uses ' + d1 + '-bit colour and Photo B uses ' + d2 + '-bit colour. Neither is compressed. Which statement is correct?',
        'B is larger because each of its pixels uses more bits', ['They are the same size because they have the same pixels', 'A is larger because fewer colours need more pixels', 'B is larger because it has more pixels than A'],
        'Both images have ' + w + ' &times; ' + h + ' pixels. B stores ' + d2 + ' bits for each pixel instead of ' + d1 + ', so its file is bigger.');
    } },
    { skill: 'resolution', gen: function () {
      var d = pick([8, 16, 24]), a = pick([[640, 480], [800, 600]]), b = pick([[1920, 1080], [2560, 1440]]);
      return mc('Image P is ' + a[0] + ' &times; ' + a[1] + ' pixels and image Q is ' + b[0] + ' &times; ' + b[1] + ' pixels. Both use ' + d + '-bit colour and are not compressed. Which statement is correct?',
        'Q is larger because it has more pixels to store', ['P is larger because its pixels are bigger', 'They are the same size because the colour depth is the same', 'Q is larger because each of its pixels uses more bits'],
        'With the same colour depth, every pixel needs ' + d + ' bits, so the image with more pixels (Q) needs more bits in total.');
    } },
    st('pixels', 'How is a bitmap image made up?', ['A grid of pixels, each storing one colour', 'A list of shapes, lines and curves', 'A series of sound samples', 'A set of characters from a character set'],
      'A bitmap is a grid of pixels. The colour of every pixel is stored as a binary number.'),
    st('pixels', 'In a bitmap file, what is stored for each pixel?', ['A binary code for its colour', 'Its width in centimetres', 'The name of the colour as text', 'A picture of the whole image'],
      'Each pixel is stored as a binary pattern that represents its colour. The length of that pattern is the colour depth.'),
    st('effect of changes', 'A small bitmap logo is stretched to fill a large poster and looks blocky. Why?', ['The same pixels are spread over a bigger area, so each one shows', 'The colour depth drops each time the image is enlarged on screen', 'The poster printer adds extra pixels in random colours', 'Enlarging the image changes it into lossy format'],
      'Stretching does not create new detail. Each pixel is simply drawn bigger, so the individual squares can be seen (pixelation).'),
    st('resolution', 'What does <b>dpi</b> stand for?', ['Dots per inch', 'Digital pixel index', 'Data per image', 'Depth per inch'],
      'dpi means dots per inch: how many dots (or pixels) are printed or scanned in each inch. It is a measure of resolution.'),
    st('colour depth and file size', 'For an uncompressed bitmap, which change would <b>not</b> change the file size?', ['Recolouring some pixels from red to blue', 'Increasing the colour depth', 'Increasing the width in pixels', 'Increasing the height in pixels'],
      'File size depends on the number of pixels and the bits per pixel. Changing which colour a pixel holds keeps the same number of bits.'),
    { skill: 'effect of changes', gen: function () {
      var n = pick([4, 8, 12]);
      return mc('An image\'s colour depth is changed from ' + n + ' bits to ' + (2 * n) + ' bits. What happens to the number of pixels in the image?', 'It stays the same',
        ['It doubles', 'It halves', 'It is multiplied by ' + n],
        'Colour depth only changes how many bits each pixel uses. The width and height in pixels, and so the number of pixels, do not change.');
    } },
    st('resolution', 'The same photo is printed at 72 ppi and at 300 ppi, at the same physical size. Which print shows finer detail?', ['The 300 ppi print, because it has more pixels per inch', 'The 72 ppi print, because each of its pixels is printed larger', 'They look the same because the photo is the same', 'The 72 ppi print, because it uses fewer colours'],
      'More pixels in each inch means each pixel is smaller and more detail can be shown.'),
    st('colour depth and file size', 'Which image is likely to need the higher colour depth?', ['A photo of a sunset with smooth changes of colour', 'A black and white QR code', 'A two-colour company logo', 'A page of black text on white'],
      'A sunset contains many shades, so it needs many possible colours per pixel. The others use only a handful of colours.'),
    st('resolution', 'A screen has a resolution of 1366 &times; 768. What does this mean?', ['It is 1366 pixels wide and 768 pixels high', 'It shows 1366 colours using 768 bits', 'It is 1366 mm wide and 768 mm high', 'Each pixel uses 1366 bits of colour'],
      'Resolution written as width &times; height counts pixels across and pixels down.'),
    st('colour depth and file size', 'Why does a photo look more realistic when it has a higher colour depth?', ['More shades are available, so colour changes look smoother', 'More pixels are added around the edges of the photo to fill gaps', 'The photo is automatically made brighter', 'The file is compressed with a lossless method'],
      'With more bits per pixel, each pixel can take one of many more colours, so gradual changes of colour are shown more accurately.')
  ] };

  // ======================================================================
  // CSC-T3-16 Kilobytes and kibibytes
  // ======================================================================
  B['CSC-T3-16'] = { title: 'Kilobytes and kibibytes', items: [
    { skill: 'decimal units', gen: function () {
      var n = rint(3, 950);
      return num('How many bytes are there in ' + n + ' kilobytes (kB)?', n * 1000, 'A kilobyte is an SI unit: 1 kB = 1000 bytes, so ' + n + ' kB = ' + n + ' &times; 1000 = ' + fmt(n * 1000) + ' bytes.', 'bytes');
    } },
    { skill: 'binary units', gen: function () {
      var n = rint(3, 950);
      return num('How many bytes are there in ' + n + ' kibibytes (KiB)?', n * 1024, 'A kibibyte is an IEC unit: 1 KiB = 1024 bytes, so ' + n + ' KiB = ' + n + ' &times; 1024 = ' + fmt(n * 1024) + ' bytes.', 'bytes');
    } },
    { skill: 'binary units', gen: function () {
      var n = rint(2, 60);
      return num('How many kibibytes (KiB) are there in ' + n + ' mebibytes (MiB)?', n * 1024, '1 MiB = 1024 KiB, so ' + n + ' MiB = ' + n + ' &times; 1024 = ' + fmt(n * 1024) + ' KiB.', 'KiB');
    } },
    { skill: 'decimal units', gen: function () {
      var x = rint(1200, 98000), v = x / 1000;
      return num('A saved game file is ' + fmt(x) + ' bytes. What is this in kilobytes (kB)?', v, 'Divide by 1000 because 1 kB = 1000 bytes: ' + fmt(x) + ' &divide; 1000 = ' + v + ' kB.', 'kB', 0.0005, String(v));
    } },
    { skill: 'converting between systems', gen: function () {
      var n = rint(5, 900), v = R.roundDp(n * 1000 / 1024, 2);
      return num('Convert ' + n + ' kB to kibibytes (KiB). Give your answer to 2 decimal places.', v,
        'Change to bytes with the decimal factor, then divide by the binary factor: ' + n + ' &times; 1000 = ' + fmt(n * 1000) + ' bytes; &divide; 1024 = ' + v + ' KiB (2 d.p.).', 'KiB', 0.005, v.toFixed(2));
    } },
    { skill: 'converting between systems', gen: function () {
      var n = rint(5, 900), v = R.roundDp(n * 1.024, 3);
      return num('Convert ' + n + ' KiB to kilobytes (kB). Give the exact answer.', v,
        n + ' KiB = ' + n + ' &times; 1024 = ' + fmt(n * 1024) + ' bytes. Dividing by 1000 gives ' + v + ' kB.', 'kB', 0.0005, String(v));
    } },
    { skill: 'converting between systems', gen: function () {
      var n = rint(11, 99), toKiB = Math.random() < 0.5;
      var right = toKiB ? '(' + n + ' &times; 1000) &divide; 1024' : '(' + n + ' &times; 1024) &divide; 1000';
      var w = toKiB ? ['(' + n + ' &times; 1024) &divide; 1000', '(' + n + ' &divide; 1000) &times; 1024', '(' + n + ' &times; 1000) &times; 1024'] : ['(' + n + ' &times; 1000) &divide; 1024', '(' + n + ' &divide; 1024) &times; 1000', '(' + n + ' &times; 1024) &times; 1000'];
      return mc('Which expression converts ' + n + (toKiB ? ' kilobytes to kibibytes' : ' kibibytes to kilobytes') + '?', right, w,
        'First change to bytes using the starting unit (' + (toKiB ? '&times; 1000 for kB' : '&times; 1024 for KiB') + '), then divide by the size of the new unit (' + (toKiB ? '1024 for KiB' : '1000 for kB') + ').');
    } },
    { skill: 'comparing units', gen: function () {
      var n = rint(3, 400);
      return num('How many more bytes are there in ' + n + ' KiB than in ' + n + ' kB?', 24 * n,
        n + ' &times; 1024 = ' + fmt(n * 1024) + ' and ' + n + ' &times; 1000 = ' + fmt(n * 1000) + '. The difference is ' + n + ' &times; 24 = ' + fmt(24 * n) + ' bytes.', 'bytes');
    } },
    { skill: 'comparing units', gen: function () {
      var n = rint(2, 9);
      return mc('A game update is ' + n + ' MiB. How many bytes is this?', fmt(n * 1048576) + ' bytes', [fmt(n * 1000000) + ' bytes', fmt(n * 1024) + ' kB', fmt(n * 1000) + ' KiB'],
        '1 MiB = 1024 &times; 1024 = 1,048,576 bytes, so ' + n + ' MiB = ' + fmt(n * 1048576) + ' bytes. ' + fmt(n * 1000000) + ' bytes is ' + n + ' MB; ' + fmt(n * 1024) + ' kB and ' + fmt(n * 1000) + ' KiB are both ' + fmt(n * 1024000) + ' bytes.');
    } },
    st('definitions', 'How many bytes are in one kilobyte (kB)?', ['1000', '1024', '100', '8'],
      'The kilobyte uses the SI (decimal) prefix kilo, which means 1000. 1024 bytes is a kibibyte.'),
    st('definitions', 'How many bytes are in one kibibyte (KiB)?', ['1024', '1000', '1048', '512'],
      'The kibibyte is the IEC (binary) unit: 2<sup>10</sup> = 1024 bytes.'),
    st('comparing units', 'Which statement correctly compares a kilobyte and a kibibyte?', ['A kibibyte is 24 bytes bigger than a kilobyte', 'A kilobyte is 24 bytes bigger than a kibibyte', 'They are exactly the same size', 'A kibibyte is 1000 times bigger than a kilobyte'],
      '1 KiB = 1024 bytes and 1 kB = 1000 bytes, so the kibibyte is larger by 24 bytes.'),
    { skill: 'definitions', kind: 'multi', q: 'Select the <b>two</b> statements that together compare kilobytes and kibibytes correctly.',
      options: ['A kilobyte is an SI unit of 1000 bytes', 'A kibibyte is an IEC unit of 1024 bytes', 'A kilobyte is used only for images', 'A kibibyte is smaller than a kilobyte', 'Both units are exactly 1024 bytes'], answers: [0, 1],
      why: 'A comparison must describe both units: the kilobyte (SI, base 10, 1000 bytes) and the kibibyte (IEC, base 2, 1024 bytes).' },
    st('definitions', 'Why is 1024, rather than 1000, used for the kibibyte?', ['1024 is 2<sup>10</sup>, a power of 2 that suits binary', '1024 is easier to multiply in your head', '1024 bytes is the size of one character', 'Computers cannot store the number 1000'],
      'Binary works in powers of 2, and 2<sup>10</sup> = 1024 is the power of 2 closest to 1000.'),
    st('definitions', 'The kibibyte is defined by the IEC. What does IEC stand for?', ['International Electrotechnical Commission', 'International Electronic Computing', 'Internet Engineering Council', 'International Exchange Code'],
      'The IEC (International Electrotechnical Commission) defined the binary prefixes kibi, mebi and gibi. The SI defines kilo, mega and giga.'),
    { skill: 'decimal units', gen: function () {
      var n = R.roundDp(rint(15, 95) / 10, 1);
      return num('How many bytes are in ' + n + ' MB?', R.roundDp(n * 1000000, 0), '1 MB = 1000 &times; 1000 = 1,000,000 bytes, so ' + n + ' MB = ' + fmt(R.roundDp(n * 1000000, 0)) + ' bytes.', 'bytes', 0.5);
    } },
    { skill: 'binary units', gen: function () {
      var n = rint(2, 9);
      return num('How many bytes are in ' + n + ' MiB?', n * 1048576, '1 MiB = 1024 &times; 1024 = 1,048,576 bytes, so ' + n + ' MiB = ' + fmt(n * 1048576) + ' bytes.', 'bytes', 0.5);
    } },
    { skill: 'comparing units', gen: function () {
      var n = rint(2, 9);
      return mc('Which of these is the <b>largest</b> amount of storage?', n + ' MiB', [n + ' MB', fmt(n * 1000) + ' KiB', fmt(n * 1000000) + ' bytes'],
        'In bytes: ' + n + ' MiB = ' + fmt(n * 1048576) + '; ' + fmt(n * 1000) + ' KiB = ' + fmt(n * 1024000) + '; ' + n + ' MB = ' + fmt(n * 1000000) + ' (the same as ' + fmt(n * 1000000) + ' bytes). The mebibytes are largest.');
    } },
    { skill: 'decimal units', gen: function () {
      var n = R.roundDp(rint(12, 640) / 10, 1);
      return num('A video is ' + n + ' GB. How many megabytes (MB) is this?', R.roundDp(n * 1000, 0), '1 GB = 1000 MB, so ' + n + ' GB = ' + n + ' &times; 1000 = ' + fmt(R.roundDp(n * 1000, 0)) + ' MB.', 'MB');
    } },
    st('definitions', 'A student says, "A kilobyte is 1024 bytes." Which correction is right?', ['A kilobyte is 1000 bytes; 1024 bytes is a kibibyte', 'A kilobyte is 1048 bytes; 1024 bytes is a mebibyte', 'A kilobyte is 1024 bits, not bytes', 'The student is right; kibibyte is just another name'],
      'Kilo always means 1000 in SI units. The binary unit of 1024 bytes has its own name, the kibibyte (KiB).'),
    { skill: 'binary units', gen: function () {
      var x = rint(3000, 90000), v = R.roundDp(x / 1024, 2);
      return num('A configuration file is ' + fmt(x) + ' bytes. What is its size in KiB? Give your answer to 2 decimal places.', v,
        'Divide by 1024 because 1 KiB = 1024 bytes: ' + fmt(x) + ' &divide; 1024 = ' + v.toFixed(2) + ' KiB (2 d.p.).', 'KiB', 0.005, v.toFixed(2));
    } },
    st('binary units', 'Which statement about the mebibyte is correct?', ['1 MiB = 1024 KiB = 1,048,576 bytes', '1 MiB = 1000 KiB = 1,000,000 bytes', '1 MiB = 1024 kB = 1,024,000 bytes', '1 MiB = 1000 MB'],
      'Each binary step is &times; 1024: 1 MiB = 1024 KiB = 1024 &times; 1024 bytes = 1,048,576 bytes.')
  ] };

  // ======================================================================
  // CSC-T3-13 Sound sampling
  // ======================================================================
  function wave(n, dt, opts) {
    opts = opts || {};
    var vals = [], prev = rint(1, 6);
    for (var i = 0; i < n; i++) { var v = Math.max(0, Math.min(7, prev + pick([-3, -2, -1, 1, 2, 3]))); if (i === 0) v = prev; vals.push(v); prev = v; }
    return vals;
  }
  function waveSvg(vals, dt, opts) {
    opts = opts || {};
    var n = vals.length, x0 = 48, x1 = 368, y0 = 16, y1 = 186, W = 390, H = 232;
    var X = function (i) { return x0 + (x1 - x0) * i / (n - 1); }, Y = function (v) { return y1 - (y1 - y0) * v / 7; };
    var g = '';
    for (var v = 0; v <= 7; v++) g += '<line x1="' + x0 + '" y1="' + Y(v) + '" x2="' + x1 + '" y2="' + Y(v) + '" stroke="' + GREY + '" stroke-width="0.5"/><text x="' + (x0 - 8) + '" y="' + (Y(v) + 4) + '" font-size="11" text-anchor="end" fill="' + INK + '">' + v + '</text>';
    for (var i = 0; i < n; i++) g += '<line x1="' + X(i) + '" y1="' + y1 + '" x2="' + X(i) + '" y2="' + (y1 + 4) + '" stroke="' + INK + '"/><text x="' + X(i) + '" y="' + (y1 + 16) + '" font-size="10" text-anchor="middle" fill="' + INK + '">' + R.roundDp(i * dt, 2) + '</text>';
    var P = vals.map(function (v, i) { return [X(i), Y(v)]; }), d = 'M' + P[0][0] + ' ' + P[0][1];
    for (i = 0; i < n - 1; i++) {
      var p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n - 1, i + 2)];
      var cy = function (v) { return R.roundDp(Math.max(y0, Math.min(y1, v)), 1); };   // control points stay inside the axes, so the curve never dips below 0
      d += ' C' + R.roundDp(p1[0] + (p2[0] - p0[0]) / 6, 1) + ' ' + cy(p1[1] + (p2[1] - p0[1]) / 6) + ' ' + R.roundDp(p2[0] - (p3[0] - p1[0]) / 6, 1) + ' ' + cy(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + p2[0] + ' ' + p2[1];
    }
    var step = 'M' + P[0][0] + ' ' + P[0][1];
    for (i = 1; i < n; i++) step += ' H' + P[i][0] + ' V' + P[i][1];
    var dots = P.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="' + RED + '"/>'; }).join('');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opts.label || 'Sound wave with sample points') + '">' + g +
      '<line x1="' + x0 + '" y1="' + y1 + '" x2="' + x1 + '" y2="' + y1 + '" stroke="' + INK + '" stroke-width="1.5"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + y1 + '" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<path d="' + d + '" fill="none" stroke="' + GREY + '" stroke-width="2" stroke-dasharray="5 4"/>' +
      (opts.noStep ? '' : '<path d="' + step + '" fill="none" stroke="' + BLUE + '" stroke-width="2"/>') + dots +
      '<text x="' + ((x0 + x1) / 2) + '" y="' + (H - 4) + '" font-size="11" text-anchor="middle" fill="' + INK + '">Time (s)</text>' +
      '<text x="12" y="' + ((y0 + y1) / 2) + '" font-size="11" text-anchor="middle" fill="' + INK + '" transform="rotate(-90 12 ' + ((y0 + y1) / 2) + ')">Amplitude</text></svg>';
  }
  var KEYTEXT = 'In the graph, the dashed grey curve is the original sound, the red dots are the samples and the solid blue line is the stored version.';
  B['CSC-T3-13'] = { title: 'Sound sampling: analogue to digital', items: [
    { skill: 'reading a sampled wave', gen: function () {
      var dt = pick([0.5, 0.25, 1]), vals = wave(9, dt), k = rint(1, 8), t = R.roundDp(k * dt, 2);
      return { kind: 'num', q: KEYTEXT + ' What is the value of the sample taken at ' + t + ' s?', svg: waveSvg(vals, dt), answer: vals[k], unit: '',
        why: 'Find ' + t + ' s on the time axis, go up to the red dot, and read across to the amplitude axis: ' + vals[k] + '.' };
    } },
    { skill: 'sampling frequency', gen: function () {
      var dt = pick([0.5, 0.25, 1, 0.2]), vals = wave(pick([6, 7, 8, 9]), dt), f = R.roundDp(1 / dt, 0);
      return { kind: 'num', q: 'The graph shows a sound being sampled at regular intervals. ' + KEYTEXT + ' What is the sampling frequency? Give your answer in Hz.', svg: waveSvg(vals, dt), answer: f, unit: 'Hz',
        why: 'One sample is taken every ' + dt + ' s, so there are 1 &divide; ' + dt + ' = ' + f + ' samples per second, which is ' + f + ' Hz.' };
    } },
    { skill: 'reading a sampled wave', gen: function () {
      var dt = pick([0.5, 0.25]), n = rint(6, 10), vals = wave(n, dt);
      return { kind: 'num', q: 'How many samples have been taken in the recording shown in the graph? ' + KEYTEXT, svg: waveSvg(vals, dt), answer: n, unit: '',
        why: 'Count the red dots, one for each sample, including the one at 0 s: there are ' + n + '.' };
    } },
    { skill: 'sampling frequency', gen: function () {
      var f = pick([1000, 2000, 4000, 5000, 8000, 10000, 20000, 40000, 50000]), ms = 1000 / f;
      return num('A sound is sampled at ' + fmt(f) + ' Hz. How many milliseconds pass between one sample and the next?', ms,
        fmt(f) + ' samples per second means each gap is 1 &divide; ' + fmt(f) + ' s = ' + ms + ' ms.', 'ms', ms * 0.01, String(ms));
    } },
    { skill: 'sampling frequency', gen: function () {
      var f = pick([8, 16, 22.05, 44.1, 48]), s = rint(2, 20), n = R.roundDp(f * 1000 * s, 0);
      return num('A voice note is sampled at ' + f + ' kHz for ' + s + ' seconds. How many samples are taken in total?', n,
        f + ' kHz = ' + fmt(R.roundDp(f * 1000, 0)) + ' samples per second. ' + fmt(R.roundDp(f * 1000, 0)) + ' &times; ' + s + ' = ' + fmt(n) + ' samples.', '', 0.5);
    } },
    { skill: 'sampling frequency', gen: function () {
      var f = pick([200, 400, 500, 800, 1000, 2000]), s = rint(3, 12);
      return num('A microphone records ' + fmt(f * s) + ' samples of a sound in ' + s + ' seconds. What is the sampling frequency in Hz?', f,
        'Sampling frequency is samples per second: ' + fmt(f * s) + ' &divide; ' + s + ' = ' + f + ' Hz.', 'Hz');
    } },
    st('sampling process', 'What does it mean to <b>sample</b> a sound?', ['Measure the amplitude of the sound wave at regular time intervals', 'Record the whole sound continuously onto magnetic tape at full quality', 'Play the sound back through a speaker', 'Remove the quiet parts of a recording'],
      'Sampling takes measurements of the wave\'s height (amplitude) at fixed intervals. Each measurement is stored as a binary number.'),
    st('sampling frequency', 'Which unit is used for sampling frequency?', ['Hertz (Hz), meaning samples per second', 'Bits, meaning bits per sample', 'Decibels (dB), meaning loudness', 'Seconds (s), meaning length of the recording'],
      'Sampling frequency counts how many samples are taken each second, measured in hertz.'),
    st('analogue and digital', 'Which statement correctly describes analogue and digital sound?', ['Analogue varies continuously; digital is a list of separate binary values', 'Digital varies continuously; analogue is a list of separate binary values', 'Analogue sound is always louder than digital sound', 'Analogue and digital both mean the sound is stored on a computer'],
      'Real sound is a smooth, continuous (analogue) wave. A computer stores separate sample values in binary (digital).'),
    { skill: 'effect of changes', kind: 'multi', q: 'A recording studio increases the sampling frequency. Select <b>every</b> correct effect.',
      options: ['The stored sound is closer to the original', 'The file size increases', 'The sound is louder when played back', 'Each sample uses fewer bits', 'The recording becomes analogue'], answers: [0, 1],
      why: 'More samples per second capture the wave more accurately, but each extra sample needs storing, so the file grows. Volume and bits per sample do not change.' },
    st('effect of changes', 'A student says, "Increasing the sample rate makes the music louder." Why is this wrong?', ['Sample rate changes how often the wave is measured, not its amplitude', 'Increasing the sample rate always makes the music quieter, not louder', 'Sample rate only affects the colour of the waveform', 'Loudness depends only on the file name'],
      'Loudness is about amplitude. A higher sampling frequency means more measurements per second, giving a more accurate copy and a larger file.'),
    st('sampling process', 'Which order of steps converts an analogue sound into a digital file?', ['Set the sample rate and bit depth, sample the amplitude, store each value in binary', 'Store each value in binary first, then measure the amplitude, then set the sample rate', 'Play the sound through speakers, then save it as text', 'Measure the amplitude once, then copy it for every second'],
      'First choose the settings, then sample the wave at regular intervals, then store each measured amplitude as a binary number.'),
    st('reading a sampled wave', 'On a graph of a sampled sound wave, what is normally shown on each axis?', ['Time on the x-axis and amplitude on the y-axis', 'Amplitude on the x-axis and time on the y-axis', 'Frequency on both axes', 'Bit depth on the x-axis and file size on the y-axis'],
      'The wave changes over time (x-axis, in seconds), and its height is the amplitude (y-axis).'),
    { skill: 'analogue and digital', gen: function () {
      var vals = wave(8, 0.5), line = pick(['dashed grey curve', 'solid blue stepped line']);
      var right = line === 'dashed grey curve' ? 'The original analogue sound wave' : 'The digital version made from the samples';
      return { kind: 'mcq', q: 'In this graph the red dots are sample points. What does the ' + line + ' represent?', svg: waveSvg(vals, 0.5, { label: 'Sound wave: dashed grey curve, red sample dots and solid blue stepped line' }),
        options: [right, line === 'dashed grey curve' ? 'The digital version made from the samples' : 'The original analogue sound wave', 'The bit depth of each sample', 'The time between playing each sample'], answer: 0,
        why: 'The smooth curve is the continuous analogue sound. The stepped line holds each sampled value until the next sample: that is the stored digital sound.' };
    } },
    { skill: 'reading a sampled wave', gen: function () {
      var dt = 0.5, vals; do { vals = wave(8, dt); } while (vals.filter(function (v) { return v === Math.max.apply(null, vals); }).length > 1);
      var mx = Math.max.apply(null, vals), k = vals.indexOf(mx), times = vals.map(function (v, i) { return R.roundDp(i * dt, 2); });
      var others = shuf(times.filter(function (_, i) { return i !== k; })).slice(0, 3);
      return { kind: 'mcq', q: KEYTEXT + ' At what time was the sample with the highest amplitude taken?', svg: waveSvg(vals, dt),
        options: ['At ' + times[k] + ' s'].concat(others.map(function (t) { return 'At ' + t + ' s'; })), answer: 0,
        why: 'The highest red dot has amplitude ' + mx + ', and it sits above ' + times[k] + ' s on the time axis.' };
    } },
    st('analogue and digital', 'Why is a digital recording never an exact copy of the analogue sound?', ['The wave is only measured at intervals, and each value is rounded to a level', 'Digital recordings are always compressed with a lossy method before they are saved', 'Computers cannot store negative numbers', 'Speakers change the sound when it is recorded'],
      'Anything between samples is not recorded, and each measurement must fit one of the available levels, so small details are lost.'),
    st('sampling process', 'What is the <b>bit depth</b> of a sound recording?', ['The number of bits used to store each sample', 'The number of samples taken each second', 'The number of seconds the recording lasts', 'The number of speakers used for playback'],
      'Bit depth is bits per sample. More bits per sample give more possible amplitude levels.'),
    st('effect of changes', 'A podcast is re-recorded with a higher bit depth. What is the effect?', ['Each sample is stored more precisely, and the file is larger', 'More samples are taken per second, and the file becomes smaller', 'The recording becomes shorter', 'The sound becomes analogue'],
      'More bits per sample allow more amplitude levels, so each measurement is closer to the real value, but every sample needs more storage.'),
    st('sampling process', 'In a digital sound file, what is stored for each sample?', ['A binary number for the amplitude at that moment', 'The time the recording was made', 'A picture of the sound wave', 'The name of the instrument playing'],
      'Each sample is the measured amplitude, written as a binary number with the chosen bit depth.'),
    { skill: 'effect of changes', gen: function () {
      var f1 = pick([8000, 11025, 16000, 22050]), f2 = pick([44100, 48000, 96000]);
      return mc('Recording A is sampled at ' + fmt(f1) + ' Hz and recording B at ' + fmt(f2) + ' Hz. Both last 30 seconds and use the same bit depth. Which statement is correct?',
        'B stores more samples, so it is closer to the original and larger', ['A stores more samples, so it is closer to the original and larger', 'B is louder because it is sampled more often', 'They are the same size because they last the same time'],
        'B takes ' + fmt(f2) + ' samples every second compared with ' + fmt(f1) + ' for A, so B captures the wave in more detail and needs more storage.');
    } },
    st('sampling frequency', 'A sampling frequency of 500 Hz means what?', ['500 samples are taken every second', 'Each sample uses 500 bits', 'The recording lasts 500 seconds', 'The sound is 500 times louder'],
      'Hertz means "per second", so 500 Hz is 500 samples each second.'),
    { skill: 'reading a sampled wave', gen: function () {
      var dt = pick([0.5, 0.25]), vals = wave(9, dt), mx = Math.max.apply(null, vals), mn = Math.min.apply(null, vals);
      if (mx === mn) { vals[3] = (vals[3] + 3) % 8; mx = Math.max.apply(null, vals); mn = Math.min.apply(null, vals); }
      return { kind: 'num', q: KEYTEXT + ' What is the difference between the highest and lowest sample values?', svg: waveSvg(vals, dt), answer: mx - mn, unit: '',
        why: 'The highest red dot is at ' + mx + ' and the lowest at ' + mn + ', so the difference is ' + mx + ' &minus; ' + mn + ' = ' + (mx - mn) + '.' };
    } }
  ] };

  // ======================================================================
  // CSC-T3-11 Expressions for file size and transfer time
  // ======================================================================
  var X = ' &times; ', D = ' &divide; ';
  B['CSC-T3-11'] = { title: 'Expressions for file size and transfer time', items: [
    { skill: 'image file size', gen: function () {
      var w = rint(30, 60) * 100 + rint(0, 99), h = rint(20, 40) * 100 + rint(0, 99), d = pick([16, 24, 32]), m = rint(300, 990);
      var core = w + X + h + X + d;
      return mc('A photo is ' + w + ' pixels wide and ' + h + ' pixels high, with a ' + d + '-bit colour depth. Its metadata is ' + m + ' bytes. Which expression gives the file size in <b>megabytes</b>? (Use decimal units: 1 kB = 1000 bytes, 1 MB = 1000 kB, 1 GB = 1000 MB.)',
        '(' + core + D + '8 + ' + m + ')' + D + '(1000' + X + '1000)',
        ['(' + core + ' + ' + m + ')' + D + '8' + D + '(1000' + X + '1000)', '(' + core + D + '8 + ' + m + ')' + D + '(1024' + X + '1024)', '(' + core + X + '8 + ' + m + ')' + D + '(1000' + X + '1000)', core + D + '8 + ' + m + D + '(1000' + X + '1000)'],
        'Pixels &times; colour depth gives bits; &divide; 8 gives bytes; then add the ' + m + ' bytes of metadata; the bracket keeps it all together before &divide; (1000 &times; 1000) for MB.');
    } },
    { skill: 'image file size', gen: function () {
      var w = pick([320, 480, 640, 800, 1024]), h = pick([240, 360, 480, 600]), d = pick([8, 16, 24]), v = R.roundDp(w * h * d / 8 / 1000, 1);
      return num('An uncompressed bitmap is ' + w + ' &times; ' + h + ' pixels with ' + d + '-bit colour. Ignoring metadata, what is its size in kilobytes (kB)? Give your answer to 1 decimal place. (1 kB = 1000 bytes)', v,
        w + ' &times; ' + h + ' &times; ' + d + ' = ' + fmt(w * h * d) + ' bits; &divide; 8 = ' + fmt(w * h * d / 8) + ' bytes; &divide; 1000 = ' + v.toFixed(1) + ' kB.', 'kB', 0.05, v.toFixed(1));
    } },
    { skill: 'sound file size', gen: function () {
      var f = pick([8, 16, 32, 44.1, 48]), hz = R.roundDp(f * 1000, 0), b = pick([8, 16, 24]), s = rint(40, 900);
      return mc('A music file is sampled at ' + f + ' kHz with a bit depth of ' + b + ' bits, and the recording lasts ' + s + ' seconds. Which expression gives the file size in <b>bytes</b>?',
        s + X + hz + X + b + D + '8', [s + X + f + X + b + D + '8', s + X + hz + D + b + D + '8', s + X + hz + X + b + X + '8', s + X + hz + X + b],
        'Samples per second (' + f + ' kHz = ' + hz + ' Hz) &times; bits per sample &times; seconds gives bits. Dividing by 8 turns bits into bytes.');
    } },
    { skill: 'sound file size', gen: function () {
      var f = pick([22.05, 44.1, 48]), b = pick([8, 16, 24]), s = rint(20, 240), v = R.roundDp(f * 1000 * b * s / 8 / 1000000, 2);
      return num('A sound clip is sampled at ' + f + ' kHz with ' + b + '-bit samples and lasts ' + s + ' seconds. What is its size in megabytes (MB)? Give your answer to 2 decimal places. (1 MB = 1,000,000 bytes)', v,
        fmt(R.roundDp(f * 1000, 0)) + ' &times; ' + b + ' &times; ' + s + ' = ' + fmt(R.roundDp(f * 1000 * b * s, 0)) + ' bits; &divide; 8 = ' + fmt(R.roundDp(f * 1000 * b * s / 8, 0)) + ' bytes; &divide; 1,000,000 = ' + v.toFixed(2) + ' MB.', 'MB', 0.005, v.toFixed(2));
    } },
    { skill: 'text file size', gen: function () {
      var c = rint(40, 120), r = rint(30, 90), m = rint(20, 80);
      return mc('A text file holds ' + r + ' lines of ' + c + ' characters, each stored as a 2-byte Unicode character, plus ' + m + ' bytes of metadata. Which expression gives the file size in <b>KiB</b>?',
        '(' + r + X + c + X + '2 + ' + m + ')' + D + '1024', ['(' + r + X + c + X + '2 + ' + m + ')' + D + '1000', '(' + r + X + c + X + '16 + ' + m + ')' + D + '1024', r + X + c + X + '2 + ' + m + D + '1024', '(' + r + X + c + D + '2 + ' + m + ')' + D + '1024'],
        'Characters &times; 2 bytes each gives the text in bytes; add the metadata bytes; then divide the whole bracket by 1024 for KiB.');
    } },
    { skill: 'text file size', gen: function () {
      var lines = rint(50, 400), chars = rint(30, 80), bpc = pick([1, 2]);
      return num('A log file has ' + lines + ' lines, each exactly ' + chars + ' characters long. Each character takes ' + bpc + ' byte' + (bpc === 1 ? '' : 's') + '. Ignoring metadata, how many bytes does the text take?', lines * chars * bpc,
        lines + ' &times; ' + chars + ' = ' + fmt(lines * chars) + ' characters; &times; ' + bpc + ' = ' + fmt(lines * chars * bpc) + ' bytes.', 'bytes');
    } },
    { skill: 'transmission time', gen: function () {
      var g = rint(2, 12), s = pick([20, 36, 48, 80, 120, 300]), G3 = '1000' + X + '1000' + X + '1000', M2 = '1000' + X + '1000';
      return mc('A ' + g + ' GB file is sent over a network at ' + s + ' Mbps. Which expression gives the transmission time in seconds? (1 GB = 1000 MB, 1 MB = 1000 kB, 1 kB = 1000 bytes; 1 Mbps = 1,000,000 bits per second.)',
        '(' + g + X + G3 + X + '8)' + D + '(' + s + X + M2 + ')',
        ['(' + g + X + G3 + ')' + D + '(' + s + X + M2 + ')', '(' + g + X + G3 + D + '8)' + D + '(' + s + X + M2 + ')', '(' + g + X + G3 + X + '8)' + D + s, '(' + g + X + '1024' + X + '1024' + X + '1024' + X + '8)' + D + '(' + s + X + M2 + ')'],
        'Change the file to bits (GB &times; 1000 &times; 1000 &times; 1000 &times; 8) and the speed to bits per second (Mbps &times; 1000 &times; 1000), then divide size by speed.');
    } },
    { skill: 'transmission time', gen: function () {
      var s = pick([4, 8, 10, 16, 20, 40]), t = rint(3, 60), mb = s * t / 8;
      if (mb !== Math.round(mb)) { t = 8 * rint(1, 7); mb = s * t / 8; }
      return num('A ' + mb + ' MB file is downloaded at ' + s + ' Mbps. How many seconds does the download take? (1 MB = 1,000,000 bytes; 1 Mbps = 1,000,000 bits per second.)', t,
        mb + ' MB = ' + mb + ' &times; 8 = ' + (mb * 8) + ' megabits. ' + (mb * 8) + ' &divide; ' + s + ' Mbps = ' + t + ' seconds.', 's');
    } },
    { skill: 'storage and blocks', gen: function () {
      var size = R.roundDp(rint(25, 90) / 10, 1), cap = pick([8, 16, 32, 64]), n = Math.floor(cap * 1000 / size);
      return num('Each photo from a camera is ' + size + ' MB. How many <b>whole</b> photos fit on an empty ' + cap + ' GB memory card? (1 GB = 1000 MB)', n,
        cap + ' GB = ' + fmt(cap * 1000) + ' MB. ' + fmt(cap * 1000) + ' &divide; ' + size + ' = ' + R.roundDp(cap * 1000 / size, 2) + (n === R.roundDp(cap * 1000 / size, 2) ? ', so exactly ' + fmt(n) + ' photos fit.' : ', so only ' + fmt(n) + ' whole photos fit (round down: part of a photo cannot be stored).'), 'photos');
    } },
    { skill: 'storage and blocks', gen: function () {
      var blk = pick([512, 4096]), size = rint(3, 40) * blk + rint(1, blk - 1), n = Math.ceil(size / blk);
      return num('A disk stores files in blocks of ' + blk + ' bytes, and a block cannot be shared between files. How many blocks are needed for a file of ' + fmt(size) + ' bytes?', n,
        fmt(size) + ' &divide; ' + blk + ' = ' + R.roundDp(size / blk, 2) + '. A part-filled block still counts, so round up to ' + n + ' blocks.', 'blocks');
    } },
    { skill: 'spotting errors', gen: function () {
      var w = rint(1000, 4000), h = rint(800, 3000), d = pick([16, 24, 32]);
      return mc('A student writes this expression for the size of a ' + w + ' &times; ' + h + ' image with ' + d + '-bit colour, in kB (1 kB = 1000 bytes): ' + w + X + h + X + d + D + '1000. What is wrong?', 'It gives kilobits, because it does not divide by 8',
        ['It should multiply by 1000, not divide', 'The colour depth should be added, not multiplied', 'It should divide by 1024 because kB is a binary unit of storage'],
        'Width &times; height &times; colour depth is in bits. Dividing by 8 gives bytes, and only then does &divide; 1000 give kilobytes.');
    } },
    { skill: 'spotting errors', gen: function () {
      var w = rint(1000, 4000), h = rint(800, 3000), d = pick([16, 24, 32]), m = rint(200, 900);
      return mc('An expression for an image file size in bytes is (' + w + X + h + X + d + ' + ' + m + ')' + D + '8, where ' + m + ' is the metadata in bytes. What is the error?', 'The metadata is added before dividing by 8, so it is treated as bits',
        ['The metadata should be multiplied by the colour depth of the image too', 'There should be no brackets in the expression', 'The colour depth should be divided by 8 first'],
        'The metadata is already in bytes, so it must be added after the pixel data has been converted to bytes: (' + w + X + h + X + d + D + '8) + ' + m + '.');
    } },
    st('spotting errors', 'Why do file-size expressions for images and sounds usually include &divide; 8?', ['To change a number of bits into a number of bytes', 'To change bytes into kilobytes', 'Because each pixel has 8 neighbours', 'To change seconds into minutes before the data is calculated'],
      'Pixels &times; colour depth (or samples &times; bit depth) counts bits. There are 8 bits in a byte.'),
    st('spotting errors', 'Why are brackets important in an expression such as (W &times; H &times; 24 &divide; 8 + 500) &divide; 1000?', ['They make sure the whole total, including metadata, is divided by 1000', 'They show that the metadata is in bits', 'They tell the computer to work faster', 'They are only there to make the expression look neater and easier to read'],
      'Without the brackets, only the 500 would be divided by 1000, which gives the wrong file size.'),
    st('image file size', 'A question asks you to build an expression for a file size and says that working it out is not needed. What should you write?', ['The full calculation using the given numbers, but not the final answer', 'Only the final answer in megabytes', 'A description in words of each step, with no numbers or operators at all', 'The formula with letters only, such as W &times; H &times; D'],
      'Construct an expression means write the full calculation using the numbers given, with brackets to show the order. Working it out is not required.'),
    { skill: 'image file size', gen: function () {
      var wi = pick([4, 5, 6, 8]), hi = pick([3, 4, 5, 6]), ppi = pick([150, 200, 300]), n = wi * ppi * hi * ppi;
      return num('A photo is scanned at ' + ppi + ' pixels per inch. The print is ' + wi + ' inches wide and ' + hi + ' inches high. How many pixels does the scanned image have?', n,
        'Width: ' + wi + ' &times; ' + ppi + ' = ' + (wi * ppi) + ' pixels. Height: ' + hi + ' &times; ' + ppi + ' = ' + (hi * ppi) + ' pixels. Total: ' + (wi * ppi) + ' &times; ' + (hi * ppi) + ' = ' + fmt(n) + '.', 'pixels', 0.5);
    } },
    { skill: 'transmission time', gen: function () {
      var kb = pick([1000, 1500, 2000, 2500, 3000, 5000]), mbps = pick([1, 2, 4, 5]), t = kb * 1000 * 8 / (mbps * 1000000);
      return num('A ' + fmt(kb) + ' kB email attachment is sent at ' + mbps + ' Mbps. How many seconds does it take? Give your answer to 1 decimal place. (1 kB = 1000 bytes; 1 Mbps = 1,000,000 bits per second.)', R.roundDp(t, 1),
        fmt(kb) + ' kB = ' + fmt(kb * 1000) + ' bytes = ' + fmt(kb * 8000) + ' bits. ' + mbps + ' Mbps = ' + fmt(mbps * 1000000) + ' bits per second. ' + fmt(kb * 8000) + ' &divide; ' + fmt(mbps * 1000000) + ' = ' + R.roundDp(t, 1).toFixed(1) + ' s.', 's', 0.05, R.roundDp(t, 1).toFixed(1));
    } },
    st('image file size', 'What is <b>metadata</b> in an image file?', ['Data about the image, such as its width, height and colour depth', 'The colour codes of the pixels in the top row', 'A smaller copy of the image that is used when the file is compressed', 'The bits that are lost when the image is compressed'],
      'Metadata is data about the data. It is added to the pixel data, so it must be included in a full file-size expression.'),
    { skill: 'sound file size', gen: function () {
      var f = pick([8000, 16000, 22050, 44100]), b = pick([8, 16]), s = rint(5, 120), bytes = f * b * s / 8;
      return num('An uncompressed sound file is ' + fmt(bytes) + ' bytes. It was sampled at ' + fmt(f) + ' Hz with a bit depth of ' + b + ' bits. How many seconds long is the recording?', s,
        'Each second uses ' + fmt(f) + ' &times; ' + b + ' &divide; 8 = ' + fmt(f * b / 8) + ' bytes. ' + fmt(bytes) + ' &divide; ' + fmt(f * b / 8) + ' = ' + s + ' seconds.', 's');
    } },
    { skill: 'sound file size', gen: function () {
      var change = pick([['Doubling the sampling frequency', 'Halving the length of the recording'], ['Doubling the length of the recording', 'Halving the sampling frequency'], ['Changing the bit depth from 8 to 16 bits', 'Changing the bit depth from 16 to 8 bits']]);
      return mc('Which change would <b>double</b> the size of an uncompressed sound file, with everything else kept the same?', change[0], [change[1], 'Doubling the playback volume', 'Playing the file through two speakers'],
        'Sound file size = sampling frequency &times; bit depth &times; length. Doubling any one of these doubles the size; volume and playback do not change the stored data.');
    } },
    { skill: 'image file size', gen: function () {
      var w = pick([400, 500, 640, 800]), h = pick([300, 400, 480, 600]), d = pick([8, 16, 24, 32]), bytes = w * h * d / 8;
      return num('An uncompressed image is ' + w + ' &times; ' + h + ' pixels and its pixel data takes ' + fmt(bytes) + ' bytes. What is its colour depth in bits?', d,
        fmt(bytes) + ' bytes &times; 8 = ' + fmt(bytes * 8) + ' bits. Dividing by the ' + fmt(w * h) + ' pixels gives ' + d + ' bits per pixel.', 'bits');
    } },
    { skill: 'spotting errors', gen: function () {
      var g = rint(2, 9), s = pick([25, 50, 100]);
      return mc('A student calculates the time to send a ' + g + ' GB file at ' + s + ' Mbps using (' + g + X + '1000' + X + '1000' + X + '1000)' + D + '(' + s + X + '1000' + X + '1000). Both use decimal units (1 GB = 1000 &times; 1000 &times; 1000 bytes). What is missing?', 'Multiplying the file size by 8 to change bytes into bits',
        ['Dividing the speed by 8 to change bits into bytes', 'Using 1024 instead of 1000 when converting the network speed', 'Adding the metadata to the network speed'],
        'GB is a number of bytes but Mbps counts bits. The file must be multiplied by 8 so both are in bits before dividing.');
    } }
  ] };

  // ======================================================================
  // CSC-T3-14 Compression: lossy or lossless?
  // ======================================================================
  var SCEN = [
    ['A charity emails its typed annual report to the people who run it.', 'lossless', 'every word must arrive exactly as it was written'],
    ['A developer sends a zip of program source code to a colleague.', 'lossless', 'changing even one character could stop the program working'],
    ['A school uploads a spreadsheet of exam marks to a shared drive.', 'lossless', 'every number must be stored exactly'],
    ['A music service streams songs to phones over mobile data.', 'lossy', 'much smaller files stream quickly and most listeners will not notice the lost detail'],
    ['A traveller posts holiday photos to a social media site.', 'lossy', 'small files upload and load quickly, and the lost detail is hard to see on a screen'],
    ['A bank emails a customer a statement of transactions.', 'lossless', 'every figure must be exactly right'],
    ['A podcast company wants episodes to download quickly on slow connections.', 'lossy', 'the much smaller files download faster and speech still sounds clear']
  ];
  B['CSC-T3-14'] = { title: 'Compression: lossy or lossless?', items: [
    { skill: 'reasons to compress', kind: 'multi', q: 'Select the <b>two</b> different reasons for reducing the size of a file.',
      options: ['It takes up less storage space', 'It is quicker to send over a network', 'It makes the file harder to open', 'It increases the image resolution', 'It removes viruses from the file'], answers: [0, 1],
      why: 'Smaller files use less storage and take less time (and bandwidth) to transmit. Compression does not improve resolution or remove viruses.' },
    st('reasons to compress', 'Which of these is <b>not</b> a benefit of compressing a file?', ['The file can be opened without any software', 'The file uses less disc space', 'The file uploads more quickly', 'The file may fit within an email size limit'],
      'A compressed file usually needs compatible software to decompress it. The other three are genuine benefits.'),
    st('drawbacks', 'Which is a drawback of using compression software?', ['It takes processing time to compress and decompress the file', 'It always makes the file larger', 'It permanently deletes the original file from every connected device', 'It changes the file into a program'],
      'Compressing and decompressing take processing time, and both ends need compatible software.'),
    st('lossy and lossless', 'What does <b>lossy</b> compression do?', ['Permanently removes some data, so the original cannot be rebuilt exactly', 'Removes no data at all, so the original file can always be rebuilt exactly', 'Encrypts the file so it cannot be read', 'Adds extra data to check for errors'],
      'Lossy methods throw away detail that people may not notice. The removed data is gone for good.'),
    st('lossy and lossless', 'What does <b>lossless</b> compression do?', ['Shrinks the file without losing any data, so it can be rebuilt exactly', 'Removes data that people are unlikely to notice when they view the file', 'Lowers the resolution of every image', 'Converts the file into a lower bit depth'],
      'Lossless compression finds a shorter way to store the same data, so decompressing gives back an identical file.'),
    { skill: 'formats', gen: function () {
      var right = pick(['JPEG', 'MP3']);
      return mc('Which of these file formats or methods uses <b>lossy</b> compression?', right, shuf(['PNG', 'ZIP', 'Run-length encoding']), right + ' removes detail to make files much smaller, so it is lossy. PNG, ZIP and run-length encoding are lossless.');
    } },
    { skill: 'formats', gen: function () {
      var right = pick(['PNG', 'ZIP', 'Run-length encoding']);
      return mc('Which of these uses <b>lossless</b> compression?', right, ['JPEG', 'MP3', 'Lowering the bit depth'], right + ' rebuilds the original exactly, so it is lossless. JPEG and MP3 throw away data, and lowering bit depth also loses detail.');
    } },
    { skill: 'choosing a method', gen: function () {
      var s = pick(SCEN), m = s[1], o = m === 'lossy' ? 'lossless' : 'lossy';
      var cap = function (x) { return x.charAt(0).toUpperCase() + x.slice(1); };
      var wrongReason = m === 'lossless' ? 'Lossless, because it always gives the smallest possible file' : 'Lossy, because the original can be rebuilt exactly';
      return mc(s[0] + ' Which compression method is most appropriate, with the best justification?', cap(m) + ', because ' + s[2],
        [cap(o) + ', because ' + s[2], wrongReason, cap(o) + ', because it is the newest type of compression'],
        (m === 'lossless' ? 'Lossless keeps every bit of the original, which matters here because ' : 'Lossy gives much smaller files, which suits this case because ') + s[2] + '.');
    } },
    st('choosing a method', 'A student suggests lossy compression for an e-book before sending it to a printer. Why is this a poor choice?', ['Lossy compression could permanently change or remove some of the text', 'Lossy files cannot be sent by email at all', 'Lossy compression would make the e-book file much larger than before', 'Printers can only print lossy files'],
      'Text must come back exactly as written. Lossy compression throws away data, so letters or words could be lost.'),
    st('lossy and lossless', 'A student writes, "Lossless compression removes less data than lossy." Why is this not accurate?', ['Lossless compression removes no data at all', 'Lossless compression removes more data than lossy', 'Lossless compression only works on images', 'Lossy compression does not remove any data'],
      'Lossless methods store the same data more efficiently. Nothing is thrown away, which is why the original can be rebuilt exactly.'),
    st('choosing a method', 'Why is lossy compression often used for music on streaming services?', ['Files are much smaller, so songs start quickly and use less data', 'It makes songs sound better than the original', 'It means the original recording can always be rebuilt exactly as it was', 'It is the only way to store sound on a computer'],
      'Lossy music files are a fraction of the original size, and most listeners cannot hear the removed detail.'),
    st('drawbacks', 'A sound engineer archives the only copy of a live concert recording after compressing it with a lossy method. What is the main drawback?', ['The removed detail can never be recovered, so the original quality is lost', 'The compressed file will take much longer to copy than the original did', 'The song will be converted to text', 'Lossy files cannot be played on phones'],
      'Lossy compression is permanent. If it is the only copy, the full-quality version is gone.'),
    st('choosing a method', 'Why must program code always be compressed with a lossless method?', ['Losing even one character could change what the program does', 'Program code is always too small to be compressed with a lossy method', 'Lossy compression only works on text files', 'Lossless files run faster on the processor'],
      'Code must be exact. If any character were changed or removed, the program could give errors or behave differently.'),
    st('reasons to compress', 'A student gives "it saves storage space" and "it takes up less room on the disc" as two reasons for compression. Why would this earn only one mark?', ['Both describe the same benefit in different words', 'Neither is a reason for compression', 'Compression never saves storage space', 'The answer should mention lossy compression'],
      'Two reasons must be different points, for example saving storage and reducing transmission time.'),
    st('lossy and lossless', 'For the same photo, which usually gives the smaller file?', ['Lossy compression', 'Lossless compression', 'No compression', 'They always give exactly the same size'],
      'Lossy compression can throw data away, so it can shrink a photo far more than a lossless method can.'),
    st('lossy and lossless', 'Which statement about decompressing a losslessly compressed file is correct?', ['The result is identical to the original file', 'The result is slightly lower in quality', 'The result is larger than the original', 'The result cannot be decompressed again'],
      'Lossless compression removes no data, so decompression rebuilds the exact original, bit for bit.'),
    st('choosing a method', 'A news website compresses its photos with a lossy method. What is the main benefit for readers?', ['Pages load faster because the images are much smaller', 'The photos have a higher resolution', 'The photos can be rebuilt exactly when they are downloaded', 'The text on the page is easier to read'],
      'Smaller image files take less time to download, so pages appear sooner, especially on slow connections.'),
    st('reasons to compress', 'Why might someone compress a file before attaching it to an email?', ['To keep it within the email service\'s attachment size limit', 'To encrypt it so nobody else can read it', 'To increase the resolution of any images in it', 'To convert it into a different language'],
      'Many email services limit attachment sizes. Compressing can bring a file under that limit and speed up sending.'),
    { skill: 'choosing a method', gen: function () {
      var items = shuf([['A program\'s source code', 1], ['A bank statement', 1], ['A chapter of a novel', 1], ['A database of customer addresses', 1], ['A photo for a social media post', 0], ['A song for a streaming service', 0], ['A video clip for a website', 0]]).slice(0, 5);
      if (items.every(function (x) { return x[1]; })) items[0] = ['A photo for a social media post', 0];
      if (items.every(function (x) { return !x[1]; })) items[0] = ['A program\'s source code', 1];
      return multi('Select <b>every</b> file that should only be compressed with a lossless method.', items.map(function (x) { return x[0]; }), items.map(function (x) { return x[1]; }),
        'Text, code and numbers must be rebuilt exactly, so they need lossless compression. Photos, songs and videos can lose some detail without people noticing.');
    } },
    st('lossy and lossless', 'Which data is a lossy image method most likely to remove?', ['Fine detail and small colour differences the eye is unlikely to notice', 'Every second row of pixels', 'All of the colour, leaving a black and white image', 'The image\'s metadata only, leaving all the pixel data exactly as it was'],
      'Lossy image compression targets detail that people are least likely to see, so the picture still looks similar but the file is much smaller.'),
    st('drawbacks', 'A user opens a compressed file on an old phone and it is slow to appear. Which drawback of compression does this show?', ['The file must be decompressed, which takes processing time', 'Compression always lowers the quality of the file', 'The file has become larger after compression', 'The phone has deleted part of the file'],
      'Before a compressed file can be used, it must be decompressed. On a slow device this extra work can take noticeable time.'),
    st('choosing a method', 'A photographer plans to save her master copies for large prints using lossy compression. Which is the strongest argument against this?', ['Lost detail cannot be restored, and it may be visible in large prints', 'Lossy files cannot be opened by photo editing software', 'Lossy compression makes the files much larger', 'Printers cannot handle compressed files, so the prints would fail completely'],
      'Once lossy compression removes data it is gone. Enlarged prints can show the missing detail, so master copies should be lossless.')
  ] };

  // ======================================================================
  // CSC-T3-04 Hexadecimal
  // ======================================================================
  function hexWrongs(n) {
    var h = hx(n, 2), w = [h[1] + h[0], String(n >> 4) + String(n & 15), hx(((n >> 4) ^ 1) * 16 + (n & 15), 2), hx((n & 0xF0) | ((n & 15) ^ 1), 2), String(n)];
    return w;
  }
  B['CSC-T3-04'] = { title: 'Hexadecimal: why we use it and how to convert', items: [
    { skill: 'binary to hex', gen: function () {
      var n; do { n = rint(17, 254); } while ((n >> 4) === (n & 15) || (n >> 4) < 10 && (n & 15) < 10 && Math.random() < 0.7);
      var h = hx(n, 2), s = bits(n);
      return mc('Convert the binary pattern ' + sp(s) + ' to hexadecimal.', h, hexWrongs(n),
        'Split into nibbles: ' + s.slice(0, 4) + ' = ' + (n >> 4) + ' = ' + h[0] + ', and ' + s.slice(4) + ' = ' + (n & 15) + ' = ' + h[1] + '. So the answer is ' + h + '.', function () { return hx(rint(16, 255), 2); });
    } },
    { skill: 'hex to binary', gen: function () {
      var n; do { n = rint(17, 254); } while ((n >> 4) === (n & 15));
      var h = hx(n, 2), s = bits(n);
      return mc('Convert the hexadecimal value ' + h + ' to 8-bit binary.', sp(s), [b8(((n & 15) << 4) | (n >> 4)), sp(rev(s)), b8(n ^ 16), b8(n ^ 2)],
        'Each hex digit becomes one nibble: ' + h[0] + ' = ' + (n >> 4) + ' = ' + s.slice(0, 4) + ', and ' + h[1] + ' = ' + (n & 15) + ' = ' + s.slice(4) + '.', function () { return b8(rint(0, 255)); });
    } },
    { skill: 'hex and denary', gen: function () {
      var n = rint(26, 255), h = hx(n, 2);
      return num('What is the hexadecimal number ' + h + ' in denary?', n,
        'The left digit is worth 16s and the right digit 1s: ' + h[0] + ' = ' + (n >> 4) + ', ' + h[1] + ' = ' + (n & 15) + '. ' + (n >> 4) + ' &times; 16 + ' + (n & 15) + ' = ' + n + '.');
    } },
    { skill: 'hex and denary', gen: function () {
      var n; do { n = rint(26, 250); } while ((n >> 4) === (n & 15));
      var h = hx(n, 2);
      return mc('Convert the denary number ' + n + ' to hexadecimal.', h, hexWrongs(n).slice(0, 4).concat([hx((n + 16) & 255, 2)]),
        n + ' &divide; 16 = ' + (n >> 4) + ' remainder ' + (n & 15) + '. ' + (n >> 4) + ' is ' + h[0] + ' and ' + (n & 15) + ' is ' + h[1] + ', so ' + n + ' = ' + h + '.', function () { return hx(rint(16, 255), 2); });
    } },
    { skill: 'hex digits', gen: function () {
      var v = rint(10, 15), L = 'ABCDEF';
      return mc('Which single hexadecimal digit represents the denary value ' + v + '?', L[v - 10], [L[(v - 9) % 6], L[(v - 11 + 6) % 6], String(v)],
        'Hex uses A for 10, B for 11, C for 12, D for 13, E for 14 and F for 15, so ' + v + ' is ' + L[v - 10] + '. Writing "' + v + '" would be two digits.');
    } },
    { skill: 'hex digits', gen: function () {
      var v = rint(10, 15), L = 'ABCDEF';
      return num('What is the denary value of the hexadecimal digit ' + L[v - 10] + '?', v, 'Counting on from 9: A = 10, B = 11, C = 12, D = 13, E = 14, F = 15. So ' + L[v - 10] + ' = ' + v + '.');
    } },
    st('why hex', 'A programmer checks a long list of memory addresses. Why are they shown in hexadecimal instead of binary?', ['Each value is shorter, so people misread fewer digits', 'The CPU runs hexadecimal instructions faster', 'Each address needs fewer bits of memory in hexadecimal', 'The CPU cannot read binary addresses'],
      'One hex digit replaces four bits, so values are shorter and easier for people to read, write and check. The computer still stores and processes binary.'),
    st('why hex', 'A student says hexadecimal "takes up less memory than binary". Why is this wrong?', ['Hex is only a way of displaying values; they are still stored in binary of the same length', 'Hex takes up more memory because it uses letters', 'Memory can only store denary numbers', 'Hex values are stored as text, which is always smaller'],
      'Hex is for humans. The same value is held in the same number of bits whether you write it in hex or binary.'),
    st('why hex', 'Why is "hexadecimal is processed faster by the CPU" a wrong reason for using hex?', ['The CPU only ever works in binary, whatever notation people use', 'The CPU actually processes denary faster', 'Hexadecimal cannot be used in programs', 'The CPU turns hex into analogue signals'],
      'Processors work with binary. Hexadecimal makes no difference to speed; it only makes values easier for people to handle.'),
    st('hex digits', 'What number base is hexadecimal?', ['16', '10', '4', '6'],
      'Hexadecimal is base 16: it uses 16 digits, 0 to 9 and A to F. Denary is base 10. Each hex digit stands for 4 bits, and there are 6 letters, but neither is the base.'),
    st('hex digits', 'Why does exactly one hexadecimal digit match one nibble?', ['A nibble has 4 bits, and 2<sup>4</sup> = 16, the number of hex digits', 'A nibble has 16 bits, one for each hex digit', 'Hexadecimal digits are always stored in 4 bytes', 'Both start counting from 1'],
      'Four bits give 16 different patterns (0000 to 1111), which is exactly one for each hex digit 0 to F.'),
    { skill: 'binary to hex', gen: function () {
      var b = pick([8, 16, 24, 32, 40, 64]);
      return num('How many hexadecimal digits are needed to write a ' + b + '-bit binary value?', b / 4, 'Each hex digit stands for 4 bits, so ' + b + ' &divide; 4 = ' + (b / 4) + ' hex digits.', 'digits');
    } },
    { skill: 'binary to hex', gen: function () {
      var n; do { n = rint(160, 255); } while ((n & 15) > 9 || (n >> 4) === (n & 15));
      var h = hx(n, 2), wrong = String(n >> 4) + String(n & 15);
      return mc('A student converts ' + b8(n) + ' to hexadecimal and writes ' + wrong + '. The correct answer is ' + h + '. What mistake did the student make?', 'Wrote the denary value of a nibble instead of one hex digit',
        ['Swapped the order of the two hex digits', 'Converted the whole byte to denary', 'Used the wrong letter for the left nibble'],
        'The left nibble is ' + (n >> 4) + ', which must be written as the single digit ' + h[0] + ', not as "' + (n >> 4) + '".');
    } },
    { skill: 'binary to hex', gen: function () {
      var n; do { n = rint(17, 254); } while ((n >> 4) === (n & 15));
      var h = hx(n, 2), wrong = h[1] + h[0];
      return mc('A student converts ' + b8(n) + ' to hexadecimal and writes ' + wrong + '. What went wrong?', 'The two hex digits are in the wrong order',
        ['A nibble was written in denary instead', 'The whole byte was converted to denary', 'Nothing; ' + wrong + ' is correct'],
        'The left nibble gives the left digit. ' + b8(n).slice(0, 4) + ' = ' + h[0] + ' and ' + b8(n).slice(5) + ' = ' + h[1] + ', so the answer is ' + h + ', not ' + wrong + '.');
    } },
    { skill: 'hex and denary', gen: function () {
      var v = []; while (v.length < 4) { var x = rint(16, 255); if (v.indexOf(x) < 0) v.push(x); }
      var mx = Math.max.apply(null, v);
      return mc('Which of these hexadecimal values is the largest?', hx(mx, 2), v.filter(function (x) { return x !== mx; }).map(function (x) { return hx(x, 2); }),
        'In denary: ' + v.map(function (x) { return hx(x, 2) + ' = ' + x; }).join('; ') + '. Compare the left (16s) digit first.');
    } },
    { skill: 'hex and denary', gen: function () {
      var n; do { n = rint(17, 250); } while ((n & 15) !== 15 && (n & 15) !== 9);
      var h = hx(n, 2), h1 = hx(n + 1, 2);
      return mc('A memory counter shows the hexadecimal value ' + h + '. One is added. What does it show now?', h1, [(n & 15) === 9 ? h[0] + '10' : h[0] + '0', hx(n + 16, 2), hx(n - 1, 2)],
        h + ' = ' + n + ', so adding 1 gives ' + (n + 1) + ' = ' + h1 + '.' + ((n & 15) === 15 ? ' After F the digit goes back to 0 and the 16s digit goes up by one.' : ' After 9 comes A, not 10.'), function () { return hx(rint(16, 255), 2); });
    } },
    st('hex digits', 'Which of these is <b>not</b> a valid hexadecimal digit?', ['G', 'F', 'A', '9'], 'Hex digits are 0 to 9 and A to F. There is no G.'),
    { skill: 'hex digits', gen: function () {
      var good = shuf(['A7', 'FF', '90', '3C', 'E1', 'B4', '5D']), bad = shuf(['3G', '1H', 'K2', 'Z9', 'G0']);
      var k = rint(2, 3), opts = good.slice(0, k).concat(bad.slice(0, 5 - k)), flags = opts.map(function (o) { return /^[0-9A-F]+$/.test(o); });
      return multi('Select <b>every</b> valid hexadecimal value.', opts, flags, 'Only the digits 0 to 9 and the letters A to F may be used. Values containing letters after F are not hexadecimal.');
    } },
    { skill: 'binary to hex', gen: function () {
      var n = rint(4096, 65535), s = bits(n, 16), h = hx(n, 4);
      return mc('Convert the 16-bit pattern ' + sp(s) + ' to hexadecimal.', h, [rev(h), h.slice(2) + h.slice(0, 2), hx(n ^ 256, 4)],
        'Take one nibble at a time: ' + [0, 4, 8, 12].map(function (i) { return s.slice(i, i + 4) + ' = ' + h[i / 4]; }).join(', ') + '. So the answer is ' + h + '.', function () { return hx(rint(4096, 65535), 4); });
    } },
    st('hex digits', 'How many different digits does hexadecimal use?', ['16', '15', '10', '6'],
      'Hex uses the 10 digits 0 to 9 plus the 6 letters A to F, which is 16 digits, matching base 16.'),
    { skill: 'binary to hex', gen: function () {
      var v = rint(1, 15), s = bits(v, 4);
      return mc('What is the binary nibble ' + s + ' as a single hexadecimal digit?', hx(v, 1), [hx((v + 1) % 16, 1), hx(parseInt(rev(s), 2), 1) === hx(v, 1) ? hx((v + 3) % 16, 1) : hx(parseInt(rev(s), 2), 1), String(v)],
        s + ' = ' + sumNib(v) + ' = ' + v + ', which is the hex digit ' + hx(v, 1) + '.', function () { return hx(rint(0, 15), 1); });
    } },
    st('hex and denary', 'What is the denary value 16 written in hexadecimal?', ['10', '16', 'F', 'G'],
      'F is 15. One more needs a 1 in the 16s column and 0 units: 10 in hex means 1 &times; 16 + 0 = 16.'),
    { skill: 'hex and denary', gen: function () {
      var n; do { n = rint(30, 250); } while ((n >> 4) === (n & 15) || (n & 15) < 2);
      var h = hx(n, 2), swapped = ((n & 15) << 4) | (n >> 4);
      return mc('A web colour uses the hex value ' + h + ' for its red part. What is this in denary?', String(n), [String(swapped), String((n >> 4) + (n & 15)), String((n >> 4) * 10 + (n & 15))],
        h[0] + ' &times; 16 + ' + h[1] + ' = ' + (n >> 4) + ' &times; 16 + ' + (n & 15) + ' = ' + n + '.', function () { return String(rint(16, 255)); });
    } }
  ] };
  function sumNib(v) { var p = [8, 4, 2, 1].filter(function (x) { return v & x; }); return p.join(' + '); }

  // ======================================================================
  // CSC-T3-09 ASCII and Unicode
  // ======================================================================
  var AL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  B['CSC-T3-09'] = { title: 'ASCII and Unicode character sets', items: [
    { skill: 'finding codes', gen: function () {
      var a = rint(0, 20), b = rint(a + 2, 25);
      return num('The ASCII code for \'' + AL[a] + '\' is ' + (65 + a) + ', and capital letters follow on in alphabetical order. What is the denary ASCII code for \'' + AL[b] + '\'?', 65 + b,
        AL[b] + ' is ' + (b - a) + ' letters after ' + AL[a] + ', so its code is ' + (65 + a) + ' + ' + (b - a) + ' = ' + (65 + b) + '.');
    } },
    { skill: 'finding codes', gen: function () {
      var b = rint(3, 25);
      return num('The ASCII code for \'a\' is 97, and lower-case letters follow on in order. What is the ASCII code for \'' + AL[b].toLowerCase() + '\'?', 97 + b,
        AL[b].toLowerCase() + ' is ' + b + ' letters after a, so its code is 97 + ' + b + ' = ' + (97 + b) + '.');
    } },
    { skill: 'finding codes', gen: function () {
      var d = rint(2, 9);
      return num('The ASCII code for the character \'0\' is 48, and the digit characters follow in order. What is the ASCII code for the character \'' + d + '\'?', 48 + d,
        'Count on ' + d + ' from 48: 48 + ' + d + ' = ' + (48 + d) + '. The character \'' + d + '\' does not have the code ' + d + '.');
    } },
    { skill: 'codes in binary', gen: function () {
      var b; do { b = rint(2, 25); } while (b === 7);   // 'H' is the past-paper letter
      var c = 65 + b;
      return mc('Standard ASCII uses 7 bits. The code for \'A\' is 65 (1000001), and other capital letters follow on in order. Which is the 7-bit ASCII code for \'' + AL[b] + '\'?', bits(c, 7), [bits(c + 1, 7), bits(c - 1, 7), '0' + bits(c, 7), bits(c, 7).slice(1)],
        AL[b] + ' is ' + b + ' letters after A, so its code is 65 + ' + b + ' = ' + c + ' = ' + bits(c, 7) + ' in 7 bits.', function () { return bits(rint(65, 90), 7); });
    } },
    { skill: 'finding codes', gen: function () {
      var b = rint(2, 24), c = 65 + b;
      return mc('Given that \'A\' has the ASCII code 65 and capital letters follow in order, which character has the ASCII code ' + c + '?', AL[b], [AL[b - 1], AL[b + 1], AL[(b + 5) % 26]],
        c + ' &minus; 65 = ' + b + ', so the character is ' + b + ' letters after A, which is ' + AL[b] + '.');
    } },
    { skill: 'finding codes', gen: function () {
      var a = rint(0, 12), b = rint(13, 25);
      return num('Using ASCII, what is the code for \'' + AL[b] + '\' minus the code for \'' + AL[a] + '\'?', b - a,
        'Capital letters have consecutive codes, so the difference is the number of places between them: ' + (65 + b) + ' &minus; ' + (65 + a) + ' = ' + (b - a) + '.');
    } },
    st('ASCII facts', 'How many bits does standard ASCII use for each character?', ['7', '8', '16', '4'],
      'Standard ASCII is a 7-bit code. 8-bit versions are extended ASCII.'),
    st('ASCII facts', 'How many different characters can standard ASCII represent?', ['128', '256', '127', '7'],
      '7 bits give 2<sup>7</sup> = 128 codes, numbered 0 to 127. 7 is the number of bits, and 256 needs 8 bits.'),
    st('ASCII facts', 'A student says standard ASCII has 256 characters. What is the correction?', ['Standard ASCII is 7-bit with 128 characters; 256 is 8-bit extended ASCII', 'Standard ASCII has 65,536 characters', 'Standard ASCII has only 26 characters, one for each letter of the alphabet', 'The student is correct'],
      'Standard ASCII uses 7 bits (2<sup>7</sup> = 128 codes). Using an 8th bit doubles this to 256, which is extended ASCII.'),
    st('Unicode', 'Why was Unicode developed?', ['No older code could represent the characters of every language', 'ASCII files were too small to store on modern computers', 'Computers stopped being able to use 7-bit codes for text', 'To make English text use less storage than it did in ASCII files'],
      'Before Unicode there were many conflicting encodings, and none had enough codes for every language. Unicode gives one standard with far more characters.'),
    st('comparing', 'Which is a benefit of using ASCII rather than Unicode for English text?', ['Each character needs fewer bits, so files are smaller', 'ASCII can show emoji and symbols', 'ASCII can represent every language', 'ASCII has more characters than Unicode, so it is more flexible'],
      'ASCII needs only 7 bits per character (usually stored in one byte), so plain English text takes less space than in a 16-bit Unicode encoding.'),
    { skill: 'Unicode', kind: 'multi', q: 'Select the <b>two</b> statements that together explain why Unicode can encode languages that ASCII cannot.',
      options: ['Unicode uses more bits per character for many characters', 'So it has enough different codes for the characters of almost every language', 'Unicode uses exactly 7 bits for every character', 'Unicode only covers the English alphabet', 'ASCII is newer than Unicode'], answers: [0, 1],
      why: 'More bits per character give many more possible codes, so characters from scripts such as Arabic, Chinese and Hindi all get their own code.' },
    st('Unicode', 'Which statement about Unicode and ASCII is correct?', ['The first 128 Unicode codes are the same as the ASCII codes', 'Unicode and ASCII give completely different codes to English letters', 'Unicode uses fewer bits than ASCII for every character', 'ASCII includes all Unicode characters'],
      'Unicode was designed so that its first 128 codes match ASCII, which keeps older English text compatible.'),
    st('ASCII facts', 'What is a <b>character set</b>?', ['A list of characters, each with its own unique binary code', 'The font and size used to display text', 'All the letters typed in a document', 'A group of 8 bits'],
      'A character set (such as ASCII or Unicode) gives every letter, digit and symbol its own code, so text can be stored in binary.'),
    { skill: 'finding codes', gen: function () {
      var words = ['CAB', 'BED', 'FADE', 'DEAF', 'ACE', 'BAG', 'HEAD', 'CAGE'], w = pick(words), codes = w.split('').map(function (c) { return c.charCodeAt(0); });
      return mc('\'A\' has the ASCII code 65 and capital letters follow in order. Which list of codes stores the word ' + w + '?', codes.join(' '),
        [codes.map(function (c) { return c + 1; }).join(' '), codes.map(function (c) { return c - 1; }).join(' '), codes.slice().reverse().join(' ') === codes.join(' ') ? codes.map(function (c) { return c + 2; }).join(' ') : codes.slice().reverse().join(' ')],
        w.split('').map(function (c) { return c + ' = 65 + ' + (c.charCodeAt(0) - 65) + ' = ' + c.charCodeAt(0); }).join('; ') + '.');
    } },
    { skill: 'finding codes', gen: function () {
      var b = rint(0, 25);
      return num('In ASCII, each lower-case letter\'s code is 32 more than its capital. The code for \'' + AL[b] + '\' is ' + (65 + b) + '. What is the code for \'' + AL[b].toLowerCase() + '\'?', 97 + b,
        (65 + b) + ' + 32 = ' + (97 + b) + '. (Check: a is 97 and ' + AL[b].toLowerCase() + ' is ' + pl(b, 'letters') + ' later.)');
    } },
    st('comparing', 'Which of these could <b>not</b> be stored using standard ASCII?', ['A message written in Arabic script', 'The word HELLO in capitals', 'The number 2024 typed as text', 'A full stop and a comma'],
      'Standard ASCII covers English letters, digits and common punctuation. Characters from other scripts need Unicode.'),
    st('comparing', 'The same English sentence is saved using ASCII and using UTF-16 (Unicode). Why is the UTF-16 file larger?', ['UTF-16 uses at least 16 bits per character, more than ASCII', 'UTF-16 adds extra words to the sentence', 'ASCII files are always compressed', 'UTF-16 stores each character twice'],
      'ASCII needs 7 bits (usually one byte) per character, while UTF-16 uses 16 or 32 bits per character, so the same text takes more space.'),
    st('ASCII facts', 'Which statement about ASCII codes for digit characters is correct?', ['The character \'5\' has the code 53, not 5', 'The character \'5\' has the code 5', 'Digit characters are not included in ASCII', 'Digits share the same codes as the letters A to J'],
      'Digit characters have their own codes, starting at 48 for \'0\'. So \'5\' is 48 + 5 = 53.'),
    { skill: 'codes in binary', gen: function () {
      var b = rint(1, 25), c = 65 + b;
      return mc('\'A\' is 65 in ASCII and capital letters follow in order. Which capital letter has the 7-bit code ' + bits(c, 7) + '?', AL[b], [AL[(b + 1) % 26], AL[b - 1], AL[(b + 7) % 26]],
        bits(c, 7) + ' = ' + c + '. ' + c + ' &minus; 65 = ' + b + ', so it is the letter ' + pl(b, 'places') + ' after A: ' + AL[b] + '.');
    } },
    st('Unicode', 'Which of these can Unicode represent that standard ASCII cannot?', ['Emoji such as a smiley face', 'Capital letter A', 'The digit 7', 'A question mark'],
      'Unicode includes symbols and emoji as well as the characters of almost every language. The other three are already in ASCII.'),
    st('ASCII facts', 'What is the highest code in standard ASCII?', ['127', '128', '255', '65'],
      'With 7 bits the codes run from 0 (0000000) to 127 (1111111), giving 128 characters.')
  ] };

  // ======================================================================
  // CSC-T3-15 Run-length encoding
  // ======================================================================
  function runs(s) { var r = []; for (var i = 0; i < s.length; i++) { if (r.length && r[r.length - 1][0] === s[i]) r[r.length - 1][1]++; else r.push([s[i], 1]); } return r; }
  function enc(r, letterFirst) { return r.map(function (x) { return letterFirst ? x[0] + x[1] : x[1] + x[0]; }).join(' '); }
  function mkString(a, b, nRuns, maxLen) { var s = '', c = pick([a, b]); for (var i = 0; i < nRuns; i++) { s += new Array(rint(1, maxLen) + 1).join(c); c = c === a ? b : a; } return s; }
  function rleWrongs(s, r) {
    var tot = {}; s.split('').forEach(function (c) { tot[c] = (tot[c] || 0) + 1; });
    var totals = Object.keys(tot).map(function (c) { return tot[c] + c; }).join(' ');
    var off = r.map(function (x) { return x.slice(); }); var k = rint(0, off.length - 1); off[k][1] += 1;
    var mixed = r.map(function (x, i) { return i % 2 ? x[0] + x[1] : x[1] + x[0]; }).join(' ');
    var off2 = r.map(function (x) { return x.slice(); }); var k2 = (k + 1) % off2.length; off2[k2][1] = Math.max(1, off2[k2][1] - 1) === off2[k2][1] ? off2[k2][1] + 2 : off2[k2][1] - 1;
    return [totals, enc(off), mixed, enc(off2)];
  }
  var PAIRS = [['R', 'G'], ['X', 'O'], ['W', 'K'], ['Y', 'N'], ['P', 'T']];
  function gridSvg(rowsArr, cell) {
    cell = cell || 22; var w = rowsArr[0].length * cell, h = rowsArr.length * cell, g = '';
    rowsArr.forEach(function (row, r) { row.split('').forEach(function (c, i) { g += '<rect x="' + (i * cell + 30) + '" y="' + (r * cell + 4) + '" width="' + cell + '" height="' + cell + '" fill="' + (c === 'B' ? INK : '#ffffff') + '" stroke="' + GREY + '"/>'; }); g += '<text x="20" y="' + (r * cell + 4 + cell * 0.7) + '" font-size="11" text-anchor="end" fill="' + INK + '">' + (r + 1) + '</text>'; });
    return '<svg viewBox="0 0 ' + (w + 40) + ' ' + (h + 10) + '" role="img" aria-label="Pixel grid of black and white squares with numbered rows">' + g + '</svg>';
  }
  function bwRow(n) { var s; do { s = ''; while (s.length < n) { var c = pick(['B', 'W']); s += new Array(rint(1, 4) + 1).join(c); } s = s.slice(0, n); } while (runs(s).length < 3); return s; }
  B['CSC-T3-15'] = { title: 'Run-length encoding (RLE)', items: [
    { skill: 'encoding a string', gen: function () {
      var p = pick(PAIRS), s = mkString(p[0], p[1], rint(5, 6), 6), r = runs(s);
      return mc('Compress this string using run-length encoding, writing each run as count then symbol:<br><code>' + s + '</code>', enc(r), rleWrongs(s, r),
        'Count each separate run from left to right: ' + r.map(function (x) { return x[1] + ' &times; ' + x[0]; }).join(', ') + '. That gives ' + enc(r) + '.');
    } },
    { skill: 'encoding an image', gen: function () {
      var row = bwRow(10), r = runs(row);
      return mc('One row of a black and white icon is shown below (B = black, W = white).<br>' + table(null, [row.split('')]) + 'Which is the run-length encoding of this row, as count then colour?', enc(r), rleWrongs(row, r),
        'Read the row from left to right and count each run: ' + enc(r) + '.');
    } },
    { skill: 'encoding an image', gen: function () {
      var g = [bwRow(8), bwRow(8), bwRow(8), bwRow(8)], k = rint(0, 3), r = runs(g[k]);
      var colStr = g.map(function (row) { return row[0]; }).join('') + g.map(function (row) { return row[1]; }).join('');
      var w = rleWrongs(g[k], r); w[0] = enc(runs(colStr));
      return { kind: 'mcq', q: 'The 8 &times; 4 pixel grid uses B for black and W for white pixels. Which is the run-length encoding of <b>row ' + (k + 1) + '</b>, written as count then colour?', svg: gridSvg(g),
        options: [enc(r)].concat(w.filter(function (x) { return x !== enc(r); }).slice(0, 3)), answer: 0,
        why: 'Read along row ' + (k + 1) + ' from left to right (not down the columns): ' + g[k].split('').join(' ') + ', giving ' + enc(r) + '.' };
    } },
    { skill: 'decoding', gen: function () {
      var p = pick(PAIRS), s = mkString(p[0], p[1], rint(4, 5), 5), r = runs(s);
      var w1 = s.split('').reverse().join(''), r2 = r.map(function (x) { return x.slice(); }); r2[0][1] += 1;
      var w2 = r2.map(function (x) { return new Array(x[1] + 1).join(x[0]); }).join(''), w3 = r.map(function (x) { return x[0] + new Array(x[1]).join(x[0]); }).join('').slice(0, -1);
      return mc('Decode this run-length encoded data: <code>' + enc(r) + '</code>', '<code>' + s + '</code>', ['<code>' + w1 + '</code>', '<code>' + w2 + '</code>', '<code>' + w3 + '</code>'],
        'Write each symbol the number of times shown: ' + r.map(function (x) { return x[1] + x[0] + ' &rarr; ' + new Array(x[1] + 1).join(x[0]); }).join(', ') + '.', function () { return '<code>' + mkString(p[0], p[1], 5, 4) + '</code>'; });
    } },
    { skill: 'counting runs', gen: function () {
      var p = pick(PAIRS), s = mkString(p[0], p[1], rint(5, 9), 5), n = runs(s).length;
      return num('How many separate runs are there in the string <code>' + s + '</code>?', n, 'A new run starts every time the symbol changes. The runs are ' + runs(s).map(function (x) { return new Array(x[1] + 1).join(x[0]); }).join(' | ') + ', so there are ' + n + '.', 'runs');
    } },
    { skill: 'counting runs', gen: function () {
      var p = pick(PAIRS), s = mkString(p[0], p[1], rint(4, 6), 14), r = runs(s), e = r.map(function (x) { return x[1] + x[0]; }).join(''), n = e.length;
      return num('The string <code>' + s + '</code> is run-length encoded as count then symbol, with no spaces. How many characters long is the encoded version?', n,
        'The encoding is ' + e + '. Counts of 10 or more take two digits. That is ' + n + ' characters, compared with ' + s.length + ' in the original.', 'characters');
    } },
    { skill: 'decoding', gen: function () {
      var r = [], c = pick(['B', 'W']); for (var i = 0; i < rint(4, 6); i++) { r.push([c, rint(1, 7)]); c = c === 'B' ? 'W' : 'B'; }
      var tot = r.reduce(function (a, x) { return a + x[1]; }, 0);
      return num('A row of pixels is stored as <code>' + enc(r) + '</code> (B = black, W = white). How many pixels wide is the row?', tot, 'Add the counts: ' + r.map(function (x) { return x[1]; }).join(' + ') + ' = ' + tot + ' pixels.', 'pixels');
    } },
    { skill: 'suitability', gen: function () {
      var data = pick(['3829175064', 'QWERTYUIOP', '4.71 9.03 2.68 5.14', 'K7P2M9X4R1']);
      return mc('Run-length encoding is applied to this data: <code>' + data + '</code>. What is the most likely effect?', 'The file gets bigger, because almost every run is only one symbol long',
        ['The file gets much smaller, because RLE always compresses', 'The file stays exactly the same size', 'Some of the data is lost, because RLE is lossy'],
        'Very few symbols repeat next to each other, so nearly every symbol becomes a run of 1 and gains a count, making the data longer.');
    } },
    st('suitability', 'Is run-length encoding lossy or lossless?', ['Lossless, because decoding gives back exactly the original data', 'Lossy, because the counts replace the original symbols', 'Lossy, because it only works on images', 'Neither; it is a type of encryption'],
      'RLE stores each run as a count and a symbol, so the original can always be rebuilt exactly.'),
    st('suitability', 'Which type of image is RLE best suited to?', ['A simple cartoon with large areas of one colour', 'A detailed photograph of a forest', 'A random pattern of coloured dots', 'A noisy scan of an old newspaper'],
      'RLE saves space when there are long runs of the same value. A cartoon with big blocks of colour has many long runs.'),
    st('suitability', 'Why does RLE usually work badly on photographs?', ['Neighbouring pixels are rarely exactly the same colour, so runs are very short', 'Photographs use too few colours', 'RLE can only compress text', 'Photographs are always already lossless'],
      'Photos have gradual changes and fine detail, so long runs of identical pixels are rare and RLE cannot save much (it may even add data).'),
    { skill: 'suitability', gen: function () {
      var p = pick(PAIRS), best = new Array(rint(6, 9) + 1).join(p[0]) + new Array(rint(6, 9) + 1).join(p[1]);
      var others = [mkString(p[0], p[1], 8, 2), p[0] + p[1] + p[0] + p[1] + p[0] + p[1] + p[0] + p[1] + p[0], mkString(p[0], p[1], 6, 3)];
      return mc('Which string would be compressed the most by run-length encoding?', '<code>' + best + '</code>', others.map(function (x) { return '<code>' + x + '</code>'; }),
        best + ' has only two long runs, so it becomes ' + enc(runs(best)) + '. The others have many short runs.', function () { return '<code>' + mkString(p[0], p[1], 7, 2) + '</code>'; });
    } },
    { skill: 'counting runs', gen: function () {
      var p = pick(PAIRS), s = new Array(rint(6, 9) + 1).join(p[0]) + new Array(rint(1, 3) + 1).join(p[1]) + new Array(rint(6, 9) + 1).join(p[0]), e = runs(s).map(function (x) { return x[1] + x[0]; }).join('');
      return num('The string <code>' + s + '</code> is encoded with RLE (count then symbol, no spaces). How many characters shorter is the encoded version than the original?', s.length - e.length,
        'Encoded: ' + e + ' (' + e.length + ' characters). Original: ' + s.length + ' characters. Saving: ' + s.length + ' &minus; ' + e.length + ' = ' + (s.length - e.length) + '.', 'characters');
    } },
    st('encoding a string', 'A student compresses WWWBBWWWW as 7W 2B. What mistake was made?', ['Counted the total of each colour instead of each separate run', 'Wrote the symbol before the count', 'Miscounted the black run', 'Read the data from right to left'],
      'RLE records each run in order: 3W 2B 4W. Adding all the Ws together loses where they were.'),
    { skill: 'encoding a string', gen: function () {
      var p = pick(PAIRS), s = mkString(p[0], p[1], 5, 6), r = runs(s), k = rint(0, r.length - 1), bad = r.map(function (x) { return x.slice(); });
      bad[k][1] = bad[k][1] > 1 ? bad[k][1] - 1 : bad[k][1] + 1;
      var ord = ['first', 'second', 'third', 'fourth', 'fifth'];
      return mc('A student encodes <code>' + s + '</code> as ' + enc(bad) + '. Which run has been miscounted?', 'The ' + ord[k] + ' run', ord.filter(function (_, i) { return i !== k; }).slice(0, 4).map(function (o) { return 'The ' + o + ' run'; }).slice(0, 3),
        'The correct encoding is ' + enc(r) + '. The ' + ord[k] + ' run is ' + r[k][1] + r[k][0] + ', not ' + bad[k][1] + bad[k][0] + '.');
    } },
    st('decoding', 'Why can data compressed with RLE be decoded back to exactly the original?', ['Each count and symbol tells you exactly how many of each symbol to write, in order', 'RLE keeps a hidden copy of the original file', 'RLE only removes data that is not needed', 'The decoder guesses the most likely pattern'],
      'Nothing is thrown away. Expanding every count-symbol pair, in order, rebuilds the data exactly.'),
    { skill: 'encoding a string', gen: function () {
      var p = pick(PAIRS), s = mkString(p[0], p[1], rint(4, 5), 6), r = runs(s);
      var off = r.map(function (x) { return x.slice(); }), k = rint(0, r.length - 1); off[k][1] += 1;
      var tot = {}; s.split('').forEach(function (c) { tot[c] = (tot[c] || 0) + 1; });
      var w = [enc(r), enc(off, true), Object.keys(tot).map(function (c) { return c + tot[c]; }).join(' '), r.map(function (x, i) { return i % 2 ? x[1] + x[0] : x[0] + x[1]; }).join(' ')];
      return mc('Compress <code>' + s + '</code> with RLE, writing each run as <b>symbol then count</b>.', enc(r, true), w,
        'Keep the same order for every run: symbol first, then how many. ' + enc(r, true) + '.');
    } },
    { skill: 'suitability', kind: 'multi', q: 'An 8 &times; 8 icon has a white background and a large black square in the middle. Select the <b>two</b> points that together explain why RLE is a good choice for it.',
      options: ['Each row has long runs of the same colour', 'So each run can be stored as one count and one colour, saving a lot of space', 'RLE makes the icon more colourful', 'RLE removes the pixels that are not needed', 'RLE is a lossy method, so the file is tiny'], answers: [0, 1],
      why: 'Long runs of identical pixels are exactly what RLE shortens: a run of 6 white pixels becomes just "6W".' },
    { skill: 'decoding', gen: function () {
      var r = [], c = pick(['B', 'W']); for (var i = 0; i < rint(4, 6); i++) { r.push([c, rint(1, 6)]); c = c === 'B' ? 'W' : 'B'; }
      var blacks = r.filter(function (x) { return x[0] === 'B'; }).reduce(function (a, x) { return a + x[1]; }, 0);
      return num('A row of an image is stored as <code>' + enc(r) + '</code>, where B is black and W is white. How many black pixels are in the row?', blacks,
        'Add the counts of the B runs only: ' + r.filter(function (x) { return x[0] === 'B'; }).map(function (x) { return x[1]; }).join(' + ') + ' = ' + blacks + '.', 'pixels');
    } },
    st('suitability', 'The word MISSISSIPPI is encoded with RLE as count then letter. What happens to its length?', ['It gets longer: 16 characters instead of 11', 'It gets shorter: 6 characters instead of 11', 'It stays at 11 characters', 'It cannot be encoded with RLE'],
      'The encoding is 1M1I2S1I2S1I2P1I, which is 16 characters. Most runs are only 1 letter long, so adding counts makes it longer.'),
    st('encoding a string', 'In run-length encoding, what is a <b>run</b>?', ['A group of the same symbol next to each other', 'Every symbol of one type anywhere in the data', 'One complete row of an image', 'The number of different colours in an image'],
      'A run is a sequence of identical symbols side by side, such as the four Ts in TTTT. It ends when a different symbol appears.'),
    { skill: 'encoding a string', gen: function () {
      var p = pick(PAIRS), s = new Array(rint(10, 15) + 1).join(p[0]) + new Array(rint(2, 5) + 1).join(p[1]) + new Array(rint(10, 13) + 1).join(p[0]), r = runs(s);
      var w = ['1' + r[0][0] + ' ' + (r[0][1] - 10) + r[0][0] + ' ' + enc(r.slice(1)), enc([[r[0][0], r[0][1] + r[2][1]], r[1]]), enc(r.map(function (x) { return [x[0], x[1] - 1]; }))];
      return mc('Encode <code>' + s + '</code> with RLE, as count then symbol.', enc(r), w,
        'Count each run carefully, including runs of 10 or more: ' + enc(r) + '. The two separate ' + p[0] + ' runs must stay separate.');
    } }
  ] };

  // ======================================================================
  // CSC-T3-07 Logical and arithmetic shifts
  // ======================================================================
  function lsl(n, k) { return (n << k) & 255; }
  function lsr(n, k) { return n >> k; }
  function asr(n, k) { var s = bits(n), fill = new Array(k + 1).join(s[0]); return parseInt((fill + s).slice(0, 8), 2); }
  B['CSC-T3-07'] = { title: 'Logical and arithmetic binary shifts', items: [
    { skill: 'logical shifts', gen: function () {
      var n = rint(5, 250), k = rint(1, 3);
      return mc('Give the result of a <b>logical shift left by ' + k + '</b> on the 8-bit pattern ' + b8(n) + '.', b8(lsl(n, k)), [b8(lsr(n, k)), b8(lsl(n, k + 1)), b8(lsl(n, k) | ((1 << k) - 1)), b8(lsl(n, k - 1))],
        'Move every bit ' + pl(k, 'places') + ' to the left. ' + (k > 1 ? 'The leftmost ' + k + ' bits are lost and ' + k + ' zeros fill' : 'The leftmost bit is lost and a zero fills') + ' the right: ' + b8(lsl(n, k)) + '.', function () { return b8(rint(0, 255)); });
    } },
    { skill: 'logical shifts', gen: function () {
      var n = rint(20, 250), k = rint(1, 3);
      return mc('Give the result of a <b>logical shift right by ' + k + '</b> on the 8-bit pattern ' + b8(n) + '.', b8(lsr(n, k)), [b8(lsl(n, k)), b8(lsr(n, k + 1)), b8(asr(n, k)) === b8(lsr(n, k)) ? b8(lsr(n, k) | 128) : b8(asr(n, k)), b8(lsr(n, k - 1))],
        'Move every bit ' + k + ' place' + (k > 1 ? 's' : '') + ' right. Bits falling off the right are lost and the empty places on the left are filled with 0: ' + b8(lsr(n, k)) + '.', function () { return b8(rint(0, 255)); });
    } },
    { skill: 'arithmetic shifts', gen: function () {
      var n = rint(129, 254), k = rint(1, 3);
      return mc('Give the result of an <b>arithmetic shift right by ' + k + '</b> on the 8-bit pattern ' + b8(n) + '.', b8(asr(n, k)), [b8(lsr(n, k)), b8(lsl(n, k)), b8(asr(n, k + 1)), b8(asr(n, k) ^ 1)],
        'Arithmetic shift right keeps the sign: the leftmost bit (1) is copied into the ' + k + ' empty place' + (k > 1 ? 's' : '') + ' on the left. Result: ' + b8(asr(n, k)) + '.', function () { return b8(rint(128, 255)); });
    } },
    { skill: 'arithmetic shifts', gen: function () {
      var n = rint(20, 126), k = rint(1, 3);
      return mc('Give the result of an <b>arithmetic shift right by ' + k + '</b> on the 8-bit pattern ' + b8(n) + '.', b8(asr(n, k)), [b8(asr(n, k) | (256 - (256 >> k))), b8(lsl(n, k)), b8(lsr(n, k + 1))],
        'The sign bit here is 0, so 0s are copied in on the left, just like a logical shift: ' + b8(asr(n, k)) + '.', function () { return b8(rint(0, 127)); });
    } },
    { skill: 'arithmetic shifts', gen: function () {
      var k = rint(1, 2), n = rint(256 - (256 >> (k + 1)), 254);   // top k+1 bits are 1, so the sign bit is the same under either reading of 'arithmetic'
      return mc('Give the result of an <b>arithmetic shift left by ' + k + '</b> on the 8-bit pattern ' + b8(n) + '.', b8(lsl(n, k)), [b8(lsl(n, k) | ((1 << k) - 1)), b8(asr(n, k)), b8(lsl(n, k + 1)), b8(lsr(n, k))],
        'An arithmetic shift left moves the bits left, loses the leftmost bits and fills the right with 0s. The sign bit is still 1, so the number stays negative. Result: ' + b8(lsl(n, k)) + '.', function () { return b8(rint(0, 255)); });
    } },
    { skill: 'multiply and divide', gen: function () {
      var k = rint(1, 3), n = rint(3, Math.floor(255 / Math.pow(2, k)));
      return num('The unsigned pattern ' + b8(n) + ' (denary ' + n + ') is given a logical shift left by ' + k + '. What is the denary value of the result?', n * Math.pow(2, k),
        'Each place left multiplies by 2, so ' + k + ' place' + (k > 1 ? 's' : '') + ' multiply by ' + Math.pow(2, k) + ': ' + n + ' &times; ' + Math.pow(2, k) + ' = ' + (n * Math.pow(2, k)) + ' (' + b8(n * Math.pow(2, k)) + ').');
    } },
    { skill: 'multiply and divide', gen: function () {
      var k = rint(1, 3), n = rint(30, 250), r = n >> k;
      return num('The unsigned pattern ' + b8(n) + ' (denary ' + n + ') is given a logical shift right by ' + k + '. What is the denary value of the result?', r,
        'Each place right halves the number and any remainder is lost: ' + n + ' &divide; ' + Math.pow(2, k) + ' = ' + R.roundDp(n / Math.pow(2, k), 3) + ', so the result is ' + r + ' (' + b8(r) + ').');
    } },
    { skill: 'multiply and divide', gen: function () {
      var k = rint(1, 4), d = Math.pow(2, k);
      return mc('Which shift has the same effect as dividing an unsigned whole number by ' + d + '?', 'A right shift by ' + k + ' place' + (k > 1 ? 's' : ''),
        ['A left shift by ' + k + ' place' + (k > 1 ? 's' : ''), 'A right shift by ' + d + ' places', 'A right shift by ' + (k + 1) + ' places'],
        'Each right shift halves the value, so dividing by ' + d + ' (= 2<sup>' + k + '</sup>) needs ' + k + ' right shift' + (k > 1 ? 's' : '') + '.');
    } },
    { skill: 'multiply and divide', gen: function () {
      var k = rint(1, 3), m = Math.pow(2, k);
      return mc('Which shift multiplies an unsigned binary number by ' + m + ' (assuming no 1s are lost)?', 'A left shift by ' + k + ' place' + (k > 1 ? 's' : ''),
        ['A right shift by ' + k + ' place' + (k > 1 ? 's' : ''), 'A left shift by ' + m + ' places', 'A left shift by ' + (k + 1) + ' places'],
        'Each left shift doubles the value, so ' + k + ' left shift' + (k > 1 ? 's' : '') + ' multiply by 2<sup>' + k + '</sup> = ' + m + '.');
    } },
    st('logical shifts', 'In a <b>logical</b> shift, what fills the empty places?', ['Always 0s', 'Always 1s', 'Copies of the sign bit', 'The bits that fell off the other end'],
      'A logical shift always brings in 0s, whichever direction it moves.'),
    st('arithmetic shifts', 'Why does an arithmetic shift right copy the sign bit into the empty places?', ['So a negative number stays negative', 'So the result is always larger', 'To turn the number into hexadecimal', 'Because 0s cannot be stored on the left'],
      'In two\'s complement the leftmost bit shows the sign. Copying it keeps negative numbers negative while halving them.'),
    st('effects', 'What happens to the bits that are shifted off the end of an 8-bit register?', ['They are lost', 'They wrap round to the other end', 'They are stored in the next register', 'They are added to the result'],
      'A shift does not change the register size. Bits pushed past the end are lost, which can lose a remainder or cause a wrong result.'),
    { skill: 'arithmetic shifts', gen: function () {
      var n = rint(129, 254), k = rint(1, 3);
      return mc('A student applies an arithmetic shift right by ' + k + ' to ' + b8(n) + ' and writes ' + b8(lsr(n, k)) + '. What mistake was made?', 'Filled the empty places with 0s instead of copying the sign bit',
        ['Shifted left instead of right', 'Shifted by the wrong number of places', 'Kept the bits that should have been lost'],
        'The sign bit is 1, so an arithmetic shift right must fill with 1s: ' + b8(asr(n, k)) + '. Filling with 0s is a logical shift.');
    } },
    { skill: 'effects', gen: function () {
      var k = rint(1, 3), d = Math.pow(2, k), n; do { n = rint(21, 250); } while (n % d === 0);
      return num('The unsigned pattern ' + b8(n) + ' is given a logical shift right by ' + k + '. What is the denary value of the bits that are lost off the right-hand end?', n % d,
        'The last ' + k + ' bit' + (k > 1 ? 's' : '') + ' (' + bits(n).slice(8 - k) + ') fall off. They are worth ' + (n % d) + ', which is the remainder of ' + n + ' &divide; ' + d + '.');
    } },
    { skill: 'arithmetic shifts', gen: function () {
      var k = rint(1, 2), q = rint(5, 31), v = -q * Math.pow(2, k), p = 256 + v;
      return num('The two\'s complement pattern ' + b8(p) + ' represents ' + minus(v) + '. It is given an arithmetic shift right by ' + k + '. What denary value does the result represent?', v / Math.pow(2, k),
        'An arithmetic right shift by ' + k + ' divides by ' + Math.pow(2, k) + ' and keeps the sign: ' + b8(asr(p, k)) + ' = ' + minus(v / Math.pow(2, k)) + '.', '', null, String(v / Math.pow(2, k)));
    } },
    { skill: 'effects', gen: function () {
      var n = rint(130, 250);
      return mc('The unsigned pattern ' + b8(n) + ' (' + n + ') is given a logical shift left by 1. Which statement about the result is correct?', 'It is not ' + (2 * n) + ', because the leftmost 1 was lost',
        ['It is exactly ' + (2 * n) + ', because a left shift doubles', 'It is ' + Math.floor(n / 2) + ', because the number is halved', 'It is negative, because the sign bit changed'],
        'Doubling ' + n + ' would need 9 bits. The leftmost 1 is lost, so the register holds ' + b8(lsl(n, 1)) + ' = ' + lsl(n, 1) + ', a wrong result.');
    } },
    st('multiply and divide', 'Shifting an unsigned binary number right by 3 places has what effect?', ['It divides the number by 8, losing any remainder', 'It divides the number by 3', 'It multiplies the number by 8', 'It subtracts 3 from the number'],
      'Each right shift halves the value: three shifts divide by 2 &times; 2 &times; 2 = 8.'),
    { skill: 'logical shifts', gen: function () {
      var n; do { n = rint(1, 60); } while (n % 2 === 0);
      var k = rint(1, 2), m = lsl(n, k);
      return num('The pattern ' + b8(n) + ' becomes ' + b8(m) + ' after a logical shift left. By how many places was it shifted?', k,
        'Every bit has moved ' + k + ' place' + (k > 1 ? 's' : '') + ' left and ' + k + ' zero' + (k > 1 ? 's have' : ' has') + ' appeared on the right.', 'places', null, pl(k, 'places'));
    } },
    { skill: 'arithmetic shifts', gen: function () {
      var n = rint(129, 250), k = rint(2, 3), res = b8(asr(n, k));
      return mc('The pattern ' + b8(n) + ' becomes ' + res + '. Which shift was applied?', 'Arithmetic shift right by ' + k, ['Logical shift right by ' + k, 'Arithmetic shift right by ' + (k - 1), 'Logical shift left by ' + k],
        'The bits moved ' + k + ' places right and the new places on the left were filled with 1s, copies of the sign bit. That is an arithmetic right shift.');
    } },
    st('effects', 'A student writes "the bits are shifted right" to describe dividing by 4. Why is this not a full answer?', ['It does not say how many places (2)', 'It should say the bits are shifted left', 'Dividing by 4 cannot be done with a shift', 'It should say the bits are added together'],
      'A complete description gives the direction and the number of places: a right shift by 2 places divides by 4.'),
    st('arithmetic shifts', 'How does an arithmetic shift <b>left</b> compare with a logical shift left?', ['Both fill the empty places on the right with 0s', 'An arithmetic left shift fills with 1s', 'An arithmetic left shift copies the sign bit into the right', 'An arithmetic left shift moves bits right instead'],
      'For left shifts, both types bring 0s into the right-hand end. The two types differ on right shifts, where an arithmetic shift copies the sign bit into the left.'),
    { skill: 'logical shifts', gen: function () {
      var n = rint(129, 254), res = b8(n & 127);
      return mc('The pattern ' + b8(n) + ' is given a logical shift left by 1, then a logical shift right by 1. What is the final pattern?', res, [b8(n), b8(lsl(n, 1)), b8(lsr(n, 1))],
        'The left shift gives ' + b8(lsl(n, 1)) + ', losing the leftmost 1. Shifting back right brings in a 0 on the left: ' + res + '. The lost bit does not come back.', function () { return b8(rint(0, 255)); });
    } }
  ] };

  // ======================================================================
  // CSC-T3-21 Pigpen
  // ======================================================================
  var PG = {};
  'ABCDEFGHI'.split('').forEach(function (l, i) { PG[l] = { g: 1, dot: false, i: i }; });
  'JKLMNOPQR'.split('').forEach(function (l, i) { PG[l] = { g: 1, dot: true, i: i }; });
  ['S', 'T', 'U', 'V'].forEach(function (l, i) { PG[l] = { g: 0, dot: false, i: ['t', 'l', 'r', 'b'][i] }; });
  ['W', 'X', 'Y', 'Z'].forEach(function (l, i) { PG[l] = { g: 0, dot: true, i: ['t', 'l', 'r', 'b'][i] }; });
  function pgShape(p, x, y, s) {
    var out = '';
    function ln(a, b, c, d) { out += '<line x1="' + a + '" y1="' + b + '" x2="' + c + '" y2="' + d + '" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>'; }
    function dot(a, b) { out += '<circle cx="' + a + '" cy="' + b + '" r="3" fill="' + INK + '"/>'; }
    if (p.g) {
      var r = Math.floor(p.i / 3), c = p.i % 3;
      if (r > 0) ln(x, y, x + s, y); if (r < 2) ln(x, y + s, x + s, y + s); if (c > 0) ln(x, y, x, y + s); if (c < 2) ln(x + s, y, x + s, y + s);
      if (p.dot) dot(x + s / 2, y + s / 2);
    } else {
      var h = s / 2;
      if (p.i === 't') { ln(x, y, x + h, y + s); ln(x + h, y + s, x + s, y); if (p.dot) dot(x + h, y + s * 0.3); }
      if (p.i === 'b') { ln(x, y + s, x + h, y); ln(x + h, y, x + s, y + s); if (p.dot) dot(x + h, y + s * 0.7); }
      if (p.i === 'l') { ln(x, y, x + s, y + h); ln(x + s, y + h, x, y + s); if (p.dot) dot(x + s * 0.3, y + h); }
      if (p.i === 'r') { ln(x + s, y, x, y + h); ln(x, y + h, x + s, y + s); if (p.dot) dot(x + s * 0.7, y + h); }
    }
    return out;
  }
  function pgKey(ox, oy) {
    var out = '', c = 26;
    function t(s, x, y) { out += '<text x="' + x + '" y="' + y + '" font-size="12" text-anchor="middle" fill="' + INK + '">' + s + '</text>'; }
    function ln(a, b, cc, d) { out += '<line x1="' + a + '" y1="' + b + '" x2="' + cc + '" y2="' + d + '" stroke="' + INK + '" stroke-width="1.5"/>'; }
    [0, 1].forEach(function (k) {
      var gx = ox + k * 96, gy = oy;
      ln(gx + c, gy, gx + c, gy + 3 * c); ln(gx + 2 * c, gy, gx + 2 * c, gy + 3 * c); ln(gx, gy + c, gx + 3 * c, gy + c); ln(gx, gy + 2 * c, gx + 3 * c, gy + 2 * c);
      for (var i = 0; i < 9; i++) { var cx = gx + (i % 3) * c + c / 2, cy = gy + Math.floor(i / 3) * c + c / 2; t((k ? 'JKLMNOPQR' : 'ABCDEFGHI')[i], cx, cy + (k ? 0 : 4)); if (k) out += '<circle cx="' + cx + '" cy="' + (cy + 7) + '" r="2" fill="' + INK + '"/>'; }
    });
    [0, 1].forEach(function (k) {
      var gx = ox + 192 + k * 96, gy = oy, s = 78, L = k ? 'WXYZ' : 'STUV';
      ln(gx, gy, gx + s, gy + s); ln(gx + s, gy, gx, gy + s);
      var pos = [[s / 2, 18], [15, s / 2 + 4], [s - 15, s / 2 + 4], [s / 2, s - 10]];
      pos.forEach(function (p, i) { t(L[i], gx + p[0], gy + p[1] - (k ? 3 : 0)); if (k) out += '<circle cx="' + (gx + p[0]) + '" cy="' + (gy + p[1] + 4) + '" r="2" fill="' + INK + '"/>'; });
    });
    return out;
  }
  function pgSvg(groups, label) {
    // groups: array of { label: 'A', letters: 'XYZ' } rows drawn under the key
    var W = 380, top = 96, rowH = 46, H = top + groups.length * rowH + 6, out = pgKey(8, 6);
    groups.forEach(function (g, r) {
      var y = top + r * rowH;
      if (g.label) out += '<text x="16" y="' + (y + 22) + '" font-size="13" font-weight="bold" text-anchor="middle" fill="' + RED + '">' + g.label + '</text>';
      g.letters.split('').forEach(function (l, i) { out += pgShape(PG[l], 40 + i * 44, y + 4, 30); });
    });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + label + '">' + out + '</svg>';
  }
  function pgDotPartner(l) { var p = PG[l]; for (var k in PG) { if (PG[k].g === p.g && PG[k].i === p.i && PG[k].dot !== p.dot) return k; } return l; }
  function pgMirror(l) { var p = PG[l]; for (var k in PG) { var q = PG[k]; if (q.g === p.g && q.dot === p.dot && (p.g ? (Math.floor(q.i / 3) === Math.floor(p.i / 3) && q.i % 3 === 2 - p.i % 3) : ((p.i === 'l' && q.i === 'r') || (p.i === 'r' && q.i === 'l') || (p.i === 't' && q.i === 'b') || (p.i === 'b' && q.i === 't')))) return k; } return l; }
  var PGWORDS = ['MOON', 'FISH', 'KITE', 'DRUM', 'WAVE', 'LAMP', 'JAZZ', 'GOLF', 'ROPE', 'SNOW', 'HILL', 'QUIZ', 'TENT', 'YAWN', 'BOXER', 'CLAY'];
  function pgLabelled(cands, title, word) { var labs = ['1', '2', '3', '4'].map(function (n) { return (word || 'Symbol') + ' ' + n; }); return { svg: pgSvg(cands.map(function (c, i) { return { label: String(i + 1), letters: c }; }), title), labs: labs }; }
  B['CSC-T3-21'] = { title: 'Pigpen cipher', items: [
    { skill: 'letters to symbols', gen: function () {
      var l; do { l = pick(AL.split('')); } while (pgMirror(l) === l || PG[l].i === 4);
      var cands = shuf([l, pgDotPartner(l), pgMirror(l), pick(AL.split('').filter(function (x) { return x !== l && x !== pgDotPartner(l) && x !== pgMirror(l); }))]);
      var f = pgLabelled(cands, 'Pigpen key followed by four candidate symbols numbered 1 to 4', 'Symbol'), k = cands.indexOf(l);
      return { kind: 'mcq', q: 'The figure shows a Pigpen key, then four symbols numbered 1 to 4. Which symbol represents the letter <b>' + l + '</b>?', svg: f.svg,
        options: f.labs, answer: k, why: l + ' is in the ' + (PG[l].g ? (PG[l].dot ? 'dotted grid' : 'plain grid') : (PG[l].dot ? 'dotted X' : 'plain X')) + '. Its symbol is the lines around its cell' + (PG[l].dot ? ', plus a dot' : ', with no dot') + ', which is ' + f.labs[k].toLowerCase() + '.' };
    } },
    { skill: 'symbols to letters', gen: function () {
      var w = pick(PGWORDS), wrongs = [];
      var swapOne = function (fn) { var arr = w.split(''); for (var i = 0; i < arr.length; i++) { var j = (i + rint(0, arr.length - 1)) % arr.length; if (fn(arr[j]) !== arr[j]) { arr[j] = fn(arr[j]); return arr.join(''); } } return null; };
      [swapOne(pgDotPartner), swapOne(pgMirror), swapOne(pgDotPartner), swapOne(pgMirror)].forEach(function (x) { if (x && x !== w && wrongs.indexOf(x) < 0) wrongs.push(x); });
      var q = mc('Use the Pigpen key to decrypt the row of symbols under it.', w, wrongs, 'Match each symbol\'s shape and dot to a cell in the key: ' + w.split('').join(', ') + ' spells ' + w + '. A missing dot or a mirrored shape would give a different letter.',
        function () { var a = w.split(''); var i = rint(0, a.length - 1); a[i] = pick(AL.split('')); return a.join(''); });
      q.svg = pgSvg([{ letters: w }], 'Pigpen key followed by a row of encrypted symbols');
      return q;
    } },
    { skill: 'letters to symbols', gen: function () {
      var w = pick(PGWORDS.filter(function (x) { return x.length === 4; })), alt = [];
      var mut = function (fn) { var a = w.split(''); var i = rint(0, 3); if (fn(a[i]) === a[i]) i = (i + 1) % 4; a[i] = fn(a[i]); return a.join(''); };
      var tries = 0; while (alt.length < 3 && tries++ < 40) { var m = mut(pick([pgDotPartner, pgMirror])); if (m !== w && alt.indexOf(m) < 0) alt.push(m); }
      while (alt.length < 3) { var a2 = w.split(''); a2[rint(0, 3)] = pick(AL.split('')); a2 = a2.join(''); if (a2 !== w && alt.indexOf(a2) < 0) alt.push(a2); }
      var cands = shuf([w].concat(alt)), f = pgLabelled(cands, 'Pigpen key followed by four rows of symbols numbered 1 to 4', 'Row'), k = cands.indexOf(w);
      return { kind: 'mcq', q: 'Which row of symbols, 1 to 4, is the Pigpen encryption of the word <b>' + w + '</b>?', svg: f.svg, options: f.labs, answer: k,
        why: f.labs[k] + ' has the right shape and dot for each letter of ' + w + '. The other rows have a missing or extra dot, or a mirrored shape, in at least one place.' };
    } },
    { skill: 'symbols to letters', gen: function () {
      var l = pick('JKLMNOPQRWXYZ'.split('')), w = [pgDotPartner(l), pgMirror(l) === l ? pgDotPartner(pgMirror(pgDotPartner(l))) : pgMirror(l), pick(AL.split(''))];
      var q = mc('The symbol under the key is from the Pigpen cipher. Which letter does it represent?', l, w, 'The symbol has a dot, so it comes from a dotted grid or the dotted X. Its shape matches the cell for ' + l + '.', function () { return pick(AL.split('')); });
      q.svg = pgSvg([{ letters: l }], 'Pigpen key followed by one encrypted symbol'); return q;
    } },
    st('cipher type', 'Which word best describes the Pigpen cipher?', ['Substitution', 'Transposition', 'Shift', 'Compression'],
      'Each letter is swapped for a symbol, but the order of the message is unchanged. That is a substitution cipher.'),
    st('cipher type', 'Why is the Pigpen cipher <b>not</b> a shift cipher?', ['Letters are replaced by symbols from a grid, not moved along the alphabet', 'It moves every letter three places forward', 'It changes the order of the letters', 'It uses a numeric key between 1 and 25'],
      'A shift cipher (such as Caesar) moves each letter along the alphabet. Pigpen replaces each letter with a drawn symbol.'),
    st('valid keys', 'In the Pigpen cipher, what does a dot inside a symbol show?', ['The letter comes from one of the dotted grids', 'The letter is a vowel', 'The letter should be shifted by one place', 'The symbol is the start of a new word'],
      'The dotted grid and dotted X give a second set of letters the same shapes; the dot tells them apart.'),
    { skill: 'valid keys', kind: 'multi', q: 'Select <b>every</b> requirement that a set of symbols must meet to work as a Pigpen key.',
      options: ['Every letter has a symbol', 'No two letters share the same symbol', 'Every symbol must contain a dot', 'The letters must be in reverse order', 'Every symbol must be a full square'], answers: [0, 1],
      why: 'Every letter must be encryptable, and each symbol must stand for exactly one letter so the message can be decrypted without doubt.' },
    st('valid keys', 'A proposed Pigpen key gives P and Q exactly the same symbol. Is it a valid key?', ['No, because a symbol could mean either P or Q when decrypting', 'Yes, because every letter still has a symbol', 'Yes, because P and Q are rarely used', 'No, because P and Q must be in the dotted X'],
      'Each symbol must be unique. If two letters share one, the receiver cannot tell which letter was meant.'),
    st('valid keys', 'A grid offered as a Pigpen key has symbols for only 24 of the 26 letters. Why is it not valid?', ['Two letters could not be encrypted', 'Pigpen keys must have exactly 20 symbols', 'Some symbols would have two dots', 'The grid must be drawn in colour'],
      'A valid key must give every letter of the alphabet its own symbol, otherwise some messages cannot be written.'),
    st('cipher type', 'What does a receiver need in order to decrypt a Pigpen message?', ['The same key grid that was used to encrypt it', 'The number of rails used', 'The shift value used', 'The length of the original message'],
      'The receiver matches each symbol to a cell in the same grid to find the letter.'),
    st('cipher type', 'Why is the Pigpen cipher easy to break?', ['The same letter always gives the same symbol, and the standard grid is widely known', 'It uses too many different keys', 'It changes the order of the letters randomly', 'The symbols cannot be drawn by hand'],
      'Every E becomes the same symbol, so letter frequencies show through, and anyone who knows the usual grid can read it straight away.'),
    { skill: 'letters to symbols', gen: function () {
      var l = pick(AL.slice(0, 18).split('')), p = PG[l], r = Math.floor(p.i / 3), c = p.i % 3, n = (r > 0) + (r < 2) + (c > 0) + (c < 2);
      return { kind: 'num', q: 'Using the Pigpen key shown, how many straight lines make up the symbol for the letter <b>' + l + '</b>? (Do not count the dot.)', svg: pgSvg([], 'Pigpen key'), answer: n, unit: 'lines',
        why: l + ' is in the ' + ['top', 'middle', 'bottom'][r] + ' row and ' + ['left', 'middle', 'right'][c] + ' column of its grid, so ' + n + ' sides of its cell are drawn.' };
    } },
    { skill: 'letters to symbols', gen: function () {
      var opts = shuf(AL.split('')).slice(0, 5); if (!opts.some(function (l) { return PG[l].dot; })) opts[0] = pick('JKLMNOPQRWXYZ'.split('')); if (opts.every(function (l) { return PG[l].dot; })) opts[0] = pick('ABCDEFGHISTUV'.split(''));
      opts = opts.filter(function (x, i) { return opts.indexOf(x) === i; });
      return { kind: 'multi', q: 'Using the Pigpen key shown, select <b>every</b> letter whose symbol contains a dot.', svg: pgSvg([], 'Pigpen key'), options: opts, answers: opts.map(function (l, i) { return PG[l].dot ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: 'Letters J to R (the second grid) and W to Z (the second X) have dots. A to I and S to V do not.' };
    } },
    st('letters to symbols', 'In the usual Pigpen key, which letter\'s symbol is a complete square with no dot?', ['E', 'N', 'A', 'S'],
      'E sits in the centre cell of the plain grid, so all four sides are drawn. N is in the same place but has a dot.'),
    st('letters to symbols', 'A student draws the symbol for C but it comes out as the symbol for A. What mistake was made?', ['The symbol was drawn as a mirror image, swapping left and right', 'The dot was left out', 'A full square was drawn', 'The letter was shifted by three places'],
      'A and C are in the same row at opposite sides of the grid, so their symbols are mirror images of each other.'),
    st('letters to symbols', 'A student encrypts the letter M but draws the symbol for D. What has gone wrong?', ['The dot was left out', 'The symbol was flipped upside down', 'The wrong grid shape (X instead of square) was used', 'Two letters were swapped round'],
      'M is in the dotted grid in the same position as D in the plain grid. Without the dot, the symbol reads as D.'),
    { skill: 'letters to symbols', gen: function () {
      var l = pick('ABCDEFGHISTUV'.split('')), part = pgDotPartner(l);
      return mc('In the usual Pigpen key, which letter has the same shape of symbol as ' + l + ', but with a dot?', part, [pgMirror(part) === part ? AL[(AL.indexOf(part) + 2) % 26] : pgMirror(part), AL[(AL.indexOf(l) + 1) % 26], AL[(AL.indexOf(part) + 1) % 26]],
        l + ' is in the ' + (PG[l].g ? 'plain grid' : 'plain X') + '. The letter in the same position of the ' + (PG[l].g ? 'dotted grid' : 'dotted X') + ' is ' + part + '.');
    } },
    st('cipher type', 'How does the Pigpen cipher change a message?', ['Each letter is replaced by a symbol; the order stays the same', 'The letters stay the same but their order is changed', 'Every letter is moved a fixed number of places along the alphabet', 'Vowels are removed and the rest are reversed'],
      'Pigpen is a substitution cipher: it swaps each letter for a symbol and keeps the message in the same order.'),
    { skill: 'symbols to letters', gen: function () {
      var w = pick(['STAY', 'VAST', 'WAXY', 'SWAY', 'WAVY', 'ZEST', 'TOYS', 'VOWS']);
      var mut = function () { var a = w.split(''); var i = rint(0, a.length - 1); var f = pick([pgDotPartner, pgMirror]); a[i] = f(a[i]); return a.join(''); };
      var q = mc('Use the Pigpen key to decrypt the symbols under it. Take care with the X-shaped symbols.', w, [mut(), mut(), mut(), mut()], 'The V and chevron shapes come from the X grids: dotted ones are W to Z, plain ones are S to V. The symbols spell ' + w + '.', mut);
      q.svg = pgSvg([{ letters: w }], 'Pigpen key followed by a row of encrypted symbols'); return q;
    } },
    st('valid keys', 'In the usual Pigpen key, which letters are placed in the two X-shaped grids?', ['S to V without dots, and W to Z with dots', 'A to I without dots, and J to R with dots', 'W to Z without dots, and S to V with dots', 'Only the vowels A, E, I, O and U'],
      'The two square grids hold A to I (plain) and J to R (dotted). The two X shapes hold the last eight letters: S to V plain and W to Z dotted.'),
    st('cipher type', 'In a Pigpen message, what is the <b>ciphertext</b>?', ['The row of symbols that is sent', 'The original message in letters', 'The grid used as the key', 'The number of letters in the message'],
      'Ciphertext is the encrypted form of the message. The original letters are the plaintext, and the grid is the key.')
  ] };

  // ======================================================================
  // CSC-T3-18 Caesar cipher
  // ======================================================================
  function shiftWord(w, k) { return w.split('').map(function (c) { return AL[((AL.indexOf(c) + k) % 26 + 26) % 26]; }).join(''); }
  function signK(k) { return k > 0 ? '+' + k : '&minus;' + (-k); }
  var CWORDS = ['LASER', 'QUEST', 'ZEBRA', 'YACHT', 'WHALE', 'MANGO', 'TIGER', 'RIVER', 'PLANT', 'STORM', 'FLAME', 'SWIFT', 'CHAIR', 'NOVEL', 'BRICK', 'OXIDE', 'JUMBO', 'KAYAK', 'MAPLE', 'VIXEN', 'WRIST', 'TOWER'];
  B['CSC-T3-18'] = { title: 'Caesar cipher', items: [
    { skill: 'encrypting', gen: function () {
      var w = pick(CWORDS), k = rint(2, 9) * pick([1, -1]);
      return mc('Encrypt the plaintext <b>' + w + '</b> using a Caesar cipher with a shift of ' + signK(k) + '.', shiftWord(w, k), [shiftWord(w, -k), shiftWord(w, k + (k > 0 ? 1 : -1)), shiftWord(w, k - (k > 0 ? 1 : -1))],
        'Move every letter ' + Math.abs(k) + ' places ' + (k > 0 ? 'forward' : 'back') + ', wrapping round the alphabet where needed: ' + w.split('').map(function (c) { return c + '&rarr;' + shiftWord(c, k); }).join(', ') + '.');
    } },
    { skill: 'decrypting', gen: function () {
      var w = pick(CWORDS), k = rint(2, 9), c = shiftWord(w, k);
      return mc('The ciphertext <b>' + c + '</b> was made with a Caesar shift of +' + k + '. What is the plaintext?', w, [shiftWord(c, k), shiftWord(w, 1), shiftWord(w, -1)],
        'To decrypt, apply the opposite shift (&minus;' + k + '): ' + c.split('').map(function (x) { return x + '&rarr;' + shiftWord(x, -k); }).join(', ') + ', giving ' + w + '.');
    } },
    { skill: 'finding and combining shifts', gen: function () {
      var w = pick(CWORDS), k = rint(1, 25);
      return num('The plaintext ' + w + ' becomes ' + shiftWord(w, k) + ' with a Caesar cipher. What forward shift (from 1 to 25) was used?', k,
        'Compare the first letters: ' + w[0] + ' to ' + shiftWord(w, k)[0] + ' is ' + pl(k, 'places') + ' forward (wrapping round after Z if needed). Every other letter moves by the same amount.', 'places', null, pl(k, 'places'));
    } },
    { skill: 'finding and combining shifts', gen: function () {
      var a, b; do { a = rint(-12, 12); b = rint(-12, 12); } while (a === 0 || b === 0 || a + b === 0 || Math.abs(a + b) > 25 || a === b);
      return num('A message is encrypted with a Caesar shift of ' + signK(a) + ', and the result is encrypted again with a shift of ' + signK(b) + '. What single shift gives the same ciphertext? (Use a minus sign for a backward shift.)', a + b,
        'Shifts in a row add together: ' + signK(a) + ' + (' + signK(b) + ') = ' + signK(a + b) + '.', '', null, String(a + b));
    } },
    { skill: 'wrap-around errors', gen: function () {
      var w, k, idx;
      do { w = pick(CWORDS); k = rint(3, 9); idx = w.split('').map(function (c, i) { return AL.indexOf(c) + k > 25 ? i : -1; }).filter(function (i) { return i >= 0; }); } while (idx.length !== 1 || new Set(w.split('')).size !== w.length);
      var i = idx[0], good = shiftWord(w, k), bad = good.split(''); bad[i] = AL[(AL.indexOf(w[i]) + k - 1) % 26]; bad = bad.join('');
      var others = shuf(w.split('').filter(function (_, j) { return j !== i; })).slice(0, 3);
      return mc('An algorithm encrypts ' + w + ' with a shift of +' + k + ' and outputs ' + bad + '. The correct ciphertext is ' + good + '. Which plaintext letter was encrypted incorrectly?', 'The letter ' + w[i], others.map(function (o) { return 'The letter ' + o; }),
        w[i] + ' + ' + k + ' passes Z, so it must wrap round to the start: ' + w[i] + ' becomes ' + good[i] + '. The algorithm gave ' + bad[i] + ', so its wrap-around is out by one place.');
    } },
    { skill: 'wrap-around errors', gen: function () {
      var l = pick('UVWXYZ'.split('')), k = rint(26 - AL.indexOf(l), 9);
      if (AL.indexOf(l) + k <= 25) k = 26 - AL.indexOf(l) + rint(0, 3);
      var r = shiftWord(l, k);
      return mc('Using a Caesar shift of +' + k + ', what does the letter ' + l + ' become?', r, [shiftWord(l, k - 1), shiftWord(l, k + 1), shiftWord(l, -k)],
        'Count ' + pl(k, 'places') + ' on from ' + l + ', going from Z back to A: ' + l + ' &rarr; ' + r + '.');
    } },
    st('weakness', 'Which is the best explanation of why the Caesar cipher is weak?', ['There are only 25 useful shifts, so an attacker can try them all quickly', 'The ciphertext is always longer than the plaintext', 'It can only be used with capital letters', 'It needs a computer to encrypt a message'],
      'With so few possible keys, a brute-force attack (trying every shift) breaks it in seconds.'),
    st('weakness', 'How can letter frequency help to break a Caesar cipher?', ['The most common ciphertext letter probably stands for E, which reveals the shift', 'Counting letters tells you the number of rails', 'It shows which symbols have dots', 'It makes the ciphertext longer and easier to read'],
      'E is the most common letter in English. If, say, H appears most often in the ciphertext, the shift is probably +3.'),
    st('weakness', 'In a Caesar cipher, what is the <b>key</b>?', ['The number of places each letter is shifted', 'The first letter of the message', 'The length of the message', 'The grid of symbols'],
      'The shift (for example +4) is the secret the sender and receiver share. Knowing it lets you decrypt.'),
    st('decrypting', 'A message was encrypted with a Caesar shift of +7. How is it decrypted?', ['Apply a shift of &minus;7', 'Apply a shift of +7 again', 'Reverse the order of the letters', 'Apply a shift of +26'],
      'Decryption undoes encryption, so each letter is moved 7 places back (equivalent to +19).'),
    st('weakness', 'How many shifts of a Caesar cipher actually change the message?', ['25', '26', '24', '13'],
      'A shift of 0 or 26 leaves every letter unchanged, so only shifts 1 to 25 are useful keys.'),
    { skill: 'encrypting', gen: function () {
      var w = pick(CWORDS), k = -rint(3, 12);
      return mc('Encrypt <b>' + w + '</b> using a Caesar shift of ' + signK(k) + '.', shiftWord(w, k), [shiftWord(w, -k), shiftWord(w, k + 1), shiftWord(w, k - 1)],
        'A negative shift moves each letter back ' + (-k) + ' places, wrapping from A to Z where needed: ' + shiftWord(w, k) + '.');
    } },
    { skill: 'finding and combining shifts', gen: function () {
      var w = pick(CWORDS), a, b; do { a = rint(-9, 9); b = rint(-9, 9); } while (a === 0 || b === 0 || a + b === 0 || a === b || Math.abs(a + b) === 13);
      return mc('The plaintext ' + w + ' is shifted by ' + signK(a) + ' and then by ' + signK(b) + '. How does the result compare with a single shift of ' + signK(a + b) + '?', 'They are the same: both give ' + shiftWord(w, a + b),
        ['They differ: the two shifts give ' + shiftWord(w, a - b), 'They differ: the single shift gives ' + shiftWord(w, -(a + b)), 'They differ: the two shifts give ' + shiftWord(w, [a, b, a + b + 1].filter(function (x) { return [a - b, -(a + b), a + b].every(function (y) { return ((x - y) % 26 + 26) % 26 !== 0; }); })[0])],
        'Shifts add together, so ' + signK(a) + ' then ' + signK(b) + ' is one shift of ' + signK(a + b) + '. Both give ' + shiftWord(w, a + b) + '.');
    } },
    { skill: 'decrypting', gen: function () {
      var w = pick(['TIGER', 'RIVER', 'PLANT', 'STORM', 'CHAIR', 'BRICK', 'TOWER', 'WHALE']), k = rint(3, 22), c = shiftWord(w, k);
      var isShift = function (x) { for (var j = 0; j < 26; j++) if (shiftWord(x, j) === c) return true; return false; };
      var pool = ['TABLE', 'CANDY', 'GRAPE', 'SHEEP', 'HOUSE', 'LEMON', 'MOUSE', 'PAPER', 'TRAIN', 'SUGAR', 'BREAD', 'ROBIN'].filter(function (x) { return x !== w && !isShift(x); });
      return mc('An attacker tries every Caesar shift on the ciphertext <b>' + c + '</b>. Which of these words could be the plaintext?', w, shuf(pool).slice(0, 3),
        'Shifting ' + c + ' back by ' + k + ' gives ' + w + '. The other words cannot be made from ' + c + ' by moving every letter the same amount (their gaps between letters differ).');
    } },
    { skill: 'finding and combining shifts', gen: function () {
      var k = rint(1, 25);
      return num('A Caesar shift of +' + k + ' gives exactly the same result as which backward shift? Give a negative number.', k - 26,
        'Going forward ' + k + ' or back ' + (26 - k) + ' lands on the same letter, because ' + k + ' + ' + (26 - k) + ' = 26, a full trip round the alphabet. So the answer is &minus;' + (26 - k) + '.', '', null, String(k - 26));
    } },
    st('finding and combining shifts', 'What happens if a Caesar cipher uses a shift of +26?', ['Every letter returns to itself, so the message is unchanged', 'Every letter becomes Z', 'The message is reversed', 'The shift is too large and causes an error'],
      'There are 26 letters, so moving 26 places brings each letter all the way round to itself.'),
    { skill: 'encrypting', gen: function () {
      var l = pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')), k = rint(1, 25);
      return mc('What is the letter ' + l + ' after a Caesar shift of +' + k + '?', shiftWord(l, k), [shiftWord(l, k + 1), shiftWord(l, -k), shiftWord(l, k - 1)],
        l + ' is letter ' + (AL.indexOf(l) + 1) + '. Moving ' + pl(k, 'places') + ' forward (wrapping after Z) gives ' + shiftWord(l, k) + '.');
    } },
    st('encrypting', 'In a Caesar cipher, what is the <b>plaintext</b>?', ['The original readable message', 'The encrypted message', 'The shift value', 'The list of every possible shift'],
      'Plaintext is the message before encryption. After shifting, it becomes ciphertext.'),
    { skill: 'wrap-around errors', gen: function () {
      var w = pick(CWORDS), k = -rint(2, 8), wrong = shiftWord(w, -k);
      return mc('A student is asked to encrypt ' + w + ' with a shift of ' + signK(k) + ' and writes ' + wrong + '. What mistake was made?', 'Shifted the letters forward instead of back',
        ['Forgot to wrap round from Z to A', 'Used a shift of one place too many', 'Shifted only the first letter'],
        'A negative shift means moving back along the alphabet. The correct ciphertext is ' + shiftWord(w, k) + '; ' + wrong + ' is what a shift of +' + (-k) + ' gives.');
    } },
    { skill: 'finding and combining shifts', gen: function () {
      var k = rint(2, 20), pairs = [], good = shuf(['GLOW', 'DUST', 'FERN', 'MILK', 'BOLT', 'JUMP']).slice(0, 3);
      good.forEach(function (p) { pairs.push(p + ' &rarr; ' + shiftWord(p, k)); });
      var odd = pick(['HARP', 'WICK', 'NEST']), oc = shiftWord(odd, k).split(''); oc[2] = AL[(AL.indexOf(oc[2]) + 1) % 26]; oc = oc.join('');
      return mc('Three of these pairs were made with the same Caesar shift. Which pair could <b>not</b> have been made with any single Caesar shift?', odd + ' &rarr; ' + oc, pairs,
        'In a Caesar cipher every letter moves by the same amount. In ' + odd + ' &rarr; ' + oc + ', the third letter moves one place more than the others.');
    } },
    st('weakness', 'What type of cipher is the Caesar cipher?', ['A substitution cipher, because each letter is replaced by another letter', 'A transposition cipher, because the letters are rearranged', 'A compression method, because it shortens the text', 'A hashing method, because it cannot be reversed'],
      'Each letter is swapped for the letter a fixed distance away, but the order of the letters stays the same.'),
    { skill: 'decrypting', gen: function () {
      var w = pick(CWORDS), k = -rint(3, 11), c = shiftWord(w, k);
      return mc('The ciphertext <b>' + c + '</b> was made using a Caesar shift of ' + signK(k) + '. What is the plaintext?', w, [shiftWord(c, k), shiftWord(w, 2), shiftWord(w, -2)],
        'The message was shifted back ' + (-k) + ', so decrypt by shifting forward ' + (-k) + ': ' + c + ' &rarr; ' + w + '.');
    } }
  ] };

  // ======================================================================
  // CSC-T3-20 Rail Fence
  // ======================================================================
  function railRows(n, k) { var r = [], row = 0, dir = 1; for (var i = 0; i < n; i++) { r.push(row); if (k > 1) { if (row === 0) dir = 1; else if (row === k - 1) dir = -1; row += dir; } } return r; }
  function rails(t, k) { var rr = railRows(t.length, k), out = []; for (var j = 0; j < k; j++) out.push(''); t.split('').forEach(function (c, i) { out[rr[i]] += c; }); return out; }
  function rf(t, k) { return rails(t, k).join(''); }
  function rfColumnar(t, k) { var out = ''; for (var j = 0; j < k; j++) for (var i = j; i < t.length; i += k) out += t[i]; return out; }
  function rfBounce(t, k) { var seq = []; for (var j = 0; j < k; j++) seq.push(j); for (j = k - 1; j >= 0; j--) seq.push(j); var out = []; for (j = 0; j < k; j++) out.push(''); t.split('').forEach(function (c, i) { out[seq[i % seq.length]] += c; }); return out.join(''); }
  function rfDecrypt(c, k) { var rr = railRows(c.length, k), counts = [], j, pos = 0, parts = []; for (j = 0; j < k; j++) counts.push(rr.filter(function (x) { return x === j; }).length); for (j = 0; j < k; j++) { parts.push(c.substr(pos, counts[j]).split('')); pos += counts[j]; } return rr.map(function (r) { return parts[r].shift(); }).join(''); }
  function rfGrid(t, k) { var rr = railRows(t.length, k), g = []; for (var j = 0; j < k; j++) g.push(t.split('').map(function (c, i) { return rr[i] === j ? c : ''; })); return table(null, g); }
  var RWORDS = ['NETWORKING', 'ALGORITHM', 'DATABASE', 'KEYBOARD', 'PROCESSOR', 'SOFTWARE', 'INTERNET', 'VARIABLE', 'FIREWALL', 'BANDWIDTH', 'PROTOCOL', 'COMPILER', 'PASSWORD', 'HARDWARE', 'TERMINAL', 'MAINFRAME'];
  function rfOpts(t, k) { return [rf(t, k), rfColumnar(t, k), rfBounce(t, k), rails(t, k).reverse().join(''), rf(t, k === 2 ? 3 : k - 1)]; }
  B['CSC-T3-20'] = { title: 'Rail Fence cipher', items: [
    { skill: 'encrypting', gen: function () {
      var t = pick(RWORDS), o = rfOpts(t, 2);
      return mc('Encrypt <b>' + t + '</b> using a Rail Fence cipher with a key of 2.', o[0], o.slice(1),
        'Zig-zag the letters over 2 rails: top rail ' + rails(t, 2)[0] + ', bottom rail ' + rails(t, 2)[1] + '. Read the top rail then the bottom: ' + o[0] + '.', function () { return shuf(t.split('')).join(''); });
    } },
    { skill: 'encrypting', gen: function () {
      var t = pick(RWORDS), o = rfOpts(t, 3);
      return mc('Encrypt <b>' + t + '</b> using a Rail Fence cipher with a key of 3.', o[0], o.slice(1),
        'Zig-zag down and up 3 rails: ' + rails(t, 3).join(' | ') + '. Reading each rail from top to bottom gives ' + o[0] + '.', function () { return shuf(t.split('')).join(''); });
    } },
    { skill: 'encrypting', gen: function () {
      var t = pick(RWORDS.filter(function (w) { return w.length >= 9; })), o = rfOpts(t, 4);
      return mc('Encrypt <b>' + t + '</b> using a Rail Fence cipher with a key of 4.', o[0], o.slice(1),
        'Zig-zag over 4 rails, bouncing off the top and bottom rail only once: ' + rails(t, 4).join(' | ') + '. Read rail by rail: ' + o[0] + '.', function () { return shuf(t.split('')).join(''); });
    } },
    { skill: 'decrypting', gen: function () {
      var t = pick(RWORDS), c = rf(t, 2);
      return mc('The ciphertext <b>' + c + '</b> was made with a Rail Fence cipher using 2 rails. What is the plaintext?', t, [rfDecrypt(c, 3), rf(c, 2), c.split('').reverse().join('')],
        'With 2 rails the top rail holds the first ' + Math.ceil(t.length / 2) + ' letters (' + c.slice(0, Math.ceil(t.length / 2)) + ') and the bottom rail the rest. Zig-zag between them: ' + t + '.', function () { return shuf(t.split('')).join(''); });
    } },
    { skill: 'decrypting', gen: function () {
      var t = pick(RWORDS), c = rf(t, 3), cnt = rails(t, 3).map(function (r) { return r.length; });
      return mc('The ciphertext <b>' + c + '</b> was made with a Rail Fence cipher using 3 rails. What is the plaintext?', t, [rfDecrypt(c, 2), rfDecrypt(c, 4), rf(c, 3)],
        'For ' + t.length + ' letters on 3 rails, the rails hold ' + cnt.join(', ') + ' letters. Split the ciphertext into ' + rails(t, 3).join(' | ') + ' and zig-zag through them: ' + t + '.', function () { return shuf(t.split('')).join(''); });
    } },
    { skill: 'reading a rail diagram', gen: function () {
      var t = pick(RWORDS), k = rint(2, 4);
      return num('The table shows a message written in a Rail Fence zig-zag.<br>' + rfGrid(t, k) + 'What key was used?', k, 'The key is the number of rails (rows), which is ' + k + '. It is not the number of letters.', 'rails');
    } },
    { skill: 'reading a rail diagram', gen: function () {
      var t = pick(RWORDS), k = rint(2, 4);
      return mc('The table shows a message written in a Rail Fence zig-zag.<br>' + rfGrid(t, k) + 'What is the ciphertext?', rf(t, k), [t, rfColumnar(t, k), rails(t, k).reverse().join('')],
        'Read each rail from left to right, starting with the top rail: ' + rails(t, k).join(' + ') + ' = ' + rf(t, k) + '. Reading down the columns would just give back the plaintext.', function () { return shuf(t.split('')).join(''); });
    } },
    { skill: 'reading a rail diagram', gen: function () {
      var t = pick(RWORDS), k = rint(2, 4), n = rails(t, k)[0].length;
      return num('The word ' + t + ' (' + t.length + ' letters) is written in a Rail Fence zig-zag with ' + k + ' rails. How many letters are on the <b>top</b> rail?', n,
        'The zig-zag visits the top rail at letters ' + railRows(t.length, k).map(function (r, i) { return r === 0 ? i + 1 : 0; }).filter(Boolean).join(', ') + ', so the top rail holds ' + pl(n, 'letters') + ': ' + rails(t, k)[0] + '.', 'letters', null, pl(n, 'letters'));
    } },
    st('cipher type and weakness', 'What type of cipher is the Rail Fence cipher?', ['Transposition, because the letters stay the same but their order changes', 'Substitution, because each letter is replaced by a symbol', 'Shift, because each letter moves along the alphabet', 'Compression, because the message gets shorter'],
      'Rail Fence only rearranges the letters. No letter is changed into a different one.'),
    st('cipher type and weakness', 'Why is the Rail Fence cipher weak?', ['There are only a few sensible keys, so each one can be tried quickly', 'It changes every letter into a different letter', 'The ciphertext is much longer than the plaintext', 'It can only encrypt numbers'],
      'The key is a small number of rails, and it must be less than the message length, so an attacker can simply try every key (brute force).'),
    st('cipher type and weakness', 'In the Rail Fence cipher, what is the key?', ['The number of rails', 'The number of letters in the message', 'The shift applied to each letter', 'The first letter of the ciphertext'],
      'The key is how many rails (rows) the zig-zag uses. The receiver needs it to rebuild the zig-zag.'),
    st('cipher type and weakness', 'Which statement about a Rail Fence ciphertext is always true?', ['It contains exactly the same letters as the plaintext', 'It contains different letters from the plaintext', 'It is shorter than the plaintext', 'It always starts with the last letter of the plaintext'],
      'Rail Fence is a transposition cipher, so the letters are only reordered. Every letter of the plaintext appears in the ciphertext the same number of times.'),
    { skill: 'reading a rail diagram', gen: function () {
      var t = pick(RWORDS), k = rint(3, 4), p = rint(2, t.length), r = railRows(t.length, k)[p - 1];
      var names = ['Rail 1', 'Rail 2', 'Rail 3', 'Rail 4'].slice(0, k);
      return mc('The word ' + t + ' is written in a Rail Fence zig-zag with ' + k + ' rails, rail 1 at the top. Which rail does letter number ' + p + ' (' + t[p - 1] + ') go on?', names[r], names.filter(function (_, i) { return i !== r; }),
        'The rail pattern for ' + k + ' rails is ' + railRows(Math.min(t.length, 2 * k), k).map(function (x) { return x + 1; }).join(', ') + ', and so on. Letter ' + p + ' lands on rail ' + (r + 1) + '.');
    } },
    st('encrypting', 'A student writes a message in the zig-zag correctly but then reads the letters down each column. What will the "ciphertext" be?', ['The original plaintext, unchanged', 'The correct Rail Fence ciphertext', 'The plaintext written backwards', 'Only the letters on the top rail'],
      'Each column holds one letter, in the original order, so reading down the columns gives back the plaintext. The ciphertext must be read along each rail.'),
    { skill: 'encrypting', gen: function () {
      var t = pick(RWORDS), k = 3, kind = rint(0, 1), wrong = kind ? rfColumnar(t, k) : rfBounce(t, k);
      if (wrong === rf(t, k)) { kind = 1 - kind; wrong = kind ? rfColumnar(t, k) : rfBounce(t, k); }
      var right = kind ? 'Wrote the letters straight across the rails in turn instead of in a zig-zag' : 'Repeated the bottom and top rails when changing direction';
      return mc('A student encrypts ' + t + ' with 3 rails and gets ' + wrong + '. The correct answer is ' + rf(t, k) + '. What mistake was made?', right,
        [kind ? 'Repeated the bottom and top rails when changing direction' : 'Wrote the letters straight across the rails in turn instead of in a zig-zag', 'Read the rails from the bottom rail upwards', 'Used 2 rails instead of 3'],
        kind ? 'Going 1, 2, 3, 1, 2, 3 puts the letters in a repeating pattern, not a zig-zag (1, 2, 3, 2, 1, 2, 3 ...).' : 'In a zig-zag the direction changes on the end rail without visiting it twice: 1, 2, 3, 2, 1, not 1, 2, 3, 3, 2, 1, 1.');
    } },
    { skill: 'cipher type and weakness', gen: function () {
      var t = pick(RWORDS), c = rf(t, rint(2, 4));
      return mc('Plaintext ' + t + ' becomes ciphertext ' + c + '. Which cipher was most likely used?', 'Rail Fence', ['Caesar', 'Pigpen', 'Run-length encoding'],
        'The ciphertext uses exactly the same letters as the plaintext in a different order, so it is a transposition cipher such as Rail Fence. Caesar would change the letters and Pigpen would use symbols.');
    } },
    st('cipher type and weakness', 'Why must the number of rails be less than the length of the message?', ['With as many rails as letters, each rail holds one letter in order, so nothing is scrambled', 'The ciphertext would be longer than the plaintext', 'The cipher would become a substitution cipher', 'It would need more than 26 letters'],
      'If every letter sits on its own rail, reading the rails in order just gives the original message back.'),
    { skill: 'reading a rail diagram', gen: function () {
      var t = pick(RWORDS), k = rint(3, 4), n = rails(t, k)[k - 1].length;
      return num('The word ' + t + ' (' + t.length + ' letters) is encrypted with a Rail Fence cipher using ' + k + ' rails. How many letters are on the <b>bottom</b> rail?', n,
        'The bottom rail is reached once in each full zig-zag. For ' + t + ' it holds ' + pl(n, 'letters') + ': ' + rails(t, k)[k - 1] + '.', 'letters', null, pl(n, 'letters'));
    } },
    { skill: 'reading a rail diagram', gen: function () {
      var t = pick(RWORDS), k = 3, r = rails(t, k);
      return mc('The word ' + t + ' is written in a zig-zag over 3 rails. Which letters are on the <b>middle</b> rail, from left to right?', r[1], [r[0], r[2], rfColumnar(t, 3).slice(r[0].length, r[0].length + r[1].length)],
        'The middle rail is visited at every second letter (2nd, 4th, 6th ...), so it holds ' + r[1] + '.', function () { return shuf(t.split('')).slice(0, r[1].length).join(''); });
    } },
    st('decrypting', 'How do you start to decrypt a Rail Fence ciphertext when you know the key?', ['Work out how many letters belong on each rail, then split the ciphertext rail by rail', 'Shift every letter back by the key', 'Reverse the ciphertext', 'Replace each letter with its symbol from the grid'],
      'Drawing the zig-zag for the message length shows how many letters each rail holds. Fill the rails from the ciphertext, then read the zig-zag.'),
    { skill: 'cipher type and weakness', kind: 'multi', q: 'Select the <b>two</b> statements that together explain why the Rail Fence cipher is easy to break.',
      options: ['The only key is the number of rails, and few values make sense', 'So an attacker can try every possible key in a short time', 'Every letter is replaced by a different letter', 'The ciphertext always contains numbers', 'The key changes for every letter'], answers: [0, 1],
      why: 'A linked explanation gives the reason (very few possible keys) and the consequence (brute force by trying each one is quick).' },
    st('encrypting', 'Which list shows the order of rails visited when writing a message with 3 rails?', ['1, 2, 3, 2, 1, 2, 3, 2, 1', '1, 2, 3, 1, 2, 3, 1, 2, 3', '1, 2, 3, 3, 2, 1, 1, 2, 3', '3, 2, 1, 3, 2, 1, 3, 2, 1'],
      'The zig-zag goes down to the bottom rail and straight back up, changing direction on the end rails without repeating them.')
  ] };
})();
