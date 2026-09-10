/* Menu data for Osteria Lume. Photos are Unsplash images, reused by every layout. */
window.MENU = {
  name: 'Lume',
  kind: 'Osteria & Pizzeria',
  tagline: 'Wood-fired pizza, hand-cut pasta, and a short list of things worth drinking.',
  address: 'Via della Scala 21, Trastevere',
  hours: 'Tue to Sun, 12:00 to 15:00 and 18:30 to 23:30',
  phone: '+39 06 581 4020',
  currency: '€',
  img: function (id, w) { return 'https://images.unsplash.com/' + id + '?w=' + (w || 800) + '&q=80&auto=format&fit=crop'; },
  srcset: function (id) { return [480, 800, 1200].map(function (w) { return MENU.img(id, w) + ' ' + w + 'w'; }).join(', '); },
  tagLabel: { v: 'Vegetarian', vg: 'Vegan', gf: 'Gluten free', spicy: 'Spicy', pick: "Chef's pick" },
  tagShort: { v: 'V', vg: 'VG', gf: 'GF', spicy: 'Hot', pick: 'Pick' },
  categories: [
    { id: 'antipasti', name: 'Antipasti', short: 'Starters', num: '01', blurb: 'Small plates to share while the oven gets going.', items: [
      { name: 'Bruschetta al Pomodoro', desc: 'Grilled sourdough, crushed datterini, garlic, basil, new-season oil.', price: 9, tags: ['v'], img: 'photo-1572695157366-5e585ab2b69f' },
      { name: 'Burrata e Pomodorini', desc: 'Puglian burrata, slow-roasted cherry tomatoes, basil, sea salt.', price: 14, tags: ['v', 'gf', 'pick'], img: 'photo-1592417817098-8fd3d9eb14a5' },
      { name: 'Tagliere della Casa', desc: 'Prosciutto di Parma, finocchiona, pecorino, olives, grissini.', price: 18, tags: [], img: 'photo-1541529086526-db283c563270' },
      { name: 'Polpette al Sugo', desc: 'Beef and pork meatballs, tomato sugo, pecorino, warm bread.', price: 12, tags: [], img: 'photo-1529042410759-befb1204b468' },
      { name: "Gamberi all'Aglio", desc: 'Pan-fried prawns, garlic, chilli, white wine, parsley.', price: 16, tags: ['gf', 'spicy'], img: 'photo-1559847844-5315695dadae' },
      { name: 'Vellutata di Zucca', desc: 'Roasted pumpkin soup, sage butter, toasted seeds.', price: 10, tags: ['v', 'gf'], img: 'photo-1604152135912-04a022e23696' },
      { name: "Insalata dell'Orto", desc: 'Garden leaves, shaved fennel, radish, lemon and oil.', price: 9, tags: ['vg', 'gf'], img: 'photo-1600335895229-6e75511892c8' },
      { name: 'Crostini Misti', desc: 'Three toasts: chicken liver, ricotta and honey, tomato and anchovy.', price: 11, tags: [], img: 'photo-1506280754576-f6fa8a873550' }
    ] },
    { id: 'pizza', name: 'Pizza', short: 'Pizza', num: '02', blurb: 'Neapolitan style. 48-hour dough, 90 seconds in the wood oven.', items: [
      { name: 'Margherita', desc: 'San Marzano tomato, fior di latte, basil, extra virgin olive oil.', price: 12, tags: ['v', 'pick'], img: 'photo-1604068549290-dea0e4a305ca' },
      { name: 'Diavola', desc: 'Tomato, fior di latte, spicy Calabrian salami, chilli oil.', price: 15, tags: ['spicy'], img: 'photo-1628840042765-356cda07504e' },
      { name: 'Quattro Formaggi', desc: 'Fior di latte, gorgonzola, taleggio, parmigiano, black pepper.', price: 16, tags: ['v'], img: 'photo-1548369937-47519962c11a' },
      { name: 'Prosciutto e Rucola', desc: 'Tomato, fior di latte, Parma ham, rocket, parmigiano shavings.', price: 17, tags: [], img: 'photo-1593560708920-61dd98c46a4e' },
      { name: 'Capricciosa', desc: 'Tomato, fior di latte, ham, mushrooms, artichokes, olives.', price: 16, tags: [], img: 'photo-1594007654729-407eedc4be65' },
      { name: 'Marinara', desc: 'Tomato, garlic, oregano, olive oil. No cheese, all crust.', price: 10, tags: ['vg'], img: 'photo-1600028068383-ea11a7a101f3' },
      { name: 'Funghi e Tartufo', desc: 'Fior di latte, mixed mushrooms, black truffle cream, thyme.', price: 18, tags: ['v', 'pick'], img: 'photo-1590947132387-155cc02f3212' },
      { name: 'Napoli', desc: 'Tomato, fior di latte, anchovies, capers, black olives, oregano.', price: 14, tags: [], img: 'photo-1552539618-7eec9b4d1796' }
    ] },
    { id: 'pasta', name: 'Pasta', short: 'Pasta', num: '03', blurb: 'Fresh pasta made each morning. Dried pasta from Gragnano.', items: [
      { name: 'Cacio e Pepe', desc: 'Tonnarelli, pecorino romano, cracked black pepper.', price: 14, tags: ['v', 'pick'], img: 'photo-1588013273468-315fd88ea34c' },
      { name: 'Carbonara', desc: 'Rigatoni, guanciale, egg yolk, pecorino, black pepper.', price: 15, tags: [], img: 'photo-1612874742237-6526221588e3' },
      { name: 'Tagliatelle al Ragù', desc: 'Egg tagliatelle, six-hour beef and pork ragù, parmigiano.', price: 16, tags: [], img: 'photo-1598866594230-a7c12756260f' },
      { name: 'Spaghetti al Pomodoro', desc: 'Gragnano spaghetti, datterini sauce, basil, olive oil.', price: 12, tags: ['vg'], img: 'photo-1626844131082-256783844137' },
      { name: "Penne all'Arrabbiata", desc: 'Tomato, garlic, dried chilli, parsley. Properly hot.', price: 12, tags: ['vg', 'spicy'], img: 'photo-1621996346565-e3dbc646d9a9' },
      { name: 'Tagliatelle ai Funghi', desc: 'Porcini and chestnut mushrooms, garlic, butter, parsley.', price: 16, tags: ['v'], img: 'photo-1551183053-bf91a1d81141' },
      { name: 'Ravioli Burro e Salvia', desc: 'Ricotta and spinach ravioli, brown butter, crispy sage.', price: 15, tags: ['v'], img: 'photo-1587740908075-9e245070dfaa' },
      { name: 'Linguine ai Gamberi', desc: 'Prawns, cherry tomatoes, garlic, white wine, chilli.', price: 19, tags: ['spicy'], img: 'photo-1563379926898-05f4575a45d8' }
    ] },
    { id: 'dolci', name: 'Dolci', short: 'Desserts', num: '04', blurb: 'Made in house. The tiramisù is the one people come back for.', items: [
      { name: 'Tiramisù', desc: 'Savoiardi, espresso, mascarpone, cocoa. The classic.', price: 8, tags: ['v', 'pick'], img: 'photo-1571877227200-a0d98ea607e9' },
      { name: 'Panna Cotta', desc: 'Vanilla cream, seasonal berries, almond crumble.', price: 7, tags: ['v', 'gf'], img: 'photo-1563805042-7684c019e1cb' },
      { name: 'Gelato Artigianale', desc: 'Three scoops. Pistachio, stracciatella, hazelnut.', price: 7, tags: ['v', 'gf'], img: 'photo-1497034825429-c343d7c6a68f' },
      { name: 'Coppa al Caramello', desc: 'Fior di latte gelato, salted caramel, toasted hazelnuts, cream.', price: 8, tags: ['v', 'gf'], img: 'photo-1551024506-0bccd828d307' },
      { name: 'Torta al Cioccolato', desc: 'Dark chocolate cake, olive oil, sea salt, crème fraîche.', price: 8, tags: ['v'], img: 'photo-1541783245831-57d6fb0926d3' },
      { name: 'Crostata di Fragole', desc: 'Shortcrust, vanilla custard, strawberries.', price: 8, tags: ['v'], img: 'photo-1587314168485-3236d6710814' },
      { name: 'Cheesecake ai Mirtilli', desc: 'Baked ricotta cheesecake, blueberry compote.', price: 8, tags: ['v'], img: 'photo-1567327613485-fbc7bf196198' },
      { name: 'Torta Caprese', desc: 'Flourless chocolate and almond cake, powdered sugar.', price: 8, tags: ['v', 'gf'], img: 'photo-1624353365286-3f8d62daad51' }
    ] },
    { id: 'drinks', name: 'Da Bere', short: 'Drinks', num: '05', blurb: 'Aperitivi, a few cocktails, and wine from people we know.', items: [
      { name: 'Aperol Spritz', desc: 'Aperol, prosecco, soda, orange.', price: 9, tags: ['pick'], img: 'photo-1560512823-829485b8bf24' },
      { name: 'Negroni', desc: 'Gin, Campari, sweet vermouth, orange peel.', price: 11, tags: [], img: 'photo-1536935338788-846bb9981813' },
      { name: 'Espresso Martini', desc: 'Vodka, coffee liqueur, fresh espresso.', price: 12, tags: [], img: 'photo-1553361371-9b22f78e8b1d' },
      { name: 'Limonata Siciliana', desc: 'Pressed Sicilian lemons, mint, sparkling water.', price: 5, tags: ['vg', 'gf'], img: 'photo-1546171753-97d7676e4602' },
      { name: 'Chianti Classico', desc: 'Tuscany. Sangiovese, cherry and dried herbs. By the glass.', price: 8, tags: [], img: 'photo-1506377247377-2a5b3b417ebb' },
      { name: 'Hugo', desc: 'Elderflower, prosecco, mint, lime, soda.', price: 9, tags: [], img: 'photo-1513558161293-cdaf765ed2fd' },
      { name: 'Amaro on the Rocks', desc: 'Montenegro or Averna, one large cube, orange.', price: 7, tags: [], img: 'photo-1514362545857-3bc16c4c7d1b' },
      { name: 'Sangria Bianca', desc: 'White wine, peach, strawberries, a little brandy. By the glass.', price: 8, tags: [], img: 'photo-1497534446932-c925b458314e' }
    ] }
  ]
};
