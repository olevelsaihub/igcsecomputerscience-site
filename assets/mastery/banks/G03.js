/* Group G03 mastery bank: Reading code: constructs, named items, errors and test data; Strings, validation checks and readable code; Rare extras: Vigenere cipher. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function C(s) { return '<code>' + esc(s) + '</code>'; }
  // Numbered listing: line numbers start at 1 and blank lines are counted.
  function L(lines) { return '<pre>' + lines.map(function (l, i) { return (i + 1 < 10 ? ' ' : '') + (i + 1) + '  ' + esc(l); }).join('\n') + '</pre>'; }
  // Plain listing without numbers.
  function P(lines) { return '<pre>' + lines.map(esc).join('\n') + '</pre>'; }
  // Picks n distinct items from a.
  function some(a, n) { return shuffle(a).slice(0, n); }

  /* ======================================================================
     CSC-T2-08 Syntax, logic and runtime errors
     ====================================================================== */
  var ERR3 = ['Syntax error', 'Logic error', 'Runtime error'];
  function err(q, k, why) { return { kind: 'mcq', q: q, options: ERR3.slice(), answer: k, why: why }; }
  var ERRDESC = {
    syntax: ['The keyword <code>while</code> has been typed as <code>whlie</code>.', 'A closing bracket is missing from the end of a <code>print</code> statement.', 'The colon has been left off the end of an <code>if</code> line.', 'A string is opened with a quotation mark that is never closed.'],
    logic: ['The program uses <code>&gt;</code> where <code>&gt;=</code> was needed, so a mark of exactly 40 is treated as a fail.', 'The mean of three numbers is found by dividing their total by 2.', 'A discount is added to the price instead of being taken away.', 'A loop shows the numbers 1 to 9 when it should show 1 to 10.'],
    runtime: ['The program divides a total by a counter that holds 0.', 'The program reads item 8 of a list that holds only 5 items.', 'The program tries to open a file that does not exist.', 'The user types <code>ten</code> and the program tries to convert it with <code>int()</code>.']
  };
  B['CSC-T2-08'] = { title: 'Syntax, logic and runtime errors', items: [
    { skill: 'define', kind: 'mcq', q: 'Which statement best describes a <b>syntax error</b>?',
      options: ['The code breaks the grammar rules of the language, so it cannot be translated', 'The program runs to the end but gives an incorrect or unexpected result', 'The program stops part-way through because an instruction cannot be carried out', 'The program runs correctly but takes far longer than expected to finish'],
      answer: 0, why: 'A syntax error breaks a rule of the language (a missing colon, a misspelt keyword), so the translator rejects it and the program cannot start.' },
    { skill: 'define', kind: 'mcq', q: 'Which statement best describes a <b>logic error</b>?',
      options: ['The program runs but produces an incorrect or unintended output', 'The program will not translate because a keyword is spelt wrongly', 'The program crashes because it tries to read past the end of a list', 'The program cannot start because the translator finds a missing bracket'],
      answer: 0, why: 'In a logic error every line is valid code, so the program runs, but the instructions are not the right ones and the result is wrong.' },
    { skill: 'define', kind: 'mcq', q: 'Which statement about a <b>runtime error</b> is correct?',
      options: ['The program stops unexpectedly because an instruction is impossible to carry out', 'It is found by the translator before the first line of the program runs', 'The program finishes normally but the output it shows is not what was wanted', 'It is caused by breaking the grammar rules of the programming language'],
      answer: 0, why: 'A runtime error only shows up while the program is running: an instruction such as dividing by zero cannot be done, so the program crashes.' },
    { skill: 'define', kind: 'mcq', q: 'A student defines a runtime error as "an error that happens at runtime". Why would an examiner give no mark?',
      options: ['It only repeats the words of the term without saying the program crashes or stops unexpectedly', 'It should have said that the program will not translate into machine code', 'A definition must always include an example such as dividing by zero', 'Runtime errors happen while the code is being translated, not while it runs'],
      answer: 0, why: 'A definition must add meaning beyond the question words. The key idea is that the program stops unexpectedly because an instruction cannot be carried out.' },
    { skill: 'define', kind: 'mcq', q: 'Why can the translator not find a <b>logic</b> error?',
      options: ['The code obeys all the rules of the language, so nothing looks wrong to the translator', 'Logic errors only happen in programs that read data from a file', 'The translator stops at the first syntax error and never reaches the logic', 'Logic errors are removed automatically when the code is translated'],
      answer: 0, why: 'A translator only checks that the code follows the language rules. A wrong formula or wrong comparison is still valid code, so only testing reveals it.' },
    { skill: 'classify-code', kind: 'mcq', q: 'This Python line is meant to multiply two values:' + P(['total = price x quantity']) + 'What type of error does it contain?',
      options: ERR3.slice(), answer: 0, why: 'Python uses <code>*</code> for multiplication. <code>x</code> between two names breaks the language rules, so the line cannot be translated: a syntax error.' },
    { skill: 'classify-code', kind: 'mcq', q: 'A program contains these lines. When asked for the number of tickets, the user types <code>7.5</code>.' + P(['tickets = int(input("Number of tickets: "))', 'cost = tickets * 12']) + 'What type of error happens?',
      options: ERR3.slice(), answer: 2, why: 'The code is valid, but <code>int()</code> cannot turn the text 7.5 into a whole number, so the program crashes while it is running: a runtime error.' },
    { skill: 'classify-code', kind: 'mcq', q: 'A pass mark is 50 or more. The program contains:' + P(['if score > 50:', '    print("Pass")']) + 'A student scoring exactly 50 is not told they have passed. What type of error is this?',
      options: ERR3.slice(), answer: 1, why: 'The code runs without crashing, but <code>&gt;</code> should be <code>&gt;=</code>, so the output for 50 is wrong: a logic error.' },
    { skill: 'classify-code', kind: 'mcq', q: 'What type of error does this line contain?' + P(['whlie count < 10:']),
      options: ERR3.slice(), answer: 0, why: 'The keyword <code>while</code> is misspelt, which breaks the grammar of Python, so the program will not translate: a syntax error.' },
    { skill: 'classify-code', kind: 'mcq', q: 'What type of error happens when this program runs?' + P(['colours = ["red", "green", "blue"]', 'print(colours[3])']),
      options: ERR3.slice(), answer: 2, why: 'The list has indexes 0, 1 and 2 only. Asking for index 3 cannot be done, so the program crashes while running: a runtime error.' },
    { skill: 'classify-code', kind: 'mcq', q: 'This function should return the area of a rectangle:' + P(['def area(length, width):', '    return length + width']) + 'What type of error does it contain?',
      options: ERR3.slice(), answer: 1, why: 'The code is valid and runs, but it adds instead of multiplying, so the answer is wrong: a logic error.' },
    { skill: 'classify-code', kind: 'mcq', q: 'What type of error happens when this line runs?' + P(['print("Age next year: " + 15)']),
      options: ERR3.slice(), answer: 2, why: 'The line follows the grammar rules, but joining a string to an integer is an operation on incompatible types, so Python stops with an error while running: a runtime error.' },
    { skill: 'classify-code', kind: 'mcq', q: 'What type of error does this line contain?' + P(['if level = 3:']),
      options: ERR3.slice(), answer: 0, why: 'In Python a comparison needs <code>==</code>. A single <code>=</code> inside an <code>if</code> condition breaks the language rules, so the program cannot be translated: a syntax error.' },
    { skill: 'classify-code', kind: 'mcq', q: 'A program opens a file like this, but <code>prices.txt</code> has been deleted:' + P(['priceFile = open("prices.txt", "r")']) + 'What type of error happens?',
      options: ERR3.slice(), answer: 2, why: 'The instruction is valid code, but the file cannot be found while the program is running, so it crashes: a runtime error.' },
    { skill: 'symptom', gen: function () {
      var n = rint(3, 12), right = n * 60, wrong = n + 60;
      return err('A program should output the number of seconds in ' + n + ' minutes. It runs to the end with no error message, but it outputs ' + wrong + ' instead of ' + right + '. Which type of error does it contain?', 1,
        'The program ran to the end, so there is no syntax or runtime error. The output is wrong (it added 60 instead of multiplying by 60), which is a logic error.');
    } },
    { skill: 'symptom', kind: 'mcq', q: 'When a programmer tries to run a program, an error message appears and not even the first line is executed. What type of error is most likely?',
      options: ERR3.slice(), answer: 0, why: 'If the program cannot start at all, the translator has rejected it because the code breaks a language rule: a syntax error.' },
    { skill: 'symptom', kind: 'mcq', q: 'A program asks for two inputs and shows some results, then suddenly stops with an error message half-way through. What type of error is this?',
      options: ERR3.slice(), answer: 2, why: 'The program started and ran some lines, then crashed because an instruction could not be carried out: a runtime error.' },
    { skill: 'symptom', gen: function () {
      var a = rint(12, 40), b = rint(2, 9);
      return err('A program should output <code>' + a + ' - ' + b + '</code>, which is ' + (a - b) + '. It actually outputs ' + (b - a) + ' and finishes normally. Name the type of error.', 1,
        'The program finished normally, so the code is valid and did not crash. It subtracted the wrong way round (' + b + ' - ' + a + ' = ' + (b - a) + '), giving the wrong output: a logic error.');
    } },
    { skill: 'example', kind: 'multi', q: 'Which of these are examples of <b>runtime</b> errors?',
      options: ['Dividing a number by zero', 'Reading an index that is outside the range of an array', 'Opening a file that does not exist', 'Leaving the colon off the end of a <code>for</code> line', 'Using <code>&lt;</code> where <code>&lt;=</code> was needed'],
      answers: [0, 1, 2], why: 'Division by zero, an index out of range and a missing file all crash a running program. A missing colon is a syntax error; a wrong comparison is a logic error.' },
    { skill: 'example', kind: 'multi', q: 'Which of these are examples of <b>logic</b> errors?',
      options: ['Adding VAT to a price when it should be subtracted', 'A loop that runs one time too few', 'Misspelling the keyword <code>else</code> as <code>esle</code>', 'Converting the text <code>abc</code> to an integer with <code>int()</code>', 'Using the variable <code>height</code> where <code>width</code> was needed'],
      answers: [0, 1, 4], why: 'These three run without crashing but give wrong results. A misspelt keyword is a syntax error, and converting <code>abc</code> with <code>int()</code> crashes, so it is a runtime error.' },
    { skill: 'example', kind: 'mcq', q: 'Which of these is an example of a <b>syntax</b> error?',
      options: ['Leaving the closing bracket off <code>print("Done"</code>', 'Dividing a running total by a count of zero', 'Adding 1 to a counter when 2 should be added', 'Reading the 6th item of a list that holds only 4 items'],
      answer: 0, why: 'A missing bracket breaks the grammar of Python, so the program cannot be translated. The others are runtime or logic errors.' },
    { skill: 'example', gen: function () {
      var rows = ['syntax', 'logic', 'runtime'];
      var d = { syntax: pick(ERRDESC.syntax), logic: pick(ERRDESC.logic), runtime: pick(ERRDESC.runtime) };
      var order = shuffle(rows), labels = ['P', 'Q', 'R'];
      var name = { syntax: 'syntax', logic: 'logic', runtime: 'runtime' };
      var perms = [['syntax', 'logic', 'runtime'], ['syntax', 'runtime', 'logic'], ['logic', 'syntax', 'runtime'], ['logic', 'runtime', 'syntax'], ['runtime', 'syntax', 'logic'], ['runtime', 'logic', 'syntax']];
      var correctKey = order.join(',');
      var others = shuffle(perms.filter(function (p) { return p.join(',') !== correctKey; })).slice(0, 3);
      var all = [order].concat(others);
      var options = all.map(function (p) { return 'P ' + name[p[0]] + ', Q ' + name[p[1]] + ', R ' + name[p[2]]; });
      var table = '<table class="mc-table"><tr><th>Fault</th><th>Description</th></tr>' + order.map(function (k, i) { return '<tr><td>' + labels[i] + '</td><td>' + d[k] + '</td></tr>'; }).join('') + '</table>';
      return { kind: 'mcq', q: 'A program has three faults, P, Q and R.' + table + 'Which matches each fault to the correct type of error?', options: options, answer: 0,
        why: 'Ask of each fault: does it break a language rule (syntax), crash while running (runtime), or run but give a wrong result (logic)? Here P is ' + name[order[0]] + ', Q is ' + name[order[1]] + ' and R is ' + name[order[2]] + '.' };
    } },
    { skill: 'classify-code', gen: function () {
      var bill = rint(30, 180), crash = Math.random() < 0.5, g = rint(2, 6);
      var q = 'This program splits a restaurant bill between guests.' + P(['bill = ' + bill, 'guests = int(input("Guests: "))', crash ? 'share = bill / guests' : 'share = bill * guests', 'print(share)']) +
        (crash ? 'The user enters 0. What type of error happens?' : 'The user enters ' + g + ' and the program outputs ' + (bill * g) + '. What type of error does the program contain?');
      return err(q, crash ? 2 : 1, crash ? 'Dividing by zero cannot be carried out, so the running program crashes: a runtime error.' :
        'The program ran normally but multiplied instead of dividing (' + bill + ' * ' + g + ' = ' + (bill * g) + '), so the output is wrong: a logic error.');
    } }
  ] };

  /* ======================================================================
     CSC-T2-13 Spot constructs, operators, keywords and comments
     ====================================================================== */
  var CINEMA = ['# Works out the price of a cinema ticket', 'age = int(input("Enter your age: "))', 'price = 9.50', 'if age < 12 or age >= 65:', '    price = price - 3.00', 'print("Price:", price)'];
  var PUNCT = ['def countMarks(sentence):', '    marks = [".", ",", "!", "?"]', '    found = 0', '    for symbol in sentence:', '        if symbol in marks:', '            found = found + 1', '    return found', '', '# Main program', 'line = input("Type a sentence: ")', 'print(countMarks(line))'];
  var GUESS = ['SET tries TO 0', 'SET solved TO False', 'WHILE tries < 3 AND solved = False DO', '    RECEIVE guess FROM (STRING) KEYBOARD', '    IF guess = "otter" THEN', '        SET solved TO True', '    END IF', '    SET tries TO tries + 1', 'END WHILE'];
  function lineQ(code, family, ask, ans, opts, why) {
    return { skill: 'line-find', family: family, kind: 'mcq', q: 'Study this code.' + L(code) + ask, options: opts.map(String), answer: opts.indexOf(ans), why: why };
  }
  B['CSC-T2-13'] = { title: 'Spot constructs, operators, keywords and comments', items: [
    { skill: 'operator-class', kind: 'mcq', q: 'Which of these Python operators is a <b>relational</b> operator?', options: ['<code>!=</code>', '<code>//</code>', '<code>%</code>', '<code>and</code>'], answer: 0,
      why: 'Relational operators compare two values and give True or False. <code>!=</code> means "not equal to". <code>//</code> and <code>%</code> are arithmetic; <code>and</code> is logical.' },
    { skill: 'operator-class', kind: 'mcq', q: 'Which of these is a <b>logical</b> operator in Python?', options: ['<code>not</code>', '<code>&gt;=</code>', '<code>==</code>', '<code>%</code>'], answer: 0,
      why: 'The logical operators are <code>and</code>, <code>or</code> and <code>not</code>. <code>&gt;=</code> and <code>==</code> are relational; <code>%</code> is arithmetic.' },
    { skill: 'operator-class', kind: 'multi', q: 'Which of these are relational operators in Python?', options: ['<code>&lt;=</code>', '<code>!=</code>', '<code>==</code>', '<code>or</code>', '<code>%</code>', '<code>//</code>'], answers: [0, 1, 2],
      why: '<code>&lt;=</code>, <code>!=</code> and <code>==</code> compare values. <code>or</code> is a logical operator, and <code>%</code> and <code>//</code> are arithmetic operators.' },
    { skill: 'operator-class', kind: 'mcq', q: 'A student says that <code>&gt;=</code> is a logical operator. Which reply is correct?',
      options: ['No, it is a relational operator because it compares two values', 'Yes, because it gives a True or False result', 'No, it is an arithmetic operator because it works on numbers', 'Yes, because it is made from two symbols joined together'], answer: 0,
      why: '<code>&gt;=</code> compares two values, so it is relational. Logical operators (<code>and</code>, <code>or</code>, <code>not</code>) combine or reverse conditions.' },
    { skill: 'operator-class', kind: 'mcq', q: 'What does the <code>%</code> operator do in Python?', options: ['Gives the remainder after division', 'Works out a percentage of a number', 'Gives the whole-number part of a division', 'Divides and rounds to 2 decimal places'], answer: 0,
      why: '<code>%</code> is modulus: <code>17 % 5</code> is 2, the remainder. <code>//</code> gives the whole-number part.' },
    { skill: 'operator-class', kind: 'mcq', q: 'In Pearson pseudocode, which operator means "not equal to"?', options: ['<code>&lt;&gt;</code>', '<code>!=</code>', '<code>NOT</code>', '<code>=/</code>'], answer: 0,
      why: 'Pearson pseudocode writes "not equal to" as <code>&lt;&gt;</code>. Python uses <code>!=</code>. <code>NOT</code> is the logical operator that reverses a condition.' },
    { skill: 'operator-class', kind: 'mcq', q: 'Which of these is <b>not</b> an arithmetic operator?', options: ['Greater than', 'Integer division', 'Modulus', 'Multiply'], answer: 0,
      why: 'Greater than compares two values, so it is relational. Integer division, modulus and multiply all calculate a new number.' },
    { skill: 'precedence', gen: function () {
      var a = rint(2, 9), b = rint(2, 9), c = rint(2, 9), ans = a + b * c;
      return { kind: 'num', q: 'What value is stored in <code>result</code>?' + P(['result = ' + a + ' + ' + b + ' * ' + c]), answer: ans, unit: '', why: 'Multiplication is done before addition: ' + b + ' * ' + c + ' = ' + (b * c) + ', then ' + a + ' + ' + (b * c) + ' = ' + ans + '.' };
    } },
    { skill: 'precedence', gen: function () {
      var a = rint(2, 9), b = rint(2, 9), c = rint(2, 6), ans = (a + b) * c;
      return { kind: 'num', q: 'What value is stored in <code>total</code>?' + P(['total = (' + a + ' + ' + b + ') * ' + c]), answer: ans, unit: '', why: 'Brackets are worked out first: ' + a + ' + ' + b + ' = ' + (a + b) + ', then ' + (a + b) + ' * ' + c + ' = ' + ans + '.' };
    } },
    { skill: 'precedence', gen: function () {
      var b = rint(3, 9), a = b * rint(2, 9) + rint(1, b - 1), ans = a % b;
      return { kind: 'num', q: 'What is output by this Python line?' + P(['print(' + a + ' % ' + b + ')']), answer: ans, unit: '', why: '<code>%</code> gives the remainder: ' + a + ' = ' + b + ' * ' + Math.floor(a / b) + ' + ' + ans + ', so the remainder is ' + ans + '.' };
    } },
    { skill: 'precedence', gen: function () {
      var b = rint(3, 9), a = b * rint(3, 12) + rint(1, b - 1), ans = Math.floor(a / b);
      return { kind: 'num', q: 'What is output by this Python line?' + P(['print(' + a + ' // ' + b + ')']), answer: ans, unit: '', why: '<code>//</code> is integer division: it keeps only the whole number of times ' + b + ' goes into ' + a + ', which is ' + ans + ' (remainder ' + (a % b) + ' is dropped).' };
    } },
    { skill: 'precedence', gen: function () {
      var c = pick([2, 4, 5]), b = c * rint(2, 9), a = rint(10, 40), ans = a - b / c;
      return { kind: 'num', q: 'What value is stored in <code>x</code>? Give the number only.' + P(['x = ' + a + ' - ' + b + ' / ' + c]), answer: ans, unit: '', tol: 0.01,
        why: 'Division is done before subtraction: ' + b + ' / ' + c + ' = ' + (b / c) + ', then ' + a + ' - ' + (b / c) + ' = ' + ans + ' (Python shows ' + ans + '.0 because / gives a real number).' };
    } },
    { skill: 'precedence', kind: 'mcq', q: 'Why are the brackets needed in this line?' + P(['mean = (mark1 + mark2 + mark3) / 3']),
      options: ['Division is done before addition, so without them only mark3 would be divided by 3', 'Python cannot add more than two variables unless they are inside brackets', 'The brackets turn the three marks into a list so the mean can be found', 'Addition is always done first, so the brackets only make the line easier to read'], answer: 0,
      why: 'By the order of operations (BIDMAS), / is done before +. The brackets force the three marks to be added first, then the total is divided by 3.' },
    { skill: 'token', kind: 'mcq', q: 'Which part of this line is the comment?' + P(['bonus = sales * 0.1   # staff earn 10% of their sales']),
      options: ['<code># staff earn 10% of their sales</code>', '<code>bonus = sales * 0.1</code>', '<code>sales * 0.1</code>', '<code>bonus</code>'], answer: 0,
      why: 'A Python comment starts at <code>#</code> and runs to the end of the line. The computer ignores it; it is a note for people.' },
    { skill: 'token', family: 'guess', kind: 'mcq', q: 'Study this pseudocode.' + L(GUESS) + 'Give the logical operator used in the algorithm.',
      options: ['<code>AND</code>', '<code>&lt;</code>', '<code>=</code>', '<code>WHILE</code>'], answer: 0, why: 'Line 3 joins two conditions with <code>AND</code>, which is a logical operator. <code>&lt;</code> and <code>=</code> are relational; <code>WHILE</code> is a keyword.' },
    { skill: 'token', family: 'guess', kind: 'mcq', q: 'Study this pseudocode.' + L(GUESS) + 'Which of these, taken from line 3, is a relational operator?',
      options: ['<code>&lt;</code>', '<code>AND</code>', '<code>tries</code>', '<code>DO</code>'], answer: 0, why: '<code>&lt;</code> compares <code>tries</code> with 3, so it is relational. <code>AND</code> is logical, <code>tries</code> is a variable and <code>DO</code> is a keyword.' },
    { skill: 'token', family: 'cinema', kind: 'mcq', q: 'Study this code.' + L(CINEMA) + 'Give the logical operator used in the code.',
      options: ['<code>or</code>', '<code>&gt;=</code>', '<code>if</code>', '<code>-</code>'], answer: 0, why: 'Line 4 joins two conditions with <code>or</code>, the logical operator. <code>&gt;=</code> is relational, <code>if</code> is the selection keyword and <code>-</code> is arithmetic.' },
    lineQ(CINEMA, 'cinema', 'Which line stores a number that the user types in?', 2, [2, 3, 4, 6],
      'Line 2 uses <code>input()</code> to read what the user types and <code>int()</code> to turn it into a number, then stores it in <code>age</code>.'),
    lineQ(CINEMA, 'cinema', 'Identify the line number where selection starts.', 4, [1, 3, 4, 5],
      'Selection starts on the line with the keyword <code>if</code>, which is line 4. Line 5 only runs when that condition is True.'),
    lineQ(PUNCT, 'punct', 'Identify the line number where iteration starts.', 4, [1, 4, 5, 10],
      'Iteration starts on the line with <code>for</code> (or <code>while</code>), which is line 4. Line 5 is selection; line 1 defines a subprogram.'),
    lineQ(PUNCT, 'punct', 'Identify the line number where a data structure is initialised.', 2, [2, 3, 7, 10],
      'Line 2 sets up the list <code>marks</code> with its first values. Line 3 initialises a single variable, not a data structure.'),
    lineQ(PUNCT, 'punct', 'A student is told to add the comment <code># subprogram</code> at the end of the line where a subprogram is defined. Which line should it go on?', 1, [1, 7, 9, 11],
      'A subprogram is defined on the line that starts with <code>def</code>, which is line 1. Line 11 calls the subprogram rather than defining it.'),
    lineQ(GUESS, 'guess', 'Identify the line number where a value is received from the user.', 4, [1, 3, 4, 5],
      'In Pearson pseudocode, input is written <code>RECEIVE ... FROM ... KEYBOARD</code>, which is on line 4.')
  ] };

  /* ======================================================================
     CSC-T2-12 Find named items in a program
     ====================================================================== */
  var SHOP = ['VAT_RATE = 0.2', '', 'def addVat(netPrice):', '    vatAmount = netPrice * VAT_RATE', '    return netPrice + vatAmount', '', 'itemNames = ["lamp", "rug", "chair"]', 'cost = float(input("Enter price: "))', 'finalCost = addVat(cost)', 'print("Total", round(finalCost, 2))'];
  var BADGE = ['def makeTag(firstName, year):', '    tag = firstName[0:3] + str(year)', '    return tag.upper()', '', 'visitors = 0', 'name = input("Name: ")', 'joined = int(input("Year joined: "))', 'badge = makeTag(name, joined)', 'visitors = visitors + 1', 'print(badge, visitors)'];
  function nameQ(code, family, skill, ask, opts, why) {
    return { skill: skill, family: family, kind: 'mcq', q: 'Study this Python program.' + L(code) + ask, options: opts.map(C), answer: 0, why: why };
  }
  B['CSC-T2-12'] = { title: 'Find named items in a program', items: [
    nameQ(SHOP, 'shop', 'parameter-argument', 'Identify the name of a parameter.', ['netPrice', 'cost', 'finalCost', 'addVat'],
      'A parameter is the name inside the brackets of the <code>def</code> header on line 3. <code>cost</code> is the argument passed in the call on line 9.'),
    nameQ(SHOP, 'shop', 'parameter-argument', 'Which variable does the main program pass to the subprogram as an argument?', ['cost', 'netPrice', 'vatAmount', 'VAT_RATE'],
      'On line 9 the main program calls <code>addVat(cost)</code>, so <code>cost</code> is passed in. <code>netPrice</code> is the parameter that receives it.'),
    nameQ(SHOP, 'shop', 'return-receiver', 'Identify the name of the variable that receives the value returned by the subprogram.', ['finalCost', 'vatAmount', 'netPrice', 'cost'],
      'Line 9 is <code>finalCost = addVat(cost)</code>: the value returned by <code>addVat</code> is stored in <code>finalCost</code>.'),
    nameQ(SHOP, 'shop', 'local-global', 'Identify the name of a local variable.', ['vatAmount', 'finalCost', 'itemNames', 'cost'],
      '<code>vatAmount</code> is created inside the <code>def</code> block, so it only exists while <code>addVat</code> runs. The others are created in the main program, so they are global.'),
    nameQ(SHOP, 'shop', 'constant-structure', 'Identify the name of a constant.', ['VAT_RATE', 'vatAmount', 'netPrice', 'round'],
      '<code>VAT_RATE</code> is written in capitals and set once at the top to a value that does not change while the program runs.'),
    nameQ(SHOP, 'shop', 'constant-structure', 'Identify the name of a data structure.', ['itemNames', 'VAT_RATE', 'finalCost', 'input'],
      '<code>itemNames</code> holds several values in square brackets, so it is a list (a data structure).'),
    nameQ(SHOP, 'shop', 'subprogram-kind', 'Identify the name of a user-written subprogram.', ['addVat', 'round', 'float', 'print'],
      '<code>addVat</code> is defined in this program with <code>def</code>. <code>round</code>, <code>float</code> and <code>print</code> are built into Python.'),
    nameQ(SHOP, 'shop', 'subprogram-kind', 'Identify the name of a built-in subprogram used in the program.', ['round', 'addVat', 'itemNames', 'VAT_RATE'],
      '<code>round</code> comes with Python and is not defined anywhere in the program. <code>addVat</code> is user-written.'),
    nameQ(SHOP, 'shop', 'data-type', 'Identify the name of a real (float) variable in the main program.', ['cost', 'itemNames', 'addVat', 'print'],
      '<code>cost</code> is set using <code>float(input(...))</code>, so it holds a real number such as 12.99.'),
    nameQ(BADGE, 'badge', 'data-type', 'Identify the name of a string variable in the main program.', ['name', 'joined', 'visitors', 'makeTag'],
      '<code>name</code> stores what <code>input()</code> returns without conversion, so it is a string. <code>joined</code> and <code>visitors</code> are integers.'),
    nameQ(BADGE, 'badge', 'data-type', 'Identify the name of an integer variable that is set to a value entered by the user.', ['joined', 'name', 'visitors', 'badge'],
      '<code>joined</code> is set on line 7 with <code>int(input(...))</code>. <code>visitors</code> is an integer too, but it is not entered by the user.'),
    nameQ(BADGE, 'badge', 'local-global', 'Identify the name of a local variable.', ['tag', 'badge', 'visitors', 'name'],
      '<code>tag</code> is created inside the <code>def</code> block of <code>makeTag</code>, so it is local to that function.'),
    nameQ(BADGE, 'badge', 'return-receiver', 'Identify the name of the variable in the main program that receives the value returned by <code>makeTag</code>.', ['badge', 'tag', 'firstName', 'joined'],
      'Line 8 stores the result of <code>makeTag(name, joined)</code> in <code>badge</code>. <code>tag</code> is the local variable inside the function, not the receiver.'),
    nameQ(BADGE, 'badge', 'parameter-argument', 'Identify the name of one parameter of <code>makeTag</code>.', ['year', 'joined', 'name', 'tag'],
      'The parameters are the names in the <code>def</code> header: <code>firstName</code> and <code>year</code>. <code>name</code> and <code>joined</code> are the arguments in the call.'),
    { skill: 'parameter-argument', kind: 'mcq', q: 'What is the difference between a <b>parameter</b> and an <b>argument</b>?',
      options: ['A parameter is named in the subprogram header; an argument is the value passed in the call', 'A parameter is a value passed in the call; an argument is named in the header', 'A parameter is always a constant; an argument is always a variable', 'A parameter belongs to a built-in subprogram; an argument to a user-written one'], answer: 0,
      why: 'In <code>def area(side):</code>, <code>side</code> is the parameter. In <code>area(4)</code>, the 4 is the argument that is copied into the parameter.' },
    { skill: 'local-global', kind: 'mcq', q: 'A variable is first created inside a <code>def</code> block. What kind of variable is it?',
      options: ['A local variable that only exists while the subprogram runs', 'A global variable that every part of the program can use', 'A constant, because it cannot be changed after the function ends', 'A parameter, because it belongs to the subprogram'], answer: 0,
      why: 'Variables created inside a subprogram are local: they are created when the subprogram runs and lost when it ends.' },
    { skill: 'subprogram-kind', kind: 'multi', q: 'Which of these are built-in Python subprograms?', options: ['<code>len</code>', '<code>input</code>', '<code>int</code>', '<code>findLargest</code>', '<code>showMenu</code>'], answers: [0, 1, 2],
      why: '<code>len</code>, <code>input</code> and <code>int</code> come with Python. Names like <code>findLargest</code> and <code>showMenu</code> would have to be written by the programmer with <code>def</code>.' },
    { skill: 'constant-structure', kind: 'mcq', q: 'In a Python program, which line most clearly sets up a constant?',
      options: ['<code>MAX_SEATS = 52</code>', '<code>seats = seats - 1</code>', '<code>seatList = [12, 14, 9]</code>', '<code>seats = int(input())</code>'], answer: 0,
      why: 'Constants are written in capitals by convention and given a fixed value once. The others change, hold several values, or come from the user.' },
    { skill: 'data-type', kind: 'mcq', q: 'Which line creates a <b>real</b> variable?',
      options: ['<code>rate = 0.0</code>', '<code>rate = "0"</code>', '<code>rate = 0</code>', '<code>rate = [0]</code>'], answer: 0,
      why: '<code>0.0</code> has a decimal point, so it is a real (float). <code>"0"</code> is a string, <code>0</code> is an integer and <code>[0]</code> is a list.' },
    { skill: 'data-type', kind: 'mcq', q: 'After this line runs, what is the data type of <code>code</code>?' + P(['code = input("Enter PIN: ")']),
      options: ['String', 'Integer', 'Real', 'Boolean'], answer: 0,
      why: '<code>input()</code> always returns text. Without <code>int()</code> or <code>float()</code> around it, the variable holds a string, even if digits are typed.' },
    { skill: 'parameter-argument', gen: function () {
      var fn = pick(['scale', 'convert', 'markUp', 'applyRate']), p = pick(['inValue', 'amount', 'qty']), a = pick(['reading', 'price', 'stock']), r = pick(['answer', 'result', 'output']);
      var lines = ['def ' + fn + '(' + p + ', factor):', '    return ' + p + ' * factor', '', a + ' = float(input())', r + ' = ' + fn + '(' + a + ', 1.5)', 'print(' + r + ')'];
      var askParam = Math.random() < 0.5;
      return { kind: 'mcq', q: 'Study this Python program.' + L(lines) + (askParam ? 'Identify the parameter that receives the value of <code>' + a + '</code>.' : 'Identify the name of the variable passed as an argument to <code>' + fn + '</code>.'),
        options: askParam ? [C(p), C(a), C(r), C(fn)] : [C(a), C(p), C(r), C('factor')], answer: 0,
        why: askParam ? 'The call on line 5 passes <code>' + a + '</code> first, so its value goes into the first parameter in the header on line 1, <code>' + p + '</code>.' : 'An argument is passed in the call on line 5: <code>' + fn + '(' + a + ', 1.5)</code>. <code>' + p + '</code> and <code>factor</code> are the parameters.' };
    } },
    { skill: 'return-receiver', kind: 'mcq', q: 'In the line <code>score = getScore(answers)</code>, what is <code>score</code>?',
      options: ['The variable that receives the value returned by the function', 'A parameter of the function <code>getScore</code>', 'The argument passed into the function', 'A built-in subprogram'], answer: 0,
      why: 'The function is called on the right; whatever it returns is stored in the variable on the left of <code>=</code>.' }
  ] };

  /* ======================================================================
     CSC-T2-09 Normal, boundary and erroneous test data
     ====================================================================== */
  var TD3 = ['Normal', 'Boundary', 'Erroneous'];
  var RANGES = [
    { what: 'a percentage score', lo: 0, hi: 100 }, { what: 'the number of tickets in one order', lo: 1, hi: 8 }, { what: 'a shoe size', lo: 2, hi: 13 },
    { what: 'the age of a junior club member', lo: 7, hi: 15 }, { what: 'a quantity of paint tins', lo: 1, hi: 25 }, { what: 'a temperature setting in degrees Celsius', lo: 16, hi: 30 },
    { what: 'a red, green or blue colour value', lo: 0, hi: 255 }, { what: 'the number of nights in a booking', lo: 1, hi: 14 }];
  var DEF = '<i>Boundary data is the most extreme value that is still valid.</i> ';
  var WORDS = { 2: ['ox', 'up', 'go'], 3: ['cat', 'sun', 'map'], 4: ['lamp', 'frog', 'kite'], 5: ['river', 'plant', 'cloud'], 6: ['garden', 'silver', 'pickle'], 7: ['blanket', 'harbour', 'trumpet'], 8: ['elephant', 'mountain', 'sandwich'], 9: ['blueberry', 'adventure', 'cardboard'], 10: ['playground', 'strawberry', 'lighthouse'], 11: ['watermelons', 'butterflies', 'grasshopper'], 12: ['thunderstorm', 'neighbouring', 'breadcrumbed'], 13: ['unforgettable', 'grandchildren', 'encyclopaedia'] };
  function mid(r) { var m = Math.max(1, Math.ceil((r.hi - r.lo) * 0.2)); return rint(r.lo + m, r.hi - m); }
  B['CSC-T2-09'] = { title: 'Normal, boundary and erroneous test data', items: [
    { skill: 'classify', gen: function () {
      var r = pick(RANGES), t = rint(0, 2), v = t === 0 ? mid(r) : t === 1 ? pick([r.lo, r.hi]) : pick([r.lo - 1, r.hi + 1, r.hi + rint(5, 30)]);
      return { kind: 'mcq', q: 'A program accepts ' + r.what + ' from ' + r.lo + ' to ' + r.hi + ' inclusive. ' + DEF + 'What type of test data is <b>' + v + '</b>?', options: TD3.slice(), answer: t,
        why: t === 0 ? v + ' is valid and well inside ' + r.lo + ' to ' + r.hi + ', so it is normal data.' : t === 1 ? v + ' is the ' + (v === r.lo ? 'lowest' : 'highest') + ' value that is still allowed, so it is boundary data.' : v + ' is outside ' + r.lo + ' to ' + r.hi + ', so the program should reject it: erroneous data.' };
    } },
    { skill: 'choose-value', gen: function () {
      var r = pick(RANGES), hiEnd = Math.random() < 0.5, b = hiEnd ? r.hi : r.lo;
      var opts = [b, hiEnd ? r.hi + 1 : r.lo - 1, mid(r), hiEnd ? r.hi + rint(10, 40) : r.lo - rint(5, 20)];
      while (opts[2] === opts[0]) opts[2] = mid(r);
      return { kind: 'mcq', q: 'A program accepts ' + r.what + ' from ' + r.lo + ' to ' + r.hi + ' inclusive. ' + DEF + 'Which value is boundary test data at the ' + (hiEnd ? 'top' : 'bottom') + ' of the range?', options: opts.map(String), answer: 0,
        why: 'The ' + (hiEnd ? 'highest' : 'lowest') + ' valid value is ' + b + '. ' + opts[1] + ' is just outside the range, so it is erroneous, and ' + opts[2] + ' is normal data.' };
    } },
    { skill: 'choose-value', gen: function () {
      var r = pick(RANGES), bad = pick([r.lo - 1, r.hi + 1]);
      var opts = [bad, r.lo, r.hi, mid(r)];
      return { kind: 'mcq', q: 'A program accepts ' + r.what + ' from ' + r.lo + ' to ' + r.hi + ' inclusive. Which test value is <b>erroneous</b> data?', options: opts.map(String), answer: 0,
        why: bad + ' is outside the range ' + r.lo + ' to ' + r.hi + ', so the program should reject it. ' + r.lo + ' and ' + r.hi + ' are boundary data and ' + opts[3] + ' is normal data.' };
    } },
    { skill: 'choose-value', gen: function () {
      var r = pick(RANGES.filter(function (x) { return x.hi - x.lo >= 6; })), n = rint(r.lo + 2, r.hi - 2);
      var opts = [n, r.lo, r.hi, r.hi + 1];
      return { kind: 'mcq', q: 'A program accepts ' + r.what + ' from ' + r.lo + ' to ' + r.hi + ' inclusive. Which value is the best choice of <b>normal</b> test data?', options: opts.map(String), answer: 0,
        why: 'Normal data is a typical valid value, well inside the range: ' + n + '. ' + r.lo + ' and ' + r.hi + ' are on the boundary, and ' + (r.hi + 1) + ' is erroneous.' };
    } },
    { skill: 'choose-value', gen: function () {
      var r = pick(RANGES), opts = [r.lo + ' and ' + r.hi, (r.lo - 1) + ' and ' + (r.hi + 1), (r.lo + 1) + ' and ' + (r.hi - 1), r.lo + ' and ' + (r.hi + 1)];
      return { kind: 'mcq', q: 'A program accepts ' + r.what + ' from ' + r.lo + ' to ' + r.hi + ' inclusive. ' + DEF + 'Which pair of values are both boundary test data?', options: opts, answer: 0,
        why: 'The most extreme valid values are the two ends of the range, ' + r.lo + ' and ' + r.hi + '. ' + (r.lo - 1) + ' and ' + (r.hi + 1) + ' are outside the range, so they are erroneous.' };
    } },
    { skill: 'classify', gen: function () {
      var lo = pick([3, 4, 5]), hi = pick([8, 10, 12]), t = rint(0, 2);
      var len = t === 0 ? rint(lo + 1, hi - 1) : t === 1 ? pick([lo, hi]) : pick([lo - 1, hi + 1]);
      var w = pick(WORDS[len]);
      return { kind: 'mcq', q: 'A memorable word must contain ' + lo + ' to ' + hi + ' letters. ' + DEF + 'What type of test data is the word <b>' + w + '</b>?', options: TD3.slice(), answer: t,
        why: '<b>' + w + '</b> has ' + len + ' letters. ' + (t === 0 ? 'That is valid and not at either end of ' + lo + ' to ' + hi + ', so it is normal data.' : t === 1 ? 'That is the ' + (len === lo ? 'shortest' : 'longest') + ' length allowed, so it is boundary data.' : 'That is outside ' + lo + ' to ' + hi + ', so it should be rejected: erroneous data.') };
    } },
    { skill: 'choose-value', gen: function () {
      var lo = pick([3, 4]), hi = pick([9, 10]);
      var good = pick(WORDS[hi]), opts = [good, pick(WORDS[hi + 1]), pick(WORDS[rint(lo + 2, hi - 2)]), pick(WORDS[lo - 1])];
      return { kind: 'mcq', q: 'A username must be ' + lo + ' to ' + hi + ' letters long. ' + DEF + 'Which username is boundary test data at the longest end?', options: opts, answer: 0,
        why: '<b>' + good + '</b> has exactly ' + hi + ' letters, the longest length allowed. <b>' + opts[1] + '</b> has ' + (hi + 1) + ' letters, so it is erroneous.' };
    } },
    { skill: 'classify', gen: function () {
      var r = pick(RANGES.filter(function (x) { return x.hi - x.lo >= 6; }));
      var vals = [{ v: r.lo - 1, bad: true }, { v: r.hi + 1, bad: true }, { v: r.lo, bad: false }, { v: r.hi, bad: false }, { v: mid(r), bad: false }, { v: r.hi + rint(10, 50), bad: true }];
      var opts = shuffle(vals).slice(0, 5);
      if (!opts.some(function (o) { return o.bad; })) opts[0] = vals[0];
      if (opts.every(function (o) { return o.bad; })) opts[0] = vals[2];
      var seen = {}; opts = opts.filter(function (o) { if (seen[o.v]) return false; seen[o.v] = 1; return true; });
      while (opts.length < 4) { var extra = { v: rint(r.lo + 1, r.hi - 1), bad: false }; if (!seen[extra.v]) { seen[extra.v] = 1; opts.push(extra); } }
      return { kind: 'multi', q: 'A program accepts ' + r.what + ' from ' + r.lo + ' to ' + r.hi + ' inclusive. Which of these values should the program <b>reject</b>?', options: opts.map(function (o) { return String(o.v); }),
        answers: opts.map(function (o, i) { return o.bad ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: 'Only values outside ' + r.lo + ' to ' + r.hi + ' are erroneous and should be rejected. ' + r.lo + ' and ' + r.hi + ' are valid boundary values, so they must be accepted.' };
    } },
    { skill: 'program-boundary', gen: function () {
      var hot = rint(26, 34), warm = rint(12, 18), askHot = Math.random() < 0.5;
      var code = P(['temp = int(input("Temperature: "))', 'if temp >= ' + hot + ':', '    print("Hot")', 'elif temp >= ' + warm + ':', '    print("Warm")', 'else:', '    print("Cold")']);
      var ans = askHot ? hot : warm, opts = askHot ? [hot, hot - 1, hot + 1, warm] : [warm, warm - 1, hot - 1, hot];
      return { kind: 'mcq', q: 'Temperatures are whole numbers.' + code + DEF + 'Which value is the boundary test data for the <b>lowest</b> temperature that outputs <code>' + (askHot ? 'Hot' : 'Warm') + '</code>?', options: opts.map(String), answer: 0,
        why: 'The condition is <code>temp &gt;= ' + ans + '</code>, so ' + ans + ' is the smallest whole number that gives ' + (askHot ? 'Hot' : 'Warm') + '. ' + (ans - 1) + ' gives a different message.' };
    } },
    { skill: 'program-boundary', gen: function () {
      var max = pick([12, 15, 18, 20, 25, 35]);
      return { kind: 'mcq', q: 'A delivery is free when an order weighs ' + max + ' kg or less. Weights are whole numbers of kilograms. ' + DEF + 'Which weight is the boundary test data for free delivery?',
        options: [String(max), String(max + 1), String(max - 1), String(Math.round(max / 2))], answer: 0,
        why: '"' + max + ' kg or less" includes ' + max + ' itself, so ' + max + ' kg is the most extreme weight that still gets free delivery. ' + (max + 1) + ' kg does not qualify.' };
    } },
    { skill: 'contrast', kind: 'mcq', q: 'Which statement describes a difference between boundary data and erroneous data?',
      options: ['Boundary data is valid and should be accepted; erroneous data is invalid and should be rejected', 'Boundary data should be rejected; erroneous data should be accepted with a warning', 'Boundary data is always the wrong data type; erroneous data is always a number', 'Boundary data is a typical value; erroneous data is a value at the edge of the range'], answer: 0,
      why: 'Boundary data sits at the very edge of what is allowed, so the program must accept it. Erroneous data breaks the rule, so the program must reject it.' },
    { skill: 'contrast', kind: 'mcq', q: 'Why do programmers test with boundary data as well as normal data?',
      options: ['Mistakes such as using &lt; instead of &lt;= only show up at the edges of a range', 'Boundary data checks that the program rejects the wrong data type', 'Normal data cannot be used until the boundary data has passed', 'Boundary data makes the program run faster during testing'], answer: 0,
      why: 'A program can work for typical values but fail exactly at the limit if a comparison is slightly wrong. Testing the edge values catches this.' },
    { skill: 'contrast', kind: 'mcq', q: 'What should happen when erroneous data is entered into a well-tested program?',
      options: ['It is rejected, usually with a message asking for the data again', 'It is accepted and processed in exactly the same way as normal data would be', 'It is rounded to the nearest boundary value and then accepted', 'The program stops completely and must be restarted'], answer: 0,
      why: 'Erroneous data is invalid, so a correct program should refuse it and let the user try again rather than accept it or crash.' },
    { skill: 'contrast', kind: 'mcq', q: 'What is the purpose of testing a program with erroneous data?',
      options: ['To check that invalid input is rejected rather than accepted or causing a crash', 'To check that the program gives correct results for typical values', 'To find out how quickly the program runs with large inputs', 'To check that the most extreme valid values are accepted'], answer: 0,
      why: 'Erroneous tests prove the validation works. Typical values are normal tests, and the most extreme valid values are boundary tests.' },
    { skill: 'mistakes', kind: 'mcq', q: 'A test table asks for normal data for a field that accepts 1 to 50. A student writes "a medium-sized number". Why does this earn no mark?',
      options: ['It is a description, not an actual value that could be typed in', 'Normal data must always be the exact middle value of the range, which is 25', 'The answer should have been written as a fraction', 'Normal data must be outside the range'], answer: 0,
      why: 'Test data must be a real value the tester can enter, such as 23. A description cannot be used to run a test.' },
    { skill: 'mistakes', kind: 'mcq', q: 'A field accepts a numeric value from 1 to 9. For boundary data a student writes "nine". What is wrong with this answer?',
      options: ['The field needs numeric data, so the value should be written as 9', '"nine" is erroneous because 9 is outside the range', 'Boundary data must be the lowest value, so it should be 1', 'Nothing is wrong, because nine is at the top of the range'], answer: 0,
      why: 'The question asks for numeric data, so the tester would type the digit 9. A word is the wrong data type for this field.' },
    { skill: 'mistakes', kind: 'mcq', q: 'A field accepts 10 to 60 inclusive. A student chooses 10 as the normal test data. Why is this a poor choice?',
      options: ['10 is the lowest valid value, so it is boundary data, not a typical value', '10 is outside the range, so it is erroneous data', 'Normal data must always be an even number above 50', 'Normal data must be the same as the erroneous data'], answer: 0,
      why: 'Normal data should be a typical value well inside the range, such as 35. 10 is an edge of the range, so it tests the boundary instead.' },
    { skill: 'mistakes', kind: 'mcq', q: 'A test table needs two different examples of erroneous data for a field that accepts 1 to 12. Which pair is the best answer?',
      options: ['0 and 13', '13 and 13', '1 and 12', '6 and 13'], answer: 0,
      why: '0 is below the range and 13 is above it, so both are invalid and they are different. Repeating 13 earns only one mark; 1, 12 and 6 are valid values.' },
    { skill: 'classify', kind: 'mcq', q: 'A program asks for a whole number of laps from 1 to 20. Which input is erroneous because it is the wrong data type?',
      options: ['<code>seven</code>', '<code>7</code>', '<code>20</code>', '<code>1</code>'], answer: 0,
      why: 'Text such as <code>seven</code> is not a whole number, so the program should reject it. 7 is normal, and 1 and 20 are boundary data.' },
    { skill: 'two-field', kind: 'mcq', q: 'A booking is for 1 to 3 rooms and 1 to 14 nights. ' + DEF + 'Which row shows boundary test data for both fields?',
      options: ['Rooms 3, Nights 1', 'Rooms 4, Nights 15', 'Rooms 2, Nights 7', 'Rooms 0, Nights 14'], answer: 0,
      why: '3 is the most rooms allowed and 1 is the fewest nights allowed, so both are boundary values. 4, 15 and 0 are erroneous; 2 and 7 are normal.' },
    { skill: 'two-field', kind: 'mcq', q: 'A booking is for 1 to 3 rooms and 1 to 14 nights. Which row shows erroneous test data for both fields?',
      options: ['Rooms 5, Nights 0', 'Rooms 3, Nights 14', 'Rooms 1, Nights 20', 'Rooms 2, Nights 9'], answer: 0,
      why: '5 rooms is above the maximum of 3 and 0 nights is below the minimum of 1, so both are invalid. Each other row has at least one valid value.' },
    { skill: 'two-field', kind: 'mcq', q: 'A quiz accepts teams of 2 to 5 players and a team name of 3 to 12 letters. Which row is all normal data?',
      options: ['Players 3, Name "Comets"', 'Players 5, Name "Owls"', 'Players 2, Name "Hawks"', 'Players 6, Name "Rockets"'], answer: 0,
      why: '3 players and a 6-letter name are both valid and not at an edge. 5 and 2 players are boundary values; 6 players is erroneous.' }
  ] };

  /* ======================================================================
     CSC-T2-07 Make code easy to read
     ====================================================================== */
  B['CSC-T2-07'] = { title: 'Make code easy to read', items: [
    { skill: 'technique', kind: 'mcq', q: 'Which technique makes code easier for another programmer to read and understand?',
      options: ['Giving variables descriptive names', 'Making every variable name as short as possible', 'Fitting the whole program onto as few lines as possible', 'Using global variables instead of local ones'], answer: 0,
      why: 'A descriptive name such as <code>totalPay</code> tells the reader what the variable stores without having to work it out.' },
    { skill: 'technique', kind: 'multi', q: 'Which of these are techniques that improve the readability of code?',
      options: ['Adding comments', 'Indentation that shows structure', 'Blank lines between sections', 'Descriptive names for subprograms', 'Choosing the fastest sorting algorithm', 'Storing the data in a two-dimensional array'], answers: [0, 1, 2, 3],
      why: 'Comments, indentation, white space and descriptive names all help a person read the code. A faster algorithm or a different data structure may help the program, but it does not make the code easier to read.' },
    { skill: 'technique', kind: 'mcq', q: 'What is meant by <b>white space</b> in a program?',
      options: ['Blank lines and spaces that separate sections of code', 'Spaces left inside strings for the user to fill in', 'The part of memory that has not yet been used by the program', 'Lines of code that have been deleted'], answer: 0,
      why: 'White space spreads the code out so separate sections, such as input, processing and output, are easy to see.' },
    { skill: 'technique', kind: 'mcq', q: 'What does indentation show to a person reading a program?',
      options: ['Which lines belong inside a loop, selection or subprogram', 'Which lines will run fastest when the program is executed', 'Which lines contain comments for other programmers', 'Which variables are constants'], answer: 0,
      why: 'Lines moved in from the margin belong to the block above them, so the reader can see where a loop or IF starts and ends.' },
    { skill: 'reason', kind: 'mcq', q: 'Give one reason why programmers add comments to their code.',
      options: ['To explain how the code works to someone reading it', 'To make the program run more quickly', 'To stop the translator reporting syntax errors', 'To hide parts of the code from the user'], answer: 0,
      why: 'Comments are notes for people. They explain what each part of the code does, so it is easier to understand.' },
    { skill: 'reason', kind: 'mcq', q: 'What happens to a comment when a Python program runs?',
      options: ['It is ignored by the computer', 'It is shown to the user on the screen', 'It is run as an extra instruction', 'It is saved as a variable'], answer: 0,
      why: 'Everything after <code>#</code> on a line is ignored by the computer. Comments only help human readers.' },
    { skill: 'reason', kind: 'mcq', q: 'How can comments help a programmer who is debugging a program?',
      options: ['They state what each section should do, so it can be compared with what it actually does', 'They automatically highlight the exact line where a runtime error has happened in the code', 'They correct small syntax errors as the program is translated', 'They make the program skip any line that contains an error'], answer: 0,
      why: 'If a comment says what a section is meant to do, the programmer can spot where the code does something different and find the fault faster.' },
    { skill: 'reason', kind: 'multi', q: 'Which <b>two</b> statements about comments are false?',
      options: ['Comments make the program run faster', 'Comments are translated into machine code instructions', 'Comments can explain the purpose of a subprogram', 'Comments are ignored by the computer', 'Comments help other programmers understand the code'], answers: [0, 1],
      why: 'Comments are ignored when the program is translated and run, so they cannot speed it up and are not turned into instructions.' },
    { skill: 'not-readability', kind: 'mcq', q: 'Which change would <b>not</b> make a program easier to read?',
      options: ['Replacing a linear search with a binary search so it runs faster', 'Renaming the variable <code>t</code> to <code>totalCost</code> throughout the whole program', 'Adding a blank line between the input and output sections', 'Adding a comment that explains what a loop is for'], answer: 0,
      why: 'Changing the algorithm may improve speed but does nothing for the reader. The other three are readability techniques.' },
    { skill: 'not-readability', kind: 'mcq', q: 'A student says "indent every line of code to make it readable". Why is this wrong?',
      options: ['Indentation should show which lines are inside a block, not be used everywhere', 'Indentation only works in pseudocode, so Python ignores it when the program is translated', 'Indentation makes code harder to read and should never be used', 'Only comments should be indented, never instructions'], answer: 0,
      why: 'Indentation is useful because it is different for lines inside a loop, IF or subprogram. If every line is indented the same, the structure is hidden.' },
    { skill: 'not-readability', kind: 'mcq', q: 'Which of these would make code <b>harder</b> to understand?',
      options: ['Naming three variables <code>a</code>, <code>b</code> and <code>c</code>', 'Starting each subprogram with a comment saying what it does', 'Leaving a blank line before each subprogram', 'Using the name <code>MAX_SCORE</code> for a constant'], answer: 0,
      why: 'Single-letter names give no clue about what is stored. The other choices are all techniques that help the reader.' },
    { skill: 'apply-code', kind: 'mcq', q: 'A programmer changes the first line into the second line. Which readability technique has been used?' + P(['x = y * z', 'wages = hoursWorked * hourlyRate']),
      options: ['Descriptive names', 'Comments', 'Indentation', 'White space'], answer: 0, why: 'The calculation is the same, but the variables now have names that say what they store.' },
    { skill: 'apply-code', kind: 'mcq', q: 'Which readability technique is shown on the first line of this code?' + P(['# Convert a temperature from Celsius to Fahrenheit', 'fahrenheit = celsius * 9 / 5 + 32']),
      options: ['Comments', 'Descriptive names', 'Indentation', 'White space'], answer: 0, why: 'The first line starts with <code>#</code>, so it is a comment explaining what the code below it does.' },
    { skill: 'apply-code', kind: 'mcq', q: 'A programmer rewrites the first pseudocode into the second. Which readability technique has been added?' + P(['FOR count FROM 1 TO 5 DO', 'SEND count TO DISPLAY', 'IF count = 3 THEN', 'SEND "half way" TO DISPLAY', 'END IF', 'END FOR']) + P(['FOR count FROM 1 TO 5 DO', '    SEND count TO DISPLAY', '    IF count = 3 THEN', '        SEND "half way" TO DISPLAY', '    END IF', 'END FOR']),
      options: ['Indentation', 'Comments', 'Descriptive names', 'Removing a loop'], answer: 0, why: 'The second version moves lines in from the margin so it is clear which lines are inside the FOR loop and which are inside the IF.' },
    { skill: 'apply-code', kind: 'mcq', q: 'This code already uses comments, indentation and white space. Which readability technique is missing?' + P(['# Work out the cost of an order', 'p = float(input("Price: "))', 'q = int(input("How many: "))', '', '# Apply delivery charge', 'if q < 3:', '    t = p * q + 4.99', 'else:', '    t = p * q', '', 'print(t)']),
      options: ['Descriptive names', 'Comments', 'Indentation', 'White space'], answer: 0, why: 'The variables are called <code>p</code>, <code>q</code> and <code>t</code>, which tell the reader nothing. Names such as <code>price</code>, <code>quantity</code> and <code>total</code> would be clearer.' },
    { skill: 'apply-code', kind: 'mcq', q: 'Which is the most descriptive name for a variable that stores the number of seats left on a bus?',
      options: ['<code>seatsLeft</code>', '<code>s</code>', '<code>number1</code>', '<code>busVar</code>'], answer: 0, why: '<code>seatsLeft</code> says exactly what is stored. The others give little or no clue.' },
    { skill: 'apply-code', kind: 'mcq', q: 'Which is the most descriptive name for a constant that stores the largest number of login attempts allowed?',
      options: ['<code>MAX_LOGIN_ATTEMPTS</code>', '<code>M</code>', '<code>LIMIT1</code>', '<code>CONST_A</code>'], answer: 0, why: 'The name describes the meaning of the value, and capitals show it is a constant.' },
    { skill: 'apply-code', kind: 'mcq', q: 'Which is the best name for a function that returns the area of a circle?',
      options: ['<code>circleArea</code>', '<code>function1</code>', '<code>doIt</code>', '<code>calc</code>'], answer: 0, why: 'A descriptive subprogram name tells the reader what the function does without having to read its code.' },
    { skill: 'apply-code', kind: 'mcq', q: 'Which comment would be most useful on this line?' + P(['total = total + price * quantity']),
      options: ['<code># add this item\'s cost to the order total</code>', '<code># this is a line of Python code with two operators</code>', '<code># total</code>', '<code># price and quantity are variables</code>'], answer: 0, why: 'A useful comment explains what the code is for. The others say nothing that the reader could not already see.' },
    { skill: 'benefit', kind: 'mcq', q: 'Why is readable code easier to maintain?',
      options: ['Others can understand it quickly, so errors are fixed and features added sooner', 'Readable code is translated into fewer machine code instructions, so it runs faster', 'Readable code cannot contain logic errors', 'Readable code uses less memory when it runs'], answer: 0,
      why: 'Maintenance means changing code later. If it is easy to understand, the changes are quicker and less likely to introduce new errors.' },
    { skill: 'benefit', kind: 'mcq', q: 'A games company\'s lead programmer leaves. A new programmer must add a feature to her code. How does well-commented code help the new programmer?',
      options: ['The comments explain what each part does, so they can see where the new feature fits', 'The comments lock the existing code so the new programmer cannot accidentally break it', 'The comments make the game run faster for the players', 'The comments mean the code no longer needs to be tested'], answer: 0,
      why: 'Comments pass on the original programmer\'s understanding, so someone new can find and change the right part of the code.' },
    { skill: 'benefit', kind: 'mcq', q: 'What is a benefit of giving subprograms descriptive names?',
      options: ['A call such as <code>calculateTax(pay)</code> shows its purpose without reading the function', 'Descriptive names make the subprogram run faster every single time that it is called', 'Python only allows built-in subprograms to have short names', 'It stops the subprogram being called by mistake'], answer: 0,
      why: 'When the name says what the subprogram does, the main program reads almost like a description of the task.' }
  ] };

  /* ======================================================================
     CSC-T2-10 Design validation checks for a code format
     ====================================================================== */
  var UP = 'ABCDEFGHJKLMNPRSTUVWXYZ', LOW = 'abcdefghijkmnpqrstuvwxyz';
  function ch(s) { return s.charAt(Math.floor(Math.random() * s.length)); }
  // Case-breaking letters chosen so the wrong case is easy to see (no l/I, c/C, s/S look-alikes).
  var LOWSEEN = 'abdefghmnqrt', UPSEEN = 'ABDEFGHMNQRT';
  function isUp(c) { return /^[A-Z]$/.test(c); }
  function isLow(c) { return /^[a-z]$/.test(c); }
  function isDig(c) { return /^[0-9]$/.test(c); }
  function sub(s, i, c) { return s.slice(0, i) + c + s.slice(i + 1); }
  function digitSum(s) { var t = 0; for (var i = 0; i < s.length; i++) t += +s.charAt(i); return t; }
  var FORMATS = {
    member: {
      name: 'membership code', family: 'fmt-member',
      table: '<table class="mc-table"><tr><th>Characters</th><th>Rule</th></tr><tr><td>1 to 2</td><td>Upper case letters</td></tr><tr><td>3 to 7</td><td>Digits 0 to 9</td></tr><tr><td>8</td><td>The last digit of the sum of characters 3 to 7</td></tr></table>',
      intro: 'A sports club uses 8-character membership codes.',
      make: function () { var d = ''; for (var i = 0; i < 5; i++) d += rint(0, 9); return ch(UP) + ch(UP) + d + (digitSum(d) % 10); },
      rules: [
        { test: 'Is the code exactly 8 characters long?', ok: function (c) { return c.length === 8; }, brk: function (c) { return c + rint(0, 9); } },
        { test: 'Are characters 1 and 2 upper case letters?', ok: function (c) { return isUp(c[0]) && isUp(c[1]); }, brk: function (c) { return Math.random() < 0.5 ? sub(c, 0, ch(LOWSEEN)) : sub(c, 1, String(rint(1, 9))); } },
        { test: 'Is character 8 the last digit of the sum of characters 3 to 7?', ok: function (c) { var d = c.slice(2, 7); return /^\d{5}$/.test(d) && c[7] === String(digitSum(d) % 10); }, brk: function (c) { var w = (+c[7] + rint(1, 9)) % 10; return sub(c, 7, String(w)); } }
      ]
    },
    locker: {
      name: 'locker code', family: 'fmt-locker',
      table: '<table class="mc-table"><tr><th>Characters</th><th>Rule</th></tr><tr><td>1</td><td>An upper case letter from A to H</td></tr><tr><td>2 to 4</td><td>Digits from 1 to 6</td></tr><tr><td>5 to 6</td><td>Lower case letters</td></tr></table>',
      intro: 'A gym uses 6-character locker codes.',
      make: function () { return ch('ABCDEFGH') + rint(1, 6) + rint(1, 6) + rint(1, 6) + ch(LOW) + ch(LOW); },
      rules: [
        { test: 'Is the code exactly 6 characters long?', ok: function (c) { return c.length === 6; }, brk: function (c) { return c + ch(LOW); } },
        { test: 'Is character 1 an upper case letter from A to H?', ok: function (c) { return /^[A-H]$/.test(c[0]); }, brk: function (c) { return sub(c, 0, ch('KMPRTWY')); } },
        { test: 'Are characters 2 to 4 digits from 1 to 6?', ok: function (c) { return /^[1-6]{3}$/.test(c.slice(1, 4)); }, brk: function (c) { return sub(c, rint(1, 3), pick(['0', '7', '8', '9'])); } },
        { test: 'Are characters 5 and 6 lower case letters?', ok: function (c) { return isLow(c[4]) && isLow(c[5]); }, brk: function (c) { var i = rint(4, 5); return sub(c, i, ch(UPSEEN)); } }
      ]
    },
    parcel: {
      name: 'parcel ID', family: 'fmt-parcel',
      table: '<table class="mc-table"><tr><th>Characters</th><th>Rule</th></tr><tr><td>1 to 3</td><td>Upper case letters</td></tr><tr><td>4</td><td>A hyphen (-)</td></tr><tr><td>5 to 9</td><td>Digits 0 to 9</td></tr></table>',
      intro: 'A courier uses 9-character parcel IDs.',
      make: function () { var d = ''; for (var i = 0; i < 5; i++) d += rint(0, 9); return ch(UP) + ch(UP) + ch(UP) + '-' + d; },
      rules: [
        { test: 'Is the ID exactly 9 characters long?', ok: function (c) { return c.length === 9; }, brk: function (c) { return c + rint(0, 9); } },
        { test: 'Are characters 1 to 3 upper case letters?', ok: function (c) { return isUp(c[0]) && isUp(c[1]) && isUp(c[2]); }, brk: function (c) { var i = rint(0, 2); return sub(c, i, ch(LOWSEEN)); } },
        { test: 'Is character 4 a hyphen?', ok: function (c) { return c[3] === '-'; }, brk: function (c) { return sub(c, 3, pick(['/', '_', '.'])); } },
        { test: 'Are characters 5 to 9 digits?', ok: function (c) { return /^\d{5}$/.test(c.slice(4, 9)); }, brk: function (c) { return sub(c, rint(4, 8), ch(UP)); } }
      ]
    }
  };
  function fails(f, c) { return f.rules.map(function (r, i) { return r.ok(c) ? -1 : i; }).filter(function (i) { return i >= 0; }); }
  function brokenOnly(f, idxs) {
    for (var t = 0; t < 50; t++) {
      var c = f.make();
      idxs.forEach(function (i) { c = f.rules[i].brk(c); });
      if (fails(f, c).join(',') === idxs.slice().sort().join(',')) return c;
    }
    return null;
  }
  function validCodes(f, n) { var out = [], seen = {}; while (out.length < n) { var c = f.make(); if (!seen[c]) { seen[c] = 1; out.push(c); } } return out; }
  function intro(f) { return f.intro + f.table + 'Valid examples: ' + validCodes(f, 3).map(C).join(', ') + '. '; }
  function failsOnly(key) {
    return function () {
      var f = FORMATS[key], ri = rint(0, f.rules.length - 1), others = f.rules.map(function (_, i) { return i; }).filter(function (i) { return i !== ri; });
      var o1 = pick(others), o2 = pick(others.filter(function (i) { return i !== o1; }));
      var good = brokenOnly(f, [ri]), two = brokenOnly(f, [ri, o1].sort()), wrongRule = brokenOnly(f, [o2]), valid = f.make();
      var opts = [good, two, wrongRule, valid], seen = {};
      opts = opts.filter(function (o) { if (!o || seen[o]) return false; seen[o] = 1; return true; });
      return { kind: 'mcq', q: intro(f) + 'A programmer adds the validation test <b>' + f.rules[ri].test + '</b> Which item of erroneous data fails <b>only</b> this test?', options: opts.map(C), answer: 0,
        why: C(good) + ' breaks only that rule. ' + C(two) + ' also breaks another rule, ' + C(wrongRule) + ' passes this test but fails a different one, and ' + C(valid) + ' is valid.' };
    };
  }
  function whichRule(key) {
    return function () {
      var f = FORMATS[key], ri = rint(0, f.rules.length - 1), c = brokenOnly(f, [ri]);
      return { kind: 'mcq', q: intro(f) + 'The ' + f.name + ' ' + C(c) + ' is rejected. Which validation test does it fail?', options: f.rules.map(function (r) { return r.test; }), answer: ri,
        why: 'Check ' + C(c) + ' against each rule in turn: it passes every test except "' + f.rules[ri].test + '"' };
    };
  }
  B['CSC-T2-10'] = { title: 'Design validation checks for a code format', items: [
    { skill: 'definition', kind: 'mcq', q: 'What is <b>validation</b>?',
      options: ['An automatic check that input data follows set rules before it is accepted', 'Typing data in twice and checking that both copies match', 'Scrambling data so that it cannot be understood if it is intercepted by someone', 'Removing unnecessary detail from a problem so it is easier to solve'], answer: 0,
      why: 'Validation checks that data is sensible and allowed, such as the right length or format. Double entry is verification, scrambling is encryption and removing detail is abstraction.' },
    { skill: 'definition', kind: 'mcq', q: 'A booking form refuses the date 31/02/2027 because February never has 31 days. Which process has rejected the data?',
      options: ['Validation', 'Encryption', 'Compression', 'Authentication'], answer: 0, why: 'The program checked the input against a rule (the number of days in each month) before accepting it, which is validation.' },
    { skill: 'definition', kind: 'mcq', q: 'A user types their age as 41 instead of 14. The program\'s range check (0 to 120) accepts it. What does this show?',
      options: ['Validation checks that data is allowed, not that it is actually correct', 'The range check has been written incorrectly, so it accepts values it should reject', 'The program needs a length check instead of a range check', 'Validation only works on text, not on numbers'], answer: 0,
      why: '41 is a sensible, allowed age, so it passes. Validation cannot know which allowed value is the true one.' },
    { skill: 'definition', kind: 'mcq', q: 'Which statement about validation is true?',
      options: ['It can reject impossible data but cannot prove that data is correct', 'It guarantees that every single item of data entered by a user is correct', 'It is only carried out after the data has been saved to a file', 'It is the same as checking a user\'s password'], answer: 0,
      why: 'Validation spots data that breaks the rules. Data that obeys the rules can still be wrong, and checking a password is authentication, not validation.' },
    { skill: 'definition', kind: 'mcq', q: 'Why do programs validate input data?',
      options: ['To stop impossible data being processed and causing wrong results or crashes', 'To make sure that only the real owner of an account is able to log in to it', 'To reduce the file size of the data before it is stored', 'To prove that every value the user types is the true value'], answer: 0,
      why: 'Rejecting data that breaks the rules at the start means later processing works on sensible values only. Logging in is authentication, and validation cannot prove data is true.' },
    { skill: 'check-type', kind: 'mcq', q: 'Which type of validation check is <code>len(postcode) &lt;= 8</code>?',
      options: ['Length check', 'Range check', 'Format check', 'Check digit'], answer: 0, why: '<code>len()</code> counts the characters, so this is a length check.' },
    { skill: 'check-type', kind: 'mcq', q: 'A test asks "Are characters 1 to 3 upper case letters and characters 4 to 6 digits?" Which type of validation check is this?',
      options: ['Format (pattern) check', 'Length check', 'Range check', 'Check digit'], answer: 0, why: 'It checks the kind of character in each position, which is a format (pattern) check.' },
    { skill: 'check-type', kind: 'mcq', q: 'A program only accepts a day of the month between 1 and 31. Which type of validation check is this?',
      options: ['Range check', 'Length check', 'Format check', 'Check digit'], answer: 0, why: 'It checks that a number lies between a lower and an upper limit, which is a range check.' },
    { skill: 'check-type', kind: 'mcq', q: 'The last digit of a product number is worked out from the other digits. The program recalculates it and compares. What is this check called?',
      options: ['Check digit', 'Range check', 'Length check', 'Presence check'], answer: 0, why: 'A check digit is calculated from the rest of the code. If someone mistypes a digit, the recalculated value will usually not match.' },
    { skill: 'check-type', kind: 'mcq', q: 'Which Python condition is a <b>range</b> check on <code>rating</code>?',
      options: ['<code>rating &gt;= 1 and rating &lt;= 5</code>', '<code>len(rating) &gt;= 1 and len(rating) &lt;= 5</code>', '<code>rating.isupper()</code>', '<code>rating != ""</code>'], answer: 0, why: 'A range check tests that a value is between two limits, here 1 and 5 inclusive.' },
    { skill: 'test-design', kind: 'mcq', q: 'Codes are 2 upper case letters followed by 4 digits, such as <code>KD2047</code>. The test table already contains "Is the code 6 characters long?". Which is a suitable <b>additional</b> validation test?',
      options: ['Are characters 3 to 6 digits?', 'Does the code have six characters in it?', 'Is the code valid?', 'Is this the customer\'s real code?'], answer: 0,
      why: 'A new test must check one different feature. The second option repeats the length test, "Is it valid?" is too vague, and validation cannot check whose code it is.' },
    { skill: 'test-design', kind: 'mcq', q: 'Codes are 3 upper case letters, a hyphen, then 4 digits, such as <code>MRB-6093</code>. For the test "Is character 4 a hyphen?" a student gives the data <code>mrb/6093</code>. Why is this poor test data?',
      options: ['It breaks two rules, so a rejection would not prove the hyphen test works', 'It is valid, so it would not be rejected by any test', 'It is too long, so the length test would reject it before the hyphen test', 'Test data for a format check must contain only digits'], answer: 0,
      why: '<code>mrb/6093</code> has lower case letters as well as a wrong character 4. Good erroneous data breaks only the rule being tested.' },
    { skill: 'test-design', kind: 'mcq', q: 'Why should erroneous data for a validation test break <b>only</b> the rule being tested?',
      options: ['So that if it is rejected, you know this particular test caused the rejection', 'So that the data can also be used as normal test data later', 'Because a program can only ever check one single validation rule at any one time', 'Because data that breaks two rules would be accepted'], answer: 0,
      why: 'If the data broke two rules, a different check could reject it and hide the fact that the test you are checking does not work.' },
    { skill: 'test-design', kind: 'mcq', q: 'Codes are 1 upper case letter followed by 5 digits. A student writes the test "Is the code correct?". Why does this earn no mark?',
      options: ['It does not say which single feature of the code is being checked', 'Tests must be written as Python code, never as questions in English', 'Codes with letters cannot be validated', 'It should have been written as a range check'], answer: 0,
      why: 'Each test must check one stated feature, for example "Is character 1 an upper case letter?". A vague test cannot be carried out.' },
    { skill: 'fails-only', family: 'fmt-member', gen: failsOnly('member') },
    { skill: 'fails-only', family: 'fmt-locker', gen: failsOnly('locker') },
    { skill: 'fails-only', family: 'fmt-parcel', gen: failsOnly('parcel') },
    { skill: 'which-rule', family: 'fmt-locker', gen: whichRule('locker') },
    { skill: 'which-rule', family: 'fmt-parcel', gen: whichRule('parcel') },
    { skill: 'check-digit', family: 'fmt-member', gen: function () {
      var f = FORMATS.member, c = brokenOnly(f, [2]), d = c.slice(2, 7), s = digitSum(d);
      return { kind: 'num', q: intro(f) + 'The code ' + C(c) + ' fails the check-character test. What should character 8 be?', answer: s % 10, unit: '',
        why: 'Add characters 3 to 7: ' + d.split('').join(' + ') + ' = ' + s + '. The last digit of ' + s + ' is ' + (s % 10) + '.' };
    } },
    { skill: 'spot-valid', family: 'fmt-member', gen: function () {
      var f = FORMATS.member, pool = [brokenOnly(f, [0]), brokenOnly(f, [1]), brokenOnly(f, [2])].concat(validCodes(f, 3));
      var opts = shuffle(pool).slice(0, 5);
      if (!opts.some(function (c) { return fails(f, c).length === 0; })) opts[0] = pool[3];
      if (opts.every(function (c) { return fails(f, c).length === 0; })) opts[0] = pool[0];
      return { kind: 'multi', q: f.intro + f.table + 'Which of these codes are <b>valid</b>?', options: opts.map(C),
        answers: opts.map(function (c, i) { return fails(f, c).length === 0 ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: 'Check every rule for each code: 8 characters, two upper case letters, five digits, then a final digit equal to the last digit of the sum of the five digits.' };
    } },
    { skill: 'fails-only', family: 'fmt-parcel', gen: function () {
      var f = FORMATS.parcel, two = [[0, 1], [1, 2], [2, 3], [0, 2]], pairOrOne = Math.random() < 0.5, idx = pairOrOne ? pick(two) : [rint(0, 3)];
      var c = brokenOnly(f, idx), opts = f.rules.map(function (r) { return r.test; });
      return { kind: 'multi', q: f.intro + f.table + 'Which validation tests would the data ' + C(c) + ' fail?', options: opts, answers: idx,
        why: 'Test ' + C(c) + ' against each rule separately. It fails: ' + idx.map(function (i) { return '"' + f.rules[i].test + '"'; }).join(' and ') + '.' };
    } }
  ] };

  /* ======================================================================
     CSC-T3-19 Vigenere cipher
     ====================================================================== */
  var ABC = 'abcdefghijklmnopqrstuvwxyz';
  var PLAIN = ['garden', 'planet', 'silver', 'bridge', 'rocket', 'window', 'castle', 'forest', 'harbour', 'lantern', 'meadow', 'puzzle', 'orchard', 'pebble', 'whistle', 'compass'];
  var KEYS = ['sky', 'map', 'owl', 'fern', 'lamp', 'tide', 'gold', 'jump', 'wax', 'dove'];
  function n(c) { return ABC.indexOf(c); }
  function L26(i) { return ABC.charAt(((i % 26) + 26) % 26); }
  function enc(word, key, off, startAt) { off = off || 0; startAt = startAt || 0; return word.split('').map(function (c, i) { return L26(n(c) + n(key[(i + startAt) % key.length]) + off); }).join(''); }
  function dec(word, key, off, startAt) { off = off || 0; startAt = startAt || 0; return word.split('').map(function (c, i) { return L26(n(c) - n(key[(i + startAt) % key.length]) + off); }).join(''); }
  function keyLine(word, key) { return word.split('').map(function (_, i) { return key[i % key.length]; }).join(''); }
  function numRow(from, to) { var h = ''; for (var i = from; i < to; i++) h += '<td>' + ABC[i] + '&nbsp;=&nbsp;' + i + '</td>'; return '<tr>' + h + '</tr>'; }
  var NUMS = '<table class="mc-table">' + numRow(0, 9) + numRow(9, 18) + numRow(18, 26) + '</table>';
  var VNOTE = 'Use a = 0, b = 1, ..., z = 25. A keyword letter shifts the message letter forward by its number, wrapping from z back to a.' + NUMS;
  // One row of the square, shown as plaintext -> ciphertext pairs in three lines.
  function squareRow(k) {
    function part(a, b) { var h = ''; for (var i = a; i < b; i++) h += '<td>' + ABC[i] + '&nbsp;&rarr;&nbsp;' + L26(i + n(k)) + '</td>'; return '<tr>' + h + '</tr>'; }
    return '<table class="mc-table">' + part(0, 9) + part(9, 18) + part(18, 26) + '</table>';
  }
  function uniq(list) { var s = {}; return list.filter(function (x) { if (s[x]) return false; s[x] = 1; return true; }); }
  B['CSC-T3-19'] = { title: 'Vigenere cipher', items: [
    { skill: 'concept', kind: 'mcq', q: 'Why is the Vigenere cipher harder to crack than a Caesar cipher?',
      options: ['The shift changes from letter to letter, following the keyword', 'It replaces every letter with a symbol from a grid', 'It writes the message in a zigzag across several rows', 'It uses a shift of 13 instead of a shift of 3'], answer: 0,
      why: 'A Caesar cipher uses one fixed shift, so it can be cracked by trying 25 shifts. In Vigenere, each keyword letter gives a different shift, so the same letter is not always encrypted the same way.' },
    { skill: 'concept', kind: 'mcq', q: 'In a Vigenere square, what shift does the row that starts with <b>a</b> give?',
      options: ['No shift (0)', 'A shift of 1', 'A shift of 26', 'A shift of 25'], answer: 0, why: 'Row a is the normal alphabet, so each letter stays the same. Row b shifts by 1, row c by 2, and so on.' },
    { skill: 'concept', kind: 'mcq', q: 'The message is longer than the keyword. What should be done with the keyword?',
      options: ['Repeat it again and again under the message until every letter has a keyword letter', 'Use only the first letter of the keyword for the rest of the message', 'Leave the remaining message letters unencrypted', 'Write the keyword backwards for the remaining letters'], answer: 0,
      why: 'The keyword is repeated from its first letter until it is as long as the message, so every letter gets its own shift.' },
    { skill: 'concept', kind: 'mcq', q: 'When <b>decrypting</b> with a Vigenere square, how is each plaintext letter found?',
      options: ['Find the ciphertext letter in the keyword letter\'s row and read the letter at the top of that column', 'Find the keyword letter\'s row and read the letter where it meets the ciphertext letter\'s column', 'Find the ciphertext letter\'s row and read across to the keyword letter\'s column', 'Find the keyword letter in the top row and move back three places'], answer: 0,
      why: 'Decrypting reverses encrypting: in the keyword row, locate the ciphertext letter, then the column heading is the original letter.' },
    { skill: 'concept', kind: 'mcq', q: 'When <b>encrypting</b> one letter with a Vigenere square, which row and column are used?',
      options: ['The keyword letter\'s row and the plaintext letter\'s column', 'The plaintext letter\'s row and the ciphertext letter\'s column', 'The first row and the keyword letter\'s column', 'The keyword letter\'s row and the keyword letter\'s column'], answer: 0,
      why: 'Go along the row that starts with the keyword letter until you reach the column headed by the plaintext letter. The letter where they meet is the ciphertext.' },
    { skill: 'concept', kind: 'mcq', q: 'The word <b>bulletin</b> is encrypted with a Vigenere keyword. Why might its two letter <b>l</b>s become different ciphertext letters?',
      options: ['Each l lines up with a different keyword letter, so each gets a different shift', 'The cipher always changes repeated letters to stop them being noticed', 'The second l is shifted backwards instead of forwards', 'Only vowels are shifted in a Vigenere cipher'], answer: 0,
      why: 'The shift depends on the keyword letter above each message letter. Letters 3 and 4 of the message line up with different keyword letters unless the keyword has the same letter twice in a row.' },
    { skill: 'concept', kind: 'mcq', q: 'A student decrypts a Vigenere message and gets nonsense from the fourth letter onwards. The first three letters were correct. What is the most likely mistake?',
      options: ['They skipped a letter, so the keyword got out of step with the message', 'They used the wrong keyword for every letter', 'They encrypted instead of decrypting from the start', 'They used a Caesar shift of 3 for every letter'], answer: 0,
      why: 'If the first letters are right, the keyword and method were correct. Losing step with the repeated keyword makes every later letter use the wrong shift.' },
    { skill: 'encrypt', gen: function () {
      var p = rint(0, 25), k = rint(1, 25), c = L26(p + k);
      var opts = uniq([c, L26(p + k + 1), L26(p - k), L26(p + k - 1), L26(p + k + 2)]).slice(0, 4);
      return { kind: 'mcq', q: VNOTE + 'Encrypt the plaintext letter <b>' + L26(p) + '</b> using the keyword letter <b>' + L26(k) + '</b>.', options: opts, answer: 0,
        why: L26(p) + ' = ' + p + ' and ' + L26(k) + ' = ' + k + '. ' + p + ' + ' + k + ' = ' + (p + k) + (p + k > 25 ? ', and ' + (p + k) + ' - 26 = ' + (p + k - 26) : '') + ', which is <b>' + c + '</b>.' };
    } },
    { skill: 'decrypt', gen: function () {
      var c = rint(0, 25), k = rint(1, 25), p = L26(c - k);
      var opts = uniq([p, L26(c + k), L26(c - k + 1), L26(c - k - 1), L26(c - k + 2)]).slice(0, 4);
      return { kind: 'mcq', q: VNOTE + 'Decrypt the ciphertext letter <b>' + L26(c) + '</b> that was encrypted with the keyword letter <b>' + L26(k) + '</b>.', options: opts, answer: 0,
        why: 'Decrypting shifts backwards: ' + L26(c) + ' = ' + c + ', ' + L26(k) + ' = ' + k + '. ' + c + ' - ' + k + ' = ' + (c - k) + (c - k < 0 ? ', and ' + (c - k) + ' + 26 = ' + (c - k + 26) : '') + ', which is <b>' + p + '</b>.' };
    } },
    { skill: 'square', gen: function () {
      var k = L26(rint(1, 25)), p = L26(rint(0, 25)), c = L26(n(p) + n(k));
      var opts = uniq([c, L26(n(p) + n(k) + 1), L26(n(p) - n(k)), L26(n(k) + n(k)), L26(n(p) + n(k) - 1)]).slice(0, 4);
      return { kind: 'mcq', q: 'Here is the row of a Vigenere square for the keyword letter <b>' + k + '</b>, shown as plaintext &rarr; ciphertext pairs.' + squareRow(k) + 'What is the plaintext letter <b>' + p + '</b> encrypted as?', options: opts, answer: 0,
        why: 'Find the pair that starts with ' + p + ': in the ' + k + ' row it becomes <b>' + c + '</b> (a shift of ' + n(k) + ').' };
    } },
    { skill: 'square', gen: function () {
      var k = L26(rint(1, 25)), c = L26(rint(0, 25)), p = L26(n(c) - n(k));
      var opts = uniq([p, L26(n(c) + n(k)), L26(n(c) - n(k) + 1), L26(n(c) - n(k) - 1), c]).slice(0, 4);
      return { kind: 'mcq', q: 'Here is the row of a Vigenere square for the keyword letter <b>' + k + '</b>, shown as plaintext &rarr; ciphertext pairs.' + squareRow(k) + 'Decrypt the ciphertext letter <b>' + c + '</b>.', options: opts, answer: 0,
        why: 'Decrypting works backwards: find the pair whose ciphertext letter is <b>' + c + '</b>. Its plaintext letter (the column heading in the full square) is <b>' + p + '</b>.' };
    } },
    { skill: 'align', gen: function () {
      var w = pick(PLAIN), key = pick(KEYS), pos = rint(key.length + 1, w.length), ans = key[(pos - 1) % key.length];
      var opts = uniq([ans].concat(key.split('')).concat([w[pos - 1]])).slice(0, 5);
      return { kind: 'mcq', q: 'The message <b>' + w + '</b> is encrypted with the keyword <b>' + key + '</b>. Which keyword letter lines up with letter ' + pos + ' of the message (<b>' + w[pos - 1] + '</b>)?', options: opts, answer: 0,
        why: 'Repeat the keyword under the message: <code>' + w + '</code> / <code>' + keyLine(w, key) + '</code>. Letter ' + pos + ' lines up with <b>' + ans + '</b>.' };
    } },
    { skill: 'align', gen: function () {
      var w = pick(PLAIN), key = pick(KEYS), right = keyLine(w, key);
      var doubled = w.split('').map(function (_, i) { return key[Math.floor(i / 2) % key.length]; }).join('');
      var shifted = w.split('').map(function (_, i) { return key[(i + 1) % key.length]; }).join('');
      var stretched = w.split('').map(function (_, i) { return key[Math.min(i, key.length - 1)]; }).join('');
      var opts = uniq([right, shifted, stretched, doubled]);
      return { kind: 'mcq', q: 'The message <b>' + w + '</b> is to be encrypted with the keyword <b>' + key + '</b>. Which line shows the keyword correctly lined up under the message?', options: opts.map(C), answer: 0,
        why: 'Start with the first keyword letter under the first message letter and repeat the keyword until it is ' + w.length + ' letters long: <code>' + right + '</code>.' };
    } },
    { skill: 'encrypt', gen: function () {
      var w = pick(PLAIN), key = pick(KEYS), c = enc(w, key);
      var opts = uniq([c, enc(w, key, 1), enc(w, key, 0, 1), dec(w, key), enc(w, key, -1)]).slice(0, 4);
      return { kind: 'mcq', q: VNOTE + 'Encrypt the word <b>' + w + '</b> using the keyword <b>' + key + '</b>.', options: opts.map(C), answer: 0,
        why: 'Line up <code>' + w + '</code> with <code>' + keyLine(w, key) + '</code> and shift each letter forward by its keyword letter. For example ' + w[0] + ' + ' + key[0] + ' (' + n(w[0]) + ' + ' + n(key[0]) + ') gives ' + c[0] + '. The result is <code>' + c + '</code>.' };
    } },
    { skill: 'decrypt', gen: function () {
      var w = pick(PLAIN), key = pick(KEYS), c = enc(w, key);
      var opts = uniq([w, dec(c, key, 0, 1), enc(c, key), dec(c, key, -1), dec(c, key, 1)]).slice(0, 4);
      return { kind: 'mcq', q: VNOTE + 'The ciphertext <b>' + c + '</b> was made with the keyword <b>' + key + '</b>. Decrypt it.', options: opts.map(C), answer: 0,
        why: 'Line up <code>' + c + '</code> with <code>' + keyLine(c, key) + '</code> and shift each letter back by its keyword letter. For example ' + c[0] + ' - ' + key[0] + ' (' + n(c[0]) + ' - ' + n(key[0]) + ') gives ' + w[0] + '. The message is <code>' + w + '</code>.' };
    } },
    { skill: 'decrypt', gen: function () {
      var w = pick(PLAIN), key = pick(KEYS), c = enc(w, key), i = rint(key.length, w.length - 1);
      var opts = uniq([w[i], L26(n(c[i]) - n(key[0])), L26(n(c[i]) + n(key[i % key.length])), L26(n(c[i]) - n(key[(i + 1) % key.length]))]).slice(0, 4);
      return { kind: 'mcq', q: VNOTE + 'The ciphertext <b>' + c + '</b> was made with the keyword <b>' + key + '</b>. What is letter ' + (i + 1) + ' of the decrypted message?', options: opts, answer: 0,
        why: 'Letter ' + (i + 1) + ' of the ciphertext is ' + c[i] + ' and it lines up with keyword letter ' + key[i % key.length] + ' (' + keyLine(c, key) + '). ' + n(c[i]) + ' - ' + n(key[i % key.length]) + ' gives <b>' + w[i] + '</b> (adding 26 if needed).' };
    } },
    { skill: 'key-shift', gen: function () {
      var k = rint(1, 25);
      return { kind: 'num', q: 'In a Vigenere cipher using a = 0 to z = 25, by how many places does the keyword letter <b>' + L26(k) + '</b> shift a message letter?', answer: k, unit: '',
        why: 'Count from a = 0: ' + L26(k) + ' is letter number ' + k + ', so encrypting with it gives each matching message letter a forward shift of ' + k + '.' };
    } },
    { skill: 'key-shift', gen: function () {
      var p = rint(0, 25), k = rint(1, 25), c = L26(p + k);
      var opts = uniq([L26(k), L26(k + 1), L26(-k), L26(k - 1), L26(p)]).slice(0, 4);
      return { kind: 'mcq', q: VNOTE + 'The plaintext letter <b>' + L26(p) + '</b> was encrypted as <b>' + c + '</b>. Which keyword letter was used?', options: opts, answer: 0,
        why: 'The shift is ' + c + ' - ' + L26(p) + ' = ' + n(c) + ' - ' + p + (n(c) - p < 0 ? ' + 26' : '') + ' = ' + k + ', and letter number ' + k + ' is <b>' + L26(k) + '</b>.' };
    } },
    { skill: 'key-shift', gen: function () {
      var w = pick(PLAIN), key = pick(KEYS), c = enc(w, key), wrong = enc(c, key);
      return { kind: 'mcq', q: 'A student is asked to decrypt <b>' + c + '</b> with the keyword <b>' + key + '</b>. They write <b>' + wrong + '</b>. What mistake did they make?',
        options: ['They shifted each letter forward instead of backward', 'They used only the first keyword letter for every letter', 'They forgot to repeat the keyword after it ran out', 'They started the keyword from its second letter'], answer: 0,
        why: 'Each letter of ' + wrong + ' is the ciphertext letter moved <i>forward</i> by its keyword letter (for example ' + c[0] + ' + ' + key[0] + ' = ' + wrong[0] + '). Decrypting needs a backward shift, which gives ' + w + '.' };
    } },
    { skill: 'encrypt', gen: function () {
      var w = pick(PLAIN), key = pick(KEYS), c = enc(w, key), i = rint(key.length, w.length - 1);
      var opts = uniq([c[i], L26(n(w[i]) + n(key[0])), L26(n(w[i]) - n(key[i % key.length])), L26(n(w[i]) + n(key[i % key.length]) + 1)]).slice(0, 4);
      return { kind: 'mcq', q: VNOTE + 'The word <b>' + w + '</b> is encrypted with the keyword <b>' + key + '</b>. What is letter ' + (i + 1) + ' of the ciphertext?', options: opts, answer: 0,
        why: 'Letter ' + (i + 1) + ' is ' + w[i] + ' and it lines up with ' + key[i % key.length] + ' (' + keyLine(w, key) + '). ' + n(w[i]) + ' + ' + n(key[i % key.length]) + ' gives <b>' + c[i] + '</b> (taking away 26 if needed).' };
    } },
    { skill: 'concept', kind: 'mcq', q: 'Using a = 0 to z = 25, which formula encrypts a plaintext letter P with keyword letter K?',
      options: ['(P + K) mod 26', '(P - K) mod 26', '(P × K) mod 26', '(K - P) mod 26'], answer: 0,
      why: 'Encryption shifts forward by the keyword letter, so add K. The mod 26 wraps past z back to a. Decryption uses (C - K) mod 26.' },
    { skill: 'concept', kind: 'mcq', q: 'Which keyword gives exactly the same result as a Caesar cipher with a shift of 3?',
      options: ['<code>d</code>', '<code>c</code>', '<code>e</code>', '<code>abc</code>'], answer: 0,
      why: 'd = 3, and a one-letter keyword repeated gives the same shift to every letter, which is a Caesar shift of 3. <code>c</code> would be a shift of 2 and <code>e</code> a shift of 4.' }
  ] };
})();
