eye-monitor
Monitora lo stato aperti/chiusi degli occhi
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
come farlo funzionare
Il file che contiene lo script html deve essere disponibile nel file system del dispositivo su cui si intende eseguirlo. Non basta quindi attivarlo nelle preview disponibili quando lo si riceve come allegato in una mail o in un messaggio whatsapp.
Una volta che il file è disponibile:
-	Si apre il file html con un browser certificato Sul dispositivo appare un cerchio nero
-	Al primo tap il cerchio diventa rosso e …
-	…la telecamera si accende e resta in attea di inauadrare gli occhi di una persona
-	Quando vengono inquadati gli occhi  il cerchio diventa verde
-	Quando  gli occhi inquadrati si chiudono il cerchio diventa rosso e viene emesso un suono continuo  
-	Se gli occhi scompaiono dall’inquadratura  il cerchio è rosso e non viene emesso alcun suono
-	Se gli occhi inquadrati si riaprono,il cerchio diventa verde  
-	Se si fa tap sul cerchio rosso o verde il cerchio diventa nero e la app va in standby.    
Considerazioni
Gli algoritmi di analisi della sequenza di frame possono essere diversi, a seconda della prontezza del riconoscimento di un cambio di stato o della capacità di filtrare i battiti di ciglia che si intende avere.
 È possibile scrivere algoritmi che identificano sequenze apri-chiudi-apri… temporizzate, per poter comunicare con il battito di ciglia,  o, per scopi clinici, lavorare sui due occhi in modo distinto.
Il ruolo di Claude, il bot di Antropicĥ
Il codice è stato prodotto totalmente da Claude-chat, in base a specifiche fornitegli in modo discorsivo. 3+

