/* Group G01 mastery bank: What algorithms are: flowcharts and pseudocode; Trace tables: running, reading and fixing algorithms; Better algorithms, decomposition, abstraction and models. Original questions, not copied from past papers. */
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
  // Code listing; numbered = true adds two-digit line numbers.
  function pc(lines, numbered) {
    return '<pre>' + lines.map(function (l, i) { return (numbered ? (i + 1 < 10 ? '0' : '') + (i + 1) + '  ' : '') + esc(l); }).join('\n') + '</pre>';
  }
  function mc(skill, q, options, answer, why, extra) { var o = { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function mu(skill, q, options, answers, why, extra) { var o = { skill: skill, kind: 'multi', q: q, options: options, answers: answers, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  // Four distinct options: the correct value first, then distractors, padded with near values.
  function opts4(correct, cands, fmt) {
    fmt = fmt || String;
    var out = [correct], seen = {}; seen[fmt(correct)] = 1;
    cands.forEach(function (v) { if (out.length < 4 && !seen[fmt(v)]) { seen[fmt(v)] = 1; out.push(v); } });
    var k = 1;
    while (out.length < 4) { [correct + k, correct - k].forEach(function (v) { if (out.length < 4 && !seen[fmt(v)]) { seen[fmt(v)] = 1; out.push(v); } }); k++; }
    return out.map(fmt);
  }
  // Line-number options: the faulty line plus three other real lines, so the answer moves around.
  function lineOpts(correct, total) {
    var others = []; for (var i = 1; i <= total; i++) if (i !== correct) others.push(i);
    return [correct].concat(sample(others, 3)).map(function (n) { return 'Line ' + n; });
  }
  function tbl(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }

  // ---------- flowchart drawing (Pearson / BCS symbols) ----------
  var INK = '#303a4c', HI = '#e4464f', BLU = '#195d9b';
  function svgWrap(w, h, label, body) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label).replace(/"/g, '&quot;') + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">' +
      '<defs><marker id="csah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="' + INK + '"/></marker></defs>' + body + '</svg>';
  }
  function tx(x, y, s, col, size) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" fill="' + (col || INK) + '"' + (size ? ' font-size="' + size + '"' : '') + '>' + esc(s) + '</text>'; }
  function ln(pts) { return '<polyline points="' + pts + '" fill="none" stroke="' + INK + '" stroke-width="1.5" marker-end="url(#csah)"/>'; }
  function term(cx, cy, s) { return '<rect x="' + (cx - 45) + '" y="' + (cy - 14) + '" width="90" height="28" rx="14" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>' + tx(cx, cy + 4, s); }
  function proc(cx, cy, w, h, lines) {
    var out = '<rect x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>';
    var top = cy - (lines.length - 1) * 8 + 4;
    lines.forEach(function (l, i) { out += tx(cx, top + i * 16, l); });
    return out;
  }
  function io(cx, cy, w, s) {
    var l = cx - w / 2, r = cx + w / 2;
    return '<polygon points="' + (l + 10) + ',' + (cy - 16) + ' ' + r + ',' + (cy - 16) + ' ' + (r - 10) + ',' + (cy + 16) + ' ' + l + ',' + (cy + 16) + '" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>' + tx(cx, cy + 4, s, null, 11);
  }
  function dec(cx, cy, s) {
    return '<polygon points="' + cx + ',' + (cy - 32) + ' ' + (cx + 80) + ',' + cy + ' ' + cx + ',' + (cy + 32) + ' ' + (cx - 80) + ',' + cy + '" fill="#fff" stroke="' + BLU + '" stroke-width="1.5"/>' + tx(cx, cy + 4, s, null, 11);
  }
  // Selection: one decision, two outputs that join before Stop. No arrow goes back.
  function selChart(inputLabel, cond, yesOut, noOut) {
    return svgWrap(360, 316, 'Flowchart: Start, ' + inputLabel + ', decision ' + cond + ', Yes leads to ' + yesOut + ', No leads to ' + noOut + ', both then go to Stop',
      term(130, 22, 'Start') + ln('130,36 130,56') + io(130, 72, 170, inputLabel) + ln('130,88 130,118') + dec(130, 150, cond) +
      ln('210,150 250,150') + tx(228, 143, 'Yes', HI) + io(300, 150, 108, yesOut) +
      ln('130,182 130,212') + tx(146, 200, 'No', HI) + io(130, 228, 170, noOut) +
      ln('130,244 130,280') + ln('300,166 300,266 132,266') + term(130, 294, 'Stop'));
  }
  // Iteration: a process loops back above the decision until the condition is Yes.
  function loopChart(init, cond, body, out) {
    return svgWrap(360, /^(Input|Output) /.test(body[0]) ? 306 : 270, 'Flowchart: Start, ' + init + ', decision ' + cond + ', No leads to ' + body.join(' and ') + ' then loops back to the decision, Yes leads to ' + out + ' then Stop',
      term(130, 22, 'Start') + ln('130,36 130,56') + proc(130, 72, 180, 32, [init]) + ln('130,88 130,118') + dec(130, 150, cond) +
      ln('210,150 250,150') + tx(228, 143, 'Yes', HI) + io(300, 150, 108, out) + ln('300,166 300,206') + term(300, 220, 'Stop') +
      ln('130,182 130,212') + tx(146, 200, 'No', HI) + loopBody(body));
  }
  // Loop body: an Input/Output step is drawn as a parallelogram, assignments as a process rectangle.
  function loopBody(body) {
    if (/^(Input|Output) /.test(body[0])) {
      return io(130, 228, 170, body[0]) + ln('130,244 130,262') + proc(130, 278, 180, 32, body.slice(1)) + ln('40,278 16,278 16,103 128,103');
    }
    return proc(130, 234, 180, 44, body) + ln('40,234 16,234 16,103 128,103');
  }

  // =====================================================================
  // CSC-T1-12 What algorithms are and how we write them down
  // =====================================================================
  B['CSC-T1-12'] = { title: 'What algorithms are and how we write them down', items: [
    mc('define-algorithm', 'Which statement best describes an <b>algorithm</b>?',
      ['A precise sequence of steps that solves a problem or completes a task', 'A program written in Python or another language so that it can be run', 'A diagram of the hardware components found inside a computer', 'A table that records how the values of variables change'], 0,
      'An algorithm is the ordered set of precise steps itself. A program is only one way of writing an algorithm down, and the table described is a trace table.'),
    mc('define-algorithm', 'A student writes: "An algorithm is a computer program." Why would this answer not earn the mark?',
      ['A program is only one way of writing an algorithm; the algorithm is the set of steps', 'Algorithms can only ever be written as flowcharts or written descriptions, never as program code', 'Programs are written by hand, but algorithms are always typed', 'An algorithm is a type of hardware, so it is not a program'], 0,
      'The same algorithm can be written as a flowchart, pseudocode, a written description or program code. Defining it as "a program" confuses the steps with one way of expressing them.'),
    mc('define-algorithm', 'A recipe card lists, in order: weigh 200 g of flour, add two eggs, mix for 1 minute, bake for 20 minutes. In computer science terms, the card is an example of which of these?',
      ['An algorithm', 'A trace table', 'A truth table', 'A simulation'], 0,
      'The card is an ordered list of precise steps that completes a task, which is exactly what an algorithm is, even though it is not written for a computer.'),
    mc('define-algorithm', 'Which of these is <b>not</b> a requirement of an algorithm?',
      ['It must be written in a programming language', 'Its steps must be carried out in a set order', 'Each step must be precise and unambiguous', 'It must solve a problem or complete a task'], 0,
      'An algorithm can be written in plain English, as a flowchart or as pseudocode. It only needs ordered, precise steps that complete a task.'),
    mc('define-algorithm', 'Why could "add some salt" not be used as a step in an algorithm for a cooking robot?',
      ['It is ambiguous: the robot needs an exact amount and cannot guess what "some" means', 'Salt cannot be represented in a computer, so no step can mention it', 'Algorithms cannot include any steps that involve food, because computers only follow steps about numbers', 'The step is too short; every step in an algorithm must be a full paragraph'], 0,
      'Every step in an algorithm must be precise. A computer follows instructions exactly, so a vague amount such as "some" cannot be carried out.'),
    mu('representations', 'Which of these are ways of expressing an algorithm?',
      ['A flowchart', 'Pseudocode', 'A written description in plain English', 'Program code', 'A truth table', 'A Caesar cipher'], [0, 1, 2, 3],
      'Flowcharts, pseudocode, written descriptions and program code all set out the steps. A truth table tests logic and a cipher is a method of encryption, so neither is a way of writing an algorithm.'),
    mc('representations', 'Amira has written her algorithm as a flowchart. Which of these is an alternative method for writing the same algorithm?',
      ['Pseudocode', 'A truth table', 'A Caesar cipher', 'A trace table'], 0,
      'Pseudocode sets out the same steps in code-like English. A truth table tests logic, a cipher encrypts data and a trace table tests an algorithm; none of them writes the algorithm down.'),
    mc('representations', 'What is <b>pseudocode</b>?',
      ['Code-like English statements that set out an algorithm without the exact syntax of one language', 'A programming language that runs directly on every type of computer, so it never needs to be translated first', 'A set of diagram symbols joined by arrows to show the order of steps', 'Binary instructions that the processor can run directly'], 0,
      'Pseudocode looks like simple program code written with English words, but it is not tied to the syntax rules of any one language, so it cannot be run as it is.'),
    mc('representations', 'Why is it useful that pseudocode is <b>not</b> tied to the syntax of one programming language?',
      ['Programmers who use different languages can all read it and then code it in their own language', 'It means the pseudocode can be run directly by any computer, so it never has to be turned into a real program', 'It means the algorithm can never contain a logic error', 'It means non-programmers can draw it using only shapes and arrows'], 0,
      'Because pseudocode is language-independent, a Python programmer and a Java programmer can both follow it and turn it into code in the language they use.'),
    mc('representations', 'Which of these is a <b>written description</b> of an algorithm?',
      ['"Ask for two numbers, add them together and display the total."', c('SET total TO first + second'), c('total = first + second'), 'A diamond labelled "total &gt; 10?" with Yes and No arrows'], 0,
      'A written description uses ordinary sentences. ' + c('SET total TO first + second') + ' is Pearson pseudocode, ' + c('total = first + second') + ' is Python code and the diamond is part of a flowchart.'),
    mc('representations', 'Which way of writing an algorithm is this line an example of? ' + pc(['SEND "Game over" TO DISPLAY']),
      ['Pseudocode', 'Python program code', 'A written description', 'A flowchart'], 0,
      'SEND ... TO DISPLAY is a command from the Pearson pseudocode set. The Python version would be ' + c('print("Game over")') + '.'),
    mc('choose-for-audience', 'A web developer is explaining a new checkout process to the shop owners, who have never programmed. Which method and justification is most suitable?',
      ['A flowchart, because its symbols and arrows show the steps visually with no programming knowledge needed', 'Pseudocode, because it is very close to real program code and easy to turn into a program', 'Program code, because it can be run straight away to prove the checkout works', 'A trace table, because it records the value of every variable as the steps run'], 0,
      'Name the method, then link the reason to the audience. A flowchart is visual and needs no knowledge of code, which suits people who have never programmed.'),
    mc('choose-for-audience', 'A team of programmers who use Python, Java and C# must agree an algorithm before each of them codes it. Which method is most suitable?',
      ['Pseudocode, because it is not tied to one language, so each programmer can code it in their own language', 'Python code, because everyone in the team will be able to run it on their own computer', 'A truth table, because it shows every possible combination of the inputs', 'A written description, because programmers should never see any code-like notation'], 0,
      'Pseudocode is precise enough for programmers but language-independent, so it suits a team working in different languages.'),
    mc('choose-for-audience', 'Asked to choose a method for showing an algorithm to non-technical managers, a student writes: "Pseudocode, because it is easy to turn into real code." Why is the justification weak?',
      ['The reason helps a programmer, not the managers, who would struggle to read code-like statements', 'Pseudocode can never be turned into real code, so the reason is false', 'Managers are not allowed to see an algorithm until it has been fully coded, tested and approved by programmers', 'The student should have named a truth table, which suits every audience'], 0,
      'The justification must fit the audience. Being close to real code helps programmers; non-technical managers would understand a flowchart or written description more easily.'),
    mc('choose-for-audience', 'A teacher wants to show a class of 11-year-olds, who cannot program yet, how a pedestrian crossing decides when to change its lights. Which method is most suitable?',
      ['A flowchart', 'Python program code', 'Pseudocode', 'A trace table'], 0,
      'A flowchart uses simple shapes and arrows, so learners who cannot read code can still follow each decision and step.'),
    mc('choose-for-audience', 'A programmer has planned an algorithm in pseudocode. In which form must it finally be written before a computer can carry it out?',
      ['Program code in a real programming language', 'A written description in plain English', 'A flowchart drawn with standard symbols', 'A trace table with a column for each variable'], 0,
      'Pseudocode and flowcharts are for planning and explaining. Only program code (then translated to machine code) can actually be run by the computer.'),
    mc('trace-table-purpose', 'What is a <b>trace table</b>?',
      ['A table with a column for each variable or output, showing how their values change as the algorithm runs', 'A table that lists every possible combination of inputs to a logic circuit and the output that each one gives', 'A list of the syntax errors found when a program is translated', 'A diagram that shows how the parts of a problem are broken down'], 0,
      'A trace table has one column per variable (and usually one for outputs). New values are written as the algorithm is followed step by step.'),
    mu('trace-table-purpose', 'Which of these are benefits of using a trace table to test an algorithm?',
      ['It helps to find the step where a logic error happens', 'It shows step by step how the algorithm works', 'It can be done by hand before any code has been written', 'It proves the algorithm works for every possible input', 'It translates the pseudocode into machine code'], [0, 1, 2],
      'Dry-running with a trace table shows how the values change, so you can follow the logic and spot where it first goes wrong, even on paper. It only tests the inputs you choose, so it proves nothing about every possible input.'),
    mc('trace-table-purpose', 'Kofi\'s algorithm runs without crashing but outputs the wrong total. Which tool would best help him find the exact step where it goes wrong, working on paper?',
      ['A trace table', 'A truth table', 'A Caesar cipher', 'A simulation'], 0,
      'A wrong result with no crash is a logic error. Following the algorithm in a trace table shows the value of total after each step, so Kofi can see where it first goes wrong.'),
    mc('trace-table-purpose', 'In a trace table, what does each <b>column</b> normally represent?',
      ['One variable, or the output', 'One line number of the algorithm', 'One complete pass of a loop', 'One different set of test data'], 0,
      'Each column is headed by a variable name (or Output). The rows then record the values in the order they change.'),
    mc('trace-table-purpose', 'Which statement about trace tables is <b>false</b>?',
      ['They can only be used after the algorithm has been coded in Python', 'They can be used to test flowcharts and pseudocode', 'They record outputs as well as variable values', 'They help a programmer follow what an algorithm does'], 0,
      'Trace tables are filled in by hand, so they work just as well with flowcharts and pseudocode as with program code.'),
    mc('representations', 'Which of these is a method of <b>testing logic</b> rather than a way of writing an algorithm?',
      ['A truth table', 'Pseudocode', 'A flowchart', 'Program code'], 0,
      'A truth table shows the output for every combination of inputs to a logic expression. Pseudocode, flowcharts and program code are all ways of writing algorithms.'),
    mc('representations', 'Why is a cipher <b>not</b> a way of expressing an algorithm?',
      ['It is a method of encrypting data, not a way of setting out the steps of a solution', 'It is far too slow to write out by hand on paper, so it can only ever be carried out by a computer', 'It can only be used with numbers and never with text', 'It is a type of flowchart symbol used for decisions'], 0,
      'A cipher turns plaintext into ciphertext to keep data secret. It does not set out the steps of a solution, so it is not a representation of an algorithm.')
  ] };

  // =====================================================================
  // CSC-T2-06 Spot selection and iteration, and pick the right loop
  // =====================================================================
  var SEL_SETS = [
    ['Input temp', 'temp > 25?', 'Output "Hot"', 'Output "Cool"'],
    ['Input age', 'age >= 18?', 'Output "Adult"', 'Output "Child"'],
    ['Input stock', 'stock < 5?', 'Output "Reorder"', 'Output "OK"'],
    ['Input speed', 'speed > 50?', 'Output "Slow down"', 'Output "Fine"']
  ];
  var LOOP_SETS = [
    ['total = 0', 'total >= 100?', ['Input coin', 'total = total + coin'], 'Output total'],
    ['count = 0', 'count = 10?', ['Output count', 'count = count + 1'], 'Output "Done"'],
    ['tries = 0', 'tries = 3?', ['Input PIN', 'tries = tries + 1'], 'Output "Locked"']
  ];
  B['CSC-T2-06'] = { title: 'Spot selection and iteration, and pick the right loop', items: [
    { skill: 'name-construct', family: 'sel-chart', gen: function () {
      var s = pick(SEL_SETS);
      return { kind: 'mcq', q: 'The flowchart shows one programming construct. Identify the construct.', svg: selChart(s[0], s[1], s[2], s[3]),
        options: ['Selection', 'Iteration', 'Sequence', 'Array'], answer: 0,
        why: 'The decision chooses one of two paths and both paths carry on to Stop. No arrow goes back to an earlier step, so nothing repeats: this is selection, not iteration.' };
    } },
    { skill: 'name-construct', family: 'loop-chart', gen: function () {
      var s = pick(LOOP_SETS);
      return { kind: 'mcq', q: 'The flowchart shows one programming construct. Identify the construct.', svg: loopChart(s[0], s[1], s[2], s[3]),
        options: ['Iteration', 'Selection', 'Sequence', 'Subprogram'], answer: 0,
        why: 'The No exit leads to a box whose arrow goes back up to the decision, so those steps repeat until the condition is Yes. An arrow looping back is iteration.' };
    } },
    mc('name-construct', 'Which line of Python begins a <b>selection</b> statement?',
      [c('if score >= 40:'), c('for score in scores:'), c('while score < 40:'), c('def check(score):')], 0,
      c('if') + ' chooses a path using a condition, which is selection. ' + c('for') + ' and ' + c('while') + ' start loops (iteration), and ' + c('def') + ' defines a subprogram.'),
    mc('name-construct', 'Three statements run one after another, each exactly once, with no decisions and no repeats. Which construct is this?',
      ['Sequence', 'Selection', 'Iteration', 'Recursion'], 0,
      'Sequence means instructions are carried out one after another in order. There is no condition to choose a path and nothing repeats.'),
    mc('name-construct', 'A flowchart has a single decision diamond. Its Yes and No arrows lead to two different output boxes, which then join and go to Stop. A student says the flowchart shows iteration. Why is the student wrong?',
      ['No arrow loops back to an earlier step, so nothing repeats; it is selection', 'Iteration always needs at least three decision diamonds, and this flowchart only has one of them', 'Any flowchart with outputs shows sequence, not iteration', 'Iteration can only be shown in pseudocode, never in a flowchart'], 0,
      'A decision on its own is selection. It only becomes iteration when one exit loops back so that earlier steps are repeated.'),
    mu('name-construct', 'Which of these Python lines start <b>iteration</b>?',
      [c('for day in range(7):'), c('while balance < 0:'), c('if balance < 0:'), c('elif balance == 0:'), c('print(balance)')], [0, 1],
      c('for') + ' and ' + c('while') + ' both start loops. ' + c('if') + ' and ' + c('elif') + ' are selection, and ' + c('print') + ' is a single statement in a sequence.'),
    mc('name-construct', 'How can you tell selection from iteration in a flowchart?',
      ['Iteration has an arrow that goes back to an earlier step; selection does not', 'Selection always uses a rectangle for its decision and iteration always uses a diamond for it', 'Iteration always has more output boxes than selection', 'Selection arrows are labelled Yes and No, but iteration arrows never are'], 0,
      'Both use decision diamonds with Yes/No exits. The difference is the loop-back arrow: if one path returns to an earlier step, the steps repeat, which is iteration.'),
    mc('loop-type', 'Which type of loop is this? ' + pc(['FOR lap FROM 1 TO 8 DO', '   SEND "Lap " & lap TO DISPLAY', 'END FOR']),
      ['Count-controlled', 'Pre-conditioned', 'Post-conditioned', 'Selection, not a loop'], 0,
      'A FOR loop repeats a fixed number of times (here 8), so it is count-controlled.'),
    mc('loop-type', 'Which type of loop is this? ' + pc(['WHILE stock > 0 DO', '   RECEIVE sold FROM (INTEGER) KEYBOARD', '   SET stock TO stock - sold', 'END WHILE']),
      ['Pre-conditioned (condition-controlled)', 'Post-conditioned (condition-controlled)', 'Count-controlled', 'Selection, not a loop'], 0,
      'WHILE tests its condition at the top, before each pass of the body, so it is a pre-conditioned loop. It could run zero times if stock starts at 0.'),
    mc('loop-type', 'Which type of loop is this? ' + pc(['REPEAT', '   RECEIVE guess FROM (INTEGER) KEYBOARD', 'UNTIL guess = secret']),
      ['Post-conditioned (condition-controlled)', 'Pre-conditioned (condition-controlled)', 'Count-controlled', 'Selection, not a loop'], 0,
      'REPEAT ... UNTIL tests its condition at the bottom, after the body has run, so it is post-conditioned and always runs at least once.'),
    mc('loop-type', 'A student says this loop is count-controlled because it uses a counter. What type of loop is it really? ' + pc(['SET count TO 0', 'WHILE count < 5 DO', '   SET count TO count + 1', 'END WHILE']),
      ['A pre-conditioned (condition-controlled) loop', 'A count-controlled loop, as the student says', 'A post-conditioned loop', 'It is not a loop; it is selection'], 0,
      'The loop type depends on how it is controlled, not on whether a counter is used. WHILE checks a condition before each pass, so it is pre-conditioned.'),
    mc('loop-type', 'In which kind of loop is the condition checked <b>after</b> the body has run?',
      ['REPEAT ... UNTIL (post-conditioned)', 'WHILE ... DO (pre-conditioned)', 'FOR ... FROM ... TO (count-controlled)', 'IF ... THEN ... ELSE'], 0,
      'UNTIL appears at the bottom of a REPEAT loop, so the body runs first and the condition is tested afterwards.'),
    mc('loop-behaviour', 'Which loop always runs its body <b>at least once</b>?',
      ['REPEAT ... UNTIL', 'WHILE ... DO', 'FOR i FROM 1 TO 0', 'IF ... THEN'], 0,
      'A post-conditioned loop only checks its condition after the body has run, so the body always runs at least once.'),
    { skill: 'loop-behaviour', gen: function () {
      var start = rint(12, 40), limit = rint(3, start - 2);
      return { kind: 'num', q: 'How many times does the body of this loop run?' + pc(['SET n TO ' + start, 'WHILE n < ' + limit + ' DO', '   SET n TO n + 2', 'END WHILE']), answer: 0, unit: 'times',
        why: 'WHILE tests the condition first. ' + start + ' &lt; ' + limit + ' is False at the start, so the body is skipped completely: it runs 0 times.' };
    } },
    { skill: 'loop-behaviour', gen: function () {
      var start = rint(12, 40), limit = rint(3, start - 2);
      return { kind: 'num', q: 'How many times does the body of this loop run?' + pc(['SET n TO ' + start, 'REPEAT', '   SET n TO n + 2', 'UNTIL n > ' + limit]), answer: 1, unit: 'time',
        why: 'REPEAT ... UNTIL runs the body before testing. After one pass n = ' + (start + 2) + ', and ' + (start + 2) + ' &gt; ' + limit + ' is True, so the loop stops after 1 pass.' };
    } },
    { skill: 'loop-behaviour', gen: function () {
      var a = rint(2, 9), b = a + rint(4, 15);
      return { kind: 'num', q: 'How many times will the body of this count-controlled loop run?' + pc(['FOR seat FROM ' + a + ' TO ' + b + ' DO', '   SEND "Seat " & seat TO DISPLAY', 'END FOR']), answer: b - a + 1, unit: 'times',
        why: 'FOR ... FROM ... TO includes both end values: ' + b + ' − ' + a + ' + 1 = ' + (b - a + 1) + ' times.' };
    } },
    { skill: 'loop-behaviour', gen: function () {
      var a = rint(0, 5), st = rint(2, 4), b = a + st * rint(3, 7) + rint(0, st - 1) + 1, n = Math.ceil((b - a) / st), vals = [];
      for (var v = a; v < b; v += st) vals.push(v);
      return { kind: 'num', q: 'How many times will the body of this Python loop run?' + pc(['for k in range(' + a + ', ' + b + ', ' + st + '):', '    print(k)']), answer: n, unit: 'times',
        why: 'range(' + a + ', ' + b + ', ' + st + ') starts at ' + a + ', goes up in steps of ' + st + ' and stops before ' + b + ': ' + vals.join(', ') + '. That is ' + n + ' values.' };
    } },
    mc('choose-loop', 'An algorithm checks whether a number n is prime by trying divisors 2, 3, 4 and so on. It could use ' + c('FOR divisor FROM 2 TO n - 1') + ', or a WHILE loop that stops when a divisor is found. Why is the WHILE loop better?',
      ['It stops as soon as a divisor is found, so no unnecessary divisions are carried out', 'It always tries every possible divisor up to n, so it is more thorough and reliable than the FOR loop', 'WHILE loops use less memory than FOR loops in every program', 'A FOR loop cannot contain a calculation that uses MOD'], 0,
      'Give the benefit and link it to this algorithm\'s condition: once one divisor is found the number cannot be prime, so stopping early avoids wasted passes.'),
    mc('choose-loop', 'A program must keep asking for a PIN until the correct PIN is entered. Which loop is most suitable?',
      ['Post-conditioned, because the PIN must be asked for at least once and the number of attempts is unknown', 'Count-controlled, because every user will always need exactly three attempts before entering the correct PIN', 'Count-controlled, because loops with conditions cannot compare text', 'Selection, because the program only needs to check the PIN once'], 0,
      'The number of attempts cannot be known in advance, so a condition-controlled loop is needed. REPEAT ... UNTIL suits it because the PIN is always asked for at least once.'),
    mc('choose-loop', 'A program prints the 9 times table, from 1 × 9 up to 12 × 9. Which loop is most suitable?',
      ['Count-controlled, because the number of repeats (12) is known before the loop starts', 'Post-conditioned, because the user decides when to stop', 'Pre-conditioned, because the loop may need to run zero times if the table has no rows to print', 'No loop, because selection is enough to print twelve lines'], 0,
      'When the number of repeats is fixed and known in advance, a FOR (count-controlled) loop is the natural choice.'),
    mu('choose-loop', 'A board game keeps rolling a dice until a six appears. Which <b>two</b> statements together explain why a post-conditioned loop is better here than a count-controlled loop?',
      ['The number of rolls needed is not known before the loop starts', 'The loop stops as soon as a six is rolled, so it never rolls more times than needed', 'A count-controlled loop cannot contain an IF statement', 'Post-conditioned loops always use less memory', 'The dice will always be rolled exactly six times'], [0, 1],
      'A good explanation links the benefit (stops as soon as the job is done) to the algorithm\'s own stopping condition (a six appears), which cannot be predicted in advance.'),
    mc('choose-loop', 'A list of new orders might be empty. Why is a pre-conditioned WHILE loop safer than REPEAT ... UNTIL for processing it?',
      ['It tests before the first pass, so it runs zero times when there are no orders', 'It tests after the first pass, so it always processes at least one order before checking the list', 'It is count-controlled, so it knows exactly how many orders there are', 'It cannot loop for ever, unlike every REPEAT ... UNTIL loop'], 0,
      'A REPEAT loop would try to process an order before checking, which goes wrong for an empty list. WHILE checks first, so an empty list is skipped.'),
    mc('choose-loop', 'This algorithm searches 1000 product codes but always checks all of them, even after the target is found. ' + pc(['SET found TO FALSE', 'FOR i FROM 0 TO 999 DO', '   IF codes[i] = target THEN', '      SET found TO TRUE', '   END IF', 'END FOR']) + 'Which change to the loop would stop it as soon as the code is found?',
      [c('WHILE found = FALSE AND i < 1000 DO') + ' (with i increased in the loop)', c('FOR i FROM 0 TO 1000 DO'), c('IF found = FALSE THEN') + ' in place of the FOR line', c('FOR i FROM 999 TO 0 STEP -1 DO')], 0,
      'A condition-controlled loop can test whether the code has been found before each pass, so it stops early instead of running all 1000 times.')
  ] };

  // =====================================================================
  // CSC-T1-06 Write an algorithm on paper: flowcharts and pseudocode
  // =====================================================================
  var STEP_SYMBOLS = [
    ['Input the customer\'s age', 1], ['Display "Access granted"', 1], ['Add 1 to count', 2], ['Is balance &lt; 0?', 3],
    ['Start', 0], ['Stop', 0], ['total = total + price', 2], ['Output the final score', 1], ['Is guess = secret?', 3], ['Get the temperature', 1]
  ];
  var SYMBOL_NAMES = ['Rounded rectangle (terminator)', 'Parallelogram (input/output)', 'Rectangle (process)', 'Diamond (decision)'];
  B['CSC-T1-06'] = { title: 'Write an algorithm on paper: flowcharts and pseudocode', items: [
    { skill: 'flowchart-symbols', gen: function () {
      var s = pick(STEP_SYMBOLS);
      var reason = ['Start and Stop always go in a terminator.', 'Inputs and outputs use a parallelogram.', 'A calculation or assignment is a process, drawn as a rectangle.', 'A question with a Yes/No answer is a decision, drawn as a diamond.'][s[1]];
      return { kind: 'mcq', q: 'Which flowchart symbol should be used for the step <b>' + s[0] + '</b>?', options: SYMBOL_NAMES.slice(), answer: s[1], why: reason };
    } },
    mc('flowchart-symbols', 'A decision box in a flowchart contains "Is stock &lt; 5?". How should its exits be drawn?',
      ['Two arrows, one labelled Yes and one labelled No', 'One arrow labelled with the answer', 'Three arrows: Yes, No and Maybe', 'No arrows; the next box is always directly below'], 0,
      'Every decision has exactly two exits, and each must be labelled (Yes/No or True/False) so the reader knows which path matches each answer.'),
    mc('flowchart-symbols', 'In a flowchart, what does an arrow that goes back up to an earlier box show?',
      ['Iteration: the steps between are repeated', 'Selection: one of two paths is chosen', 'The end of the algorithm', 'A subprogram call'], 0,
      'A loop-back arrow makes the steps between repeat, which is iteration. Selection only splits the path.'),
    mu('loop-structure', 'Which of these are errors in a student\'s flowchart?',
      ['A decision diamond with only one exit arrow', 'Decision exits with no Yes or No labels', 'A loop that goes back to the step that sets total to 0, so total is reset on every pass', 'A parallelogram used for "Output total"', 'An arrowhead on every connecting line'], [0, 1, 2],
      'Decisions need two labelled exits, and a loop must go back to the step to be repeated (such as the input), not to the set-up step. A parallelogram for output and arrows on every line are correct.'),
    mc('loop-structure', 'A car park machine asks for coins until the total paid reaches at least 300 cents. The decision box is "total &gt;= 300?". Where should its <b>No</b> arrow go?',
      ['Back to the "Insert coin" input step', 'Back to Start', 'To the Stop terminator', 'Back to the box that sets total to 0'], 0,
      'Not enough has been paid, so the machine must ask for another coin. Looping back to the set-up box would reset total to 0 and lose the coins already paid.'),
    mc('loop-structure', 'A door keypad must keep asking for a code until it matches the stored code, then display "Open". Which arrangement of the steps is correct?',
      ['Start → Set stored code → Get attempt → Match? No: back to Get attempt; Yes: Display "Open" → Stop', 'Start → Get attempt → Set stored code → Match? No: back to Start; Yes: Display "Open" → Stop', 'Start → Set stored code → Get attempt → Match? No: back to Set stored code; Yes: Stop → Display "Open"', 'Start → Set stored code → Match? Yes: Get attempt → Display "Open"; No: Stop'], 0,
      'The stored code is set once, before the loop. Each wrong attempt loops back to the input step, and the output comes before Stop.'),
    mc('decision-order', 'A courier labels parcels: over 20 kg <b>and</b> over 1 m long is "Freight", over 20 kg only is "Heavy", over 1 m only is "Long", otherwise "Standard". In which order should the decisions be made?',
      ['Test heavy-and-long first, then heavy, then long', 'Test heavy first, then long, then heavy-and-long', 'Test long first, then heavy, then heavy-and-long', 'Test heavy and long only; Freight is never needed'], 0,
      'If "over 20 kg?" is tested first, a heavy, long parcel takes the Yes path and is labelled "Heavy" before the combined test is ever reached. The most specific condition must come first.'),
    { skill: 'decision-order', gen: function () {
      var P = rint(40, 48), M = rint(55, 62), D = rint(70, 78), mark = rint(D, 95);
      return { kind: 'mcq', q: 'Grades: ' + D + '+ is Distinction, ' + M + '+ is Merit, ' + P + '+ is Pass, below ' + P + ' is Fail. A student wrote:' +
        pc(['IF mark >= ' + P + ' THEN', '   SEND "Pass" TO DISPLAY', 'ELSE', '   IF mark >= ' + M + ' THEN', '      SEND "Merit" TO DISPLAY', '   ELSE', '      IF mark >= ' + D + ' THEN', '         SEND "Distinction" TO DISPLAY', '      ELSE', '         SEND "Fail" TO DISPLAY', '      END IF', '   END IF', 'END IF']) +
        'What does it output for a mark of ' + mark + '?', options: ['Pass', 'Distinction', 'Merit', 'Fail'], answer: 0,
        why: mark + ' &gt;= ' + P + ' is True, so the first branch runs and "Pass" is output; the other tests are never reached. The tests should start with the highest boundary.' };
    } },
    mc('complete-skeleton', 'This algorithm must count the words longer than 5 letters. Which statement belongs on line 02?' +
      pc(['SET words TO ["orbit", "planets", "moon", "asteroid"]', '', 'FOR EACH word FROM words DO', '   IF LENGTH(word) > 5 THEN', '      SET count TO count + 1', '   END IF', 'END FOREACH', 'SEND count TO DISPLAY'], true),
      [c('SET count TO 0'), c('SET count TO count + 1'), c('SET count TO LENGTH(words)'), c('SET word TO 0')], 0,
      'A counter must be given a starting value of 0 before the loop, otherwise count + 1 has nothing to add to.'),
    mc('complete-skeleton', 'Which line correctly outputs the message as a single string, for example: There are 3 long words',
      [c('SEND "There are " & count & " long words" TO DISPLAY'), c('SEND "There are count long words" TO DISPLAY'), c('SEND "There are " count " long words" TO DISPLAY'), c('SEND There are & count & long words TO DISPLAY')], 0,
      'Text goes inside quotation marks and is joined to the variable with &amp;. Writing count inside the quotes prints the word "count", not its value.'),
    mc('complete-skeleton', 'Which condition tests whether <b>number</b> is a multiple of 7?',
      [c('number MOD 7 = 0'), c('number DIV 7 = 0'), c('number / 7 = 0'), c('number MOD 7 = 7')], 0,
      'MOD gives the remainder. A multiple of 7 leaves remainder 0. DIV gives the whole-number part, which is 0 only for numbers below 7.'),
    { skill: 'complete-skeleton', gen: function () {
      var lo = rint(16, 20), hi = lo + rint(4, 7);
      return { kind: 'mcq', q: 'Temperatures from ' + lo + ' °C to ' + hi + ' °C inclusive are "Comfortable". Which condition should go in the IF statement?',
        options: [c('temp >= ' + lo + ' AND temp <= ' + hi), c('temp > ' + lo + ' AND temp < ' + hi), c('temp >= ' + lo + ' OR temp <= ' + hi), c('temp <= ' + lo + ' AND temp >= ' + hi)], answer: 0,
        why: '"Inclusive" means ' + lo + ' and ' + hi + ' both count, so use &gt;= and &lt;=, and both parts must be true, so use AND. With OR every temperature passes.' };
    } },
    mc('complete-skeleton', 'This algorithm finds the average of a list of heights. Where should the line ' + c('SET average TO total / LENGTH(heights)') + ' go?' +
      pc(['SET total TO 0', 'FOR EACH h FROM heights DO', '   SET total TO total + h', 'END FOREACH', 'SEND average TO DISPLAY'], true),
      ['Between line 04 and line 05, after the loop', 'Between line 03 and line 04, inside the loop', 'Before line 01', 'After line 05'], 0,
      'The average can only be worked out once every height has been added, so it goes after the loop ends and before it is displayed.'),
    mc('complete-skeleton', 'The loop must add up values until -1 is entered. Which line is missing at line 05?' +
      pc(['SET total TO 0', 'RECEIVE value FROM (INTEGER) KEYBOARD', 'WHILE value <> -1 DO', '   SET total TO total + value', '', 'END WHILE', 'SEND total TO DISPLAY'], true),
      [c('RECEIVE value FROM (INTEGER) KEYBOARD'), c('SET total TO 0'), c('SET value TO value + 1'), c('SEND value TO DISPLAY')], 0,
      'A new value must be input inside the loop, otherwise value never changes and the loop never stops. The first value is read before the loop so -1 is never added.'),
    mc('loop-structure', 'A program must keep asking for a rating until it is from 1 to 5. Which line ends the loop correctly?' +
      pc(['REPEAT', '   RECEIVE rating FROM (INTEGER) KEYBOARD', '']),
      [c('UNTIL rating >= 1 AND rating <= 5'), c('UNTIL rating < 1 OR rating > 5'), c('UNTIL rating >= 1 OR rating <= 5'), c('UNTIL rating = 1 AND rating = 5')], 0,
      'UNTIL gives the condition for stopping, which is a valid rating: at least 1 and at most 5. ' + c('rating < 1 OR rating > 5') + ' describes an invalid rating, so it would stop on bad input.'),
    mc('counter-setup', 'Why must ' + c('SET count TO 0') + ' be placed before a loop rather than inside it?',
      ['Inside the loop it would reset count to 0 on every pass, so the count would be lost', 'Inside the loop it would cause a syntax error', 'Before the loop it uses less memory', 'Counters can only be set inside IF statements'], 0,
      'The counter must start at 0 once. Resetting it each pass throws away everything counted so far.'),
    mc('counter-setup', 'Inside a loop, which statement correctly increases a counter by one?',
      [c('SET count TO count + 1'), c('SET count TO 1'), c('SET count + 1 TO count'), c('SET 1 TO count + 1')], 0,
      'The new value of count is the old value plus one. ' + c('SET count TO 1') + ' would replace the count instead of adding to it.'),
    mc('counter-setup', 'An algorithm must find the total cost of items in a basket. Which pair of statements sets up and updates the total correctly?',
      [c('SET total TO 0') + ' before the loop; ' + c('SET total TO total + price') + ' inside it', c('SET total TO price') + ' before the loop; ' + c('SET total TO 0') + ' inside it', c('SET total TO 0') + ' inside the loop; ' + c('SET total TO total + price') + ' after it', c('SET total TO 1') + ' before the loop; ' + c('SET total TO total * price') + ' inside it'], 0,
      'A running total starts at 0 before the loop and each price is added on every pass.'),
    mu('decision-order', 'A cinema charges: under 12 pays $5, 65 or over pays $6, everyone else pays $9. Which sets of test ages would follow every path through the algorithm at least once?',
      ['8, 30, 70', '11, 12, 64, 65', '20, 40, 60', '12, 30, 64'], [0, 1],
      'Each path (child, adult, senior) needs at least one test age. 8, 30, 70 and 11, 12, 64, 65 both reach all three prices; the second set also tests the boundaries, which makes it the stronger test plan. 20, 40, 60 and 12, 30, 64 never reach the senior price.'),
    mc('loop-structure', 'In a flowchart, a student loops the "Get number" input back to <b>Start</b> rather than to the input step. Start is followed by "count = 0". What goes wrong?',
      ['count is reset to 0 every time round, so the count is lost', 'The flowchart can never reach the input step', 'Nothing; looping to Start and to the input step always behave the same', 'The decision box will have three exits'], 0,
      'Looping back to Start reruns the set-up step, so count goes back to 0 each pass. The loop should return to the input step only.'),
    mc('decision-order', 'An algorithm should output "Even" or "Odd" for a number. Which decision is correct for the diamond?',
      [c('number MOD 2 = 0?') + ' Yes: "Even", No: "Odd"', c('number DIV 2 = 0?') + ' Yes: "Even", No: "Odd"', c('number MOD 2 = 1?') + ' Yes: "Even", No: "Odd"', c('number / 2 = 2?') + ' Yes: "Even", No: "Odd"'], 0,
      'An even number leaves no remainder when divided by 2, so number MOD 2 = 0 sends even numbers down the Yes path.'),
    mc('flowchart-symbols', 'A flowchart for a burglar alarm checks the sensors over and over until the alarm is switched off. A student draws the loop but no Stop terminator. Which correction is needed?',
      ['Add a decision "Alarm switched off?" whose Yes exit leads to a Stop terminator', 'None, because Stop terminators are optional in any flowchart that has a loop', 'Draw Stop as a diamond at the end of the loop', 'Put the Stop terminator before the Start terminator'], 0,
      'The task says the checking ends when the alarm is switched off, so there must be a decision for that and a path from it to a Stop terminator (a rounded box).')
  ] };

  // =====================================================================
  // CSC-T1-01 Trace tables: run the algorithm by hand
  // =====================================================================
  var WORDS = [['banana', 'a'], ['committee', 't'], ['mississippi', 's'], ['referee', 'e'], ['assessment', 's'], ['balloon', 'l'], ['parallel', 'l'], ['coffee', 'f'], ['tomorrow', 'o'], ['successes', 's']];
  var REV_WORDS = ['planet', 'socket', 'garden', 'bridge', 'window', 'carpet', 'magnet', 'pencil'];
  B['CSC-T1-01'] = { title: 'Trace tables: run the algorithm by hand', items: [
    { skill: 'loop-final-value', gen: function () {
      var a = rint(2, 6), L = rint(40, 250), x = a, seq = [a];
      while (x <= L) { x *= 2; seq.push(x); }
      return { kind: 'num', q: 'Dry-run this algorithm. What value is output?' + pc(['SET x TO ' + a, 'SET steps TO 0', 'WHILE x <= ' + L + ' DO', '   SET x TO x * 2', '   SET steps TO steps + 1', 'END WHILE', 'SEND x TO DISPLAY']), answer: x, unit: '',
        why: 'x takes the values ' + seq.join(', ') + '. The loop stops as soon as x is greater than ' + L + ', so ' + x + ' is output.' };
    } },
    { skill: 'arithmetic-mod-div', gen: function () {
      var N = rint(102, 9876), n = N, total = 0, digits = [];
      while (n > 0) { digits.push(n % 10); total += n % 10; n = Math.floor(n / 10); }
      return { kind: 'num', q: 'What is the value of total when this algorithm finishes?' + pc(['SET num TO ' + N, 'SET total TO 0', 'WHILE num > 0 DO', '   SET total TO total + num MOD 10', '   SET num TO num DIV 10', 'END WHILE']), answer: total, unit: '',
        why: 'Each pass adds the last digit (num MOD 10) and then removes it (num DIV 10). The digits are added in the order ' + digits.join(' + ') + ' = ' + total + '.' };
    } },
    { skill: 'output-text', gen: function () {
      var P = rint(40, 48), M = rint(55, 62), D = rint(70, 78), mark = pick([D, D - 1, M, M - 1, P, P - 1, rint(10, 95)]);
      var out = mark >= D ? 'Distinction' : mark >= M ? 'Merit' : mark >= P ? 'Pass' : 'Fail';
      var opts = ['Distinction', 'Merit', 'Pass', 'Fail'];
      var steps = [];
      [[D, 'Distinction'], [M, 'Merit'], [P, 'Pass']].some(function (b) { var ok = mark >= b[0]; steps.push(mark + ' &gt;= ' + b[0] + ' is ' + (ok ? 'True' : 'False')); return ok; });
      return { kind: 'mcq', q: 'The input is ' + mark + '. What is output?' + pc(['RECEIVE mark FROM (INTEGER) KEYBOARD', 'IF mark >= ' + D + ' THEN', '   SEND "Distinction" TO DISPLAY', 'ELSE', '   IF mark >= ' + M + ' THEN', '      SEND "Merit" TO DISPLAY', '   ELSE', '      IF mark >= ' + P + ' THEN', '         SEND "Pass" TO DISPLAY', '      ELSE', '         SEND "Fail" TO DISPLAY', '      END IF', '   END IF', 'END IF']),
        options: opts, answer: opts.indexOf(out), why: steps.join('; ') + ', so "' + out + '" is output.' };
    } },
    { skill: 'arrays-strings', gen: function () {
      var T = rint(30, 70), arr = []; for (var i = 0; i < 6; i++) arr.push(rint(10, 99));
      if (Math.random() < 0.6) arr[rint(0, 5)] = T;
      var over = arr.filter(function (v) { return v > T; });
      return { kind: 'num', q: 'What is the value of count when this algorithm finishes?' + pc(['SET levels TO [' + arr.join(', ') + ']', 'SET count TO 0', 'FOR EACH level FROM levels DO', '   IF level > ' + T + ' THEN', '      SET count TO count + 1', '   END IF', 'END FOREACH']), answer: over.length, unit: '',
        why: 'Values greater than ' + T + ': ' + (over.length ? over.join(', ') : 'none') + '. That is ' + over.length + (arr.indexOf(T) >= 0 ? '. The value ' + T + ' itself is not counted because the test is &gt;, not &gt;=.' : '.') };
    } },
    { skill: 'arrays-strings', gen: function () {
      var arr = sample([12, 17, 23, 31, 38, 44, 52, 59, 66, 73, 81, 95], 6), best = 0;
      for (var i = 1; i < arr.length; i++) if (arr[i] > arr[best]) best = i;
      return { kind: 'num', q: 'What value is output by this algorithm?' + pc(['SET heights TO [' + arr.join(', ') + ']', 'SET best TO 0', 'FOR i FROM 1 TO LENGTH(heights) - 1 DO', '   IF heights[i] > heights[best] THEN', '      SET best TO i', '   END IF', 'END FOR', 'SEND best TO DISPLAY']), answer: best, unit: '',
        why: 'best holds the <i>index</i> of the largest value found so far. The largest value is ' + arr[best] + ', which is at index ' + best + ' (indexes start at 0), so ' + best + ' is output, not ' + arr[best] + '.' };
    } },
    { skill: 'loop-final-value', gen: function () {
      var a = rint(1, 5), b = rint(2, 7), m = rint(3, 5), f = a, s = b, pairs = [];
      for (var k = 0; k < m; k++) { var nx = f + s; f = s; s = nx; pairs.push('(' + f + ', ' + s + ')'); }
      return { kind: 'num', q: 'What value is output?' + pc(['SET first TO ' + a, 'SET second TO ' + b, 'FOR k FROM 1 TO ' + m + ' DO', '   SET next TO first + second', '   SET first TO second', '   SET second TO next', 'END FOR', 'SEND second TO DISPLAY']), answer: s, unit: '',
        why: 'After each pass (first, second) becomes ' + pairs.join(', ') + '. The order matters: first must copy the old second before second changes. The output is ' + s + '.' };
    } },
    { skill: 'output-text', gen: function () {
      var pos = []; for (var i = 0; i < rint(3, 4); i++) pos.push(rint(4, 30));
      var neg = -rint(2, 9), at = rint(1, pos.length - 1), inputs = pos.slice(0, at).concat([neg], pos.slice(at), [0]);
      var total = pos.reduce(function (s, v) { return s + v; }, 0), n = pos.length;
      var fmt = function (t, k) { return t + ' from ' + k; };
      var opts = [fmt(total, n), fmt(total + neg, n + 1), fmt(total, n + 1), fmt(total - pos[pos.length - 1], n - 1)];
      return { kind: 'mcq', q: 'The inputs are ' + inputs.join(', ') + ' (in that order). What is output?' + pc(['SET total TO 0', 'SET count TO 0', 'REPEAT', '   RECEIVE value FROM (INTEGER) KEYBOARD', '   IF value > 0 THEN', '      SET total TO total + value', '      SET count TO count + 1', '   END IF', 'UNTIL value = 0', 'SEND total & " from " & count TO DISPLAY']),
        options: opts, answer: 0, why: 'Only values greater than 0 are added and counted, so ' + neg + ' and the final 0 are ignored: ' + pos.join(' + ') + ' = ' + total + ' from ' + n + ' values.' };
    } },
    { skill: 'flowchart-trace', gen: function () {
      var s = rint(1, 9), k = rint(3, 9), T = rint(30, 80), v = s, n = 0, seq = [s];
      while (v < T) { v += k; n++; seq.push(v); }
      return { kind: 'num', q: 'Follow the flowchart. What value is output?', svg: loopChart('v = ' + s + ', n = 0', 'v >= ' + T + '?', ['v = v + ' + k, 'n = n + 1'], 'Output n'), answer: n, unit: '',
        why: 'v takes the values ' + seq.join(', ') + '. The decision is first Yes when v = ' + v + ', after ' + n + ' passes, so n = ' + n + ' is output.' };
    } },
    { skill: 'output-text', gen: function () {
      var n = rint(12, 30), k = rint(2, 5), seq = [];
      for (var i = n; i >= 1; i -= k) seq.push(i);
      var last = seq[seq.length - 1];
      var opts = [seq.join(', '), seq.slice(1).join(', '), seq.concat([last - k]).join(', '), seq.slice().reverse().join(', ')];
      return { kind: 'mcq', q: 'Which numbers are output, in order?' + pc(['FOR i FROM ' + n + ' TO 1 STEP -' + k + ' DO', '   SEND i TO DISPLAY', 'END FOR']), options: opts, answer: 0,
        why: 'i starts at ' + n + ' and goes down by ' + k + ' each pass. The loop stops once the next value would be below 1, so the last number output is ' + last + '.' };
    } },
    { skill: 'loop-final-value', gen: function () {
      var p = rint(3, 15), q = rint(16, 40);
      var f = function (a, b) { return 'a = ' + a + ', b = ' + b; };
      return { kind: 'mcq', q: 'What are the values of a and b when these lines have run?' + pc(['SET a TO ' + p, 'SET b TO ' + q, 'SET a TO a + b', 'SET b TO a - b', 'SET a TO a - b']),
        options: [f(q, p), f(p, q), f(p + q, p), f(q, q)], answer: 0,
        why: 'a = ' + p + ' + ' + q + ' = ' + (p + q) + '; then b = ' + (p + q) + ' − ' + q + ' = ' + p + '; then a = ' + (p + q) + ' − ' + p + ' = ' + q + '. The two values have been swapped.' };
    } },
    { skill: 'loop-final-value', gen: function () {
      var s = rint(1, 6), st = rint(2, 4), e = s + st * rint(4, 7) + rint(0, st - 1), vals = [], total = 0;
      for (var i = s; i < e; i += st) { vals.push(i); total += i; }
      return { kind: 'num', q: 'What does this Python program print?' + pc(['total = 0', 'for i in range(' + s + ', ' + e + ', ' + st + '):', '    total = total + i', 'print(total)']), answer: total, unit: '',
        why: 'range stops <i>before</i> ' + e + ', so i takes ' + vals.join(', ') + '. Their sum is ' + total + '.' };
    } },
    { skill: 'arrays-strings', gen: function () {
      var w = pick(WORDS), n = w[0].split('').filter(function (ch) { return ch === w[1]; }).length;
      return { kind: 'num', q: 'What is output by this algorithm?' + pc(['SET word TO "' + w[0] + '"', 'SET hits TO 0', 'FOR EACH letter FROM word DO', '   IF letter = "' + w[1] + '" THEN', '      SET hits TO hits + 1', '   END IF', 'END FOREACH', 'SEND hits TO DISPLAY']), answer: n, unit: '',
        why: 'The loop visits each letter of "' + w[0] + '" once and adds 1 for every "' + w[1] + '". There are ' + n + ' of them.' };
    } },
    { skill: 'subprogram-return', gen: function () {
      var h = rint(1, 7), r = rint(2, 6), cost = h > 3 ? 3 * r + (h - 3) * r * 2 : h * r;
      return { kind: 'num', q: 'What value is output?' + pc(['FUNCTION fee(hours, rate)', 'BEGIN FUNCTION', '   IF hours > 3 THEN', '      SET cost TO 3 * rate + (hours - 3) * rate * 2', '   ELSE', '      SET cost TO hours * rate', '   END IF', '   RETURN cost', 'END FUNCTION', '', 'SEND fee(' + h + ', ' + r + ') TO DISPLAY']), answer: cost, unit: '',
        why: h > 3 ? 'hours = ' + h + ' is more than 3, so cost = 3 × ' + r + ' + (' + h + ' − 3) × ' + r + ' × 2 = ' + (3 * r) + ' + ' + ((h - 3) * r * 2) + ' = ' + cost + '.' : 'hours = ' + h + ' is not more than 3, so cost = ' + h + ' × ' + r + ' = ' + cost + '.' };
    } },
    { skill: 'arithmetic-mod-div', gen: function () {
      var N = rint(20, 500), n = N, k = 0, seq = [N];
      while (n > 1) { n = Math.floor(n / 2); k++; seq.push(n); }
      return { kind: 'num', q: 'What does this Python program print?' + pc(['n = ' + N, 'halvings = 0', 'while n > 1:', '    n = n // 2', '    halvings = halvings + 1', 'print(halvings)']), answer: k, unit: '',
        why: '// is integer division, so n takes ' + seq.join(', ') + '. That is ' + k + ' halvings before n is no longer greater than 1.' };
    } },
    { skill: 'arrays-strings', gen: function () {
      var data = []; for (var i = 0; i < 5; i++) data.push(rint(3, 30));
      var k = rint(0, 4), v = data[k], res = v % 2 === 0 ? v / 2 : v * 3 + 1;
      return { kind: 'num', q: 'What is the value of data[' + k + '] when the loop has finished?' + pc(['SET data TO [' + data.join(', ') + ']', 'FOR i FROM 0 TO LENGTH(data) - 1 DO', '   IF data[i] MOD 2 = 0 THEN', '      SET data[i] TO data[i] DIV 2', '   ELSE', '      SET data[i] TO data[i] * 3 + 1', '   END IF', 'END FOR']), answer: res, unit: '',
        why: 'data[' + k + '] starts as ' + v + ' (indexes start at 0). ' + (v % 2 === 0 ? v + ' is even, so it becomes ' + v + ' DIV 2 = ' + res + '.' : v + ' is odd, so it becomes ' + v + ' × 3 + 1 = ' + res + '.') };
    } },
    { skill: 'loop-final-value', gen: function () {
      var r = []; for (var i = 0; i < 5; i++) r.push(rint(-12, 15));
      var low = Math.min.apply(null, r);
      return { kind: 'num', q: 'The inputs are ' + r.join(', ') + ' (in that order). What is output?' + pc(['RECEIVE lowest FROM (INTEGER) KEYBOARD', 'FOR k FROM 2 TO 5 DO', '   RECEIVE reading FROM (INTEGER) KEYBOARD', '   IF reading < lowest THEN', '      SET lowest TO reading', '   END IF', 'END FOR', 'SEND lowest TO DISPLAY']), answer: low, unit: '',
        why: 'lowest starts as the first input, ' + r[0] + ', and is replaced whenever a smaller reading arrives. The smallest of the five inputs is ' + low + '.' };
    } },
    { skill: 'arithmetic-mod-div', gen: function () {
      var s = [], sum = 0; for (var i = 0; i < 4; i++) { var v = rint(40, 95); s.push(v); sum += v; }
      var avg = sum / 4;
      return { kind: 'num', q: 'What does this Python program print?' + pc(['scores = [' + s.join(', ') + ']', 'total = 0', 'for s in scores:', '    total = total + s', 'average = total / len(scores)', 'print(average)']), answer: avg, unit: '', tol: 0.001, display: (avg % 1 === 0 ? avg + '.0' : String(R.roundDp(avg, 2))),
        why: 'total = ' + s.join(' + ') + ' = ' + sum + '. average = ' + sum + ' / 4 = ' + R.roundDp(avg, 2) + '. The / operator always gives a real (float) result, so Python prints ' + (avg % 1 === 0 ? avg + '.0' : String(R.roundDp(avg, 2))) + '.' };
    } },
    { skill: 'loop-final-value', gen: function () {
      var a = rint(2, 4), b = rint(2, 5), total = b * a * (a + 1) / 2;
      return { kind: 'num', q: 'What is the value of total when this algorithm finishes?' + pc(['SET total TO 0', 'FOR i FROM 1 TO ' + a + ' DO', '   FOR j FROM 1 TO ' + b + ' DO', '      SET total TO total + i', '   END FOR', 'END FOR']), answer: total, unit: '',
        why: 'For each value of i, the inner loop adds i ' + b + ' times. total = ' + b + ' × (' + Array.apply(null, Array(a)).map(function (_, i) { return i + 1; }).join(' + ') + ') = ' + total + '.' };
    } },
    { skill: 'flowchart-trace', gen: function () {
      var s = pick(SEL_SETS.slice(0, 2)), L = s === SEL_SETS[0] ? 25 : 18, yes = s[2].replace('Output ', '').replace(/"/g, ''), no = s[3].replace('Output ', '').replace(/"/g, '');
      var test = s === SEL_SETS[0] ? function (v) { return v > 25; } : function (v) { return v >= 18; };
      var ins = shuffle([L, L + rint(2, 9), L - rint(2, 9)]);
      var out = function (flip) { return ins.map(function (v, i) { var r = test(v); if (flip === i || flip === 'all') r = !r; return r ? yes : no; }).join(', '); };
      var bi = ins.indexOf(L), opts = [out(-1), out(bi), out('all'), out((bi + 1) % 3)];
      return { kind: 'mcq', q: 'The algorithm in the flowchart is run three times with the inputs ' + ins.join(', ') + '. Which outputs are produced, in order?', svg: selChart(s[0], s[1], s[2], s[3]), options: opts, answer: 0,
        why: 'Check each input against "' + esc(s[1]) + '". ' + ins.map(function (v) { return v + ' gives ' + (test(v) ? yes : no); }).join('; ') + '. Watch the boundary value ' + L + ' carefully.' };
    } },
    { skill: 'loop-final-value', gen: function () {
      var s = rint(2, 5), p = rint(2, 4), total = 0, parts = [];
      for (var i = s; i < s + p; i++) { total += i * i; parts.push(i + '×' + i); }
      return { kind: 'num', q: 'A trace table is drawn for this algorithm. What is the value of total after the loop body has run ' + p + ' times?' + pc(['SET total TO 0', 'SET i TO ' + s, 'WHILE i <= 9 DO', '   SET total TO total + i * i', '   SET i TO i + 1', 'END WHILE']), answer: total, unit: '',
        why: 'The first ' + p + ' passes add ' + parts.join(' + ') + ' = ' + total + '.' };
    } },
    { skill: 'output-text', gen: function () {
      var w = pick(REV_WORDS), rev = w.split('').reverse().join('');
      return { kind: 'mcq', q: 'What does this Python program print?' + pc(['word = "' + w + '"', 'result = ""', 'for ch in word:', '    result = ch + result', 'print(result)']),
        options: [rev, w, w.slice(1) + w[0], w[w.length - 1] + w.slice(0, -1)], answer: 0,
        why: 'Each letter is put in <i>front</i> of the result so far: "' + w[0] + '", then "' + w[1] + w[0] + '", and so on. The word ends up reversed: ' + rev + '.' };
    } },
    { skill: 'arithmetic-mod-div', gen: function () {
      var secs, m, r;
      do { secs = rint(130, 900); m = Math.floor(secs / 60); r = secs % 60; } while (r === 0 || r === 30 || r === m || r === m + 1 || 60 - r === m);
      return { kind: 'mcq', q: 'The input is ' + secs + '. What is output?' + pc(['RECEIVE secs FROM (INTEGER) KEYBOARD', 'SET mins TO secs DIV 60', 'SET rest TO secs MOD 60', 'SEND mins & ":" & rest TO DISPLAY']),
        options: [m + ':' + r, r + ':' + m, (m + 1) + ':' + r, m + ':' + (60 - r)], answer: 0,
        why: secs + ' DIV 60 = ' + m + ' (whole minutes) and ' + secs + ' MOD 60 = ' + r + ' (seconds left over), so ' + m + ':' + r + ' is output.' };
    } }
  ] };

  // =====================================================================
  // CSC-T1-02 Say what an algorithm (or one line) does
  // =====================================================================
  var REV_CODE = pc(['SET left TO 0', 'SET right TO LENGTH(items) - 1', 'WHILE left < right DO', '   SET hold TO items[left]', '   SET items[left] TO items[right]', '   SET items[right] TO hold', '   SET left TO left + 1', '   SET right TO right - 1', 'END WHILE'], true);
  var SEARCH_CODE = pc(['SET found TO FALSE', 'SET i TO 0', 'WHILE found = FALSE AND i < LENGTH(plates) DO', '   IF plates[i] = wanted THEN', '      SET found TO TRUE', '   ELSE', '      SET i TO i + 1', '   END IF', 'END WHILE', 'IF found = TRUE THEN', '   SEND "Position " & i TO DISPLAY', 'ELSE', '   SEND "Not listed" TO DISPLAY', 'END IF'], true);
  B['CSC-T1-02'] = { title: 'Say what an algorithm (or one line) does', items: [
    mc('overall-purpose', 'State the purpose of this algorithm, which works on an array called items.' + REV_CODE,
      ['It reverses the order of the items in the array', 'It sorts the items into ascending order by swapping pairs', 'It finds the largest item in the array', 'It counts how many items are in the array'], 0,
      'Dry-run with [1, 2, 3]: the first and last items swap, then the pointers move inwards. The result is [3, 2, 1], so the array is reversed.', { family: 'rev' }),
    mc('role-of-line', 'In this algorithm, explain why the variable <b>hold</b> is needed.' + REV_CODE,
      ['Line 05 overwrites items[left], so hold keeps its old value for line 06 to copy across', 'hold counts how many swaps have been made so far, so that the loop knows when it can stop', 'hold stores the length of the array so the loop knows where to end', 'hold is not needed; lines 05 and 06 would swap the values on their own'], 0,
      'Without a temporary variable, line 05 would overwrite items[left] and its old value would be lost, so both positions would end up holding the same value.', { family: 'rev' }),
    mc('role-of-line', 'In this algorithm, what would happen if lines 07 and 08 were removed?' + REV_CODE,
      ['left and right would never change, so the loop would never end', 'The algorithm would sort the array instead of reversing it', 'Only the first and last items would be swapped, and then the algorithm would stop', 'Nothing would change; the algorithm would still work'], 0,
      'Lines 07 and 08 move the two positions towards each other. Without them, left &lt; right stays True for ever: an infinite loop.', { family: 'rev' }),
    mc('overall-purpose', 'Describe the purpose of this algorithm, which uses an array of car registration plates.' + SEARCH_CODE,
      ['It searches for the wanted plate and outputs its position, or "Not listed" if it is absent', 'It sorts the plates into alphabetical order and then outputs the position of the first plate in the list', 'It counts how many plates match the wanted plate', 'It outputs every plate in the array with its position'], 0,
      'It checks the plates one by one until the wanted plate is found or the list runs out, then reports the position or says it is not listed. That is a linear search.', { family: 'search' }),
    mc('role-of-line', 'In this algorithm, what is the purpose of the variable <b>found</b>?' + SEARCH_CODE,
      ['It records whether the plate has been found, so the loop stops as soon as it is', 'It counts how many plates have been checked so far, so the position can be output at the end', 'It stores the plate that the user is looking for', 'It holds the length of the array of plates'], 0,
      'found starts as FALSE and becomes TRUE on a match. The WHILE condition then fails, so the search stops early instead of checking the rest of the plates.', { family: 'search' }),
    mc('overall-purpose', 'State the purpose of this algorithm.' + pc(['FOR i FROM LENGTH(names) - 1 TO 0 STEP -1 DO', '   SEND names[i] TO DISPLAY', 'END FOR']),
      ['It outputs the names from the last to the first', 'It outputs the names from the first to the last', 'It outputs only the last name in the array', 'It deletes the names one by one'], 0,
      'i starts at the last index, LENGTH(names) − 1, and goes down to 0 in steps of −1, so the names are displayed in reverse order.'),
    mc('redundant-line', 'Explain why line 05 of this algorithm is not required.' + pc(['IF speed > 70 THEN', '   SEND "Speeding" TO DISPLAY', 'ELSE', '   SEND "Within limit" TO DISPLAY', '   IF speed <= 70 THEN', '      SEND "Thank you" TO DISPLAY', '   END IF', 'END IF'], true),
      ['The ELSE branch only runs when speed is not over 70, so the test on line 05 is always True', 'Line 05 uses &lt;= and pseudocode does not allow that operator', 'Line 05 can never be reached because the first IF is always True', 'Line 05 should test whether speed is greater than 70 instead, because that is the case being handled'], 0,
      'An earlier test has already limited the values: inside ELSE, speed must be 70 or less. Testing it again changes nothing, so line 05 is redundant.'),
    mc('overall-purpose', 'State the purpose of this algorithm.' + pc(['RECEIVE n FROM (INTEGER) KEYBOARD', 'SET d TO 2', 'SET result TO TRUE', 'WHILE d < n AND result = TRUE DO', '   IF n MOD d = 0 THEN', '      SET result TO FALSE', '   END IF', '   SET d TO d + 1', 'END WHILE', 'SEND result TO DISPLAY']),
      ['It checks whether the number input is a prime number', 'It finds all of the factors of the number input', 'It counts how many numbers below n are even', 'It works out n divided by 2'], 0,
      'It tries each divisor from 2 upwards; any exact division sets result to FALSE. TRUE is only output when no divisor is found, which means n is prime.'),
    mc('overall-purpose', 'State the purpose of this algorithm.' + pc(['SET total TO 0', 'SET count TO 0', 'RECEIVE t FROM (REAL) KEYBOARD', 'WHILE t <> -999 DO', '   SET total TO total + t', '   SET count TO count + 1', '   RECEIVE t FROM (REAL) KEYBOARD', 'END WHILE', 'SEND total / count TO DISPLAY']),
      ['It works out and outputs the mean of the values entered before -999', 'It outputs the total of all of the values entered, including the final value of -999', 'It counts how many times -999 is entered', 'It outputs the largest value entered'], 0,
      'It adds up and counts every value until the stopping value -999, then divides the total by the count: that is the mean (average).'),
    mc('overall-purpose', 'State the purpose of this algorithm.' + pc(['REPEAT', '   SEND "Rate the film from 1 to 5" TO DISPLAY', '   RECEIVE stars FROM (INTEGER) KEYBOARD', 'UNTIL stars >= 1 AND stars <= 5']),
      ['It keeps asking for a rating until a whole number from 1 to 5 is entered', 'It asks for exactly five film ratings, one at a time, and then adds them all up', 'It outputs the rating with stars around it', 'It works out the average rating of a film'], 0,
      'The loop repeats while the input is outside 1 to 5 and only stops on a valid rating, so it is validating the input.'),
    mc('overall-purpose', 'State the purpose of this algorithm.' + pc(['SET sum TO 0', 'FOR EACH n FROM values DO', '   IF n MOD 2 = 0 THEN', '      SET sum TO sum + n', '   END IF', 'END FOREACH', 'SEND sum TO DISPLAY']),
      ['It outputs the total of the even numbers in the array', 'It outputs how many even numbers are in the array', 'It outputs the total of every number in the array', 'It outputs the odd numbers in the array'], 0,
      'Only numbers that leave remainder 0 when divided by 2 (even numbers) are added to sum, and sum is output at the end.'),
    mc('overall-purpose', 'State the purpose of this Python program.' + pc(['text = input("Enter a word: ").lower()', 'backwards = ""', 'for ch in text:', '    backwards = ch + backwards', 'if text == backwards:', '    print("Yes")', 'else:', '    print("No")']),
      ['It checks whether the word reads the same backwards as forwards', 'It reverses the word that was entered and then prints out the reversed version of it', 'It counts the letters in the word', 'It converts the word to capital letters'], 0,
      'The loop puts each letter in front of the ones before, so backwards holds the word reversed. "Yes" is printed only when the word equals its reverse, so it checks for a palindrome.'),
    mu('describe-well', 'Which <b>two</b> statements together give the best 2-mark description of this algorithm\'s purpose?' + pc(['SET frosty TO 0', 'FOR EACH t FROM nightTemps DO', '   IF t < 0 THEN', '      SET frosty TO frosty + 1', '   END IF', 'END FOREACH', 'SEND frosty TO DISPLAY']),
      ['It counts how many night temperatures were below zero', 'It then outputs that number of frosty nights', 'It sets frosty to 0 and then starts a FOR EACH loop', 'It finds the coldest night temperature', 'It checks if t is less than 0'], [0, 1],
      'A Describe answer names the job and then a linked point about what it produces. Retelling individual lines does not describe the purpose.'),
    mc('role-of-line', 'Explain why line 01 sets <b>highest</b> to temps[0] rather than to 0.' + pc(['SET highest TO temps[0]', 'FOR EACH t FROM temps DO', '   IF t > highest THEN', '      SET highest TO t', '   END IF', 'END FOREACH'], true),
      ['Starting from a real value in the data works even if every temperature is negative', 'temps[0] is always the largest value, so no more checks are needed', 'Setting a variable to 0 is not allowed in pseudocode', 'It makes the loop skip the first temperature, because that value has already been stored in highest'], 0,
      'If highest started at 0 and all the temperatures were below zero, none would be greater than 0 and the wrong answer, 0, would be output.'),
    mc('role-of-line', 'In an algorithm that works out the average of the marks entered, what is the job of the line ' + c('SET count TO count + 1') + ' inside the loop?',
      ['It counts how many marks have been entered so the total can be divided by it', 'It adds the latest mark to the running total so that the total is ready to be output at the end', 'It moves to the next mark in a sorted list', 'It stops the loop when the last mark is entered'], 0,
      'The average is total ÷ number of marks, so the algorithm needs to know how many marks there were. Each pass adds one to count.'),
    mc('overall-purpose', 'State the purpose of this function.' + pc(['FUNCTION check(year)', 'BEGIN FUNCTION', '   IF (year MOD 4 = 0 AND year MOD 100 <> 0) OR year MOD 400 = 0 THEN', '      RETURN TRUE', '   ELSE', '      RETURN FALSE', '   END IF', 'END FUNCTION']),
      ['It returns TRUE if the year is a leap year and FALSE if it is not', 'It returns the number of days in the year', 'It outputs every leap year since year 0', 'It returns the year divided by 4'], 0,
      'The conditions are the leap-year rules: divisible by 4 but not 100, or divisible by 400. The function returns a Boolean result for the year passed in.'),
    mc('role-of-line', 'In a program, what does the test ' + c('IF number MOD 2 = 0 THEN') + ' check?',
      ['Whether number is even', 'Whether number is a multiple of 10', 'Whether number is 0', 'Whether number is less than 2'], 0,
      'MOD 2 gives the remainder after dividing by 2. A remainder of 0 means the number divides exactly by 2, so it is even.'),
    mc('describe-well', 'An algorithm sets a variable called lowest to the first price in a list, loops through the prices and finally outputs lowest. An exam asks: "State the purpose of the algorithm." Which answer would earn the mark?',
      ['It finds the cheapest price in the list and outputs it', 'It sets lowest to the first price, then loops through the prices and compares each one', 'It uses a FOR loop and an IF statement', 'It has a variable called lowest that changes'], 0,
      'The purpose is the job done for the user, said in one sentence. Retelling the lines or naming constructs does not state what the algorithm achieves.'),
    mc('redundant-line', 'Explain why line 03 is not required.' + pc(['SET count TO 10', 'WHILE count > 0 DO', '   IF count > 0 THEN', '      SEND count TO DISPLAY', '   END IF', '   SET count TO count - 1', 'END WHILE'], true),
      ['The loop body only runs while count is above 0, so the test on line 03 is always True', 'Line 03 stops the loop too early, so only the first number, 10, is ever sent to the display', 'count can never be above 0, so line 04 never runs', 'IF statements are not allowed inside WHILE loops'], 0,
      'The WHILE condition has already checked count &gt; 0 before each pass, so testing it again inside the loop makes no difference.'),
    mc('role-of-line', 'In an algorithm that adds up the digits of a number, what does the line ' + c('SET num TO num DIV 10') + ' do?',
      ['It removes the last digit so the next digit can be processed', 'It finds the last digit of the number', 'It multiplies the number by 10', 'It rounds the number to the nearest 10'], 0,
      'DIV gives the whole-number part of a division, so 472 DIV 10 = 47. The last digit is dropped and the loop can deal with the next one.'),
    mc('overall-purpose', 'State the purpose of this Python program.' + pc(['sentence = input("Enter a sentence: ")', 'gaps = 0', 'for ch in sentence:', '    if ch == " ":', '        gaps = gaps + 1', 'print(gaps + 1)']),
      ['It counts the words in a sentence, assuming single spaces between words', 'It counts every character in the sentence, including the spaces, and adds 1 to the result', 'It removes the spaces from the sentence', 'It prints the sentence one letter per line'], 0,
      'It counts the spaces and adds 1, because a sentence with single spaces has one more word than it has spaces.'),
    mc('overall-purpose', 'State the purpose of this procedure.' + pc(['PROCEDURE border(width)', 'BEGIN PROCEDURE', '   SET line TO ""', '   FOR k FROM 1 TO width DO', '      SET line TO line & "*"', '   END FOR', '   SEND line TO DISPLAY', 'END PROCEDURE']),
      ['It outputs a single line made of width stars', 'It outputs width lines of one star each', 'It returns the number of stars in a line', 'It draws a square of stars width by width'], 0,
      'The loop joins one "*" to line width times, and the finished line is sent to the display once, so it prints one row of stars.'),
    mc('overall-purpose', 'State the purpose of this algorithm.' + pc(['SET spent TO 0', 'SET bought TO 0', 'SET i TO 0', 'WHILE i < LENGTH(prices) AND spent + prices[i] <= budget DO', '   SET spent TO spent + prices[i]', '   SET bought TO bought + 1', '   SET i TO i + 1', 'END WHILE', 'SEND bought TO DISPLAY']),
      ['It works out how many items, in list order, can be bought without going over the budget', 'It works out the total price of every item in the list', 'It finds the single most expensive item in the list whose price still fits inside the budget', 'It sorts the prices so the cheapest are bought first'], 0,
      'Items are added in order while the running total stays within budget. The output is how many items were bought before the next one would go over.')
  ] };

  // =====================================================================
  // CSC-T1-04 Find and fix errors in an algorithm
  // =====================================================================
  B['CSC-T1-04'] = { title: 'Find and fix errors in an algorithm', items: [
    { skill: 'locate-line', gen: function () {
      var L = rint(20, 40), arr = []; for (var i = 0; i < 6; i++) arr.push(rint(5, 60));
      var exp = arr.filter(function (v) { return v > L; }).length; if (exp < 2) { arr[0] = L + 7; arr[1] = L + 12; exp = arr.filter(function (v) { return v > L; }).length; }
      var lines = ['SET readings TO [' + arr.join(', ') + ']', 'SET count TO 0', 'FOR index FROM 0 TO LENGTH(readings) - 1 DO', '   IF readings[index] > ' + L + ' THEN', '      SET count TO 1', '   END IF', 'END FOR', 'SEND "Readings over limit: " & count TO DISPLAY'];
      return { kind: 'mcq', q: 'This algorithm should count the readings greater than ' + L + '. The expected output is ' + exp + ' but the actual output is 1. Which line contains the error?' + pc(lines, true),
        options: lineOpts(5, 8), answer: 0, why: 'Line 5 replaces count with 1 every time instead of adding 1 to it. It should be ' + c('SET count TO count + 1') + '.' };
    } },
    mc('correct-line', 'This algorithm should add up the prices in a café order, but it outputs only the last price. Which is the correct replacement for line 03?' + pc(['SET total TO 0', 'FOR EACH price FROM order DO', '   SET total TO price', 'END FOREACH', 'SEND total TO DISPLAY'], true),
      [c('SET total TO total + price'), c('SET price TO total + price'), c('SET total TO total + 1'), c('SET total + price TO total')], 0,
      'A running total must keep its old value and add the new price. Line 03 replaces total with each price, so only the last one is left.'),
    { skill: 'explain-effect', gen: function () {
      var s = []; for (var i = 0; i < 5; i++) s.push(rint(20, 95));
      var last = s[s.length - 1], out = last >= 50 ? 1 : 0, exp = s.filter(function (v) { return v >= 50; }).length;
      return { kind: 'num', q: 'This algorithm should count the scores of 50 or more, but line 03 is in the wrong place. What does the faulty algorithm actually output?' + pc(['SET scores TO [' + s.join(', ') + ']', 'FOR EACH score FROM scores DO', '   SET passes TO 0', '   IF score >= 50 THEN', '      SET passes TO passes + 1', '   END IF', 'END FOREACH', 'SEND passes TO DISPLAY'], true), answer: out, unit: '',
        why: 'passes is reset to 0 at the start of every pass, so only the last score counts. The last score is ' + last + ', so the output is ' + out + ' (the correct count is ' + exp + '). Line 03 should be before the loop.' };
    } },
    mc('correct-line', 'This algorithm crashes with an index error after printing every name. Which is the correct replacement for line 02?' + pc(['SET index TO 0', 'WHILE index <= LENGTH(names) DO', '   SEND names[index] TO DISPLAY', '   SET index TO index + 1', 'END WHILE'], true),
      [c('WHILE index < LENGTH(names) DO'), c('WHILE index <= LENGTH(names) + 1 DO'), c('WHILE index > LENGTH(names) DO'), c('WHILE index = LENGTH(names) DO')], 0,
      'Indexes start at 0, so the last valid index is LENGTH(names) − 1. With &lt;=, the loop tries to read names[LENGTH(names)], which does not exist.'),
    { skill: 'explain-effect', gen: function () {
      var v = []; for (var i = 0; i < rint(3, 5); i++) v.push(rint(3, 40));
      var sum = v.reduce(function (a, b) { return a + b; }, 0);
      return { kind: 'num', q: 'The inputs are ' + v.join(', ') + ', -1. The -1 means "stop". What does this faulty algorithm output?' + pc(['SET total TO 0', 'REPEAT', '   RECEIVE value FROM (INTEGER) KEYBOARD', '   SET total TO total + value', 'UNTIL value = -1', 'SEND total TO DISPLAY'], true), answer: sum - 1, unit: '',
        why: 'The loop adds each value before checking for -1, so the stopping value is added too: ' + v.join(' + ') + ' + (−1) = ' + (sum - 1) + ' instead of ' + sum + '.' };
    } },
    { skill: 'test-data', gen: function () {
      var T = pick([30, 40, 50, 60, 75]);
      return { kind: 'mcq', q: 'Orders of $' + T + ' or more get free delivery. The algorithm uses ' + c('IF total > ' + T + ' THEN') + '. Which test value would show the error?',
        options: ['$' + T, '$' + (T - 1), '$' + (T + 25), '$' + (T - 20)], answer: 0,
        why: 'An order of exactly $' + T + ' should get free delivery, but ' + T + ' &gt; ' + T + ' is False. Boundary values reveal off-by-one errors; the other values give the right result either way.' };
    } },
    { skill: 'correct-line', gen: function () {
      var A = pick([12, 13, 16, 17, 18]);
      return { kind: 'mcq', q: 'Visitors aged ' + A + ' or over may ride alone. The line ' + c('IF age > ' + A + ' THEN') + ' wrongly refuses ' + A + '-year-olds. Which line corrects it?',
        options: [c('IF age >= ' + A + ' THEN'), c('IF age < ' + A + ' THEN'), c('IF age > ' + (A + 1) + ' THEN'), c('IF age = ' + A + ' THEN')], answer: 0,
        why: '"' + A + ' or over" includes ' + A + ', so the test must be &gt;= ' + A + '. Testing = ' + A + ' would refuse everyone older.' };
    } },
    mc('explain-effect', 'This algorithm should output the total of the bills, but it outputs 4 for every list of four bills. Why?' + pc(['SET total TO 0', 'SET count TO 0', 'FOR EACH bill FROM bills DO', '   SET total TO total + bill', '   SET count TO count + 1', 'END FOREACH', 'SEND count TO DISPLAY'], true),
      ['Line 07 outputs count, the number of bills, instead of total', 'Line 04 adds 1 instead of the bill to the total', 'Line 01 should set total to 4', 'The loop on line 03 only runs once'], 0,
      'The total is calculated correctly but never output. Line 07 should be ' + c('SEND total TO DISPLAY') + '.'),
    mc('correct-line', 'This search crashes when the code is not in the list. Construct a single line to replace line 03.' + pc(['SET found TO FALSE', 'SET index TO 0', 'WHILE found = FALSE DO', '   IF codes[index] = target THEN', '      SET found TO TRUE', '   ELSE', '      SET index TO index + 1', '   END IF', 'END WHILE'], true),
      [c('WHILE found = FALSE AND index < LENGTH(codes) DO'), c('WHILE found = FALSE OR index < LENGTH(codes) DO'), c('WHILE found = FALSE AND index <= LENGTH(codes) DO'), c('WHILE found = TRUE AND index < LENGTH(codes) DO')], 0,
      'The loop needs two stop conditions joined by AND: not found yet, and index still inside the array. With OR, or with &lt;=, it can still read past the end.'),
    mc('correct-line', 'This algorithm should find the highest of a week of winter temperatures, which are all below zero. It outputs 0. Which line should replace line 01?' + pc(['SET highest TO 0', 'FOR EACH t FROM temps DO', '   IF t > highest THEN', '      SET highest TO t', '   END IF', 'END FOREACH', 'SEND highest TO DISPLAY'], true),
      [c('SET highest TO temps[0]'), c('SET highest TO 1'), c('SET highest TO LENGTH(temps)'), c('SET highest TO t')], 0,
      'No negative temperature is greater than 0, so highest never changes. Starting with the first temperature makes the comparison work for any values.'),
    { skill: 'explain-effect', gen: function () {
      var x = rint(10, 40), y = rint(41, 90);
      var f = function (a, b) { return 'first = ' + a + ', second = ' + b; };
      return { kind: 'mcq', q: 'These lines are meant to swap the values of first (' + x + ') and second (' + y + '). What values do they actually hold afterwards?' + pc(['SET first TO ' + x, 'SET second TO ' + y, 'SET first TO second', 'SET second TO first'], true),
        options: [f(y, y), f(y, x), f(x, x), f(x, y)], answer: 0,
        why: 'Line 3 copies ' + y + ' into first, so the old value ' + x + ' is lost. Line 4 then copies ' + y + ' back into second. A temporary variable is needed to hold ' + x + '.' };
    } },
    mc('explain-effect', 'What happens when this algorithm runs?' + pc(['SET i TO 0', 'WHILE i < LENGTH(names) DO', '   SEND names[i] TO DISPLAY', 'END WHILE'], true),
      ['It displays the first name over and over, because i is never increased', 'It displays every name once and then stops', 'It displays nothing, because the condition is False at the start', 'It crashes immediately with an index error'], 0,
      'i stays at 0, so i &lt; LENGTH(names) is always True: an infinite loop. ' + c('SET i TO i + 1') + ' is needed inside the loop.'),
    { skill: 'explain-effect', gen: function () {
      var a = []; for (var i = 0; i < 5; i++) a.push(rint(4, 30));
      var sum = a.reduce(function (p, q) { return p + q; }, 0);
      return { kind: 'num', q: 'This algorithm should total every value in the array. What does the faulty version output?' + pc(['SET sales TO [' + a.join(', ') + ']', 'SET total TO 0', 'FOR i FROM 1 TO LENGTH(sales) - 1 DO', '   SET total TO total + sales[i]', 'END FOR', 'SEND total TO DISPLAY'], true), answer: sum - a[0], unit: '',
        why: 'The loop starts at index 1, so sales[0] = ' + a[0] + ' is never added: ' + a.slice(1).join(' + ') + ' = ' + (sum - a[0]) + ' instead of ' + sum + '. The loop should start at 0.' };
    } },
    mc('correct-line', 'Hours outside 0 to 23 should be rejected, but this line never rejects anything. Which line corrects it?' + pc(['IF hour < 0 AND hour > 23 THEN', '   SEND "Invalid hour" TO DISPLAY', 'END IF']),
      [c('IF hour < 0 OR hour > 23 THEN'), c('IF hour > 0 AND hour < 23 THEN'), c('IF hour <= 0 AND hour >= 23 THEN'), c('IF hour < 0 AND hour < 23 THEN')], 0,
      'No number can be below 0 and above 23 at the same time, so the AND test is never True. An invalid hour is one that is below 0 OR above 23.'),
    { skill: 'explain-effect', gen: function () {
      var a = sample([14, 22, 29, 35, 41, 48, 53, 67, 72, 86], 5), low = Math.min.apply(null, a), high = Math.max.apply(null, a);
      return { kind: 'num', q: 'This algorithm should output the largest value. What does the faulty version actually output?' + pc(['SET marks TO [' + a.join(', ') + ']', 'SET best TO marks[0]', 'FOR EACH m FROM marks DO', '   IF m < best THEN', '      SET best TO m', '   END IF', 'END FOREACH', 'SEND best TO DISPLAY'], true), answer: low, unit: '',
        why: 'Line 4 uses &lt;, so best is replaced by every <i>smaller</i> value and the algorithm finds the smallest, ' + low + ', instead of the largest, ' + high + '. It should be &gt;.' };
    } },
    mc('locate-line', 'A guessing game should keep asking until the guess is correct, but it stops after the first <i>wrong</i> guess. Give the line that contains the error.' + pc(['SET secret TO 7', 'REPEAT', '   RECEIVE guess FROM (INTEGER) KEYBOARD', '   SEND "Try again" TO DISPLAY', 'UNTIL guess <> secret', 'SEND "Well done" TO DISPLAY'], true),
      ['Line 5', 'Line 2', 'Line 3', 'Line 1'], 0,
      'UNTIL gives the stopping condition. ' + c('guess <> secret') + ' stops on a wrong guess; it should be ' + c('UNTIL guess = secret') + '.'),
    mc('correct-line', 'Line 02 should reduce a price by 20%, but the result is negative. Which line corrects it?' + pc(['RECEIVE price FROM (REAL) KEYBOARD', 'SET price TO price - price * 20', 'SEND price TO DISPLAY'], true),
      [c('SET price TO price - price * 0.2'), c('SET price TO price * 20'), c('SET price TO price - 20'), c('SET price TO price - price / 0.2')], 0,
      '20% is 0.2 as a decimal. Multiplying by 20 takes away twenty times the price. Subtracting 20 only works for a price of exactly $100.'),
    { skill: 'locate-line', gen: function () {
      var n = rint(7, 12), extra = rint(0, 1);
      var lines = ['RECEIVE table FROM (INTEGER) KEYBOARD'].concat(extra ? ['SEND "Times table:" TO DISPLAY'] : []).concat(['FOR row FROM 0 TO ' + n + ' DO', '   SEND row & " x " & table & " = " & row * table TO DISPLAY', 'END FOR']);
      var bad = 2 + extra;
      return { kind: 'mcq', q: 'This algorithm should display ' + n + ' lines, from 1 × the table to ' + n + ' × the table. It displays ' + (n + 1) + ' lines instead. Give the line that contains the error.' + pc(lines, true),
        options: lineOpts(bad, lines.length).length >= 4 ? lineOpts(bad, lines.length) : ['Line ' + bad, 'Line 1', 'Line ' + (bad + 1), 'Line ' + (bad + 2)], answer: 0,
        why: 'Line ' + bad + ' starts the count at 0, so an extra line "0 x ..." is displayed. It should be ' + c('FOR row FROM 1 TO ' + n + ' DO') + '.' };
    } },
    mu('test-data', 'Ages 13 to 19 inclusive count as teenagers. The algorithm uses ' + c('IF age > 13 AND age < 19 THEN') + '. Which test ages would reveal the error?',
      ['13', '19', '15', '20', '10'], [0, 1],
      'Only the boundary values 13 and 19 are treated wrongly: both should be teenagers but fail the test. 15, 20 and 10 give the correct result with either version.'),
    mc('explain-effect', 'An algorithm should count the orders over $100 but always outputs 1 when there is at least one. Which explanation would earn both marks?',
      ['The counting line sets count to 1 instead of adding 1, so the count can never go above 1', 'The answer is wrong because the count that is output is wrong', 'The array of orders is too long for the loop to finish', 'The count should start at 1 instead of 0, so it starts higher'], 0,
      'A two-mark explanation gives the cause in the processing and then its linked effect on the output. "The count is wrong" only restates the symptom.'),
    mc('correct-line', 'A flowchart should keep asking for a password until it is correct, then display "Welcome". The decision "password correct?" has its <b>Yes</b> arrow looping back to the input and its <b>No</b> arrow going to "Welcome". What is the correction?',
      ['Swap the labels: No loops back to the input and Yes goes to "Welcome"', 'Add a second decision box with the same question', 'Move the Stop terminator before the input box', 'Change the input box into a process box'], 0,
      'A correct password should end the loop, so Yes must lead on to "Welcome" and No must loop back for another attempt.'),
    mc('correct-line', 'This algorithm should count down from 10 to 1, but it displays nothing. Which line should replace line 01?' + pc(['FOR n FROM 10 TO 1 STEP 1 DO', '   SEND n TO DISPLAY', 'END FOR'], true),
      [c('FOR n FROM 10 TO 1 STEP -1 DO'), c('FOR n FROM 1 TO 10 STEP 1 DO'), c('FOR n FROM 10 TO 0 STEP 1 DO'), c('FOR n FROM 10 TO 1 STEP 2 DO')], 0,
      'Counting from 10 down to 1 needs a negative step. With STEP 1 the counter would have to go up from 10 to reach 1, which it never can. Counting 1 to 10 gives the numbers in the wrong order.'),
    { skill: 'locate-line', gen: function () {
      var a = []; for (var i = 0; i < 6; i++) a.push(rint(1, 40));
      var extra = rint(0, 1);
      var lines = ['SET nums TO [' + a.join(', ') + ']'].concat(extra ? ['SEND "Counting even numbers" TO DISPLAY'] : []).concat(['SET evens TO 0', 'FOR EACH n FROM nums DO', '   IF n MOD 2 = 1 THEN', '      SET evens TO evens + 1', '   END IF', 'END FOREACH', 'SEND evens TO DISPLAY']);
      var bad = 4 + extra;
      return { kind: 'mcq', q: 'This algorithm should count the even numbers, but it counts the odd ones. Which line contains the error?' + pc(lines, true),
        options: lineOpts(bad, lines.length), answer: 0,
        why: 'Line ' + bad + ' tests for remainder 1, which picks out odd numbers. It should be ' + c('IF n MOD 2 = 0 THEN') + '.' };
    } }
  ] };

  // =====================================================================
  // CSC-T1-13 Decomposition and abstraction
  // =====================================================================
  B['CSC-T1-13'] = { title: 'Decomposition and abstraction', items: [
    mc('define', 'Which statement describes <b>abstraction</b>?',
      ['Leaving out details that do not matter so the important parts can be focused on', 'Breaking a large problem into smaller sub-problems that are easier to solve', 'Checking an algorithm by hand using a table of variable values', 'Converting a program from a high-level language into machine code'], 0,
      'Abstraction hides or removes unneeded detail. Breaking a problem into parts is decomposition, a common distractor.'),
    mc('define', 'Which statement describes <b>decomposition</b>?',
      ['Breaking a problem down into smaller sub-problems that can each be solved separately', 'Removing details from a problem that are not needed to solve it', 'Using a pre-written library routine without knowing how it works', 'Making a program run faster by reducing the number of comparisons'], 0,
      'Decomposition splits one big problem into smaller parts, each of which can be solved, coded and tested on its own.'),
    mc('define', 'Decomposition and abstraction are both part of which set of problem-solving skills?',
      ['Computational thinking', 'Encryption', 'Data compression', 'Validation'], 0,
      'Computational thinking is the set of skills used to analyse problems and design solutions; decomposition and abstraction are two of them.'),
    mc('spot-in-scenario', 'Before coding a quiz app, Tariq writes these comments: ' + pc(['# load the questions from a file', '# ask each question in turn', '# update the score', '# show the final score']) + 'Why is this an example of decomposition?',
      ['Each comment is a smaller sub-task of the whole program that can be coded on its own', 'The comments hide how the quiz works from the user, so only the important details are shown', 'The comments make the program run faster', 'Comments are ignored by the translator, so they remove detail'], 0,
      'Splitting the app into four smaller tasks, each named by a comment, is decomposition. Each part can then be written and tested separately.'),
    mc('spot-in-scenario', 'Mei uses ' + c('math.sqrt(x)') + ' to find a square root in her program without knowing how the square root is calculated. Which technique is she benefiting from?',
      ['Abstraction', 'Decomposition', 'Validation', 'Iteration'], 0,
      'The detail of how the square root is worked out is hidden inside the library routine. Mei only needs to know what it returns: that is abstraction.'),
    mc('spot-in-scenario', 'A bus network map shows the stops and the order of the routes, but not the real roads, buildings or distances. Which technique is this an example of?',
      ['Abstraction', 'Decomposition', 'Encryption', 'Sorting'], 0,
      'Details that do not help a passenger (exact roads and distances) are left out so the important information is clear. That is abstraction.'),
    mc('abstraction-model', 'A racing game models each car\'s speed, position and fuel level, but not the colour of the driver\'s gloves. Why is this abstraction?',
      ['Only the features the game needs are kept; details that do not affect the race are left out', 'The game is split into separate levels, and each level is coded and tested one at a time by the team', 'The cars are stored in an array with an index for each one', 'The game uses a loop to update the cars many times a second'], 0,
      'A model is an abstraction because it keeps only the details that matter for its purpose and leaves the rest out.'),
    mc('spot-in-scenario', 'A school website is split into login, timetable and messaging sections, and each section is given to a different programmer. Which technique is being used?',
      ['Decomposition', 'Abstraction', 'Encryption', 'Compression'], 0,
      'The big problem (the website) has been broken into smaller parts that can be built and tested separately, which is decomposition.'),
    mc('explain-link', 'A programmer calls ' + c('statistics.median(results)') + ' to find a median. Which answer best explains why this is an example of abstraction?',
      ['The programmer uses the value it returns without needing to know how the median is worked out inside it', 'The function finds the middle value in a list of results', 'The function splits the results into two halves and sorts them', 'Library functions are always faster and more accurate than any code that a programmer could write themselves'], 0,
      'A good answer gives the meaning (hiding detail) and links it to the scenario (the median calculation is hidden inside the library routine). Saying what the function does is not enough.'),
    mc('explain-link', 'Asked to explain why planning comments are decomposition, a student writes only "Decomposition is breaking a problem down." What should be added to earn the second mark?',
      ['A link to the scenario: each comment is one smaller part of the task that can be coded separately', 'A second definition, of abstraction', 'The number of comments that were written', 'A statement that comments are ignored when the program runs'], 0,
      'Two-mark explain answers need the meaning of the term plus its link to the scenario. A definition alone only earns one mark.'),
    mu('benefit', 'Which of these are benefits of decomposing a large programming problem?',
      ['Each smaller part can be tested on its own', 'Different programmers can work on different parts at the same time', 'Each smaller part is easier to understand and solve', 'The finished program is guaranteed to have no errors', 'The program will always use less memory'], [0, 1, 2],
      'Smaller parts are easier to solve, can be shared out and can be tested separately. Decomposition does not guarantee error-free code or less memory use.'),
    mc('abstraction-model', 'A simulation of a lift in an office block is being designed. Which detail should be <b>left out</b> as part of abstraction?',
      ['The colour of the lift walls', 'The number of floors in the building', 'How many people the lift can carry', 'How long the lift takes to move between floors'], 0,
      'The wall colour has no effect on how the lift moves or how long people wait, so leaving it out simplifies the model without losing anything important.'),
    mu('abstraction-model', 'A model of traffic at a road junction is being built. Which details should be <b>kept</b>?',
      ['How many cars arrive each minute', 'How long each traffic light stays green', 'The brand of each car', 'The names of the drivers', 'The music playing in each car'], [0, 1],
      'Arrival rates and light timings affect the queues the model is meant to study. Car brands, names and music do not, so abstraction removes them.'),
    mc('define', 'A student writes: "Abstraction is breaking a problem into smaller parts." What is wrong with this answer?',
      ['It describes decomposition, not abstraction', 'It describes encryption, not abstraction', 'It is correct; the two words mean the same thing', 'Abstraction only applies to hardware, not to problems'], 0,
      'The two definitions are often swapped. Breaking into parts is decomposition; abstraction is removing or hiding unnecessary detail.'),
    mc('spot-in-scenario', 'A teacher plans a school sports day as a tree diagram: "Sports day" splits into "Events", "Equipment" and "Results", and "Events" splits into "Track" and "Field". Which technique does this show?',
      ['Decomposition', 'Abstraction', 'Validation', 'Selection'], 0,
      'Each level breaks a task into smaller sub-tasks until each one is simple enough to deal with. That is decomposition.'),
    mu('spot-in-scenario', 'Which of these show <b>abstraction</b>?',
      ['A railway diagram that shows stations in order but ignores real distances', 'A sat-nav screen that shows roads but not individual trees', 'Using ' + c('print()') + ' without knowing how the screen draws each letter', 'Splitting an essay plan into introduction, three sections and conclusion', 'Dividing a game project into graphics, sound and scoring tasks'], [0, 1, 2],
      'The first three hide or leave out detail that is not needed. Splitting an essay or a project into parts is decomposition.'),
    mu('spot-in-scenario', 'Which of these show <b>decomposition</b>?',
      ['Breaking a payroll program into "read hours", "calculate pay" and "print payslip"', 'Splitting a robot\'s task into "find object", "pick up" and "deliver"', 'A weather app showing only temperature and rain, not air pressure', 'Calling a library function to sort a list without seeing its code', 'Writing one comment for each part of a game before coding it'], [0, 1, 4],
      'Splitting a job into smaller tasks (payroll steps, robot steps, planning comments) is decomposition. Showing only some data and hiding library code are abstraction.'),
    mc('explain-link', 'Which answer best explains why using planning comments before coding is a type of decomposition?',
      ['The whole task is split into smaller sub-tasks, and each comment names one that can be coded and tested on its own', 'Comments make the code much easier for other programmers to read and maintain later on, after the program is finished', 'Comments are not translated, so the program takes up less memory', 'Comments hide the details of the code from the user of the program'], 0,
      'Give the meaning of decomposition and link it to the comments: each comment marks one smaller part of the problem.'),
    mc('benefit', 'How does abstraction help a programmer solve a problem?',
      ['By removing details that do not matter, the problem becomes simpler to understand and solve', 'By making sure that every single detail of the real world is included in the program, so nothing is ever missed', 'By guaranteeing that the program contains no logic errors', 'By splitting the program into exactly two halves'], 0,
      'Ignoring irrelevant detail lets the programmer concentrate on what actually affects the solution, which makes the problem easier to handle.'),
    mc('benefit', 'After decomposition, what should each sub-problem ideally be?',
      ['Small and focused enough to be solved, coded and tested on its own', 'As large as possible so there are fewer parts to manage', 'Written in a different programming language from the others', 'Hidden from the rest of the team so no one else changes it'], 0,
      'The point of decomposition is to reach parts that are each simple enough to understand and test independently.'),
    mc('abstraction-model', 'A flight simulator for training pilots models wind speed, engine power and altitude, but not what the passengers are eating. This is an example of which technique?',
      ['Abstraction', 'Decomposition', 'Iteration', 'Encryption'], 0,
      'The simulator keeps the details that affect flying and drops the rest. Choosing which real-world details to model is abstraction.'),
    mc('spot-in-scenario', 'A team building a recipe app lists three jobs: "search for recipes", "scale the quantities" and "make a shopping list". Which technique have they used?',
      ['Decomposition', 'Abstraction', 'Compression', 'Iteration'], 0,
      'Listing the separate jobs the app must do breaks the big problem into sub-problems, which is decomposition.')
  ] };

  // =====================================================================
  // CSC-T4-14 Simulations and models: why we use them and their limits
  // =====================================================================
  B['CSC-T4-14'] = { title: 'Simulations and models: why we use them and their limits', items: [
    mc('benefit', 'Engineers simulate a new bridge in hurricane-force winds before it is built. Which is a reason, other than cost, for using a simulation?',
      ['Dangerous conditions can be tested without putting anyone at risk', 'The results of a simulation are always perfectly accurate', 'A simulation needs no data about the bridge or the wind, so no measurements have to be taken', 'A simulation needs almost no processing power'], 0,
      'Testing a real bridge in a hurricane would be dangerous and could not be arranged on demand. A simulation lets engineers see what would happen safely.'),
    mc('benefit', 'A city council\'s simulation lets planners change the number of buses on a route and watch what happens to waiting times. Which benefit does this show?',
      ['Variables can be changed to answer "what if" questions', 'Simulations remove the need to collect any real data', 'The simulation can predict the future with certainty', 'Buses no longer need timetables'], 0,
      'Changing a variable (the number of buses) and seeing the effect lets planners compare options before making real changes.'),
    mc('benefit', 'A climate model runs 100 years of predicted weather in a few hours. Which benefit of simulations does this show?',
      ['A simulation can run faster than real time, so long-term trends are seen quickly', 'A simulation can only show events that have already happened', 'Running faster than real time always makes the results more accurate than real observations', 'It shows that simulations do not need a processor'], 0,
      'Time in a simulation can be sped up, so effects that would take decades in real life can be studied quickly.'),
    mc('limitation', 'Which statement describes a problem with relying on a simulation to make a decision?',
      ['The results are only as good as the data and assumptions it uses, so they may be wrong', 'Simulations can never be run more than once', 'Simulations always take longer to set up and run than simply doing the real experiment would take', 'A simulation cannot include any numbers'], 0,
      'A simulation follows rules and data written by people. If a rule or a data value is wrong, the predictions will be wrong too.'),
    mc('limitation', 'A simulation of a shopping centre leaves out bad weather and school holidays. What is the likely consequence?',
      ['Its predictions of visitor numbers may be inaccurate, because real factors have been left out', 'It will run more slowly because it has less to calculate', 'It will be more accurate, because a simpler model has fewer rules and so fewer places for mistakes to hide', 'It will need more memory than a full model'], 0,
      'Every model simplifies reality. If factors that really affect visitor numbers are missing, the predictions will not match what actually happens.'),
    mc('processor-demand', 'Explain one reason why a simulation may need a powerful processor.',
      ['It carries out a very large number of calculations on lots of data, so a fast processor gives results in a reasonable time', 'It is a big program, so it needs a big processor', 'Simulations are stored on the processor itself instead of on a hard disk, so a larger and more powerful processor is needed to hold them all', 'A powerful processor makes the simulation more accurate'], 0,
      'The point needs a linked reason: many calculations on large amounts of data take a long time, and a faster processor completes them sooner. "It is big" earns nothing.'),
    mu('linked-explanation', 'Which <b>two</b> statements together make a linked 2-mark explanation of a benefit of simulating how a disease spreads?',
      ['The infection rate can be changed in the simulation', 'so health officials can see how different measures might affect the number of cases', 'Simulations can be shown on a large screen', 'The simulation is written in a programming language', 'A simulation is always cheaper than a real study'], [0, 1],
      'A linked explanation gives one point and then its consequence in the scenario. Two unrelated statements do not earn both marks.'),
    mc('linked-explanation', 'A student explains a benefit of a flood simulation: "It is safe. It is quick." Why might this earn only one mark?',
      ['The two points are not linked; a second mark needs an expansion of the first point', 'Safety is never a benefit of a simulation', 'The answer is too long for a 2-mark question', 'Simulations of floods are not possible'], 0,
      'Mark schemes give the second mark for developing a point (for example "safe, so engineers can test a dam failing without anyone being hurt"), not for a second separate point.'),
    mc('model-vs-simulation', 'What is the difference between a <b>model</b> and a <b>simulation</b>?',
      ['A model is a set of rules and data representing a system; a simulation runs the model to see what happens over time', 'A model is always a physical object built by hand, while a simulation is always a computer program that runs on a processor', 'A model can only use real data; a simulation can only use made-up data', 'There is no difference; the words mean exactly the same'], 0,
      'The model describes the system (its rules and data). Running it step by step to see how the system behaves is the simulation.'),
    mc('limitation', 'A town planner uses a simulation to predict traffic after closing a road. Which is the strongest reason the prediction might be wrong?',
      ['Drivers may not behave in the way the simulation assumes, so real traffic may differ', 'The simulation will have run too quickly to be accurate', 'Simulations cannot handle numbers bigger than 100, so the traffic counts on busy roads will be cut off and lost', 'The planner might use a laptop instead of a desktop computer'], 0,
      'Real people are hard to model. If the assumptions about how drivers react are wrong, the predicted traffic will be wrong.'),
    mc('benefit', 'A science teacher uses a simulation to show an explosive reaction to a class. What is the main benefit?',
      ['Students can see the reaction without the danger of carrying it out', 'The simulation will be identical in every detail to the real reaction', 'Students no longer need to learn how the reaction works', 'The reaction happens more slowly in real life than in the simulation'], 0,
      'Some experiments are too dangerous to do in a classroom. A simulation lets learners see the outcome safely.'),
    mc('benefit', 'Astronomers simulate two galaxies colliding. Why can this only be studied with a simulation?',
      ['The event cannot be carried out in real life and takes millions of years', 'Galaxies are too small to observe with telescopes', 'Simulations of space are always more accurate than real observations made through telescopes', 'It is cheaper to buy a computer than a telescope'], 0,
      'Simulations let people investigate situations that are impossible to create or that happen over far too long a time to watch.'),
    mc('limitation', 'Which statement about simulations is <b>false</b>?',
      ['A simulation always gives completely accurate results', 'A simulation can be used to test a hypothesis', 'A simulation can be run many times with different values', 'A simulation is based on rules and data'], 0,
      'Simulations are simplified models of reality and depend on their data and assumptions, so their results can be inaccurate.'),
    mc('processor-demand', 'A flight simulator for pilot training must redraw a detailed 3D view many times every second. Why does this need powerful hardware?',
      ['Complex graphics and movement must be recalculated many times a second for the view to respond in real time', 'The simulator stores every flight on the processor', 'Powerful hardware makes the simulator look realistic on its own, even if no calculations are carried out at all for each frame', 'Pilots need the screen to be as large as possible'], 0,
      'Each frame needs many calculations (movement, collisions and graphics). Doing them fast enough for real-time responses needs a powerful processor.'),
    mc('benefit', 'A shop runs a queue simulation 500 times, each with slightly different random arrival times. What is the benefit of running it many times?',
      ['It shows the range of likely outcomes rather than a single guess', 'It makes every run give exactly the same result', 'It removes the need for any data about customers', 'It means the shop no longer needs any staff'], 0,
      'Repeating a simulation with varied inputs shows how much the outcome can vary, which gives a better basis for decisions.'),
    mc('limitation', 'Why is it hard to make an accurate simulation of how shoppers will react to a new store layout?',
      ['Human behaviour is complex and hard to turn into exact rules', 'Computers cannot store information about shops', 'Simulations can only model machines, not people', 'Store layouts are always the same, so there is nothing to simulate'], 0,
      'People make choices for many reasons. Any rules written to represent them are simplifications, so the simulation may not match reality.'),
    mc('benefit', 'Which of these is the <b>most</b> suitable use of a computer simulation?',
      ['Predicting how a flood would spread through a town if a river wall failed', 'Counting the number of pupils who are present in a classroom today at registration time', 'Finding the sum of five prices on a receipt', 'Looking up a friend\'s phone number'], 0,
      'Simulations suit situations that are dangerous, costly or impossible to try for real. The other tasks can simply be done or looked up.'),
    mc('processor-demand', 'Which answer gives the best developed explanation of why a weather-forecasting simulation needs a powerful processor?',
      ['It processes huge amounts of data from many weather stations, so millions of calculations must be done before the forecast is out of date', 'It is used by a lot of people every day', 'Weather is complicated', 'Forecasts are shown on television and websites'], 0,
      'The best answer links the cause (huge data, many calculations) to the need (results in time to be useful). The others are vague or unrelated.'),
    mc('linked-explanation', 'An exam asks for one benefit of a population simulation "other than it being safer than field studies". Which answer could earn the marks?',
      ['Variables such as the birth rate can be changed, so different future scenarios can be compared', 'It means researchers do not have to put themselves in danger by going out into the wild to study animals', 'It is less risky than studying the animals in the wild', 'Nobody can be harmed while the simulation runs'], 0,
      'The other three options all repeat the benefit already given (safety). The answer must make a different point, and develop it.'),
    mc('limitation', 'A pandemic simulation assumes each infected person passes the disease to 2 others, but the real figure is 3. Which is the best developed explanation of the problem?',
      ['The input assumption is wrong, so the simulation will underestimate the cases and decisions based on it could be wrong', 'The simulation will run more slowly than expected', 'The simulation will crash because 3 is not allowed', 'The simulation will become more accurate over time on its own'], 0,
      'A simulation is only as good as its assumptions. A wrong infection rate leads to wrong predictions, and decisions based on them may be poor.'),
    mc('benefit', 'An exam question asks for a reason that scientists use simulations, but says the reason must not be about cost. Which answer would <b>not</b> be accepted?',
      ['It saves money on equipment and materials', 'Experiments that are dangerous in real life can be run', 'Outcomes can be predicted before a decision is made', 'A hypothesis can be investigated'], 0,
      '"Saves money" is a cost reason, which the question rules out. The other three are valid reasons.'),
    mc('model-vs-simulation', 'In a simulation of supermarket checkouts, which of these is a variable the manager could change to ask "what if"?',
      ['The number of checkouts that are open', 'The fact that customers queue to pay', 'The fact that each checkout serves one customer at a time', 'The name of the supermarket'], 0,
      'The number of open checkouts can be altered to see the effect on queue lengths. The other items are fixed features of the model or irrelevant.')
  ] };

  // =====================================================================
  // CSC-T1-05 Make an algorithm faster or work for any amount of data
  // =====================================================================
  var SHIP_A = pc(['IF weight < 2 THEN', '   SEND "Small parcel rate" TO DISPLAY', 'ELSE', '   IF weight < 10 THEN', '      SEND "Medium parcel rate" TO DISPLAY', '   ELSE', '      SEND "Large parcel rate" TO DISPLAY', '   END IF', 'END IF']);
  var SHIP_B = pc(['IF weight < 2 THEN', '   SEND "Small parcel rate" TO DISPLAY', 'END IF', 'IF weight >= 2 AND weight < 10 THEN', '   SEND "Medium parcel rate" TO DISPLAY', 'END IF', 'IF weight >= 10 THEN', '   SEND "Large parcel rate" TO DISPLAY', 'END IF']);
  B['CSC-T1-05'] = { title: 'Make an algorithm faster or work for any amount of data', items: [
    { skill: 'count-comparisons', family: 'ship', gen: function () {
      var w = pick([R.roundDp(rint(2, 19) / 10, 1), rint(3, 9), rint(11, 30)]), a = w < 2 ? 1 : 2;
      var f = function (x, y) { return 'Version A: ' + x + ', Version B: ' + y; };
      return { kind: 'mcq', q: 'Two versions of a parcel-pricing algorithm are shown. For a weight of ' + w + ' kg, how many IF statements does each version test?<br><b>Version A</b>' + SHIP_A + '<b>Version B</b>' + SHIP_B,
        options: [f(a, 3), f(3, 3), f(a, 1), f(3, a)], answer: 0,
        why: 'Version A uses nested IF ... ELSE, so it stops testing once a condition is True: ' + (a === 1 ? weightWhy(w, 1) : weightWhy(w, 2)) + ' Version B has three separate IF statements, so all three are always tested.' };
    } },
    mc('nested-vs-separate', 'Explain why nested IF ... ELSE statements can be more efficient than a list of separate IF statements.',
      ['Once one condition is True the remaining tests are skipped, so fewer comparisons are made', 'Nested IF statements always use fewer lines of code than separate IFs, so they must always run faster', 'Separate IF statements cannot use comparison operators', 'Nested IF statements are tested in a random order'], 0,
      'With separate IFs every condition is tested every time. With nested IF ... ELSE, testing stops at the first True condition, so fewer comparisons are carried out.', { family: 'ship' }),
    mc('judge-efficiency', 'Algorithm P has 6 lines and Algorithm Q has 9 lines. A student says P must be more efficient. Why might the student be wrong?',
      ['Efficiency depends on how many operations are carried out, not on how many lines there are', 'Longer algorithms are always more efficient', 'Efficiency can only be judged by running the code on two different computers and timing them with a stopwatch', 'Algorithms with more lines always use less memory'], 0,
      'A short algorithm with a loop could carry out far more comparisons than a longer one that stops early. Count the operations, not the lines.'),
    { skill: 'hard-coding', gen: function () {
      var n = rint(5, 9), p = []; for (var i = 0; i < n; i++) p.push(rint(2, 30));
      var extra = rint(0, 2);
      var lines = ['SET prices TO [' + p.join(', ') + ']'].concat(['SEND "Calculating total" TO DISPLAY', 'SET count TO 0'].slice(0, extra)).concat(['SET total TO 0', 'FOR index FROM 0 TO ' + (n - 1) + ' DO', '   SET total TO total + prices[index]', 'END FOR', 'SEND total TO DISPLAY']);
      var bad = 3 + extra;
      return { kind: 'mcq', q: 'Which line would need to be changed so that this algorithm works for <b>any</b> number of prices?' + pc(lines, true),
        options: lineOpts(bad, lines.length), answer: 0,
        why: 'Line ' + bad + ' has the fixed value ' + (n - 1) + ' written into it, which only suits exactly ' + n + ' prices. It should use ' + c('LENGTH(prices) - 1') + ' instead. The array line itself can hold any number of values.' };
    } },
    mc('hard-coding', 'A loop is written as ' + c('FOR index FROM 0 TO 6 DO') + ' to process an array of 7 scores. Which replacement makes it work for any number of scores?',
      [c('FOR index FROM 0 TO LENGTH(scores) - 1 DO'), c('FOR index FROM 0 TO LENGTH(scores) DO'), c('FOR index FROM 1 TO LENGTH(scores) DO'), c('FOR index FROM 0 TO 7 DO')], 0,
      'LENGTH(scores) gives the number of items, and indexes run from 0 to LENGTH − 1. Using LENGTH alone would read one place past the end.'),
    mc('array-generality', 'This algorithm adds five test scores held in separate variables:' + pc(['SET total TO s1 + s2 + s3 + s4 + s5']) + 'Which improvement would reduce the number of variables and work for any number of scores?',
      ['Store the scores in one array and add them up with a loop that runs LENGTH(scores) times', 'Add a sixth variable, s6, in case another score is needed', 'Use nested IF statements to check each score', 'Make s1 to s5 into constants so that the scores cannot be changed accidentally while the program runs'], 0,
      'An array keeps every score under one name. A loop over the array then works whatever its length, so no code changes are needed when more scores are added.'),
    mc('array-generality', 'Why does storing values in an array reduce the number of variables an algorithm needs?',
      ['Many values are stored under one name and reached by an index, so one loop can process them all', 'Arrays automatically sort their values as they are stored, so fewer comparisons and variables are needed', 'Each value in an array takes up no memory', 'Arrays can only hold two values, which keeps algorithms short'], 0,
      'One array name replaces many separate variables, and an index lets a single loop visit every value in turn.'),
    { skill: 'early-exit', gen: function () {
      var n = rint(10, 30), p = rint(2, n - 3);
      return { kind: 'num', q: 'A list holds ' + n + ' codes and the target is the ' + ordinal(p) + ' item. Version A checks every item with a FOR loop. Version B uses a WHILE loop that stops as soon as the target is found. How many fewer comparisons does Version B make?', answer: n - p, unit: '',
        why: 'Version A always makes ' + n + ' comparisons. Version B stops after the ' + ordinal(p) + ' comparison. ' + n + ' − ' + p + ' = ' + (n - p) + ' fewer comparisons.' };
    } },
    { skill: 'count-comparisons', gen: function () {
      var A = rint(70, 80), Bm = rint(58, 66), C = rint(40, 50), mark = pick([rint(A, 99), rint(Bm, A - 1), rint(C, Bm - 1), rint(5, C - 1)]);
      var k = mark >= A ? 1 : mark >= Bm ? 2 : 3;
      return { kind: 'num', q: 'How many comparisons does this algorithm make for a mark of ' + mark + '?' + pc(['IF mark >= ' + A + ' THEN', '   SET grade TO "A"', 'ELSE', '   IF mark >= ' + Bm + ' THEN', '      SET grade TO "B"', '   ELSE', '      IF mark >= ' + C + ' THEN', '         SET grade TO "C"', '      ELSE', '         SET grade TO "U"', '      END IF', '   END IF', 'END IF']), answer: k, unit: '',
        why: (k === 1 ? mark + ' &gt;= ' + A + ' is True at once, so only 1 comparison is made.' : k === 2 ? mark + ' &gt;= ' + A + ' is False, then ' + mark + ' &gt;= ' + Bm + ' is True: 2 comparisons.' : 'The first two tests are False, so the third test is made whatever its answer: 3 comparisons. The final ELSE needs no comparison.') };
    } },
    { skill: 'judge-efficiency', gen: function () {
      var n = rint(50, 400);
      return { kind: 'mcq', q: 'To find 1 + 2 + … + ' + n + ', Algorithm X uses a loop that adds each number to a total. Algorithm Y calculates ' + c('n * (n + 1) / 2') + ' once. Which is more efficient, and why?',
        options: ['Y, because it uses one calculation instead of ' + n + ' additions', 'X, because loops are always faster than formulas', 'X, because it has fewer lines of code than Y', 'They are equally efficient because both give ' + (n * (n + 1) / 2)], answer: 0,
        why: 'Both give the same answer, but X carries out ' + n + ' additions while Y does a fixed, small number of operations, so Y does the job in far fewer steps.' };
    } },
    mc('hard-coding', 'An algorithm averages a week of temperatures using ' + c('SET average TO total / 7') + '. How should it be changed so it works for any number of temperatures?',
      ['Divide by LENGTH(temps) instead of 7', 'Divide by 8 to allow for one extra day', 'Multiply the total by 7 instead', 'Use a constant called DAYS set to 7'], 0,
      'LENGTH(temps) always matches the number of values in the array. A constant set to 7 is still a fixed value and would break for other amounts of data.'),
    mc('judge-efficiency', 'To reverse an array, Method 1 copies every item into a second array in reverse order. Method 2 swaps items in place using one temporary variable. Which uses less memory?',
      ['Method 2, because it only needs one extra variable', 'Method 1, because copying is faster than swapping', 'Both use the same memory because the data is the same', 'Method 1, because the second array is deleted at the end'], 0,
      'Efficiency includes memory. A second array doubles the storage needed; swapping in place needs just one extra variable.'),
    mc('array-generality', 'An algorithm is supposed to work for any number of items. Which test would best check this?',
      ['Run it on arrays of different lengths, including one with a single item', 'Run it twice on the same array of eight items', 'Count the number of lines in the algorithm', 'Check that every variable has a meaningful name'], 0,
      'Generality means the algorithm still works when the amount of data changes, so test it with different amounts, including small and edge cases.'),
    mc('hard-coding', 'A register program has ' + c('SET classSize TO 30') + ' and loops 30 times. What problem does this hard-coding cause?',
      ['A class with a different number of students is processed wrongly unless the code is rewritten', 'The program will run more slowly than it would with LENGTH, because the number 30 has to be looked up each time', 'The value 30 cannot be stored in a variable', 'Nothing; classes always have 30 students'], 0,
      'A fixed number only suits one amount of data. With 28 students the loop reads past the end; with 32, two students are missed.'),
    mc('count-comparisons', 'In a warehouse, 90% of parcels are "Standard", 8% "Heavy" and 2% "Oversize". The nested IF tests can be put in any order. Which order makes the fewest comparisons in total?',
      ['Test for Standard first, then Heavy', 'Test for Oversize first, then Heavy', 'Test for Heavy first, then Oversize', 'The order makes no difference to the number of comparisons'], 0,
      'With nested IF ... ELSE, the first test that is True ends the checking. Putting the most common case first means 90% of parcels need only one comparison.'),
    mu('judge-efficiency', 'Which of these changes would make an algorithm more efficient?',
      ['Stopping a search loop as soon as the item is found', 'Using nested IF ... ELSE instead of separate IFs for cases that cannot overlap', 'Adding comments to explain each line', 'Renaming variables to make them more meaningful', 'Adding a second loop that prints the list again'], [0, 1],
      'Efficiency is about doing fewer operations (or using less memory). Comments and names help readability but do not change the steps carried out; an extra loop adds work.'),
    mu('array-generality', 'Which of these changes would help an algorithm work for <b>any</b> amount of data?',
      ['Replacing a fixed count in a loop with LENGTH(array)', 'Storing the values in an array and processing them with a loop', 'Using nested IF ... ELSE instead of separate IFs', 'Adding a constant MAX set to 8 and using it in the loop'], [0, 1],
      'LENGTH and arrays adapt to the size of the data. A constant set to 8 is still a fixed size, and nested IFs affect efficiency, not generality.'),
    { skill: 'count-comparisons', family: 'ship', gen: function () {
      var lo = rint(10, 30) * 10, mid = rint(10, 25) * 10, hi = rint(5, 20) * 10, nested = lo + 2 * mid + 2 * hi;
      return { kind: 'num', q: 'In one day, ' + (lo + mid + hi) + ' parcels are priced with the nested algorithm below: ' + lo + ' small, ' + mid + ' medium and ' + hi + ' large. How many IF conditions are tested in total?' + SHIP_A, answer: nested, unit: '',
        why: 'Small parcels need 1 test; medium and large parcels need 2. Total = ' + lo + ' × 1 + ' + mid + ' × 2 + ' + hi + ' × 2 = ' + nested + '. Three separate IFs would test ' + (3 * (lo + mid + hi)) + '.' };
    } },
    mc('early-exit', 'Why is a WHILE loop with a <b>found</b> flag usually more efficient than a FOR loop for searching a list?',
      ['It can stop as soon as the item is found instead of always checking every item', 'WHILE loops check two items in each comparison', 'FOR loops can only search lists that have already been sorted into order, so they need an extra sort first', 'A found flag makes each comparison faster'], 0,
      'A FOR loop runs a fixed number of times. A condition-controlled loop that also tests found ends early, saving the remaining comparisons.'),
    mc('hard-coding', 'A loop is written as ' + c('WHILE index < 12 DO') + ' to display an array of 12 names. Which line should replace it so it works for any number of names?',
      [c('WHILE index < LENGTH(names) DO'), c('WHILE index <= LENGTH(names) DO'), c('WHILE index < 13 DO'), c('WHILE index > LENGTH(names) DO')], 0,
      'Indexes run from 0 to LENGTH − 1, so the loop continues while index is less than LENGTH(names). &lt;= would read past the end.'),
    mc('hard-coding', 'Why is ' + c('LENGTH(items)') + ' better than a fixed number in a loop condition?',
      ['It always matches the current number of items, even if the array grows or shrinks', 'It makes the loop run a few more times than needed, which is safer in case extra items are added later', 'It sorts the items before the loop starts', 'It can only be used with arrays of exactly 10 items'], 0,
      'LENGTH is worked out from the data each time, so the same code works for any size of array without being edited.'),
    mc('early-exit', 'Two algorithms check whether a list contains any negative number. Version A counts every negative number and then checks whether the count is above 0. Version B stops at the first negative number. For a list whose <b>first</b> item is negative, which is more efficient?',
      ['Version B, because it stops after one comparison', 'Version A, because counting is more accurate', 'Both are the same, because both look at every item', 'Version A, because it uses fewer variables'], 0,
      'Version A must look at every item to finish counting. Version B has its answer after the very first item, so it carries out far fewer comparisons.')
  ] };

  function weightWhy(w, k) { return k === 1 ? w + ' &lt; 2 is True on the first test, so 1 IF is tested.' : w + ' &lt; 2 is False, so the second IF is tested: 2 in total.'; }
  function ordinal(n) { var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
})();
