// Konten minigame arcade. Edit di sini tanpa menyentuh logika game.

// Kasir Rush: barang warung (harga dalam rupiah)
export const WARUNG_ITEMS = [
  { name: 'Indomie Goreng', price: 3500 },
  { name: 'Kopi Sachet', price: 2000 },
  { name: 'Teh Botol', price: 5000 },
  { name: 'Roti Sobek', price: 12000 },
  { name: 'Telur 1/4 kg', price: 7500 },
  { name: 'Gula 1 kg', price: 16000 },
  { name: 'Beras 1 liter', price: 14000 },
  { name: 'Sabun Mandi', price: 4500 },
  { name: 'Air Mineral', price: 3000 },
  { name: 'Kerupuk', price: 1000 },
  { name: 'Minyak 1 L', price: 18000 },
  { name: 'Susu Kotak', price: 6500 },
  { name: 'Pulsa 10rb', price: 11500 },
];

export const CUSTOMERS = ['Pak RT', 'Bu Ani', 'Anak kos', 'Mas ojol', 'Dosen', 'Tetangga', 'Bocil', 'Mbak kasir sebelah'];

// Vibe Typer & Bug Hunt: potongan kode pendek
export const CODE_SNIPPETS = [
  `Route::get('/products', [ProductController::class, 'index']);`,
  `val temp by viewModel.temperature.collectAsState()`,
  `Firebase.RTDB.setFloat(&db, "/dryer/temp", readTemp());`,
  `final pnl = trades.fold(0.0, (sum, t) => sum + t.pnl);`,
  `const tools = await fetch('/api/tools').then((r) => r.json());`,
  `Product::find($id)->decrement('stock', $qty);`,
  `if (millis() - lastSend > INTERVAL) sendData();`,
  `ref.watch(tradesProvider).where((t) => t.isWin).length;`,
];

export const BUG_HUNT_CODE = [
  'void loop() {',
  '  float temp = readTemp();',
  '  if (temp > 60) heater.off();',
  '  Firebase.setFloat(db, "/temp", temp);',
  '  delay(5000);',
  '}',
  '',
  'public function checkout() {',
  '  foreach ($this->cart as $item) {',
  '    $item->product->decrement("stock");',
  '  }',
  '  return redirect()->route("pos");',
  '}',
];

// Prompt Roulette: kode ber-bug + 3 prompt; `answer` = indeks prompt yang benar
export const PROMPT_QUIZ = [
  {
    code: `for (int i = 0; i <= 10; i++) {\n  readings[i] = analogRead(PIN);\n}\n// int readings[10];`,
    options: [
      'Ganti kondisi loop jadi i < 10 supaya tidak keluar batas array',
      'Tambahkan delay(1000) di dalam loop',
      'Ubah analogRead jadi digitalRead',
    ],
    answer: 0,
  },
  {
    code: `$total = 0;\nforeach ($cart as $item) {\n  $total = $item->price * $item->qty;\n}`,
    options: [
      'Pindahkan $total = 0 ke dalam foreach',
      'Pakai += supaya subtotal tiap item dijumlahkan',
      'Ganti foreach dengan while',
    ],
    answer: 1,
  },
  {
    code: `fetch('/api/tools')\nconsole.log(data.length)`,
    options: [
      'Tambahkan setTimeout 3 detik sebelum console.log',
      'Bungkus dengan try/catch saja',
      'Await respons lalu parse JSON sebelum memakai data',
    ],
    answer: 2,
  },
  {
    code: `if (password = "admin123") {\n  login();\n}`,
    options: [
      'Pakai perbandingan (===), dan jangan hardcode password di kode',
      'Ganti password jadi lebih panjang',
      'Tambahkan else { logout(); }',
    ],
    answer: 0,
  },
  {
    code: `Text(text = "Suhu: $temp")\n// temp: MutableState<Float>, UI tidak update`,
    options: [
      'Panggil invalidate() manual tiap detik',
      'Baca nilai lewat temp.value / delegasi by agar Compose recompose',
      'Ubah Text jadi Button',
    ],
    answer: 1,
  },
  {
    code: `SELECT * FROM users WHERE name = '" + input + "'`,
    options: [
      'Tambahkan LIMIT 1',
      'Ubah input jadi huruf kecil dulu',
      'Pakai prepared statement / parameter binding untuk cegah SQL injection',
    ],
    answer: 2,
  },
  {
    code: `ListView(children: trades.map((t) => TradeTile(t)).toList())\n// 10.000 item, scroll patah-patah`,
    options: [
      'Pakai ListView.builder supaya item dibuat lazy',
      'Bungkus dengan SingleChildScrollView',
      'Tambahkan setState di tiap TradeTile',
    ],
    answer: 0,
  },
  {
    code: `WiFi.begin(ssid, pass);\nFirebase.begin(&config, &auth);\n// kadang gagal connect`,
    options: [
      'Hapus Firebase.begin',
      'Tunggu WiFi.status() == WL_CONNECTED sebelum Firebase.begin',
      'Ganti baud rate Serial',
    ],
    answer: 1,
  },
  {
    code: `useEffect(() => {\n  setCount(count + 1);\n});`,
    options: [
      'Ganti useEffect jadi useMemo',
      'Tambahkan dependency array agar tidak render tanpa henti',
      'Pindahkan setCount ke luar komponen',
    ],
    answer: 1,
  },
];
