/* Group G08 mastery bank: Networks, media, protocols and the internet; Mobile networks, IP addresses and internet hardware; Encryption, network security, ethics and new technology; Pixels, Rail Fence, hardware devices, environment and the law. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  // Single-answer item: the correct option is listed first; the engine shuffles the options.
  function mc(skill, q, right, wrong, why, extra) {
    var o = { skill: skill, kind: 'mcq', q: q, options: [right].concat(wrong), answer: 0, why: why };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  // Select-all item: correct options first.
  function ms(skill, q, rights, wrongs, why, extra) {
    var o = { skill: skill, kind: 'multi', q: q, options: rights.concat(wrongs), answers: rights.map(function (_, i) { return i; }), why: why };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  function num(skill, q, answer, unit, why, extra) {
    var o = { skill: skill, kind: 'num', q: q, answer: answer, unit: unit || '', why: why };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }

  /* ------------------------------------------------------------------ CSC-T56-01 */
  B['CSC-T56-01'] = { title: 'Network types: LAN, WAN, PAN and why we network', items: [
    ms('why-network', "Which of these are reasons for connecting computers in a network?",
      ["To share files between users", "To share hardware such as a printer", "To share one internet connection"], ["To make each computer’s processor run faster", "To stop every virus from reaching the computers"],
      "Networks let users share data, hardware and an internet connection, and communicate. They do not speed up each CPU or block all malware."),
    mc('why-network', "A café networks its tills so that menu prices can be changed on every till at once. Which is a <b>different</b> reason for networking the tills?",
      "All the tills can share one receipt printer in the kitchen", ["Prices can be updated on every till at the same moment", "Each till’s processor will run at a higher clock speed once the tills are joined together", "The tills will no longer need any electricity"],
      "The question already gives updating prices, so repeating it scores nothing. Sharing hardware such as a printer is a different reason."),
    mc('why-network', "Why does networking help the IT technician in a school with 300 computers?",
      "Software updates and backups can be managed centrally from one place", ["Every computer will need its own separate printer and internet line", "The computers no longer need an operating system", "Pupils can no longer save any files"],
      "On a network, the technician can install updates, back up data and set security for all computers from one central point instead of visiting each one."),
    mc('why-network', "A family connects its laptops, tablets and a games console to one home network. Which benefit does this give?",
      "All the devices can use the same internet connection", ["Each device gets its own separate internet line from the ISP", "The devices no longer need to be charged", "Each device can store unlimited files without filling up its own storage"],
      "A home network lets every device share the single broadband connection."),
    { skill: 'lan-wan-pan', gen: function () {
      var s = pick([
        { t: "Pupils save their work to a file server in the same school building.", a: "LAN", why: "The network covers one site, and the school owns the equipment, so it is a LAN." },
        { t: "A bank links the computer networks of its branches in 30 different cities.", a: "WAN", why: "The network joins LANs that are far apart, over a large geographical area, so it is a WAN." },
        { t: "A smartwatch sends heart-rate data to the phone in its owner’s pocket by Bluetooth.", a: "PAN", why: "The devices belong to one person and are linked around them, so it is a personal area network." },
        { t: "Laura makes a video call to her cousin in another country.", a: "WAN", why: "The call travels across the internet between countries. The internet is the largest WAN." },
        { t: "Wireless earbuds play music streamed from a phone held by the same person.", a: "PAN", why: "A short-range network of one person’s devices is a PAN." },
        { t: "Six laptops in one small office share a network storage drive in the same room.", a: "LAN", why: "The devices are on one site in a small area, so this is a LAN." }
      ]);
      return mc('lan-wan-pan', s.t + " Which type of network is being used?", s.a, ["LAN", "WAN", "PAN"].filter(function (o) { return o !== s.a; }).concat(["Peer-to-peer"]), s.why + " Peer-to-peer is a usage model, not a network type.");
    } },
    mc('lan-wan-pan', "Which describes a LAN?",
      "A network covering a small area such as one building, usually with equipment the organisation owns", ["A network that joins networks in different countries using rented links", "A network of devices close to one person, such as a phone and earbuds", "A network that can only use cables and can never use any wireless connections at all"],
      "A LAN is local: one building or one site, with equipment usually owned by the organisation. LANs can be wired, wireless or both."),
    mc('lan-wan-pan', "Which describes a WAN?",
      "A network covering a large area that joins LANs together, often over rented links", ["A network inside one office, using equipment owned by the company", "A network of one person’s devices, such as a watch and a phone", "A network that must always be wireless"],
      "A WAN spreads over a large geographical area and connects separate LANs, usually using links rented from telecoms companies."),
    mc('lan-wan-pan', "Which is the largest example of a WAN?",
      "The internet", ["A school’s computer network", "A phone linked to a smartwatch", "An office network on one floor"],
      "The internet joins networks all over the world, so it is the biggest WAN."),
    mc('lan-wan-pan', "Which describes a PAN?",
      "A network of devices around one person, such as a phone shared with a laptop as a hotspot", ["A network covering one school site, owned by the school", "A network that joins company sites in different countries", "A network in which a central server stores files for everyone in the building"],
      "A personal area network links devices used by one person over a short distance, for example by Bluetooth or a phone hotspot."),
    ms('compare-lan-wan', "Which of these are correct differences between a LAN and a WAN?",
      ["A LAN covers a small area; a WAN covers a large geographical area", "LAN equipment is usually owned by the organisation; WAN links are often rented"], ["A LAN must be wired; a WAN must be wireless", "A WAN can never connect LANs together", "A LAN always has more users than a WAN"],
      "The real differences are the area covered and who owns the links. Either type can be wired or wireless."),
    mc('compare-lan-wan', "Which statement correctly compares the performance of a LAN and a WAN?",
      "A LAN usually has higher bandwidth and lower latency than a WAN", ["A WAN usually has higher bandwidth and lower latency than a LAN", "A LAN and a WAN always have exactly the same speed and delay", "A LAN has no latency at all because all of its cables are short"],
      "Data on a LAN travels a short distance over the organisation’s own links, so it usually moves more bits per second with less delay."),
    mc('compare-lan-wan', "A student writes, ‘A WAN is slower.’ Which answer makes this point precise enough to score?",
      "Data on a WAN usually has higher latency, meaning more delay", ["A WAN is slower than a LAN", "A WAN is slower and also worse", "A WAN is not as fast as other networks that are smaller"],
      "‘Slower’ is vague. A precise answer says what is slower, such as lower bandwidth or higher latency (more delay)."),
    mc('compare-lan-wan', "Which pair gives two <b>genuinely different</b> differences between a LAN and a WAN?",
      "Area covered; who owns the links", ["Covers a big area; covers many cities", "Spans a large region; reaches across countries", "Large geographical size; long distances between sites"],
      "‘Big area’ and ‘many cities’ are the same idea about size. Area and ownership of the links are two separate points."),
    mc('compare-lan-wan', "Kemal says a LAN cannot be wireless. Which reply is correct?",
      "A LAN can use cables, wireless links or both", ["He is right: wireless links only exist in WANs", "He is right: wireless links only exist in PANs", "A LAN must be wireless and can never use cables to connect any of its devices together"],
      "Network type depends on the area covered, not on the media. Wi-Fi in a home or office is part of a LAN."),
    mc('usage-model', "Which describes the client-server model?",
      "A central server provides services such as file storage and logins, and clients request them", ["Every device is equal and shares files directly with the others", "Devices around one person connect by Bluetooth", "Networks in different cities are joined by rented links"],
      "In client-server, the server holds shared resources and services, and the client computers ask the server for them."),
    mc('usage-model', "Which describes the peer-to-peer model?",
      "Every device is equal and shares directly with the others, with no central server", ["One powerful server stores files for all the other computers", "A network covers a single building owned by one company", "Clients must log in to a server before they can share anything with any of the other devices"],
      "In a peer-to-peer network, devices act as equals and share resources directly."),
    mc('usage-model', "A school has a central computer that stores pupils’ files and checks their logins. Which usage model is this?",
      "Client-server", ["Peer-to-peer", "Personal area network", "Wide area network"],
      "A central server providing logins and storage to the other computers is the client-server model."),
    mc('usage-model', "Two friends copy holiday photos directly between their laptops at home with no server involved. Which usage model is this?",
      "Peer-to-peer", ["Client-server", "Local area network", "Wide area network"],
      "The laptops share directly as equals with no central server, so the model is peer-to-peer."),
    mc('usage-model', "Amir’s phone sends photos straight to the tablet next to it by Bluetooth. Which network type and usage model does this use?",
      "PAN, peer-to-peer", ["LAN, client-server", "WAN, peer-to-peer", "PAN, client-server"],
      "The devices are close to one person (PAN) and they share directly with no server (peer-to-peer)."),
    mc('usage-model', "Which of these is a usage model rather than a network type?",
      "Client-server", ["LAN", "WAN", "PAN"],
      "LAN, WAN and PAN describe the area a network covers. Client-server and peer-to-peer describe how the devices share."),
    mc('usage-model', "What is the main drawback of a client-server network?",
      "If the server fails, clients cannot reach the shared files or log in", ["Each client must store a copy of every file", "Files cannot be backed up centrally", "The clients have to share their own files directly with each other without any control at all"],
      "Everything depends on the central server, so a server failure stops access to its services."),
    mc('usage-model', "Why might a small home office choose peer-to-peer instead of client-server?",
      "It is cheaper and simpler because no dedicated server is needed", ["It gives the best central control of security", "It makes backups happen automatically for everyone", "It is the only model that lets devices share a printer with each other in the same room"],
      "Peer-to-peer needs no server to buy or manage, which suits a small number of devices.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-03 */
  B['CSC-T56-03'] = { title: 'Network protocols: what they are and which one does what', items: [
    mc('purpose', "What is a network protocol?",
      "A set of agreed rules that lets devices communicate", ["A cable that links two devices together", "A program that removes viruses from emails", "A device that forwards packets between different networks across the internet"],
      "A protocol is a set of rules, covering things such as the format of data, timing and error checking, that devices follow to communicate."),
    mc('purpose', "Why are network protocols needed?",
      "So devices made by different companies can understand each other’s data", ["So data can travel without using any cables or radio waves", "So that every device on the network runs exactly the same operating system and software", "So that files take up less storage space"],
      "If everyone follows the same rules, a phone from one maker can talk to a server from another."),
    ms('purpose', "Which of these can a protocol define?",
      ["The format of the data", "The timing of transmissions", "How errors are detected"], ["The price of the network cable", "The colour of the router’s case"],
      "Protocols set the rules for communication: how data is formatted, when it is sent and how errors are checked."),
    mc('purpose', "A student describes a protocol as ‘a program that sends data’. Why is this wrong?",
      "A protocol is a set of rules, not a program", ["A protocol is a type of cable", "A protocol only receives data", "Protocols are only used inside the CPU, and are never used for networks or for sending data"],
      "Software follows protocols, but the protocol itself is the agreed set of rules."),
    mc('email', "Which protocol is used to send an email?",
      "SMTP", ["IMAP", "POP3", "HTTP"],
      "SMTP (Simple Mail Transfer Protocol) sends email. IMAP and POP3 are used to fetch email that has arrived."),
    ms('email', "Which of these are email protocols?",
      ["SMTP", "POP3", "IMAP"], ["HTTPS", "FTP"],
      "SMTP sends email; POP3 and IMAP fetch it. HTTPS is for secure web pages and FTP is for transferring files."),
    mc('email', "Kofi reads his email on his phone, his laptop and a work computer. Which protocol should he use to fetch it, and why?",
      "IMAP, because emails stay on the server so all his devices stay in step", ["POP3, because emails are downloaded to one device and removed from the server", "SMTP, because it is used for sending and receiving all email", "FTP, because it can move his emails between the three devices one file at a time"],
      "IMAP keeps the messages on the server, so whatever he reads or deletes on one device shows the same on the others."),
    mc('email', "Mrs Okafor checks email on one desktop computer only, wants copies she can read offline, and has very little server storage. Which protocol suits her best?",
      "POP3", ["IMAP", "SMTP", "HTTPS"],
      "POP3 downloads the email to her one device and usually removes it from the server, saving server space and keeping offline copies."),
    mc('email', "Why is POP3 a poor choice for someone who uses several devices?",
      "Email downloaded to one device is usually removed from the server, so the others miss it", ["POP3 can only be used to send email, not to receive it", "POP3 does not work on mobile phones", "POP3 makes every device show a different password screen each time an email arrives"],
      "Because POP3 usually deletes messages from the server once downloaded, they only appear on the first device that fetches them."),
    mc('email', "Which statement is <b>incorrect</b>?",
      "POP3 is used to send email to another user", ["SMTP is used to send email", "IMAP keeps email on the server", "POP3 downloads email to a device"],
      "POP3 and IMAP only fetch email. Sending is done using SMTP."),
    mc('email', "Sana uses a tablet and a smartphone for email. She chooses IMAP. Which justification is best?",
      "Messages stay on the server, so her tablet and phone always show the same inbox", ["IMAP is the newest protocol, so it must be the best one", "IMAP is used to send her emails", "IMAP is better and faster than every other protocol in every situation"],
      "A good justification links the protocol to her situation: two devices that both need the same up-to-date inbox."),
    mc('web-file', "What is HTTP used for?",
      "Transferring web pages from a web server to a browser", ["Sending email from one user to another", "Moving large files to a file server", "Linking a phone to earbuds"],
      "HTTP (HyperText Transfer Protocol) is the set of rules browsers and web servers use to request and send web pages."),
    mc('web-file', "How does HTTPS differ from HTTP?",
      "HTTPS encrypts the data sent between the browser and the server", ["HTTPS sends email instead of web pages", "HTTPS only works on wired connections", "HTTPS makes web pages load without needing a web server or any connection to the internet"],
      "HTTPS is the secure version of HTTP: the data is encrypted, so it cannot be read if intercepted."),
    mc('web-file', "Why should an online shop use HTTPS on its payment page?",
      "So card details are encrypted and cannot be read if intercepted", ["So the page loads with brighter colours", "So the customer does not need an internet connection", "So the card details are stored on the customer’s own computer instead of being sent to the shop"],
      "Payment data must be protected while it travels across the internet, which HTTPS does by encrypting it."),
    mc('web-file', "A web designer needs to upload 250 image files to the web server that hosts a website. Which protocol is designed for this?",
      "FTP", ["SMTP", "POP3", "IMAP"],
      "FTP (File Transfer Protocol) is used to move files between computers over a network, such as uploading files to a web server."),
    { skill: 'web-file', gen: function () {
      var s = pick([
        { t: "viewing a public news web page", a: "HTTP", w: ["SMTP", "POP3", "FTP"] },
        { t: "entering bank card details on a shopping website", a: "HTTPS", w: ["FTP", "SMTP", "POP3"] },
        { t: "uploading a folder of files to a remote server", a: "FTP", w: ["IMAP", "SMTP", "POP3"] },
        { t: "sending a message to a friend’s email address", a: "SMTP", w: ["IMAP", "POP3", "FTP"] },
        { t: "keeping an email inbox the same on a phone and a laptop", a: "IMAP", w: ["SMTP", "POP3", "FTP"] },
        { t: "downloading emails to one computer and removing them from the server", a: "POP3", w: ["IMAP", "SMTP", "HTTP"] }
      ]);
      var why = { HTTP: "HTTP transfers web pages from a web server to a browser.", HTTPS: "HTTPS is used when data must be encrypted, such as card details.", FTP: "FTP is the protocol for transferring files between computers.", SMTP: "SMTP is used to send email.", IMAP: "IMAP keeps email on the server so every device stays in step.", POP3: "POP3 downloads email to one device and usually deletes it from the server." };
      return mc('web-file', "Which protocol is mainly used for " + s.t + "?", s.a, s.w, why[s.a]);
    } },
    mc('ethernet-wifi', "What is Ethernet?",
      "A family of protocols for wired LANs, setting cables, speeds and error checking", ["A family of protocols for wireless LANs that use radio waves", "A protocol for sending email between servers", "A type of router that converts signals for the telephone line and connects the home to the ISP"],
      "Ethernet sets the rules for wired local networks: the cable and connector types, the speeds and how packets are checked for errors."),
    mc('ethernet-wifi', "What is the main difference between Ethernet and Wi-Fi?",
      "Ethernet is for wired LANs; Wi-Fi is for wireless LANs using radio waves", ["Ethernet is for wireless LANs; Wi-Fi is for wired LANs using copper cables", "Ethernet is for email; Wi-Fi is for web pages", "Ethernet only works in WANs; Wi-Fi only works in PANs"],
      "Both are families of protocols for LANs. Ethernet uses cables; Wi-Fi uses radio waves."),
    mc('ethernet-wifi', "At which layer of the TCP/IP model does Ethernet work?",
      "Data link", ["Application", "Transport", "Network"],
      "Ethernet controls how packets move across the physical wired connection between devices, which is the data link layer."),
    mc('ethernet-wifi', "A student says, ‘Ethernet is the cable.’ Which reply is most accurate?",
      "Ethernet is a set of rules, which includes the types of cable that may be used", ["Yes, Ethernet is simply another word for any network cable", "No, Ethernet is the radio signal used by Wi-Fi", "No, Ethernet is the software that shows web pages in a browser on a computer or phone"],
      "Ethernet is a family of protocols. It specifies cables and connectors, but it is the rules, not the cable itself."),
    mc('purpose', "What would happen if two devices tried to communicate using different, incompatible protocols?",
      "They could not correctly understand each other’s data", ["The data would be sent twice as fast", "The data would automatically be encrypted", "The devices would join together and become a single computer that shares one processor"],
      "Without the same agreed rules, the receiver cannot interpret what the sender transmits."),
    mc('email', "Which pair of protocols would a phone’s email app most likely use?",
      "SMTP to send messages and IMAP to fetch them", ["IMAP to send messages and SMTP to fetch them", "FTP to send messages and HTTP to fetch them", "POP3 to send messages and SMTP to fetch them from the server for every device"],
      "Sending always uses SMTP. For a phone, which is usually one of several devices, IMAP is the sensible way to fetch messages.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-05 */
  function topoSvg(kind) {
    var ink = '#303a4c', blue = '#195d9b';
    var box = function (x, y, t, w) { w = w || 44; return '<rect x="' + (x - w / 2) + '" y="' + (y - 14) + '" width="' + w + '" height="28" rx="4" fill="#9aa5b8" stroke="' + ink + '" stroke-width="2"/><text x="' + x + '" y="' + (y + 5) + '" font-size="12" text-anchor="middle" fill="' + ink + '">' + t + '</text>'; };
    var line = function (a, b, c, d) { return '<line x1="' + a + '" y1="' + b + '" x2="' + c + '" y2="' + d + '" stroke="' + blue + '" stroke-width="3"/>'; };
    var lines = [], boxes = [], i, j, pts = [];
    if (kind === 'bus') {
      lines.push(line(30, 110, 370, 110));
      lines.push('<rect x="22" y="100" width="8" height="20" fill="' + ink + '"/><rect x="370" y="100" width="8" height="20" fill="' + ink + '"/>');
      [70, 145, 220, 295, 345].forEach(function (x, k) { var y = k % 2 ? 175 : 45; lines.push(line(x, 110, x, y)); boxes.push(box(x, y, 'PC')); });
    } else if (kind === 'star') {
      for (i = 0; i < 6; i++) { var a = Math.PI * 2 * i / 6; pts.push([200 + 140 * Math.cos(a), 110 + 80 * Math.sin(a)]); }
      pts.forEach(function (p) { lines.push(line(200, 110, p[0], p[1])); boxes.push(box(p[0], p[1], 'PC')); });
      boxes.push(box(200, 110, 'Switch', 60));
    } else {
      var n = kind === 'ring' ? 6 : 5;
      for (i = 0; i < n; i++) { var b = -Math.PI / 2 + Math.PI * 2 * i / n; pts.push([200 + 130 * Math.cos(b), 112 + 82 * Math.sin(b)]); }
      if (kind === 'ring') { for (i = 0; i < n; i++) lines.push(line(pts[i][0], pts[i][1], pts[(i + 1) % n][0], pts[(i + 1) % n][1])); }
      else { for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) lines.push(line(pts[i][0], pts[i][1], pts[j][0], pts[j][1])); }
      pts.forEach(function (p) { boxes.push(box(p[0], p[1], 'PC')); });
    }
    return '<svg viewBox="0 0 400 220" role="img" aria-label="Network diagram showing how the computers are connected">' + lines.join('') + boxes.join('') + '</svg>';
  }
  var TOPO_NAME = { bus: 'Bus', ring: 'Ring', star: 'Star', mesh: 'Mesh' };
  B['CSC-T56-05'] = { title: 'Network topologies: bus, ring, star and mesh', items: [
    { skill: 'identify', gen: function () {
      var k = pick(['bus', 'ring', 'star', 'mesh']);
      var why = { bus: "Every computer joins one shared main cable with a terminator at each end: a bus.", ring: "The computers are joined in a closed loop, each linked to the next: a ring.", star: "Each computer has its own cable to a central switch: a star.", mesh: "Each computer is linked directly to several (here all) of the others: a mesh." };
      return mc('identify', "Name the topology shown in the diagram.", TOPO_NAME[k], ['Bus', 'Ring', 'Star', 'Mesh'].filter(function (o) { return o !== TOPO_NAME[k]; }), why[k], { svg: topoSvg(k), family: 'topo-' + k });
    } },
    mc('identify', "What is a network topology?",
      "The layout of how the devices in a network are connected", ["The speed at which data travels across a network", "The set of rules devices use to communicate", "The area that a network covers, such as one building or a whole country"],
      "Topology describes the arrangement of the links between devices, such as bus, ring, star or mesh."),
    mc('benefits', "State one benefit of the topology shown.",
      "If one device’s cable breaks, only that device loses its connection", ["It needs the least cable of any topology because all devices share one backbone", "Data travels in one direction round a loop, so it never collides", "Every device has a direct link to every other device"],
      "In a star, each device has its own cable to the switch, so a single broken cable affects only that device.", { svg: topoSvg('star'), family: 'topo-star' }),
    mc('drawbacks', "State one drawback of the topology shown.",
      "If the main cable breaks, the whole network stops working", ["If the central switch fails, every device loses its connection", "It needs a very large amount of cable because every device links to every other", "Data must pass through every other device around the loop"],
      "In a bus, all devices share one backbone cable, so a break in it stops the whole network.", { svg: topoSvg('bus'), family: 'topo-bus' }),
    mc('fault-tolerance', "Explain why the topology shown is fault tolerant.",
      "There are several routes between devices, so data can go round a broken link", ["Every device is connected to a central switch that never fails", "All the devices share one cable, which is very strong", "The computers in this layout are more powerful, so they do not break down"],
      "In a mesh, if one link fails, packets can be sent along a different route, so the network keeps working.", { svg: topoSvg('mesh'), family: 'topo-mesh' }),
    mc('benefits', "Which is a characteristic of the topology shown?",
      "Data travels in one direction round the loop, so packets do not collide", ["Every device has its own cable to a central switch", "A terminator is fitted at each end of the backbone cable", "Each device is linked directly to every other device on the network"],
      "In a ring, devices form a closed loop and data passes in one direction, so there are no collisions.", { svg: topoSvg('ring'), family: 'topo-ring' }),
    { skill: 'classify', gen: function () {
      var s = pick([
        { c: "Performance falls as more devices are added, because data on the shared cable collides more often", a: "Bus" },
        { c: "Each device has its own cable to a central switch", a: "Star" },
        { c: "Every device has a direct link to every other device", a: "Mesh" },
        { c: "The devices form a closed loop and data travels one way round it", a: "Ring" },
        { c: "A terminator is fitted at each end of the main cable", a: "Bus" },
        { c: "Data can be rerouted around a failed link along another path", a: "Mesh" },
        { c: "Faults are easy to find because each device has its own separate link", a: "Star" }
      ]);
      var why = { Bus: "A bus uses one shared backbone cable with terminators, so collisions increase as devices are added.", Star: "In a star each device has its own link to the central switch.", Mesh: "A mesh has many links between devices, giving several possible routes.", Ring: "A ring is a closed loop with data flowing in one direction." };
      return mc('classify', "Which topology matches this characteristic?<br><b>" + s.c + "</b>", s.a, ['Bus', 'Ring', 'Star', 'Mesh'].filter(function (o) { return o !== s.a; }), why[s.a]);
    } },
    mc('drawbacks', "Which is a drawback of a star topology?",
      "If the central switch fails, the whole network stops", ["If the main backbone cable breaks, every device loses its connection", "Data collides more and more often on the one shared cable as devices are added", "One broken link anywhere in the loop can stop the network"],
      "A star depends on its central switch. The other options describe bus and ring topologies."),
    mc('drawbacks', "Why does a star topology usually need more cable than a bus?",
      "Every device needs its own cable to the central switch", ["Every device must be linked to every other device", "The cable has to go round in a loop twice", "Star networks use a separate cable for sending and another separate cable for receiving data"],
      "In a star each device has a separate cable run to the switch, while in a bus devices share one backbone."),
    mc('benefits', "Which is a benefit of a bus topology?",
      "It is cheap to set up because it needs little cable", ["It is very fault tolerant because there are many routes", "Faults are easy to isolate because each device has its own cable", "It never slows down, however many devices are added to the cable"],
      "A bus uses one main cable that all devices tap into, so it needs less cable and is cheap for a small network."),
    mc('drawbacks', "Why is a full mesh network expensive?",
      "It needs a large amount of cabling because each device links to many others", ["It needs a very expensive central switch", "It can only use fibre-optic cable", "Each device must be a server that stores every file on the whole network"],
      "The number of links grows quickly as devices are added, so a mesh uses a lot of cable and is harder to set up and manage."),
    mc('drawbacks', "Why can a ring network fail if one link breaks?",
      "Data travels round the loop, so a break can stop it reaching devices further round", ["All data must pass through a central switch", "The terminators stop working when a link breaks", "Every device in a ring must have its own direct link to each of the others"],
      "In a simple ring there is only one path round the loop, so one broken link can cut off the route."),
    mc('drawbacks', "Why does a bus network slow down as more devices are added?",
      "All devices share one cable, so more data collides and must be resent", ["Each new device needs its own switch", "The terminators get weaker with each device", "More devices make the cable shorter, so the signals have less distance to travel"],
      "On a shared backbone only one transmission can succeed at a time; more devices mean more collisions and resending."),
    mc('fault-tolerance', "Which answer explains fault tolerance well enough to score?",
      "If one link fails, data can take another route to reach the destination", ["It is very reliable", "It is a strong and good network", "It never has any problems because it is reliable and well designed"],
      "Fault tolerance must be explained by the reason: multiple routes mean traffic can be rerouted when part of the network fails."),
    mc('fault-tolerance', "Why is the internet built as a huge partial mesh?",
      "Data can be routed around failed links, so the network keeps working when parts fail", ["It needs the least cable of any design", "Every device connects to one central switch", "All data travels in one direction round a single loop that circles the whole world"],
      "With many interconnected routes, the internet can keep delivering data when individual links or routers fail."),
    mc('fault-tolerance', "A student writes, ‘A mesh is fault tolerant because its computers never fail.’ What is the flaw?",
      "Fault tolerance is about other routes existing when a link or node fails", ["Mesh networks are not fault tolerant at all", "Only star networks can be fault tolerant", "Mesh networks do not contain any computers, only switches and routers"],
      "Devices and links can still fail. The point is that traffic can be rerouted along other paths."),
    mc('choose', "A hospital network must keep working even if any single cable between its key servers is cut. Which topology is most suitable?",
      "Mesh", ["Bus", "Ring", "Star"],
      "A mesh provides several routes between devices, so cutting one link does not stop communication."),
    mc('choose', "A school wants a layout where faults are easy to trace and a new computer can be added without disturbing the others. Which topology suits this best?",
      "Star", ["Bus", "Ring", "Full mesh"],
      "In a star each device has its own cable to the switch, so a fault affects one cable and new devices just plug into the switch."),
    mc('cabling', "One more computer is added to a full mesh network and one more to a star network. Why does the mesh need much more new cabling?",
      "In a full mesh the new computer must link to every existing device; in a star it needs one cable to the switch", ["In a full mesh every cable must be fibre-optic, but a star can use copper cables", "In a star the new computer shares the existing backbone cable, so no new cable is needed", "In a full mesh the data travels round a loop, so the loop must be rebuilt every time"],
      "Every device in a full mesh links directly to every other device, so each new one adds a link to all the others. In a star each device has just one cable to the central switch."),
    { skill: 'cabling', gen: function () {
      var n = rint(6, 24);
      return num('cabling', "A star network connects " + n + " computers to one central switch. Each computer has its own cable. How many cables join the computers to the switch?",
        n, '', "In a star, each device has one cable to the central switch, so " + n + " computers need " + n + " cables.");
    } },
    mc('choose', "A charity sets up five computers for a two-day event and wants the cheapest wired layout, accepting that one cable fault could stop everything. Which topology fits?",
      "Bus", ["Mesh", "Star", "Ring with a backup loop"],
      "A bus needs the least cable, so it is cheapest, but a break in the main cable stops the whole network."),
    mc('benefits', "Which is a benefit of a mesh topology?",
      "Data can still be delivered if one link fails", ["It is the cheapest topology to install because it needs very little cable", "It needs only one central switch", "It is the simplest topology to set up and manage"],
      "Because there are many links, a mesh offers alternative routes, so one failed link does not stop data getting through.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-11 */
  B['CSC-T56-11'] = { title: 'The internet, the web, DNS and the parts of a URL', items: [
    mc('internet-web', "What is the internet?",
      "A worldwide network of networks: the cables, routers and connected devices", ["The collection of web pages linked by hyperlinks", "A program used to view web pages", "A single giant computer owned by one company that stores every website in the world"],
      "The internet is the physical global network that links networks together. The web is one service that runs on it."),
    mc('internet-web', "What is the World Wide Web?",
      "A collection of web pages and resources, linked by hyperlinks and accessed over the internet", ["The cables and routers that link networks around the world", "The company that connects homes to the internet", "A protocol for sending email messages from one mail server to another mail server"],
      "The WWW is a service: pages and other resources fetched using HTTP or HTTPS, running on top of the internet."),
    mc('internet-web', "Which statement correctly describes the difference between the internet and the web?",
      "The internet is the network infrastructure; the web is a service that uses it", ["The internet and the web are two names for exactly the same thing", "The web is the infrastructure; the internet is a service that runs on it", "The internet only carries email, and the web carries everything else, including all video and gaming"],
      "Think of the internet as the roads and the web as one kind of traffic using them."),
    mc('internet-web', "Which statement is correct?",
      "Email uses the internet but is not part of the World Wide Web", ["Email is the same thing as the World Wide Web", "The World Wide Web works without the internet", "The internet is a single web page that links to all the other pages"],
      "The internet carries many services, such as email, online gaming and the web. The web is just one of them."),
    mc('dns', "What does a DNS server do?",
      "It returns the IP address that matches a domain name", ["It returns the domain name that matches an IP address", "It stores every web page on the internet", "It encrypts data sent to websites so it cannot be read by anyone who intercepts it"],
      "DNS works like a phone book: you give it a name such as an online shop’s domain and it returns the number (IP address) needed to reach the server."),
    mc('dns', "A student writes, ‘DNS turns an IP address into a domain name.’ What is wrong?",
      "It is the other way round: DNS turns a domain name into an IP address", ["DNS turns a domain name into a web page", "DNS turns an IP address into a MAC address", "Nothing is wrong: this is exactly the job DNS does whenever a user types a web address"],
      "When you type a domain name, the DNS look-up finds its IP address so your computer can contact the server."),
    mc('dns', "Put these steps in order when a user types a domain name into a browser:<br>P: the browser contacts the web server using the IP address<br>Q: the DNS server replies with the IP address<br>R: the browser asks a DNS server for the domain’s IP address",
      "R, Q, P", ["P, Q, R", "Q, R, P", "R, P, Q"],
      "The browser must first ask DNS for the IP address, receive it, and only then contact the web server."),
    mc('dns', "Why do we use domain names instead of typing IP addresses?",
      "Names are much easier for people to remember than long numbers", ["Domain names make data travel faster because names are shorter than numbers", "Computers cannot use IP addresses", "Domain names encrypt the web page"],
      "Computers route data using IP addresses, but people find names such as a shop’s domain far easier to remember."),
    mc('dns', "A DNS server is not responding. What is the most likely effect?",
      "Websites cannot be reached by their domain names, though typing an IP address may still work", ["All computers on the internet switch off", "Web pages load faster than before, because there is one less step to complete", "Email can only be sent using an IP address written inside the message itself"],
      "Without DNS, names cannot be turned into IP addresses, so look-ups fail even though the servers themselves are still running."),
    { skill: 'url-parts', gen: function () {
      var prot = pick(['https', 'http']), dom = 'www.' + pick(['tidepoolbikes', 'greenleafreads', 'starfieldmaths', 'oakhillrowing']) + pick(['.com', '.org', '.co.uk']);
      var folder = pick(['shop', 'results', 'docs', 'gallery']), file = pick(['price-list.pdf', 'index.html', 'team.jpg', 'fixtures.html']);
      var url = prot + '://' + dom + '/' + folder + '/' + file;
      var parts = { 'protocol': prot, 'domain name': dom, 'folder (path)': folder, 'file name': file };
      var ask = pick(Object.keys(parts));
      return mc('url-parts', "Look at this URL:<br><code>" + url + "</code><br>Which part is the <b>" + ask + "</b>?", "<code>" + parts[ask] + "</code>",
        Object.keys(parts).filter(function (k) { return k !== ask; }).map(function (k) { return "<code>" + parts[k] + "</code>"; }),
        "Reading left to right: <code>" + prot + "</code> is the protocol, <code>" + dom + "</code> is the domain name, <code>" + folder + "</code> is the folder and <code>" + file + "</code> is the file name.");
    } },
    { skill: 'url-parts', gen: function () {
      var dom = 'www.' + pick(['bluecrabtours', 'quartzlearning', 'riversidekits']) + '.net', folder = pick(['media', 'events', 'archive']), file = pick(['map.png', 'tickets.html', 'notes.txt']);
      var url = 'https://' + dom + '/' + folder + '/' + file;
      var items = [['https', 'The protocol'], [dom, 'The domain name'], [folder, 'A folder in the path'], [file, 'The file name']];
      var it = pick(items);
      return mc('url-parts', "In the URL <code>" + url + "</code>, what is <code>" + it[0] + "</code>?", it[1],
        items.map(function (x) { return x[1]; }).filter(function (x) { return x !== it[1]; }),
        "A URL is read as protocol, then domain name, then any folders, then the file name: here <code>" + file + "</code> is the file and <code>" + folder + "</code> is the folder that holds it.");
    } },
    mc('url-parts', "In the address <code>https://www.harbourcycles.com/repairs/booking.html</code>, a student says <code>www.harbourcycles.com</code> is the URL. What is it really?",
      "The domain name; the URL is the whole address", ["The file name; the URL is the folder", "The protocol; the URL is the domain", "The IP address of the server, written in words so that it is easier to read"],
      "The URL is the complete address of the resource. <code>www.harbourcycles.com</code> is just the domain name part."),
    mc('url-parts', "What does a URL identify?",
      "The full address of one resource on the web", ["The physical location of the user’s computer", "The company that provides the user’s internet connection", "The MAC address of the network card"],
      "A URL (uniform resource locator) gives the protocol, domain, path and file name needed to find one particular resource."),
    { skill: 'classify-items', gen: function () {
      var name = pick(['moonbeamfoods', 'kitecraft', 'pebblepost']);
      var items = [
        { t: 'https://www.' + name + '.com', a: 'URL', why: "It includes the protocol and points to a resource, so it is a URL." },
        { t: rint(11, 223) + '.' + rint(0, 255) + '.' + rint(0, 255) + '.' + rint(1, 254), a: 'IP address', why: "Four denary numbers separated by dots form an IPv4 address." },
        { t: name + '.com', a: 'Domain name', why: "A human-friendly name without a protocol or file path is a domain name." }
      ];
      var it = pick(items);
      return mc('classify-items', "What is <code>" + it.t + "</code>?", it.a, ['URL', 'IP address', 'Domain name', 'MAC address'].filter(function (o) { return o !== it.a; }), it.why);
    } },
    mc('isp-terms', "What is an ISP?",
      "A company that connects homes and organisations to the internet", ["A program that displays web pages", "The address of a device on the internet", "A protocol used for sending email between the mail servers of two different companies"],
      "An internet service provider supplies the connection between your home or school network and the rest of the internet."),
    mc('isp-terms', "What is an IP address?",
      "A number that identifies a device on the internet", ["The name of a website", "The company that provides homes and organisations with access to the internet", "The language used to write web pages"],
      "Every device on the internet has an IP address so that data can be sent to it."),
    mc('isp-terms', "What is HTML?",
      "The language used to describe the structure and content of web pages", ["The protocol used to send web pages from a web server to a browser", "The address of a web server", "The company that hosts websites"],
      "HTML (HyperText Markup Language) describes a web page’s content. Browsers fetch it using HTTP or HTTPS and display it."),
    mc('isp-terms', "What is the role of a web server?",
      "It stores web pages and sends them to browsers that request them", ["It converts domain names into IP addresses", "It connects homes to the internet", "It displays web pages on the user’s own screen after they have been downloaded"],
      "A web server holds the site’s files and responds to HTTP or HTTPS requests from browsers."),
    mc('isp-terms', "What is the role of a web browser?",
      "It requests web pages and displays them for the user", ["It stores websites for other people to visit", "It converts IP addresses into domain names", "It provides the user’s connection to the internet through the phone line"],
      "The browser sends HTTP/HTTPS requests to web servers and displays the pages it receives."),
    mc('internet-web', "What links one web page to another?",
      "Hyperlinks", ["Routers", "IP addresses", "Modems"],
      "Hyperlinks are clickable links inside web pages that point to other pages or resources."),
    mc('url-parts', "A URL begins with <code>https</code>. What does this tell the user?",
      "The data sent between browser and server is encrypted", ["The page is stored on the user’s computer", "The website is free to use", "The page can only be opened on a wired connection, not over Wi-Fi"],
      "The protocol part of the URL shows HTTPS is being used, so the connection is encrypted."),
    mc('dns', "DNS is often compared to a phone book. Why?",
      "You look up a name and get back a number: the IP address", ["You look up a number and get back the name of the person who owns that computer", "It lists every web page in alphabetical order", "It stores the phone numbers of ISPs"],
      "Like finding a phone number from a person’s name, DNS finds the IP address from a domain name.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-02 */
  B['CSC-T56-02'] = { title: 'Wired or wireless? Media, pros and cons, and network speed units', items: [
    mc('media', "Which describes the media used by wired networks?",
      "Copper cables carry electrical signals and fibre-optic cables carry pulses of light", ["Copper cables carry radio waves and fibre-optic cables carry sound", "Copper and fibre cables both carry pulses of light only", "Wired networks send data through the air using radio waves from one device to another"],
      "Twisted-pair copper cable carries electrical signals; fibre-optic cable carries pulses of light."),
    mc('media', "How does a wireless network send data?",
      "Using radio waves through the air", ["Using electrical signals along a copper cable", "Using pulses of light in a glass fibre", "Using sound waves that people cannot hear, sent from speakers in the router"],
      "Wireless networks such as Wi-Fi transmit data through the air as radio waves."),
    mc('media', "Which describes one difference between the media of a wired and a wireless network?",
      "Wired sends signals along a cable; wireless sends radio waves through the air", ["Wired uses waves; wireless uses electricity", "Wired is faster; wireless is slower", "Wired networks use radio waves inside a cable, while wireless networks send light through the air"],
      "The difference in media is what carries the signal: a physical cable versus radio waves through the air. ‘Waves’ alone or ‘faster’ does not describe the media."),
    mc('media', "Which answer best describes how a copper network cable carries data?",
      "As electrical signals along the wires", ["As electricity", "As pulses of light", "As radio waves sent along the outside of the cable"],
      "‘Electricity’ alone is too vague. The cable carries data as changing electrical signals."),
    mc('media', "Which of these is a radio frequency band used by Wi-Fi?",
      "5 GHz", ["5 kHz", "50 Hz", "500 Hz"],
      "Wi-Fi uses the 2.4 GHz and 5 GHz bands. Frequencies in hertz or kilohertz are far too low for Wi-Fi."),
    mc('media', "Why are fibre-optic cables used for long links between cities?",
      "Pulses of light can carry very high bandwidth over long distances", ["They carry electrical signals that never weaken", "They send radio waves that pass through mountains", "They are the cheapest and easiest cables to install, even in a small home network"],
      "Fibre carries data as light, which supports very high data rates over long distances with little loss."),
    ms('wired-pros', "Which are advantages of a wired connection over a wireless one?",
      ["A more stable, reliable connection", "Harder for outsiders to intercept", "Often higher bandwidth"], ["Devices can be moved around freely", "No cables need to be installed"],
      "Cables give a steady link that does not weaken through walls, are harder to tap into and often carry more bits per second. Freedom to move and no installation are wireless advantages."),
    ms('wired-pros', "Which are disadvantages of a wired connection compared with wireless?",
      ["Cables must be bought, installed and maintained", "Devices are tied to where the cable reaches", "Loose cables can be a trip hazard"], ["The signal weakens through walls", "It is easy for someone outside to intercept"],
      "Wired networks need cabling work and limit where devices can be used. Weak signals through walls and easy interception are wireless problems."),
    mc('wired-pros', "Which pair gives two <b>different</b> advantages of wired connectivity?",
      "More secure; does not weaken with distance from the router", ["More secure; harder to hack", "Harder to intercept; safer from hackers", "Better security; more protected"],
      "‘More secure’ and ‘harder to hack’ are the same point. Reliability over distance is a separate advantage."),
    mc('wireless', "Which is an advantage of <b>wireless</b> rather than wired connectivity?",
      "Users can move around while staying connected", ["The connection is harder to intercept", "The signal is not weakened by walls", "It always gives a higher bandwidth than any cable, so downloads are quicker"],
      "Wireless frees devices from cables, so people can move around. The other options describe wired connections."),
    mc('wireless', "Why does a laptop’s Wi-Fi connection become slower in a room far from the router?",
      "Radio signals weaken with distance and when passing through walls", ["The laptop’s processor slows down far from the router", "The router sends less data to rooms it cannot see", "The Wi-Fi password expires when the laptop is moved to a different room"],
      "Radio waves lose strength with distance and obstacles, so the connection becomes weaker and slower."),
    mc('wireless', "Why must smartphones usually connect to networks wirelessly?",
      "Most phones have no network cable port", ["Phones cannot use bits per second", "Cables would make the phone’s battery explode", "Wired connections only work with desktop computers built before the year 2000"],
      "Phones are designed to be portable and have no Ethernet port, so they connect by Wi-Fi or mobile data."),
    mc('choose', "Ravi’s gaming PC sits next to the router, and he wants the most reliable connection with the least lag. What should he use?",
      "A wired cable, because it gives a steadier connection", ["Wi-Fi, because radio waves are always faster", "Wi-Fi, because cables cause more interference", "A wired cable, because it lets him move the PC around the house freely"],
      "A cable is not affected by distance, walls or interference, so it gives a more stable, low-delay connection."),
    mc('choose', "Warehouse staff walk around with handheld barcode scanners that must send data constantly. Which connection suits them?",
      "Wireless, because the scanners must stay connected while moving", ["Wired, because cables are easier to carry", "Wired, because scanners have no radio", "Wireless, because it can never be intercepted by anyone outside the building"],
      "Mobile devices need wireless links. Cables would tie the scanners to one place."),
    mc('speed-units', "Which unit is used to measure network data speed?",
      "Megabits per second (Mbps)", ["Megapixels per second", "Mebibytes (MiB)", "Megahertz (MHz)"],
      "Network speed is the number of bits sent each second, for example Mbps or Gbps."),
    mc('speed-units', "Why is mebibytes (MiB) not used as a unit of network speed?",
      "It measures an amount of storage, not bits per second", ["It is too large to be useful for anything", "It is only used for sound files", "It is the same as megabits per second, so it would be confusing to use both names"],
      "Network speed must be a rate in bits per second. A mebibyte is an amount of data, not a rate."),
    { skill: 'speed-units', gen: function () {
      var g = pick([1, 1.5, 2.5, 10, 0.5]), m = R.roundDp(g * 1000, 0);
      return num('speed-units', "A fibre broadband line runs at " + g + " Gbps. What is this speed in Mbps?",
        m, 'Mbps', "1 Gbps = 1,000 Mbps, so " + g + " Gbps = " + g + " × 1,000 = " + fmt(m) + " Mbps.", { display: fmt(m) });
    } },
    { skill: 'speed-units', gen: function () {
      var m = pick([20, 45, 80, 150, 300]), b = m * 1000000;
      return num('speed-units', "A connection runs at " + m + " Mbps. How many bits per second is this?",
        b, 'bits per second', "1 Mbps = 1,000,000 bits per second, so " + m + " Mbps = " + m + " × 1,000,000 = " + fmt(b) + " bits per second.", { display: fmt(b) });
    } },
    { skill: 'speed-units', gen: function () {
      var g = pick([0.2, 0.4, 0.6, 0.8]), m = pick([100, 300, 500, 700, 900]);
      while (m === g * 1000) m = pick([100, 300, 500, 700, 900]);
      var gm = R.roundDp(g * 1000, 0), faster = gm > m ? 'Line A' : 'Line B';
      return mc('speed-units', "Line A runs at " + g + " Gbps and line B runs at " + m + " Mbps. Which statement is correct?",
        faster + " is faster", [(faster === 'Line A' ? 'Line B' : 'Line A') + " is faster", "Both lines run at exactly the same speed", "They cannot be compared because the units are different"],
        g + " Gbps = " + gm + " Mbps, which is " + (gm > m ? "more" : "less") + " than " + m + " Mbps, so " + faster + " is faster.");
    } },
    mc('hotspot', "Priya sets up a personal hotspot on her phone instead of using a café’s free Wi-Fi. Which is the best explained advantage?",
      "Only devices she allows can join, so strangers cannot easily intercept her data", ["The hotspot uses fibre-optic cable, so it is always faster than the café", "Her phone will no longer need a mobile signal at all", "Free Wi-Fi only works with laptops"],
      "On a private hotspot, only her devices connect, which is more secure, and the bandwidth is not shared with lots of strangers."),
    mc('hotspot', "Why can free public Wi-Fi in a busy airport be slow?",
      "Many people share the same bandwidth at once", ["Public Wi-Fi uses copper cables to each seat", "Airports block all secure websites", "Public Wi-Fi only works with older phones that do not support the 5 GHz band at all"],
      "The available bandwidth is divided between everyone connected, so each user gets less."),
    mc('hotspot', "What is a security risk of using open public Wi-Fi?",
      "Other people on the same network may intercept the data being sent", ["The phone’s screen may be damaged", "The battery may be charged too quickly", "Public Wi-Fi permanently deletes the files stored on any device that connects to it"],
      "On an open network, an attacker connected nearby could capture unencrypted data travelling over the air."),
    mc('wireless', "Why can a wireless connection suffer interference?",
      "Other devices using similar radio frequencies can disrupt the signal", ["Light from windows blocks the copper wires", "Cables near the router stop radio waves completely", "Wireless signals travel inside cables that can be bent"],
      "Other radio devices and appliances using nearby frequencies can interfere with Wi-Fi signals.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-04 */
  B['CSC-T56-04'] = { title: 'The TCP/IP model: four layers and what each does', items: [
    mc('layer-names', "What is the correct order of the four TCP/IP layers, from top to bottom?",
      "Application, transport, network, data link", ["Application, network, transport, data link", "Data link, network, transport, application", "Transport, application, network, data link"],
      "From the top: application (programs), transport (packets), network (IP addresses and routing), data link (physical connection)."),
    ms('layer-names', "A diagram of the TCP/IP stack is labelled with only the application and network layers. Which two layers are missing?",
      ["Transport layer", "Data link layer"], ["Physical layer", "Session layer", "Presentation layer"],
      "The 4-layer TCP/IP model is application, transport, network and data link. Physical, session and presentation are not layers of this model."),
    mc('layer-names', "A student names a layer ‘data layer’. What should it be called?",
      "Data link layer", ["Database layer", "Physical data layer", "Data transport layer"],
      "The bottom layer of the TCP/IP model is the data link layer. ‘Data layer’ does not score."),
    mc('layer-names', "Which layer is directly below the application layer?",
      "Transport", ["Network", "Data link", "Physical"],
      "The order from the top is application, transport, network, data link."),
    { skill: 'layer-functions', gen: function () {
      var s = pick([
        { f: "Splits the data into packets and numbers them", a: "Transport" },
        { f: "Adds the sender’s and receiver’s IP addresses to each packet", a: "Network" },
        { f: "Routes each packet across networks towards its destination", a: "Network" },
        { f: "Moves packets across the physical connection between two devices using MAC addresses", a: "Data link" },
        { f: "Contains protocols such as HTTP, FTP and SMTP used by programs", a: "Application" },
        { f: "Puts arriving packets back in order and asks for missing ones to be resent", a: "Transport" },
        { f: "Passes data between the user’s software and the network", a: "Application" }
      ]);
      var why = { Transport: "The transport layer splits data into numbered packets and, at the other end, checks and reassembles them.", Network: "The network layer handles IP addressing and routing between networks.", 'Data link': "The data link layer moves packets over the physical link using MAC addresses.", Application: "The application layer holds the protocols that programs use, such as HTTP, FTP and SMTP." };
      return mc('layer-functions', "Which TCP/IP layer does this?<br><b>" + s.f + "</b>", s.a, ['Application', 'Transport', 'Network', 'Data link'].filter(function (o) { return o !== s.a; }), why[s.a]);
    } },
    mc('layer-functions', "At which TCP/IP layer is the HTTPS protocol found?",
      "Application", ["Transport", "Network", "Data link"],
      "HTTPS is used by programs such as web browsers, so it belongs to the application layer."),
    mc('layer-functions', "Which layer uses MAC addresses to move packets between two devices on the same physical link?",
      "Data link", ["Network", "Transport", "Application"],
      "The data link layer deals with the physical connection between neighbouring devices, using MAC addresses."),
    mc('layer-functions', "Which of these is a job of the network layer?",
      "Adding IP addresses and routing packets towards their destination", ["Splitting data into packets and numbering them", "Providing the email protocol used by the user’s program", "Converting packets into electrical signals on the cable and checking each signal for errors"],
      "The network layer adds source and destination IP addresses and chooses routes across networks."),
    mc('layer-functions', "Which statement is <b>incorrect</b>?",
      "The network layer splits data into packets", ["The transport layer numbers the packets", "The network layer adds IP addresses", "The data link layer uses MAC addresses"],
      "Splitting data into packets is done by the transport layer, not the network layer."),
    mc('layer-functions', "Which row matches a layer to a task correctly?",
      "Transport: checks all packets have arrived", ["Network: puts packets back in the right order", "Application: adds MAC addresses to packets", "Data link: provides the HTTP protocol to the web browser so it can request pages"],
      "Checking and reordering packets is the transport layer’s job. Each of the other rows gives a task from a different layer."),
    mc('layer-functions', "Which layer decides the route a packet takes from one network to another?",
      "Network", ["Transport", "Application", "Data link"],
      "Routing between networks using IP addresses happens at the network layer."),
    mc('layer-functions', "Ethernet and Wi-Fi protocols belong to which layer?",
      "Data link", ["Application", "Transport", "Network"],
      "Ethernet and Wi-Fi control how data crosses the physical (wired or wireless) link, which is the data link layer."),
    ms('receiving', "Packets arrive at Ruth’s computer from the network layer. Which tasks does the transport layer in her computer carry out?",
      ["Checks that all the packets have arrived", "Puts the packets back in the correct order", "Asks for missing or damaged packets to be resent"], ["Adds the sender’s IP address to each packet", "Converts the packets into radio waves"],
      "On receiving, the transport layer checks, reorders and reassembles the packets, requesting any that are missing. Adding IP addresses is a network-layer job when sending."),
    mc('receiving', "As data is sent, which way does it move through the layers, and what happens at the receiver?",
      "Down the layers when sending, then up the layers when receiving", ["Up the layers when sending, then down when receiving", "Straight to the data link layer, skipping the others", "Only through the application layer on both computers"],
      "On the sending device data passes down from application to data link; at the receiver it passes back up."),
    mc('receiving', "At the receiving computer, what does each layer do with the information its partner layer added?",
      "It reads and removes it, then passes the rest up", ["It adds another copy and sends it back", "It encrypts it and stores it on disc", "It ignores it and passes all the data straight to the data link layer"],
      "Each layer removes the header its matching layer added at the sender, then passes the remaining data to the layer above."),
    { skill: 'receiving', gen: function () {
      var n = rint(6, 9), miss = rint(2, n - 1), arr = [];
      for (var i = 1; i <= n; i++) if (i !== miss) arr.push(i);
      arr = shuf(arr);
      return num('receiving', "A message was split into " + n + " numbered packets (1 to " + n + "). The receiving computer gets these packets: <b>" + arr.join(', ') + "</b>. Which packet number must the transport layer ask to be sent again?",
        miss, '', "The transport layer uses the sequence numbers to check every packet from 1 to " + n + " has arrived. Packet " + miss + " is missing, so it is requested again.");
    } },
    mc('packets', "Zoe uploads a large video. On the way, one packet is damaged by interference. What happens?",
      "The receiving transport layer asks for just that packet to be sent again", ["The whole video must be uploaded again from the start", "The network layer repairs the damaged packet by guessing its contents", "The video is saved with that part missing and no packet is resent"],
      "Because the data was split into numbered packets, the receiver can spot the damaged one and request only that packet again, which saves time."),
    mc('packets', "Why is data sent over a network split into packets?",
      "Packets can take different routes, and only lost or damaged packets need resending", ["Packets make the data impossible to intercept", "Packets remove the need for IP addresses", "Packets are always sent along the same single wire so they never get lost"],
      "Small packets share the network efficiently, can be routed separately and can be resent individually if something goes wrong."),
    mc('packets', "What is the purpose of the sequence number added to each packet?",
      "So the receiving computer can put the packets back in the right order", ["So the router knows which country to send it to", "So the packet can be encrypted", "So that the packet travels faster than the others in the same message"],
      "Packets can arrive out of order. Sequence numbers let the transport layer reassemble them correctly."),
    mc('packets', "Which of these is normally found in a packet’s header?",
      "The destination IP address", ["The user’s password for the website", "The full contents of the whole message", "The make and model of the sender’s keyboard"],
      "Headers carry control information such as source and destination addresses and the sequence number; the data itself is the payload."),
    mc('why-layers', "What is one benefit of using a layered model such as TCP/IP?",
      "Each layer can be changed or fixed without changing the others", ["Data no longer needs to be split into packets", "Every layer does the same job, which gives a backup", "It removes the need for any protocols at all"],
      "Layers divide the work into separate jobs, so for example a new wireless standard can be used without rewriting web browsers."),
    mc('why-layers', "A company replaces its Wi-Fi equipment with a newer standard. Why do its web browsers still work without changes?",
      "Only the data link layer changed; the layers above are unaffected", ["Web browsers do not use networks", "The application layer does the data link layer’s job", "The new Wi-Fi standard also replaces every application program on the company’s computers"],
      "Because the model is layered, a change at one layer does not force changes in the others."),
    mc('layer-names', "A question names the application and transport layers and asks for the other two. Which answer scores?",
      "Network and data link", ["Application and transport", "Internet and physical", "Session and presentation"],
      "Repeating layers already given scores nothing. The remaining TCP/IP layers are network and data link.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-06 */
  B['CSC-T56-06'] = { title: 'Mobile generations: 3G, 4G and 5G', items: [
    mc('basics', "What are 3G, 4G and 5G?",
      "Generations of wireless mobile communication standards", ["Types of wired network cable", "Speeds of a computer’s processor", "Versions of the IP addressing system used to give each device on the internet a unique number"],
      "3G, 4G and 5G are successive generations of standards for mobile (cellular) data. All of them are wireless."),
    mc('basics', "Put the mobile generations in order from oldest to newest.",
      "3G, 4G, 5G", ["5G, 4G, 3G", "4G, 3G, 5G", "3G, 5G, 4G"],
      "Each new generation, 3G then 4G then 5G, brought higher bandwidth and lower latency."),
    mc('bandwidth-latency', "What does bandwidth mean?",
      "The amount of data that can be sent each second", ["The delay between sending a request and getting a reply", "The distance a signal can travel from a mast", "The number of masts in a country"],
      "Bandwidth is the data rate: how many bits can be transferred each second."),
    mc('bandwidth-latency', "What does latency mean?",
      "The delay between sending a request and getting a response", ["The amount of data that can be sent each second", "The frequency used by the radio signal", "The number of devices that can connect to one mast at the same time"],
      "Latency is delay. Lower latency means quicker responses."),
    { skill: 'bandwidth-latency', gen: function () {
      var s = pick([
        { t: "A film downloads in seconds instead of minutes.", a: "Higher bandwidth" },
        { t: "A player’s button press reaches the game server almost instantly.", a: "Lower latency" },
        { t: "Several 4K videos can stream on one phone network cell at once.", a: "Higher bandwidth" },
        { t: "A video call no longer has an awkward pause before the other person replies.", a: "Lower latency" },
        { t: "A remote-controlled robot reacts to the operator’s command with almost no delay.", a: "Lower latency" },
        { t: "A large app update finishes downloading much sooner.", a: "Higher bandwidth" }
      ]);
      var why = { 'Higher bandwidth': "Moving more data each second makes large downloads and streams quicker: that is bandwidth.", 'Lower latency': "Less delay between an action and the response is lower latency." };
      return mc('bandwidth-latency', "Which feature of a newer mobile generation explains this improvement?<br><b>" + s.t + "</b>", s.a, ["Higher bandwidth", "Lower latency", "Longer range from each mast", "Lower radio frequency"].filter(function (o) { return o !== s.a; }), why[s.a]);
    } },
    mc('bandwidth-latency', "A student writes, ‘5G has lower latency, so you can download more data each second.’ What is wrong?",
      "Downloading more data each second is bandwidth; latency is the delay", ["5G has higher latency than 4G", "Latency is the range of the mast", "Nothing is wrong: latency and bandwidth mean exactly the same thing for mobile networks"],
      "Bandwidth and latency are different. Lower latency means less delay; higher bandwidth means more data per second."),
    mc('benefits', "Jonah plays fast online games on his phone. Which is the best explained benefit of 5G rather than 3G?",
      "Lower latency means his actions reach the game server with less delay, so the game feels responsive", ["5G is better", "5G is faster and newer", "5G has a longer range, so he can play anywhere in the country without needing masts nearby"],
      "An explained benefit links a feature (low latency) to what the user notices (quick responses in the game)."),
    mc('benefits', "Which answer explains a benefit rather than just stating a property?",
      "Higher bandwidth means a family can stream films on several phones without buffering", ["5G has higher bandwidth", "5G uses higher frequencies", "5G is a newer generation than 4G"],
      "A property such as ‘higher bandwidth’ needs to be linked to what it lets the user do."),
    ms('benefits', "Which of these are true of 5G?",
      ["It uses wireless communication", "It has lower latency than 4G", "It has higher bandwidth than 3G"], ["It needs a cable to each phone", "Its masts reach further than 3G masts"],
      "5G is wireless, with more bandwidth and less delay than earlier generations. Its higher frequencies travel shorter distances."),
    mc('benefits', "Why is 5G well suited to the Internet of Things?",
      "It can connect many more devices in the same area", ["It only works with smartphones", "It uses less bandwidth than 3G", "It does not need any masts, because each device talks straight to a satellite"],
      "5G can support a much larger number of connections, which suits huge numbers of sensors and smart devices."),
    mc('benefits', "What is the Internet of Things?",
      "Everyday devices, such as fridges and sensors, connected to the internet", ["A list of the websites on the internet", "A type of network cable", "The cables and routers that make up the internet in a single country"],
      "The IoT is the network of everyday objects that collect and share data over the internet."),
    mc('benefits', "A stadium holds 60,000 fans all using their phones. Why might 5G give them a better service than 4G?",
      "It can handle many more connections in a busy area, so the connection stays reliable", ["It reduces the number of phones in the stadium", "It switches the phones to wired connections", "It makes every phone use the 2.4 GHz Wi-Fi band so that they share one connection"],
      "5G supports far more devices per area, which keeps connections working in crowded places."),
    mc('benefits', "A surgeon controls a robotic arm in another hospital over a mobile network. Which 5G feature matters most?",
      "Very low latency, so the arm responds immediately", ["A lower radio frequency than 4G", "Longer range from each mast", "Lower bandwidth, so less data is sent and the arm moves more carefully"],
      "Any delay could be dangerous, so the low latency of 5G is the key feature here."),
    mc('frequency', "Why do mobile networks benefit from moving to higher radio frequency bands?",
      "Wider channels are available, so more data can be sent each second", ["The signal travels much further from each mast", "Fewer masts are needed to cover a country", "The signal passes through thick walls more easily than lower frequencies do"],
      "Higher bands have much more spectrum free, so wider channels can be used, giving higher bandwidth."),
    mc('frequency', "What is a drawback of the higher frequencies used by 5G?",
      "They travel shorter distances, so more masts are needed closer together", ["They carry less data than 3G", "They have much higher latency", "They can only be used by wired devices plugged into the network"],
      "Higher-frequency signals do not travel as far and are blocked more easily, so 5G networks need many more masts."),
    mc('frequency', "Which statement about 5G is <b>incorrect</b>?",
      "Its higher frequencies give it a longer range than 3G", ["It uses new, higher frequency bands", "It has higher bandwidth than 4G", "It needs masts placed closer together"],
      "Higher frequencies travel less far, so 5G has a shorter range per mast, not a longer one."),
    mc('frequency', "Why has 5G reached many rural areas later than cities?",
      "It needs many masts close together, which is costly where few people live", ["Rural phones cannot receive radio waves", "5G only works in buildings taller than ten floors", "Rural areas already have faster wired fibre to every house, so no mobile service is needed"],
      "Because each 5G mast covers a small area, covering sparsely populated land needs many expensive masts for few users."),
    mc('frequency', "Why were new frequency bands opened up for 5G?",
      "The older bands were crowded, and the higher bands have wider channels free", ["Older bands could not carry any digital data", "New bands let signals travel further", "The older bands are now used only by wired Ethernet networks inside buildings"],
      "Lower bands are heavily used. Higher bands had lots of unused spectrum, so wide channels could be given to 5G."),
    mc('compare', "Compared with 3G, what did 4G mainly allow phone users to do?",
      "Stream high-quality video smoothly thanks to higher bandwidth", ["Make phone calls for the first time", "Connect to the internet without any wireless signal", "Use wired connections instead of radio signals to reach the nearest mast"],
      "4G’s much higher bandwidth made smooth video streaming on phones practical."),
    mc('compare', "Which statement about mobile generations is correct?",
      "Each newer generation offers higher bandwidth and lower latency", ["Each newer generation has higher latency", "Each newer generation uses lower frequencies only", "Each newer generation needs fewer masts than the one before, so it is cheaper to build"],
      "The general trend from 3G to 4G to 5G is more data per second and less delay."),
    mc('compare', "A delivery company wants its vans to send live video from dashboard cameras to the office. Why would 5G be better than 3G?",
      "Higher bandwidth lets the live video upload smoothly without breaking up", ["3G cannot send any data at all from vehicles", "5G works without any masts", "5G uses lower frequencies that reach every road in the country from a single mast"],
      "Live video needs a lot of data per second; 5G’s higher bandwidth can carry it reliably."),
    mc('compare', "A self-driving car must receive a warning about a hazard ahead as fast as possible. Why does low latency matter?",
      "The warning arrives with less delay, so the car can react sooner", ["The warning will contain more pictures", "The car can download maps of other countries", "The car’s battery will be charged more quickly while it is driving along the road"],
      "Low latency reduces the time between the message being sent and received, which matters for safety.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-13 */
  function chainSvg() {
    var ink = '#303a4c', blue = '#195d9b', grey = '#9aa5b8';
    var box = function (x, y, t, w) { return '<rect x="' + (x - w / 2) + '" y="' + (y - 16) + '" width="' + w + '" height="32" rx="4" fill="#9aa5b8" stroke="' + ink + '" stroke-width="2"/><text x="' + x + '" y="' + (y + 5) + '" font-size="13" text-anchor="middle" fill="' + ink + '">' + t + '</text>'; };
    var line = function (a, b, c, d, dash) { return '<line x1="' + a + '" y1="' + b + '" x2="' + c + '" y2="' + d + '" stroke="' + blue + '" stroke-width="3"' + (dash ? ' stroke-dasharray="6 5"' : '') + '/>'; };
    return '<svg viewBox="0 0 520 200" role="img" aria-label="Diagram: a desktop and a WAP connect to box X, which connects to box Y, then box Z, then the ISP and the internet">' +
      line(60, 60, 150, 100) + line(60, 150, 150, 100) + line(20, 175, 60, 150, true) + line(190, 100, 270, 100) + line(310, 100, 370, 100) + line(410, 100, 460, 100) +
      box(60, 55, 'Desktop', 70) + box(60, 150, 'WAP', 50) + '<text x="10" y="195" font-size="12" fill="' + grey + '">tablet</text>' +
      box(170, 100, 'X', 40) + box(290, 100, 'Y', 40) + box(390, 100, 'Z', 40) + box(485, 100, 'ISP', 50) + '</svg>';
  }
  B['CSC-T56-13'] = { title: 'Connecting to the internet: switch, WAP, router and modem', items: [
    mc('component-role', "What does a switch do?",
      "Connects wired devices in a LAN and sends each packet only to the device it is meant for", ["Converts digital data into signals for the ISP’s line", "Lets wireless devices join a wired network", "Forwards packets between the home network and the internet using IP addresses on every hop"],
      "A switch links devices inside a LAN and uses MAC addresses to deliver each packet only to its intended device."),
    mc('component-role', "What does a wireless access point (WAP) do?",
      "Lets wireless devices join the wired network", ["Converts signals for the telephone line", "Connects the LAN to other networks", "Stores the web pages that wireless devices request so they load faster"],
      "A WAP sends and receives radio signals so that laptops, phones and tablets can connect to the wired network."),
    mc('component-role', "What does a router do?",
      "Forwards packets between different networks, such as the LAN and the internet", ["Lets wireless devices join a wired network", "Converts digital data into signals for the ISP line", "Sends each packet only to one device inside the LAN using its MAC address"],
      "A router connects networks together and decides where to forward each packet using IP addresses."),
    mc('component-role', "What does a modem do?",
      "Converts digital data into signals that can travel over the ISP’s line, and back again", ["Sends packets only to the device they are meant for", "Lets wireless devices connect to the switch", "Chooses the best route for packets between the switch and the WAP inside the building"],
      "The modem changes the network’s digital data into the type of signal the ISP’s line carries, and converts incoming signals back."),
    { skill: 'component-role', gen: function () {
      var s = pick([
        { f: "Converts the network’s digital data into signals for the broadband line", a: "Modem" },
        { f: "Forwards packets between the home LAN and the internet", a: "Router" },
        { f: "Lets a tablet with no network port join the network by radio", a: "Wireless access point" },
        { f: "Uses MAC addresses to send each packet only to the right wired device", a: "Switch" },
        { f: "Has a cable connection to the switch and talks to laptops by radio", a: "Wireless access point" },
        { f: "Sits between the router and the ISP’s line", a: "Modem" }
      ]);
      var why = { Modem: "A modem converts between digital data and the signals on the ISP’s line, so it sits next to the ISP connection.", Router: "A router forwards packets between networks, such as the LAN and the internet.", 'Wireless access point': "A WAP connects wireless devices to the wired network and is cabled to the switch.", Switch: "A switch connects wired devices in the LAN and delivers packets using MAC addresses." };
      return mc('component-role', "Which component matches this description?<br><b>" + s.f + "</b>", s.a, ['Switch', 'Router', 'Modem', 'Wireless access point'].filter(function (o) { return o !== s.a; }), why[s.a]);
    } },
    mc('order', "Which order shows the path from a desktop computer out to the internet?",
      "Desktop, switch, router, modem, ISP, internet", ["Desktop, modem, router, switch, ISP, internet", "Desktop, router, switch, modem, ISP, internet", "Desktop, ISP, modem, router, switch, internet"],
      "Devices connect to the switch; the router links the LAN to other networks; the modem connects to the ISP line; the ISP links to the internet."),
    mc('order', "In the diagram, boxes X, Y and Z are a switch, a router and a modem. Which is correct?",
      "X switch, Y router, Z modem", ["X modem, Y router, Z switch", "X router, Y switch, Z modem", "X switch, Y modem, Z router"],
      "The switch connects the local devices, the router joins the LAN to the internet, and the modem sits next to the ISP line.", { svg: chainSvg(), family: 'chain-fig' }),
    mc('order', "In the diagram, which link should be drawn as a dashed (wireless) line?",
      "Between the tablet and the WAP", ["Between the desktop and box X", "Between the WAP and box X", "Between box Z and the ISP"],
      "Only the tablet connects by radio. The WAP itself is cabled to the switch, and the desktop is wired.", { svg: chainSvg(), family: 'chain-fig' }),
    mc('order', "Which component is closest to the ISP’s line?",
      "The modem", ["The switch", "The wireless access point", "The desktop computer"],
      "The modem converts the network’s data into signals for the ISP’s line, so it connects directly to that line."),
    mc('connections', "A dental surgery has three wired PCs and two tablets that only have Wi-Fi. It also has a switch and a WAP. How should each tablet connect?",
      "By radio to the WAP, which is cabled to the switch", ["By a cable straight to the switch", "By a cable to the WAP and by radio to the switch", "By radio straight to the switch, with no WAP needed at all"],
      "The tablet only has wireless, so it must connect to the WAP. The WAP joins the wired network through a cable to the switch."),
    mc('connections', "A student draws a solid line from a tablet that has only Wi-Fi straight to the switch. What is wrong?",
      "The tablet cannot be wired; it must connect wirelessly to the WAP", ["The tablet should connect to the modem", "The switch should connect to the tablet by radio", "Nothing is wrong: tablets always plug straight into the switch with a network cable"],
      "A wireless-only device connects by radio to the WAP, never by a cable to the switch."),
    mc('connections', "A student connects the WAP to both the switch and the router. Why is this marked wrong?",
      "The WAP needs only one cable link into the wired network, to the switch", ["The WAP must connect only to the modem", "A WAP cannot connect to anything by cable", "The WAP must also connect directly to every desktop computer in the building"],
      "Linking the WAP to the switch is enough; an extra link to the router is an unnecessary extra line in the diagram."),
    mc('connections', "Which extra line would be wrong in a diagram of a small office network?",
      "A line from a wired desktop to the WAP", ["A line from the switch to the router", "A line from the router to the modem", "A dashed line from a wireless laptop to the WAP"],
      "Wired desktops connect to the switch. Drawing them to the WAP adds a link that does not exist."),
    ms('combined', "A home ‘router’ box from an ISP usually combines several components. Which ones?",
      ["A switch", "A wireless access point", "A router", "A modem"], ["A web server", "A printer"],
      "Most home broadband boxes contain a switch, a WAP, a router and a modem in one case."),
    mc('combined', "Kai’s broadband box has a switch, a router and a modem built in. His games console is plugged into it by cable. In what order does data from the console pass through these parts on its way to the internet?",
      "Switch, router, modem", ["Modem, router, switch", "Router, switch, modem", "Switch, modem, router"],
      "The console plugs into the switch, the router links the LAN to the outside network, and the modem sends the data over the ISP line."),
    mc('component-role', "How does a switch know which device to send a packet to?",
      "It reads the destination MAC address", ["It sends every packet to every device", "It asks the modem", "It reads the domain name in the URL and looks up which device is using that name"],
      "A switch learns the MAC address of each device on each port and forwards packets only to the right one."),
    mc('component-role', "Which addresses does a router use to decide where to forward packets?",
      "IP addresses", ["MAC addresses only", "Domain names", "Postal addresses of the users"],
      "Routers work between networks and use the destination IP address to choose where to send each packet."),
    mc('component-role', "What is the role of the ISP in connecting a home to the internet?",
      "It connects the home’s modem to the rest of the internet", ["It provides the switch inside the home", "It converts IP addresses into MAC addresses for the switch", "It stores every web page that the family has ever visited"],
      "The internet service provider supplies the connection between the customer’s modem and the wider internet."),
    mc('faults', "In an office, the WAP stops working. Which devices lose their connection?",
      "Only the wireless devices", ["Only the wired desktops", "Every device on the network", "Only the router and the modem"],
      "Wired devices still connect through the switch. Only devices that rely on the WAP’s radio link are cut off."),
    mc('faults', "The office modem fails, but the switch and router still work. What can staff still do?",
      "Share files and print within the office, but not reach the internet", ["Reach the internet but not print", "Nothing at all, as every link stops", "Reach websites, but only by typing their IP addresses into the browser"],
      "The LAN still works through the switch, but without the modem there is no link to the ISP and the internet."),
    mc('faults', "The WAP is cabled to the switch. The switch fails. What is the effect?",
      "Both wired and wireless devices lose their network connection", ["Only wired devices are affected", "Only wireless devices are affected", "Nothing changes because the WAP takes over from the switch for all the wired devices"],
      "The wired devices and the WAP all connect through the switch, so everything behind it is cut off."),
    mc('connections', "A café adds a second WAP at the far end of its seating area so that customers’ phones get a stronger signal. How should the new WAP be connected?",
      "By a cable to the café’s switch, like the first WAP", ["By radio straight to the modem, skipping the switch and router", "By a cable to one of the customers’ phones", "It needs no connection, because a WAP makes its own internet link"],
      "A WAP gives wireless devices a way into the wired network, so it must itself be cabled into that network, normally to the switch."),
    mc('connections', "In a network diagram key, a dashed line means a wireless link. Which link must be dashed?",
      "A smartphone to the WAP", ["The WAP to the switch", "The switch to the router", "The router to the modem"],
      "The phone connects by radio. All the links between the network components are cables.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-12 */
  function hex4() { var h = '0123456789abcdef', s = ''; for (var i = 0; i < 4; i++) s += h[rint(0, 15)]; return s; }
  function ipv6() { var g = []; for (var i = 0; i < 8; i++) g.push(hex4()); return g; }
  function ipv4() { return [rint(1, 223), rint(0, 255), rint(0, 255), rint(1, 254)]; }
  B['CSC-T56-12'] = { title: 'IPv4 and IPv6: sizes, formats and why IPv6 exists', items: [
    mc('bit-lengths', "How many bits are in an IPv4 address?",
      "32", ["4", "64", "128"],
      "An IPv4 address is four numbers of 8 bits each: 4 × 8 = 32 bits."),
    mc('bit-lengths', "How many bits are in an IPv6 address?",
      "128", ["32", "64", "16"],
      "An IPv6 address has 8 groups of 16 bits: 8 × 16 = 128 bits."),
    mc('bit-lengths', "Each of the four numbers in an IPv4 address is stored in 8 bits. What range of values can each number take?",
      "0 to 255", ["0 to 128", "1 to 256", "0 to 999"],
      "8 bits give 2<sup>8</sup> = 256 values, from 0 to 255."),
    mc('bit-lengths', "How many bytes are needed to store an IPv4 address?",
      "4", ["8", "16", "32"],
      "32 bits ÷ 8 = 4 bytes, one byte for each of the four numbers."),
    mc('bit-lengths', "A student says an IPv6 address is 64 bits. Which correction is right?",
      "It is 128 bits: 8 groups × 16 bits", ["It is 32 bits: 4 groups × 8 bits", "It is 64 bits: 8 groups × 8 bits", "It is 16 bits: one bit for each hex digit in a group"],
      "Each IPv6 group has 4 hex digits of 4 bits each (16 bits), and there are 8 groups: 128 bits."),
    { skill: 'structure', gen: function () {
      var g = ipv6(), k = rint(1, 4), start = rint(0, 8 - k);
      var shown = g.map(function (x, i) { return (i >= start && i < start + k) ? '<b>' + x + '</b>' : x; }).join(':');
      return num('structure', "This is an IPv6 address:<br><code>" + shown + "</code><br>How many bits are needed to store the " + (k === 1 ? 'group' : k + ' groups') + " shown in bold?",
        16 * k, 'bits', "Each hex digit is 4 bits, so each group of 4 digits is 16 bits. " + k + " × 16 = " + (16 * k) + " bits.");
    } },
    { skill: 'structure', gen: function () {
      var k = pick([2, 3, 5, 6, 10, 12]);
      return num('structure', "Each hexadecimal digit in an IPv6 address represents a fixed number of bits. How many bits do " + k + " hexadecimal digits represent?",
        4 * k, 'bits', "One hex digit has 16 possible values (0–F), which needs 4 bits. " + k + " × 4 = " + (4 * k) + " bits.");
    } },
    mc('structure', "How many hexadecimal digits are there in a full IPv6 address?",
      "32", ["8", "16", "128"],
      "There are 8 groups of 4 hex digits: 8 × 4 = 32 digits, and 32 × 4 bits = 128 bits."),
    mc('structure', "An IPv6 address is written as groups separated by colons. A student counts 7 colons and says there are 7 groups. What is wrong?",
      "There are 8 groups; 7 colons sit between them", ["There are 7 groups of 8 hex digits", "There are 16 groups, one per colon", "Colons are part of the hex digits, so they must be counted as bits"],
      "Separators sit between groups, so 7 colons divide the address into 8 groups."),
    mc('structure', "Why does one hexadecimal digit represent exactly 4 bits?",
      "4 bits give 16 different values, matching the 16 hex digits 0–F", ["4 bits give 8 values, matching 8 groups", "Hex digits are stored as one byte each", "Each hex digit is stored as four separate decimal digits"],
      "2<sup>4</sup> = 16, which is exactly the number of hex digits (0–9 and A–F)."),
    ms('structure', "Pick the statements that together explain why the address <code>2c0f:9a10:0000:41b7:00e2:ffff:0c30:7d58</code> needs 128 bits.",
      ["Each hex digit represents 4 bits", "There are 8 groups of 4 hex digits, so 32 digits", "32 digits × 4 bits = 128 bits"], ["Each hex digit represents 8 bits", "There are 7 colons, so 7 × 16 = 112 bits"],
      "The structure is 8 groups × 4 hex digits = 32 digits, and each digit is 4 bits, giving 128 bits in total."),
    mc('structure', "Which separator is used in each format?",
      "IPv4 uses dots; IPv6 uses colons", ["IPv4 uses colons; IPv6 uses dots", "Both use dots", "Both use colons"],
      "IPv4 is written like 172.16.4.9 with dots. IPv6 groups are separated by colons."),
    { skill: 'recognise', gen: function () {
      var good = ipv4().join('.');
      var big = ipv4(); big[rint(0, 3)] = rint(256, 399);
      var five = ipv4().concat([rint(0, 255)]);
      var hex = [hex4(), hex4()].join(':');
      return mc('recognise', "Which of these is a valid IPv4 address?", "<code>" + good + "</code>",
        ["<code>" + big.join('.') + "</code>", "<code>" + five.join('.') + "</code>", "<code>" + hex + "</code>"],
        "A valid IPv4 address has exactly four numbers from 0 to 255 separated by dots. One option has a number above 255, one has five numbers, and one uses hex groups and colons.");
    } },
    { skill: 'recognise', gen: function () {
      var v4 = ipv4().join('.'), v6 = ipv6().join(':');
      var which = pick(['IPv4', 'IPv6']);
      return mc('recognise', "What type of address is <code>" + (which === 'IPv4' ? v4 : v6) + "</code>?", which === 'IPv4' ? "An IPv4 address (32 bits)" : "An IPv6 address (128 bits)",
        which === 'IPv4' ? ["An IPv6 address (128 bits)", "An IPv4 address (128 bits)", "An IPv6 address (32 bits)"] : ["An IPv4 address (32 bits)", "An IPv6 address (64 bits)", "An IPv4 address (128 bits)"],
        which === 'IPv4' ? "Four denary numbers separated by dots is IPv4, which is 4 × 8 = 32 bits." : "Eight groups of four hex digits separated by colons is IPv6, which is 8 × 16 = 128 bits.");
    } },
    mc('why-ipv6', "Why was IPv6 introduced?",
      "So many devices joined the internet that IPv4 was running out of addresses", ["IPv4 addresses were too hard for people to type", "IPv6 makes web pages download faster", "IPv4 could not be used with wireless networks"],
      "IPv4’s 32 bits give about 4.3 billion addresses, which is not enough for all today’s devices. IPv6’s 128 bits give vastly more."),
    mc('why-ipv6', "Which answer explains why IPv6 is needed, rather than giving a vague claim?",
      "Its 128-bit addresses give far more unique addresses than IPv4’s 32 bits", ["IPv6 is better than IPv4", "IPv6 is newer and faster", "IPv6 is more modern and more advanced"],
      "The key point is the number of addresses: more bits mean many more unique addresses for the growing number of devices."),
    mc('why-ipv6', "About how many addresses does IPv4 allow?",
      "About 4.3 billion (2<sup>32</sup>)", ["About 256 (2<sup>8</sup>)", "About 65 thousand (2<sup>16</sup>)", "About 128 (one per bit)"],
      "32 bits give 2<sup>32</sup> = 4,294,967,296 addresses, roughly 4.3 billion."),
    { skill: 'why-ipv6', gen: function () {
      var b = pick([6, 8, 10, 12, 15]);
      return mc('why-ipv6', "A report says there will soon be about " + b + " billion devices connected to the internet, each needing its own address. Which conclusion is correct?",
        "IPv4 cannot give them all a unique address, because 32 bits allow only about 4.3 billion", ["IPv4 is enough, because each of its four numbers can go up to 255", "IPv4 is enough, because 32 bits allow about 32 billion addresses", "IPv6 is not needed, because devices can all share one address"],
        "32 bits give 2<sup>32</sup> ≈ 4.3 billion addresses, which is fewer than " + b + " billion. IPv6’s 128 bits give far more than enough unique addresses.");
    } },
    mc('why-ipv6', "How many times more addresses does IPv6 allow than IPv4?",
      "2<sup>96</sup> times more", ["4 times more", "96 times more", "2<sup>4</sup> times more"],
      "2<sup>128</sup> ÷ 2<sup>32</sup> = 2<sup>128 – 32</sup> = 2<sup>96</sup>, an enormous number. Four times the bits does not mean four times the addresses."),
    mc('why-ipv6', "What is an IP address used for?",
      "To identify a device on a network so data can be sent to it", ["To name a website for people to remember", "To encrypt data sent across the internet", "To measure the speed of an internet connection in bits per second"],
      "Every device on a network needs a unique IP address so that packets can be delivered to it."),
    { skill: 'structure', gen: function () {
      var a = ipv4(), k = pick([2, 3]);
      return num('structure', "This is an IPv4 address: <code>" + a.join('.') + "</code>. How many bits are used to store the first " + k + " numbers?",
        8 * k, 'bits', "Each IPv4 number is 8 bits (one byte), so " + k + " numbers use " + k + " × 8 = " + (8 * k) + " bits.");
    } },
    mc('bit-lengths', "A student says each hex digit in an IPv6 address uses 8 bits. What is the mistake?",
      "8 bits is a pair of hex digits; one hex digit is 4 bits", ["Each hex digit uses 16 bits", "Each hex digit uses 2 bits", "Hex digits do not use bits at all because they are letters"],
      "Two hex digits make one byte (8 bits), so a single hex digit is 4 bits.")
  ] };

  /* ------------------------------------------------------------------ CSC-T3-17 */
  function caesar(t, k) { return t.replace(/[A-Z]/g, function (c) { return String.fromCharCode((c.charCodeAt(0) - 65 + k) % 26 + 65); }); }
  B['CSC-T3-17'] = { title: 'What encryption is and why we use it', items: [
    mc('definition', "What is meant by encryption?",
      "Converting plaintext into ciphertext", ["Converting ciphertext into plaintext", "Making a file smaller so it takes up less space", "Copying data to a second location so it can be restored if the original is lost"],
      "Encryption scrambles readable plaintext into unreadable ciphertext using an algorithm and a key."),
    mc('definition', "What is meant by decryption?",
      "Converting ciphertext back into plaintext using the key", ["Converting plaintext into ciphertext", "Deleting data so it cannot be recovered", "Splitting data into packets before it is sent across the network to another computer"],
      "Decryption reverses encryption, turning ciphertext back into the original readable message."),
    mc('terms', "What is plaintext?",
      "The readable message before it is encrypted", ["The scrambled message after it is encrypted", "The secret value used to encrypt", "A message that has been compressed to make it smaller before it is sent"],
      "Plaintext is the original, readable data. After encryption it becomes ciphertext."),
    mc('terms', "What is ciphertext?",
      "The scrambled, unreadable message after encryption", ["The original readable message", "The key used to unlock a message", "The list of rules a computer follows to send messages across a network"],
      "Ciphertext is the encrypted form of the data. Without the key it cannot be understood."),
    { skill: 'terms', gen: function () {
      var msg = pick(['MEET AT NOON', 'BRING THE MAP', 'GATE CODE IS SAFE', 'SEND THE FILE']), k = rint(2, 9), c = caesar(msg, k);
      var ask = pick(['ciphertext', 'plaintext', 'key']);
      var val = { ciphertext: c, plaintext: msg, key: String(k) };
      var why = { ciphertext: "‘" + c + "’ is the scrambled output of encryption, so it is the ciphertext.", plaintext: "‘" + msg + "’ is the readable message before encryption, so it is the plaintext.", key: "The value " + k + " controls how the letters are shifted, so it is the key." };
      return mc('terms', "A message <b>" + msg + "</b> is encrypted by shifting each letter " + k + " places, giving <b>" + c + "</b>. Which of these is the <b>" + ask + "</b>?", val[ask],
        ['ciphertext', 'plaintext', 'key'].filter(function (x) { return x !== ask; }).map(function (x) { return val[x]; }).concat([ask === 'key' ? String(26 - k) : (ask === 'plaintext' ? caesar(msg, 26 - k) : msg.split('').reverse().join(''))]),
        why[ask]);
    } },
    mc('terms', "A student writes, ‘Plaintext is the encrypted message and ciphertext is the original.’ What is wrong?",
      "They are swapped: plaintext is the original and ciphertext is the encrypted version", ["Nothing is wrong", "Both terms mean the encrypted message", "Both terms mean the key that is used to lock and unlock the message"],
      "Plaintext comes before encryption; ciphertext comes after it."),
    mc('terms', "What two things are needed to encrypt data?",
      "An encryption algorithm and a key", ["A compression utility and a password", "A router and a modem", "A backup copy of the data and a printer to print it"],
      "The algorithm is the method; the key is the secret value that controls exactly how the data is scrambled."),
    mc('purpose', "Why is data encrypted?",
      "So that only the intended receiver, who has the key, can understand it", ["So that it takes up less storage space", "So that hackers cannot get into the network", "So that the data travels faster across the internet to the person receiving it"],
      "Encryption does not stop data being taken; it makes sure that anyone without the key cannot understand it."),
    mc('purpose', "An online shop encrypts customers’ card details at checkout. Why?",
      "So the card details cannot be understood if they are intercepted", ["So the payment goes through more quickly", "So the customer does not need to type the card number", "So the card details take up less space in the shop’s database"],
      "If an attacker captures the data in transit, they only see ciphertext and cannot use the card details."),
    mc('purpose', "A company laptop has its whole storage drive encrypted. What is the benefit if the laptop is stolen?",
      "The thief cannot read the files without the key", ["The laptop cannot be stolen", "The files are automatically deleted", "The laptop sends its files back to the office by email as soon as it is switched on"],
      "Encryption protects the data itself, so a stolen device does not mean stolen information."),
    mc('purpose', "A hospital stores patient records encrypted on its servers. Which situation does this protect against?",
      "An attacker who copies the database cannot read the records", ["Staff forgetting their passwords", "The server running out of storage space", "The building losing power for a few hours during a storm"],
      "If the database is stolen, the encrypted records are unreadable without the key."),
    mc('purpose', "A messaging app encrypts messages so that only the sender and recipient can read them. What does this mean for the company that runs the servers?",
      "It passes on the messages but cannot read them without the key", ["It can read every message because it owns the servers", "It must print every message for checking", "It cannot deliver the messages until both users are online at exactly the same time"],
      "The messages travel through the servers as ciphertext, which only someone with the key can turn back into plaintext."),
    mc('misconceptions', "Which statement about encryption is <b>incorrect</b>?",
      "It stops hackers from getting into a network", ["It turns plaintext into ciphertext", "It uses an algorithm and a key", "It stops intercepted data being understood"],
      "Encryption does not keep attackers out. It makes the data unreadable to anyone without the key."),
    mc('misconceptions', "Why is ‘to make the file smaller’ not a reason for encrypting data?",
      "That describes compression; encryption scrambles data so it cannot be understood", ["Encryption always makes files larger", "Encryption only works on images", "Encryption and compression are the same thing, so either answer is equally good"],
      "Compression reduces file size. Encryption protects meaning; it is a different process."),
    ms('misconceptions', "Select the statements that are true about encryption.",
      ["Intercepted encrypted data cannot be understood without the key", "The receiver needs the key to decrypt the data"], ["Encryption makes files smaller", "Encryption stops data from being intercepted", "Encrypted data can be read by anyone who intercepts it"],
      "Encryption does not prevent interception or reduce size. It means the data is meaningless without the key."),
    mc('misconceptions', "Ben says, ‘My files are encrypted, so nobody can ever steal them.’ What is the flaw?",
      "Files can still be stolen; encryption only stops thieves understanding them", ["Encrypted files cannot be opened even by Ben", "Encryption deletes files after a week", "Encrypted files are stored on paper, so they are always safe from any kind of theft"],
      "Encryption protects the content, not the file itself. A thief could copy the file but would see only ciphertext."),
    mc('key', "Why must the decryption key be kept secret?",
      "Anyone who has the key can turn the ciphertext back into plaintext", ["The key makes the file larger if it is shared", "Sharing the key slows down the network", "The key is needed to switch the computer on each morning and to start the operating system"],
      "The key is what unlocks the data. If an attacker gets it, the encryption no longer protects anything."),
    mc('key', "In a secure message from Ali to Beth, who encrypts and who decrypts?",
      "Ali encrypts before sending; Beth decrypts after receiving", ["Beth encrypts before sending; Ali decrypts", "Both encrypt but nobody decrypts", "The internet service provider encrypts and decrypts every message for them"],
      "The sender encrypts so the message travels as ciphertext; the intended receiver uses the key to decrypt it."),
    mc('key', "What does someone see if they open an encrypted file without the key?",
      "Scrambled ciphertext that makes no sense", ["The original readable file", "A smaller version of the file", "An error message asking them to install more memory on their computer"],
      "Without the key, the data stays as ciphertext."),
    mc('purpose', "Which is a reason for encrypting data sent over Wi-Fi?",
      "Radio signals can be picked up by others, so the data must be unreadable to them", ["Wi-Fi signals cannot carry unencrypted data", "Encryption makes the Wi-Fi signal reach further", "Encryption lets more devices join the network at the same time"],
      "Anyone in range could capture wireless traffic, so encrypting it protects its meaning."),
    mc('definition', "Which option describes encryption?",
      "Scrambling data with a key so only authorised people can read it", ["Turning ciphertext into plaintext", "Turning data into information", "Turning code into data that the CPU can execute directly"],
      "Encryption scrambles plaintext into ciphertext; reversing it is decryption."),
    mc('purpose', "Why might a law firm email a contract as an encrypted file?",
      "So the contract’s contents stay confidential if the email is intercepted or sent to the wrong person", ["So the email arrives faster", "So the file can be printed in colour", "So the email cannot be deleted"],
      "Only someone with the key can read the encrypted contract, which keeps it confidential.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-07 */
  B['CSC-T56-07'] = { title: 'Keeping a network secure: access rights, physical security and authentication', items: [
    mc('why-protect', "Which is a security risk that comes from linking computers together?",
      "Malware can spread from one infected computer to the others", ["Each computer will need its own printer", "Files can no longer be backed up", "The computers will no longer be able to share the same internet connection with each other"],
      "Networked computers are linked, so malware on one can travel to others, and outsiders may try to break in."),
    mc('why-protect', "Why is network security important for a company?",
      "To stop outsiders getting in and stealing or changing data", ["To make the network cables last longer", "To make the computers start up faster", "To allow anyone outside the company to use its printers and files freely"],
      "Networks hold valuable data, so they must be protected against unauthorised access, theft, damage and malware."),
    mc('access', "What is access control?",
      "Giving each user only the rights they need for their job", ["Giving every user full rights to every file", "Locking the building at night", "Copying every file to a second server so that nothing is ever lost"],
      "Access control limits what each user can see or do, so mistakes and attacks cause less damage."),
    { skill: 'access', gen: function () {
      var s = pick([
        { t: "A teacher must be able to view the exam timetable but not change it.", a: "Read" },
        { t: "A temporary worker has no reason to see the payroll folder.", a: "None" },
        { t: "A tester must be able to run a program but not view or change its code.", a: "Execute" },
        { t: "An editor must be able to open and change the newsletter files.", a: "Write" },
        { t: "A receptionist should be able to look at the visitor list but must not alter it.", a: "Read" },
        { t: "A visitor using a guest login should not be able to open the finance folder at all.", a: "None" }
      ]);
      var why = { Read: "Read access lets the user open and view files without changing them.", None: "No access means the folder cannot be opened at all, which is right when the user has no need for it.", Execute: "Execute access lets a user run a program without being able to view or change it.", Write: "Write access lets the user change and save the files." };
      return mc('access', s.t + " Which access level should be given?", s.a, ['None', 'Read', 'Write', 'Execute'].filter(function (o) { return o !== s.a; }), why[s.a]);
    } },
    mc('access', "Why should not every member of staff have administrator rights?",
      "If an account is misused or hacked, the damage is limited to what that account can do", ["Administrator rights make computers run more slowly", "Only administrators can use a printer", "Administrator rights stop the user from logging in on the network more than once a day"],
      "Limiting rights means a mistake, an insider or an attacker using a stolen login can only reach what that user needed."),
    mc('access', "Why should each user have a separate account rather than sharing one login?",
      "Access can be set for each person and their actions can be traced", ["Shared accounts use more electricity", "Separate accounts make passwords unnecessary", "Separate accounts make the network faster for every user who is logged in at once"],
      "Individual accounts allow individual access rights and make it possible to see who did what."),
    mc('password-policy', "What does a strong password policy do?",
      "Forces long, complex passwords that are changed if compromised", ["Lets users choose any password, however short", "Stores all passwords on a sticky note by the server", "Uses the same password for every user so that it is easy to remember"],
      "Strong policies make passwords much harder to guess or crack, protecting accounts from unauthorised access."),
    ms('password-policy', "Which rules belong in a strong password policy?",
      ["A minimum length, such as 12 characters", "A mix of letters, numbers and symbols", "Change the password if it may have been revealed"], ["Use your pet’s name so it is easy to remember", "Share your password with your team"],
      "Length, complexity and changing compromised passwords make accounts harder to break into. Guessable or shared passwords weaken security."),
    mc('authentication', "What is authentication?",
      "Checking that a user really is who they claim to be", ["Checking that data entered is sensible", "Scrambling data so it cannot be read", "Making a copy of data so that it can be restored if it is lost or damaged"],
      "Authentication proves identity, for example with a password, a fingerprint or a one-time code."),
    ms('authentication', "Which of these are authentication methods?",
      ["A fingerprint scan", "A one-time code sent to the user’s phone", "A password checked against the one stored for that user"], ["Making a backup of the server", "Encrypting the files on the server"],
      "Authentication methods check identity. Backups and encryption protect data but do not prove who someone is."),
    mc('authentication', "What is two-factor authentication (2FA)?",
      "Asking for two different kinds of proof, such as a password and a code sent to a phone", ["Typing the same password twice", "Having two separate user accounts", "Logging in from two computers at the same time to check that both of them agree"],
      "2FA combines two different types of evidence, so a stolen password alone is not enough to log in."),
    mc('authentication', "Gym staff already log in to the booking system with a username and password. Which <b>additional</b> measure would best confirm a member of staff is who they claim to be?",
      "A one-time code sent to their registered phone", ["Typing the same password a second time", "A backup of their files every night", "Encrypting their emails before sending"],
      "Typing the same password again proves nothing new. A one-time code sent to their own phone adds a second, different proof of identity (2FA)."),
    mc('authentication', "Which answer describes a password well enough as an authentication method?",
      "A secret password that is checked against the one stored for that username", ["Password", "A password", "A password, which is a type of security that keeps the network more secure"],
      "‘Password’ alone is not enough. The answer must show it is secret and is checked against a stored record."),
    mc('authentication', "Why can a security question be a weak authentication method?",
      "The answer, such as a pet’s name, may be found on social media", ["Security questions can only be used once", "Security questions encrypt the password", "Security questions need a fingerprint scanner to be fitted to every single computer"],
      "If the answer is easy to discover or guess, an attacker can use it to get in."),
    mc('physical', "A school keeps its servers in a cupboard off the staff corridor, and a CCTV camera already watches the corridor. Which is <b>another</b> physical way to secure the servers?",
      "Fit a lock to the cupboard and control entry with swipe cards", ["Install anti-virus software on the servers", "Fit a CCTV camera to watch the corridor", "Use a strong password policy for all of the staff who log in to the network"],
      "Physical security protects the hardware itself. CCTV is already given, and anti-virus and passwords are software controls."),
    ms('physical', "Which of these are physical security measures?",
      ["A locked server room", "CCTV cameras", "Security guards"], ["A firewall", "Two-factor authentication"],
      "Physical measures stop people reaching the hardware. Firewalls and 2FA are logical (software-based) controls."),
    mc('firewall', "What does a firewall do?",
      "Checks traffic entering and leaving the network and blocks anything that breaks its rules", ["Removes viruses from infected files", "Scrambles data so it cannot be read", "Stops a fire from spreading to the server room by closing the doors automatically"],
      "A firewall filters network traffic using rules, for example blocking unknown incoming connections."),
    mc('validation-auth', "What is the difference between validation and authentication?",
      "Validation checks data follows the rules; authentication checks the user’s identity", ["Validation checks identity; authentication checks the data follows the rules", "They are two names for the same check", "Validation is done by the network; authentication is done only by printers"],
      "Validation checks entered data is sensible (such as a minimum length). Authentication proves who someone is."),
    { skill: 'validation-auth', gen: function () {
      var s = pick([
        { t: "A new password must be at least 10 characters long.", a: "Validation" },
        { t: "The password typed matches the one stored for that username.", a: "Authentication" },
        { t: "A fingerprint scan matches the record held for the employee.", a: "Authentication" },
        { t: "A date of birth entered on a sign-up form must be a real date.", a: "Validation" },
        { t: "A code sent to Mia’s phone is typed in correctly to prove it is her.", a: "Authentication" },
        { t: "An email address entered on a form must contain an @ symbol.", a: "Validation" }
      ]);
      var why = { Validation: "This checks that the data entered is sensible and follows a rule; it does not prove who the user is.", Authentication: "This checks the user’s identity against a stored record, so it is authentication." };
      return mc('validation-auth', "Is this check validation or authentication?<br><b>" + s.t + "</b>", s.a, ['Validation', 'Authentication', 'Encryption'].filter(function (o) { return o !== s.a; }), why[s.a]);
    } },
    mc('validation-auth', "Which statement is <b>incorrect</b>?",
      "Encrypting files stops people getting into the network", ["A firewall can block unauthorised traffic", "Authentication checks identity", "Locked doors protect the hardware"],
      "Encryption protects data once someone has it. It does not stop people logging in or getting into the network."),
    mc('access', "A sports club’s network has been entered by someone who guessed a coach’s short password. Which change would best stop this happening again?",
      "Require long, complex passwords for every account", ["Copy all the club’s files to an external drive each week", "Compress the files so they take up less space", "Buy a faster switch for the clubhouse"],
      "A strong password policy makes passwords much harder to guess. Backups help recovery after an attack but do not keep intruders out."),
    mc('firewall', "A school’s firewall is set to block all incoming connections from unknown addresses. What does this protect against?",
      "Outsiders trying to connect to the school’s computers from the internet", ["Pupils forgetting their passwords", "Printers running out of paper", "A teacher accidentally deleting a file on the shared drive"],
      "Firewall rules filter traffic, stopping unwanted connections from reaching the network.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-10 */
  B['CSC-T56-10'] = { title: 'Finding and fixing weaknesses: penetration testing, ethical hacking, code reviews, audit trails', items: [
    mc('pen-testing', "What is a vulnerability?",
      "A weakness in a system that an attacker could use", ["A type of virus that spreads by email", "A backup copy of important files", "A record of every user who has logged in to the network over the past week"],
      "A vulnerability is any weakness, in software, settings or procedures, that could be exploited."),
    mc('pen-testing', "What is the purpose of penetration testing?",
      "To find weaknesses through an authorised, simulated attack so they can be fixed", ["To steal data from a rival company and sell it to the highest bidder", "To test how fast the network is", "To make backups of every server so that data can be restored after an attack"],
      "A penetration test attacks your own system with permission, to discover weaknesses before real attackers do."),
    mc('pen-testing', "Which statement about penetration testing is <b>incorrect</b>?",
      "The testers keep any data they manage to take", ["It is carried out with the owner’s permission", "It simulates a real attack", "It ends with a report of the weaknesses found"],
      "Penetration testers do not keep or misuse data; they identify and report weaknesses."),
    mc('pen-testing', "A company hires a security firm to try to break into its web server, with permission, and report what it finds. What is this?",
      "Penetration testing", ["An audit trail", "A code review", "Modular testing"],
      "An authorised, simulated attack to find weaknesses is a penetration test."),
    mc('ethical-hacking', "What makes a hacker an ethical (‘white hat’) hacker?",
      "They break in with the owner’s permission and report what they find", ["They only attack companies they dislike", "They sell the weaknesses they find", "They never use a computer to find weaknesses, only paper plans of the building"],
      "Ethical hackers work with permission, do not steal or change data, and report the weaknesses so they can be fixed."),
    mc('ethical-hacking', "Which is the best developed point about using ethical hacking?",
      "An ethical hacker attacks the network as a criminal would, so weaknesses are found and fixed before a real attack", ["Ethical hacking is good", "Ethical hacking finds things", "Ethical hacking is a type of hacking that is ethical"],
      "A developed point says what the method does and why it helps: finding weaknesses before criminals exploit them."),
    mc('analysis-tools', "What do commercial analysis tools do?",
      "Automatically scan systems for known weaknesses and produce a report", ["Write new software for the company", "Physically lock the server room", "Delete user accounts that have not been used for a while to free up storage"],
      "These programs check networks or software against lists of known vulnerabilities and report what needs fixing."),
    mc('analysis-tools', "An IT manager needs a quick check of all 400 company computers for missing security updates. Which method suits this best?",
      "A commercial analysis tool", ["A code review", "An audit trail", "Hiring a security guard"],
      "An automated analysis tool can scan many computers quickly for known weaknesses such as missing patches."),
    mc('analysis-tools', "How does penetration testing differ from using a commercial analysis tool?",
      "A pen test simulates a real attacker; a tool automatically scans for known weaknesses", ["A pen test is automatic; a tool is done by a person", "They are exactly the same thing", "A tool attacks the system with permission; a pen test only reads the audit trail that the system keeps"],
      "Pen testers think like attackers and may find unusual weaknesses; tools are fast but check for known problems."),
    mc('analysis-tools', "Why should network and user policies be reviewed regularly?",
      "New threats and laws appear, so the rules must stay up to date", ["Old policies use too much storage space", "Policies expire automatically after one month", "Reviewing policies makes the network run at a higher speed for every user"],
      "Policies set how people and devices use the network; reviewing them keeps them effective against new risks."),
    mc('code-review', "What is a code review?",
      "Other programmers checking code to find bugs, security holes and poor practices", ["Running the finished program on many computers to see how fast it runs on each one", "Recording who logged in and when", "Asking customers to rate the software after it has been released"],
      "In a code review, other developers read the code before release to spot errors and vulnerabilities."),
    ms('code-review', "In which ways can code reviews help protect software from cyber attacks?",
      ["They find security holes such as input that is not validated", "They remove bad practices such as passwords written into the code"], ["They make the CPU run faster", "They encrypt the database automatically", "They replace the need for any testing"],
      "Reviewers spot vulnerabilities and risky coding habits before attackers can exploit them."),
    mc('code-review', "A code review finds this line in a login program: <code>admin_password = 'Sunflower7'</code>. Why is it a security risk?",
      "Anyone who sees the code learns the password", ["Passwords cannot contain numbers", "The line will make the program run slowly", "Python does not allow capital letters in strings, so the program will crash"],
      "Writing a password into the source code is bad practice: anyone with access to the code, or the compiled program, could find it."),
    mc('code-review', "Before a banking app is released, senior programmers read through the new login module looking for weaknesses. Which method is this?",
      "A code review", ["Penetration testing", "An audit trail", "A firewall"],
      "Other programmers checking the code before release is a code review."),
    mc('audit-trail', "What is an audit trail?",
      "An automatic record of what was done on a system and who did it", ["A backup copy of all the files, made automatically every night by the system", "A test of the network’s speed", "A map of the building showing where every computer is kept"],
      "An audit trail logs actions, users and times, so activity can be checked later."),
    mc('audit-trail', "How can an audit trail help keep a network secure?",
      "It shows unusual activity, such as logins at 3 a.m., so it can be investigated", ["It stops all viruses from entering", "It makes passwords stronger", "It automatically restores any files that have been deleted by a user"],
      "By reviewing the log, staff can spot suspicious behaviour and trace problems back to the account responsible."),
    mc('audit-trail', "Some customer records were deleted overnight. Which would help find out who did it?",
      "The audit trail", ["A code review", "Modular testing", "A file conversion utility"],
      "An audit trail records who did what and when, so the deletion can be traced."),
    mc('audit-trail', "A student says an audit trail is ‘a backup of the system’. Why is this wrong?",
      "An audit trail is a record of actions and users, not a copy of the data", ["An audit trail is a type of firewall", "An audit trail is a list of passwords", "Nothing is wrong: an audit trail and a backup are exactly the same thing in practice"],
      "A backup copies data for restoring it; an audit trail records who did what."),
    mc('modular-testing', "What is modular testing?",
      "Testing each subprogram on its own as it is written, so errors are found early", ["Testing the whole program only once it is completely finished and ready to be sold", "Asking users to test the program after release", "Checking that each module has a name that describes what it does"],
      "Testing small pieces separately makes errors easier to find and fix before they are combined."),
    mc('modular-testing', "A question already says modules are tested in isolation. Which answer adds a genuine benefit?",
      "Errors are found early, in a small piece of code, so they are easier to fix", ["The modules are tested in isolation", "Each module is tested separately from the others", "The modules are not tested together at first"],
      "Repeating the question scores nothing. The benefit is that faults are found sooner and in a smaller area of code."),
    mc('secure-design', "What does designing software securely from the start involve?",
      "Thinking about how it could be attacked while planning it, not adding security at the end", ["Writing the code as quickly as possible", "Only testing the software after release", "Making every user an administrator so that nobody is ever locked out of the system by mistake"],
      "Building security into the design stage is cheaper and more effective than trying to patch it in later."),
    ms('secure-design', "Which of these help protect a software system from cyber attacks?",
      ["Validating all user input", "Keeping the operating system updated", "Reviewing code before release"], ["Giving every user administrator rights", "Writing passwords into the source code"],
      "Secure coding, patched operating systems and code reviews reduce weaknesses. Excess rights and hard-coded passwords create them.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-15 */
  B['CSC-T56-15'] = { title: 'Ethics of technology: privacy, inclusion and professionalism', items: [
    mc('inclusion', "What does inclusion mean in the context of technology?",
      "Everyone being able to access and use technology and its benefits", ["Including as many features as possible in an app", "Only allowing experts to use computers", "Making sure that every website includes advertising so that it stays free"],
      "Inclusion means no group is shut out of technology because of cost, location, skills, disability or other barriers."),
    ms('inclusion', "Which of these can stop people from accessing the benefits of technology?",
      ["Not being able to afford a device", "No broadband or mobile signal where they live", "Lacking the digital skills to use online services"], ["Having fast home broadband", "Owning several up-to-date devices"],
      "Cost, lack of connection and lack of skills are common barriers. Fast broadband and devices are not barriers."),
    mc('inclusion', "Which pair gives two <b>different</b> reasons why some people cannot access technology?",
      "They cannot afford a device; there is no internet coverage where they live", ["They have no money; devices are too expensive", "Devices cost too much; they cannot afford them", "They are poor; they lack funds"],
      "‘No money’ and ‘too expensive’ are the same idea. Cost and coverage are two separate barriers."),
    mc('inclusion', "A council moves parking permit applications to online only. Which group is most likely to be excluded?",
      "Older residents without internet access or digital skills", ["Residents with fast home broadband who already pay their bills and book appointments online", "Young people who use smartphones every day", "Office workers who use computers in their jobs"],
      "An online-only service shuts out people who lack devices, connections or the skills to use them."),
    mc('inclusion', "How can a web designer make a website more inclusive?",
      "Make it work with screen readers and allow text to be enlarged", ["Use very small text so more fits on the page", "Show error messages using colour only", "Add a puzzle that must be solved by sight before any page can be read"],
      "Accessible design lets people with disabilities use the site, for example with screen readers and adjustable text."),
    ms('inclusion', "Which design choices improve accessibility?",
      ["Captions on videos", "Support for screen readers", "Adjustable text size"], ["Tiny fixed-size fonts", "Error messages shown only by colour"],
      "Captions, screen-reader support and resizable text help people with hearing or sight difficulties. Tiny fonts and colour-only messages exclude them."),
    mc('reluctance', "Give one reason why a bank customer might not want to use online banking.",
      "They worry their account could be hacked", ["They want faster access to their account", "They like checking their balance at night", "They want to see their statements on their phone wherever they are"],
      "Some people distrust online services or worry about fraud and hacking, so they prefer other ways."),
    mc('reluctance', "Why might an elderly patient prefer to phone the surgery rather than book online?",
      "They would rather speak to a real person", ["Online booking is always more expensive", "Phones are faster than the internet", "The surgery’s website only opens on Sundays and public holidays"],
      "Some people value talking to a person and feel unsure using online systems."),
    mc('privacy', "What is privacy?",
      "A person’s right to control information about themselves", ["Keeping a computer in a private room where nobody else is allowed", "Using a computer without the internet", "Hiding the price of software from other customers"],
      "Privacy is about people deciding who can collect, see and use their personal data."),
    mc('privacy', "A shopping centre plans cameras with facial recognition to spot known shoplifters. Which point is about <b>privacy</b>?",
      "People should know they are being recorded and how the images will be used", ["The cameras will cost a lot to install", "The cameras need a fast network connection", "The software must run on a powerful server with a large hard disc to store the footage"],
      "Privacy points focus on the people being monitored: consent, transparency and how their data is used. Cost and set-up are not privacy issues."),
    mc('privacy', "Why is bias a concern with facial recognition systems?",
      "They can make more mistakes for some groups, so innocent people may be wrongly identified", ["They make the cameras use more electricity, so the running costs become too high for the owners", "They can only recognise people wearing hats", "They work only at night, when there is less light for the camera to record"],
      "If the system has been trained unevenly, it may misidentify some groups more often, which is unfair."),
    ms('privacy', "Data protection laws require organisations to:",
      ["Keep personal data secure", "Use personal data only for the purpose stated", "Not keep personal data longer than needed"], ["Sell personal data to the highest bidder", "Publish everyone’s personal data online"],
      "Organisations must protect personal data, use it only as stated and delete it when it is no longer needed."),
    mc('privacy', "A shop keeps CCTV footage of customers. Which action best respects their privacy?",
      "Deleting footage once it is no longer needed and limiting who can view it", ["Keeping all footage forever just in case it is needed by someone at some point", "Posting clips of customers online", "Sharing the footage with any company that asks for it"],
      "Keeping data only as long as needed and restricting access protects people’s privacy."),
    mc('privacy', "A company wants to monitor employees with cameras. Which approach is most ethical?",
      "Tell staff about the monitoring, explain why, and use the data only for that purpose", ["Install hidden cameras and tell nobody, so that staff behave normally all of the time", "Use the footage to post funny videos online", "Record staff at home as well as at work so that nothing is missed"],
      "Transparency, a clear purpose and limited use respect employees’ privacy."),
    mc('privacy', "‘Facial recognition cameras make everyone safer.’ Which is the strongest counter-argument?",
      "People are tracked without consent, and false matches can wrongly accuse innocent people", ["Cameras are hard to install", "Cameras need electricity", "Cameras can only be bought from abroad and the delivery takes a long time"],
      "A strong counter-argument addresses the ethical impact on the people monitored: privacy and fairness."),
    mc('professionalism', "Which is a way that computer scientists can demonstrate professionalism?",
      "Following a professional code of conduct", ["Writing code", "Working on a computer", "Using a keyboard and mouse every day at work"],
      "Writing code is just the job. Professionalism means acting legally and ethically, for example by following a code of conduct."),
    ms('professionalism', "Which of these show professionalism by a software developer?",
      ["Testing their code thoroughly before release", "Keeping their skills up to date", "Respecting users’ privacy"], ["Copying code without permission to save time", "Hiding known bugs from the client"],
      "Professionals act legally and ethically, produce well-tested work, keep learning and respect users."),
    mc('professionalism', "A developer discovers a serious security flaw in her company’s app just before launch. What is the professional action?",
      "Report the flaw so it can be fixed before release", ["Say nothing so the launch is not delayed", "Sell details of the flaw online", "Post the flaw on social media before telling anyone at the company"],
      "Professional and ethical behaviour means protecting users by reporting problems honestly."),
    mc('professionalism', "How can a software team show ethical behaviour when collecting user data?",
      "Collect only the data that is needed and explain how it will be used", ["Collect as much data as possible in case it is useful", "Hide the privacy policy", "Share data with partners without telling users or asking for their consent first"],
      "Collecting the minimum data and being open about its use respects users’ privacy."),
    mc('professionalism', "Which answer would gain credit for a way computing professionals can show professionalism?",
      "Keeping their technical skills and knowledge up to date", ["Typing quickly", "Owning an expensive computer", "Working in a large office building in the city centre with other programmers"],
      "Keeping skills current means professionals can do competent, safe work. The other options are not about professional conduct."),
    mc('inclusion', "What is meant by the ‘digital divide’?",
      "The gap between people who have access to technology and those who do not", ["The line between two halves of a hard disc", "The split between wired and wireless networks", "The difference in price between two models of the same smartphone"],
      "The digital divide describes unequal access to devices, connections and skills."),
    mc('privacy', "A student’s privacy answer says, ‘The law says you need consent.’ How could it be improved?",
      "Link it to the people affected, e.g. staff must agree and know how footage is used", ["Add how much the system costs", "Add what make of camera to buy", "Add how fast the network must be to send the video to the server"],
      "Claims about the law need linking to the people being monitored and what that means for them.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-17 */
  B['CSC-T56-17'] = { title: 'Emerging tech: quantum, DNA computing, AI and nanotechnology', items: [
    mc('quantum', "What is a qubit?",
      "A quantum bit, made from a sub-atomic particle, that can be in a combination of 0 and 1", ["A bit that can only ever be 0", "Eight bits grouped together", "A unit of storage equal to one billion bytes on a quantum hard disc, used for saving very large files"],
      "Quantum computers store data in qubits, which use particles such as electrons or photons."),
    mc('quantum', "What is meant by superposition in quantum computing?",
      "A qubit can be in a combination of 0 and 1 at the same time until it is measured", ["A qubit is always exactly 0 or exactly 1", "Two computers are placed on top of each other", "The processor is placed above the memory chips so data travels a shorter distance"],
      "Superposition lets a qubit hold a mix of states; its value is only fixed when measured."),
    mc('quantum', "What is entanglement?",
      "A link between qubits so that the state of one affects the other", ["Wires inside a quantum computer becoming tangled", "Two classical bits stored side by side", "A way of cooling a quantum computer down to very low temperatures using liquid helium"],
      "Entangled qubits are linked; measuring one affects the other. Together with superposition, this lets quantum computers explore many possibilities."),
    ms('quantum', "Which of these are characteristics of quantum computers?",
      ["They use qubits made from sub-atomic particles such as photons", "Pairs of qubits can be entangled"], ["They store data using strands of DNA", "They use only classical bits that are either 0 or 1", "They are built by arranging single atoms into scratch-resistant coatings"],
      "Quantum computers use qubits made from sub-atomic particles, and qubits can be entangled. DNA strands belong to DNA computing, atom-scale coatings to nanotechnology, and plain 0/1 bits to classical computers."),
    mc('quantum', "Which answer describes quantum computers well enough to score, rather than just saying they are faster?",
      "They use qubits that can be in superposition, so many possibilities can be explored at once", ["They are faster computers", "They are much better and quicker", "They are new computers that are more powerful than old computers"],
      "A good answer names a feature, such as qubits and superposition, and links it to what it allows."),
    mc('quantum', "How does a qubit differ from a classical bit?",
      "A bit is either 0 or 1; a qubit can be a combination of both until measured", ["A bit can be 0, 1 or 2; a qubit is only 0", "A qubit stores eight times more than a bit", "A bit uses light; a qubit uses electricity"],
      "The defining difference is superposition: a classical bit has one definite value at a time."),
    mc('dna', "How does DNA computing differ from traditional computing?",
      "It uses strands of DNA and chemical reactions instead of silicon chips and electricity", ["It uses silicon chips but much faster electricity, which travels along wires made of DNA", "It uses qubits made from photons", "It is a type of cloud computing that stores data on servers owned by large companies"],
      "DNA computing replaces electronic circuits with DNA molecules and chemical reactions. A full answer describes both sides."),
    mc('dna', "What code does DNA use to store information, compared with binary?",
      "A four-letter code (A, C, G, T) instead of two digits (0 and 1)", ["A two-letter code (X and Y) instead of the four digits used by computers", "A ten-digit code like denary", "A sixteen-letter code like hexadecimal"],
      "DNA bases come in four types, while binary uses just two values."),
    mc('dna', "Why could DNA computing solve some problems quickly?",
      "Huge numbers of DNA strands can react at the same time, working in parallel", ["DNA conducts electricity faster than copper", "DNA computers use a very high clock speed", "DNA computers are connected to the internet with 5G, so they download answers quickly"],
      "A tiny amount of DNA contains vast numbers of strands, so many operations can happen in parallel."),
    mc('dna', "Which answer gives a full difference between DNA computing and traditional computing?",
      "DNA computing uses chemical reactions between DNA strands, while traditional computers use electrical signals in silicon", ["DNA computing uses DNA", "DNA computing is natural", "DNA computing is new and is a type of science that is studied in laboratories"],
      "A difference must describe both sides; the first option compares chemical reactions in DNA with silicon electronics."),
    mc('ai', "What is artificial intelligence (AI)?",
      "Software that learns patterns from training data and uses them to make predictions or decisions", ["Any program that follows fixed instructions written by a person, without ever changing them", "A robot that looks like a human", "A very fast processor that has more cores than any other processor"],
      "AI systems learn from large data sets and then apply what they learned to new data."),
    ms('ai', "Which of these are uses of AI?",
      ["Helping doctors diagnose illnesses from scans", "Recommending films based on what you have watched", "Recognising speech in a voice assistant"], ["Storing files on a USB stick", "Copying a file from one folder to another"],
      "These applications use patterns learned from data. Storing or copying files does not involve learning."),
    mc('ai', "How could an AI system help identify what is wrong with a patient?",
      "It compares the patient’s symptoms or scans with patterns learned from many past cases", ["It guesses randomly from a list of illnesses", "It asks the patient to diagnose themselves", "It looks up the patient’s address and sends a letter to the nearest hospital with a doctor"],
      "Trained on large numbers of diagnosed cases, the AI can suggest the most likely conditions for new data."),
    mc('ai', "How does a self-driving car use AI?",
      "It uses sensor data and patterns learned from huge amounts of driving data to decide how to steer and brake", ["It follows a single fixed route programmed at the factory", "It is controlled by a remote human at all times", "It drives only when the passenger presses a button for every single turn"],
      "The AI processes camera and sensor input, applying what it learned from training data to make driving decisions."),
    mc('ai-ethics', "Why can biased training data be a problem for AI?",
      "The AI may give unfair results for some groups of people", ["The AI will run more slowly", "The AI will use more electricity", "The AI will refuse to work until the data is deleted from the computer"],
      "An AI learns from its data. If the data is unbalanced, its decisions can be unfair."),
    ms('ai-ethics', "Which of these are ethical issues raised by AI?",
      ["It may replace some people’s jobs", "It can be hard to tell whether its answer is right", "Biased data can lead to unfair decisions"], ["It always needs a 5G connection", "It can only be used on desktop computers"],
      "AI raises questions about jobs, trust in its decisions and fairness. Connection type and device are not ethical issues."),
    mc('ai-ethics', "A student’s essay on AI only lists uses such as chatbots and games. What is missing for a balanced discussion?",
      "Its characteristics, such as learning from data, and ethical issues such as bias", ["More examples of games", "The price of AI software", "A list of computer brands that are sold in shops"],
      "A discussion of AI should cover characteristics, uses and ethical issues, not just a list of uses."),
    mc('nano', "What is nanotechnology?",
      "Engineering at the scale of atoms and molecules, roughly 1 to 100 nanometres", ["Very small technology", "Technology used in small phones", "Technology that uses much less electricity than the older technology it replaces in phones and laptops"],
      "Nanotechnology works with materials at the level of atoms and molecules. ‘Very small technology’ alone is too vague."),
    mc('nano', "Roughly how big is one nanometre?",
      "One billionth of a metre", ["One thousandth of a metre", "One millionth of a kilometre", "One hundredth of a centimetre"],
      "1 nm = 10<sup>–9</sup> m, about the size of a few atoms side by side."),
    ms('nano', "Which of these are uses of nanotechnology?",
      ["Making smaller transistors for processors", "Scratch-resistant coatings", "Delivering medicine to an exact place in the body"], ["Storing files in the cloud", "Building taller mobile phone masts"],
      "Nanotechnology engineers materials at atomic scale, for example tiny transistors, tough coatings and targeted medicines."),
    { skill: 'classify', gen: function () {
      var s = pick([
        { t: "Uses qubits that can be in superposition", a: "Quantum computing" },
        { t: "Uses chemical reactions between strands with bases A, C, G and T", a: "DNA computing" },
        { t: "Learns patterns from training data to make predictions", a: "Artificial intelligence" },
        { t: "Engineers materials at the scale of atoms and molecules", a: "Nanotechnology" },
        { t: "Relies on entangled particles such as photons", a: "Quantum computing" },
        { t: "Recommends songs based on a listener’s history", a: "Artificial intelligence" }
      ]);
      var why = { 'Quantum computing': "Qubits, superposition and entanglement are features of quantum computing.", 'DNA computing': "Chemical reactions between DNA strands with four bases are the basis of DNA computing.", 'Artificial intelligence': "Learning from data to make predictions or recommendations is artificial intelligence.", Nanotechnology: "Working at the scale of atoms and molecules is nanotechnology." };
      return mc('classify', "Which emerging technology is described?<br><b>" + s.t + "</b>", s.a, ['Quantum computing', 'DNA computing', 'Artificial intelligence', 'Nanotechnology'].filter(function (o) { return o !== s.a; }), why[s.a]);
    } },
    mc('ai-ethics', "Which sentence best adds an ethical point to a discussion of AI in recruitment?",
      "If the AI was trained on past hiring data that favoured one group, it may unfairly reject others", ["AI can read CVs quickly", "AI is used by many companies", "AI runs on powerful servers in large data centres"],
      "This point identifies an ethical issue (bias) and explains its effect on people.")
  ] };

  /* ------------------------------------------------------------------ CSC-T4-02 */
  function arrowSvg() {
    var ink = '#303a4c', blue = '#195d9b';
    var box = function (x, y, t, w) { return '<rect x="' + (x - w / 2) + '" y="' + (y - 16) + '" width="' + w + '" height="32" rx="4" fill="#9aa5b8" stroke="' + ink + '" stroke-width="2"/><text x="' + x + '" y="' + (y + 5) + '" font-size="13" text-anchor="middle" fill="' + ink + '">' + t + '</text>'; };
    var defs = '<defs><marker id="g08ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + blue + '"/></marker></defs>';
    var arr = function (x1, y1, x2, y2, start, end) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + blue + '" stroke-width="3"' + (start ? ' marker-start="url(#g08ah)"' : '') + (end ? ' marker-end="url(#g08ah)"' : '') + '/>'; };
    return '<svg viewBox="0 0 440 220" role="img" aria-label="Diagram with arrows between a CPU and four devices labelled A to D">' + defs +
      arr(85, 45, 180, 95, false, true) + arr(260, 95, 355, 45, false, true) + arr(180, 125, 85, 175, false, true) + arr(260, 125, 355, 175, true, true) +
      box(220, 110, 'CPU', 80) + box(60, 35, 'A: Keyboard', 110) + box(380, 35, 'B: Printer', 100) + box(60, 185, 'C: Microphone', 120) + box(380, 185, 'D: Touch screen', 120) + '</svg>';
  }
  B['CSC-T4-02'] = { title: 'Hardware devices: input, output and how they connect', items: [
    mc('hardware-software', "What is hardware?",
      "The physical parts of a computer that you can touch", ["The programs that tell the computer what to do", "The data stored on a hard disc", "The instructions that run when the computer is first switched on, held in ROM"],
      "Hardware is the physical equipment, such as the CPU, memory, keyboard and screen."),
    mc('hardware-software', "What is software?",
      "The programs, or sets of instructions, that tell the hardware what to do", ["The physical parts of a computer", "The cables that connect devices", "The plastic case and the screen of a laptop or phone"],
      "Software is the instructions the computer runs, such as the operating system and apps."),
    mc('hardware-software', "Why does a laptop need both hardware and software?",
      "Hardware cannot do anything useful without instructions, and software needs hardware to run on", ["Hardware is needed for games and software is needed for work", "Software protects the hardware from viruses", "Hardware stores the software permanently, so the software is not needed after start-up"],
      "The two work together: software gives the instructions, and the hardware carries them out."),
    mc('hardware-software', "Which answer best explains why a computer needs both hardware and software?",
      "Software supplies the instructions, and the hardware carries them out", ["Hardware is the parts you can touch", "Software is the programs on the computer", "Hardware and software are both important parts of a computer"],
      "A good explanation shows how the two depend on each other, not just what each one is."),
    { skill: 'classify-device', gen: function () {
      var s = pick([
        { d: "Webcam", a: "Input" }, { d: "Barcode scanner", a: "Input" }, { d: "Microphone", a: "Input" }, { d: "Graphics tablet", a: "Input" }, { d: "Temperature sensor", a: "Input" },
        { d: "Projector", a: "Output" }, { d: "Speaker", a: "Output" }, { d: "3D printer", a: "Output" }, { d: "Monitor", a: "Output" }, { d: "Headphones", a: "Output" },
        { d: "Touch screen", a: "Both" }, { d: "Headset with a microphone", a: "Both" }, { d: "Interactive whiteboard", a: "Both" }
      ]);
      var why = { Input: "It sends data into the computer, so it is an input device.", Output: "It receives data from the computer and presents it, so it is an output device.", Both: "It sends data in and also presents data out, so it is both an input and an output device." };
      return mc('classify-device', "Is this an input device, an output device or both?<br><b>" + s.d + "</b>", s.a, ['Input', 'Output', 'Both'].filter(function (o) { return o !== s.a; }), why[s.a]);
    } },
    mc('classify-device', "Why is a touch screen classed as both an input and an output device?",
      "It displays information and also detects where the user touches", ["It can be used by two people at once", "It contains its own CPU", "It is both wireless and wired, and it can be used with or without a separate keyboard"],
      "The screen shows output, and the touch layer sends the position of a touch into the computer as input."),
    mc('classify-device', "Why is a gaming headset with a built-in microphone classed as both input and output?",
      "Its speakers output sound and its microphone inputs the player’s voice", ["It plugs into a USB port", "It is worn on the head", "It can be used with consoles and with computers, and it has its own volume control"],
      "The headphones present sound (output) and the microphone captures sound (input)."),
    ms('classify-device', "A supermarket self-checkout has several devices. Which are input devices?",
      ["The barcode scanner", "The weighing scale", "The card reader"], ["The receipt printer", "The speaker that says ‘Please take your items’"],
      "Scanners, scales and card readers send data into the system. The printer and speaker present data, so they are outputs."),
    ms('smartphone', "Which of these are output devices built into a smartphone?",
      ["The screen", "The speaker", "The vibration motor"], ["The microphone", "A printer connected by Bluetooth"],
      "The screen, speaker and vibration motor all present information. The microphone is input, and a printer is a separate peripheral, not part of the phone."),
    mc('smartphone', "Asked for an output device found on a smartphone, a student writes ‘printer’. Why does this not score?",
      "A printer is a separate peripheral, not part of the phone", ["Printers are input devices", "Smartphones cannot send anything to a printer", "Printers are software, not hardware, so they cannot be part of a smartphone"],
      "The question asks for devices built into the phone, such as its screen, speaker or vibration motor."),
    mc('smartphone', "Which built-in smartphone component is an <b>input</b> device?",
      "The camera", ["The speaker", "The vibration motor", "The screen’s backlight"],
      "The camera captures images and sends that data into the phone, so it is an input device."),
    mc('arrows', "In a diagram of a computer system, which way should the arrow between a speaker and the CPU point?",
      "From the CPU to the speaker", ["From the speaker to the CPU", "Both ways", "There should be no arrow because speakers do not connect to the CPU"],
      "A speaker is an output device: data travels from the CPU out to the speaker."),
    mc('arrows', "Which way should the arrow between a mouse and the CPU point?",
      "From the mouse to the CPU", ["From the CPU to the mouse", "Both ways", "From the mouse to the speaker, then to the CPU"],
      "A mouse is an input device, so data flows from the mouse towards the CPU."),
    mc('arrows', "Which way should the arrow between a USB memory stick and the CPU point?",
      "Both ways, because data is read from it and written to it", ["Only towards the CPU", "Only away from the CPU", "No arrow, because storage is not connected to the CPU"],
      "Data can be saved to and loaded from the memory stick, so communication goes in both directions."),
    mc('arrows', "Look at the diagram. Which device has its arrow drawn the wrong way?",
      "C", ["A", "B", "D"],
      "A microphone is an input device, so its arrow should point towards the CPU. In the diagram it points away from the CPU.", { svg: arrowSvg(), family: 'arrow-fig' }),
    mc('arrows', "Look at the diagram. Why does device D have arrow heads at both ends?",
      "It is both an input and an output device", ["It is neither input nor output", "It is connected wirelessly", "It needs twice as much power as the other devices"],
      "A touch screen displays output and accepts touch input, so data travels both ways.", { svg: arrowSvg(), family: 'arrow-fig' }),
    mc('components', "Before the CPU can run a program, where is the program loaded into?",
      "Main memory (RAM)", ["The printer", "The keyboard", "The monitor"],
      "Programs are copied from secondary storage into main memory, where the CPU fetches the instructions."),
    mc('components', "What is the role of secondary storage in a computer system?",
      "It keeps programs and data when the power is off", ["It processes the instructions", "It shows results to the user", "It sends data from the user to the CPU, like a keyboard does"],
      "Secondary storage, such as an SSD, is non-volatile, so files and programs stay there until they are needed."),
    mc('components', "A user types a number, the computer doubles it and shows the answer on screen. How do the parts work together?",
      "The keyboard inputs the number, the CPU processes it, and the screen outputs the answer", ["The screen inputs the number and the keyboard shows the answer", "The CPU types the number and the keyboard displays it", "The printer works out the answer and sends it to the keyboard so it can be checked"],
      "Input devices send data to the CPU, the CPU processes it using instructions in main memory, and output devices present the result."),
    mc('components', "Which part of a computer system carries out the instructions of a program?",
      "The CPU", ["The monitor", "The keyboard", "The speaker"],
      "The central processing unit fetches, decodes and executes the program’s instructions."),
    mc('classify-device', "Which of these devices is an output device only?",
      "A projector", ["A webcam", "A touch screen", "A scanner"],
      "A projector only presents images from the computer. Webcams and scanners are inputs, and a touch screen is both."),
    mc('classify-device', "A greenhouse system uses a light sensor. What type of device is the sensor?",
      "An input device", ["An output device", "Both an input and an output device", "A storage device"],
      "A sensor measures the surroundings and sends the reading into the computer, so it is an input device."),
    mc('classify-device', "A table has one tick per row to show whether each device is input, output or both. A student ticks both ‘Input’ and ‘Both’ for a touch screen. What is wrong?",
      "Only one tick is allowed per row; ‘Both’ alone is correct", ["A touch screen is output only", "A touch screen is input only", "Nothing: two ticks are needed when a device does two jobs"],
      "‘Both’ already means input and output. Two ticks in one row would lose the mark.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-16 */
  B['CSC-T56-16'] = { title: 'Protecting software by law: copyright, patents, trademarks and licences', items: [
    mc('copyright', "What is intellectual property?",
      "A creation of the mind, such as software or an invention, that belongs to its creator", ["Any physical object that a company owns, such as its desks, vehicles and buildings", "The computers and servers in an office", "A password that protects a user’s account from being used by anyone else"],
      "Intellectual property covers creations such as code, music, designs and inventions, which the law can protect."),
    mc('copyright', "What does copyright protect in software?",
      "The actual code and other written or creative work", ["The brand name and logo", "A new technical invention or process that has been registered at a patent office", "The computer that the software runs on"],
      "Copyright protects the written expression, such as the source code, manuals and graphics."),
    mc('copyright', "How does a programmer get copyright on code she has written?",
      "It applies automatically as soon as the work is created", ["She must apply and pay a fee to a patent office", "She must register a trademark first", "She must publish the code online for everyone to read before it can be protected"],
      "Copyright is automatic; no application is needed."),
    mc('copyright', "Which statement is <b>incorrect</b>?",
      "Copyright must be applied for before it protects code", ["A patent must be applied for and lasts for a fixed time", "Copyright protects source code", "A trademark protects a logo"],
      "Copyright is automatic from the moment the work exists. Patents, by contrast, must be applied for."),
    mc('copyright', "Rhea discovers that another company has copied her app’s source code and is selling it. How does copyright help her?",
      "She can take legal action, because the code is her protected work", ["She can block the company’s internet connection", "She automatically receives all of the company’s profits", "She can delete the copies from the other company’s computers herself"],
      "Copyright gives the creator legal rights over copying and distribution, so she can take the matter to court."),
    mc('patent-trademark', "What does a patent protect?",
      "A new invention or technical process", ["The written source code", "A brand name or logo", "The colour scheme and layout chosen for a company’s website"],
      "A patent protects how a new invention works. It must be applied for and lasts for a fixed time."),
    mc('patent-trademark', "What does a trademark protect?",
      "A brand name or logo", ["The source code of a program", "A new method for compressing video", "The user’s personal data stored by the company"],
      "Trademarks stop others using a name or logo that customers would confuse with yours."),
    mc('patent-trademark', "Which statement about patents is correct?",
      "They must be applied for and last for a fixed time", ["They apply automatically to all code", "They protect logos and brand names", "They last forever once they have been granted by the patent office"],
      "Unlike copyright, a patent needs an application, and its protection ends after a set number of years."),
    { skill: 'classify', gen: function () {
      var s = pick([
        { t: "The source code of a new budgeting app", a: "Copyright" },
        { t: "A brand-new method of compressing video that nobody has invented before", a: "Patent" },
        { t: "The app’s name and its logo", a: "Trademark" },
        { t: "The rules about how many computers a customer may install the software on", a: "Licence" },
        { t: "The user manual written for a new game", a: "Copyright" },
        { t: "The distinctive symbol shown on the company’s products", a: "Trademark" }
      ]);
      var why = { Copyright: "Written and creative work, such as code and manuals, is protected by copyright.", Patent: "A new invention or technical process is protected by a patent.", Trademark: "Names and logos are protected by trademarks.", Licence: "A licence is the agreement that sets out how the software may be used." };
      return mc('classify', "Which legal protection or agreement fits best?<br><b>" + s.t + "</b>", s.a, ['Copyright', 'Patent', 'Trademark', 'Licence'].filter(function (o) { return o !== s.a; }), why[s.a]);
    } },
    ms('classify', "Which of these are types of <b>legal</b> protection for software?",
      ["Copyright", "Patent", "Trademark"], ["A firewall", "A strong password"],
      "Copyright, patents and trademarks are legal protections. Firewalls and passwords are technical security measures."),
    mc('licences', "What is a software licence?",
      "A legal agreement setting out how the software may be used", ["A physical key that unlocks the computer", "A list of the bugs in the software", "A certificate showing that the user has passed a computing course at school"],
      "A licence states what the user is allowed to do, such as how many devices it can be installed on."),
    mc('licences', "When you buy software, what do you usually get?",
      "A licence to use it, not ownership of the software", ["Full ownership, so you can sell copies", "The right to change and share the source code", "The copyright of the program, which then passes to you"],
      "The creator keeps ownership. The buyer gets permission to use it under the terms of the licence."),
    mc('licences', "What does a proprietary licence usually allow?",
      "Using the software, but not viewing, changing or sharing the source code", ["Studying, changing and sharing the source code freely", "Selling copies of the software to others", "Using the software for free on any number of devices, for as long as the user wants"],
      "Proprietary software keeps the source code closed, and the licence limits how it may be used."),
    mc('licences', "What does a free and open-source (FOSS) licence allow?",
      "Users can study, change and share the code", ["Users can only run the program, never see its code", "Users must pay each time they run it", "Users can only use it for one month"],
      "Open-source licences give users the freedom to view, modify and redistribute the code, usually under the same terms."),
    mc('licences', "Ollie writes a tool and wants other programmers to improve it and share their changes freely. Which licence suits him?",
      "An open-source licence", ["A proprietary licence", "A trademark", "A patent"],
      "An open-source licence lets others study, change and share the code."),
    mc('licences', "A photographer allows her photos to be reused for non-commercial projects as long as she is credited. Which type of licence lets her set these conditions?",
      "A Creative Commons licence", ["A proprietary software licence", "A patent", "A trademark"],
      "Creative Commons licences let creators choose conditions, such as credit required or no commercial use."),
    mc('licences', "A company sells payroll software and wants to keep its code secret. Which licence should it use?",
      "A proprietary licence", ["An open-source licence", "A Creative Commons licence that allows sharing", "No licence, so customers can use it however they like"],
      "A proprietary licence keeps the source code closed and controls how customers use the program."),
    mc('anti-copying', "Which is a technical measure used to stop software being illegally copied?",
      "A licence key that must be activated online", ["A trademark registered for the software’s name", "A patent", "Copyright"],
      "Activation with a licence key checks that each copy is genuine and limits how many devices can use it. The others are legal protections."),
    mc('anti-copying', "How does online activation help prevent illegal copying?",
      "Each licence key can only be activated on a limited number of devices", ["It deletes the software after one use", "It makes the software run faster", "It encrypts the user’s documents so that they cannot be shared with anyone"],
      "If a copied key has already been used the allowed number of times, activation fails."),
    mc('discuss', "Which is the best developed point for a discussion of protecting software?",
      "Copyright protects the code automatically, so if someone copies it the developer can take legal action", ["Copyright", "Copyright and patents", "Copyright is a type of protection"],
      "A developed point names the protection, says what it protects and explains how it helps the developer."),
    mc('discuss', "Asked how software can be protected legally, a student writes about firewalls and passwords. Why does this miss the point?",
      "Those are technical security measures, not legal protections such as copyright or licences", ["Firewalls are illegal", "Passwords are a type of patent", "Firewalls protect the code by copyright"],
      "The question asks about the law, so answers should cover intellectual property rights and licensing."),
    mc('licences', "A school buys a site licence for an art program. What does this usually allow?",
      "Installing the program on many computers across the school", ["Selling copies of the program to parents and other schools in the area", "Changing the program’s source code", "Using the program’s logo on the school website"],
      "A site licence covers use across a whole organisation, rather than one copy per computer.")
  ] };

  /* ------------------------------------------------------------------ CSC-T56-14 */
  B['CSC-T56-14'] = { title: 'Technology, the environment and health', items: [
    mc('resources', "Why does manufacturing computers harm the environment?",
      "It uses a lot of energy and water and causes air and water pollution", ["It reduces the amount of e-waste", "It plants trees to make the cases", "It uses no raw materials at all, only recycled plastic collected from the sea and from beaches"],
      "Making devices needs large amounts of energy and water and releases pollution."),
    mc('resources', "Why is mining the metals needed for devices a problem?",
      "It uses up limited resources and can poison soil and groundwater", ["The metals are infinite, so mining never stops", "Mining makes the metals heavier", "Mining only takes place in space, so it has no effect on the Earth"],
      "Metals such as copper, gold and lithium are finite, and extracting them can damage land and water."),
    mc('resources', "Which of these materials is mined for use in phone batteries?",
      "Lithium", ["Oxygen", "Wood", "Salt water"],
      "Rechargeable phone batteries rely on lithium, which must be mined."),
    mc('energy', "Why do data centres use so much electricity?",
      "Thousands of servers run all the time, and they need cooling", ["They only run at night", "They use electricity to make paper", "They store electricity in large batteries for nearby homes to use at night"],
      "Servers run 24 hours a day and produce heat, so both running and cooling them use a lot of energy."),
    mc('energy', "Why are some data centres built in cold countries?",
      "Cooler air reduces the energy needed to keep the servers cool", ["Servers run faster when they are frozen", "Cold countries have no internet users", "Data centres are not allowed to be built in warm countries by law"],
      "Using cold outside air for cooling cuts the electricity needed for air conditioning."),
    ms('reduce-actions', "Which actions reduce the energy used by a computer?",
      ["Switching it off when not in use", "Lowering the screen brightness", "Using sleep mode during short breaks"], ["Leaving it on overnight to update", "Turning the screen brightness to maximum"],
      "Turning devices off, dimming screens and using sleep mode all reduce power use."),
    mc('reduce-actions', "Lena wants to lower the environmental impact of her smartphone <b>without</b> changing how much electricity it uses. Which action helps most?",
      "Keep it longer and repair it when needed, so fewer new phones are made", ["Turn down the screen brightness", "Switch it off at night", "Use dark mode to save battery power every day"],
      "The question excludes saving energy. Keeping and repairing a phone means less manufacturing and less e-waste."),
    mc('reduce-actions', "Why does keeping a laptop for longer reduce environmental impact?",
      "Fewer new devices are made, so less manufacturing and less e-waste", ["Older laptops use no electricity", "Older laptops have no metals in them", "Keeping a laptop longer makes its battery recharge itself from daylight, so it never needs mains power again"],
      "Each new device needs energy, water and mined materials to make. Using devices longer reduces this."),
    mc('reduce-actions', "Which answer to ‘How can you reduce the environmental impact of technology?’ is specific enough to score?",
      "Recycle old devices at a proper e-waste centre so toxic materials are handled safely", ["Be eco-friendly", "Use technology less", "Help the environment more"],
      "Vague answers do not say what to do. A creditworthy answer names a clear action and why it helps."),
    mc('e-waste', "What is e-waste?",
      "Electronic devices that have been thrown away", ["Emails that have been deleted", "Electricity wasted by a device", "Data that has been lost from a hard disc because of damage"],
      "E-waste is discarded electronic equipment, such as old phones, computers and chargers."),
    mc('e-waste', "Why is e-waste in landfill harmful?",
      "Toxic materials can leak into the ground and water", ["It makes the landfill site too heavy", "It generates free electricity", "It attracts more people to visit the landfill site each year"],
      "Devices contain toxic substances such as lead and mercury, which can leach into soil and water."),
    mc('e-waste', "Why is recycling old devices properly better than putting them in the bin?",
      "Valuable metals can be recovered and toxic parts are dealt with safely", ["It makes the devices work again", "It deletes all of the user’s data", "It turns the old devices straight into new batteries for electric cars and buses"],
      "Recycling recovers finite resources and stops harmful materials reaching the environment."),
    mc('reduce-actions', "How does donating an old but working laptop to a charity help the environment?",
      "It is used for longer, so someone else does not need a new one", ["It makes the laptop use less electricity", "It stops the laptop being recycled ever", "It removes all the metal from the laptop, so that the laptop can never become e-waste"],
      "Extending a device’s life avoids the impact of making a replacement."),
    mc('reduce-actions', "Sam replaces his phone every year even though the old one still works. What is the environmental impact?",
      "More phones are made and thrown away, using resources and creating e-waste", ["There is no impact, because phones are small", "It reduces e-waste, because new phones are greener", "It saves energy, because new phones never need charging and are made from recycled paper"],
      "Frequent upgrades increase manufacturing, mining and e-waste."),
    ms('wearables', "How can wearable technology such as a smartwatch benefit health?",
      ["Tracking heart rate", "Counting steps to encourage exercise", "Monitoring sleep patterns"], ["Curing illnesses automatically", "Replacing the need ever to see a doctor"],
      "Wearables measure activity and body data, which can motivate exercise and spot problems, but they do not cure illness or replace doctors."),
    mc('wearables', "What limits how much a fitness tracker improves health?",
      "It only helps if the user acts on the information it gives", ["It cannot measure anything about the body", "It stops working after one week", "It only works when connected to a desktop computer by a cable"],
      "Data on its own does not change health; the user has to change their behaviour."),
    mc('wearables', "How can a smartwatch help an elderly person who lives alone?",
      "It can detect a fall or an irregular heartbeat and send an alert to family or a doctor", ["It can cook meals for them", "It replaces the need for any medicine", "It stops them needing to sleep"],
      "Wearables can share data and send alerts, getting help quickly when something goes wrong."),
    mc('wearables', "An athlete wears a device that tracks heart rate and blood oxygen during training. What is the benefit?",
      "She can adjust her training to avoid over-exercising and improve fitness", ["She no longer needs to train", "She can run faster because the device is light", "The device makes her heart beat more slowly all the time, so she never gets tired"],
      "Measuring the body’s response helps the athlete train at the right intensity and recover properly."),
    mc('wearables', "Which is a possible <b>negative</b> health effect of using technology for long periods?",
      "Eye strain and poor posture from sitting at a screen", ["Stronger eyesight", "Better posture", "More time spent outdoors in the fresh air and sunshine"],
      "Long screen time can cause eye strain, and sitting badly for hours can lead to back and neck problems."),
    mc('discuss', "Which sentence develops a point in a discussion of technology’s environmental impact?",
      "Data centres use huge amounts of electricity, which, if generated from fossil fuels, adds to carbon emissions", ["Data centres use electricity", "Technology is bad for the environment", "Computers and phones are everywhere now"],
      "A developed point states an impact and explains why it matters."),
    mc('discuss', "A question asks about health <b>benefits</b> of wearable technology. Which answer stays on task?",
      "A smartwatch encourages more exercise by showing progress towards a daily step goal", ["Smartwatches create e-waste when thrown away", "Smartwatches cost a lot of money", "Smartwatches contain lithium that must be mined"],
      "The question asks about benefits to health, so points about cost or the environment do not answer it."),
    mc('energy', "Why does leaving devices on standby still affect the environment?",
      "They continue to draw a small amount of electricity all the time", ["Standby makes devices produce e-waste", "Standby uses no electricity at all", "Standby makes the device’s battery larger, so the device must be replaced sooner than usual"],
      "Many devices still draw power on standby. Across millions of homes this adds up to a lot of energy.")
  ] };
})();
