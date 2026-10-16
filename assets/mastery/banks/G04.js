/* Group G04 mastery bank: Python: selection, fixing errors and short programs; Python: subprograms, files and the 20-mark program. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function C(s) { return '<code>' + esc(s) + '</code>'; }
  function P(lines) { return '<pre>' + lines.map(esc).join('\n') + '</pre>'; }
  function L(lines) { return '<pre>' + lines.map(function (l, i) { return (i + 1 < 10 ? ' ' : '') + (i + 1) + '  ' + esc(l); }).join('\n') + '</pre>'; }
  function uniq(list) { var s = {}; return list.filter(function (x) { var k = String(x); if (s[k]) return false; s[k] = 1; return true; }); }
  function money(x) { return '$' + R.roundDp(x, 2).toFixed(2); }
  function sum(a) { return a.reduce(function (t, x) { return t + x; }, 0); }
  function distinctInts(n, lo, hi) { var out = []; while (out.length < n) { var v = rint(lo, hi); if (out.indexOf(v) < 0) out.push(v); } return out; }
  function pyList(a) { return '[' + a.map(function (x) { return typeof x === 'string' ? '"' + x + '"' : String(x); }).join(', ') + ']'; }

  /* ======================================================================
     CSC-CODE-02 Finish an if/elif/else so each input gives the right message
     ====================================================================== */
  var PHRASES = [
    { t: 'at least N', op: '>=' }, { t: 'N or more', op: '>=' }, { t: 'more than N', op: '>' }, { t: 'over N', op: '>' },
    { t: 'at most N', op: '<=' }, { t: 'no more than N', op: '<=' }, { t: 'N or fewer', op: '<=' }, { t: 'under N', op: '<' }, { t: 'less than N', op: '<' }];
  var OPWORD = { '>=': 'includes N itself and everything above it', '>': 'means above N; N itself is not included', '<=': 'includes N itself and everything below it', '<': 'means below N; N itself is not included' };
  function band3(v, hi, lo) { return v >= hi ? 0 : v >= lo ? 1 : 2; }
  B['CSC-CODE-02'] = { title: 'Finish an if/elif/else so each input gives the right message', items: [
    { skill: 'boundary-op', gen: function () {
      var ph = pick(PHRASES), n = rint(5, 90), v = pick(['points', 'age', 'speed', 'score', 'weight', 'laps']);
      var ops = ['>=', '>', '<=', '<'];
      return { kind: 'mcq', q: 'A table says a message is shown when <code>' + v + '</code> is <b>' + ph.t.replace('N', n) + '</b>. ' + v + ' is a whole number. Which condition completes the <code>if</code> statement?',
        options: ops.map(function (o) { return C(v + ' ' + o + ' ' + n); }), answer: ops.indexOf(ph.op),
        why: '"' + ph.t.replace('N', n) + '" ' + OPWORD[ph.op].replace(/N/g, n) + ', so the condition is <code>' + esc(v + ' ' + ph.op + ' ' + n) + '</code>.' };
    } },
    { skill: 'range-cond', gen: function () {
      var lo = rint(10, 40), hi = lo + rint(5, 20), v = pick(['total', 'mark', 'level', 'height']);
      return { kind: 'mcq', q: 'A message must be shown when <code>' + v + '</code> is from ' + lo + ' to ' + hi + ' inclusive. Which condition is correct Python?',
        options: [C(v + ' >= ' + lo + ' and ' + v + ' <= ' + hi), C(v + ' >= ' + lo + ' or ' + v + ' <= ' + hi), C(v + ' > ' + lo + ' and ' + v + ' < ' + hi), C(v + ' >= ' + lo + ' and <= ' + hi)], answer: 0,
        why: 'Both tests must be True, so join them with <code>and</code>, and use &gt;= and &lt;= so ' + lo + ' and ' + hi + ' are included. With <code>or</code> every number passes, and <code>and &lt;= ' + hi + '</code> is not valid Python because each side needs its own comparison.' };
    } },
    { skill: 'predict-output', gen: function () {
      var lo = rint(15, 30), hi = lo + rint(15, 30), v = pick([lo - 1, lo, lo + 1, hi - 1, hi, hi + 1, rint(0, lo - 2)]), msgs = ['Storm warning', 'Breezy', 'Calm'];
      var k = band3(v, hi, lo);
      return { kind: 'mcq', q: 'The user enters <b>' + v + '</b>. What is displayed?' + P(['wind = int(input("Wind speed: "))', 'if wind >= ' + hi + ':', '    print("Storm warning")', 'elif wind >= ' + lo + ':', '    print("Breezy")', 'else:', '    print("Calm")']),
        options: msgs.slice(), answer: k,
        why: 'Python checks each condition from the top and runs only the first branch that is True. ' + v + ' &gt;= ' + hi + ' is ' + (v >= hi ? 'True' : 'False') + (v >= hi ? '' : '; ' + v + ' &gt;= ' + lo + ' is ' + (v >= lo ? 'True' : 'False')) + ', so the output is <b>' + msgs[k] + '</b>.' };
    } },
    { skill: 'and-or', gen: function () {
      var A = rint(8, 14), H = pick([110, 120, 130, 140]), age = pick([A - 1, A, A + 2]), h = pick([H - 5, H, H + 10]);
      var both = age >= A && h >= H, either = age >= A || h >= H, msgs = ['Ride alone', 'Ride with an adult', 'Not allowed'];
      var k = both ? 0 : either ? 1 : 2;
      return { kind: 'mcq', q: 'A rider is <b>' + age + '</b> years old and <b>' + h + '</b> cm tall. What is displayed?' + P(['if age >= ' + A + ' and height >= ' + H + ':', '    print("Ride alone")', 'elif age >= ' + A + ' or height >= ' + H + ':', '    print("Ride with an adult")', 'else:', '    print("Not allowed")']),
        options: msgs.slice(), answer: k,
        why: 'age &gt;= ' + A + ' is ' + (age >= A ? 'True' : 'False') + ' and height &gt;= ' + H + ' is ' + (h >= H ? 'True' : 'False') + '. <code>and</code> needs both to be True; <code>or</code> needs at least one. So the output is <b>' + msgs[k] + '</b>.' };
    } },
    { skill: 'and-or', gen: function () {
      var S = pick([50, 80, 100, 150]), V = rint(4, 12), both = Math.random() < 0.5;
      var row = 'has spent at least $' + S + (both ? ' and' : ' or') + ' has visited more than ' + V + ' times';
      var right = 'spent >= ' + S + (both ? ' and ' : ' or ') + 'visits > ' + V, swap = 'spent >= ' + S + (both ? ' or ' : ' and ') + 'visits > ' + V;
      return { kind: 'mcq', q: 'A shop gives a reward when a customer <b>' + row + '</b>. Which condition matches this row of the table?',
        options: [C(right), C(swap), C('spent > ' + S + (both ? ' and ' : ' or ') + 'visits > ' + V), C('spent >= ' + S + (both ? ' and ' : ' or ') + 'visits >= ' + V)], answer: 0,
        why: (both ? 'Both parts must be true, so use <code>and</code>.' : 'Either part is enough, so use <code>or</code>.') + ' "At least $' + S + '" is &gt;= ' + S + ' and "more than ' + V + '" is &gt; ' + V + '.' };
    } },
    { skill: 'predict-output', gen: function () {
      var lo = rint(20, 35), hi = lo + rint(10, 25);
      var vals = uniq(shuffle([lo - 1, lo, lo + 1, hi - 1, hi, hi + 2, rint(lo + 2, hi - 2)])).slice(0, 5);
      if (!vals.some(function (v) { return band3(v, hi, lo) === 1; })) vals[0] = lo;
      if (vals.every(function (v) { return band3(v, hi, lo) === 1; })) vals[1] = hi;
      vals = uniq(vals);
      return { kind: 'multi', q: 'Which inputs make this code display <b>Medium</b>?' + P(['size = int(input("Size: "))', 'if size >= ' + hi + ':', '    print("Large")', 'elif size >= ' + lo + ':', '    print("Medium")', 'else:', '    print("Small")']),
        options: vals.map(String), answers: vals.map(function (v, i) { return band3(v, hi, lo) === 1 ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: '"Medium" is shown only when the first test fails and the second passes: size is at least ' + lo + ' but less than ' + hi + ', so ' + lo + ' to ' + (hi - 1) + '.' };
    } },
    { skill: 'branch-order', kind: 'mcq', q: 'A student who scores 92 sees <b>Pass</b>, but should see <b>Distinction</b>. What is wrong?' + P(['if mark >= 50:', '    print("Pass")', 'elif mark >= 80:', '    print("Distinction")', 'else:', '    print("Fail")']),
      options: ['The broader test comes first, so any mark of 80 or more is caught by it; test <code>mark &gt;= 80</code> first', 'The <code>elif</code> should be a separate <code>if</code> statement so that both of the messages are displayed', 'The operator <code>&gt;=</code> should be <code>&gt;</code> in both conditions', 'The <code>else</code> branch is missing a condition such as <code>mark &lt; 50</code>'], answer: 0,
      why: 'Python runs only the first True branch. 92 &gt;= 50 is True, so "Pass" is shown and the Distinction test is never reached. The most specific test must come first.' },
    { skill: 'structure-gaps', kind: 'mcq', q: 'What happens when this code runs and the user types 20?' + P(['age = input("Age: ")', 'if age >= 18:', '    print("Adult ticket")']),
      options: ['Python stops with an error: the text "20" cannot be compared with 18', 'It displays "Adult ticket", because 20 is at least 18', 'It displays nothing, because "20" is less than 18', 'It refuses to start, because input() needs a number inside its brackets'], answer: 0,
      why: '<code>input()</code> always returns a string. Comparing a string with an integer using &gt;= causes a TypeError. Use <code>age = int(input("Age: "))</code>.' },
    { skill: 'structure-gaps', kind: 'mcq', q: 'A student writes this line to test for 31 to 39 inclusive. What is wrong with it?' + P(['if total >= 31 and <= 39:']),
      options: ['Each side of <code>and</code> needs its own comparison: <code>total &gt;= 31 and total &lt;= 39</code>', 'It should use <code>or</code> because there are two numbers', 'The numbers should be in quotation marks', 'Nothing is wrong, because Python fills in the missing variable for you automatically'], answer: 0,
      why: '<code>&lt;= 39</code> on its own has nothing to compare, so Python reports a syntax error. Write the variable in both tests.' },
    { skill: 'and-or', kind: 'mcq', q: 'A student writes <code>if raining == "yes" &amp; wind &gt; 30:</code> to test that both are true. What should replace <code>&amp;</code>?',
      options: ['<code>and</code>', '<code>or</code>', '<code>&amp;&amp;</code>', '<code>+</code>'], answer: 0,
      why: 'In Python the logical operator for "both must be true" is the word <code>and</code>. Symbols such as &amp; and &amp;&amp; do not work as logical operators here.' },
    { skill: 'structure-gaps', kind: 'mcq', q: 'The last row of an output table says "Any other value: show <i>Not recognised</i>". Which line should start that branch?',
      options: ['<code>else:</code>', '<code>elif:</code>', '<code>else if:</code>', '<code>if other:</code>'], answer: 0,
      why: '<code>else:</code> needs no condition and catches every case that the earlier conditions did not. <code>elif</code> must have a condition, and <code>else if</code> is not Python.' },
    { skill: 'structure-gaps', kind: 'mcq', q: 'A message must appear when the user presses Enter without typing anything. <code>name</code> holds the result of <code>input()</code>. Which condition is correct?',
      options: ['<code>name == ""</code>', '<code>name == 0</code>', '<code>name = ""</code>', '<code>len(name) &gt; 0</code>'], answer: 0,
      why: 'Pressing Enter gives an empty string, written <code>""</code>. A single = is assignment, not a test, and <code>len(name) &gt; 0</code> is True when something <i>was</i> typed.' },
    { skill: 'boundary-op', kind: 'mcq', q: 'Which condition means exactly the same as <code>not (level == 3)</code>?',
      options: ['<code>level != 3</code>', '<code>level == 3</code>', '<code>level &lt; 3</code>', '<code>level &gt; 3</code>'], answer: 0,
      why: '<code>not</code> reverses a condition. "Not equal to 3" is <code>level != 3</code>, which is True for every value except 3, both above and below it.' },
    { skill: 'predict-output', kind: 'mcq', q: 'What is displayed when this code runs?' + P(['n = 15', 'if n > 10:', '    print("A")', 'if n > 5:', '    print("B")', 'else:', '    print("C")']),
      options: ['A, then B', 'A only', 'B only', 'A, then C'], answer: 0,
      why: 'These are two separate <code>if</code> statements, so both are checked. 15 &gt; 10 prints A; 15 &gt; 5 prints B, so the <code>else</code> is skipped. With <code>elif</code>, only A would print.' },
    { skill: 'range-cond', kind: 'mcq', q: 'A reading must be rejected when it is <b>not</b> between 1 and 10 inclusive. Which condition is True for the readings to reject?',
      options: ['<code>reading &lt; 1 or reading &gt; 10</code>', '<code>reading &lt; 1 and reading &gt; 10</code>', '<code>reading &gt;= 1 and reading &lt;= 10</code>', '<code>reading &lt;= 1 or reading &gt;= 10</code>'], answer: 0,
      why: 'A reading outside the range is either below 1 or above 10, so join the tests with <code>or</code>. With <code>and</code> no number could pass both tests, and &lt;= 1 or &gt;= 10 would wrongly reject 1 and 10.' },
    { skill: 'predict-output', gen: function () {
      var T = pick([40, 50, 60, 75]), D = pick([5, 8, 10]), total = pick([T - 4, T, T + 6, T + 15]), member = Math.random() < 0.6;
      var final = member && total > T ? total - D : total;
      return { kind: 'num', q: 'What number is displayed?' + P(['total = ' + total, 'isMember = ' + (member ? 'True' : 'False'), 'if isMember and total > ' + T + ':', '    total = total - ' + D, 'print(total)']), answer: final, unit: '',
        why: 'isMember is ' + (member ? 'True' : 'False') + ' and ' + total + ' &gt; ' + T + ' is ' + (total > T ? 'True' : 'False') + '. ' + (final !== total ? 'Both are True, so ' + D + ' is taken off: ' + total + ' - ' + D + ' = ' + final + '.' : 'They are not both True, so the total stays at ' + total + '.') };
    } },
    { skill: 'structure-gaps', kind: 'mcq', q: 'Python reports a syntax error on this line. Which corrected line is right?' + P(['if mark => 50:']),
      options: ['<code>if mark &gt;= 50:</code>', '<code>if mark =&gt; 50</code>', '<code>if mark = 50:</code>', '<code>if (mark) =&gt; (50):</code>'], answer: 0,
      why: 'The "greater than or equal to" operator is written <code>&gt;=</code>, with the &gt; first. The line must still end with a colon.' },
    { skill: 'structure-gaps', kind: 'mcq', q: 'Why does this code not run?' + P(['if mark >= 50:', '    print("Pass")', 'else mark < 50:', '    print("Fail")']),
      options: ['<code>else</code> cannot have a condition; it should be just <code>else:</code>', 'The first line needs <code>elif</code> instead of <code>if</code>', 'Both messages must be printed using one single <code>print</code> statement', '<code>&lt;</code> cannot be used after <code>&gt;=</code> in one program'], answer: 0,
      why: '<code>else</code> already means "every other case", so a condition after it is a syntax error. Use <code>elif mark &lt; 50:</code> or just <code>else:</code>.' },
    { skill: 'predict-output', kind: 'mcq', q: 'The user types <b>Yes</b> (with a capital Y). What is displayed?' + P(['answer = input("Continue? ")', 'if answer == "yes":', '    print("Carrying on")', 'else:', '    print("Stopping")']),
      options: ['Stopping', 'Carrying on', 'Nothing, because Python stops with an error', 'Carrying on, then Stopping'], answer: 0,
      why: 'String comparison is case-sensitive: "Yes" is not equal to "yes", so the <code>else</code> branch runs.' },
    { skill: 'branch-order', gen: function () {
      var A = rint(70, 90), Bv = rint(40, 60);
      var good = ['if score >= ' + A + ':', '    print("Gold")', 'elif score >= ' + Bv + ':', '    print("Silver")', 'else:', '    print("Bronze")'];
      var swapped = ['if score >= ' + Bv + ':', '    print("Silver")', 'elif score >= ' + A + ':', '    print("Gold")', 'else:', '    print("Bronze")'];
      var strict = ['if score > ' + A + ':', '    print("Gold")', 'elif score > ' + Bv + ':', '    print("Silver")', 'else:', '    print("Bronze")'];
      var separate = ['if score >= ' + A + ':', '    print("Gold")', 'if score >= ' + Bv + ':', '    print("Silver")', 'else:', '    print("Bronze")'];
      var table = '<table class="mc-table"><tr><th>Score</th><th>Output</th></tr><tr><td>' + A + ' or more</td><td>Gold</td></tr><tr><td>' + Bv + ' to ' + (A - 1) + '</td><td>Silver</td></tr><tr><td>Below ' + Bv + '</td><td>Bronze</td></tr></table>';
      return { kind: 'mcq', q: 'Which code gives the outputs in this table for every whole-number score?' + table, options: [P(good), P(swapped), P(strict), P(separate)], answer: 0,
        why: 'Test the highest band first with &gt;=, then use <code>elif</code> so only one message appears. Testing ' + Bv + ' first hides Gold, &gt; misses the boundary scores ' + A + ' and ' + Bv + ', and two separate <code>if</code>s print both Gold and Silver for a high score.' };
    } },
    { skill: 'branch-order', kind: 'mcq', q: 'How does Python run an <code>if</code> / <code>elif</code> / <code>else</code> chain?',
      options: ['It checks the conditions from the top and runs only the first branch whose condition is True', 'It checks every condition and runs every single branch whose condition is True', 'It runs the <code>else</code> branch first, then checks the other conditions', 'It checks the conditions from the bottom up and runs the last True branch'], answer: 0,
      why: 'As soon as one condition is True, its branch runs and the rest of the chain is skipped. <code>else</code> runs only if no condition was True.' },
    { skill: 'predict-output', gen: function () {
      var a = rint(5, 20), x = pick([a - 2, a, a + 3]);
      var shown = !(x > a) ? 'Within limit' : 'Over limit';
      return { kind: 'mcq', q: '<code>x</code> holds ' + x + '. What is displayed?' + P(['if not (x > ' + a + '):', '    print("Within limit")', 'else:', '    print("Over limit")']),
        options: ['Within limit', 'Over limit', 'Nothing is displayed'], answer: shown === 'Within limit' ? 0 : 1,
        why: x + ' &gt; ' + a + ' is ' + (x > a ? 'True' : 'False') + ', and <code>not</code> reverses it to ' + (x > a ? 'False' : 'True') + ', so the output is <b>' + shown + '</b>.' };
    } },
    { skill: 'range-cond', kind: 'mcq', q: 'A prize is given when <code>n</code> is between 10 and 20 inclusive, <b>or</b> when it is exactly 50. Which condition is correct?',
      options: ['<code>(n &gt;= 10 and n &lt;= 20) or n == 50</code>', '<code>n &gt;= 10 and n &lt;= 20 and n == 50</code>', '<code>(n &gt;= 10 or n &lt;= 20) or n == 50</code>', '<code>(n &gt; 10 and n &lt; 20) or n = 50</code>'], answer: 0,
      why: 'The range needs both tests joined with <code>and</code>; that whole range test is then joined to the single value with <code>or</code>. Equality is tested with ==, not =.' }
  ] };

  /* ======================================================================
     CSC-CODE-01 Fix the errors in a short program
     ====================================================================== */
  var MINS = ['total = int(input("Total minutes: ")', 'hours = total % 60', 'mins = total // 60', 'print(hours, "hours", Mins, "minutes")'];
  var AVG = ['s1 = int(input("Test 1: "))', 's2 = int(input("Test 2: "))', 's3 = int(input("Test 3: "))', 'mean = s1 + s2 + s3 / 3', 'if mean >= 50', '    print("Pass")', 'else:', '    print("Fail")'];
  var PW = ['secret = "Tulip42"', 'attempt = input("Password: ")', 'if attempt = secret:', '    print("Welcome")', 'els:', '    print("Access denied")'];
  var DICE = ['import random', 'month = random.randint(1 12)', 'print("Random month number: " + month)'];
  var ERRSTEM = 'The program should ';
  B['CSC-CODE-01'] = { title: 'Fix the errors in a short program', items: [
    { skill: 'spot-error', family: 'mins', kind: 'mcq', q: ERRSTEM + 'turn a number of minutes into hours and minutes. It contains three errors.' + L(MINS) + 'Which line contains a syntax error that stops the program starting?',
      options: ['1', '2', '3', '4'], answer: 0, why: 'Line 1 opens two brackets, <code>int(</code> and <code>input(</code>, but closes only one. A missing bracket breaks the language rules.' },
    { skill: 'error-message', family: 'mins', kind: 'mcq', q: ERRSTEM + 'turn a number of minutes into hours and minutes.' + L(MINS) + 'After line 1 is fixed, Python reports <code>NameError: name \'Mins\' is not defined</code> on line 4. Which change fixes this error?',
      options: ['Change <code>Mins</code> to <code>mins</code> on line 4', 'Put quotation marks around <code>Mins</code> on line 4', 'Add the line <code>Mins = 0</code> at the start of the program', 'Change <code>print</code> to <code>Print</code> on line 4'], answer: 0,
      why: 'Python is case-sensitive, so <code>Mins</code> and <code>mins</code> are different names. The variable created on line 3 is <code>mins</code>. Setting Mins to 0 would run but always show 0.' },
    { skill: 'spot-logic', family: 'mins', kind: 'mcq', q: ERRSTEM + 'turn a number of minutes into hours and minutes.' + L(MINS) + 'With the other errors fixed, the user enters 135 and sees <code>15 hours 2 minutes</code> instead of 2 hours 15 minutes. What is the fix?',
      options: ['Swap the operators: <code>hours = total // 60</code> and <code>mins = total % 60</code>', 'Change 60 to 24 on lines 2 and 3 so that it counts hours correctly', 'Change <code>//</code> to <code>/</code> on line 3', 'Change <code>int</code> to <code>float</code> on line 1'], answer: 0,
      why: '<code>//</code> gives the whole number of hours (135 // 60 = 2) and <code>%</code> gives the minutes left over (135 % 60 = 15). The program had them the wrong way round: a logic error.' },
    { skill: 'predict-buggy', family: 'mins', gen: function () {
      var t = rint(61, 400);
      return { kind: 'num', q: ERRSTEM + 'turn minutes into hours and minutes, but line 2 is <code>hours = total % 60</code>. The user enters ' + t + '. What value is stored in <code>hours</code>?', answer: t % 60, unit: '',
        why: '<code>%</code> gives the remainder: ' + t + ' = 60 × ' + Math.floor(t / 60) + ' + ' + (t % 60) + ', so hours holds ' + (t % 60) + '. The correct operator for hours is <code>//</code>, giving ' + Math.floor(t / 60) + '.' };
    } },
    { skill: 'spot-logic', family: 'avg', kind: 'mcq', q: ERRSTEM + 'find the mean of three test scores and display Pass if it is 50 or more.' + L(AVG) + 'Which line contains a logic error?',
      options: ['4', '5', '1', '7'], answer: 0, why: 'Division is done before addition, so line 4 divides only s3 by 3. It runs, but gives the wrong mean: a logic error. It should be <code>(s1 + s2 + s3) / 3</code>.' },
    { skill: 'spot-error', family: 'avg', kind: 'mcq', q: ERRSTEM + 'find the mean of three test scores and display Pass if it is 50 or more.' + L(AVG) + 'Which line has a syntax error?',
      options: ['5', '4', '6', '8'], answer: 0, why: 'Every <code>if</code> line must end with a colon. Line 5 has no colon, so the program cannot run.' },
    { skill: 'predict-buggy', family: 'avg', gen: function () {
      var a = rint(30, 70), b = rint(30, 70), c = 3 * rint(10, 25), wrong = a + b + c / 3, right = (a + b + c) / 3;
      return { kind: 'num', q: ERRSTEM + 'find the mean of three scores, but its calculation line is <code>mean = s1 + s2 + s3 / 3</code>. The scores are ' + a + ', ' + b + ' and ' + c + '. What value does <code>mean</code> get?', answer: wrong, unit: '',
        why: 'Python divides first: ' + c + ' / 3 = ' + (c / 3) + ', then adds ' + a + ' + ' + b + ' + ' + (c / 3) + ' = ' + wrong + '. The true mean, ' + R.roundDp(right, 2) + ', needs brackets around the addition.' };
    } },
    { skill: 'choose-fix', family: 'pw', kind: 'mcq', q: ERRSTEM + 'check a password.' + L(PW) + 'Which corrected version of line 3 is right?',
      options: ['<code>if attempt == secret:</code>', '<code>if attempt = "secret":</code>', '<code>if attempt === secret:</code>', '<code>if (attempt = secret)</code>'], answer: 0,
      why: 'One = stores a value; two == compares two values. A comparison inside <code>if</code> must use ==, and the line ends with a colon.' },
    { skill: 'spot-error', family: 'pw', kind: 'multi', q: ERRSTEM + 'check a password. It contains two errors.' + L(PW) + 'Which lines contain the errors?',
      options: ['Line 3', 'Line 5', 'Line 1', 'Line 2', 'Line 4'], answers: [0, 1],
      why: 'Line 3 uses = instead of == for the comparison, and line 5 misspells the keyword <code>else</code>. The other lines are valid.' },
    { skill: 'choose-fix', family: 'dice', kind: 'mcq', q: ERRSTEM + 'pick a random month number from 1 to 12.' + L(DICE) + 'Which corrected version of line 2 is right?',
      options: ['<code>month = random.randint(1, 12)</code>', '<code>month = random.randint(1 - 12)</code>', '<code>month = random.randint("1 12")</code>', '<code>month = random.randint(12)</code>'], answer: 0,
      why: 'Arguments in a call are separated by commas. <code>randint(1, 12)</code> gives a whole number from 1 to 12 inclusive.' },
    { skill: 'error-message', family: 'dice', kind: 'mcq', q: ERRSTEM + 'pick a random month number from 1 to 12.' + L(DICE) + 'After line 2 is fixed, Python reports <code>TypeError: can only concatenate str (not "int") to str</code> on line 3. Which change fixes it?',
      options: ['Use <code>str(month)</code> on line 3', 'Use <code>int("Random month number: ")</code> on line 3', 'Remove the <code>import random</code> line', 'Change <code>randint</code> to <code>random</code> on line 2'], answer: 0,
      why: '<code>+</code> can join two strings, but <code>month</code> is an integer. <code>str(month)</code> turns it into text so the two can be joined.' },
    { skill: 'error-message', kind: 'mcq', q: 'A program stops with <code>ZeroDivisionError: division by zero</code> on the line <code>rate = goals / games</code>. What caused it?',
      options: ['<code>games</code> held 0 when the line ran', '<code>goals</code> held 0 when the line ran', 'The line is missing a colon at the end', 'The variable <code>rate</code> had not been created yet'], answer: 0,
      why: 'You can divide 0 by a number, but not by 0. The divisor, <code>games</code>, must have been 0, so the program crashed while running.' },
    { skill: 'error-message', kind: 'mcq', q: 'A list <code>days</code> holds 7 items. Python reports <code>IndexError: list index out of range</code> on <code>print(days[7])</code>. Why?',
      options: ['The indexes run from 0 to 6, so there is no item at index 7', 'Lists cannot hold more than 6 items', 'The list must be converted with <code>str()</code> before it is printed', '<code>print</code> cannot display items from a list'], answer: 0,
      why: 'Indexes start at 0, so a list of 7 items has indexes 0 to 6. <code>days[6]</code> is the last item.' },
    { skill: 'error-message', kind: 'mcq', q: 'Python reports <code>SyntaxError: expected \':\'</code> on this line. Which fix is correct?' + P(['for lap in range(5)']),
      options: ['Add a colon: <code>for lap in range(5):</code>', 'Change <code>range(5)</code> to <code>range(:5)</code>', 'Change <code>for</code> to <code>while</code>', 'Add a colon before the line: <code>:for lap in range(5)</code>'], answer: 0,
      why: 'Every <code>for</code>, <code>while</code>, <code>if</code>, <code>elif</code>, <code>else</code> and <code>def</code> line must end with a colon.' },
    { skill: 'error-message', kind: 'mcq', q: 'The user types <code>six</code> and Python reports <code>ValueError: invalid literal for int() with base 10: \'six\'</code>. What does this mean?',
      options: ['The text typed cannot be turned into a whole number', 'The program has a missing bracket on the input line', 'The number six is too large for an integer', 'The variable that stores the input has been misspelt'], answer: 0,
      why: '<code>int()</code> can only convert text made of digits, such as "6". The word "six" cannot be converted, so the program crashes while running.' },
    { skill: 'error-message', kind: 'mcq', q: 'A program creates <code>total = 0</code> and later runs <code>print(totl)</code>. Which error message will appear?',
      options: ['<code>NameError: name \'totl\' is not defined</code>', '<code>ZeroDivisionError: division by zero</code>', '<code>IndexError: list index out of range</code>', '<code>SyntaxError: expected \':\'</code>'], answer: 0,
      why: 'Python has never seen a variable called <code>totl</code>, because of the spelling mistake, so it reports a NameError when that line runs.' },
    { skill: 'method', kind: 'mcq', q: 'How many different variables does Python see in the names <code>count</code>, <code>Count</code> and <code>COUNT</code>?',
      options: ['3', '1', '2', '0'], answer: 0, why: 'Python is case-sensitive, so a change of capital letters makes a different name. These are three separate variables.' },
    { skill: 'method', kind: 'mcq', q: 'A task says "There are three errors in the code." A student fixes them and also renames every variable and adds a menu. Why is this a poor approach?',
      options: ['Only the three repairs earn marks, and the extra changes can add new errors', 'Renaming variables always causes a syntax error the next time the program is run', 'The program will only run if the original names are kept in capitals', 'Adding a menu makes Python report the original errors again'], answer: 0,
      why: 'Each seeded error earns a mark when fixed. Changing working code wastes time and may break something that was correct.' },
    { skill: 'method', kind: 'mcq', q: 'A program now runs with no error messages. Why should the student still test it with example data?',
      options: ['A logic error gives no error message, but the output will be wrong', 'Python only shows its error messages on the second run of any program', 'Testing is needed to save the file with the FINISHED name', 'Programs with no error messages always contain a runtime error'], answer: 0,
      why: 'Python cannot tell that a formula or comparison is the wrong one. Only comparing the output with the expected result reveals a logic error.' },
    { skill: 'method', kind: 'mcq', q: 'What is the best way to work through several errors in a short program?',
      options: ['Run it, fix the first error reported, run again, and repeat; then check the output for logic errors', 'Fix the last error that Python reports first, because it is always the most serious one', 'Rewrite the program from scratch so there can be no errors left', 'Change every line that looks unusual before running it'], answer: 0,
      why: 'Later error messages can be caused by earlier ones, so fix one at a time from the first report. Python does not report logic errors, so finish by testing.' },
    { skill: 'spot-logic', gen: function () {
      var price = pick([4, 5, 6, 8, 12]), qty = rint(3, 9), del = pick([3, 5, 7]), right = price * qty + del, wrong = price + qty + del;
      return { kind: 'mcq', q: ERRSTEM + 'output the cost of an order: price × quantity + delivery.' + L(['price = ' + price, 'quantity = ' + qty, 'delivery = ' + del, 'cost = price + quantity + delivery', 'print("Cost:", cost)']) + 'It displays <code>Cost: ' + wrong + '</code> instead of ' + right + '. Which change fixes it?',
        options: ['Change line 4 to <code>cost = price * quantity + delivery</code>', 'Change line 4 to <code>cost = price * quantity * delivery</code>', 'Change line 5 to <code>print("Cost:" + cost)</code>', 'Change line 4 to <code>cost = (price + quantity) * delivery</code>'], answer: 0,
        why: 'The program adds the price and quantity (' + price + ' + ' + qty + ' + ' + del + ' = ' + wrong + '). Multiplying gives ' + price + ' × ' + qty + ' + ' + del + ' = ' + right + '.' };
    } },
    { skill: 'choose-fix', kind: 'mcq', q: 'This program should count down from 5 to 1, but it keeps displaying 5 forever.' + L(['count = 5', 'while count > 0:', '    print(count)', 'count = count - 1']) + 'Which fix is correct?',
      options: ['Indent line 4 so it is inside the loop', 'Change line 2 to <code>while count &lt; 0:</code>', 'Change line 1 to <code>count = 0</code>', 'Change line 4 to <code>count = count + 1</code>'], answer: 0,
      why: 'Line 4 is not indented, so it is outside the loop and never runs while the loop repeats. <code>count</code> stays 5, so the condition is always True.' },
    { skill: 'choose-fix', gen: function () {
      var a = rint(10, 40), b = a + rint(3, 20);
      return { kind: 'mcq', q: ERRSTEM + 'display which of two numbers is larger.' + L(['first = int(input("First: "))', 'second = int(input("Second: "))', 'if first < second:', '    print(first, "is larger")', 'else:', '    print(second, "is larger")']) + 'The user enters ' + a + ' then ' + b + ' and sees <code>' + a + ' is larger</code>. Which single change fixes the program?',
        options: ['Change <code>&lt;</code> to <code>&gt;</code> on line 3', 'Change <code>&lt;</code> to <code>&lt;=</code> on line 3', 'Change <code>&lt;</code> to <code>==</code> on line 3', 'Change <code>int</code> to <code>float</code> on lines 1 and 2'], answer: 0,
        why: 'Line 3 tests whether the first number is smaller, then calls it larger. With <code>&gt;</code>, ' + a + ' &gt; ' + b + ' is False, so the else branch correctly shows ' + b + '.' };
    } }
  ] };

  /* ======================================================================
     CSC-CODE-05 Write a short number program from a list of requirements
     ====================================================================== */
  B['CSC-CODE-05'] = { title: 'Write a short number program from a list of requirements', items: [
    { skill: 'bands', gen: function () {
      var p = pick([[2.40, 2.10, 1.75], [3.20, 2.80, 2.50], [1.90, 1.60, 1.25]]), q = pick([rint(1, 9), 9, 10, rint(11, 24), 24, 25, rint(26, 60)]);
      var price = q >= 25 ? p[2] : q >= 10 ? p[1] : p[0], total = R.roundDp(q * price, 2);
      var table = '<table class="mc-table"><tr><th>Quantity</th><th>Price per notebook</th></tr><tr><td>1 to 9</td><td>' + money(p[0]) + '</td></tr><tr><td>10 to 24</td><td>' + money(p[1]) + '</td></tr><tr><td>25 or more</td><td>' + money(p[2]) + '</td></tr></table>';
      return { kind: 'num', q: 'A program charges for notebooks using this table.' + table + 'A customer orders ' + q + ' notebooks. What total cost should the program display? Give your answer in $ to 2 decimal places.', answer: total, unit: '$', tol: 0.005, display: total.toFixed(2),
        why: q + ' is in the ' + (q >= 25 ? '25 or more' : q >= 10 ? '10 to 24' : '1 to 9') + ' band, so the price is ' + money(price) + '. Total = ' + q + ' × ' + money(price) + ' = ' + money(total) + '.' };
    } },
    { skill: 'bands', kind: 'mcq', q: 'Prices are $2.40 for 1 to 9 items, $2.10 for 10 to 24 items and $1.75 for 25 or more. Which code sets <code>price</code> correctly for every whole-number quantity <code>q</code>?',
      options: [P(['if q >= 25:', '    price = 1.75', 'elif q >= 10:', '    price = 2.10', 'else:', '    price = 2.40']), P(['if q > 25:', '    price = 1.75', 'elif q > 10:', '    price = 2.10', 'else:', '    price = 2.40']),
        P(['if q >= 10:', '    price = 2.10', 'elif q >= 25:', '    price = 1.75', 'else:', '    price = 2.40']), P(['if q < 10:', '    price = 2.40', 'elif q > 10:', '    price = 2.10', 'else:', '    price = 1.75'])], answer: 0,
      why: 'Test the largest band first with &gt;=, then each <code>elif</code> can rely on the earlier test having failed. Using &gt; puts 10 and 25 in the wrong band, testing 10 first hides the 25+ band, and the last version charges $1.75 for 10 items and $2.10 for 25 or more.' },
    { skill: 'bands', gen: function () {
      var t = pick([10, 12, 20, 25]);
      return { kind: 'mcq', q: 'A price table says "' + t + ' or more items: lower price". The program uses <code>if quantity &gt; ' + t + ':</code> for the lower price. Which quantity is charged the wrong price?',
        options: [String(t), String(t - 1), String(t + 1), String(t * 3)], answer: 0,
        why: '"' + t + ' or more" includes ' + t + ', but <code>quantity &gt; ' + t + '</code> is False for ' + t + '. The condition should be <code>quantity &gt;= ' + t + '</code>.' };
    } },
    { skill: 'loops', gen: function () {
      var n = rint(5, 20);
      return { kind: 'mcq', q: 'Which loop makes <code>i</code> take every value from 1 to ' + n + ' inclusive?',
        options: [C('for i in range(1, ' + (n + 1) + '):'), C('for i in range(' + n + '):'), C('for i in range(1, ' + n + '):'), C('for i in range(0, ' + (n + 1) + '):')], answer: 0,
        why: '<code>range(start, stop)</code> stops one before <code>stop</code>, so range(1, ' + (n + 1) + ') gives 1 to ' + n + '. range(' + n + ') gives 0 to ' + (n - 1) + '.' };
    } },
    { skill: 'arrays', gen: function () {
      var pool = shuffle(['Amber', 'Basil', 'Cedar', 'Dahlia', 'Fern', 'Hazel', 'Iris', 'Juniper', 'Laurel', 'Maple', 'Olive', 'Poppy', 'Rowan', 'Sorrel']);
      var names = pool.slice(0, rint(6, 8)), start = rint(0, 1), out = [];
      for (var i = start; i < names.length; i += 2) out.push(names[i]);
      var other = []; for (var j = 1 - start; j < names.length; j += 2) other.push(names[j]);
      var every = names.slice(start + 2).filter(function (_, k) { return k % 2 === 0; });
      var opts = uniq([out.join(', '), other.join(', '), names.slice(start).join(', '), every.join(', ')]);
      return { kind: 'mcq', q: 'What does this code display (one name per line)?' + P(['plants = ' + pyList(names), 'for i in range(' + start + ', len(plants), 2):', '    print(plants[i])']), options: opts, answer: 0,
        why: 'The loop starts at index ' + start + ' and goes up in steps of 2, so it shows the items at indexes ' + out.map(function (_, k) { return start + 2 * k; }).join(', ') + ': ' + out.join(', ') + '.' };
    } },
    { skill: 'modulus', gen: function () {
      var k = rint(3, 9);
      return { kind: 'mcq', q: 'Which condition is True only when <code>n</code> is an exact multiple of ' + k + '?',
        options: [C('n % ' + k + ' == 0'), C('n // ' + k + ' == 0'), C('n / ' + k + ' == 0'), C('n % ' + k + ' == 1')], answer: 0,
        why: '<code>%</code> gives the remainder. A multiple of ' + k + ' leaves no remainder, so <code>n % ' + k + ' == 0</code>. <code>n // ' + k + ' == 0</code> is only True for numbers smaller than ' + k + '.' };
    } },
    { skill: 'modulus', gen: function () {
      var a = pick([3, 4, 5]), b = 2 * a;
      var cand = shuffle([a, 3 * a, 5 * a, b, 2 * b, a + 1, 3 * a + 1]).slice(0, 5);
      var ok = function (r) { return r % a === 0 && r % b !== 0; };
      if (!cand.some(ok)) cand[0] = 3 * a;
      if (cand.every(ok)) cand[1] = b;
      cand = uniq(cand);
      return { kind: 'multi', q: 'For which round numbers does this code display <b>Bonus round</b>?' + P(['if r % ' + a + ' == 0 and r % ' + b + ' != 0:', '    print("Bonus round")']),
        options: cand.map(String), answers: cand.map(function (r, i) { return ok(r) ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: 'The round must divide exactly by ' + a + ' (remainder 0) but not by ' + b + '. Multiples of ' + b + ' fail the second test, and numbers that are not multiples of ' + a + ' fail the first.' };
    } },
    { skill: 'trace', gen: function () {
      var a = rint(1, 6), b = a + rint(3, 7), s = 0; for (var i = a; i < b; i++) s += i;
      return { kind: 'num', q: 'What number is displayed?' + P(['total = 0', 'for i in range(' + a + ', ' + b + '):', '    total = total + i', 'print(total)']), answer: s, unit: '',
        why: 'range(' + a + ', ' + b + ') gives ' + a + ' to ' + (b - 1) + ' (it stops before ' + b + '). ' + (function () { var t = []; for (var j = a; j < b; j++) t.push(j); return t.join(' + '); })() + ' = ' + s + '.' };
    } },
    { skill: 'loops', kind: 'mcq', q: 'A program must keep converting a weight in kg into grams and <b>stop when a weight outside 1 to 200 is entered</b>. Which loop line is correct?',
      options: ['<code>while kg &gt;= 1 and kg &lt;= 200:</code>', '<code>while kg &gt;= 1 or kg &lt;= 200:</code>', '<code>while kg &lt; 1 or kg &gt; 200:</code>', '<code>if kg &gt;= 1 and kg &lt;= 200:</code>'], answer: 0,
      why: 'The loop should carry on while the number is inside the range, so both tests are joined with <code>and</code>. With <code>or</code> it never stops, the third line loops only on invalid numbers, and <code>if</code> does not repeat.' },
    { skill: 'calc', gen: function () {
      var k = pick([6, 8, 12, 15]), n = k * rint(4, 30) + rint(1, k - 1);
      return { kind: 'num', q: 'Eggs are packed in full boxes of ' + k + '. What does this code display when <code>eggs</code> is ' + n + '?' + P(['boxes = eggs // ' + k, 'print("Full boxes:", boxes)']), answer: Math.floor(n / k), unit: '',
        why: '<code>//</code> keeps only the whole number: ' + n + ' ÷ ' + k + ' = ' + Math.floor(n / k) + ' remainder ' + (n % k) + ', so ' + Math.floor(n / k) + ' full boxes.' };
    } },
    { skill: 'calc', gen: function () {
      var k = pick([4, 6, 8, 10]), n = k * rint(5, 20) + rint(1, k - 1);
      return { kind: 'num', q: n + ' guests sit at tables of ' + k + '. Every table is filled before the next is used. What does <code>print(guests % ' + k + ')</code> display, the number of guests at the last, part-filled table?', answer: n % k, unit: '',
        why: n + ' = ' + k + ' × ' + Math.floor(n / k) + ' + ' + (n % k) + '. <code>%</code> gives the remainder, ' + (n % k) + '.' };
    } },
    { skill: 'calc', gen: function () {
      var s = rint(2, 12);
      return { kind: 'num', q: 'What number is displayed?' + P(['side = ' + s, 'volume = side * side * side', 'print(volume)']), answer: s * s * s, unit: '',
        why: '<code>*</code> means multiply, so the volume is ' + s + ' × ' + s + ' × ' + s + ' = ' + (s * s * s) + '.' };
    } },
    { skill: 'loops', gen: function () {
      var n = pick([200, 250, 400, 500]), m = pick([4, 5, 6, 8, 10]);
      var line = function (i, v) { return 'Lap ' + i + ' total ' + v + ' m'; };
      return { kind: 'mcq', q: 'A runner trains on a track. What is the <b>last</b> line displayed?' + P(['lapLength = ' + n, 'for lap in range(1, ' + (m + 1) + '):', '    print("Lap", lap, "total", lap * lapLength, "m")']),
        options: [line(m, n * m), line(m + 1, n * (m + 1)), line(m - 1, n * (m - 1)), line(m, n + m)].map(C), answer: 0,
        why: 'The last value of lap is ' + m + ' (range stops before ' + (m + 1) + '), so the distance is ' + m + ' × ' + n + ' = ' + (n * m) + ', and print separates its items with spaces: <code>' + line(m, n * m) + '</code>.' };
    } },
    { skill: 'structure', kind: 'mcq', q: 'In a pricing program, why is <code>total = price * quantity</code> written once after the <code>if</code>/<code>elif</code>/<code>else</code> that sets <code>price</code>, instead of inside every branch?',
      options: ['It avoids repeating the same line, so there is less to check and change', 'Python does not allow any multiplication to be written inside an <code>if</code> statement', 'Lines inside an <code>if</code> run more slowly than lines outside it', 'The total would otherwise be calculated before the price was known'], answer: 0,
      why: 'Each branch only needs to set the price. Doing the shared calculation once keeps the code shorter and easier to maintain, and examiners reward it.' },
    { skill: 'structure', kind: 'mcq', q: 'Requirements: accept the number of nights, calculate the cost at $65 per night, display the cost. Which part is the <b>processing</b>?',
      options: ['<code>cost = nights * 65</code>', '<code>nights = int(input("Nights: "))</code>', '<code>print("Cost: $", cost)</code>', '<code>nights = 0</code>'], answer: 0,
      why: 'Inputs are read in, processing works something out, outputs are shown. Multiplying to find the cost is the processing.' },
    { skill: 'structure', kind: 'mcq', q: 'A program asks for the price of a single item, such as 3.75. Which input line is correct?',
      options: ['<code>price = float(input("Price: "))</code>', '<code>price = int(input("Price: "))</code>', '<code>price = input("Price: ")</code>', '<code>price = str(input("Price: "))</code>'], answer: 0,
      why: '<code>float()</code> converts text such as "3.75" to a decimal number. <code>int()</code> would crash on "3.75", and without conversion the price stays as text.' },
    { skill: 'structure', kind: 'mcq', q: 'A requirement says "display the total and the average with appropriate labels". Which line meets it?',
      options: ['<code>print("Total:", total, "Average:", average)</code>', '<code>print(total, average)</code>', '<code>print("total", "average")</code>', '<code>print("The total and average are", total + average)</code>'], answer: 0,
      why: 'Labels tell the user what each number means. The second shows two unexplained numbers, the third shows only words, and the last adds them together.' },
    { skill: 'loops', kind: 'mcq', q: 'A student uses <code>for month in range(12):</code> to work through months 1 to 12. What is wrong?',
      options: ['It gives 0 to 11, so each month is one too low', 'It gives 1 to 12, so nothing is wrong', 'It gives 1 to 11, so December (month 12) is missed out', 'It repeats 13 times'], answer: 0,
      why: 'range(12) starts at 0 and stops before 12. Use range(1, 13) to get 1 to 12.' },
    { skill: 'loops', kind: 'mcq', q: 'A program must keep asking for scores until the user enters 0. Which kind of loop suits this best?',
      options: ['A <code>while</code> loop, because the number of repeats is not known in advance', 'A <code>for</code> loop with <code>range(10)</code>, because ten scores is a sensible guess', 'An <code>if</code> statement, because it only needs to check whether the value is 0', 'No loop, because <code>input()</code> repeats automatically'], answer: 0,
      why: 'A condition-controlled (<code>while</code>) loop repeats until its condition becomes False, which suits "stop when..." requirements.' },
    { skill: 'trace', gen: function () {
      var vals = []; var k = rint(3, 6); for (var i = 0; i < k; i++) vals.push(rint(1, 20)); var all = vals.concat([0]);
      return { kind: 'num', q: 'The user types these numbers in order: <b>' + all.join(', ') + '</b>. What does the program display?' + P(['count = 0', 'num = int(input("Number: "))', 'while num != 0:', '    count = count + 1', '    num = int(input("Number: "))', 'print("Numbers entered:", count)']), answer: k, unit: '',
        why: 'The loop counts each number until 0 is entered; the 0 itself is not counted. ' + vals.join(', ') + ' gives ' + k + ' numbers.' };
    } },
    { skill: 'trace', gen: function () {
      var n = rint(100, 9999), s = 0, m = n; while (m > 0) { s += m % 10; m = Math.floor(m / 10); }
      return { kind: 'num', q: 'What number is displayed?' + P(['n = ' + n, 'total = 0', 'while n > 0:', '    total = total + n % 10', '    n = n // 10', 'print(total)']), answer: s, unit: '',
        why: '<code>n % 10</code> takes the last digit and <code>n // 10</code> removes it, so the loop adds up the digits: ' + String(n).split('').join(' + ') + ' = ' + s + '.' };
    } },
    { skill: 'calc', gen: function () {
      var c;
      // Avoid a 5 in the third decimal place followed by 0 (a tie that Python's round() may not round up).
      do { c = R.roundDp(rint(1000, 9999) / 7, 4); } while (Math.round(c * 10000) % 100 === 50);
      return { kind: 'num', q: '<code>cost</code> holds ' + c + '. What does <code>print(round(cost, 2))</code> display?', answer: R.roundDp(c, 2), unit: '', tol: 0.001, display: String(R.roundDp(c, 2)),
        why: 'round(cost, 2) keeps 2 decimal places: ' + c + ' becomes ' + R.roundDp(c, 2) + '.' };
    } }
  ] };

  /* ======================================================================
     CSC-CODE-04 Turn a flowchart or pseudocode into Python
     ====================================================================== */
  var FLOW = '<svg viewBox="0 0 400 470" role="img" aria-label="Flowchart: start, set total to 0, input n, decision is n greater than 0, yes adds n to total and loops back to input, no outputs total then stop" font-family="sans-serif" font-size="13">' +
    '<defs><marker id="g4ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#303a4c"/></marker></defs>' +
    '<g fill="none" stroke="#303a4c" stroke-width="1.6">' +
    '<rect x="120" y="10" width="120" height="34" rx="17"/>' +
    '<rect x="110" y="70" width="140" height="36"/>' +
    '<polygon points="125,132 255,132 235,168 105,168"/>' +
    '<polygon points="180,196 250,236 180,276 110,236"/>' +
    '<rect x="240" y="300" width="130" height="40"/>' +
    '<polygon points="105,320 225,320 205,356 85,356" transform="translate(-60,0)"/>' +
    '<rect x="50" y="400" width="110" height="34" rx="17"/>' +
    '<line x1="180" y1="44" x2="180" y2="70" marker-end="url(#g4ah)"/>' +
    '<line x1="180" y1="106" x2="180" y2="132" marker-end="url(#g4ah)"/>' +
    '<line x1="180" y1="168" x2="180" y2="196" marker-end="url(#g4ah)"/>' +
    '<polyline points="250,236 305,236 305,300" marker-end="url(#g4ah)"/>' +
    '<polyline points="370,320 390,320 390,150 247,150" marker-end="url(#g4ah)"/>' +
    '<polyline points="180,276 180,290 105,290 105,320" marker-end="url(#g4ah)"/>' +
    '<line x1="105" y1="356" x2="105" y2="400" marker-end="url(#g4ah)"/>' +
    '</g><g fill="#303a4c" text-anchor="middle">' +
    '<text x="180" y="32">Start</text><text x="180" y="93">total = 0</text><text x="180" y="155">Input n</text>' +
    '<text x="180" y="240">n &gt; 0?</text><text x="305" y="324">total = total + n</text>' +
    '<text x="105" y="343">Output total</text><text x="105" y="422">Stop</text>' +
    '<text x="270" y="228" fill="#195d9b">Yes</text><text x="160" y="288" fill="#195d9b">No</text></g></svg>';
  B['CSC-CODE-04'] = { title: 'Turn a flowchart or pseudocode into Python', items: [
    { skill: 'map-construct', kind: 'mcq', q: 'Which Python line implements the pseudocode <code>SET answer TO 1</code>?',
      options: ['<code>answer = 1</code>', '<code>answer == 1</code>', '<code>set(answer, 1)</code>', '<code>1 = answer</code>'], answer: 0,
      why: 'SET ... TO becomes an assignment with a single =, with the variable on the left. == is a comparison, not an assignment.' },
    { skill: 'map-construct', kind: 'mcq', q: 'Which Python line implements <code>RECEIVE age FROM (INTEGER) KEYBOARD</code>?',
      options: ['<code>age = int(input("Enter age: "))</code>', '<code>age = input("Enter age: ")</code>', '<code>int(age) = input("Enter age: ")</code>', '<code>age = int("Enter age: ")</code>'], answer: 0,
      why: 'RECEIVE ... FROM KEYBOARD is <code>input()</code>, and (INTEGER) means the text must be converted with <code>int()</code>.' },
    { skill: 'map-construct', kind: 'mcq', q: 'Which Python line implements <code>WHILE guess &lt;&gt; target DO</code>?',
      options: ['<code>while guess != target:</code>', '<code>while guess &lt;&gt; target:</code>', '<code>if guess != target:</code>', '<code>while guess == target:</code>'], answer: 0,
      why: 'Pseudocode &lt;&gt; means "not equal to", which is != in Python. A WHILE becomes a <code>while</code> loop, not an <code>if</code>, so it can repeat.' },
    { skill: 'operators', kind: 'mcq', q: 'Which Python line implements <code>SET boxes TO items DIV 6</code>?',
      options: ['<code>boxes = items // 6</code>', '<code>boxes = items / 6</code>', '<code>boxes = items % 6</code>', '<code>boxes = items div 6</code>'], answer: 0,
      why: 'DIV is whole-number division, which is <code>//</code> in Python. <code>/</code> gives a decimal and <code>%</code> gives the remainder.' },
    { skill: 'operators', kind: 'mcq', q: 'Which Python line implements <code>SET spare TO items MOD 6</code>?',
      options: ['<code>spare = items % 6</code>', '<code>spare = items // 6</code>', '<code>spare = items mod 6</code>', '<code>spare = items / 6</code>'], answer: 0,
      why: 'MOD gives the remainder after division, which is <code>%</code> in Python.' },
    { skill: 'operators', kind: 'mcq', q: 'In Pearson pseudocode, <code>RANDOM(n)</code> gives a random whole number from 0 to n. Which Python line implements <code>SET roll TO RANDOM(5) + 1</code>? (<code>random</code> has been imported.)',
      options: ['<code>roll = random.randint(0, 5) + 1</code>', '<code>roll = random.randint(1, 5) + 1</code>', '<code>roll = random.randint(0, 5)</code>', '<code>roll = random.randint(5) + 1</code>'], answer: 0,
      why: 'RANDOM(5) gives 0 to 5, which is <code>random.randint(0, 5)</code>. Adding 1 gives 1 to 6, like a dice. randint(1, 5) + 1 would give 2 to 6.' },
    { skill: 'map-construct', gen: function () {
      var a = rint(0, 3), b = rint(8, 20);
      return { kind: 'mcq', q: 'Which Python line implements <code>FOR i FROM ' + a + ' TO ' + b + ' DO</code>?',
        options: [C('for i in range(' + a + ', ' + (b + 1) + '):'), C('for i in range(' + a + ', ' + b + '):'), C('for i in range(' + b + '):'), C('for i in range(' + (a + 1) + ', ' + (b + 1) + '):')], answer: 0,
        why: 'The pseudocode includes ' + b + ', but Python\'s range stops one before its second number, so use range(' + a + ', ' + (b + 1) + ').' };
    } },
    { skill: 'map-construct', kind: 'mcq', q: 'Which Python line implements <code>FOR k FROM 0 TO 20 STEP 5 DO</code>?',
      options: ['<code>for k in range(0, 21, 5):</code>', '<code>for k in range(0, 20, 5):</code>', '<code>for k in range(5, 20):</code>', '<code>for k in range(0, 5, 21):</code>'], answer: 0,
      why: 'The values are 0, 5, 10, 15, 20. The third number in range is the step, and the stop value must be past 20, so range(0, 21, 5).' },
    { skill: 'loop-translate', kind: 'mcq', q: 'Which Python code implements this pseudocode?' + P(['REPEAT', '    RECEIVE guess FROM (INTEGER) KEYBOARD', 'UNTIL guess = 7']),
      options: [P(['guess = int(input())', 'while guess != 7:', '    guess = int(input())']), P(['guess = int(input())', 'while guess == 7:', '    guess = int(input())']), P(['guess = int(input())', 'if guess != 7:', '    guess = int(input())']), P(['while guess != 7:', '    guess = 7'])], answer: 0,
      why: 'REPEAT ... UNTIL runs the body at least once and stops when the condition becomes True. Python has no REPEAT, so take one input first, then loop <i>while</i> the guess is not 7.' },
    { skill: 'map-construct', kind: 'mcq', q: 'Which Python expression implements the pseudocode <code>LENGTH(names)</code>, where <code>names</code> is an array?',
      options: ['<code>len(names)</code>', '<code>names.length</code>', '<code>length(names)</code>', '<code>count(names)</code>'], answer: 0,
      why: 'Python\'s built-in function <code>len()</code> gives the number of items in a list.' },
    { skill: 'map-construct', kind: 'mcq', q: '<code>total</code> holds an integer. Which Python line implements <code>SEND ("Total: " &amp; total) TO DISPLAY</code>?',
      options: ['<code>print("Total: " + str(total))</code>', '<code>print("Total: " + total)</code>', '<code>print("Total: " &amp; total)</code>', '<code>send("Total: " + total)</code>'], answer: 0,
      why: '&amp; joins strings in pseudocode; in Python use + and convert the number with <code>str()</code>, otherwise Python stops with a TypeError.' },
    { skill: 'map-construct', kind: 'mcq', q: 'Which Python line implements <code>WHILE tries &lt; 3 AND NOT correct DO</code>?',
      options: ['<code>while tries &lt; 3 and not correct:</code>', '<code>while tries &lt; 3 &amp;&amp; !correct:</code>', '<code>while tries &lt; 3 or not correct:</code>', '<code>if tries &lt; 3 and not correct:</code>'], answer: 0,
      why: 'Python writes the logical operators in lower case: <code>and</code>, <code>not</code>. The WHILE must stay a loop, and AND must not become or.' },
    { skill: 'flowchart', kind: 'mcq', q: 'A flowchart contains a diamond with "Is stock less than 5?" and two exits labelled Yes and No. What does the diamond become in Python?',
      options: ['An <code>if</code> / <code>else</code> (or a loop condition if an arrow goes back)', 'An <code>input()</code> statement', 'A <code>print()</code> statement', 'An assignment such as <code>stock = 5</code>'], answer: 0,
      why: 'A diamond is a decision. If neither exit loops back it is an if/else; if one exit goes back to an earlier box, it is the condition of a while loop.' },
    { skill: 'flowchart', kind: 'mcq', q: 'In a flowchart, which shape shows an input or output, such as "Enter mark" or "Display grade"?',
      options: ['A parallelogram', 'A diamond', 'A rectangle', 'A rounded rectangle'], answer: 0,
      why: 'Parallelograms show input and output, rectangles show processes, diamonds show decisions, and rounded rectangles show Start and Stop.' },
    { skill: 'faithful', kind: 'mcq', q: 'A design asks for a mark, and loops back to ask again while the mark is not between 0 and 100. A student writes an <code>if</code> instead of a <code>while</code>. What goes wrong?',
      options: ['The mark is re-asked only once, so a second invalid mark is accepted', 'The program never stops asking for a mark', 'Python reports a syntax error because an if statement cannot test a range', 'Valid marks are rejected and must be typed twice'], answer: 0,
      why: 'An <code>if</code> checks once. The loop-back arrow means "keep asking until valid", which needs a <code>while</code> loop.' },
    { skill: 'faithful', kind: 'mcq', q: 'A student codes a design\'s WHILE loop but forgets the line that adds 1 to <code>count</code> inside it. What happens?',
      options: ['The loop never ends, because the condition never changes', 'The loop runs once and then stops', 'Python reports a syntax error on the line that starts the while loop', 'The loop is skipped completely'], answer: 0,
      why: 'If nothing inside the loop changes the variable in the condition, the condition stays True forever.' },
    { skill: 'faithful', kind: 'mcq', q: 'A design shows "Output total" after the loop ends. A student indents the <code>print(total)</code> line inside the loop. What is the effect?',
      options: ['The running total is displayed on every pass of the loop instead of once at the end', 'Only the first value is added to the total before the loop stops', 'The total is never displayed', 'The program reports an indentation error and refuses to run'], answer: 0,
      why: 'Every indented line belongs to the loop body and repeats. The output must be outdented to run once after the loop.' },
    { skill: 'faithful', kind: 'mcq', q: 'Why should a program keep the variable names and messages given in the design?',
      options: ['Each part of the code can then be matched to the design and checked', 'Python only accepts the variable names that appear in a written design', 'Different names would make the program run more slowly', 'Messages from the design are translated automatically'], answer: 0,
      why: 'The marks are for following the design step by step. Using its names and order makes every step easy to recognise and test.' },
    { skill: 'trace', gen: function () {
      var n = rint(3, 6), k = rint(2, 5), t = 0; for (var c = 1; c <= n; c++) t += c * k;
      return { kind: 'num', q: 'A student implements this pseudocode in Python. What should the program display?' + P(['SET total TO 0', 'SET count TO 1', 'WHILE count <= ' + n + ' DO', '    SET total TO total + count * ' + k, '    SET count TO count + 1', 'END WHILE', 'SEND total TO DISPLAY']), answer: t, unit: '',
        why: 'count takes the values 1 to ' + n + '. total = ' + (function () { var p = []; for (var c = 1; c <= n; c++) p.push(c + '×' + k); return p.join(' + '); })() + ' = ' + t + '.' };
    } },
    { skill: 'trace', gen: function () {
      var b = rint(3, 9), a = b * rint(3, 15) + rint(1, b - 1), q = Math.floor(a / b), r = a % b;
      return { kind: 'num', q: 'What should the Python version of this pseudocode display?' + P(['SET a TO ' + a, 'SET q TO a DIV ' + b, 'SET r TO a MOD ' + b, 'SEND q + r TO DISPLAY']), answer: q + r, unit: '',
        why: 'a DIV ' + b + ' = ' + a + ' // ' + b + ' = ' + q + ' and a MOD ' + b + ' = ' + a + ' % ' + b + ' = ' + r + '. ' + q + ' + ' + r + ' = ' + (q + r) + '.' };
    } },
    { skill: 'trace', gen: function () {
      var s = rint(2, 7), lim = rint(40, 200), n = s, steps = 0; do { n = n * 2; steps++; } while (!(n > lim));
      return { kind: 'num', q: 'What should the Python version of this pseudocode display?' + P(['SET n TO ' + s, 'SET steps TO 0', 'REPEAT', '    SET n TO n * 2', '    SET steps TO steps + 1', 'UNTIL n > ' + lim, 'SEND steps TO DISPLAY']), answer: steps, unit: '',
        why: 'Doubling from ' + s + ': ' + (function () { var v = s, p = []; for (var i = 0; i < steps; i++) { v *= 2; p.push(v); } return p.join(', '); })() + '. The first value above ' + lim + ' comes after ' + steps + ' doublings.' };
    } },
    { skill: 'flowchart', family: 'flow', kind: 'mcq', q: 'Study the flowchart.' + '<br>' + 'In Python, which structure should the arrow from "total = total + n" back to "Input n" become?', svg: FLOW,
      options: ['A <code>while</code> loop that repeats while n &gt; 0', 'An <code>if</code> statement that checks n &gt; 0 once', 'A <code>for</code> loop that repeats exactly 10 times', 'A subprogram call to <code>total()</code>'], answer: 0,
      why: 'The arrow returns to an earlier box, so the steps repeat while the decision is Yes. That is a condition-controlled <code>while</code> loop.' },
    { skill: 'trace', family: 'flow', gen: function () {
      var vals = []; var k = rint(2, 4); for (var i = 0; i < k; i++) vals.push(rint(2, 25)); var stop = pick([0, -rint(1, 9)]);
      return { kind: 'num', q: 'Study the flowchart. A program follows it exactly. The user enters <b>' + vals.concat([stop]).join(', ') + '</b> in that order. What is output?', svg: FLOW, answer: sum(vals), unit: '',
        why: 'Each positive value is added: ' + vals.join(' + ') + ' = ' + sum(vals) + '. When ' + stop + ' is entered, n &gt; 0 is No, so the total is output and the program stops.' };
    } }
  ] };

  /* ======================================================================
     CSC-CODE-07 Subprograms and strings
     ====================================================================== */
  var WORDS7 = ['paperclip', 'lighthouse', 'saxophone', 'blueprint', 'raincoat', 'pinecone', 'starfish', 'thumbtack', 'cardigan', 'woodland'];
  B['CSC-CODE-07'] = { title: 'Subprograms and strings: complete the function and its call', items: [
    { skill: 'slicing', gen: function () {
      var w = pick(WORDS7), a = rint(1, 3), b = a + rint(2, 4);
      var opts = uniq([w.slice(a, b), w.slice(a, b + 1), w.slice(a + 1, b + 1), w.slice(a - 1, b)]);
      return { kind: 'mcq', q: '<code>word</code> holds <code>"' + w + '"</code>. What does <code>print(word[' + a + ':' + b + '])</code> display?', options: opts.map(C), answer: 0,
        why: 'Indexes start at 0. The slice starts at index ' + a + ' (' + w[a] + ') and stops <i>before</i> index ' + b + ', giving <code>' + w.slice(a, b) + '</code>.' };
    } },
    { skill: 'slicing', gen: function () {
      var w = pick(WORDS7), i = rint(1, w.length - 2), neg = Math.random() < 0.4, idx = neg ? '-1' : String(i), ans = neg ? w[w.length - 1] : w[i];
      var opts = uniq([ans, neg ? w[w.length - 2] : w[i - 1], neg ? w[0] : w[i + 1], neg ? w[1] : w[0]].concat(w.split('')).concat(['x', 'q', 'z'])).slice(0, 4);
      return { kind: 'mcq', q: '<code>code</code> holds <code>"' + w + '"</code>. What does <code>print(code[' + idx + '])</code> display?', options: opts.map(C), answer: 0,
        why: neg ? 'Index -1 counts from the end, so it is the last character, <code>' + ans + '</code>.' : 'The first character is index 0, so index ' + i + ' is character number ' + (i + 1) + ', <code>' + ans + '</code>.' };
    } },
    { skill: 'slicing', gen: function () {
      var w = pick(WORDS7.concat(['ox', 'tea pot', 'A1-B2']));
      return { kind: 'num', q: 'What does this display?' + P(['entry = "' + w + '"', 'print(len(entry))']), answer: w.length, unit: '',
        why: '<code>len()</code> counts every character, including spaces and symbols: "' + w + '" has ' + w.length + '.' };
    } },
    { skill: 'build-string', gen: function () {
      var w = pick(WORDS7), n = rint(10, 99);
      var tail = w.slice(-3), key = tail.toUpperCase() + String(n + 1);
      var opts = uniq([key, w.slice(0, 3).toUpperCase() + String(n + 1), w.slice(-2).toUpperCase() + String(n + 1), tail.toUpperCase() + String(n) + '1']);
      return { kind: 'mcq', q: 'What does this program display?' + P(['def makeCode(pWord, pNum):', '    return pWord[-3:].upper() + str(pNum + 1)', '', 'item = "' + w + '"', 'num = ' + n, 'print(makeCode(item, num))']), options: opts.map(C), answer: 0,
        why: 'pWord[-3:] is the last three letters "' + tail + '", made upper case; pNum + 1 is worked out first (' + n + ' + 1 = ' + (n + 1) + ') and then turned into text with str(). Joined: <code>' + key + '</code>.' };
    } },
    { skill: 'build-string', gen: function () {
      var w = pick(['star', 'moon', 'rain', 'leaf', 'snow', 'wolf', 'pond']);
      var opts = uniq([w.split('').reverse().join(''), w, w.slice(1).split('').reverse().join(''), w.slice(0, -1).split('').reverse().join('') + w[w.length - 1]]);
      return { kind: 'mcq', q: 'What does <code>print("' + w + '"[::-1])</code> display?', options: opts.map(C), answer: 0,
        why: 'The slice [::-1] steps through the string backwards, so it reverses it: <code>' + w.split('').reverse().join('') + '</code>.' };
    } },
    { skill: 'build-string', gen: function () {
      var x = R.roundDp(rint(100, 9999) / 100, 2);
      return { kind: 'num', q: 'What does <code>print(int(' + x + '))</code> display?', answer: Math.floor(x), unit: '',
        why: '<code>int()</code> keeps the whole-number part and drops the decimal part (it does not round), so ' + x + ' becomes ' + Math.floor(x) + '.' };
    } },
    { skill: 'return-print', kind: 'mcq', q: 'What does this program display?' + P(['def double(pNum):', '    print(pNum * 2)', '', 'answer = double(4)', 'print("Answer:", answer)']),
      options: ['8, then <code>Answer: None</code>', '<code>Answer: 8</code> only', '8, then <code>Answer: 8</code>', '<code>Answer: None</code> only'], answer: 0,
      why: 'The function prints 8 but does not <code>return</code> anything, so Python gives back <code>None</code>. To store the result, the function needs <code>return pNum * 2</code>.' },
    { skill: 'calls', kind: 'mcq', q: 'The function header is <code>def makeTag(pName, pYear):</code>. The main program has <code>name</code> and <code>year</code>. Which call stores the tag correctly?',
      options: ['<code>tag = makeTag(name, year)</code>', '<code>tag = makeTag(year, name)</code>', '<code>makeTag(pName, pYear) = tag</code>', '<code>tag = makeTag()</code>'], answer: 0,
      why: 'Arguments are matched to parameters by position, so name goes to pName and year goes to pYear. The returned value must be stored on the left of =.' },
    { skill: 'calls', kind: 'mcq', q: 'Why should the body of <code>def shout(pText):</code> use <code>pText</code> rather than the main program\'s variable <code>message</code>?',
      options: ['So the function works on whatever value is passed to it, from any call', 'Because Python does not allow functions to read main-program variables at all', 'So the function runs faster each time it is called', 'Because parameters must always be printed inside the function'], answer: 0,
      why: 'The parameter receives the value of each argument. Using a main-program name ties the function to one variable and breaks other calls.' },
    { skill: 'validate', kind: 'mcq', q: 'A program must ask again, as many times as needed, until the code entered has exactly 6 characters. Which code does this?',
      options: [P(['code = input("Code: ")', 'while len(code) != 6:', '    print("Must be 6 characters")', '    code = input("Code: ")']), P(['code = input("Code: ")', 'if len(code) != 6:', '    print("Must be 6 characters")', '    code = input("Code: ")']),
        P(['code = input("Code: ")', 'while len(code) == 6:', '    print("Must be 6 characters")', '    code = input("Code: ")']), P(['code = input("Code: ")', 'while len(code) != 6:', '    print("Must be 6 characters")'])], answer: 0,
      why: 'A while loop repeats until the length is right, and it must ask again inside the loop. An if only re-asks once, == 6 loops on valid codes, and without a new input the loop never ends.' },
    { skill: 'build-string', kind: 'mcq', q: 'Python stops on <code>label = "Seat " + 12</code>. Which line fixes it?',
      options: ['<code>label = "Seat " + str(12)</code>', '<code>label = "Seat " + int(12)</code>', '<code>label = int("Seat ") + 12</code>', '<code>label = "Seat " - 12</code>'], answer: 0,
      why: '+ can join two strings or add two numbers, but not mix them. <code>str(12)</code> turns the number into text so it can be joined.' },
    { skill: 'calls', kind: 'mcq', q: 'The user types 1, but nothing happens. Why?' + P(['choice = input("Option: ")', 'if choice == 1:', '    showScores()', 'elif choice == 2:', '    addScore()']),
      options: ['<code>choice</code> is the string "1", which is never equal to the integer 1', 'A menu must use separate <code>if</code> statements, not <code>elif</code>', 'Subprograms can only be called from inside another subprogram', '<code>showScores()</code> needs an argument before it will run'], answer: 0,
      why: 'input() returns text. Either convert it with <code>int(input(...))</code> or compare with <code>"1"</code>.' },
    { skill: 'validate', gen: function () {
      var e = pick(['QUIT', 'Quit', 'QuIt', 'quit!', 'Qiut', 'Exit']), ok = e.toLowerCase() === 'quit';
      return { kind: 'mcq', q: 'The user types <code>' + e + '</code>. What is displayed?' + P(['entry = input("Command: ")', 'if entry.lower() == "quit":', '    print("Goodbye")', 'else:', '    print("Unknown command")']),
        options: ['Goodbye', 'Unknown command', 'An error message'], answer: ok ? 0 : 1,
        why: '<code>"' + e + '".lower()</code> gives "' + e.toLowerCase() + '", which ' + (ok ? 'matches "quit", so capital letters typed by the user make no difference.' : 'is not exactly "quit", so the else branch runs.') };
    } },
    { skill: 'return-print', gen: function () {
      var a = rint(2, 9), b = rint(2, 9), m = rint(2, 4);
      return { kind: 'num', q: 'What does this program display?' + P(['def combine(pA, pB):', '    result = pA * ' + m + ' + pB', '    return result', '', 'print(combine(' + a + ', ' + b + '))']), answer: a * m + b, unit: '',
        why: 'pA receives ' + a + ' and pB receives ' + b + '. ' + a + ' × ' + m + ' + ' + b + ' = ' + (a * m + b) + ', which is returned and printed.' };
    } },
    { skill: 'return-print', kind: 'mcq', q: 'What is the difference between a procedure and a function?',
      options: ['A function returns a value to the line that called it; a procedure does not', 'A procedure has parameters; a function never has parameters', 'A function is built into Python; a procedure is always written by the programmer', 'A procedure can only be called once; a function can be called many times'], answer: 0,
      why: 'Both are subprograms that can take parameters. A function sends a value back with <code>return</code>; a procedure just does a job, such as printing.' },
    { skill: 'calls', kind: 'mcq', q: 'What happens when this program runs?' + P(['def setBonus():', '    bonus = 50', '', 'setBonus()', 'print(bonus)']),
      options: ['Python stops with a NameError, because bonus only exists inside the function', 'It displays 50', 'It displays 0', 'It displays None'], answer: 0,
      why: '<code>bonus</code> is a local variable, created inside the function and lost when it ends. The main program cannot see it. Return the value instead.' },
    { skill: 'slicing', gen: function () {
      var w = pick(['banana', 'cinnamon', 'pepper', 'balloon', 'mississippi', 'committee', 'assessment']), ch = pick(w.split('').filter(function (c, i, a) { return a.indexOf(c) !== a.lastIndexOf(c); }));
      var n = w.split('').filter(function (c) { return c === ch; }).length;
      return { kind: 'num', q: 'What does this program display?' + P(['def countLetter(pText, pLetter):', '    count = 0', '    for ch in pText:', '        if ch == pLetter:', '            count = count + 1', '    return count', '', 'print(countLetter("' + w + '", "' + ch + '"))']), answer: n, unit: '',
        why: 'The loop looks at each character of "' + w + '" and adds 1 whenever it is "' + ch + '". There are ' + n + '.' };
    } },
    { skill: 'validate', gen: function () {
      var e = pick(['Great match #final', 'See you at 6', 'Bake sale on Friday', 'New kit #team2027', 'Score: 3-1 #win']), has = e.indexOf('#') >= 0;
      return { kind: 'mcq', q: 'What does this display?' + P(['def checkTag(pPost):', '    if "#" in pPost:', '        return "Tagged"', '    else:', '        return "No tag"', '', 'print(checkTag("' + e + '"))']),
        options: ['Tagged', 'No tag', 'True', 'None'], answer: has ? 0 : 1,
        why: '<code>"#" in pPost</code> is True if the # symbol appears anywhere in the text. "' + e + '" ' + (has ? 'contains' : 'does not contain') + ' #, so the function returns ' + (has ? 'Tagged' : 'No tag') + '.' };
    } },
    { skill: 'return-print', kind: 'mcq', q: 'A function ends with the line <code>return</code> and nothing after it. What does the calling line receive?',
      options: ['<code>None</code>', 'The value of the last variable used in the function', '0', 'An empty string ""'], answer: 0,
      why: 'A bare <code>return</code> sends back no value, so Python gives <code>None</code>. Write <code>return result</code> to send the result back.' },
    { skill: 'build-string', gen: function () {
      var s = pick(['Okafor', 'Bennett', 'Takahashi', 'Lindqvist', 'Moreau']), y = rint(2008, 2013);
      var u = s.slice(0, 4).toLowerCase() + String(y).slice(-2);
      var opts = uniq([u, s.slice(0, 4).toLowerCase() + String(y).slice(0, 2), s.slice(0, 3).toLowerCase() + String(y).slice(-2), s.slice(1, 5).toLowerCase() + String(y).slice(-2)]);
      return { kind: 'mcq', q: 'What username does this create?' + P(['surname = "' + s + '"', 'year = ' + y, 'user = surname[0:4].lower() + str(year)[-2:]', 'print(user)']), options: opts.map(C), answer: 0,
        why: 'surname[0:4] is "' + s.slice(0, 4) + '", lower() makes it "' + s.slice(0, 4).toLowerCase() + '", and str(year)[-2:] is the last two digits "' + String(y).slice(-2) + '": <code>' + u + '</code>.' };
    } },
    { skill: 'build-string', gen: function () {
      var a = rint(1, 9), b = rint(1, 9);
      return { kind: 'mcq', q: 'The user types ' + a + ' and then ' + b + '. What is displayed?' + P(['first = input("First: ")', 'second = input("Second: ")', 'print(first + second)']),
        options: uniq([String(a) + String(b), String(a + b), String(a) + ' ' + String(b), 'An error message']), answer: 0,
        why: 'input() returns strings, and + joins strings end to end, so "' + a + '" + "' + b + '" is "' + a + b + '". Converting with int() would give ' + (a + b) + '.' };
    } },
    { skill: 'validate', kind: 'mcq', q: 'A month number must be from 1 to 12 before it is passed to <code>showMonth</code>. Which code is correct?',
      options: [P(['month = int(input("Month: "))', 'if month >= 1 and month <= 12:', '    showMonth(month)']), P(['month = input("Month: ")', 'if month >= 1 and month <= 12:', '    showMonth(month)']),
        P(['month = int(input("Month: "))', 'if month >= 1 or month <= 12:', '    showMonth(month)']), P(['month = int(input("Month: "))', 'if month > 1 and month < 12:', '    showMonth()'])], answer: 0,
      why: 'Convert the input to an integer first, test the range with and plus &gt;= and &lt;=, and pass month as the argument. The others leave it as text, accept every number, or miss 1 and 12 and the argument.' }
  ] };

  /* ======================================================================
     CSC-CODE-08 Read and write text files line by line
     ====================================================================== */
  function fileBox(name, lines) { return '<b>' + esc(name) + '</b>' + P(lines); }
  B['CSC-CODE-08'] = { title: 'Read and write text files line by line', items: [
    { skill: 'read-process', gen: function () {
      var nums = []; var k = rint(3, 5); for (var i = 0; i < k; i++) nums.push(rint(5, 95));
      return { kind: 'num', q: 'The first line of <code>Laps.txt</code> is <code>' + nums.join(',') + '</code>. What does this code display?' + P(['lapFile = open("Laps.txt", "r")', 'line = lapFile.readline().strip()', 'parts = line.split(",")', 'total = 0', 'for p in parts:', '    total = total + int(p)', 'print(total)', 'lapFile.close()']), answer: sum(nums), unit: '',
        why: 'split(",") gives the strings ' + nums.map(function (x) { return '"' + x + '"'; }).join(', ') + '; int() turns each into a number, and the loop adds them: ' + nums.join(' + ') + ' = ' + sum(nums) + '.' };
    } },
    { skill: 'read-process', gen: function () {
      var rows = [], r = rint(2, 4); for (var i = 0; i < r; i++) { var row = []; for (var j = 0; j < 3; j++) row.push(rint(10, 60)); rows.push(row); }
      var g = sum(rows.map(sum));
      return { kind: 'num', q: fileBox('Stock.txt', rows.map(function (x) { return x.join(','); })) + 'What is the grand total displayed?' + P(['grand = 0', 'stockFile = open("Stock.txt", "r")', 'for line in stockFile:', '    values = line.strip().split(",")', '    for v in values:', '        grand = grand + int(v)', 'stockFile.close()', 'print("Grand total:", grand)']), answer: g, unit: '',
        why: 'Each line is split into numbers and every value is added to grand: ' + rows.map(function (x) { return '(' + x.join(' + ') + ')'; }).join(' + ') + ' = ' + g + '.' };
    } },
    { skill: 'read-process', gen: function () {
      var names = shuffle(['Ade', 'Bea', 'Cai', 'Dev', 'Eli', 'Fay', 'Gus']).slice(0, 5), T = pick([40, 50, 60]);
      var marks = names.map(function () { return rint(T - 25, T + 30); }), n = marks.filter(function (m) { return m < T; }).length;
      return { kind: 'num', q: fileBox('Marks.txt', names.map(function (x, i) { return x + ',' + marks[i]; })) + 'What number is displayed?' + P(['low = 0', 'markFile = open("Marks.txt", "r")', 'for line in markFile:', '    fields = line.strip().split(",")', '    if int(fields[1]) < ' + T + ':', '        low = low + 1', 'markFile.close()', 'print(low)']), answer: n, unit: '',
        why: 'fields[1] is the mark on each line. The marks below ' + T + ' are: ' + (n ? marks.filter(function (m) { return m < T; }).join(', ') : 'none') + ', so ' + n + ' is displayed.' };
    } },
    { skill: 'convert', kind: 'mcq', q: 'A line of a file is <code>5,7</code>. A program splits it into <code>a</code> and <code>b</code> and runs <code>print(a + b)</code> without using <code>int()</code>. What is displayed?',
      options: ['57', '12', '5,7', 'An error message'], answer: 0,
      why: 'Everything read from a text file is a string, and + joins strings: "5" + "7" is "57". Convert with int() to get 12.' },
    { skill: 'split', gen: function () {
      var rec = pick([['Kestrel', 'Bird', '32', 'Wales'], ['Otter', 'Mammal', '9', 'Devon'], ['Newt', 'Amphibian', '14', 'Kent'], ['Badger', 'Mammal', '21', 'Fife']]), i = rint(0, 3);
      return { kind: 'mcq', q: 'A line read from a file is <code>' + rec.join(',') + '</code>. After <code>fields = line.strip().split(",")</code>, which expression gives <code>"' + rec[i] + '"</code>?',
        options: [0, 1, 2, 3].map(function (k) { return C('fields[' + k + ']'); }), answer: i, keepOrder: true,
        why: 'split(",") makes a list of 4 strings, indexed from 0. "' + rec[i] + '" is item ' + (i + 1) + ', so its index is ' + i + '.' };
    } },
    { skill: 'write', gen: function () {
      var id = rint(101, 140), name = pick(['Kestrel', 'Puffin', 'Heron', 'Wren']), n = rint(3, 60);
      var good = 'outFile.write(str(code) + "," + name + "," + str(count) + "\\n")';
      return { kind: 'mcq', q: '<code>code</code> = ' + id + ', <code>name</code> = "' + name + '", <code>count</code> = ' + n + '. Each record must be written on its own line, exactly as <code>' + id + ',' + name + ',' + n + '</code>. Which line does this?',
        options: [C(good), C('outFile.write(str(code) + ", " + name + ", " + str(count) + "\\n")'), C('outFile.write(str(code) + "," + name + "," + str(count))'), C('outFile.write(str(code) + "," + name + "," + str(count) + ",\\n")')], answer: 0,
        why: 'The fields are joined with commas and no spaces, numbers are converted with str(), and "\\n" ends the line. The others add spaces, leave every record on one line, or leave a comma at the end.' };
    } },
    { skill: 'modes', kind: 'mcq', q: 'A file <code>Scores.txt</code> already holds 20 lines. A program opens it with <code>open("Scores.txt", "w")</code> and writes 3 lines. How many lines does the file now hold?',
      options: ['3', '23', '20', '0'], answer: 0,
      why: 'Mode "w" creates a fresh file, wiping anything already in it. To keep the old lines and add to the end, use "a" (append).' },
    { skill: 'modes', kind: 'mcq', q: 'A program must add each new order to the end of <code>Orders.txt</code> without losing the orders already there. Which mode should it use?',
      options: ['<code>"a"</code>', '<code>"w"</code>', '<code>"r"</code>', '<code>"x"</code>'], answer: 0,
      why: '"a" (append) writes after the existing contents. "w" wipes the file first, and "r" only allows reading.' },
    { skill: 'modes', kind: 'mcq', q: 'A program opens <code>Prices.txt</code> with mode <code>"r"</code>, but the file does not exist. What happens?',
      options: ['A runtime error (FileNotFoundError) stops the program', 'An empty file called Prices.txt is created', 'The program reads zero lines and then carries on as normal', 'Python refuses to start because of a syntax error'], answer: 0,
      why: 'Reading needs an existing file. When Python cannot find it while the program runs, it raises FileNotFoundError.' },
    { skill: 'split', kind: 'mcq', q: 'Why is <code>.strip()</code> used on each line read from a file?',
      options: ['To remove the newline character at the end of the line', 'To split the line into separate values wherever there is a comma', 'To convert the line from text into a number', 'To remove every comma from the line'], answer: 0,
      why: 'Each line read from a file ends with "\\n". strip() removes it (and any spaces at the ends) so comparisons and conversions work.' },
    { skill: 'loop-close', kind: 'mcq', q: 'What is wrong with this code?' + P(['logFile = open("Log.txt", "r")', 'for line in logFile:', '    print(line.strip())', '    logFile.close()']),
      options: ['The file is closed inside the loop, so reading fails after the first line', 'The file should be opened with "w" to print its lines', 'strip() cannot be used inside print()', 'Nothing is wrong; closing the file inside the loop saves memory each time'], answer: 0,
      why: 'close() is indented, so it runs on the first pass. The loop then tries to read from a closed file and Python raises an error. Close the file after the loop.' },
    { skill: 'read-process', gen: function () {
      var rows = [[rint(1, 9), rint(1, 9), rint(1, 9)], [rint(1, 9), rint(1, 9), rint(1, 9)]], s1 = sum(rows[0]), s2 = sum(rows[1]);
      return { kind: 'num', q: fileBox('Bags.txt', rows.map(function (x) { return x.join(','); })) + 'The program should show a subtotal for each line, but has a bug. What does it display for the <b>second</b> line?' + P(['subtotal = 0', 'bagFile = open("Bags.txt", "r")', 'for line in bagFile:', '    for v in line.strip().split(","):', '        subtotal = subtotal + int(v)', '    print(subtotal)', 'bagFile.close()']), answer: s1 + s2, unit: '',
        why: 'subtotal is set to 0 only once, before the loop, so the second line is added on top of the first: ' + s1 + ' + ' + s2 + ' = ' + (s1 + s2) + '. Moving <code>subtotal = 0</code> inside the outer loop would give ' + s2 + '.' };
    } },
    { skill: 'loop-close', kind: 'mcq', q: 'An open file is stored in <code>dataFile</code>. Which line visits every line of the file in turn?',
      options: ['<code>for line in dataFile:</code>', '<code>for line in range(dataFile):</code>', '<code>while dataFile:</code>', '<code>for line in "dataFile":</code>'], answer: 0,
      why: 'A for loop over an open file gives one line at a time until the end of the file. range() needs a number, and "dataFile" in quotes is just text.' },
    { skill: 'write', gen: function () {
      var birds = shuffle(['Robin', 'Swift', 'Plover', 'Linnet', 'Siskin', 'Dunlin']).slice(0, 5), k = rint(2, 4), c0 = pick([20, 40, 500, 750]);
      var opts = uniq([(c0 + k - 1) + ',' + birds[k - 1], (c0 + k) + ',' + birds[k - 1], (c0 + k - 1) + ',' + birds[k], k + ',' + birds[k - 1]]);
      return { kind: 'mcq', q: 'What is line ' + k + ' of <code>Birds.txt</code> after this code runs?' + P(['birds = ' + pyList(birds), 'code = ' + c0, 'outFile = open("Birds.txt", "w")', 'for bird in birds:', '    outFile.write(str(code) + "," + bird + "\\n")', '    code = code + 1', 'outFile.close()']), options: opts.map(C), answer: 0,
        why: 'The first record uses code ' + c0 + ' and each later record adds 1, so line ' + k + ' has code ' + (c0 + k - 1) + ' and the bird at index ' + (k - 1) + ', ' + birds[k - 1] + '.' };
    } },
    { skill: 'write', gen: function () {
      var items = shuffle(['bolts', 'nails', 'hinges', 'screws', 'washers', 'brackets']).slice(0, 5), lvl = pick([10, 15, 20]);
      var qty = items.map(function () { return rint(lvl - 8, lvl + 12); });
      if (!qty.some(function (q) { return q < lvl; })) qty[0] = lvl - 3;
      if (qty.every(function (q) { return q < lvl; })) qty[1] = lvl;
      return { kind: 'multi', q: fileBox('Stock.txt', items.map(function (x, i) { return x + ',' + qty[i]; })) + 'Which items are written to <code>Reorder.txt</code>?' + P(['inFile = open("Stock.txt", "r")', 'outFile = open("Reorder.txt", "w")', 'for line in inFile:', '    fields = line.strip().split(",")', '    if int(fields[1]) < ' + lvl + ':', '        outFile.write(fields[0] + "\\n")', 'inFile.close()', 'outFile.close()']),
        options: items.slice(), answers: items.map(function (_, i) { return qty[i] < lvl ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: 'An item is written only when its quantity is less than ' + lvl + ' (' + lvl + ' itself is not written). ' + items.map(function (x, i) { return x + ' ' + qty[i]; }).join(', ') + '.' };
    } },
    { skill: 'split', kind: 'mcq', q: 'A file holds the word <code>admin</code> on its first line. Why is "Found" never displayed?' + P(['userFile = open("Users.txt", "r")', 'for line in userFile:', '    if line == "admin":', '        print("Found")', 'userFile.close()']),
      options: ['The line still ends with a newline, so it is "admin\\n"; use line.strip()', 'The file must be opened with mode "a" before its lines can be searched', 'Strings cannot be compared with == in Python', 'The loop only reads the last line of the file'], answer: 0,
      why: 'The line read from the file is "admin\\n". Comparing <code>line.strip() == "admin"</code> removes the newline first.' },
    { skill: 'write', kind: 'mcq', q: '<code>total</code> holds the integer 350. Python stops on <code>resultFile.write(total)</code>. Which line fixes it?',
      options: ['<code>resultFile.write(str(total) + "\\n")</code>', '<code>resultFile.write(int(total))</code>', '<code>resultFile.write("total")</code>', '<code>resultFile.write(total, "\\n")</code>'], answer: 0,
      why: 'write() only accepts a string. str(total) converts the number; adding "\\n" puts the next record on a new line. Writing "total" would save the word, not the value.' },
    { skill: 'write', kind: 'mcq', q: 'A program writes three names with <code>outFile.write(name)</code> inside a loop. What does the file look like?',
      options: ['All three names joined together on one line', 'Each name on its own line', 'The names separated by commas', 'An empty file, because write() only works when "\\n" is included'], answer: 0,
      why: 'write() adds exactly the text it is given and nothing else. Without "\\n" at the end of each record, everything lands on one line.' },
    { skill: 'loop-close', kind: 'mcq', q: 'Which order of steps is correct for reading a file and totalling its values?',
      options: ['Set total to 0, open the file, loop over the lines adding values, close the file, display the total', 'Open the file, close the file, set total to 0, loop over the lines adding values, display the total', 'Loop over the lines, open the file, set total to 0, display the total, close the file', 'Set total to 0, loop over the lines, open the file, display the total, close the file'], answer: 0,
      why: 'A running total starts at 0 before the loop. The file must be open while the loop reads it, and closed once reading has finished.' },
    { skill: 'read-process', gen: function () {
      var nums = []; var k = pick([3, 4, 6]); for (var i = 0; i < k; i++) nums.push(rint(10, 90)); var avg = sum(nums) / k;
      return { kind: 'num', q: 'A line of <code>Times.txt</code> is <code>' + nums.join(',') + '</code>. A program splits it, converts each value with int() and divides the total by the number of values. What mean does it display? Give your answer to 2 decimal places.', answer: R.roundDp(avg, 2), unit: '', tol: 0.005, display: R.roundDp(avg, 2).toFixed(2),
        why: 'Total = ' + nums.join(' + ') + ' = ' + sum(nums) + '. There are ' + k + ' values, so the mean is ' + sum(nums) + ' / ' + k + ' = ' + R.roundDp(avg, 2).toFixed(2) + ' (2 d.p.).' };
    } },
    { skill: 'convert', kind: 'mcq', q: 'Each line of a file looks like <code>Hall,250,Red</code>. After <code>fields = line.strip().split(",")</code>, which line adds the number on each line to <code>total</code>?',
      options: ['<code>total = total + int(fields[1])</code>', '<code>total = total + fields[1]</code>', '<code>total = int(total + fields[1])</code>', '<code>total = total + int(fields[2])</code>'], answer: 0,
      why: 'The number is the second field, index 1, and it is still a string, so it must be converted with int() before it is added.' },
    { skill: 'split', kind: 'mcq', q: 'What does <code>"Ash,12,Oak".split(",")</code> give?',
      options: ['<code>["Ash", "12", "Oak"]</code>', '<code>["Ash", 12, "Oak"]</code>', '<code>"Ash 12 Oak"</code>', '<code>["Ash,12,Oak"]</code>'], answer: 0,
      why: 'split(",") returns a list of strings, cut at each comma. "12" is still a string until it is converted with int().' }
  ] };

  /* ======================================================================
     CSC-CODE-09 The final 20-mark program
     ====================================================================== */
  var SITES = ['Ashby', 'Brook', 'Carlow', 'Dunmore', 'Elmfield', 'Fenwick'];
  function table2(rows, cols) { var t = []; for (var i = 0; i < rows; i++) { var r = []; for (var j = 0; j < cols; j++) r.push(rint(5, 60)); t.push(r); } return t; }
  function pyTable(t) { return 'tbl_sales = [' + t.map(function (r) { return '[' + r.join(', ') + ']'; }).join(',\n             ') + ']'; }
  B['CSC-CODE-09'] = { title: 'The final 20-mark program', items: [
    { skill: '2d-arrays', gen: function () {
      var t = table2(rint(3, 4), rint(3, 4)), r = rint(0, t.length - 1), c = rint(0, t[0].length - 1);
      return { kind: 'num', q: 'What does <code>print(tbl_sales[' + r + '][' + c + '])</code> display?' + P(pyTable(t).split('\n')), answer: t[r][c], unit: '',
        why: 'The first index picks the row and the second picks the column, both counting from 0. Row ' + r + ' is [' + t[r].join(', ') + '], and item ' + c + ' of it is ' + t[r][c] + '.' };
    } },
    { skill: '2d-arrays', gen: function () {
      var t = table2(rint(3, 4), rint(3, 5)), r = rint(0, t.length - 1);
      return { kind: 'num', q: 'Each row holds one shop\'s sales for several months. What does this display?' + P(pyTable(t).split('\n').concat(['total = 0', 'for value in tbl_sales[' + r + ']:', '    total = total + value', 'print(total)'])), answer: sum(t[r]), unit: '',
        why: 'The loop visits every value in row ' + r + ': ' + t[r].join(' + ') + ' = ' + sum(t[r]) + '.' };
    } },
    { skill: '2d-arrays', gen: function () {
      var t = table2(rint(3, 5), 3), c = rint(0, 2), s = sum(t.map(function (r) { return r[c]; }));
      return { kind: 'num', q: 'What does this display?' + P(pyTable(t).split('\n').concat(['colTotal = 0', 'for row in range(len(tbl_sales)):', '    colTotal = colTotal + tbl_sales[row][' + c + ']', 'print(colTotal)'])), answer: s, unit: '',
        why: 'The loop goes down every row and adds the item in column ' + c + ': ' + t.map(function (r) { return r[c]; }).join(' + ') + ' = ' + s + '.' };
    } },
    { skill: 'trackers', gen: function () {
      var names = shuffle(SITES).slice(0, 5), vals = distinctInts(5, 20, 99), best = vals.indexOf(Math.max.apply(null, vals)), worst = vals.indexOf(Math.min.apply(null, vals));
      var askMax = Math.random() < 0.5, ans = askMax ? best : worst;
      var opts = uniq([names[ans], names[askMax ? worst : best], names[0] === names[ans] ? names[1] : names[0], names[4] === names[ans] ? names[3] : names[4]]);
      return { kind: 'mcq', q: 'What does this display?' + P(['tbl_site = ' + pyList(names), 'tbl_visits = ' + pyList(vals), 'bestIndex = 0', 'for i in range(1, len(tbl_visits)):', '    if tbl_visits[i] ' + (askMax ? '>' : '<') + ' tbl_visits[bestIndex]:', '        bestIndex = i', 'print(tbl_site[bestIndex])']), options: opts, answer: 0,
        why: 'bestIndex tracks the position of the ' + (askMax ? 'largest' : 'smallest') + ' visit count so far. That is ' + vals[ans] + ' at index ' + ans + ', and the parallel array gives the site at the same index: ' + names[ans] + '.' };
    } },
    { skill: 'trackers', gen: function () {
      var vals = distinctInts(5, 12, 80);
      return { kind: 'mcq', q: 'This code should display the smallest value. What does it actually display?' + P(['tbl_times = ' + pyList(vals), 'smallest = 0', 'for t in tbl_times:', '    if t < smallest:', '        smallest = t', 'print(smallest)']),
        options: uniq(['0', String(Math.min.apply(null, vals)), String(vals[0]), String(Math.max.apply(null, vals)), String(vals[vals.length - 1])]).slice(0, 4), answer: 0,
        why: 'Every time is above 0, so <code>t &lt; smallest</code> is never True and 0 is displayed. Start the tracker from the first item: <code>smallest = tbl_times[0]</code>.' };
    } },
    { skill: 'loops-data', gen: function () {
      var vals = []; for (var i = 0; i < 8; i++) vals.push(rint(2, 25)); var T = pick([8, 10, 12]), n = vals.filter(function (v) { return v < T; }).length;
      return { kind: 'num', q: 'What does this display?' + P(['tbl_goals = ' + pyList(vals), 'count = 0', 'for goals in tbl_goals:', '    if goals < ' + T + ':', '        count = count + 1', 'print(count)']), answer: n, unit: '',
        why: 'The loop counts the values below ' + T + ': ' + (n ? vals.filter(function (v) { return v < T; }).join(', ') : 'none') + ', so ' + n + ' is displayed.' };
    } },
    { skill: 'loops-data', gen: function () {
      var k, vals, avg;
      // Python's round() does not round exact halves up, so avoid averages such as 12.25 or 12.75.
      do { k = rint(5, 8); vals = []; for (var i = 0; i < k; i++) vals.push(rint(3, 30)); avg = sum(vals) / k; } while (Math.abs(avg * 10 - Math.floor(avg * 10) - 0.5) < 1e-9);
      return { kind: 'num', q: 'What value is displayed? Give your answer to 1 decimal place.' + P(['tbl_goals = ' + pyList(vals), 'total = 0', 'for goals in tbl_goals:', '    total = total + goals', 'average = total / len(tbl_goals)', 'print(round(average, 1))']), answer: R.roundDp(avg, 1), unit: '', tol: 0.05, display: R.roundDp(avg, 1).toFixed(1),
        why: 'Total = ' + sum(vals) + ' and len(tbl_goals) = ' + k + ', so the average is ' + sum(vals) + ' / ' + k + ' = ' + R.roundDp(avg, 1).toFixed(1) + ' to 1 decimal place.' };
    } },
    { skill: 'trackers', gen: function () {
      var names = shuffle(['Comets', 'Falcons', 'Otters', 'Pumas', 'Ravens', 'Vipers']).slice(0, 5), vals = distinctInts(5, 100, 400);
      var order = vals.map(function (_, i) { return i; }).sort(function (a, b) { return vals[b] - vals[a]; });
      return { kind: 'mcq', q: 'tbl_team = ' + C(pyList(names)) + '<br>tbl_points = ' + C(pyList(vals)) + '<br>The program must display the quiz teams in first and second place (most points first). Which pair is correct?',
        options: uniq([names[order[0]] + ' then ' + names[order[1]], names[order[1]] + ' then ' + names[order[0]], names[order[0]] + ' then ' + names[order[2]], names[order[4]] + ' then ' + names[order[3]]]), answer: 0,
        why: 'Sorted by points: ' + order.map(function (i) { return names[i] + ' ' + vals[i]; }).join(', ') + '. The parallel arrays share an index, so the team names come from the same positions as the two biggest point totals.' };
    } },
    { skill: '2d-arrays', kind: 'mcq', q: '<code>tbl_scores</code> is a 2D array with one row per student and one column per test. What does <code>len(tbl_scores[0])</code> give?',
      options: ['The number of tests (columns)', 'The number of students (rows)', 'The first student\'s total score', 'The total number of scores stored in the whole table'], answer: 0,
      why: '<code>tbl_scores[0]</code> is the first row, a list of that student\'s test scores, so its length is the number of columns. <code>len(tbl_scores)</code> gives the number of rows.' },
    { skill: 'flexibility', kind: 'mcq', q: 'The task says the program must still give correct results if pupils are added to or removed from the test data. The data has 12 pupils. Which loop is best?',
      options: ['<code>for i in range(len(tbl_pupil)):</code>', '<code>for i in range(12):</code>', '<code>for i in range(1, 13):</code>', '<code>for i in range(0, 11):</code>'], answer: 0,
      why: 'len() reads the size of the data each time, so the loop still covers every pupil if pupils are added or removed. A hard-coded 12 breaks when the data changes.' },
    { skill: 'quality', kind: 'mcq', q: 'What is <b>decomposition</b>, and how can a long program show it?',
      options: ['Breaking the problem into smaller parts, such as one subprogram per requirement', 'Removing unnecessary detail from the problem, for example deleting all of the comments', 'Putting all the code into one long block so it runs in order', 'Converting the program from pseudocode into Python'], answer: 0,
      why: 'Decomposition splits a big problem into sub-problems. Separate, well-named subprograms make each part easy to write, test and mark.' },
    { skill: 'quality', kind: 'multi', q: 'Which of these help a 20-mark program earn a higher quality band?',
      options: ['Comments that explain each section', 'Meaningful variable and subprogram names', 'Loops that use len() instead of fixed counts', 'Labelled, tidy output for the user', 'Typing the expected answers straight into print statements', 'Putting every line in one block with no subprograms'], answers: [0, 1, 2, 3],
      why: 'The band rewards readable, well-structured code that works with other data. Hard-coded answers and one long block both lower the band.' },
    { skill: 'trackers', kind: 'mcq', q: 'Why is it often better for a tracker to store the <b>index</b> of the best item rather than just its value?',
      options: ['The index can be used to find the matching items in the other parallel arrays', 'Indexes take less memory than values', 'Python cannot compare values, only indexes', 'Storing the value would change the original array that the value came from'], answer: 0,
      why: 'With parallel arrays, the same index gives the name, rating and every other detail of the best item. A value alone does not say whose it is.' },
    { skill: 'loops-data', gen: function () {
      var r = rint(2, 5), c = rint(2, 6);
      return { kind: 'num', q: '<code>grid</code> is a 2D array with ' + r + ' rows and ' + c + ' columns. How many times does the <code>print</code> line run?' + P(['for row in grid:', '    for item in row:', '        print(item)']), answer: r * c, unit: '',
        why: 'The outer loop runs once per row (' + r + ') and, for each row, the inner loop runs once per item (' + c + '): ' + r + ' × ' + c + ' = ' + (r * c) + '.' };
    } },
    { skill: 'flexibility', kind: 'mcq', q: 'A program shows a menu and must keep showing it until the user chooses option 4 (Exit). Which structure is best?',
      options: ['A <code>while</code> loop that repeats while the choice is not 4, calling a subprogram for each option', 'A <code>for</code> loop that shows the menu exactly 4 times, once for each of the options', 'An <code>if</code> statement that shows the menu again once', 'Four separate copies of the menu code, written one after another in the program'], answer: 0,
      why: 'The number of turns is unknown, so a condition-controlled loop is needed. Calling a subprogram per option keeps the menu short and clear.' },
    { skill: 'loops-data', gen: function () {
      var vals = distinctInts(7, 10, 99), present = Math.random() < 0.7, target = present ? pick(vals) : (function () { var t; do { t = rint(10, 99); } while (vals.indexOf(t) >= 0); return t; })();
      var pos = vals.indexOf(target);
      return { kind: 'num', q: 'What does this display?' + P(['tbl_ids = ' + pyList(vals), 'target = ' + target, 'position = -1', 'for i in range(len(tbl_ids)):', '    if tbl_ids[i] == target:', '        position = i', 'print(position)']), answer: pos, unit: '',
        why: present ? target + ' is at index ' + pos + ' (counting from 0), so position is set to ' + pos + '.' : target + ' is not in the list, so position keeps its starting value of -1.' };
    } },
    { skill: 'trackers', gen: function () {
      var cities = shuffle(['Lima', 'Oslo', 'Nairobi', 'Montevideo', 'Quito', 'Reykjavik', 'Hanoi', 'Canberra', 'Tbilisi']).slice(0, 5);
      var lens = cities.map(function (x) { return x.length; }), mx = Math.max.apply(null, lens);
      if (lens.filter(function (l) { return l === mx; }).length > 1) { cities = ['Lima', 'Oslo', 'Montevideo', 'Quito', 'Hanoi']; lens = cities.map(function (x) { return x.length; }); mx = 10; }
      var longest = cities[lens.indexOf(mx)];
      return { kind: 'mcq', q: 'What does this display?' + P(['tbl_city = ' + pyList(cities), 'longest = tbl_city[0]', 'for city in tbl_city:', '    if len(city) > len(longest):', '        longest = city', 'print(longest)']),
        options: uniq([longest, cities[0] === longest ? cities[1] : cities[0], cities[cities.length - 1] === longest ? cities[cities.length - 2] : cities[cities.length - 1], String(mx)]), answer: 0,
        why: 'The tracker starts with the first city and is replaced whenever a longer name is found. The longest name is ' + longest + ' with ' + mx + ' letters.' };
    } },
    { skill: 'quality', kind: 'mcq', q: 'Before submitting a 20-mark program, what is the best final check?',
      options: ['Re-read every bullet, run the program, and test it again with the data changed', 'Delete the comments so the code is shorter', 'Check only that the program runs to the end without showing any error messages', 'Rename all variables to single letters so lines fit on screen'], answer: 0,
      why: 'Marks come from meeting each listed requirement and from working with other data. Running without errors does not prove every bullet is met.' },
    { skill: 'trackers', kind: 'mcq', q: 'A program must find the lowest score in <code>tbl_score</code>. What is the safest starting value for the tracker <code>lowest</code>?',
      options: ['<code>lowest = tbl_score[0]</code>', '<code>lowest = 0</code>', '<code>lowest = -1</code>', '<code>lowest = len(tbl_score)</code>'], answer: 0,
      why: 'Starting from a real item guarantees the tracker holds a genuine score. 0 or -1 would never be beaten if all scores are higher.' },
    { skill: '2d-arrays', kind: 'mcq', q: '<code>tbl_fruit</code>, <code>tbl_trees</code> and <code>tbl_kgPerTree</code> are parallel arrays. What does it mean that they are parallel?',
      options: ['The items at the same index all describe the same fruit', 'They are all sorted into the same order, from the smallest to the largest', 'They always contain the same values', 'They are stored in one 2D array'], answer: 0,
      why: 'Index 2 in each array refers to the same fruit: its name, its number of trees and its kg per tree. Loop with one index to keep them together.' },
    { skill: 'loops-data', gen: function () {
      var counts = []; for (var i = 0; i < 4; i++) counts.push(rint(5, 40)); var litres = []; for (var j = 0; j < 4; j++) litres.push(rint(12, 30));
      var tot = 0; for (var k = 0; k < 4; k++) tot += counts[k] * litres[k];
      return { kind: 'num', q: 'Each index is one fruit grown in an orchard. What does this display?' + P(['tbl_trees = ' + pyList(counts), 'tbl_kgPerTree = ' + pyList(litres), 'tbl_harvest = []', 'for i in range(len(tbl_trees)):', '    tbl_harvest.append(tbl_trees[i] * tbl_kgPerTree[i])', 'print(sum(tbl_harvest))']), answer: tot, unit: '',
        why: 'Each harvest is trees × kg per tree at the same index: ' + counts.map(function (c, i) { return c + '×' + litres[i]; }).join(' + ') + ' = ' + tot + '. append() adds each one to the end of tbl_harvest.' };
    } },
    { skill: 'flexibility', kind: 'mcq', q: 'A task tells you that you may assume no two pupils have equal totals. What does this allow the programmer to do?',
      options: ['Assume there is a single highest total, so no extra code is needed for ties', 'Skip any pupil whose total is the same as the previous pupil\'s total in the array', 'Display only the first pupil in the array', 'Remove duplicate pupils from the data before starting'], answer: 0,
      why: 'The task removes the need to handle equal totals. The tracker can simply keep the first highest value it finds.' }
  ] };
})();
