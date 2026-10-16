/* Group G05 mastery bank: Binary numbers and logic. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function bits(n, w) { w = w || 8; var s = (n >>> 0).toString(2); while (s.length < w) s = '0' + s; return s.slice(-w); }
  function sp(s) { return s.length === 8 ? s.slice(0, 4) + ' ' + s.slice(4) : s; }
  function b8(n) { return sp(bits(((n % 256) + 256) % 256, 8)); }
  function rev(s) { return s.split('').reverse().join(''); }
  function flipAll(s) { return s.replace(/[01]/g, function (c) { return c === '0' ? '1' : '0'; }); }
  function swapNib(s) { s = s.replace(/ /g, ''); return sp(s.slice(4) + s.slice(0, 4)); }
  function parts(n, vals) { vals = vals || [128, 64, 32, 16, 8, 4, 2, 1]; var out = []; vals.forEach(function (v) { if (n >= v) { out.push(v); n -= v; } }); return out; }
  function sumEq(n, vals) { var p = parts(n, vals); return p.length > 1 ? p.join(' + ') + ' = ' + n : n + ' (only the ' + n + ' column holds a 1)'; }
  function sumText(n, vals) { var p = parts(n, vals); return p.length ? p.join(' + ') : '0'; }
  function sm(p) { return (p & 128 ? -1 : 1) * (p & 127); }
  function tc(p) { return p >= 128 ? p - 256 : p; }
  function signed(v) { return v > 0 ? '+' + v : (v < 0 ? '&minus;' + (-v) : '0'); }
  function minus(v) { return v < 0 ? '&minus;' + (-v) : String(v); }
  function mc(q, correct, wrongs, why, fill, n) {
    n = n || 4;
    var opts = [String(correct)];
    function add(w) { w = String(w); if (opts.indexOf(w) < 0 && opts.length < n) opts.push(w); }
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
  function table(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  function randByte(lo, hi) { return rint(lo == null ? 1 : lo, hi == null ? 254 : hi); }
  function randFill(lo, hi) { return function () { return b8(rint(lo, hi)); }; }

  // ---------- truth-table helpers ----------
  function rows(n) { var r = []; for (var i = 0; i < (1 << n); i++) { var row = []; for (var k = n - 1; k >= 0; k--) row.push((i >> k) & 1); r.push(row); } return r; }
  function col(f, n) { return rows(n).map(function (r) { return f(r[0], r[1], r[2], r[3]) ? 1 : 0; }); }
  function cs(c) { return c.join(' '); }
  var LETTERS = [['X', 'Y', 'Z'], ['J', 'K', 'L'], ['F', 'G', 'H'], ['M', 'N', 'T'], ['P', 'Q', 'R']];
  function rename(s, L) { var map = { A: L[0], B: L[1], C: L[2] }; return s.replace(/\b[ABC]\b/g, function (c) { return map[c]; }); }
  var EX3 = [
    { s: '(A AND B) OR C', f: function (a, b, c) { return (a & b) | c; }, m: [['A AND B', function (a, b) { return a & b; }]] },
    { s: '(NOT A) AND C', f: function (a, b, c) { return (1 - a) & c; }, m: [['NOT A', function (a) { return 1 - a; }]] },
    { s: '(A OR B) AND (NOT C)', f: function (a, b, c) { return (a | b) & (1 - c); }, m: [['A OR B', function (a, b) { return a | b; }], ['NOT C', function (a, b, c) { return 1 - c; }]], op: 'AND' },
    { s: '(NOT B) AND (A OR C)', f: function (a, b, c) { return (1 - b) & (a | c); }, m: [['NOT B', function (a, b) { return 1 - b; }], ['A OR C', function (a, b, c) { return a | c; }]], op: 'AND' },
    { s: '(NOT (A OR B)) AND C', f: function (a, b, c) { return (1 - (a | b)) & c; }, m: [['A OR B', function (a, b) { return a | b; }], ['NOT (A OR B)', function (a, b) { return 1 - (a | b); }]] },
    { s: '(A OR C) AND B', f: function (a, b, c) { return (a | c) & b; }, m: [['A OR C', function (a, b, c) { return a | c; }]] },
    { s: '(NOT A) OR (B AND C)', f: function (a, b, c) { return (1 - a) | (b & c); }, m: [['NOT A', function (a) { return 1 - a; }], ['B AND C', function (a, b, c) { return b & c; }]], op: 'OR' },
    { s: '(A AND B) OR (NOT C)', f: function (a, b, c) { return (a & b) | (1 - c); }, m: [['A AND B', function (a, b) { return a & b; }], ['NOT C', function (a, b, c) { return 1 - c; }]], op: 'OR' },
    { s: 'A OR (B AND (NOT C))', f: function (a, b, c) { return a | (b & (1 - c)); }, m: [['NOT C', function (a, b, c) { return 1 - c; }], ['B AND (NOT C)', function (a, b, c) { return b & (1 - c); }]] },
    { s: '(A OR (NOT B)) AND C', f: function (a, b, c) { return (a | (1 - b)) & c; }, m: [['NOT B', function (a, b) { return 1 - b; }], ['A OR (NOT B)', function (a, b) { return a | (1 - b); }]] }
  ];
  var EX2 = [
    { s: 'A AND (NOT B)', f: function (a, b) { return a & (1 - b); } },
    { s: '(NOT A) OR B', f: function (a, b) { return (1 - a) | b; } },
    { s: 'NOT (A AND B)', f: function (a, b) { return 1 - (a & b); } },
    { s: 'NOT (A OR B)', f: function (a, b) { return 1 - (a | b); } },
    { s: '(NOT A) AND (NOT B)', f: function (a, b) { return (1 - a) & (1 - b); } },
    { s: 'A OR (NOT B)', f: function (a, b) { return a | (1 - b); } },
    { s: '(NOT A) AND B', f: function (a, b) { return (1 - a) & b; } }
  ];
  function inputTable(L, n, extraHead, extraCols) {
    var head = ['Row'].concat(L.slice(0, n)).concat(extraHead || []);
    return table(head, rows(n).map(function (r, i) { return ['Row ' + (i + 1)].concat(r).concat((extraCols || []).map(function (c) { return c[i]; })); }));
  }
  function rowName(L, r) { return L.slice(0, r.length).map(function (l, i) { return l + ' = ' + r[i]; }).join(', '); }

  // ======================================================================
  // CSC-T3-01 Binary to denary and back
  // ======================================================================
  B['CSC-T3-01'] = { title: 'Binary to denary and back (unsigned, 0 to 255)', items: [
    { skill: 'denary to binary', gen: function () {
      var n = rint(17, 250), s = bits(n);
      var w = [sp(rev(s)), swapNib(s), b8(n >> 1), b8((n << 1) & 255)];
      return mc('Convert the denary number ' + n + ' to 8-bit unsigned binary.', sp(s), w,
        n + ' = ' + sumText(n) + ', so put a 1 under each of those place values and 0 elsewhere: ' + sp(s) + '.', randFill(1, 255));
    } },
    { skill: 'binary to denary', gen: function () {
      var n = rint(5, 255);
      return num('What is the denary value of the unsigned binary pattern ' + b8(n) + '?', n,
        'Add the place values above each 1: ' + sumEq(n) + '.');
    } },
    { skill: 'denary to binary', gen: function () {
      var n = rint(20, 250), s = bits(n), left = s.slice(0, 4);
      var w = [s.slice(4), rev(left), rev(s.slice(4)), bits(n >> 4 ^ 1, 4)];
      return mc('A shop stores the number of items on a shelf, ' + n + ', as an 8-bit unsigned integer. Which is the <b>left-hand nibble</b> of the pattern?', left, w,
        n + ' = ' + sumText(n) + ', which gives ' + sp(s) + '. The left nibble holds the 128, 64, 32 and 16 columns: ' + left + '.', function () { return bits(rint(0, 15), 4); });
    } },
    { skill: 'denary to binary', gen: function () {
      var n = rint(20, 250), s = bits(n), right = s.slice(4);
      var w = [s.slice(0, 4), rev(right), bits((n & 15) ^ 2, 4), bits((n & 15) ^ 8, 4)];
      return mc('A lift counts ' + n + ' trips and stores the count as an 8-bit unsigned integer. Which is the <b>right-hand nibble</b> of the pattern?', right, w,
        n + ' = ' + sumText(n) + ', which gives ' + sp(s) + '. The right nibble holds the 8, 4, 2 and 1 columns: ' + right + '.', function () { return bits(rint(0, 15), 4); });
    } },
    { skill: 'binary to denary', gen: function () {
      var n = rint(130, 254), s = bits(n);
      var w = [parseInt(rev(s), 2), n ^ 1, minus(n - 256), parseInt(swapNib(s).replace(' ', ''), 2), n - 128];
      return mc('A game stores a bonus score as the unsigned binary integer ' + sp(s) + '. What is its denary value?', n, w,
        sumEq(n) + '. Unsigned values are never negative, and the 128 bit being 1 means the value is at least 128.', function () { return rint(0, 255); });
    } },
    { skill: 'binary to denary', gen: function () {
      var k = pick([3, 4, 5]), n = rint(Math.pow(2, k - 1), Math.pow(2, k) - 1), s = bits(n, k);
      var pv = []; for (var i = k - 1; i >= 0; i--) pv.push(Math.pow(2, i));
      return num('A sound sample is stored as the unsigned binary value ' + s + '. What is this sample in denary?', n,
        'The place values for ' + k + ' bits are ' + pv.join(', ') + '. Adding those under each 1 gives ' + sumEq(n, pv) + '.');
    } },
    { skill: 'denary to binary', gen: function () {
      var n = rint(30, 250), s = bits(n), ones = s.split('').filter(function (c) { return c === '1'; }).length;
      return num('When the denary number ' + n + ' is written in 8-bit unsigned binary, how many of the bits are 1?', ones,
        n + ' = ' + sumText(n) + ', so the pattern is ' + sp(s) + ', which has ' + ones + ' ones.');
    } },
    { skill: 'place values and range', gen: function () {
      var k = rint(1, 8), v = Math.pow(2, 8 - k);
      var ord = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'][k - 1];
      return num('In an 8-bit unsigned binary number, what is the place value of the ' + ord + ' bit counting from the <b>left</b>?', v,
        'Reading from the left the place values are 128, 64, 32, 16, 8, 4, 2, 1, so the ' + ord + ' bit is worth ' + v + '.');
    } },
    { skill: 'binary to denary', gen: function () {
      var a = rint(10, 120), b = rint(10, 120);
      return num('Two plant-pot moisture readings are stored as unsigned binary: ' + b8(a) + ' and ' + b8(b) + '. Convert each to denary. What is their total?', a + b,
        b8(a) + ' = ' + a + ' and ' + b8(b) + ' = ' + b + ', so the total is ' + a + ' + ' + b + ' = ' + (a + b) + '.');
    } },
    { skill: 'reasoning without converting', gen: function () {
      var v = shuf([rint(10, 250), rint(10, 250), rint(10, 250), rint(10, 250)]);
      while (new Set(v).size < 4) v[rint(0, 3)] = rint(10, 250);
      var max = Math.max.apply(null, v);
      return mc('Which of these unsigned binary patterns represents the largest number?', b8(max), v.filter(function (x) { return x !== max; }).map(b8),
        'Compare from the left: the first column where the patterns differ decides. ' + b8(max) + ' is ' + max + ', larger than the others (' + v.filter(function (x) { return x !== max; }).join(', ') + ').');
    } },
    { skill: 'reasoning without converting', gen: function () {
      var right = 2 * rint(65, 126), odd = 2 * rint(65, 126) + 1, small = 2 * rint(10, 63), neg = -2 * rint(10, 60);
      return mc('An unsigned 8-bit pattern starts with a 1 and ends with a 0. Which denary value could it represent?', right, [odd, small, minus(neg)],
        'A 1 in the 128 column means the value is at least 128; a 0 in the 1 column means it is even. Only ' + right + ' is even and at least 128 (and unsigned values cannot be negative).');
    } },
    { skill: 'denary to binary', gen: function () {
      var n = rint(3, 240); while ((n & 3) !== 3) n = rint(3, 240);
      var s = bits(n), t = bits(n + 1);
      var w = [b8(n + 2), b8(n - 1), sp(rev(t)), b8(n ^ 2)];
      return mc('A counter holds the unsigned pattern ' + sp(s) + '. One is added. Which pattern does it now hold?', sp(t), w,
        sp(s) + ' is ' + n + ', so the new value is ' + (n + 1) + ' = ' + sumText(n + 1) + ', which is ' + sp(t) + '. The 1s at the right turn into 0s as the carry moves left.', randFill(1, 255));
    } },
    { skill: 'place values and range', gen: function () {
      var v, k; do { v = rint(20, 235); k = rint(0, 7); } while (v & (128 >> k));
      var ord = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'][k], add = 128 >> k;
      return num('A set of 8 lights is stored as the unsigned pattern ' + b8(v) + '. The ' + ord + ' bit from the <b>left</b> is changed from 0 to 1. What is the new denary value?', v + add,
        b8(v) + ' = ' + v + '. The ' + ord + ' bit from the left is the ' + add + ' column, so the value goes up by ' + add + ': ' + v + ' + ' + add + ' = ' + (v + add) + ' (' + b8(v + add) + ').');
    } },
    { skill: 'place values and range', q: 'Which range of whole numbers can be stored in 8 bits as an <b>unsigned</b> integer?', kind: 'mcq',
      options: ['0 to 255', '1 to 256', '&minus;128 to +127', '0 to 256'], answer: 0,
      why: 'The smallest pattern 0000 0000 is 0 and the largest 1111 1111 is 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255. Unsigned numbers are never negative.' },
    { skill: 'place values and range', q: 'A games console stores a player level as an 8-bit unsigned integer. Which of these levels <b>cannot</b> be stored?', kind: 'mcq',
      options: ['256', '255', '0', '128'], answer: 0,
      why: 'Eight unsigned bits reach at most 1111 1111 = 255. The value 256 would need a ninth bit (worth 256).' },
    { skill: 'place values and range', q: 'What is a nibble?', kind: 'mcq',
      options: ['A group of 4 bits', 'A group of 8 bits', 'A single binary digit', 'A group of 2 bytes'], answer: 0,
      why: 'A nibble is 4 bits, so a byte (8 bits) is made of two nibbles. A single binary digit is a bit.' },
    { skill: 'place values and range', q: 'Which list shows the place values of an 8-bit unsigned binary number from <b>left to right</b>?', kind: 'mcq',
      options: ['128, 64, 32, 16, 8, 4, 2, 1', '1, 2, 4, 8, 16, 32, 64, 128', '256, 128, 64, 32, 16, 8, 4, 2', '8, 7, 6, 5, 4, 3, 2, 1'], answer: 0,
      why: 'Each column is worth double the column on its right, starting from 1 on the far right, so the far-left column of 8 bits is worth 128.' },
    { skill: 'spot the error', q: 'A student is asked to convert 45 to 8-bit binary and writes 101101. What is wrong with the answer?', kind: 'mcq',
      options: ['It has only 6 bits; it should be 0010 1101', 'The bits are in reverse order', '45 is too large for 8 bits', 'A positive number must start with a 1'], answer: 0,
      why: '45 = 32 + 8 + 4 + 1, so 101101 has the right value, but the question asks for 8 bits. Add zeros on the left: 0010 1101.' },
    { skill: 'spot the error', gen: function () {
      var n = rint(20, 230), s = bits(n), kind = rint(0, 1), shown, right;
      if (kind === 0) { while (rev(s) === s) { n = rint(20, 230); s = bits(n); } shown = sp(rev(s)); right = 'Wrote the bits in reverse order'; }
      else { while (swapNib(s) === sp(s)) { n = rint(20, 230); s = bits(n); } shown = swapNib(s); right = 'Swapped the two nibbles'; }
      var w = ['Forgot to add the 128 column', 'Used only 7 bits', 'Wrote the bits in reverse order', 'Swapped the two nibbles', 'Used place values starting at 256'].filter(function (x) { return x !== right; });
      return mc('A student converts ' + n + ' to 8-bit binary and writes ' + shown + '. The correct answer is ' + sp(s) + '. Which mistake did the student make?', right, shuf(w).slice(0, 3),
        'Compare the two patterns: ' + shown + ' and ' + sp(s) + '. ' + (kind === 0 ? 'Every bit is in the mirror position, so the student wrote the place values from right to left.' : 'The left and right groups of four have changed places.'));
    } },
    { skill: 'reasoning without converting', q: 'A student claims that 0101 0110 is an odd number. Which reason shows the student is wrong?', kind: 'mcq',
      options: ['The rightmost bit, worth 1, is 0, so the value is even', 'The leftmost bit is 0, so the value is even', 'It has four 1s, so the value is even', 'It is less than 128, so it is even'], answer: 0,
      why: 'Every column except the rightmost is worth an even amount, so only the 1 column can make a number odd. Here it is 0, so 0101 0110 (86) is even.' },
    { skill: 'reasoning without converting', gen: function () {
      var n = rint(1, 254), s = bits(n), big = n >= 128, even = n % 2 === 0;
      var right = 'It is ' + (big ? 'at least 128' : 'less than 128') + ' and ' + (even ? 'even' : 'odd');
      var w = ['It is ' + (big ? 'less than 128' : 'at least 128') + ' and ' + (even ? 'even' : 'odd'),
        'It is ' + (big ? 'at least 128' : 'less than 128') + ' and ' + (even ? 'odd' : 'even'),
        'It is ' + (big ? 'less than 128' : 'at least 128') + ' and ' + (even ? 'odd' : 'even')];
      return mc('Without converting it fully, which statement is true about the unsigned pattern ' + sp(s) + '?', right, w,
        'The leftmost bit is ' + s[0] + ' (128 column) and the rightmost bit is ' + s[7] + ' (1 column). The value is ' + n + '.');
    } },
    { skill: 'denary to binary', gen: function () {
      var n = rint(40, 250), p = parts(n), all = [128, 64, 32, 16, 8, 4, 2, 1];
      var opts = shuf(all).slice(0, 6);
      if (!opts.some(function (v) { return p.indexOf(v) >= 0; })) opts[0] = p[0];
      if (opts.every(function (v) { return p.indexOf(v) >= 0; })) opts[0] = all.filter(function (v) { return p.indexOf(v) < 0; })[0];
      opts = opts.filter(function (v, i) { return opts.indexOf(v) === i; });
      return { kind: 'multi', q: 'The denary number ' + n + ' is written in 8-bit unsigned binary. Select every place value whose column contains a 1.',
        options: opts.map(String), answers: opts.map(function (v, i) { return p.indexOf(v) >= 0 ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: n + ' = ' + p.join(' + ') + ', so the pattern is ' + b8(n) + '. Only those place values hold a 1.' };
    } },
    { skill: 'binary to denary', gen: function () {
      var v = []; while (v.length < 4) { var x = rint(15, 250); if (v.indexOf(x) < 0) v.push(x); }
      var target = v[0], letters = ['W', 'X', 'Y', 'Z'], perm = shuf([0, 1, 2, 3]), labels = letters.map(function (l) { return 'Reading ' + l; });
      var tab = table(['Reading', 'Pattern'], letters.map(function (l, k) { return [l, b8(v[perm[k]])]; }));
      var lab = labels[perm.indexOf(0)];
      return mc('A weather station stores four readings as unsigned binary.<br>' + tab + 'Which reading has the denary value ' + target + '?', lab,
        labels.filter(function (l) { return l !== lab; }), target + ' = ' + sumText(target) + ', which is ' + b8(target) + ', the pattern for ' + lab + '.');
    } },
    { skill: 'place values and range', q: 'What does <b>unsigned</b> mean for an 8-bit binary integer?', kind: 'mcq',
      options: ['It has no sign, so it is always zero or positive', 'Its leftmost bit shows whether it is negative', 'It can only store odd numbers', 'It has not been checked for errors'], answer: 0,
      why: 'An unsigned integer uses all 8 bits for the size of the number, so it cannot be negative. Signed methods use the leftmost bit for the sign.' }
  ] };

  // ======================================================================
  // CSC-T4-10 Complete a truth table
  // ======================================================================
  function pickEx3() { var e = pick(EX3), L = pick(LETTERS); return { e: e, L: L, s: rename(e.s, L), c: col(e.f, 3) }; }
  function otherCols(e, extra) {
    var mine = cs(col(e.f, 3));
    var out = EX3.filter(function (x) { return x !== e; }).map(function (x) { return cs(col(x.f, 3)); }).concat(extra || []);
    return shuf(out.filter(function (x) { return x !== mine; }));
  }
  B['CSC-T4-10'] = { title: 'Complete a truth table', items: [
    { skill: 'final column', gen: function () {
      var p = pickEx3(), mids = p.e.m.map(function (m) { return rename(m[0], p.L) + ' = ' + cs(col(m[1], 3)); }).join('; ');
      var near = [cs(p.c.map(function (v) { return 1 - v; })), cs(p.c.map(function (v, i) { return i === 7 ? 1 - v : v; }))];
      return mc('Rows are listed in binary order 000 to 111 for ' + p.L.join(', ') + '.<br>' + inputTable(p.L, 3, [p.s], [p.c.map(function () { return '?'; })]) +
        'Which list gives the output column for <b>' + p.s + '</b>, from the top row down?', cs(p.c), near.concat(otherCols(p.e)),
        'Work the inner columns first: ' + mids + '. Combining them gives ' + cs(p.c) + '.', null);
    } },
    { skill: 'intermediate column', gen: function () {
      var p = pickEx3(), m = p.e.m[rint(0, p.e.m.length - 1)], ms = rename(m[0], p.L), c = col(m[1], 3);
      var w = [cs(c.map(function (v) { return 1 - v; }))];
      EX3.forEach(function (x) { x.m.forEach(function (y) { w.push(cs(col(y[1], 3))); }); });
      return mc('In a truth table for ' + p.s + ', the inputs ' + p.L.join(', ') + ' are listed in binary order from 000 to 111. Which list gives the column <b>' + ms + '</b>?', cs(c), shuf(w),
        ms + (/^NOT/.test(m[0]) && m[0].length < 7 ? ' flips every value of ' + rename(m[0].slice(4), p.L) : ' is worked out row by row from the inputs') + ', giving ' + cs(c) + '.');
    } },
    { skill: 'reading a row', gen: function () {
      var p = pickEx3(), n1 = p.c.reduce(function (a, b) { return a + b; }, 0);
      return num('A truth table for <b>' + p.s + '</b> has all 8 combinations of ' + p.L.join(', ') + '. In how many rows is the output 1?', n1,
        'The output column, from 000 to 111, is ' + cs(p.c) + ', which contains ' + n1 + ' ones.');
    } },
    { skill: 'reading a row', gen: function () {
      var p, ones; do { p = pickEx3(); ones = p.c.reduce(function (a, b) { return a + b; }, 0); } while (ones < 2 || ones > 6);
      var R3 = rows(3), idx = shuf([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 5);
      if (!idx.some(function (i) { return p.c[i]; })) idx[0] = p.c.indexOf(1);
      if (idx.every(function (i) { return p.c[i]; })) idx[0] = p.c.indexOf(0);
      idx = idx.filter(function (x, i) { return idx.indexOf(x) === i; });
      return { kind: 'multi', q: 'Select every input combination for which <b>' + p.s + '</b> is true (1).',
        options: idx.map(function (i) { return rowName(p.L, R3[i]); }), answers: idx.map(function (i, k) { return p.c[i] ? k : -1; }).filter(function (k) { return k >= 0; }),
        why: 'Substitute each row into the expression. From 000 to 111 the output column is ' + cs(p.c) + '.' };
    } },
    { skill: 'reading a row', gen: function () {
      var p, v, R3 = rows(3), odd, others;
      do { p = pickEx3(); v = pick([0, 1]); odd = p.c.map(function (x, i) { return x === v ? i : -1; }).filter(function (i) { return i >= 0; }); others = p.c.map(function (x, i) { return x !== v ? i : -1; }).filter(function (i) { return i >= 0; }); } while (odd.length < 1 || others.length < 3);
      var r = pick(odd), w = shuf(others).slice(0, 3);
      return mc('Which input combination makes <b>' + p.s + '</b> give an output of ' + v + '?', rowName(p.L, R3[r]), w.map(function (i) { return rowName(p.L, R3[i]); }),
        'With ' + rowName(p.L, R3[r]) + ' the expression works out to ' + v + '. The other three rows give ' + (1 - v) + '.');
    } },
    { skill: 'checking a table', gen: function () {
      var p = pickEx3(), bad = rint(0, 7), shown = p.c.slice(); shown[bad] = 1 - shown[bad];
      var midCols = p.e.m.map(function (m) { return col(m[1], 3); });
      var tab = inputTable(p.L, 3, p.e.m.map(function (m) { return rename(m[0], p.L); }).concat([p.s]), midCols.concat([shown]));
      var others = shuf([0, 1, 2, 3, 4, 5, 6, 7].filter(function (i) { return i !== bad; })).slice(0, 3);
      return mc('A student completed this truth table. The middle columns are correct, but one cell in the final column is wrong. Rows are numbered from 1 at the top.<br>' + tab + 'Which row has the wrong final value?',
        'Row ' + (bad + 1), others.map(function (i) { return 'Row ' + (i + 1); }),
        'In row ' + (bad + 1) + ' the inputs are ' + rowName(p.L, rows(3)[bad]) + ', so ' + p.s + ' should be ' + p.c[bad] + ', not ' + shown[bad] + '.');
    } },
    { skill: 'final column', gen: function () {
      var e = pick(EX2), L = pick([['P', 'Q'], ['G', 'H'], ['S', 'T'], ['M', 'N']]), s = e.s.replace(/\bA\b/g, L[0]).replace(/\bB\b/g, L[1]), c = col(e.f, 2);
      var w = EX2.filter(function (x) { return x !== e; }).map(function (x) { return cs(col(x.f, 2)); }).concat([cs(c.map(function (v) { return 1 - v; }))]);
      return mc('Rows are listed as ' + L[0] + L[1] + ' = 00, 01, 10, 11. Which list gives the output column for <b>' + s + '</b>?', cs(c), shuf(w),
        'Row by row: ' + rows(2).map(function (r, i) { return L[0] + '=' + r[0] + ', ' + L[1] + '=' + r[1] + ' gives ' + c[i]; }).join('; ') + '.');
    } },
    { skill: 'final column', gen: function () {
      var p = pickEx3(), w = shuf(EX3.filter(function (x) { return x !== p.e && cs(col(x.f, 3)) !== cs(p.c); })).slice(0, 3).map(function (x) { return rename(x.s, p.L); });
      return mc('In a truth table with inputs ' + p.L.join(', ') + ' listed from 000 to 111, the output column reads ' + cs(p.c) + '. Which expression produces this output?', p.s, w,
        'Checking ' + p.s + ' row by row gives ' + cs(p.c) + '. Each other expression differs from this column in at least one row.');
    } },
    { skill: 'rows and inputs', gen: function () {
      var n = rint(2, 4);
      return num('A truth table is drawn for an expression with ' + n + ' different inputs. How many rows of input combinations does it need?', Math.pow(2, n),
        'Each input can be 0 or 1, so the number of rows is 2 to the power ' + n + ' = ' + Math.pow(2, n) + '.');
    } },
    { skill: 'rows and inputs', gen: function () {
      var L = pick(LETTERS), R3 = rows(3).map(function (r) { return r.join(''); }), miss = rint(0, 7), listed = R3.filter(function (_, i) { return i !== miss; });
      var w = shuf(listed).slice(0, 3);
      return mc('A student lists the input rows for ' + L.join(', ') + ' as ' + shuf(listed).join(', ') + '. One combination is missing. Which one?', R3[miss], w,
        'Three inputs need all 8 patterns 000, 001, 010, 011, 100, 101, 110, 111. Only ' + R3[miss] + ' is not in the list.');
    } },
    { skill: 'rows and inputs', gen: function () {
      var k = rint(2, 8), R3 = rows(3).map(function (r) { return r.join(''); }), L = pick(LETTERS);
      var ord = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'][k - 1];
      return mc('The input columns ' + L.join(', ') + ' of a truth table are filled in binary counting order, starting with 000. What is in the ' + ord + ' row?', R3[k - 1],
        [R3[(k) % 8], R3[(k + 6) % 8], rev(R3[k - 1])], 'Counting in binary from 000, the ' + ord + ' row is ' + (k - 1) + ' in binary, which is ' + R3[k - 1] + '.', function () { return pick(R3); });
    } },
    { skill: 'operator rules', q: 'In a truth table, what is the value of P OR Q in the row where P = 1 and Q = 1?', kind: 'mcq',
      options: ['1, because OR needs at least one input to be 1', '0, because OR means only one of the inputs', '2, because both inputs are added', '0, because the inputs are the same'], answer: 0,
      why: 'OR is true when at least one input is true, and that includes both. The "only one" meaning is a different operation that 4CP0 does not use for OR.' },
    { skill: 'operator rules', q: 'Which statement about <b>P AND Q</b> is correct?', kind: 'mcq',
      options: ['It is 1 only in the row where both P and Q are 1', 'It is 1 whenever P or Q is 1', 'It is 1 when P and Q have different values', 'It is 0 only when both P and Q are 0'], answer: 0,
      why: 'AND needs every input to be true. Of the four rows 00, 01, 10, 11, only 11 gives 1.' },
    { skill: 'operator rules', q: 'The input column P reads 0, 0, 1, 1. Which list correctly completes the column NOT P?', kind: 'mcq',
      options: ['1, 1, 0, 0', '0, 0, 1, 1', '0, 1, 0, 1', '1, 0, 1, 0'], answer: 0,
      why: 'NOT flips every value: each 0 becomes 1 and each 1 becomes 0, so 0, 0, 1, 1 becomes 1, 1, 0, 0.' },
    { skill: 'checking a table', q: 'Why is it sensible to fill in columns such as NOT R and P AND Q before the final column of a truth table?', kind: 'mcq',
      options: ['Each step is simple, so slips are less likely and the final column can be read from them', 'The final column must always be the same as the NOT column', 'Examiners ignore the final column', 'It reduces the number of rows that are needed'], answer: 0,
      why: 'The final column combines the middle columns with one operator. Working in small steps avoids mistakes from doing the whole expression in your head.' },
    { skill: 'reading a row', gen: function () {
      var S = [
        { t: 'A garden sprinkler runs when the soil is dry (D) AND it is NOT raining (R), OR when the manual switch (M) is on.', f: function (d, r, m) { return (d & (1 - r)) | m; },
          d: function (d, r, m) { return 'Soil ' + (d ? 'dry' : 'wet') + ', ' + (r ? 'raining' : 'not raining') + ', switch ' + (m ? 'on' : 'off'); } },
        { t: 'A school door unlocks when a pass is scanned (P) AND it is a school day (S), as long as the fire alarm (F) is NOT sounding.', f: function (p, s, f) { return p & s & (1 - f); },
          d: function (p, s, f) { return (p ? 'Pass scanned' : 'No pass') + ', ' + (s ? 'school day' : 'holiday') + ', alarm ' + (f ? 'sounding' : 'silent'); } },
        { t: 'A fish-tank heater turns on when the water is cold (C) AND the tank is full (T), OR when the test button (B) is pressed.', f: function (c, t, b) { return (c & t) | b; },
          d: function (c, t, b) { return 'Water ' + (c ? 'cold' : 'warm') + ', tank ' + (t ? 'full' : 'low') + ', button ' + (b ? 'pressed' : 'not pressed'); } }
      ];
      var s = pick(S), c = col(s.f, 3), R3 = rows(3);
      var yes = c.map(function (v, i) { return v ? i : -1; }).filter(function (i) { return i >= 0; }), no = c.map(function (v, i) { return v ? -1 : i; }).filter(function (i) { return i >= 0; });
      var r = pick(yes), w = shuf(no).slice(0, 3);
      return mc(s.t + ' Which situation makes the output 1?', s.d.apply(null, R3[r]), w.map(function (i) { return s.d.apply(null, R3[i]); }),
        'Check each condition: in "' + s.d.apply(null, R3[r]) + '" the combined expression is true; each other situation breaks one of the conditions.');
    } },
    { skill: 'reading a row', gen: function () {
      var e = pick(EX2), c = col(e.f, 2), zeros = c.filter(function (v) { return !v; }).length;
      return num('A truth table is completed for <b>' + e.s + '</b> using all four combinations of A and B. In how many rows is the output 0?', zeros,
        'From AB = 00 to 11 the output is ' + cs(c) + ', which has ' + zeros + ' zero' + (zeros === 1 ? '' : 's') + '.');
    } },
    { skill: 'final column', gen: function () {
      var two = EX3.filter(function (x) { return x.op; }), e = pick(two), L = pick(LETTERS);
      var m1 = col(e.m[0][1], 3), m2 = col(e.m[1][1], 3), c = col(e.f, 3), wrongOp = e.op === 'AND' ? m1.map(function (v, i) { return v | m2[i]; }) : m1.map(function (v, i) { return v & m2[i]; });
      var tab = inputTable(L, 3, [rename(e.m[0][0], L), rename(e.m[1][0], L), rename(e.s, L)], [m1, m2, c.map(function () { return '?'; })]);
      return mc('The middle columns of this truth table are already correct.<br>' + tab + 'Which list completes the final column?', cs(c),
        [cs(wrongOp), cs(c.map(function (v) { return 1 - v; })), cs(m1), cs(m2)],
        'Combine the two middle columns with ' + e.op + ' in each row: ' + cs(m1) + ' ' + e.op + ' ' + cs(m2) + ' gives ' + cs(c) + '.', function () { return cs(col(pick(EX3).f, 3)); });
    } },
    { skill: 'rows and inputs', q: 'Which statement about a complete truth table for three inputs is correct?', kind: 'mcq',
      options: ['It has 8 rows, and no input combination appears twice', 'It has 6 rows, two for each input', 'It has 9 rows, because 3 &times; 3 = 9', 'It only needs the rows where the output is 1'], answer: 0,
      why: 'Three inputs give 2 &times; 2 &times; 2 = 8 different combinations. A truth table lists every combination exactly once.' },
    { skill: 'operator rules', q: 'A student fills the column P OR Q as 0, 1, 1, 0 for the rows PQ = 00, 01, 10, 11. What mistake has the student made?', kind: 'mcq',
      options: ['Treated OR as "only one", so the 11 row is wrong', 'Treated OR as AND in every row', 'Listed the input rows in the wrong order', 'Forgot to flip the values with NOT'], answer: 0,
      why: 'P OR Q is 1 when at least one input is 1, so the column should be 0, 1, 1, 1. Writing 0 for the 11 row treats OR as exclusive.' },
    { skill: 'operator rules', q: 'An expression is written as NOT P AND Q. How should it be worked out in a truth table?', kind: 'mcq',
      options: ['Find NOT P first, then AND the result with Q', 'Find P AND Q first, then apply NOT to the result', 'Apply NOT to both P and Q, then AND them', 'Work from right to left, starting with Q'], answer: 0,
      why: 'NOT has the highest precedence, then AND, then OR. So NOT P AND Q means (NOT P) AND Q.' },
    { skill: 'reading a row', gen: function () {
      var R4 = rows(4), f = function (a, b, c, d) { return (a & b) | (c & (1 - d)); }, c = col(f, 4);
      var yes = c.map(function (v, i) { return v ? i : -1; }).filter(function (i) { return i >= 0; }), no = c.map(function (v, i) { return v ? -1 : i; }).filter(function (i) { return i >= 0; });
      var r = pick(yes), w = shuf(no).slice(0, 3), L = ['A', 'B', 'C', 'D'];
      return mc('Which set of inputs makes <b>(A AND B) OR (C AND (NOT D))</b> true?', rowName(L, R4[r]), w.map(function (i) { return rowName(L, R4[i]); }),
        'The expression is true if A and B are both 1, or if C is 1 while D is 0. Only ' + rowName(L, R4[r]) + ' meets one of these.');
    } },
    { skill: 'checking a table', gen: function () {
      var a = pick(EX3), b; do { b = pick(EX3); } while (b === a);
      var L = pick(LETTERS), ca = col(a.f, 3), cb = col(b.f, 3), same = ca.filter(function (v, i) { return v === cb[i]; }).length;
      return num('Two expressions, <b>' + rename(a.s, L) + '</b> and <b>' + rename(b.s, L) + '</b>, are each evaluated for all 8 combinations of ' + L.join(', ') + '. In how many rows do they give the same output?', same,
        'Output columns from 000 to 111: ' + cs(ca) + ' and ' + cs(cb) + '. They match in ' + same + ' row' + (same === 1 ? '' : 's') + '.');
    } }
  ] };

  // ======================================================================
  // CSC-T3-08 How many patterns from n bits
  // ======================================================================
  function minBits(k) { var n = 0; while (Math.pow(2, n) < k) n++; return n; }
  B['CSC-T3-08'] = { title: 'How many patterns from n bits', items: [
    { skill: 'patterns from bits', gen: function () {
      var n = rint(3, 12);
      return num('How many different binary patterns can be made with ' + n + ' bits?', Math.pow(2, n),
        'Each extra bit doubles the number of patterns, so ' + n + ' bits give 2<sup>' + n + '</sup> = ' + Math.pow(2, n) + ' patterns.');
    } },
    { skill: 'minimum bits', gen: function () {
      var c = pick([['students in a year group', 90, 250], ['products in a shop', 300, 900], ['seats in a theatre', 500, 1500], ['lockers in a gym', 40, 120], ['books in a class library', 130, 500]]);
      var k = rint(c[1], c[2]), n = minBits(k);
      return num('Each of ' + k + ' ' + c[0] + ' must be given its own binary code, and all codes use the same number of bits. What is the minimum number of bits needed?', n,
        '2<sup>' + (n - 1) + '</sup> = ' + Math.pow(2, n - 1) + ' is too few, but 2<sup>' + n + '</sup> = ' + Math.pow(2, n) + ' is at least ' + k + ', so ' + n + ' bits are needed.');
    } },
    { skill: 'colour depth and sound levels', gen: function () {
      var n = pick([1, 2, 3, 4, 5, 6, 8, 10, 12]);
      return num('A bitmap image uses a colour depth of ' + n + ' bit' + (n === 1 ? '' : 's') + ' per pixel. How many different colours can it show?', Math.pow(2, n),
        'With n bits per pixel there are 2<sup>n</sup> possible colours: 2<sup>' + n + '</sup> = ' + Math.pow(2, n) + '.');
    } },
    { skill: 'minimum bits', gen: function () {
      var k = pick([3, 5, 6, 7, 9, 12, 14, 20, 27, 33, 40, 50, 64, 100]), n = minBits(k);
      return num('An icon must be able to show ' + k + ' different colours. What is the minimum colour depth, in bits per pixel?', n,
        '2<sup>' + n + '</sup> = ' + Math.pow(2, n) + ' is the first power of 2 that is at least ' + k + (n > 1 ? ' (2<sup>' + (n - 1) + '</sup> = ' + Math.pow(2, n - 1) + ' is not enough)' : '') + ', so ' + n + ' bits are needed.', 'bits');
    } },
    { skill: 'colour depth and sound levels', gen: function () {
      var n = pick([4, 6, 8, 10, 12, 16]);
      return num('A sound recording uses a bit depth of ' + n + ' bits. How many different amplitude levels can each sample take?', Math.pow(2, n),
        'Bit depth is the number of bits per sample, so there are 2<sup>' + n + '</sup> = ' + Math.pow(2, n) + ' possible levels.');
    } },
    { skill: 'minimum bits', gen: function () {
      var m = rint(9, 60), n = minBits(m + 1);
      return num('The samples on a sound graph take whole-number values from 0 up to ' + m + '. What is the minimum bit depth needed to store every sample?', n,
        'There are ' + (m + 1) + ' possible values (0 to ' + m + '). 2<sup>' + n + '</sup> = ' + Math.pow(2, n) + ' patterns is the first power of 2 that covers them, so ' + n + ' bits.', 'bits');
    } },
    { skill: 'range of values', gen: function () {
      var n = rint(3, 12), v = Math.pow(2, n) - 1;
      return num('What is the largest unsigned whole number that can be stored in ' + n + ' bits?', v,
        n + ' bits give 2<sup>' + n + '</sup> = ' + Math.pow(2, n) + ' patterns, starting at 0, so the largest is ' + Math.pow(2, n) + ' &minus; 1 = ' + v + '.');
    } },
    { skill: 'patterns from bits', gen: function () {
      var n = rint(4, 10), k = rint(1, 4);
      return num('A code uses ' + n + ' bits. It is extended to ' + (n + k) + ' bits. How many times as many different patterns are now possible?', Math.pow(2, k),
        'Each extra bit doubles the number of patterns. ' + k + ' extra bit' + (k === 1 ? '' : 's') + ' multiply it by 2<sup>' + k + '</sup> = ' + Math.pow(2, k) + '.');
    } },
    { skill: 'patterns from bits', gen: function () {
      var n = pick([5, 7, 9, 10]);
      return mc('Which expression gives the number of different patterns that ' + n + ' bits can hold?', '2<sup>' + n + '</sup>',
        [n + '<sup>2</sup>', n + ' &times; 2', '2<sup>' + n + '</sup> &minus; 1', n + ' + 2'],
        'Each bit has 2 choices, so ' + n + ' bits give 2 &times; 2 &times; ... (' + n + ' times) = 2<sup>' + n + '</sup> = ' + Math.pow(2, n) + '. 2<sup>' + n + '</sup> &minus; 1 is the largest value, not the number of patterns.');
    } },
    { skill: 'assigning codes', gen: function () {
      var k = rint(3, 7), n = minBits(k), codes = []; for (var i = 0; i < k; i++) codes.push(bits(i, n));
      var dup = codes.slice(); dup[k - 1] = dup[0];
      var varied = []; for (i = 0; i < k; i++) varied.push(i.toString(2));
      var wide = []; for (i = 0; i < k; i++) wide.push(bits(i, n + 1));
      return mc('An image uses exactly ' + k + ' colours. Which set of codes gives each colour a unique pattern using the minimum colour depth?', codes.join(', '),
        [dup.join(', '), varied.join(', '), wide.join(', ')],
        k + ' colours need ' + n + ' bits (2<sup>' + n + '</sup> = ' + Math.pow(2, n) + '). Every code must be different and the same length; ' + (n + 1) + '-bit codes would be more than the minimum.');
    } },
    { skill: 'assigning codes', q: 'Why must every colour in an image be stored with a code of the <b>same</b> number of bits?', kind: 'mcq',
      options: ['So the computer knows where one pixel ends and the next begins', 'So that the image uses more colours', 'Because shorter codes are always lossy', 'So that the file can be printed'], answer: 0,
      why: 'The pixel data is one long run of bits. With a fixed colour depth, the computer reads exactly n bits for each pixel; codes of mixed lengths could be split in more than one way.' },
    { skill: 'range of values', gen: function () {
      var k = pick([5, 6, 9, 11, 13, 20, 25, 35, 45, 70, 100]), n = minBits(k);
      return num('A company gives each of its ' + k + ' delivery vans a binary code using the minimum number of bits. How many of the possible codes are left unused?', Math.pow(2, n) - k,
        k + ' vans need ' + n + ' bits, which give 2<sup>' + n + '</sup> = ' + Math.pow(2, n) + ' codes. ' + Math.pow(2, n) + ' &minus; ' + k + ' = ' + (Math.pow(2, n) - k) + ' are unused.');
    } },
    { skill: 'colour depth and sound levels', gen: function () {
      var n = rint(1, 4), m = rint(n + 1, 8), target = Math.pow(2, m) - rint(0, Math.pow(2, m - 1) - 1);
      var need = minBits(target);
      return num('A logo uses ' + n + '-bit colour. The designer wants it to show ' + target + ' colours instead. How many <b>extra</b> bits per pixel are needed, at minimum?', need - n,
        target + ' colours need ' + need + ' bits (2<sup>' + need + '</sup> = ' + Math.pow(2, need) + '). That is ' + need + ' &minus; ' + n + ' = ' + (need - n) + ' extra bit' + (need - n === 1 ? '' : 's') + '.', 'bits', null, (need - n) + (need - n === 1 ? ' bit' : ' bits'));
    } },
    { skill: 'patterns from bits', q: 'What happens to the number of possible patterns each time one more bit is added?', kind: 'mcq',
      options: ['It doubles', 'It goes up by 1', 'It goes up by 2', 'It is squared'], answer: 0,
      why: 'The new bit can be 0 or 1 in front of every existing pattern, so there are twice as many patterns: 2, 4, 8, 16 and so on.' },
    { skill: 'colour depth and sound levels', q: 'A simple bitmap shows only black and white pixels. What is the smallest colour depth it can use?', kind: 'mcq',
      options: ['1 bit', '2 bits', '8 bits', '0 bits'], answer: 0,
      why: 'Two colours need 2 patterns, and 1 bit gives 2<sup>1</sup> = 2 patterns (0 and 1).' },
    { skill: 'patterns from bits', gen: function () {
      var n = pick([3, 5, 6, 7]);
      return mc('A student says that ' + n + ' bits can make ' + (2 * n) + ' different patterns. Which statement correctly explains the mistake?', 'Each bit doubles the patterns, so it is 2<sup>' + n + '</sup> = ' + Math.pow(2, n),
        ['The student forgot to subtract 1, so it is ' + (2 * n - 1), 'The student should square ' + n + ', so it is ' + (n * n), 'The student should add 1 for zero, so it is ' + (2 * n + 1)],
        'Multiplying by 2 once per bit means 2 &times; 2 &times; ... ' + n + ' times, which is 2<sup>' + n + '</sup> = ' + Math.pow(2, n) + ', not ' + n + ' &times; 2.');
    } },
    { skill: 'minimum bits', gen: function () {
      var n = rint(3, 11);
      return num('A system needs exactly ' + Math.pow(2, n) + ' different binary codes. What is the minimum number of bits per code?', n,
        Math.pow(2, n) + ' = 2<sup>' + n + '</sup>, so ' + n + ' bits give exactly the number of codes needed.', 'bits');
    } },
    { skill: 'range of values', gen: function () {
      var n = rint(3, 6), cap = Math.pow(2, n), vals = shuf([cap, cap - 1, cap + 1, Math.floor(cap / 2) + 1, cap * 2, cap + rint(2, 6), rint(2, cap - 2)]).slice(0, 5);
      vals = vals.filter(function (v, i) { return vals.indexOf(v) === i; });
      if (vals.every(function (v) { return v <= cap; })) vals[0] = cap + 1;
      if (vals.every(function (v) { return v > cap; })) vals[0] = cap;
      return { kind: 'multi', q: 'A club uses ' + n + '-bit membership codes. Select every club size that could be given unique codes with ' + n + ' bits.',
        options: vals.map(function (v) { return v + ' members'; }), answers: vals.map(function (v, i) { return v <= cap ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: n + ' bits give 2<sup>' + n + '</sup> = ' + cap + ' codes, so any club of up to ' + cap + ' members fits; more than ' + cap + ' would need another bit.' };
    } },
    { skill: 'patterns from bits', gen: function () {
      var n = rint(3, 10);
      return num('A system uses ' + n + '-bit codes. How many of the possible codes begin with a 1?', Math.pow(2, n - 1),
        'The first bit is fixed as 1, so only the other ' + (n - 1) + ' bits can change: 2<sup>' + (n - 1) + '</sup> = ' + Math.pow(2, n - 1) + ' codes, exactly half of all ' + Math.pow(2, n) + '.');
    } },
    { skill: 'colour depth and sound levels', gen: function () {
      var n = rint(2, 7), a = Math.pow(2, n), k = rint(1, 3), b = a * Math.pow(2, k);
      return mc('An animation currently uses ' + a + ' colours, which fills its colour depth exactly. The artist wants ' + b + ' colours. How many extra bits per pixel are needed?', k + ' more bit' + (k === 1 ? '' : 's'),
        [(b - a) + ' more bits', (b / a) + ' more bits' === k + ' more bits' ? (k + 2) + ' more bits' : (b / a) + ' more bits', n + ' more bits', (k + 1) + ' more bits'],
        a + ' colours use ' + n + ' bits (2<sup>' + n + '</sup>) and ' + b + ' colours need ' + (n + k) + ' bits (2<sup>' + (n + k) + '</sup>). Each extra bit doubles the colours, so ' + k + ' more bit' + (k === 1 ? ' is' : 's are') + ' needed.');
    } },
    { skill: 'range of values', q: 'With 8 bits, the largest unsigned number is 255, yet 256 different patterns are possible. Why?', kind: 'mcq',
      options: ['The patterns start at 0, so 0 to 255 is 256 values', 'One pattern is kept for errors', 'The leftmost bit is a sign bit', '255 is rounded up to 256'], answer: 0,
      why: 'Counting 0 as a value, the numbers 0, 1, 2, ..., 255 make 256 patterns. The largest value is always one less than the number of patterns.' },
    { skill: 'assigning codes', gen: function () {
      var names = shuf(['Teal', 'Amber', 'Navy', 'Lilac', 'Olive', 'Coral', 'Ivory']);
      var k = rint(5, 7), n = 3, used = shuf([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, k), last = used[k - 1], free = [0, 1, 2, 3, 4, 5, 6, 7].filter(function (x) { return used.indexOf(x) < 0; });
      var tab = table(['Colour', 'Code'], used.slice(0, k - 1).map(function (c, i) { return [names[i], bits(c, 3)]; }).concat([[names[k - 1], '?']]));
      return mc('An image uses ' + k + ' colours with 3-bit codes.<br>' + tab + 'Which code could be given to ' + names[k - 1] + '?', bits(free.length ? free[0] : last, 3),
        [bits(used[0], 3), bits(used[1], 3).slice(1), '1' + bits(used[2], 3)],
        'The new code must be 3 bits long and must not repeat a code already used. ' + bits(free.length ? free[0] : last, 3) + ' is unused; a repeat, a 2-bit code or a 4-bit code would break the rules.');
    } }
  ] };

  // ======================================================================
  // CSC-T3-06 Adding binary numbers and overflow
  // ======================================================================
  function carries(a, b) { var c = 0, n = 0; for (var i = 0; i < 8; i++) { var s = ((a >> i) & 1) + ((b >> i) & 1) + c; c = s >= 2 ? 1 : 0; n += c; } return n; }
  function addTable(a, b, res) { return table(['', '128', '64', '32', '16', '8', '4', '2', '1'], [['First'].concat(bits(a).split('')), ['Second'].concat(bits(b).split('')), ['Sum'].concat((res || '????????').split(''))]); }
  function pairNoOv() { var a, b; do { a = rint(20, 200); b = rint(20, 200); } while (a + b > 255 || carries(a, b) < 2); return [a, b]; }
  function pairOv() { var a, b; do { a = rint(100, 250); b = rint(100, 250); } while (a + b < 256 || a + b > 500); return [a, b]; }
  B['CSC-T3-06'] = { title: 'Adding binary numbers and overflow', items: [
    { skill: 'column addition', gen: function () {
      var p = pairNoOv(), a = p[0], b = p[1], s = a + b;
      return mc('Add these two 8-bit binary integers.<br>' + addTable(a, b) + 'Which is the 8-bit result?', b8(s), [b8(a ^ b), b8(s ^ 4), b8(s - 2), b8(s + 16)],
        'In denary ' + a + ' + ' + b + ' = ' + s + '. Adding column by column from the right, carrying 1 whenever 1 + 1 = 10, gives ' + b8(s) + '.', randFill(1, 255));
    } },
    { skill: 'column addition', gen: function () {
      var p = pairNoOv(), a = p[0], b = p[1];
      return num('Add ' + b8(a) + ' and ' + b8(b) + ' as 8-bit unsigned binary. Give the result in denary.', a + b,
        b8(a) + ' = ' + a + ' and ' + b8(b) + ' = ' + b + '. The sum is ' + b8(a + b) + ' = ' + (a + b) + ', which fits in 8 bits.');
    } },
    { skill: 'detecting overflow', gen: function () {
      var o = pairOv(), ok = [pairNoOv(), pairNoOv(), pairNoOv()];
      return mc('Which of these 8-bit unsigned additions causes an <b>overflow</b> error?', b8(o[0]) + ' + ' + b8(o[1]), ok.map(function (p) { return b8(p[0]) + ' + ' + b8(p[1]); }),
        b8(o[0]) + ' + ' + b8(o[1]) + ' is ' + o[0] + ' + ' + o[1] + ' = ' + (o[0] + o[1]) + ', more than 255, so it needs a ninth bit. The others total 255 or less.');
    } },
    { skill: 'detecting overflow', gen: function () {
      var o = pairOv(), s = o[0] + o[1];
      return mc('An 8-bit register adds ' + b8(o[0]) + ' and ' + b8(o[1]) + '. The carry out of the leftmost column is lost. Which pattern is left in the register?', b8(s - 256),
        ['1111 1111', b8(s >> 1), b8(o[0] ^ o[1]), b8(s - 128)],
        'The true sum is ' + s + ' = ' + bits(s, 9) + ' (9 bits). Only the rightmost 8 bits fit, so ' + b8(s - 256) + ' (' + (s - 256) + ') is stored and the result is wrong.', randFill(1, 255));
    } },
    { skill: 'detecting overflow', gen: function () {
      var o = pairOv(), s = o[0] + o[1];
      return num('An 8-bit unsigned register adds ' + b8(o[0]) + ' and ' + b8(o[1]) + ' and the ninth bit is lost. What denary value does the register hold afterwards?', s - 256,
        o[0] + ' + ' + o[1] + ' = ' + s + ', which needs a 9th bit worth 256. Losing it leaves ' + s + ' &minus; 256 = ' + (s - 256) + '.');
    } },
    { skill: 'column addition', gen: function () {
      var p = pairNoOv(), a = p[0], b = p[1], k = carries(a, b);
      return num('When ' + b8(a) + ' and ' + b8(b) + ' are added column by column, how many times is a 1 carried into the next column?', k,
        'Working from the right, a carry happens whenever a column totals 2 or 3. The sum is ' + b8(a + b) + ', and ' + k + ' columns produce a carry.');
    } },
    { skill: 'addition rules', q: 'In one column of a binary addition, the two bits are 1 and 1, and there is also a carry of 1 coming in. What happens?', kind: 'mcq',
      options: ['Write 1 and carry 1', 'Write 0 and carry 1', 'Write 1 and carry 0', 'Write 3 and carry 0'], answer: 0,
      why: '1 + 1 + 1 = 3, which is 11 in binary. Write the right-hand 1 in this column and carry the left-hand 1.' },
    { skill: 'addition rules', q: 'What is 1 + 1 in a single column of binary addition (no carry in)?', kind: 'mcq',
      options: ['Write 0 and carry 1', 'Write 2', 'Write 1 and carry 1', 'Write 1 and carry 0'], answer: 0,
      why: '1 + 1 = 2, which is 10 in binary. The 0 stays in the column and the 1 is carried left. Binary has no digit 2.' },
    { skill: 'explaining overflow', q: 'Which is the best explanation of an overflow error in an 8-bit register?', kind: 'mcq',
      options: ['The result needs more than the 8 bits available, so a bit is lost', 'The register has been filled with too many programs running at once', 'The two numbers being added together are both negative numbers', 'A bit has been flipped by electrical interference during storage'], answer: 0,
      why: 'Overflow means the result is too large for the number of bits. In 8-bit addition the carry out of the leftmost column needs a ninth bit, which is lost.' },
    { skill: 'explaining overflow', q: 'An 8-bit register adds two numbers and an error occurs. Select the <b>two</b> statements that together give a linked explanation of the error.', kind: 'multi',
      options: ['An overflow error has occurred', 'The answer is greater than 255, so it needs a ninth bit', 'The program has a syntax error', 'Binary cannot store numbers above 99', 'The register was not switched on'], answers: [0, 1],
      why: 'Name the error (overflow) and say why it happened: the result needs more bits than the register has. The other statements are not correct.' },
    { skill: 'explaining overflow', q: 'Why can an overflow error cause problems in a program?', kind: 'mcq',
      options: ['The stored result is wrong, so later steps use a false value', 'It makes the program run much faster than the programmer expected', 'It deletes the program and its data from secondary storage', 'It changes the program source code into machine code'], answer: 0,
      why: 'Because the extra bit is lost, the register holds the wrong number. Anything that uses it afterwards can give wrong results or crash.' },
    { skill: 'checking a sum', gen: function () {
      var p = pairNoOv(), a = p[0], b = p[1];
      return mc('A student adds ' + b8(a) + ' and ' + b8(b) + ' and writes ' + b8(a ^ b) + '. The correct answer is ' + b8(a + b) + '. What did the student do wrong?', 'Did not carry 1 when a column was 1 + 1',
        ['Added the columns from left to right', 'Caused an overflow error in the register', 'Wrote the result bits in reverse order'],
        'Wherever both bits were 1 the student wrote 0 but never carried the 1, which is why ' + b8(a ^ b) + ' is too small (' + (a ^ b) + ' instead of ' + (a + b) + ').');
    } },
    { skill: 'detecting overflow', gen: function () {
      var ov = Math.random() < 0.5, p = ov ? pairOv() : pairNoOv(), s = p[0] + p[1];
      var yes = 'Yes: the total ' + s + ' is more than 255, so it needs 9 bits', no = 'No: the total ' + s + ' fits in 8 bits';
      return mc('Does adding ' + b8(p[0]) + ' and ' + b8(p[1]) + ' in an 8-bit unsigned register cause overflow?', ov ? yes : no,
        [ov ? no : yes, 'Yes: both numbers have a 1 in the leftmost column', 'No: overflow only happens when numbers are negative'],
        p[0] + ' + ' + p[1] + ' = ' + s + '. ' + (ov ? 'That is more than 255, so a ninth bit is needed and overflow occurs.' : 'That is no more than 255, so it fits in 8 bits.'));
    } },
    { skill: 'detecting overflow', gen: function () {
      var v = rint(60, 240);
      return num('A register holds the 8-bit unsigned value ' + b8(v) + '. What is the largest denary number that can be added to it without causing overflow?', 255 - v,
        b8(v) + ' = ' + v + '. The largest 8-bit result is 255, so at most 255 &minus; ' + v + ' = ' + (255 - v) + ' can be added.');
    } },
    { skill: 'column addition', gen: function () {
      var p = pairNoOv(), s = bits(p[0] + p[1]);
      return mc('What is the <b>right-hand nibble</b> of the 8-bit sum ' + b8(p[0]) + ' + ' + b8(p[1]) + '?', s.slice(4),
        [bits((p[0] ^ p[1]) & 15, 4), s.slice(0, 4), rev(s.slice(4))], 'The full sum is ' + p[0] + ' + ' + p[1] + ' = ' + (p[0] + p[1]) + ' = ' + sp(s) + ', so the right nibble is ' + s.slice(4) + '.', function () { return bits(rint(0, 15), 4); });
    } },
    { skill: 'column addition', gen: function () {
      var a, b; do { a = rint(20, 200); b = rint(20, 200); } while (a + b > 255 || (((a & 15) + (b & 15)) < 16));
      var s = bits(a + b), noCarry = bits(((a >> 4) + (b >> 4)) & 15, 4);
      return mc('Add ' + b8(a) + ' and ' + b8(b) + '. Take care with the carry from the right nibble. What is the <b>left-hand nibble</b> of the 8-bit sum?', s.slice(0, 4),
        [noCarry, s.slice(4), bits(((a >> 4) ^ (b >> 4)) & 15, 4)], 'The right nibbles add to ' + ((a & 15) + (b & 15)) + ', which is 16 or more, so a 1 is carried into the left nibble. The full sum is ' + sp(s) + '.', function () { return bits(rint(0, 15), 4); });
    } },
    { skill: 'checking a sum', q: 'After adding two binary numbers, how can you check the answer is correct?', kind: 'mcq',
      options: ['Convert all three to denary and check the denary sum', 'Check the answer has more 1s than either of the two numbers', 'Reverse the answer and add the two numbers again', 'Check that the answer is an even number in denary'], answer: 0,
      why: 'If the binary answer is right, its denary value equals the sum of the two denary values. The other checks do not test the value.' },
    { skill: 'explaining overflow', q: 'In a processor, what is a <b>register</b>?', kind: 'mcq',
      options: ['A small store inside the processor with a fixed number of bits', 'A list of every program that is installed on the computer', 'A secondary storage device such as a solid state drive', 'A table in main memory that records each overflow error'], answer: 0,
      why: 'A register holds data being worked on, with a fixed size such as 8 bits. Because the size is fixed, a result that is too big causes overflow.' },
    { skill: 'explaining overflow', q: 'Which statement about overflow in 8-bit unsigned addition is <b>not</b> correct?', kind: 'mcq',
      options: ['Overflow makes the register grow to 9 bits to hold the answer', 'Overflow happens when the result is larger than 255', 'Overflow shows up as a carry out of the leftmost column', 'After overflow, the stored result is wrong'], answer: 0,
      why: 'A register has a fixed size and cannot grow. That is exactly why the ninth bit is lost and the stored result is wrong.' },
    { skill: 'checking a sum', gen: function () {
      var p = pairNoOv(), a = p[0], b = p[1], s = a + b;
      return mc('A number is added to ' + b8(a) + ' and the 8-bit result is ' + b8(s) + '. Which number was added?', b8(b), [b8(s ^ a), b8(b + 2), b8(b - 4)],
        b8(s) + ' = ' + s + ' and ' + b8(a) + ' = ' + a + ', so the number added was ' + s + ' &minus; ' + a + ' = ' + b + ' = ' + b8(b) + '.', randFill(1, 200));
    } },
    { skill: 'explaining overflow', q: 'A student explains an error after an 8-bit addition by writing only "an overflow error happened". Why would this not earn full marks?', kind: 'mcq',
      options: ['It names the error but does not say why it happened', 'It should say that a syntax error happened instead', 'It should give the stored answer in hexadecimal', 'Overflow errors cannot happen during addition'], answer: 0,
      why: 'A linked explanation names the error and gives its cause: the result is too big for the 8 bits, so a ninth bit would be needed.' },
    { skill: 'detecting overflow', gen: function () {
      var o = pairOv(), s = o[0] + o[1], t = bits(s, 9);
      return mc('Adding ' + b8(o[0]) + ' and ' + b8(o[1]) + ' overflows an 8-bit register. What would the <b>true</b> 9-bit result be?', t,
        [bits(s - 256, 9), '1' + bits(o[0] ^ o[1], 8), bits((s + 2) % 512, 9)], o[0] + ' + ' + o[1] + ' = ' + s + ' = 256 + ' + (s - 256) + ', so the true result is ' + t + '. The leading 1 is the bit that is lost.', function () { return bits(rint(256, 511), 9); });
    } },
    { skill: 'detecting overflow', q: 'Two 8-bit unsigned numbers are both less than 128. Which statement about adding them is correct?', kind: 'mcq',
      options: ['They can never overflow, as the total is at most 254', 'They always overflow, because both of them use 8 bits', 'They overflow whenever both of the numbers are odd', 'They overflow whenever the total is more than 127'], answer: 0,
      why: 'The largest possible total is 127 + 127 = 254, which still fits in 8 unsigned bits (up to 255).' }
  ] };

  // ======================================================================
  // CSC-T3-02 Sign and magnitude
  // ======================================================================
  function smPat(v) { return b8((v < 0 ? 128 : 0) + Math.abs(v)); }
  B['CSC-T3-02'] = { title: 'Sign and magnitude numbers', items: [
    { skill: 'pattern to denary', gen: function () {
      var m = rint(9, 127), p = 128 + m;
      return num('The 8-bit pattern ' + b8(p) + ' uses sign and magnitude. Convert it to denary, including the sign.', -m,
        'The sign bit is 1, so the number is negative. The other 7 bits are ' + bits(m, 7) + ' = ' + sumEq(m, [64, 32, 16, 8, 4, 2, 1]) + '. So the value is &minus;' + m + '.', '', null, '-' + m);
    } },
    { skill: 'pattern to denary', gen: function () {
      var m = rint(9, 120), neg = Math.random() < 0.7, p = (neg ? 128 : 0) + m, v = neg ? -m : m;
      var w = neg ? [p, minus(tc(p)), m, minus(-(m + 128))] : [minus(-m), m + 128, minus(m - 128), m * 2];
      return mc('A sensor stores readings as 8-bit sign and magnitude. One reading is ' + b8(p) + '. What is its denary value?', minus(v), w.map(String),
        'The leftmost bit (' + (neg ? '1' : '0') + ') is the sign: ' + (neg ? 'negative' : 'positive') + '. The 7 magnitude bits give ' + m + ', so the value is ' + minus(v) + '.', function () { return minus(rint(-127, 127)); });
    } },
    { skill: 'denary to pattern', gen: function () {
      var m = rint(9, 120), s = smPat(-m);
      return mc('Convert the denary number &minus;' + m + ' to 8-bit sign and magnitude.', s, [b8(256 - m), b8(m), b8(255 - m), b8(128 + (m >> 1))],
        'Write ' + m + ' in 7 bits (' + bits(m, 7) + ') and put the sign bit 1 in front for negative: ' + s + '. Flip-and-add-one is two\'s complement, a different method.', randFill(128, 255));
    } },
    { skill: 'denary to pattern', gen: function () {
      var m = rint(9, 120), s = smPat(m);
      return mc('Convert +' + m + ' to 8-bit sign and magnitude.', s, [smPat(-m), sp(bits(m, 7) + '1'), b8(m ^ 64), b8(m + 1)],
        'Positive numbers have sign bit 0, then the size in 7 bits: ' + m + ' = ' + bits(m, 7) + ', so the pattern is ' + s + '.', randFill(0, 255));
    } },
    { skill: 'range and zero', q: 'What is the <b>lowest</b> value that can be stored in 8-bit sign and magnitude, and its pattern?', kind: 'mcq',
      options: ['&minus;127, stored as 1111 1111', '&minus;128, stored as 1000 0000', '&minus;255, stored as 1111 1111', '0, stored as 0000 0000'], answer: 0,
      why: 'The most negative value has sign bit 1 and the largest 7-bit magnitude, 111 1111 = 127. &minus;128 is the two\'s complement limit, not sign and magnitude.' },
    { skill: 'range and zero', q: 'What is the <b>highest</b> value that can be stored in 8-bit sign and magnitude, and its pattern?', kind: 'mcq',
      options: ['+127, stored as 0111 1111', '+255, stored as 1111 1111', '+128, stored as 1000 0000', '+127, stored as 1111 1111'], answer: 0,
      why: 'A positive number has sign bit 0, and the largest 7-bit magnitude is 111 1111 = 127, so the pattern is 0111 1111.' },
    { skill: 'range and zero', q: 'Which statement about zero in 8-bit sign and magnitude is correct?', kind: 'mcq',
      options: ['It has two patterns: 0000 0000 and 1000 0000', 'It has one pattern: 0000 0000', 'It cannot be stored', 'It is stored as 1111 1111'], answer: 0,
      why: 'With magnitude 000 0000 the sign bit can be 0 (+0) or 1 (&minus;0), so zero has two patterns. This wastes one pattern.' },
    { skill: 'range and zero', q: 'In sign and magnitude, what does the leftmost bit (MSB) show?', kind: 'mcq',
      options: ['The sign: 0 for positive, 1 for negative', 'A place value of 128', 'A place value of &minus;128', 'Whether the number is odd or even'], answer: 0,
      why: 'In sign and magnitude the MSB has no place value; it only says whether the number is positive (0) or negative (1). The other 7 bits hold the size.' },
    { skill: 'range and zero', q: 'Why can &minus;128 <b>not</b> be stored in 8-bit sign and magnitude?', kind: 'mcq',
      options: ['Only 7 bits hold the magnitude, and the largest 7-bit value is 127', 'The sign bit can only be 0', 'Negative numbers need 16 bits', 'The pattern 1000 0000 is used for &minus;128'], answer: 0,
      why: 'The magnitude is held in 7 bits, so it can be at most 111 1111 = 127. 1000 0000 is &minus;0, not &minus;128.' },
    { skill: 'denary to pattern', gen: function () {
      var m = rint(9, 120), neg = Math.random() < 0.5, p = (neg ? 128 : 0) + m, q = p ^ 128;
      return mc('A value is stored in 8-bit sign and magnitude as ' + b8(p) + '. Which pattern stores the value with the <b>opposite sign</b> but the same size?', b8(q),
        [b8((256 - p) & 255), sp(flipAll(bits(p))), b8(p ^ 1)], 'In sign and magnitude only the sign bit changes: ' + b8(p) + ' (' + minus(sm(p)) + ') becomes ' + b8(q) + ' (' + minus(sm(q)) + ').', randFill(0, 255));
    } },
    { skill: 'pattern to denary', gen: function () {
      var m = rint(9, 127), p = 128 + m;
      return num('What is the <b>magnitude</b> (size, ignoring the sign) of the sign and magnitude pattern ' + b8(p) + '?', m,
        'Ignore the sign bit. The remaining 7 bits ' + bits(m, 7) + ' give ' + sumEq(m, [64, 32, 16, 8, 4, 2, 1]) + '.');
    } },
    { skill: 'avoiding common errors', gen: function () {
      var m = rint(9, 120), p = 128 + m;
      return mc('A student converts the sign and magnitude pattern ' + b8(p) + ' and gets ' + (128 + m) + '. What mistake was made?', 'Counted the sign bit as 128 instead of a minus sign',
        ['Used two\'s complement instead', 'Wrote the bits in reverse order', 'Forgot to add 1 after flipping'],
        'In sign and magnitude the leftmost 1 means negative; it is not worth 128. The value is &minus;' + m + '.');
    } },
    { skill: 'pattern to denary', gen: function () {
      var vals = []; while (vals.length < 5) { var x = rint(1, 254); if (vals.indexOf(x) < 0 && x !== 128) vals.push(x); }
      if (vals.every(function (v) { return v >= 128; })) vals[0] = rint(1, 127);
      if (vals.every(function (v) { return v < 128; })) vals[0] = rint(129, 254);
      return { kind: 'multi', q: 'These patterns use 8-bit sign and magnitude. Select every pattern that represents a <b>negative</b> number.',
        options: vals.map(b8), answers: vals.map(function (v, i) { return v >= 128 ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: 'A pattern is negative exactly when its sign bit (the leftmost bit) is 1. The values are ' + vals.map(function (v) { return b8(v) + ' = ' + minus(sm(v)); }).join('; ') + '.' };
    } },
    { skill: 'pattern to denary', gen: function () {
      var v = []; while (v.length < 4) { var x = rint(-120, 120); if (x !== 0 && v.indexOf(x) < 0) v.push(x); }
      var lo = Math.min.apply(null, v);
      return mc('Four temperature changes are stored in 8-bit sign and magnitude. Which pattern is the <b>lowest</b> value?', smPat(lo), v.filter(function (x) { return x !== lo; }).map(smPat),
        'Convert each: ' + v.map(function (x) { return smPat(x) + ' = ' + minus(x); }).join('; ') + '. The lowest is ' + minus(lo) + '.');
    } },
    { skill: 'pattern to denary', gen: function () {
      var a = rint(-100, 100), b = rint(-100, 100); if (a === 0) a = 7; if (b === 0) b = -9;
      return num('A bank account log stores two changes in 8-bit sign and magnitude: ' + smPat(a) + ' and ' + smPat(b) + '. What is their total in denary?', a + b,
        smPat(a) + ' = ' + minus(a) + ' and ' + smPat(b) + ' = ' + minus(b) + ', so the total is ' + minus(a + b) + '.', '', null, String(a + b));
    } },
    { skill: 'range and zero', q: 'In 8-bit sign and magnitude, how many bits hold the magnitude of the number?', kind: 'mcq',
      options: ['7', '8', '6', '4'], answer: 0,
      why: 'One of the 8 bits is the sign bit, leaving 7 bits (place values 64 down to 1) for the magnitude.' },
    { skill: 'range and zero', gen: function () {
      var ok = rint(-127, 127); if (ok === 0) ok = 99;
      return mc('Which of these denary values can be stored in 8-bit sign and magnitude?', minus(ok), ['&minus;128', '128', minus(-rint(129, 200)), String(rint(129, 250))],
        'The range is &minus;127 to +127. ' + minus(ok) + ' is inside that range; the others need a magnitude bigger than 127.');
    } },
    { skill: 'pattern to denary', gen: function () {
      var a = rint(-120, 120), b = rint(-120, 120); while (a === b) b = rint(-120, 120);
      var hi = Math.max(a, b), lo = Math.min(a, b);
      return num('A data logger stores values in 8-bit sign and magnitude. The highest value was ' + smPat(hi) + ' and the lowest was ' + smPat(lo) + '. What is the difference between them in denary?', hi - lo,
        smPat(hi) + ' = ' + minus(hi) + ' and ' + smPat(lo) + ' = ' + minus(lo) + '. Difference: ' + minus(hi) + ' &minus; ' + (lo < 0 ? '(' + minus(lo) + ')' : lo) + ' = ' + (hi - lo) + '.');
    } },
    { skill: 'avoiding common errors', q: 'A student writes &minus;37 in sign and magnitude as 100101. What is wrong?', kind: 'mcq',
      options: ['The sign bit is missing; it should be 1010 0101', 'The bits should be flipped and 1 added', 'It should start with 0 because 37 is small', 'Nothing; the answer is correct'], answer: 0,
      why: '37 = 32 + 4 + 1 = 010 0101 in 7 bits. A negative number needs sign bit 1 in front, giving 1010 0101.' },
    { skill: 'avoiding common errors', gen: function () {
      var m = rint(9, 120), p = 128 + m;
      return num('The pattern ' + b8(p) + ' is read as unsigned and as sign and magnitude. What is the unsigned value minus the sign and magnitude value?', 128 + 2 * m,
        'Unsigned: ' + (128 + m) + '. Sign and magnitude: &minus;' + m + '. Difference: ' + (128 + m) + ' &minus; (&minus;' + m + ') = ' + (128 + 2 * m) + '.');
    } },
    { skill: 'range and zero', q: 'How many <b>different</b> values can 8-bit sign and magnitude represent?', kind: 'mcq',
      options: ['255, because zero has two patterns', '256, one for each pattern', '128, half of the patterns', '127, the largest magnitude'], answer: 0,
      why: 'There are 256 patterns, but 0000 0000 and 1000 0000 both mean zero, so only 255 different values (&minus;127 to +127) can be stored.' },
    { skill: 'avoiding common errors', q: 'Which list gives the place values of the 7 magnitude bits in 8-bit sign and magnitude?', kind: 'mcq',
      options: ['64, 32, 16, 8, 4, 2, 1', '128, 64, 32, 16, 8, 4, 2', '&minus;64, 32, 16, 8, 4, 2, 1', '1, 2, 4, 8, 16, 32, 64'], answer: 0,
      why: 'The sign bit sits in front. The magnitude bits work like normal unsigned binary, left to right 64 down to 1.' }
  ] };

  // ======================================================================
  // CSC-T3-03 Two's complement
  // ======================================================================
  function tcPat(v) { return b8(v < 0 ? 256 + v : v); }
  B['CSC-T3-03'] = { title: 'Two\'s complement numbers', items: [
    { skill: 'pattern to denary', gen: function () {
      var v = -rint(5, 127), p = 256 + v;
      return num('Convert the 8-bit two\'s complement pattern ' + b8(p) + ' to denary, including the sign.', v,
        'The leftmost bit is worth &minus;128. &minus;128 + ' + (p - 128) + ' (the other 1s: ' + sumText(p - 128, [64, 32, 16, 8, 4, 2, 1]) + ') = ' + minus(v) + '.', '', null, String(v));
    } },
    { skill: 'pattern to denary', gen: function () {
      var v = -rint(9, 120), p = 256 + v;
      return mc('The pattern ' + b8(p) + ' is an 8-bit two\'s complement integer. What is its denary value?', minus(v),
        [minus(sm(p)), String(p), minus(v + 1), minus(-v)], 'Start at &minus;128 and add the place values of the other 1s: &minus;128 + ' + (p - 128) + ' = ' + minus(v) + '. Reading it as sign and magnitude would give ' + minus(sm(p)) + '.', function () { return minus(-rint(1, 128)); });
    } },
    { skill: 'denary to pattern', gen: function () {
      var m = rint(9, 126), s = tcPat(-m), pos = bits(m);
      return mc('Convert &minus;' + m + ' to 8-bit two\'s complement.', s, [smPat(-m), sp(flipAll(pos)), sp(flipAll(bits(m + 1))) === s ? b8(256 - m + 2) : sp(flipAll(bits(m + 1))), b8(m)],
        m + ' = ' + sp(pos) + '. Flip every bit: ' + sp(flipAll(pos)) + '. Add 1: ' + s + '.', randFill(128, 255));
    } },
    { skill: 'negation', gen: function () {
      var v = rint(-120, 120); if (v === 0) v = 21; var p = tcPat(v), q = tcPat(-v);
      return mc('Negating a number changes its sign but not its size. Give the two\'s complement negation of the 8-bit pattern ' + p + '.', q,
        [sp(flipAll(p.replace(' ', ''))), b8((parseInt(p.replace(' ', ''), 2)) ^ 128), b8((256 - parseInt(p.replace(' ', ''), 2) + 1) & 255)],
        p + ' is ' + minus(v) + '. Flip every bit (' + sp(flipAll(p.replace(' ', ''))) + ') and add 1: ' + q + ', which is ' + minus(-v) + '.', randFill(0, 255));
    } },
    { skill: 'negation', gen: function () {
      var v = rint(-120, 120); if (v === 0) v = -37;
      return num('The 8-bit two\'s complement pattern ' + tcPat(v) + ' is negated. What is the denary value of the result?', -v,
        tcPat(v) + ' = ' + minus(v) + ', so its negation is ' + minus(-v) + ', stored as ' + tcPat(-v) + '.', '', null, String(-v));
    } },
    { skill: 'range and properties', q: 'What is the range of whole numbers that 8-bit two\'s complement can store?', kind: 'mcq',
      options: ['&minus;128 to +127', '&minus;127 to +127', '0 to 255', '&minus;255 to +255'], answer: 0,
      why: 'The most negative pattern is 1000 0000 = &minus;128 and the most positive is 0111 1111 = +127.' },
    { skill: 'range and properties', q: 'Which 8-bit two\'s complement pattern stores the <b>lowest</b> possible value?', kind: 'mcq',
      options: ['1000 0000', '1111 1111', '0000 0000', '1000 0001'], answer: 0,
      why: '1000 0000 is &minus;128 with nothing added. 1111 1111 is &minus;1 and 1000 0001 is &minus;127.' },
    { skill: 'range and properties', q: 'What is the 8-bit two\'s complement pattern for &minus;1?', kind: 'mcq',
      options: ['1111 1111', '1000 0001', '1111 1110', '0000 0001'], answer: 0,
      why: '1 = 0000 0001; flip to 1111 1110; add 1 to get 1111 1111. Check: &minus;128 + 127 = &minus;1.' },
    { skill: 'range and properties', q: 'Which statement about zero in 8-bit two\'s complement is correct?', kind: 'mcq',
      options: ['It has only one pattern, 0000 0000', 'It has two patterns, 0000 0000 and 1000 0000', 'It is stored as 1111 1111', 'It cannot be stored'], answer: 0,
      why: 'Negating 0000 0000 (flip to 1111 1111, add 1) gives 0000 0000 again, with the carry lost. 1000 0000 is &minus;128, not zero.' },
    { skill: 'range and properties', q: 'In 8-bit two\'s complement, what is the place value of the leftmost bit?', kind: 'mcq',
      options: ['&minus;128', '+128', '&minus;1', '+64'], answer: 0,
      why: 'The leftmost bit is worth &minus;128 and the others are 64, 32, 16, 8, 4, 2, 1 as normal. A 1 there makes the number negative.' },
    { skill: 'spotting errors', gen: function () {
      var v = -rint(9, 120), p = 256 + v;
      return mc('A student converts the two\'s complement pattern ' + b8(p) + ' and gets ' + minus(sm(p)) + '. The correct value is ' + minus(v) + '. What mistake did the student make?', 'Read it as sign and magnitude',
        ['Read it as an unsigned number', 'Forgot to include the minus sign', 'Added 1 before flipping the bits'],
        'Treating the leftmost 1 as just a minus sign and reading the other 7 bits gives ' + minus(sm(p)) + '. In two\'s complement the leftmost bit is worth &minus;128: &minus;128 + ' + (p - 128) + ' = ' + minus(v) + '.');
    } },
    { skill: 'spotting errors', gen: function () {
      var m = rint(9, 120), s = tcPat(-m), wrong = sp(flipAll(bits(m)));
      return mc('A student converts &minus;' + m + ' to two\'s complement and writes ' + wrong + '. The correct answer is ' + s + '. What did the student do wrong?', 'Flipped the bits but did not add 1',
        ['Added 1 but did not flip the bits', 'Used sign and magnitude', 'Wrote the bits in reverse order'],
        'Flipping ' + b8(m) + ' gives ' + wrong + ' (which is &minus;' + (m + 1) + '). The final step, adding 1, gives ' + s + '.');
    } },
    { skill: 'pattern to denary', gen: function () {
      var vals = []; while (vals.length < 5) { var x = rint(-128, 127); if (vals.indexOf(x) < 0) vals.push(x); }
      if (vals.every(function (v) { return v < -64; })) vals[0] = rint(-60, 100);
      if (vals.every(function (v) { return v >= -64; })) vals[0] = rint(-128, -65);
      return { kind: 'multi', q: 'These are 8-bit two\'s complement patterns. Select every pattern whose value is <b>less than &minus;64</b>.',
        options: vals.map(tcPat), answers: vals.map(function (v, i) { return v < -64 ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: 'Values: ' + vals.map(function (v) { return tcPat(v) + ' = ' + minus(v); }).join('; ') + '. Below &minus;64 means the pattern starts 10 (&minus;128 plus less than 64).' };
    } },
    { skill: 'pattern to denary', gen: function () {
      var v = rint(9, 120);
      return mc('What is the denary value of the 8-bit two\'s complement pattern ' + tcPat(v) + '?', String(v), [minus(v - 128), minus(-v), String(v + 128)],
        'The leftmost bit is 0, so the number is positive and reads like unsigned binary: ' + sumEq(v) + '.', function () { return String(rint(1, 127)); });
    } },
    { skill: 'pattern to denary', gen: function () {
      var a = rint(-110, 110), b = rint(-110, 110);
      return num('Two readings are stored in 8-bit two\'s complement: ' + tcPat(a) + ' and ' + tcPat(b) + '. What is their total in denary?', a + b,
        tcPat(a) + ' = ' + minus(a) + ' and ' + tcPat(b) + ' = ' + minus(b) + ', so the total is ' + minus(a + b) + '.', '', null, String(a + b));
    } },
    { skill: 'pattern to denary', gen: function () {
      var v = []; while (v.length < 4) { var x = rint(-128, 127); if (v.indexOf(x) < 0) v.push(x); }
      var lo = Math.min.apply(null, v);
      return mc('Which of these 8-bit two\'s complement patterns is the <b>most negative</b>?', tcPat(lo), v.filter(function (x) { return x !== lo; }).map(tcPat),
        'Values: ' + v.map(function (x) { return tcPat(x) + ' = ' + minus(x); }).join('; ') + '. The smallest is ' + minus(lo) + '.');
    } },
    { skill: 'range and properties', q: 'Why do computers usually store signed integers in two\'s complement rather than sign and magnitude?', kind: 'mcq',
      options: ['It has only one zero, and positive and negative numbers can be added with normal binary addition', 'It can store larger positive numbers than unsigned binary', 'It uses fewer bits for each number', 'It is easier for people to read'], answer: 0,
      why: 'Two\'s complement avoids the extra "negative zero" and lets the processor add signed numbers with ordinary binary addition.' },
    { skill: 'pattern to denary', gen: function () {
      var v = -rint(9, 120), p = 256 + v, rest = p - 128;
      return mc('To read ' + b8(p) + ' as two\'s complement, you start at &minus;128. Which amount do you then add?', String(rest), [String(rest + 1), String(p), String(256 - p)],
        'The other 1s are in the columns ' + sumEq(rest, [64, 32, 16, 8, 4, 2, 1]) + ', so the value is &minus;128 + ' + rest + ' = ' + minus(v) + '.', function () { return String(rint(1, 127)); });
    } },
    { skill: 'denary to pattern', gen: function () {
      var m = rint(9, 120);
      return mc('Convert +' + m + ' to 8-bit two\'s complement.', tcPat(m), [tcPat(-m), sp(flipAll(bits(m))), smPat(-m)],
        'Positive numbers are written exactly as in unsigned binary with a leading 0: ' + m + ' = ' + sumText(m) + ' = ' + tcPat(m) + '. No flipping is needed.', randFill(0, 255));
    } },
    { skill: 'denary to pattern', q: 'Put the steps for writing &minus;45 in 8-bit two\'s complement in order. Which order is correct?', kind: 'mcq',
      options: ['Write +45 in 8 bits, flip every bit, then add 1', 'Flip every bit of 45, add 1, then write it in 8 bits', 'Write +45 in 8 bits, add 1, then flip every bit', 'Write 45 in 7 bits and put a 1 in front'], answer: 0,
      why: '+45 = 0010 1101; flip to 1101 0010; add 1 to get 1101 0011. Putting a 1 in front of 7 bits is sign and magnitude.' },
    { skill: 'range and properties', q: 'How many of the 256 patterns in 8-bit two\'s complement represent <b>negative</b> numbers?', kind: 'mcq',
      options: ['128', '127', '255', '64'], answer: 0,
      why: 'Every pattern starting with 1 is negative: 1000 0000 (&minus;128) up to 1111 1111 (&minus;1), which is 128 patterns.' },
    { skill: 'spotting errors', gen: function () {
      var v = -rint(5, 127), p = 256 + v;
      return num('The pattern ' + b8(p) + ' is read first as unsigned, then as two\'s complement. What is the unsigned value minus the two\'s complement value?', 256,
        'Unsigned: ' + p + '. Two\'s complement: ' + minus(v) + '. Difference: ' + p + ' &minus; (' + minus(v) + ') = 256. The leftmost bit is worth +128 in one and &minus;128 in the other.');
    } },
    { skill: 'range and properties', q: 'Which of these denary values <b>cannot</b> be stored in 8-bit two\'s complement?', kind: 'mcq',
      options: ['+128', '&minus;128', '+127', '0'], answer: 0,
      why: 'The range is &minus;128 to +127. +128 would need the pattern 1000 0000, which already means &minus;128.' }
  ] };

  // ======================================================================
  // CSC-T4-11 Write a logic statement for a problem
  // ======================================================================
  function ls(skill, q, right, wrong, why) { return { skill: skill, kind: 'mcq', q: q, options: [right].concat(wrong), answer: 0, why: why }; }
  B['CSC-T4-11'] = { title: 'Write a logic statement for a problem', items: [
    ls('all conditions (AND)', 'A drone may take off only if the battery is charged (C), the GPS has a signal (G) and the propellers are attached (P). Which logic statement shows the take-off condition?',
      'C AND G AND P', ['C OR G OR P', '(C AND G) OR P', 'C AND (G OR P)'], 'All three conditions must be true together, so every letter is joined with AND.'),
    ls('alternatives with brackets', 'A greenhouse fan switches on when the fan system is enabled (E) and either the temperature is high (T) or the humidity is high (H). Which statement is correct?',
      'E AND (T OR H)', ['E AND T OR H', 'E OR (T AND H)', 'E AND T AND H'], 'Either T or H is enough, so they form a bracketed OR group, and E must also be true. Without brackets, E AND T OR H would switch on whenever H is true.'),
    ls('conditions that must be false (NOT)', 'A printer prints a page only if paper is loaded (L), toner is present (T) and the cover is <b>not</b> open (O). Which statement is correct?',
      'L AND T AND NOT O', ['L AND T AND O', 'L OR T OR NOT O', 'NOT (L AND T AND O)'], 'The cover must be closed, which means O is false, so the statement needs NOT O, joined to L and T with AND.'),
    ls('one but not both', 'A quiz buzzer sounds when exactly one of two players, X or Y, presses a button. If both press at once, it does not sound. Which statement is correct?',
      '(X AND NOT Y) OR (NOT X AND Y)', ['X OR Y', 'X AND Y', 'NOT X AND NOT Y'], 'X OR Y is also true when both press. Exactly one means X without Y, or Y without X.'),
    ls('precedence and brackets', 'Which statement has the same meaning as P OR Q AND R?',
      'P OR (Q AND R)', ['(P OR Q) AND R', '(P OR Q) AND NOT P', 'NOT P OR Q OR R'], 'AND is worked out before OR, so P OR Q AND R means P OR (Q AND R).'),
    ls('checking a statement', 'A pool pump should run when the timer is on (T) and either the water is dirty (D) or the manual switch (M) is pressed. A student writes T AND D OR M. What is wrong?',
      'It needs brackets: T AND (D OR M)', ['It should use OR instead of AND: T OR D OR M', 'It needs NOT in front of M', 'Nothing; it is correct'], 'Because AND is worked out first, T AND D OR M means (T AND D) OR M, so the pump would run on M alone even with the timer off.'),
    ls('all conditions (AND)', 'A coffee machine makes a drink when a cup is in place (C), the water tank is full (W) and a drink has been selected (S). Which statement is correct?',
      'C AND W AND S', ['C AND (W OR S)', '(C OR W) AND S', 'NOT C AND W AND S'], 'The drink is made only when every condition is true, so all three letters are joined with AND.'),
    ls('alternatives with brackets', 'A car\'s headlights come on when the engine is running (E) and it is either dark (D) or the driver switches them on (S). Which statement is correct?',
      'E AND (D OR S)', ['(E AND D) OR S', 'E OR D OR S', 'E AND D AND S'], 'D and S are alternatives, so they go in brackets joined by OR, and the whole group is joined to E with AND.'),
    ls('conditions that must be false (NOT)', 'A train door opens when the train is stopped (S) and the door button is pressed (B), but only if the emergency lock (E) is <b>not</b> on. Which statement is correct?',
      'S AND B AND NOT E', ['S AND B AND E', '(S OR B) AND NOT E', 'S OR B OR NOT E'], 'All three conditions are needed, and E must be false, so use NOT E joined with AND.'),
    ls('one but not both', 'Students in a club play either chess (H) or draughts (G) in a tournament, but not both. Which statement is true for a valid entry?',
      '(H OR G) AND NOT (H AND G)', ['H OR G', 'H AND G', 'NOT H OR NOT G'], 'H OR G allows both. Adding AND NOT (H AND G) removes the case where both are true. (NOT H OR NOT G is true when neither is played.)'),
    { skill: 'one but not both', kind: 'multi', q: 'A light should be on when exactly one of two switches, P or Q, is up. Select <b>every</b> statement that is correct.',
      options: ['(P AND NOT Q) OR (NOT P AND Q)', '(P OR Q) AND NOT (P AND Q)', 'P OR Q', 'P AND Q', 'NOT P AND NOT Q'], answers: [0, 1],
      why: 'Both correct statements are true when one switch is up and false when both or neither are up. P OR Q is wrong because it is also true when both are up.' },
    ls('checking a statement', 'A phone unlocks when the correct PIN is entered (P) or a recognised fingerprint is scanned (F), as long as the phone is <b>not</b> locked out (L). A student writes (P OR F) AND L. What is the error?',
      'L should be NOT L, because the phone must not be locked out', ['The brackets should be removed', 'OR should be AND, because both are needed', 'L should come first in the statement'], 'The condition says the phone must not be locked out, so L must be false: (P OR F) AND NOT L.'),
    ls('alternatives with brackets', 'A vending machine releases a snack when an item is chosen (I) and the customer either pays by card (C) or inserts enough coins (N). Which statement is correct?',
      'I AND (C OR N)', ['I AND C AND N', 'I OR C OR N', '(I AND C) OR N'], 'Either payment method is enough, so C OR N goes in brackets, and an item must also be chosen.'),
    ls('precedence and brackets', 'In which order are logic operators worked out when there are no brackets?',
      'NOT first, then AND, then OR', ['OR first, then AND, then NOT', 'AND first, then OR, then NOT', 'Strictly from left to right'], 'NOT has the highest precedence, then AND, then OR. Brackets override this order.'),
    ls('conditions that must be false (NOT)', 'A bike light flashes when the bike is moving (M) and it is <b>not</b> daylight (D). Which statement is correct?',
      'M AND NOT D', ['M AND D', 'M OR NOT D', 'NOT (M AND D)'], 'The light needs movement and the absence of daylight, so M is joined with AND to NOT D.'),
    ls('checking a statement', 'An oven heats only when the door is closed (C) and a temperature is set (T). A student writes C OR T. Which describes the problem?',
      'The oven would heat with only one condition true; it needs AND', ['The statement needs brackets around C OR T', 'C should be NOT C', 'The letters are in the wrong order'], 'OR is true if either condition holds, so the oven could heat with the door open. Both must be true: C AND T.'),
    ls('alternatives with brackets', 'A parcel locker opens when the right code is typed (K) or a phone app is used (A), and the locker has a parcel in it (P). Which statement is correct?',
      '(K OR A) AND P', ['K OR A AND P', 'K OR (A AND P)', 'K AND A AND P'], 'Either way of opening is enough, so K OR A needs brackets; then it is joined to P with AND. K OR A AND P would mean K OR (A AND P).'),
    ls('all conditions (AND)', 'A game unlocks the next level when the player has collected all keys (K), has beaten the boss (W) and has <b>not</b> used a cheat (X). Which statement is correct?',
      'K AND W AND NOT X', ['K AND W AND X', 'K OR W OR NOT X', '(K OR W) AND NOT X'], 'Every condition is required, and X must be false, so use NOT X with AND throughout.'),
    ls('checking a statement', 'Which situation is described by the statement W AND (R OR NOT S)?',
      'W must be true, and either R is true or S is false', ['W or R must be true, and S must be false', 'W, R and S must all be true', 'Either W is true, or R is true and S is false'], 'The bracket groups R OR NOT S; that whole group must be true together with W.'),
    { skill: 'checking a statement', kind: 'multi', q: 'A school bell rings when it is a school day (S) and either break starts (K) or lessons end (E). Select <b>every</b> statement that correctly shows when the bell rings.',
      options: ['S AND (K OR E)', '(S AND K) OR (S AND E)', 'S AND K OR E', 'S OR K OR E', 'S AND K AND E'], answers: [0, 1],
      why: 'S AND (K OR E) can also be written as (S AND K) OR (S AND E); both need S. S AND K OR E means (S AND K) OR E, which would ring on any day when lessons end.' },
    ls('conditions that must be false (NOT)', 'A security light turns on when movement is detected (M), unless the light has been switched off at the wall (W). Which statement is correct?',
      'M AND NOT W', ['M AND W', 'M OR W', 'NOT M AND W'], '"Unless switched off" means W must be false for the light to work, so use M AND NOT W.'),
    ls('precedence and brackets', 'Which statement is <b>not</b> the same as (P AND Q) OR R?',
      'P AND (Q OR R)', ['P AND Q OR R', 'R OR (P AND Q)', 'R OR P AND Q'], 'AND binds more tightly than OR, so P AND Q OR R and R OR P AND Q both mean (P AND Q) OR R. P AND (Q OR R) needs P to be true, so it is different.'),
    ls('one but not both', 'A bus ticket is valid when it has been stamped (S) and it shows exactly one fare type: adult (A) or child (C), not both. Which statement shows a valid ticket?',
      'S AND ((A AND NOT C) OR (C AND NOT A))', ['S AND (A OR C)', '(S AND A) OR (C AND NOT A)', 'S OR (A AND NOT C) OR (C AND NOT A)'], 'The fare part needs A without C, or C without A, in brackets; then the whole group is joined to S with AND. S AND (A OR C) would also accept a ticket marked with both fares.'),
    ls('alternatives with brackets', 'A cinema gives a discount when the customer is a student (S) or over 65 (O), and the film is a weekday showing (W). Which statement is correct?',
      '(S OR O) AND W', ['S OR O AND W', 'S AND O AND W', 'S OR (O AND W)'], 'Either S or O qualifies, so they are bracketed together; the discount also needs W. S OR O AND W would give students a discount at weekends.')
  ] };
})();
