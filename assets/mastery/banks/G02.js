/* Group G02 mastery bank: Sorting and searching: bubble sort, merge sort, binary search; Data types, variables, arrays and subprograms. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sample(a, n) { return shuffle(a).slice(0, n); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function c(s) { return '<code>' + esc(s) + '</code>'; }
  function pc(lines) { return '<pre>' + lines.map(esc).join('\n') + '</pre>'; }
  function mc(skill, q, options, answer, why, extra) { var o = { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function mu(skill, q, options, answers, why, extra) { var o = { skill: skill, kind: 'multi', q: q, options: options, answers: answers, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function tbl(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  function L(a) { return a.join(', '); }
  // Four distinct string options, correct first; tops up with shuffled versions of `base` if needed.
  function uniq4(correct, cands, base) {
    var out = [correct], seen = {}; seen[correct] = 1;
    cands.forEach(function (v) { if (out.length < 4 && v != null && !seen[v]) { seen[v] = 1; out.push(v); } });
    var guard = 0;
    while (out.length < 4 && base.length > 1 && guard++ < 200) { var v = L(shuffle(base)); if (!seen[v]) { seen[v] = 1; out.push(v); } }
    return out;
  }
  function distinctNums(n, lo, hi) { var s = {}, out = []; while (out.length < n) { var v = rint(lo, hi); if (!s[v]) { s[v] = 1; out.push(v); } } return out; }
  function ordinal(n) { var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }

  // ---------- sorting and searching engines ----------
  function cmp(x, y) { return typeof x === 'number' ? x - y : (x < y ? -1 : x > y ? 1 : 0); }
  function bubblePass(a, desc) {
    a = a.slice(); var sw = 0, first = null;
    for (var i = 0; i < a.length - 1; i++) {
      var wrong = desc ? cmp(a[i], a[i + 1]) < 0 : cmp(a[i], a[i + 1]) > 0;
      if (wrong) { var t = a[i]; a[i] = a[i + 1]; a[i + 1] = t; sw++; if (!first) first = a.slice(); }
    }
    return { a: a, swaps: sw, firstSwap: first };
  }
  function bubbleAll(a, desc) {
    var rows = [], total = 0, p;
    do { p = bubblePass(a, desc); rows.push(p); total += p.swaps; a = p.a; } while (p.swaps > 0);
    return { rows: rows, passes: rows.length, swaps: total };
  }
  function sorted(a, desc) { return a.slice().sort(function (x, y) { return desc ? cmp(y, x) : cmp(x, y); }); }
  // A bubble-sort list that needs at least `minPasses` passes.
  function bubbleList(n, minPasses, lo, hi) {
    var a, guard = 0;
    do { a = distinctNums(n, lo || 1, hi || 60); } while (bubbleAll(a).passes < minPasses && guard++ < 200);
    return a;
  }
  function mergeLists(a, b, desc) {
    var out = [], i = 0, j = 0;
    while (i < a.length && j < b.length) { var takeA = desc ? cmp(a[i], b[j]) >= 0 : cmp(a[i], b[j]) <= 0; out.push(takeA ? a[i++] : b[j++]); }
    return out.concat(a.slice(i), b.slice(j));
  }
  function groups(arr, size) { var g = []; for (var i = 0; i < arr.length; i += size) g.push(arr.slice(i, i + size)); return g; }
  function showGroups(gs) { return gs.map(function (g) { return '[' + L(g) + ']'; }).join(' '); }
  // Merge an 8-item list level by level: returns [pairs, fours, eight] as arrays of groups.
  function mergeLevels(a, desc) {
    var lv = [a.map(function (x) { return [x]; })], cur = lv[0];
    while (cur.length > 1) { var nx = []; for (var i = 0; i < cur.length; i += 2) nx.push(mergeLists(cur[i], cur[i + 1], desc)); lv.push(nx); cur = nx; }
    return lv.slice(1);
  }
  function bsearch(arr, target, roundUp) {
    var low = 0, high = arr.length - 1, steps = [];
    while (low <= high) {
      var mid = roundUp ? Math.ceil((low + high) / 2) : Math.floor((low + high) / 2);
      steps.push({ low: low, high: high, mid: mid, val: arr[mid] });
      var d = cmp(target, arr[mid]);
      if (d === 0) return { steps: steps, found: true };
      if (d < 0) high = mid - 1; else low = mid + 1;
    }
    return { steps: steps, found: false, low: low, high: high };
  }
  function maxChecks(n) { return Math.floor(Math.log(n) / Math.LN2 + 1e-9) + 1; }
  var NAMES = ['Amara', 'Bilal', 'Chen', 'Dara', 'Elif', 'Femi', 'Gita', 'Hugo', 'Ines', 'Jonas', 'Kemal', 'Lena', 'Mira', 'Nico', 'Omar', 'Priya', 'Quinn', 'Rosa', 'Sami', 'Tara', 'Umar', 'Vera', 'Wen', 'Yara', 'Zane'];
  var FRUITS = ['apple', 'banana', 'cherry', 'damson', 'fig', 'grape', 'kiwi', 'lemon', 'mango', 'nectarine', 'olive', 'peach', 'quince', 'raspberry'];
  var BS_RULE = 'Indexes start at 0. The midpoint is (low + high) DIV 2. If the target is smaller than the middle item, high becomes mid − 1; if it is larger, low becomes mid + 1.';
  var BUB_RULE = 'Pairs are compared from left to right, and the sort stops after a pass in which no swaps are made.';

  // =====================================================================
  // CSC-T1-08 Bubble sort, one pass at a time
  // =====================================================================
  B['CSC-T1-08'] = { title: 'Bubble sort, one pass at a time', items: [
    { skill: 'pass-state', gen: function () {
      var a = bubbleList(6, 4), r = bubbleAll(a), p1 = r.rows[0];
      return { kind: 'mcq', q: 'A bubble sort puts this list into ascending order: <b>' + L(a) + '</b>. ' + BUB_RULE + ' What is the list after the <b>first pass</b>?',
        options: uniq4(L(p1.a), [L(sorted(a)), L(r.rows[1].a), L(p1.firstSwap), L(bubblePass(a, true).a)], a), answer: 0,
        why: 'In one pass each neighbouring pair is compared once, left to right, and swapped if it is in the wrong order. The largest value, ' + Math.max.apply(null, a) + ', ends up at the end: ' + L(p1.a) + '. The list is not fully sorted yet.' };
    } },
    { skill: 'pass-state', gen: function () {
      var a = bubbleList(7, 4), r = bubbleAll(a);
      return { kind: 'mcq', q: 'An ascending bubble sort is used on <b>' + L(a) + '</b>. ' + BUB_RULE + ' What is the list after the <b>second pass</b>?',
        options: uniq4(L(r.rows[1].a), [L(r.rows[0].a), L(sorted(a)), r.rows[2] ? L(r.rows[2].a) : null, L(bubblePass(r.rows[0].a, true).a)], a), answer: 0,
        why: 'Pass 1 gives ' + L(r.rows[0].a) + '. Pass 2 works on that list and gives ' + L(r.rows[1].a) + ': the two largest values are now in their final places.' };
    } },
    { skill: 'pass-state', gen: function () {
      var a, r, guard = 0; do { a = distinctNums(6, 1, 60); r = bubbleAll(a, true); } while (r.passes < 4 && guard++ < 200);
      return { kind: 'mcq', q: 'A bubble sort puts <b>' + L(a) + '</b> into <b>descending</b> order. ' + BUB_RULE + ' What is the list after the first pass?',
        options: uniq4(L(r.rows[0].a), [L(bubblePass(a, false).a), L(sorted(a, true)), L(r.rows[1].a)], a), answer: 0,
        why: 'For descending order a pair is swapped when the left value is <i>smaller</i>. After one pass the smallest value, ' + Math.min.apply(null, a) + ', has moved to the end: ' + L(r.rows[0].a) + '.' };
    } },
    { skill: 'pass-state', gen: function () {
      var a, r, guard = 0; do { a = sample(NAMES, 6); r = bubbleAll(a); } while (r.passes < 3 && guard++ < 200);
      return { kind: 'mcq', q: 'A bubble sort puts these names into alphabetical order: <b>' + L(a) + '</b>. ' + BUB_RULE + ' What is the list after the first pass?',
        options: uniq4(L(r.rows[0].a), [L(sorted(a)), r.rows[1] ? L(r.rows[1].a) : null, L(r.rows[0].firstSwap || a), L(bubblePass(a, true).a)], a), answer: 0,
        why: 'Each neighbouring pair of names is compared once in alphabetical order. The name that comes last in the alphabet, ' + sorted(a)[5] + ', ends at the end of the list: ' + L(r.rows[0].a) + '.' };
    } },
    { skill: 'count-swaps', gen: function () {
      var a = bubbleList(7, 3), p = bubblePass(a);
      return { kind: 'num', q: 'An ascending bubble sort compares pairs from left to right. How many swaps are made in the <b>first pass</b> through <b>' + L(a) + '</b>?', answer: p.swaps, unit: 'swaps',
        why: 'Work along the list, swapping each pair that is out of order and carrying the larger value forward. The list after pass 1 is ' + L(p.a) + ', which took ' + p.swaps + ' swaps.' };
    } },
    { skill: 'count-swaps', gen: function () {
      var a = bubbleList(6, 4), r = bubbleAll(a);
      return { kind: 'num', q: 'An ascending bubble sort is used on <b>' + L(a) + '</b>, comparing pairs from left to right. How many swaps are made in the <b>second pass</b>?', answer: r.rows[1].swaps, unit: r.rows[1].swaps === 1 ? 'swap' : 'swaps',
        why: 'Pass 1 gives ' + L(r.rows[0].a) + '. Pass 2 then gives ' + L(r.rows[1].a) + ', which needs ' + r.rows[1].swaps + ' swap' + (r.rows[1].swaps === 1 ? '' : 's') + '.' };
    } },
    { skill: 'count-passes', gen: function () {
      var a = bubbleList(6, 3), r = bubbleAll(a);
      return { kind: 'num', q: 'An ascending bubble sort is used on <b>' + L(a) + '</b>. ' + BUB_RULE + ' How many passes are made altogether?', answer: r.passes, unit: 'passes',
        why: 'The list is sorted after ' + (r.passes - 1) + ' pass' + (r.passes - 1 === 1 ? '' : 'es') + ' that make swaps. One more pass with no swaps is needed to confirm it is sorted, so ' + r.passes + ' passes in total.' };
    } },
    { skill: 'count-passes', gen: function () {
      var a, r, guard = 0; do { a = sample(FRUITS, 5); r = bubbleAll(a); } while (r.passes < 3 && guard++ < 200);
      return { kind: 'num', q: 'A bubble sort puts <b>' + L(a) + '</b> into alphabetical order. ' + BUB_RULE + ' How many passes are made?', answer: r.passes, unit: 'passes',
        why: 'The passes give: ' + r.rows.map(function (x, i) { return 'pass ' + (i + 1) + ': ' + L(x.a) + ' (' + x.swaps + ' swap' + (x.swaps === 1 ? '' : 's') + ')'; }).join('; ') + '. The last pass has no swaps, so the sort stops after ' + r.passes + '.' };
    } },
    { skill: 'count-passes', gen: function () {
      var a = sorted(distinctNums(rint(5, 8), 2, 90));
      return { kind: 'num', q: 'A bubble sort (ascending) is run on a list that is already in order: <b>' + L(a) + '</b>. ' + BUB_RULE + ' How many passes are made?', answer: 1, unit: 'pass',
        why: 'The algorithm cannot know the list is sorted until it has checked every pair once. That first pass makes no swaps, so the sort stops after 1 pass, not 0.' };
    } },
    { skill: 'count-passes', gen: function () {
      var a = bubbleList(7, 4), r = bubbleAll(a);
      return { kind: 'num', q: 'An ascending bubble sort is used on <b>' + L(a) + '</b>, comparing pairs from left to right. After which pass is the list <b>first</b> completely in order?', answer: r.passes - 1, unit: '',
        why: 'The list is in order after pass ' + (r.passes - 1) + ': ' + L(r.rows[r.passes - 2].a) + '. The algorithm still needs pass ' + r.passes + ' to check that no swaps are needed.' };
    } },
    { skill: 'concepts', gen: function () {
      var a = bubbleList(6, 3), big = Math.max.apply(null, a);
      return { kind: 'mcq', q: 'After the first pass of an ascending bubble sort on <b>' + L(a) + '</b> (pairs compared from left to right), where will the value ' + big + ' be?',
        options: ['In the last position', 'In the first position', 'One place to the right of where it started', 'In the middle of the list'], answer: 0,
        why: big + ' is the largest value. Once it is reached, it is bigger than every value after it, so it is swapped at every step and "bubbles" all the way to the end in one pass.' };
    } },
    { skill: 'concepts', gen: function () {
      var n = rint(5, 8), a = distinctNums(n, 5, 70), m = Math.min.apply(null, a), k = a.indexOf(m);
      a[k] = a[n - 1]; a[n - 1] = m;
      var p = bubblePass(a).a;
      return { kind: 'mcq', q: 'The smallest value, ' + m + ', starts at the end of <b>' + L(a) + '</b>. Where is ' + m + ' after the <b>first</b> pass of an ascending bubble sort (pairs compared left to right)?',
        options: ['One place to the left of where it started', 'At the very front of the list', 'Still at the end of the list', 'Two places to the left of where it started'], answer: 0,
        why: 'A small value can only move one place left in each pass, because it is compared just once with the value in front of it. After pass 1 the list is ' + L(p) + '.' };
    } },
    mc('concepts', 'In a bubble sort, what is meant by one <b>pass</b>?',
      ['Going through the list once, comparing every neighbouring pair from the first pair to the last', 'Making one single swap of two neighbouring values in the list', 'Splitting the list into two halves and sorting each half', 'Looking at the middle item and discarding half of the list'], 0,
      'A pass is a complete run through the list. Several swaps can happen during one pass. Splitting is merge sort and halving is binary search.'),
    mc('concepts', 'An ascending bubble sort is used on a list of 8 different values, comparing pairs from left to right. After the <b>third</b> pass, which values are certain to be in their final places?',
      ['The three largest values, at the end of the list', 'The three smallest values, at the start of the list', 'Only the largest value, at the end of the list', 'All 8 values, because three passes always sort 8 items'], 0,
      'Each pass carries the largest value not yet in place to its final position. After three passes the three largest are fixed at the end.'),
    mc('concepts', 'When does a bubble sort stop?',
      ['After a pass in which no swaps are made', 'As soon as the largest value reaches the end', 'After exactly one pass for every item in the list', 'When the first two items are in the right order'], 0,
      'If a whole pass makes no swaps, every pair is in order, so the list is sorted and the algorithm can stop.'),
    mc('concepts', 'Which statement describes how a bubble sort puts a list in order?',
      ['It compares neighbouring pairs and swaps them if they are in the wrong order, repeating until no swaps happen', 'It splits the list into single items and then merges them back together in order', 'It finds the middle item and compares the target with it to discard half', 'It checks each item in turn from the start until it finds the target'], 0,
      'Bubble sort works only with neighbouring pairs. The other descriptions are merge sort, binary search and linear search.'),
    mc('concepts', 'A list is to be sorted into <b>descending</b> order. What does that mean?',
      ['Largest to smallest', 'Smallest to largest', 'Alphabetical order from A to Z', 'The order in which items were entered'], 0,
      'Descending means going down, from the largest value to the smallest. Ascending is smallest to largest.'),
    mc('concepts', 'A student completing a bubble sort table writes a new row after <b>every single swap</b>. Why is this wrong?',
      ['Each row should show the list after a whole pass, not after each swap', 'Each row should show the list after it has been fully sorted', 'Bubble sort tables should only ever have one row', 'Swaps should never be recorded in a bubble sort'], 0,
      'Mark schemes ignore rows showing individual swaps. Each row should be the state of the list at the end of a complete pass.'),
    { skill: 'count-swaps', gen: function () {
      var a = bubbleList(5, 3), r = bubbleAll(a);
      return { kind: 'num', q: 'An ascending bubble sort is used on <b>' + L(a) + '</b>, comparing pairs from left to right. How many swaps are made <b>in total</b> during the whole sort?', answer: r.swaps, unit: 'swaps',
        why: 'Swaps in each pass: ' + r.rows.map(function (x, i) { return 'pass ' + (i + 1) + ' = ' + x.swaps; }).join(', ') + '. Total = ' + r.swaps + '.' };
    } },
    { skill: 'pass-state', gen: function () {
      var a, r, guard = 0; do { a = sample(NAMES, 7); r = bubbleAll(a, true); } while (r.passes < 4 && guard++ < 200);
      return { kind: 'mcq', q: 'A bubble sort puts these names into <b>reverse</b> alphabetical order (Z to A): <b>' + L(a) + '</b>. ' + BUB_RULE + ' What is the list after the first pass?',
        options: uniq4(L(r.rows[0].a), [L(bubblePass(a).a), L(sorted(a, true)), L(r.rows[1].a)], a), answer: 0,
        why: 'For Z to A, a pair is swapped when the left name comes earlier in the alphabet. After one pass the name that comes first in the alphabet, ' + sorted(a)[0] + ', is at the end: ' + L(r.rows[0].a) + '.' };
    } },
    { skill: 'count-swaps', gen: function () {
      var n = rint(6, 12);
      return { kind: 'num', q: 'A list holds ' + n + ' items. How many comparisons are made in one full pass of a bubble sort?', answer: n - 1, unit: 'comparisons',
        why: 'Each comparison uses a neighbouring pair. ' + n + ' items have ' + (n - 1) + ' neighbouring pairs (items 1–2, 2–3, … ' + (n - 1) + '–' + n + ').' };
    } },
    { skill: 'pass-state', gen: function () {
      var a = bubbleList(6, 4), r = bubbleAll(a);
      var rows = r.rows.slice(0, 3).map(function (x) { return x.a.slice(); });
      var stud = [L(a)].concat(rows.map(L));
      var which = rint(1, 2);
      if (which === 1 && L(r.rows[0].firstSwap) === L(rows[0])) which = 2;
      if (which === 1) stud[1] = L(r.rows[0].firstSwap); else stud[2] = L(sorted(a));
      var tableRows = stud.map(function (s, i) { return [i === 0 ? 'Start' : 'After pass ' + i, s]; });
      return { kind: 'mcq', q: 'A student records an ascending bubble sort. ' + BUB_RULE + ' Which row is the <b>first</b> one that is wrong?' + tbl(['Row', 'List'], tableRows),
        options: ['After pass ' + which, 'Start', 'After pass ' + (which === 1 ? 2 : 1), 'After pass 3'], answer: 0,
        why: 'Pass 1 should give ' + L(rows[0]) + ' and pass 2 should give ' + L(rows[1]) + '. The row "After pass ' + which + '" does not match, so it is the first wrong row.' };
    } }
  ] };

  // =====================================================================
  // CSC-T1-09 Merge sort: split, then merge
  // =====================================================================
  B['CSC-T1-09'] = { title: 'Merge sort: split, then merge', items: [
    { skill: 'split-stage', gen: function () {
      var a = distinctNums(8, 1, 50);
      var right = showGroups(groups(a, 4)), bad1 = showGroups(groups(sorted(a), 4)), bad2 = showGroups([a.filter(function (_, i) { return i % 2 === 0; }), a.filter(function (_, i) { return i % 2 === 1; })]), bad3 = showGroups(groups(a, 2));
      return { kind: 'mcq', q: 'A merge sort is used on <b>' + L(a) + '</b>. What are the two lists after the <b>first split</b>?', options: [right, bad1, bad2, bad3], answer: 0,
        why: 'Splitting only divides the list in half, keeping the original order: the first four items and the last four items. No sorting happens while splitting.' };
    } },
    { skill: 'split-stage', gen: function () {
      var a = distinctNums(8, 1, 50);
      return { kind: 'mcq', q: 'A merge sort is used on <b>' + L(a) + '</b>. What lists are there after the <b>second</b> round of splitting?', options: [showGroups(groups(a, 2)), showGroups(groups(a, 4)), showGroups(groups(a, 2).map(function (g) { return sorted(g); })), showGroups(groups(sorted(a), 2))].filter(function (v, i, arr) { return arr.indexOf(v) === i; }).concat([showGroups(groups(a, 1))]).slice(0, 4), answer: 0,
        why: 'First split: two lists of four. Second split: each four splits into two pairs, still in the original order. Pairs are only put in order when merging starts.' };
    } },
    { skill: 'merge-stage', gen: function () {
      var a = distinctNums(8, 1, 60), lv = mergeLevels(a);
      return { kind: 'mcq', q: 'A merge sort (ascending) has split <b>' + L(a) + '</b> into single items. What are the lists after the <b>first</b> round of merging?',
        options: uniq4(showGroups(lv[0]), [showGroups(groups(a, 2)), showGroups(lv[1]), showGroups(groups(sorted(a), 2)), showGroups(mergeLevels(a, true)[0])], a), answer: 0,
        why: 'Neighbouring single items are merged into pairs, each in order: ' + showGroups(lv[0]) + '. Pairs are formed from neighbours only.' };
    } },
    { skill: 'merge-stage', gen: function () {
      var a = distinctNums(8, 1, 60), lv = mergeLevels(a);
      return { kind: 'mcq', q: 'A merge sort (ascending) has reached these sorted pairs: <b>' + showGroups(lv[0]) + '</b>. What are the lists after the <b>next</b> round of merging?',
        options: uniq4(showGroups(lv[1]), [showGroups(groups(lv[0].reduce(function (s, g) { return s.concat(g); }, []), 4)), showGroups(lv[2]), showGroups(groups(sorted(a), 4).reverse()), showGroups(lv[0].map(function (g) { return g.slice().reverse(); }))], a), answer: 0,
        why: 'Neighbouring pairs are merged into sorted lists of four by repeatedly taking the smaller front item: ' + showGroups(lv[1]) + '. Simply joining pairs together is not merging.' };
    } },
    { skill: 'merge-two-lists', gen: function () {
      var all = distinctNums(7, 1, 80), x = sorted(all.slice(0, 3)), y = sorted(all.slice(3)), m = mergeLists(x, y);
      return { kind: 'mcq', q: 'Two sorted lists are merged into one ascending list: <b>[' + L(x) + ']</b> and <b>[' + L(y) + ']</b>. What is the merged list?',
        options: uniq4(L(m), [L(x.concat(y)), L(y.concat(x)), L(sorted(all, true))], all), answer: 0,
        why: 'Compare the front items of the two lists and take the smaller each time until both are empty: ' + L(m) + '.' };
    } },
    { skill: 'merge-two-lists', gen: function () {
      var all = distinctNums(8, 1, 80), x = sorted(all.slice(0, 4)), y = sorted(all.slice(4)), m = mergeLists(x, y), k = rint(2, 4);
      return { kind: 'mcq', q: 'The sorted lists <b>[' + L(x) + ']</b> and <b>[' + L(y) + ']</b> are being merged into ascending order. The first ' + k + ' items placed are ' + L(m.slice(0, k)) + '. Which item is placed next?',
        options: [String(m[k])].concat(sample(m.slice(k + 1), 3).map(String)), answer: 0,
        why: 'After ' + L(m.slice(0, k)) + ' have been taken, the front items left are compared and the smaller one, ' + m[k] + ', is placed next.' };
    } },
    { skill: 'merge-stage', gen: function () {
      var a = distinctNums(8, 1, 60), lv = mergeLevels(a, true);
      return { kind: 'mcq', q: 'A merge sort puts <b>' + L(a) + '</b> into <b>descending</b> order. What are the lists after the first round of merging?',
        options: uniq4(showGroups(lv[0]), [showGroups(mergeLevels(a)[0]), showGroups(groups(a, 2)), showGroups(lv[1]), showGroups(groups(sorted(a), 2))], a), answer: 0,
        why: 'For descending order each pair is merged with the larger value first: ' + showGroups(lv[0]) + '.' };
    } },
    { skill: 'merge-stage', gen: function () {
      var w = sample(FRUITS, 4), lv = mergeLevels(w, true);
      return { kind: 'mcq', q: 'A merge sort puts these single items into <b>reverse</b> alphabetical order (Z to A): <b>' + showGroups(w.map(function (x) { return [x]; })) + '</b>. What are the lists after the first round of merging?',
        options: uniq4(showGroups(lv[0]), [showGroups(mergeLevels(w)[0]), showGroups(groups(w, 2)), showGroups(lv[1]), showGroups(groups(sorted(w), 2)), showGroups([sorted(w)])], w), answer: 0,
        why: 'Neighbours are merged in pairs, with the word that comes later in the alphabet placed first: ' + showGroups(lv[0]) + '.' };
    } },
    { skill: 'count-stages', gen: function () {
      var n = pick([4, 8, 16, 32]), k = Math.round(Math.log(n) / Math.LN2);
      return { kind: 'num', q: 'A merge sort is used on a list of ' + n + ' items. How many rounds of merging are needed to go from single items back to one sorted list?', answer: k, unit: 'rounds',
        why: 'Each round halves the number of lists: ' + Array.apply(null, Array(k + 1)).map(function (_, i) { return n / Math.pow(2, i); }).join(' → ') + '. That is ' + k + ' rounds.' };
    } },
    { skill: 'count-stages', gen: function () {
      var n = rint(5, 13);
      return { kind: 'num', q: 'A list of ' + n + ' items is split by a merge sort until no more splitting is possible. How many lists are there at the end of splitting?', answer: n, unit: 'lists',
        why: 'Splitting continues until every list holds just one item, so ' + n + ' items give ' + n + ' single-item lists.' };
    } },
    { skill: 'count-stages', gen: function () {
      var n = pick([8, 16, 32]);
      return { kind: 'num', q: 'A merge sort is used on ' + n + ' items. How many sorted lists are there after the <b>second</b> round of merging?', answer: n / 4, unit: 'lists',
        why: 'Round 1 merges ' + n + ' single items into ' + (n / 2) + ' pairs. Round 2 merges the pairs into ' + (n / 4) + ' lists of four.' };
    } },
    mc('concepts', 'Merge sort is described as a <b>divide and conquer</b> algorithm. What does this mean?',
      ['It splits the problem into smaller parts, solves them, then combines the results', 'It compares neighbouring items and swaps them when they are out of order', 'It checks every item from the first to the last in order', 'It divides each number by two until it reaches zero'], 0,
      'Merge sort divides the list into single items (easy to "solve") and conquers by merging them back into one sorted list.'),
    mc('concepts', 'Why is a list containing just one item treated as already sorted?',
      ['A single item cannot be out of order with anything', 'Single items are always the smallest values', 'The merge sort has already sorted it while splitting', 'One-item lists are removed from the sort'], 0,
      'Order only matters between two or more items, so a one-item list is sorted by definition. This is why splitting stops there.'),
    mc('concepts', 'In a merge sort, what does <b>merging</b> two lists mean?',
      ['Combining two sorted lists into one sorted list by repeatedly taking the smaller front item', 'Joining the second list onto the end of the first list without comparing', 'Swapping each item in one list with the item in the same place in the other', 'Removing any items that appear in both lists'], 0,
      'Merging compares the front items of the two sorted lists and takes one at a time, so the combined list stays in order.'),
    mc('concepts', 'While splitting a list, a student puts each half into order before splitting it again. What is wrong?',
      ['Splitting should only divide the list; items are put in order during merging', 'The halves should be put in descending order instead', 'Nothing is wrong; sorting while splitting is part of merge sort', 'The list should be split into thirds, not halves'], 0,
      'In a merge sort the split stage keeps the original order. All the ordering is done as the lists are merged back together.'),
    mc('concepts', 'After the first round of merging, a merge sort has the pairs [3, 9] [2, 7] [5, 8] [1, 6]. Which lists are merged with each other next?',
      ['[3, 9] with [2, 7], and [5, 8] with [1, 6]', '[3, 9] with [1, 6], and [2, 7] with [5, 8]', '[3, 9] with [5, 8], and [2, 7] with [1, 6]', 'All four pairs are merged into one list in a single step'], 0,
      'Only neighbouring lists are merged, and each round merges pairs of lists. Jumping straight from pairs to the full list skips a level.'),
    mu('concepts', 'Which of these statements about merge sort are true?',
      ['The list is split in half repeatedly until each list has one item', 'Sorted lists are combined by comparing their front items', 'The number of lists halves in each round of merging', 'It compares neighbouring items and swaps them if needed', 'It stops after a pass in which no swaps are made'], [0, 1, 2],
      'Swapping neighbours and stopping after a pass with no swaps describe bubble sort, not merge sort.'),
    { skill: 'merge-two-lists', gen: function () {
      var w = sample(NAMES, 6), x = sorted(w.slice(0, 3)), y = sorted(w.slice(3)), m = mergeLists(x, y);
      return { kind: 'mcq', q: 'Two lists already in alphabetical order are merged: <b>[' + L(x) + ']</b> and <b>[' + L(y) + ']</b>. What is the merged list?',
        options: uniq4(L(m), [L(x.concat(y)), L(y.concat(x)), L(sorted(w, true))], w), answer: 0,
        why: 'Compare the first name in each list and take whichever comes first in the alphabet, repeating until both lists are empty: ' + L(m) + '.' };
    } },
    { skill: 'merge-two-lists', gen: function () {
      var all = distinctNums(7, 1, 90), x = sorted(all.slice(0, 4), true), y = sorted(all.slice(4), true), m = mergeLists(x, y, true);
      return { kind: 'mcq', q: 'Two lists in <b>descending</b> order are merged into one descending list: <b>[' + L(x) + ']</b> and <b>[' + L(y) + ']</b>. What is the result?',
        options: uniq4(L(m), [L(x.concat(y)), L(sorted(all)), L(y.concat(x))], all), answer: 0,
        why: 'For descending order, take the <i>larger</i> front item each time: ' + L(m) + '.' };
    } },
    { skill: 'merge-stage', gen: function () {
      var a = distinctNums(8, 1, 60), lv = mergeLevels(a);
      return { kind: 'mcq', q: 'A merge sort (ascending) has these two sorted lists left: <b>' + showGroups(lv[1]) + '</b>. What is the result of the final merge?',
        options: uniq4(L(lv[2][0]), [L(lv[1][0].concat(lv[1][1])), L(lv[1][1].concat(lv[1][0])), L(sorted(a, true))], a), answer: 0,
        why: 'The final merge combines the two sorted halves by repeatedly taking the smaller front item: ' + L(lv[2][0]) + '.' };
    } },
    mc('split-stage', 'A student\'s merge sort of 8 items goes straight from four sorted pairs to one sorted list of 8. What mistake has been made?',
      ['A level has been skipped: the pairs should first be merged into two lists of four', 'Nothing; pairs can always be merged straight into the final list', 'The pairs should have been split again into single items', 'The pairs should have been merged into lists of three'], 0,
      'Each round merges neighbouring lists two at a time: pairs into fours, then fours into eight. Mark schemes expect each level to be shown.'),
    mc('split-stage', 'A list of 8 items is split by a merge sort. Which sequence shows the sizes of the lists at each level of splitting?',
      ['8 → 4 and 4 → 2, 2, 2, 2 → eight lists of 1', '8 → 7 and 1 → 6 and 1 → … → eight lists of 1', '8 → 2, 2, 2, 2 → eight lists of 1', '8 → eight lists of 1 in a single step'], 0,
      'Each split halves every list, so 8 items need three levels of splitting: 4s, then 2s, then 1s.')
  ] };

  // =====================================================================
  // CSC-T1-10 Binary search step by step
  // =====================================================================
  function bsList(n) { return sorted(distinctNums(n, 3, 99)); }
  B['CSC-T1-10'] = { title: 'Binary search step by step', items: [
    { skill: 'midpoint', gen: function () {
      var n = rint(7, 16), a = bsList(n), mid = Math.floor((n - 1) / 2);
      return { kind: 'num', q: 'A binary search is carried out on a sorted array of ' + n + ' items with indexes 0 to ' + (n - 1) + '. ' + BS_RULE + ' What is the index of the first item examined?', answer: mid, unit: '',
        why: 'low = 0 and high = ' + (n - 1) + ', so mid = (0 + ' + (n - 1) + ') DIV 2 = ' + mid + '. DIV keeps only the whole-number part, so the result is rounded down.' };
    } },
    { skill: 'sequence', gen: function () {
      var n = rint(9, 15), a = bsList(n), t = a[rint(0, n - 1)], r = bsearch(a, t), up = bsearch(a, t, true);
      while (r.steps.length < 3) { t = a[rint(0, n - 1)]; r = bsearch(a, t); up = bsearch(a, t, true); }
      var seq = r.steps.map(function (s) { return s.val; });
      return { kind: 'mcq', q: 'A binary search looks for ' + t + ' in this sorted array. ' + BS_RULE + ' Which items are examined, in order?' + tbl(['Index'].concat(a.map(function (_, i) { return i; })), [['Item'].concat(a)]),
        options: uniq4(L(seq), [L(up.steps.map(function (s) { return s.val; })), L(a.slice(0, a.indexOf(t) + 1).slice(-seq.length)), L(seq.slice().reverse())], seq.concat([a[0]])), answer: 0,
        why: r.steps.map(function (s) { return 'low ' + s.low + ', high ' + s.high + ', mid ' + s.mid + ' → ' + s.val; }).join('; ') + '. The target is found on the ' + ordinal(seq.length) + ' check.' };
    } },
    { skill: 'sequence', gen: function () {
      var n = rint(8, 14), a = bsList(n), t, r, guard = 0;
      do { t = rint(4, 98); r = bsearch(a, t); } while ((r.found || r.steps.length < 3) && guard++ < 300);
      var seq = r.steps.map(function (s) { return s.val; });
      return { kind: 'mcq', q: 'A binary search looks for ' + t + ', which is <b>not</b> in this sorted array. ' + BS_RULE + ' Which items are examined before the search ends?' + tbl(['Index'].concat(a.map(function (_, i) { return i; })), [['Item'].concat(a)]),
        options: uniq4(L(seq), [L(bsearch(a, t, true).steps.map(function (s) { return s.val; })), L(seq.slice(0, -1)), L(seq.slice().reverse())], seq.concat([a[n - 1]])), answer: 0,
        why: r.steps.map(function (s) { return 'mid ' + s.mid + ' → ' + s.val; }).join('; ') + '. Then low (' + r.low + ') is greater than high (' + r.high + '), so the search ends: ' + t + ' is not in the list.' };
    } },
    { skill: 'sequence', gen: function () {
      var n = rint(12, 20), a = bsList(n), t = a[rint(0, n - 1)], r = bsearch(a, t);
      while (r.steps.length < 2) { t = a[rint(0, n - 1)]; r = bsearch(a, t); }
      return { kind: 'num', q: 'A sorted array holds ' + n + ' items: ' + L(a) + '. ' + BS_RULE + ' How many items are examined to find ' + t + '?', answer: r.steps.length, unit: 'items',
        why: 'Items examined: ' + r.steps.map(function (s) { return s.val + ' (index ' + s.mid + ')'; }).join(', ') + '. ' + t + ' is found on check ' + r.steps.length + '.' };
    } },
    { skill: 'low-high-update', gen: function () {
      var n = rint(9, 16), a = bsList(n), mid = Math.floor((n - 1) / 2), left = Math.random() < 0.5, t = left ? a[rint(0, mid - 1)] : a[rint(mid + 1, n - 1)];
      var f = function (lo, hi) { return 'low = ' + lo + ', high = ' + hi; };
      var right = left ? f(0, mid - 1) : f(mid + 1, n - 1);
      return { kind: 'mcq', q: 'A binary search for ' + t + ' starts with low = 0 and high = ' + (n - 1) + ' on this sorted array. ' + BS_RULE + ' What are low and high after the first comparison?' + tbl(['Index'].concat(a.map(function (_, i) { return i; })), [['Item'].concat(a)]),
        options: uniq4(right, [left ? f(0, mid) : f(mid, n - 1), left ? f(mid + 1, n - 1) : f(0, mid - 1), f(0, n - 1)], []), answer: 0,
        why: 'mid = (0 + ' + (n - 1) + ') DIV 2 = ' + mid + ', which holds ' + a[mid] + '. ' + t + (left ? ' is smaller, so the upper half is discarded: high = ' + mid + ' − 1 = ' + (mid - 1) + '.' : ' is larger, so the lower half is discarded: low = ' + mid + ' + 1 = ' + (mid + 1) + '.') };
    } },
    { skill: 'low-high-update', gen: function () {
      var n = rint(10, 16), a = bsList(n), t, r, guard = 0;
      do { t = a[rint(0, n - 1)]; r = bsearch(a, t); } while (r.steps.length < 3 && guard++ < 200);
      var s = r.steps[1], f = function (lo, hi, m) { return 'low ' + lo + ', high ' + hi + ', mid ' + m; };
      return { kind: 'mcq', q: 'A binary search for ' + t + ' is recorded in a table with columns low, high and mid. ' + BS_RULE + ' What does the <b>second</b> row show?' + tbl(['Index'].concat(a.map(function (_, i) { return i; })), [['Item'].concat(a)]),
        options: uniq4(f(s.low, s.high, s.mid), [f(s.low, s.high, Math.ceil((s.low + s.high) / 2)), f(r.steps[0].low, r.steps[0].high, r.steps[0].mid), (s.low === 0 ? f(0, r.steps[0].mid, Math.floor(r.steps[0].mid / 2)) : f(r.steps[0].mid, s.high, Math.floor((r.steps[0].mid + s.high) / 2))), f(s.low, s.high, s.mid + 1), f(s.low, s.high + 1, s.mid + 1)], []), answer: 0,
        why: 'Row 1: ' + f(r.steps[0].low, r.steps[0].high, r.steps[0].mid) + ' (item ' + r.steps[0].val + '). ' + t + ' is ' + (t < r.steps[0].val ? 'smaller, so high = ' + (r.steps[0].mid - 1) : 'larger, so low = ' + (r.steps[0].mid + 1)) + '. Row 2: mid = (' + s.low + ' + ' + s.high + ') DIV 2 = ' + s.mid + '.' };
    } },
    { skill: 'max-checks', gen: function () {
      var n = pick([rint(5, 7), rint(9, 15), rint(17, 31), rint(33, 63), rint(65, 127), rint(129, 255), rint(500, 1000), rint(1025, 2047)]), k = maxChecks(n);
      return { kind: 'num', q: 'A sorted list holds ' + n + ' items. In the worst case, how many items does a binary search check before it finds an item or shows it is not there?', answer: k, unit: 'items',
        why: 'Each check halves the part still to search. ' + n + ' can be halved ' + (k - 1) + ' times before one item is left (2<sup>' + (k - 1) + '</sup> = ' + Math.pow(2, k - 1) + ' ≤ ' + n + ' &lt; ' + Math.pow(2, k) + '), plus the final check: ' + k + ' items.' };
    } },
    { skill: 'max-checks', gen: function () {
      var k = rint(4, 9), n = Math.pow(2, k) - 1 + rint(1, Math.pow(2, k) - 1);
      return { kind: 'num', q: 'A binary search needs at most ' + (k + 1) + ' checks on a sorted list of ' + n + ' items. The list then doubles to ' + (2 * n) + ' items. What is the new maximum number of checks?', answer: k + 2, unit: 'checks',
        why: 'Doubling the list adds just one halving step: the first check cuts ' + (2 * n) + ' items back to about ' + n + '. So the maximum goes from ' + (k + 1) + ' to ' + (k + 2) + '.' };
    } },
    { skill: 'unsorted', gen: function () {
      var w, guard = 0, t, r;
      do { w = sample(NAMES, 7); t = w[rint(0, 6)]; r = bsearch(w, t); } while ((r.found || L(w) === L(sorted(w))) && guard++ < 500);
      if (r.found) { w = ['Tara', 'Elif', 'Omar', 'Hugo', 'Amara', 'Zane', 'Lena']; t = 'Elif'; r = bsearch(w, t); }
      return { kind: 'mcq', q: 'A binary search is used to look for "' + t + '" in this array. Why does it fail to find it?' + tbl(['Index', '0', '1', '2', '3', '4', '5', '6'], [['Name'].concat(w)]),
        options: ['The array is not sorted, so the half that is discarded can contain the target', 'Binary search only works on numbers, not on names', 'The array has an odd number of items, so there is no middle item', 'The target is at the start, and binary search never checks the start'], answer: 0,
        why: 'The search examines ' + r.steps.map(function (s) { return '"' + s.val + '"'; }).join(', ') + ' and after each check throws away the half that should not hold "' + t + '" if the names were in alphabetical order. They are not, so "' + t + '" (index ' + w.indexOf(t) + ') ends up in a discarded part and is never examined; the search stops with low greater than high.' };
    } },
    mc('unsorted', 'Before a binary search can be used, what must be true of the list?',
      ['It must already be sorted', 'It must contain an even number of items', 'It must contain only numbers', 'It must have fewer than 100 items'], 0,
      'Binary search decides which half to discard by comparing with the middle item, which only works if the items are in order.'),
    mc('midpoint', 'For low = 0 and high = 9, a student calculates the midpoint as 5. What should it be, using (low + high) DIV 2?',
      ['4', '5', '4.5', '9'], 0,
      '(0 + 9) DIV 2 = 9 DIV 2 = 4. DIV keeps only the whole-number part, so 4.5 becomes 4, not 5.'),
    mc('low-high-update', 'In a binary search, the target is <b>smaller</b> than the item at mid. Which update is correct?',
      [c('high = mid - 1'), c('high = mid'), c('low = mid + 1'), c('low = mid - 1')], 0,
      'The target must be below mid, and mid has already been checked, so the new upper limit is mid − 1. Using mid would check the same item again.'),
    mc('low-high-update', 'How does a binary search know that the target is <b>not</b> in the list?',
      ['low becomes greater than high, so there are no items left to search', 'mid becomes 0', 'The middle item is larger than the target', 'It has checked every item in the list one by one'], 0,
      'Each step narrows the range from low to high. When low passes high the range is empty, so the target cannot be there.'),
    { skill: 'sequence', gen: function () {
      var w = sorted(sample(NAMES, rint(9, 13))), t = w[rint(0, w.length - 1)], r = bsearch(w, t);
      while (r.steps.length < 2) { t = w[rint(0, w.length - 1)]; r = bsearch(w, t); }
      var seq = r.steps.map(function (s) { return s.val; });
      return { kind: 'mcq', q: 'A binary search looks for "' + t + '" in this alphabetical list: ' + L(w) + '. ' + BS_RULE + ' Which names are examined, in order?',
        options: uniq4(L(seq), [L(bsearch(w, t, true).steps.map(function (s) { return s.val; })), L(w.slice(0, w.indexOf(t) + 1).slice(-seq.length)), L(seq.slice(1))], seq.concat([w[0], w[w.length - 1]])), answer: 0,
        why: r.steps.map(function (s) { return 'mid ' + s.mid + ' → ' + s.val; }).join('; ') + '. Names are compared in alphabetical order to decide which half to keep.' };
    } },
    { skill: 'midpoint', gen: function () {
      var w = sorted(sample(FRUITS, rint(7, 12))), mid = Math.floor((w.length - 1) / 2);
      return { kind: 'mcq', q: 'A binary search is used on this sorted list: ' + L(w) + '. ' + BS_RULE + ' Which item is examined first?',
        options: uniq4(w[mid], [w[Math.ceil((w.length - 1) / 2)], w[0], w[w.length - 1], w[mid + 1]], w), answer: 0,
        why: 'There are ' + w.length + ' items, indexes 0 to ' + (w.length - 1) + '. mid = (0 + ' + (w.length - 1) + ') DIV 2 = ' + mid + ', which holds "' + w[mid] + '".' };
    } },
    mc('concepts', 'Why is binary search called a <b>divide and conquer</b> algorithm?',
      ['Each comparison splits the remaining items in two and discards the half that cannot contain the target', 'It divides each item by two before comparing it', 'It sorts the list and then divides it into single items', 'It checks every item from first to last until the target is found'], 0,
      'The problem is repeatedly made smaller: each check halves the part of the list still to be searched.'),
    { skill: 'concepts', gen: function () {
      var n = pick([15, 31, 63, 127]), half = (n - 1) / 2;
      return { kind: 'num', q: 'A sorted list holds ' + n + ' items. After the first check of a binary search (which does not find the target), how many items are still left to search?', answer: half, unit: 'items',
        why: 'The middle item, index ' + half + ', has been checked and ruled out, and so has one half. ' + n + ' − 1 = ' + (n - 1) + ' items are split equally, leaving ' + half + '.' };
    } },
    { skill: 'sequence', gen: function () {
      var n = rint(10, 15), a = bsList(n), t, r, guard = 0;
      do { t = rint(4, 98); r = bsearch(a, t); } while ((r.found || r.steps.length < 3) && guard++ < 300);
      var last = r.steps[r.steps.length - 1].val;
      return { kind: 'num', q: 'A binary search looks for ' + t + ' in the sorted array ' + L(a) + '. ' + BS_RULE + ' The target is not there. What is the <b>last</b> item examined before the search ends?', answer: last, unit: '',
        why: 'Items examined: ' + r.steps.map(function (s) { return s.val; }).join(', ') + '. After ' + last + ', low is greater than high, so the search stops.' };
    } },
    mu('unsorted', 'Which of these lists could be searched correctly with a binary search?',
      ['3, 8, 15, 22, 40, 41', 'Ali, Ben, Cara, Dev, Eve', '90, 72, 55, 31, 12 (with the comparisons reversed for descending order)', '12, 3, 40, 8, 22, 15', 'Eve, Ali, Dev, Ben, Cara'], [0, 1, 2],
      'Binary search needs the list in order (ascending, alphabetical, or descending if the comparisons are reversed). The last two lists are not in any order.'),
    { skill: 'unsorted', gen: function () {
      var a = [41, 7, 63, 25, 90, 12, 58], t = pick([7, 41, 12, 58]), r = bsearch(a, t);
      return { kind: 'mcq', q: 'A binary search for ' + t + ' is run on the <b>unsorted</b> array ' + L(a) + '. ' + BS_RULE + ' What happens?',
        options: [r.found ? 'It finds ' + t + ', but only by luck; the result cannot be relied on' : 'It reports that ' + t + ' is not there, even though it is', 'It sorts the array first and then finds ' + t, 'It crashes because the array is not sorted', 'It checks every item and finds ' + t + ' at the end'], answer: 0,
        why: 'Items examined: ' + r.steps.map(function (s) { return s.val; }).join(', ') + '. ' + (r.found ? 'It happens to land on ' + t + ', but on unsorted data binary search can discard the half that holds the target, so it is unreliable.' : 'Comparing with ' + r.steps[0].val + ' sends the search into the wrong half, so ' + t + ' is never examined.') };
    } },
    mc('max-checks', 'A sorted list holds the names of 6 paint colours. In the worst case, how many names does a binary search check?',
      ['3', '6', '2', '4'], 0,
      'With indexes 0 to 5, the first check is index 2. In the worst case 3 names are left (indexes 3 to 5), the next check is index 4, and then 1 name is left: 3 checks in all.'),
    mc('midpoint', 'Why is the midpoint of a binary search worked out with DIV rather than ordinary division?',
      ['An index must be a whole number, so any fractional part is dropped', 'DIV gives a more accurate answer, including the decimal part', 'Ordinary division cannot be used on numbers stored in an array', 'DIV always rounds up, so the search checks the upper half first'], 0,
      'Positions in an array are whole numbers. (0 + 7) / 2 = 3.5 is not a valid index, but 7 DIV 2 = 3 is.')
  ] };

  // =====================================================================
  // CSC-T1-11 Compare sorts and searches
  // =====================================================================
  B['CSC-T1-11'] = { title: 'Compare sorts and searches', items: [
    mc('describe', 'Which description of a <b>linear search</b> is complete?',
      ['Each item is checked in turn from the first until the target is found or the end of the list is reached', 'The middle item is checked and half the list is discarded each time', 'Each item is checked in turn from the first item onwards', 'Neighbouring items are compared and swapped until the list is in order'], 0,
      'A full description says how it works and when it stops. "Checked in turn" alone does not say when the search ends.'),
    mc('linear-vs-binary', 'Give one advantage of a linear search compared with a binary search.',
      ['It works on lists that are not sorted', 'It always needs fewer comparisons on large lists', 'It halves the list after every comparison', 'It can only be used on numbers'], 0,
      'A linear search simply checks each item, so the order does not matter. A binary search needs a sorted list.'),
    mc('linear-vs-binary', 'Why is a linear search often described as simpler than a binary search?',
      ['It only needs a loop that checks each item in turn, with no low, high or midpoint to track', 'It is written in pseudocode rather than program code, so it never needs to be translated before it runs', 'It never needs any comparisons at all', 'It sorts the list as it searches it'], 0,
      'A linear search is easy to write and understand. A binary search has to track the low, high and mid positions correctly.'),
    mc('linear-vs-binary', 'Give one disadvantage of a linear search compared with a binary search on a large sorted list.',
      ['It may have to check every item, so it can take much longer', 'It cannot search a sorted list', 'It may miss the target because it discards half of the list', 'It needs the list to be sorted first'], 0,
      'In the worst case a linear search checks all n items, while a binary search on a sorted list needs only a few checks.'),
    mc('linear-vs-binary', 'Which answer gives the best linked explanation of an advantage of binary search over linear search?',
      ['Each comparison halves the items left to search, so far fewer comparisons are needed on a large list', 'Binary search is faster', 'Binary search is more modern than linear search', 'Binary search is used by most programmers'], 0,
      'A linked explanation gives the reason (halving) and its effect (fewer comparisons). "It is faster" on its own gives no reason.'),
    mc('bubble-vs-merge', 'Why does a bubble sort use very little extra memory?',
      ['It sorts the list in place, needing only one temporary variable for swaps', 'It never compares any items directly, so nothing extra has to be stored in memory at all', 'It splits the list into many new smaller lists', 'It stores a second sorted copy of the list'], 0,
      'Bubble sort rearranges items inside the original list. Merge sort creates new lists while splitting and merging, which needs more memory.'),
    mc('bubble-vs-merge', 'Explain one drawback of using merge sort on a very large data set.',
      ['It needs extra memory, because new lists are created to hold the split and merged items', 'It is slower than bubble sort on every large data set, because it has to split the data so many times', 'It cannot sort numbers, only words', 'It only works if the data is already sorted'], 0,
      'Merge sort does not sort in place: the split and merged lists take extra memory, which matters when the data set is huge.'),
    mc('bubble-vs-merge', 'Why is merge sort usually chosen over bubble sort for a large list when memory is not a problem?',
      ['It is usually much faster on large lists because it needs far fewer comparisons', 'It uses less memory than bubble sort, because it never needs a temporary variable for swaps', 'It is simpler to write than bubble sort', 'It stops as soon as one pass has no swaps'], 0,
      'Bubble sort may need many passes over a large list. Merge sort\'s divide and conquer approach needs far fewer comparisons, at the cost of extra memory.'),
    mc('choose', 'A library catalogue holds 50 000 book titles in alphabetical order. Staff need to find a title quickly. Which answer names the most appropriate search and gives a justification that would earn credit?',
      ['Binary search, because each comparison halves the titles left, so very few checks are needed', 'Linear search, because it works on lists that are not sorted', 'Binary search, because the titles are in alphabetical order', 'Linear search, because it checks every title so it cannot miss one'], 0,
      'The justification must be a reason binary search is better, not a repeat of the fact (already given) that the list is sorted.'),
    mc('choose', 'A list of 12 unsorted raffle numbers is searched once for a single number. Which search is most suitable?',
      ['Linear search, because the list is unsorted and very short', 'Binary search, because it is always the fastest search for any list of any length', 'Merge sort, because the list must be searched', 'Bubble sort, because the list is short'], 0,
      'A binary search would need the list sorted first, which is not worth it for one search of 12 items. Sorts do not search.'),
    mc('choose', 'A smart watch with very little memory must sort a list of 20 step counts. Which algorithm is more suitable?',
      ['Bubble sort, because it sorts in place and needs almost no extra memory', 'Merge sort, because it creates extra lists while sorting, which keeps the watch\'s memory free', 'Binary search, because it halves the list each time', 'Linear search, because it checks every item'], 0,
      'With little memory and a short list, sorting in place matters more than speed, so bubble sort suits it.'),
    mc('choose', 'A server with plenty of memory must sort 10 million records as quickly as possible. Which algorithm is more suitable?',
      ['Merge sort, because it is much faster on very large lists', 'Bubble sort, because it uses the least memory', 'Linear search, because it checks every record', 'Bubble sort, because it stops after a pass with no swaps'], 0,
      'On huge data sets merge sort makes far fewer comparisons. Its extra memory use is not a problem here.'),
    { skill: 'linear-vs-binary', gen: function () {
      var n = pick([rint(60, 120), rint(200, 500), rint(900, 1000), rint(3000, 5000)]), k = maxChecks(n);
      var f = function (a, b) { return 'Linear: ' + a + ', binary: ' + b; };
      return { kind: 'mcq', q: 'A sorted list holds ' + n + ' items. What is the greatest number of comparisons each search might need?',
        options: [f(n, k), f(k, n), f(n, Math.round(n / 2)), f(Math.round(n / 2), k)], answer: 0,
        why: 'A linear search may check all ' + n + ' items. A binary search halves the list each time: ' + n + ' can be halved ' + (k - 1) + ' times before one item is left, plus one check, so at most ' + k + '.' };
    } },
    { skill: 'linear-vs-binary', gen: function () {
      var k = rint(7, 12), n = Math.pow(2, k - 1) + rint(1, Math.pow(2, k - 1) - 1), b = maxChecks(n);
      return { kind: 'num', q: 'A sorted list holds ' + n + ' items. In the worst case, how many <b>more</b> comparisons does a linear search make than a binary search?', answer: n - b, unit: 'comparisons',
        why: 'Worst case: linear = ' + n + ', binary = ' + b + ' (2<sup>' + (b - 1) + '</sup> ≤ ' + n + ' &lt; 2<sup>' + b + '</sup>). Difference = ' + n + ' − ' + b + ' = ' + (n - b) + '.' };
    } },
    mu('bubble-vs-merge', 'Which statements about bubble sort and merge sort are true?',
      ['Merge sort needs more memory than bubble sort', 'Bubble sort sorts the list in place', 'Merge sort is usually faster on large lists', 'Bubble sort needs the list to be split into single items first', 'Merge sort stops after a pass with no swaps'], [0, 1, 2],
      'Splitting into single items is merge sort, and stopping after a pass with no swaps is bubble sort, so the last two statements mix the algorithms up.'),
    mc('choose', 'A question says: "The list of 2000 product codes is sorted. State and justify the best search." A student writes "Binary search, because the list is sorted." Why does the justification fail?',
      ['It repeats a fact given in the question instead of saying why binary search is better', 'Binary search cannot be used on 2000 items', 'Linear search is always the best choice for sorted lists, so binary search should not have been named at all', 'Product codes cannot be compared with each other'], 0,
      'A sorted list is a requirement, not an advantage. The justification needs a benefit such as halving the search area so fewer comparisons are made.'),
    mc('linear-vs-binary', 'A student gives two advantages of linear search: "It is simple to code" and "It is easy to program." Why do these earn only one mark?',
      ['They are the same point said in two different ways', 'Neither of them is an advantage of linear search', 'Advantages must always mention memory use', 'Linear search is not simple to code'], 0,
      'Each mark needs a different point. A second distinct advantage would be "it works on unsorted lists".'),
    mc('describe', 'Which of these is the name of a sorting algorithm?',
      ['Merge sort', 'Binary search', 'Linear search', 'Trace table'], 0,
      'Merge sort and bubble sort put lists in order. Binary and linear search find items, and a trace table tests an algorithm.'),
    mc('linear-vs-binary', 'In which situation could a linear search find the target <b>faster</b> than a binary search?',
      ['When the target is the first item in the list', 'When the target is the middle item in the list', 'When the list is very large and the target is near the end', 'When the target is not in the list at all'], 0,
      'A linear search checks the first item first, so it finds it in one comparison, while a binary search starts in the middle.'),
    mc('choose', 'A list of 80 000 customer names is unsorted. It will be searched thousands of times a day. What is the best approach?',
      ['Sort it once, then use binary search for every search', 'Use linear search every time, because the list is unsorted', 'Use binary search on the unsorted list', 'Use bubble sort before every single search'], 0,
      'Sorting takes time, but it only happens once. Every search after that can then use the much faster binary search.'),
    mc('describe', 'Which description of merge sort is correct?',
      ['The list is split repeatedly into halves until single items remain, then the items are merged back in order', 'Neighbouring items are compared and swapped, pass after pass, until no swaps are needed', 'The middle item is checked and half of the list is discarded each time', 'Each item is checked in turn until the target is found'], 0,
      'Merge sort is split, then merge. The other descriptions are bubble sort, binary search and linear search.'),
    mc('bubble-vs-merge', 'A list is almost sorted: only two neighbouring items are out of place. Why can bubble sort be quick here?',
      ['One pass fixes the swap and the next pass has no swaps, so it stops after two passes', 'Bubble sort always finishes in one pass', 'Bubble sort skips lists that are almost sorted', 'Bubble sort splits the list in half and ignores the half that is already sorted, so it does less work'], 0,
      'Because bubble sort stops after a pass with no swaps, a nearly sorted list needs very few passes.')
  ] };

  // =====================================================================
  // CSC-T2-01 Pick the right data type for a value
  // =====================================================================
  var TYPES = ['Integer', 'Real', 'Boolean', 'Char', 'String'];
  var VALS = [
    ['42', 0, 'a whole number with no decimal part'], ['-15', 0, 'a whole number; negative whole numbers are still integers'], ['0', 0, 'a whole number'],
    ['7.25', 1, 'a number with a decimal part'], ['-0.5', 1, 'a number with a decimal part'], ['3.0', 1, 'written with a decimal point, so it is stored as a real (float)'],
    ['True', 2, 'one of the only two Boolean values'], ['False', 2, 'one of the only two Boolean values'],
    ["'Q'", 3, 'one single character'], ["'?'", 3, 'one single character (a symbol)'], ["'7'", 3, 'one single character in quotation marks, not a number'],
    ['"Hello"', 4, 'a sequence of characters in quotation marks'], ['"AB12"', 4, 'a mix of characters in quotation marks'], ['"True"', 4, 'inside quotation marks, so it is text, not a Boolean']
  ];
  var VARS = [
    ['the number of seats in a cinema screen', 0, 'a count is always a whole number'],
    ['the price of a ticket, such as 8.50', 1, 'money with cents has a decimal part'],
    ['whether a parking space is free', 2, 'there are only two possible answers: True or False'],
    ['a student\'s middle initial', 3, 'it is one single character'],
    ['a customer\'s email address', 4, 'it is a sequence of letters, digits and symbols'],
    ['a phone number such as 07700 900123', 4, 'it starts with 0 and is never used in calculations, so it is stored as text'],
    ['the height of a plant in centimetres, such as 12.6', 1, 'a measurement with a decimal part'],
    ['the number of goals scored in a match', 0, 'a count is a whole number'],
    ['whether a user has accepted the terms', 2, 'the answer is yes or no, True or False'],
    ['a grade from A to E', 3, 'a single letter is one character'],
    ['a postcode such as SW1A 1AA', 4, 'it mixes letters, digits and a space']
  ];
  B['CSC-T2-01'] = { title: 'Pick the right data type for a value', items: [
    { skill: 'classify-value', gen: function () {
      var v = pick(VALS);
      return { kind: 'mcq', q: 'Which data type best suits the value <b>' + esc(v[0]) + '</b>?', options: TYPES.slice(), answer: v[1], why: esc(v[0]) + ' is ' + v[2] + ', so it is ' + (v[1] === 0 ? 'an integer' : v[1] === 1 ? 'a real' : v[1] === 2 ? 'a Boolean' : v[1] === 3 ? 'a char' : 'a string') + '.' };
    } },
    { skill: 'type-for-variable', gen: function () {
      var v = pick(VARS);
      return { kind: 'mcq', q: 'A program stores <b>' + v[0] + '</b>. Which data type is most suitable?', options: TYPES.slice(), answer: v[1], why: 'The best type is ' + TYPES[v[1]].toLowerCase() + ', because ' + v[2] + '.' };
    } },
    mc('boolean-values', 'State the values that a Boolean data type can hold.',
      ['True and False only', 'Any whole number', 'Any single character', 'Any text up to 255 characters'], 0,
      'A Boolean can hold only two values: True or False (sometimes shown as yes/no or 1/0).'),
    mc('boolean-values', 'In Python, what is the data type of the value ' + c('"True"') + ' (with the quotation marks)?',
      ['String', 'Boolean', 'Char', 'Integer'], 0,
      'Anything inside quotation marks is text. Without the quotes, True is a Boolean value.'),
    { skill: 'type-of-result', gen: function () {
      var a = rint(5, 21), b = rint(2, 4), opts = [
        [c(a + ' / ' + b), 1, 'The / operator always gives a real (float) result in Python, even when it divides exactly.'],
        [c(a + ' // ' + b), 0, 'The // operator gives the whole-number part of a division, so the result is an integer.'],
        [c(a + ' * 2.5'), 1, 'Multiplying by a real number gives a real result.'],
        [c('"' + a + '" + "' + b + '"'), 4, 'Both values are in quotation marks, so + joins them as text: "' + a + b + '".'],
        [c(a + ' > ' + b), 2, 'A comparison is either True or False, so the result is a Boolean.'],
        [c(a + ' % ' + b), 0, 'The remainder of dividing two integers is an integer.']
      ], o = pick(opts);
      return { kind: 'mcq', q: 'What is the data type of the result of this Python expression? ' + o[0], options: ['Integer', 'Real', 'Boolean', 'String'], answer: o[1] === 4 ? 3 : o[1], why: o[2] };
    } },
    mc('example-value', 'Which of these is a valid example of a <b>char</b> value?',
      [c("'K'"), c('"OK"'), c('7.5'), c('True')], 0,
      'A char is exactly one character. "OK" has two characters, so it is a string.'),
    mc('example-value', 'Which of these is a valid example of a <b>real</b> value?',
      [c('18.75'), c('19'), c("'R'"), c('False')], 0,
      'A real number has a decimal part. 19 is a whole number, so it is an integer.'),
    mc('example-value', 'Which of these is a valid example of an <b>integer</b>?',
      [c('-7'), c('-7.0'), c('"-7"'), c("'7'")], 0,
      'An integer is a whole number, which can be negative. -7.0 is written as a real, and the quoted values are text.'),
    mc('justify', 'A variable stores the price of a meal, such as 23.40. Which justification for using the <b>real</b> data type would earn the mark?',
      ['The price can have a decimal part for the cents', 'The price is a number', 'Real is the most common data type', 'Real values cannot be changed'], 0,
      'Saying "it is a number" does not separate real from integer. The key point is the decimal part.'),
    mc('type-of-result', 'In ' + c('distance = 0.5 * time') + ', time is an integer. What is the data type of distance?',
      ['Real', 'Integer', 'Boolean', 'String'], 0,
      'Multiplying an integer by a real number (0.5) gives a real result.'),
    mu('classify-value', 'Which of these values are <b>integers</b>?',
      [c('0'), c('-12'), c('450'), c('4.0'), c('"12"')], [0, 1, 2],
      '0, -12 and 450 are whole numbers. 4.0 is written as a real, and "12" is text because of the quotation marks.'),
    mu('classify-value', 'Which of these values are <b>strings</b>?',
      [c('"AB12"'), c('"7"'), c('"False"'), c('7'), c('False')], [0, 1, 2],
      'Anything inside quotation marks is a string, even "7" and "False". Without quotes, 7 is an integer and False is a Boolean.'),
    { skill: 'type-of-result', gen: function () {
      var o = pick([[c('type(3.0)'), "<class 'float'>"], [c('type(3)'), "<class 'int'>"], [c('type("3")'), "<class 'str'>"], [c('type(3 > 2)'), "<class 'bool'>"]]);
      var all = ["<class 'float'>", "<class 'int'>", "<class 'str'>", "<class 'bool'>"];
      return { kind: 'mcq', q: 'What does Python display for ' + c('print(') + o[0] + c(')') + '?', options: all.map(esc), answer: all.indexOf(o[1]),
        why: 'Python calls integers int, reals float, strings str and Booleans bool. ' + o[0] + ' gives ' + esc(o[1]) + '.' };
    } },
    mc('char-vs-string', 'What is the difference between a char and a string?',
      ['A char holds exactly one character; a string holds a sequence of characters', 'A char holds numbers; a string holds letters only', 'A char is always a capital letter; a string is lower case', 'There is no difference in any language'], 0,
      'A char is a single character such as \'B\'. A string such as "Banana" can hold any number of characters.'),
    mc('justify', 'Why is a mobile phone number such as 07700 900123 stored as a string rather than an integer?',
      ['It starts with 0 and contains a space, and no calculations are done with it', 'Integers cannot be longer than 5 digits', 'Strings use less memory than integers', 'Phone numbers contain a decimal point'], 0,
      'As an integer the leading 0 would be lost and the space is not allowed. Phone numbers are labels, never added or multiplied.'),
    mc('type-for-variable', 'A quiz app stores whether each answer was correct. Which data type is most suitable?',
      ['Boolean', 'String', 'Real', 'Char'], 0,
      'Each answer is either correct or not, which is exactly True or False.'),
    mc('justify', 'A programmer stores a bill of 356.25 in an <b>integer</b> variable. What problem does this cause?',
      ['The decimal part is lost, so the amount stored is wrong', 'The value is stored as text and cannot be printed', 'The program will treat the value as True', 'Nothing; integers can hold decimal numbers'], 0,
      'An integer can only hold whole numbers, so the 0.25 would be lost. Money with cents needs a real.'),
    { skill: 'type-for-variable', gen: function () {
      var set = pick([
        ['gym', [['memberCount', 0], ['monthlyFee', 1], ['isPremium', 2], ['memberName', 4]]],
        ['bike hire', [['bikesAvailable', 0], ['hourlyRate', 1], ['helmetIncluded', 2], ['sizeCode', 3]]],
        ['library', [['booksOnLoan', 0], ['fineAmount', 1], ['isOverdue', 2], ['bookTitle', 4]]]
      ]), v = pick(set[1]);
      var hint = { memberCount: 'a count', monthlyFee: 'an amount of money with cents', isPremium: 'a yes/no fact', memberName: 'text', bikesAvailable: 'a count', hourlyRate: 'an amount of money with cents', helmetIncluded: 'a yes/no fact', sizeCode: 'one letter: S, M or L', booksOnLoan: 'a count', fineAmount: 'an amount of money with cents', isOverdue: 'a yes/no fact', bookTitle: 'text' }[v[0]];
      return { kind: 'mcq', q: 'A ' + set[0] + ' program uses a variable called <b>' + v[0] + '</b>, which holds ' + hint + '. Which data type should it be?', options: TYPES.slice(), answer: v[1],
        why: v[0] + ' holds ' + hint + ', so ' + TYPES[v[1]].toLowerCase() + ' is the best match.' };
    } },
    mc('type-of-result', 'In Python, ' + c('age = input("Age? ")') + ' stores what the user types. What is the data type of age?',
      ['String', 'Integer', 'Real', 'Boolean'], 0,
      'input() always returns a string. It must be converted, for example with int(), before it can be used in a calculation.'),
    mc('type-of-result', 'What is the data type of the result of the comparison ' + c('score >= 50') + '?',
      ['Boolean', 'Integer', 'Real', 'String'], 0,
      'A comparison is either true or false, so the result is a Boolean.'),
    mc('example-value', 'A table gives each data type with an example. Which row is <b>wrong</b>?',
      ['char: "Hello"', 'integer: 250', 'real: 0.75', 'Boolean: False'], 0,
      '"Hello" has five characters, so it is a string. A char example must be one character, such as \'H\'.'),
    mc('type-for-variable', 'A sports app records the number of laps a swimmer completes. Which data type is most suitable?',
      ['Integer', 'Real', 'String', 'Boolean'], 0,
      'Laps are counted in whole numbers, so an integer is the right choice.')
  ] };

  // =====================================================================
  // CSC-T2-02 Variables, constants, arrays and records
  // =====================================================================
  B['CSC-T2-02'] = { title: 'Variables, constants, arrays and records', items: [
    mc('define', 'Which statement describes a <b>variable</b>?',
      ['A named memory location whose value can change while the program runs', 'A named memory location whose value is fixed and cannot be changed while the program runs', 'A value that must always be typed in by the user', 'A value that can only be used once in a program'], 0,
      'A variable has a name and holds a value that can be changed as the program runs. A fixed value is a constant.'),
    mc('define', 'What is the purpose of a <b>constant</b>?',
      ['To store a value that will not change while the program runs', 'To store a value that the user types in when the program asks for it', 'To store many values under one name', 'To store a value that changes on every loop'], 0,
      'A constant holds a value that stays the same, such as a tax rate or the number of days in a week.'),
    mc('constant-benefit', 'Give one benefit of using a constant for a tax rate instead of typing the number wherever it is needed.',
      ['If the rate changes, the programmer only has to update one line', 'It stops the user from typing in a different tax rate when the program is running', 'It makes the program use no memory', 'It means the program can never contain errors'], 0,
      'The value is written in one place only, so maintaining the program is quicker and less error-prone.'),
    mc('constant-benefit', 'A student writes: "A constant is useful because it stops the user changing the value." Why is this not accepted?',
      ['The benefit is for the programmer, who cannot change it by accident in the code', 'Constants can be changed by the user at any time while the program runs, so they protect nothing', 'Constants are only used in loops', 'Users never see any values in a program'], 0,
      'The user cannot change values in the code anyway. Mark schemes credit benefits for the programmer, such as one place to update or no accidental changes.'),
    mc('constant-benefit', 'In Python, how do programmers usually show that a value is meant to be a constant?',
      ['By writing its name in capital letters, such as ' + c('MAX_SEATS = 120'), 'By putting the value in quotation marks', 'By adding the word const before it, which Python enforces', 'By writing the name with a number at the start'], 0,
      'Python does not enforce constants. Capital letters are a convention that tells programmers not to change the value.'),
    mc('constant-benefit', 'Why is ' + c('total = price * (1 + VAT_RATE)') + ' easier to read than ' + c('total = price * 1.2') + '?',
      ['The constant name explains what the value means', 'It runs faster because constants are stored on the processor', 'It gives a different answer', 'It stops the price from being a real number'], 0,
      'A meaningful name tells the reader what 0.2 is for. A bare number gives no clue.'),
    mc('array-vs-variable', 'Which answer describes a difference between a variable and an array?',
      ['A variable holds a single value, whereas an array holds many values under one name', 'A variable holds many values, whereas an array holds a single value', 'A variable can change while the program runs, whereas the values in an array can never be changed', 'A variable holds numbers, whereas an array holds text only'], 0,
      'A good answer covers both sides: one value in a variable, a collection of values in an array.'),
    mc('1d-vs-2d', 'Describe one difference between a one-dimensional and a two-dimensional array.',
      ['A 1D array is like a single list; a 2D array is like a table with rows and columns', 'A 1D array holds numbers; a 2D array holds text', 'A 1D array can change size as the program runs; a 2D array is fixed and cannot hold any text values', 'A 1D array holds records; a 2D array holds constants'], 0,
      'A 1D array needs one index; a 2D array needs two (row and column), like a grid.'),
    mc('record', 'A shop stores the title, year and price of one film. Why is a <b>record</b> suitable?',
      ['It groups related fields about one item, and the fields can be different data types', 'It stores many values under one name, and every one of them must be exactly the same data type', 'It holds a single value that can never change', 'It is the only structure that can store text'], 0,
      'Title is a string, year an integer and price a real. A record can group fields of different types about one item.'),
    mc('choose-structure', 'A teacher needs to store 30 test marks, all integers. Which data structure is most suitable?',
      ['A one-dimensional array', 'A two-dimensional array', 'A record', 'A single variable'], 0,
      'Many values of the same type in a single list fit a 1D array, processed with one loop.'),
    mc('choose-structure', 'A theatre stores which seats are booked in 12 rows of 20 seats. Which data structure is most suitable?',
      ['A two-dimensional array', 'A one-dimensional array', 'A record', 'A constant'], 0,
      'Rows and columns of the same kind of data match a 2D array, using [row][seat] to reach each seat.'),
    mc('choose-structure', 'A student says a 2D array is the best way to store a person\'s name, age and height together. Why is this wrong?',
      ['An array holds one data type, but the name, age and height are different types, so a record is needed', 'A 2D array can only store two values', 'A 2D array cannot store text', 'Arrays can only be used for constants'], 0,
      'A 2D array is still one data type laid out in rows and columns. Mixed data about one item belongs in a record.'),
    { skill: 'array-index', gen: function () {
      var a = distinctNums(rint(5, 7), 10, 99), k = rint(1, a.length - 1);
      return { kind: 'num', q: 'What does this Python code print?' + pc(['temps = [' + a.join(', ') + ']', 'print(temps[' + k + '])']), answer: a[k], unit: '',
        why: 'Indexes start at 0, so temps[' + k + '] is the ' + ordinal(k + 1) + ' item: ' + a[k] + '.' };
    } },
    { skill: 'array-index', gen: function () {
      var g = [], r = rint(0, 2), cc = rint(0, 3);
      for (var i = 0; i < 3; i++) g.push(distinctNums(4, 1, 50));
      return { kind: 'num', q: 'What does this Python code print?' + pc(['grid = [' + g.map(function (x) { return '[' + x.join(', ') + ']'; }).join(',\n        ') + ']', 'print(grid[' + r + '][' + cc + '])']), answer: g[r][cc], unit: '',
        why: 'grid[' + r + '] is row ' + r + ' (the ' + ordinal(r + 1) + ' row), [' + L(g[r]) + ']. Then [' + cc + '] picks the ' + ordinal(cc + 1) + ' value in that row: ' + g[r][cc] + '.' };
    } },
    { skill: 'array-index', gen: function () {
      var n = rint(6, 40);
      return { kind: 'num', q: 'An array called <b>names</b> holds ' + n + ' items. What is the index of the last item?', answer: n - 1, unit: '',
        why: 'Indexes start at 0, so ' + n + ' items have indexes 0 to ' + (n - 1) + '. The last index is always LENGTH − 1.' };
    } },
    { skill: 'array-index', gen: function () {
      var r = rint(3, 9), cl = rint(4, 12);
      return { kind: 'num', q: 'A two-dimensional array stores a car park map with ' + r + ' rows and ' + cl + ' columns. How many values can it hold?', answer: r * cl, unit: 'values',
        why: 'Each of the ' + r + ' rows has ' + cl + ' columns: ' + r + ' × ' + cl + ' = ' + (r * cl) + ' values.' };
    } },
    mu('define', 'Which of these values should be stored as <b>constants</b> in a game?',
      ['The number of lives a player starts with', 'The width of the game screen in pixels', 'The player\'s current score', 'The time left on the clock', 'The player\'s current position'], [0, 1],
      'Starting lives and screen width stay the same while the game runs. Score, time left and position change, so they are variables.'),
    { skill: 'define', gen: function () {
      var a = rint(2, 20), b = rint(2, 9), d = rint(1, 9);
      return { kind: 'num', q: 'What is the value of points when this Python code has run?' + pc(['points = ' + a, 'points = points + ' + b, 'points = points * 2', 'points = points - ' + d]), answer: (a + b) * 2 - d, unit: '',
        why: 'A variable\'s value can change as the program runs: ' + a + ' → ' + (a + b) + ' → ' + ((a + b) * 2) + ' → ' + ((a + b) * 2 - d) + '. Each new value replaces the old one.' };
    } },
    mc('array-vs-variable', 'Which statement about the items in an array is true?',
      ['They all share one name and one data type, and each is reached by its index', 'Each item has its own different name', 'Each item can be a different data type, just like the fields of a record can be', 'Only the first item can be changed'], 0,
      'An array is a collection of values of the same type, stored under one name and reached by index.'),
    mc('record', 'Which of these is the clearest example of data suited to a record?',
      ['One pupil\'s name, form group, date of birth and whether they have a locker', 'The ages of every pupil in a class', 'The marks for each pupil in each of 5 tests', 'The number of days in a school year'], 0,
      'A record groups different fields, of different types, about one item. Lists of same-type values suit arrays.'),
    mc('constant-benefit', 'In Pearson pseudocode a program declares ' + c('CONST INTEGER MAX') + ', sets it with ' + c('SET MAX TO 50') + ', and later has the line ' + c('SET MAX TO 60') + '. What happens?',
      ['It is an error, because a constant can only be set once', 'MAX changes to 60 without any problem', 'MAX becomes 110', 'The program ignores the CONST line'], 0,
      'A constant\'s value is fixed. Trying to give it a new value is not allowed, which protects it from accidental changes.'),
    mc('array-vs-variable', 'Why would a programmer use an array rather than 50 separate variables for 50 sensor readings?',
      ['One loop can process every reading by changing the index', 'Arrays automatically sort the readings into order as soon as they are stored', 'Separate variables cannot hold numbers', 'Arrays use no memory at all'], 0,
      'With an array, a single loop can reach every reading using its index; 50 separate variables would need 50 separate lines.')
  ] };

  // =====================================================================
  // CSC-T2-04 Functions, procedures, parameters and libraries
  // =====================================================================
  B['CSC-T2-04'] = { title: 'Functions, procedures, parameters and libraries', items: [
    mc('subprograms', 'What is a <b>subprogram</b>?',
      ['A named block of code that does one job and can be called from other parts of the program', 'A separate program that runs only when the computer starts up, before the main program is loaded', 'A line of code that is never executed', 'A data structure that holds many values under one name'], 0,
      'Subprograms (functions and procedures) are named, reusable blocks of code that are run by calling their name.'),
    mc('function-vs-procedure', 'Which answer explains a difference between a function and a procedure?',
      ['A function always returns a value to the code that called it, whereas a procedure does not have to', 'A function can take parameters, whereas a procedure never can', 'A function can only be called once, whereas a procedure can be called many times', 'A function is built in, whereas a procedure is always written by the programmer'], 0,
      'Returning a value is the key difference. Both can take parameters and both can be called many times.'),
    mu('function-vs-procedure', 'Apart from both being subprograms, which of these are similarities between functions and procedures?',
      ['Both can take parameters', 'Both can use local variables', 'Both can be called many times from different places', 'Both must always return a value', 'Both can only be used once'], [0, 1, 2],
      'Only functions must return a value, and both kinds of subprogram can be reused as often as needed.'),
    mc('function-vs-procedure', 'A student says: "A procedure cannot have parameters." Is this correct?',
      ['No; procedures can take parameters just like functions', 'Yes; only functions can take parameters, while procedures must use global variables', 'Yes; procedures can only use global variables', 'No; but procedures must have exactly one parameter'], 0,
      'Both functions and procedures can take parameters. The difference is whether a value is returned.'),
    mc('parameters', 'In ' + c('def area(pLength, pWidth):') + ', what are pLength and pWidth?',
      ['Parameters: named inputs the subprogram receives when it is called', 'Constants that can never change', 'Global variables that are used throughout the whole program', 'Return values sent back to the caller'], 0,
      'Parameters are listed in the subprogram\'s header. The values passed in each time it is called fill them.'),
    mc('parameters', 'Why do programmers pass data into subprograms through parameters?',
      ['The same subprogram can work with different data each time it is called, so it can be reused', 'Parameters make the subprogram run without using any memory, so the program is much faster overall', 'Parameters stop the subprogram from returning a value', 'Parameters mean the subprogram can only be called once'], 0,
      'Because the data is passed in rather than fixed inside, one subprogram can be reused with any suitable values.'),
    mc('built-in', 'What is meant by a <b>built-in</b> subprogram?',
      ['One that is already provided by the programming language, so it can be called without writing it', 'One that the programmer writes at the start of every program', 'One that is stored on a hard disk separately from the language and must be downloaded before every use', 'One that can only be used inside a loop'], 0,
      'Built-in subprograms such as print(), len() and int() come ready-made with Python.'),
    mu('built-in', 'Which of these are built-in Python subprograms?',
      [c('len()'), c('int()'), c('print()'), c('calculate_bonus()'), c('show_menu()')], [0, 1, 2],
      'len(), int() and print() come with Python. calculate_bonus() and show_menu() would have to be written by the programmer.'),
    mc('library', 'What is a subprogram <b>library</b>?',
      ['A collection of pre-written subprograms that can be imported into a program', 'A list of every variable used in a program, with its data type and starting value', 'A folder where finished programs are stored', 'A table showing which data type each variable uses'], 0,
      'A library such as random or math is imported (for example ' + c('import random') + ') so its subprograms can be used.'),
    mu('library', 'Which of these are reasons for using subprogram libraries when developing code?',
      ['The library code has already been tested, so it is less likely to contain errors', 'It saves time because the code does not have to be written from scratch', 'It guarantees the whole program will have no errors', 'It means the program needs no variables', 'It stops the program from ever needing to be updated'], [0, 1],
      'Library code is pre-written and tested, which saves development time and reduces errors in that part. It cannot guarantee the rest of the program is correct.'),
    mc('function-vs-procedure', 'Which of these <b>must</b> return a result?',
      ['A function', 'A procedure', 'A loop', 'An IF statement'], 0,
      'A function always sends a value back to the code that called it. A procedure does not have to.'),
    { skill: 'return-value', gen: function () {
      var a = rint(3, 15), b = rint(2, 12);
      return { kind: 'num', q: 'What does this Python program print?' + pc(['def area(pLength, pWidth):', '    return pLength * pWidth', '', 'result = area(' + a + ', ' + b + ') + area(2, 3)', 'print(result)']), answer: a * b + 6, unit: '',
        why: 'Each call returns its own value: area(' + a + ', ' + b + ') returns ' + (a * b) + ' and area(2, 3) returns 6. ' + (a * b) + ' + 6 = ' + (a * b + 6) + '. The same function is reused with different arguments.' };
    } },
    { skill: 'return-value', gen: function () {
      var lim = rint(50, 100), x = pick([lim - rint(1, 20), lim, lim + rint(1, 30)]), r = x > lim ? (x - lim) * 2 : 0;
      return { kind: 'num', q: 'What does this Python program print?' + pc(['def penalty(speed, limit):', '    if speed > limit:', '        return (speed - limit) * 2', '    return 0', '', 'print(penalty(' + x + ', ' + lim + '))']), answer: r, unit: '',
        why: x > lim ? x + ' &gt; ' + lim + ', so the function returns (' + x + ' − ' + lim + ') × 2 = ' + r + '.' : x + ' is not greater than ' + lim + ', so the first return is skipped and the function returns 0.' };
    } },
    mc('function-vs-procedure', 'Which of these Python subprograms is a <b>procedure</b>?',
      [c('def banner(text): print("***", text, "***")'), c('def double(n): return n * 2'), c('def is_even(n): return n % 2 == 0'), c('def first(word): return word[0]')], 0,
      'banner() carries out a task (printing) and returns no value. The other three send a value back with return, so they are functions.'),
    { skill: 'return-value', gen: function () {
      var w = pick(['Rohan', 'Isabel', 'Kwame', 'Gideon', 'Lucas', 'Noor']);
      return { kind: 'mcq', q: 'What value does this function return when it is called with ' + c('initial("' + w + '")') + '?' + pc(['def initial(name):', '    return name[0]']),
        options: [w[0], w, w[w.length - 1], w[1]], answer: 0,
        why: 'name[0] is the first character of the string, so the function returns just "' + w[0] + '", not the whole name.' };
    } },
    mu('subprograms', 'Which of these are benefits of using subprograms?',
      ['Code can be reused without being written out again', 'Each subprogram can be tested on its own', 'A change only has to be made in one place', 'The program will always run faster', 'Variables are no longer needed'], [0, 1, 2],
      'Subprograms reduce repetition, make testing easier and simplify maintenance. They do not guarantee faster programs.'),
    mc('library', 'A student writes: "Libraries are useful because they are quicker." Why would this not earn the mark?',
      ['It gives no reason; it should say the code is already written and tested, so development time is saved', 'Libraries are never quicker to use', 'Libraries can only be used by experts', 'The student should have said libraries use less memory'], 0,
      'Vague words such as "quicker" need a reason. The creditable point is that the code is pre-written and tested.'),
    { skill: 'return-value', gen: function () {
      var x = rint(2, 12), k = rint(1, 9);
      return { kind: 'num', q: 'What does this Python program print?' + pc(['def triple(n):', '    return n * 3', '', 'total = triple(' + x + ') + ' + k, 'print(total)']), answer: 3 * x + k, unit: '',
        why: 'triple(' + x + ') returns ' + (3 * x) + ', and the returned value takes the place of the call: ' + (3 * x) + ' + ' + k + ' = ' + (3 * x + k) + '.' };
    } },
    mc('subprograms', 'The same 6 lines that calculate a delivery charge are copied into 4 places in a program. Why is a subprogram better?',
      ['It is written once and called 4 times, so any change is made in one place', 'Copied code always runs faster than a subprogram, because no call has to be made each time', 'A subprogram can only be called once', 'Subprograms cannot calculate charges'], 0,
      'Repeated code is hard to maintain: a change must be made 4 times. A subprogram removes the repetition.'),
    mc('library', 'A program uses ' + c('import random') + ' and then ' + c('random.randint(1, 6)') + '. What does randint(1, 6) return?',
      ['A random whole number from 1 to 6 inclusive', 'Always the number 1', 'A random real number between 1 and 6, such as 3.72', 'A list of six random numbers'], 0,
      'randint returns one random integer between its two arguments, including both ends. The programmer uses it without knowing how it works inside.'),
    mc('parameters', 'In ' + c('area(4, 7)') + ', what are 4 and 7?',
      ['Arguments: the values passed in to the parameters', 'The names of the parameters', 'The values the function returns', 'Global constants'], 0,
      'Arguments are the actual values given in the call. They are copied into the parameters listed in the function header.'),
    mc('function-vs-procedure', 'A subprogram works out the VAT on a price so the main program can use it in another calculation. Should it be a function or a procedure?',
      ['A function, because it needs to return the value to the main program', 'A procedure, because it carries out a calculation and then displays the result on the screen', 'A procedure, because it takes a parameter', 'Either; neither can send a value back'], 0,
      'The calling code needs the result, so the subprogram must return it. That makes it a function.')
  ] };

  // =====================================================================
  // CSC-T2-03 Local and global variables
  // =====================================================================
  B['CSC-T2-03'] = { title: 'Local and global variables', items: [
    mc('define', 'What is a <b>global</b> variable?',
      ['A variable created in the main program that can be used anywhere in the program', 'A variable created inside a subprogram that can only ever be used within that subprogram', 'A variable whose value can never change', 'A variable that is shared between different computers'], 0,
      'A global variable is created at the top level, outside any subprogram, so every part of the program can read it.'),
    mc('define', 'What is meant by the term <b>local variable</b>?',
      ['A variable that exists, and can be used, only inside the subprogram where it is created', 'A variable that can be used anywhere in the program', 'A variable stored on the local hard disk', 'A variable that can only be used in one line of code'], 0,
      'A local variable belongs to one subprogram. It is not "one line": it can be used throughout that subprogram.'),
    mc('where', 'State where a global variable is created.',
      ['In the main program, at the top level, outside any subprogram', 'Inside a function, on the line just before its return statement', 'Inside the header of a procedure', 'Inside a FOR loop in a subprogram'], 0,
      'Global variables are declared in the main scope, so they are in scope throughout the program.'),
    mc('where', 'State where a local variable can be accessed.',
      ['Only from within the subprogram in which it is created', 'From anywhere in the program', 'Only from the main program', 'From any subprogram that has the same parameters as the one where it was created'], 0,
      'Its scope is the subprogram that created it. Code outside that subprogram cannot use it.'),
    mc('define', 'What is meant by the <b>scope</b> of a variable?',
      ['The part of the program in which the variable can be used', 'The largest value the variable can hold', 'The data type of the variable', 'The number of times the variable changes while the program runs'], 0,
      'Scope describes where a variable is visible: everywhere for a global, one subprogram for a local.'),
    mc('lifetime', 'What happens to a local variable when its subprogram finishes running?',
      ['It is removed, and the memory it used is freed', 'It becomes a global variable', 'It keeps its value for the next program that runs', 'It is copied to every other subprogram'], 0,
      'Local variables only exist while their subprogram runs, which saves memory.'),
    mc('benefit', 'Two subprograms each have a local variable called <b>count</b>. What happens?',
      ['Nothing goes wrong; each count only exists inside its own subprogram, so they do not clash', 'The program crashes because two variables share a name', 'The second count overwrites the first', 'Both subprograms share one count'], 0,
      'Because local variables are only in scope inside their own subprogram, the same name can be reused safely.'),
    mc('lifetime', 'How do the parameters of a subprogram behave?',
      ['Like local variables: they only exist inside that subprogram', 'Like global variables: they can be used anywhere', 'Like constants: their values are fixed when the program starts and can never change', 'Like arrays: each holds many values'], 0,
      'Parameters are created when the subprogram is called and disappear when it ends, just like local variables.'),
    mu('difference', 'Which <b>two</b> statements together give a full description of the difference between local and global variables?',
      ['Global variables are created in the main program and can be accessed from any part of it', 'Local variables are created inside a subprogram and can only be accessed there', 'Local variables always hold numbers', 'Global variables are faster than local variables', 'Both types can only be used once'], [0, 1],
      'A difference question needs both sides: where each is created and where each can be used.'),
    mu('classify-in-code', 'Which variables in this Python program are <b>local</b>?' + pc(['RATE = 0.15', 'orders = 0', '', 'def add_tip(bill):', '    tip = bill * RATE', '    total = bill + tip', '    return total', '', 'print(add_tip(40))']),
      ['bill', 'tip', 'total', 'RATE', 'orders'], [0, 1, 2],
      'bill is a parameter and tip and total are created inside add_tip, so all three are local. RATE and orders are created in the main program, so they are global.'),
    { skill: 'predict', gen: function () {
      var g = rint(10, 40), b = rint(2, 9);
      return { kind: 'num', q: 'What does this Python program print?' + pc(['bonus = ' + g, '', 'def score(points):', '    return points + bonus', '', 'print(score(' + b + '))']), answer: g + b, unit: '',
        why: 'bonus is a global variable, so the function can read it. score(' + b + ') returns ' + b + ' + ' + g + ' = ' + (g + b) + '.' };
    } },
    { skill: 'predict', gen: function () {
      var g = rint(10, 40), l = rint(1, 9);
      var f = function (a, b) { return a + ' then ' + b; };
      return { kind: 'mcq', q: 'What does this Python program print?' + pc(['level = ' + g, '', 'def reset():', '    level = ' + l, '    print(level)', '', 'reset()', 'print(level)']),
        options: [f(l, g), f(l, l), f(g, g), f(g, l)], answer: 0,
        why: 'Inside reset(), level = ' + l + ' creates a new <i>local</i> variable, so ' + l + ' is printed first. The global level is untouched, so ' + g + ' is printed second.' };
    } },
    mc('predict', 'What happens when this Python program runs?' + pc(['def make_code():', '    code = 4821', '', 'make_code()', 'print(code)']),
      ['An error, because code is local to make_code and does not exist in the main program', 'It prints 4821', 'It prints 0', 'It prints nothing and ends normally'], 0,
      'code only exists inside make_code(), and it is removed when the function ends, so the main program cannot find it (a NameError).'),
    mc('define', 'A student writes: "A local variable is a variable that is used in one line." What is wrong?',
      ['A local variable can be used anywhere inside the subprogram where it is created, not just one line', 'Local variables cannot be used in any lines', 'Local variables can be used in the whole program', 'Nothing; this is the correct definition'], 0,
      'The scope of a local variable is a whole subprogram. The answer must refer to the subprogram.'),
    mc('benefit', 'Why do programmers usually prefer local variables to global variables?',
      ['Other parts of the program cannot change them by accident, so errors are easier to find', 'Local variables can store more data', 'Local variables never need to be given a value', 'Global variables cannot be read inside subprograms'], 0,
      'A local variable can only be changed inside its own subprogram, so a bug involving it must be in that subprogram.'),
    mc('benefit', 'What is one drawback of using many global variables?',
      ['Any part of the program can change them, which makes errors hard to trace', 'They disappear as soon as any subprogram ends, so their values are always lost', 'They can only hold whole numbers', 'They cannot be used in the main program'], 0,
      'Because globals are in scope everywhere, a wrong value could have been set by any line, which makes debugging harder.'),
    { skill: 'classify-in-code', gen: function () {
      var nl = rint(1, 3), names = ['subtotal', 'discount', 'shipping'].slice(0, nl), lines = ['VAT = 0.2', 'customers = 0', '', 'def invoice(price):'];
      names.forEach(function (n, i) { lines.push('    ' + n + ' = price * ' + (i + 2)); });
      lines.push('    return price * (1 + VAT)');
      return { kind: 'num', q: 'How many <b>local</b> variables does the function invoice use, including its parameter?' + pc(lines), answer: nl + 1, unit: '',
        why: 'price is a parameter, which behaves like a local variable, and ' + (nl === 1 ? names[0] + ' is' : names.slice(0, -1).join(', ') + ' and ' + names[nl - 1] + ' are') + ' created inside the function: ' + (nl + 1) + ' in total. VAT and customers are global.' };
    } },
    mc('where', 'In this pseudocode, where can the variable <b>half</b> be used?' + pc(['PROCEDURE split(amount)', 'BEGIN PROCEDURE', '   SET half TO amount / 2', '   SEND half TO DISPLAY', 'END PROCEDURE', '', 'split(90)']),
      ['Only inside the procedure split', 'Anywhere in the program', 'Only in the main program after split(90)', 'In every procedure that has a parameter'], 0,
      'half is created inside split, so it is local to that procedure and disappears when the procedure ends.'),
    mc('lifetime', 'How do local variables help a program use memory efficiently?',
      ['They only take up memory while their subprogram is running', 'They are stored in the processor instead of in memory, so they need no space', 'They can never hold more than one character', 'They are shared by every program on the computer'], 0,
      'Memory for a local variable is freed as soon as its subprogram finishes, so it is not held for the whole run.'),
    mc('difference', 'Which statement about global and local variables is true?',
      ['A global variable can be read inside a subprogram, but a local variable cannot be read in the main program', 'A local variable can be read in the main program, but a global variable cannot be read inside a subprogram', 'Neither can be read inside a subprogram', 'Both can only be used in the line where they are created'], 0,
      'Globals are in scope everywhere; locals are only in scope inside their own subprogram.'),
    { skill: 'predict', gen: function () {
      var a = rint(2, 9), b = rint(10, 30); if (b === a * a) b++;
      return { kind: 'mcq', q: 'What does this Python program print?' + pc(['def area(side):', '    result = side * side', '    return result', '', 'result = ' + b, 'print(area(' + a + '), result)']),
        options: [(a * a) + ' ' + b, (a * a) + ' ' + (a * a), b + ' ' + b, b + ' ' + (a * a)], answer: 0,
        why: 'The result inside area is local, so it does not affect the global result. area(' + a + ') returns ' + (a * a) + ' and the global result is still ' + b + '.' };
    } },
    mc('define', 'In Python, a variable is first given a value inside a ' + c('def') + ' block. What kind of variable is it?',
      ['Local to that function', 'Global to the whole program', 'A constant', 'A parameter of the main program'], 0,
      'Assigning a variable inside a function creates a local variable, unless the programmer deliberately declares it global.')
  ] };
})();
