eye-monitor
Monitora lo stato aperti/chiusi degli occhi

Sono disponibili due varianti dello script, entrambe standalone (nessun backend):
-	`eye-monitor-2stati.html` — versione originale a 2 stati: verde (occhi aperti) / rosso con suono continuo (occhi chiusi), basata sulla media dei due blendshape eyeBlinkLeft/eyeBlinkRight, senza distinguere i due occhi.
-	`eye-monitor-4stati.html` — versione con occhi distinti: verde (entrambi aperti) / giallo (solo sinistro chiuso) / blu (solo destro chiuso) / rosso con suono continuo (entrambi chiusi). L'allarme sonoro scatta solo con entrambi gli occhi chiusi.
-	`eye-monitor-blink-test.html` — variante di test per verificare il riconoscimento del singolo battito di ciglio a diversi frame rate della fotocamera (vedi sezione dedicata più sotto).

Cosa fa	
eye-monitor è un script html eseguibile in un browser, e con questo assimilabile ad una app, che rileva lo stato degli occhi inquadrati da una webcam collegata a un PC o dalla camera selfie di un telefonino android. Una volta inqudrati gli occhi con la camera, se gli occhi sono aperti sul dispositivo è visibile un cerchio verde, se  gli occhi si chiudono il cerchio diventa rosso e il dispositivo emette un suono  che smette quando gl occhi vengono riaperti.
Il cuore della app è costituito dalla libreria mediapipe di google le cui funzioni, invocati dallo script html, consentono il rilevamento e tracciamento di landmark del volto frame dopo frame, quindi il riconoscimento di uno stato “occhio chiuso" e di uno “occhio aperto".
La libreria MediaPipe
La libreria MediaPipe traccia il volto con un totale di 478 landmark .
Per un singolo occhio, i landmark si dividono in due gruppi:
•	**16 punti di contorno** (palpebra superiore e inferiore) — sono quelli che in genere si usano per calcolare l’Eye Aspect Ratio (EAR) a mano
•	**5 punti per l’iride** (centro pupilla + 4 punti sul bordo) — aggiunti dal raffinamento iris, utili se vuoi anche la direzione dello sguardo, non solo aperto/chiuso
Quindi **21 landmark per occhio** in totale (42 per entrambi), su 478 complessivi del volto.
Nel caso specificlandmark-monitor però, non si sta usando direttamente questi landmark: il codice si appoggia ai **blendshape** `eyeBlinkLeft`/`eyeBlinkRight`, che sono valori (0-1) già calcolati internamente da MediaPipe a partire da quei landmark — più comodo e robusto che ricavare l’EAR a mano dai 16 punti di contorno.
Come si utilizza
pre-requisiti  e abilitazioni
la libreria mediapipe deve essere disponibile sul dispositivo su cui si vuole far funzionare la app.Alla data è stato veririfcato su:
-	 PC con windows 11 
-	Tablet samsung S7 con Android 13
-	Smartphone galxy S23 con Anlibreri6
Il funzionamento dello script è stato verificato  con i browser:
-	chrome 
-	edge
-	firefox
tutti devono avere accesso alla camera selfie, eventualmente abilitandolo a richiesta
come farlo funzionare (variante eye-monitor-4stati.html; eye-monitor-2stati.html è identica ma con solo verde/rosso, senza distinzione sinistro/destro)
Il file che contiene lo script html deve essere disponibile nel file system del dispositivo su cui si intende eseguirlo. Non basta quindi attivarlo nelle preview disponibili quando lo si riceve come allegato in una mail o in un messaggio whatsapp.
Una volta che il file è disponibile:
-	Si apre il file html con un browser certificato Sul dispositivo appare un cerchio nero
-	Al primo tap il cerchio diventa rosso e …
-	…la telecamera si accende e resta in attea di inauadrare gli occhi di una persona
-	Quando vengono inquadati gli occhi  il cerchio diventa verde (entrambi aperti)
-	Se si chiude solo l’occhio sinistro (destro aperto) il cerchio diventa giallo
-	Se si chiude solo l’occhio destro (sinistro aperto) il cerchio diventa blu
-	Quando entrambi gli occhi inquadrati si chiudono il cerchio diventa rosso e viene emesso un suono continuo
-	Se gli occhi scompaiono dall’inquadratura  il cerchio è rosso e non viene emesso alcun suono
-	Se gli occhi inquadrati si riaprono,il cerchio torna verde
-	Se si fa tap sul cerchio  il cerchio diventa nero e la app va in standby.

Sinistro/destro sono riferiti alla persona inquadrata (occhio sinistro e destro anatomici), non alla posizione sullo schermo: corrispondono direttamente ai blendshape MediaPipe eyeBlinkLeft/eyeBlinkRight, già riferiti al soggetto.
L’allarme sonoro scatta solo quando entrambi gli occhi sono chiusi; gli stati con un solo occhio chiuso (giallo/blu) sono solo visivi, utili ad es. per rilevare un’asimmetria (ptosi, paralisi facciale) senza far scattare l’allarme per un blink asincrono dei due occhi.
Considerazioni
Gli algoritmi di analisi della sequenza di frame possono essere diversi, a seconda della prontezza del riconoscimento di un cambio di stato o della capacità di filtrare i battiti di ciglia che si intende avere.
 È possibile scrivere algoritmi che identificano sequenze apri-chiudi-apri… temporizzate, per poter comunicare con il battito di ciglia,  o, per scopi clinici, lavorare sui due occhi in modo distinto.

Variante di test: eye-monitor-blink-test.html (es. Galaxy S23)
Pensata per verificare a quale frame rate della fotocamera il riconoscimento del singolo battito di ciglio resta affidabile.
-	Prima di avviare, si sceglie da un menu l'fps richiesto alla fotocamera (20-120). Lo script lo richiede con getUserMedia (prima "exact", poi in automatico "ideal" se il dispositivo non lo supporta) tramite i vincoli del video; è quindi possibile impostarlo a programma, ma il valore ottenuto è comunque quello che il dispositivo riesce davvero a negoziare (letto da track.getSettings() e mostrato a schermo) — molti telefoni via browser si fermano a 30 o 60 fps, perché le modalità slow-motion (90/120) sono spesso riservate alla app Camera nativa e non esposte al web.
-	Un solo cerchio segnala lo stato: grigio = ricerca volto, verde = occhio aperto, rosso = occhio chiuso (senza allarme sonoro continuo).
-	A differenza delle altre due varianti, qui non c'è alcuna soglia minima di durata della chiusura: ogni chiusura, anche di un solo frame, viene contata, perché lo scopo è proprio catturare i battiti rapidi, non filtrarli.
-	Ad ogni battito completo (chiusura seguita da riapertura) la app emette un breve bip e registra nel log: numero progressivo, orario con i millisecondi, numero di frame in cui l'occhio è risultato chiuso, durata stimata in ms.
-	Il conteggio dei frame usa, quando disponibile, requestVideoFrameCallback: è legato ai frame reali della fotocamera, non al refresh dello schermo, così il numero di "frame di chiusura" registrato è confrontabile tra un fps e l'altro. Se il browser non lo supporta, il conteggio ricade sul refresh schermo e viene segnalato come approssimativo.
-	I contatori "Frame elaborati" e "FPS osservati" (frame elaborati al secondo) permettono di capire se il dispositivo riesce davvero a tenere il passo dell'fps richiesto, oppure se il riconoscimento (MediaPipe) diventa il collo di bottiglia agli fps più alti.
-	Il log si accumula tra pause/riprese dello stesso test; il tasto "Svuota" lo azzera (utile per separare i test fatti con fps diversi) e "Esporta CSV" scarica i dati raccolti (incluso l'fps richiesto e quello negoziato) per confrontarli fuori dall'app.

PWA del test battito: cartella blink-test/
La cartella `blink-test/` contiene la stessa pagina installata come PWA indipendente (icona in home screen, funzionamento offline dopo il primo avvio online), con manifest e service worker propri (scope e nomi di cache diversi da quelli della app principale, per non interferire con essa sullo stesso sito).
-	Richiede che il sito sia servito via **https** (es. GitHub Pages): un service worker non si registra su un file aperto con `file://`, quindi aperta così la pagina funziona per il rilevamento ma non è installabile né disponibile offline.
-	Per pubblicarla con GitHub Pages su questo repository: Settings → Pages → Build and deployment → Source "Deploy from a branch" → Branch `main` / `/(root)` → Save. L'URL sarà del tipo `https://<utente>.github.io/eye_monitor/blink-test/`. Nota: essendo il repo privato, GitHub Pages è disponibile solo con un piano GitHub Pro/Team/Enterprise (sul piano Free le Pages richiedono repo pubblico).
-	Da quell'URL, sul telefono: menu del browser → "Aggiungi a schermata Home" (o il prompt di installazione automatico) per installarla come app a sé stante, separata da "Monitor Occhi".
-	Bug noto (preesistente, non introdotto da questa variante): il manifest/index.html della app principale a root puntano alle icone come `icons/icon-192.png` ecc., ma i file sono in realtà alla radice del repo (`icon-192.png`); l'icona della PWA principale quindi probabilmente non si carica. La PWA di blink-test punta invece ai percorsi corretti.
Il ruolo di Claude, il bot di Antropicĥ
Il codice è stato prodotto totalmente da Claude-chat, in base a specifiche fornitegli in modo discorsivo. 3+

