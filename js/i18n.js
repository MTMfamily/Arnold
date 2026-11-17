// Traductions de Musala : français, lingala, swahili, tshiluba et kikongo.
//
// ⚠️ Ces traductions ont été préparées par une IA. Elles doivent être relues et corrigées
// par des personnes qui parlent chaque langue (surtout le tshiluba et le kikongo).
// Pour corriger une traduction : trouve la phrase française ci-dessous et modifie le texte
// dans la bonne langue. L'ordre est toujours : [lingala, swahili, tshiluba, kikongo].
// Les mots entre accolades, comme {nom}, sont remplacés automatiquement : ne les traduis pas.
// Une phrase absente du dictionnaire reste simplement en français.

const LANGUES = {
  fr: "Français",
  ln: "Lingála",
  sw: "Kiswahili",
  lua: "Tshiluba",
  kg: "Kikongo",
};
const ORDRE_LANGUES = ["ln", "sw", "lua", "kg"];

const TRADUCTIONS = {
  // ---------- Menu et bas de page ----------
  "Offres": ["Misala", "Kazi", "Midimu", "Bisalu"],
  "Talents": ["Bato ya mayele", "Vipaji", "Bena dimanya", "Bantu ya mayele"],
  "Connexion": ["Kokota", "Ingia", "Kubuela", "Kukota"],
  "S'inscrire": ["Komikomisa", "Jiandikishe", "Kudifundisha", "Kudisonika"],
  "Mon espace": ["Esika na ngai", "Ukurasa wangu", "Muaba wanyi", "Kisika na mono"],
  "Déconnexion": ["Kobima", "Toka", "Kupatuka", "Kubasika"],
  "Langue": ["Lokota", "Lugha", "Muakulu", "Ndinga"],
  "Mode léger": ["Mode ya pete", "Hali nyepesi", "Mushindu mupepele", "Mode ya pete"],
  "« le travail » en lingala · Le réseau pro de la RDC": ["« mosala » na lingala · Réseau ya misala ya RDC", "« kazi » kwa Kilingala · Mtandao wa kazi wa RDC", "« mudimu » mu lingala · Tshisangilu tsha midimu tsha RDC", "« kisalu » na lingala · Réseau ya bisalu ya RDC"],
  "Projet d'Arnold · Code en Famille": ["Mosala ya Arnold · Code en Famille", "Mradi wa Arnold · Code en Famille", "Mudimu wa Arnold · Code en Famille", "Kisalu ya Arnold · Code en Famille"],
  "🗣️ Traduction en cours de vérification : aide-nous à la corriger !": [
    "🗣️ Libongoli oyo ezali naino kotalama : salisá biso tobongisa yango !",
    "🗣️ Tafsiri hii bado inakaguliwa : tusaidie kuirekebisha !",
    "🗣️ Dikudimuna edi kadiyi dijikija kutangila : tuambuluishe bua kuriakaja !",
    "🗣️ Ndimbudulu yai ke na kutalama ntete : sadisa beto na kuyidikisa yo !",
  ],

  // ---------- Dates ----------
  "aujourd'hui": ["lelo", "leo", "lelu", "bubu"],
  "hier": ["lobi eleki", "jana", "makelela", "mazono"],
  "il y a {n} jours": ["mikolo {n} eleki", "siku {n} zilizopita", "matuku {n} mapite", "bilumbu {n} me luta"],
  "{n} ans": ["mbula {n}", "miaka {n}", "bidimu {n}", "bamvula {n}"],

  // ---------- Accueil ----------
  "Ton talent mérite d'être vu.": ["Mayele na yo esengeli komonana.", "Kipaji chako kinastahili kuonekana.", "Dimanya diebe didi ne bua kumoneka.", "Mayele na nge fwete monana."],
  "Musala connecte les demandeurs d'emploi et les employeurs de toute la RDC, de Kinshasa à Lubumbashi, de Goma à Matadi.": [
    "Musala ekangisaka bato balukaka mosala na bapesi mosala na RDC mobimba, longwa Kinshasa tii Lubumbashi, longwa Goma tii Matadi.",
    "Musala inaunganisha watafuta kazi na waajiri katika RDC nzima, kutoka Kinshasa hadi Lubumbashi, kutoka Goma hadi Matadi.",
    "Musala udi usangisha bakebi ba mudimu ne bapi ba mudimu mu RDC mujima, kutuka ku Kinshasa too ne ku Lubumbashi, kutuka ku Goma too ne ku Matadi.",
    "Musala ke kangisaka bantu yina ke sosa kisalu ti bantu yina ke pesa kisalu na RDC ya mvimba, katuka Kinshasa tii Lubumbashi, katuka Goma tii Matadi.",
  ],
  "Métier, compétence…": ["Mosala, mayele…", "Kazi, ujuzi…", "Mudimu, bumanyi…", "Kisalu, mayele…"],
  "Toutes les villes": ["Bingumba nyonso", "Miji yote", "Bimenga bionso", "Bambanza yonso"],
  "Chercher": ["Luka", "Tafuta", "Keba", "Sosa"],
  "Je cherche un emploi": ["Nazali koluka mosala", "Natafuta kazi", "Ndi nkeba mudimu", "Mono ke sosa kisalu"],
  "Je recrute": ["Nazali kozwa bato ya mosala", "Ninaajiri", "Ndi nkeba bena mudimu", "Mono ke baka bantu ya kisalu"],
  "offres d'emploi": ["misala ezali", "nafasi za kazi", "midimu idiku", "bisalu kele"],
  "talents vérifiés": ["bato ya mayele batalami", "vipaji vilivyothibitishwa", "bena dimanya bakadi batangila", "bantu ya mayele me talama"],
  "employeurs vérifiés": ["bapesi mosala batalami", "waajiri waliothibitishwa", "bapi ba mudimu bakadi batangila", "bapesi kisalu me talama"],
  "Offres récentes": ["Misala ya sika", "Kazi mpya", "Midimu mipiamipia", "Bisalu ya mpa"],
  "Aucune offre pour le moment.": ["Mosala ezali naino te.", "Hakuna kazi kwa sasa.", "Kakuena mudimu bua katataka.", "Kisalu kele ve sesepi."],
  "Voir toutes les offres": ["Talá misala nyonso", "Ona kazi zote", "Mona midimu yonso", "Tala bisalu yonso"],

  // ---------- Offres ----------
  "Offres d'emploi": ["Misala", "Nafasi za kazi", "Midimu", "Bisalu"],
  "{n} résultat(s)": ["biloko {n} emonani", "matokeo {n}", "bintu {n} bisangana", "bima {n} me monana"],
  "Métier, compétence, entreprise…": ["Mosala, mayele, kompanyi…", "Kazi, ujuzi, kampuni…", "Mudimu, bumanyi, kompanyi…", "Kisalu, mayele, kompani…"],
  "Tous les secteurs": ["Badomɛni nyonso", "Sekta zote", "Bitupa bionso", "Bitini yonso"],
  "Tous les contrats": ["Bakontra nyonso", "Mikataba yote", "Bipungidi bionso", "Bakontra yonso"],
  "Filtrer": ["Pona", "Chuja", "Sungula", "Pona"],
  "Aucune offre ne correspond. Essaie d'autres filtres !": ["Mosala moko te ekokani. Meka maponi mosusu !", "Hakuna kazi inayolingana. Jaribu vichujio vingine !", "Kakuena mudimu udi upetangana. Teta masungula makuabu !", "Kisalu mosi ve ke wakana. Meka maponi ya nkaka !"],
  "Voir plus": ["Talá mingi", "Ona zaidi", "Mona bikuabu", "Tala mingi"],
  "← Toutes les offres": ["← Misala nyonso", "← Kazi zote", "← Midimu yonso", "← Bisalu yonso"],
  "✔ Vérifié": ["✔ Etalami", "✔ Imethibitishwa", "✔ Mutangila", "✔ Me talama"],
  "publiée {quand}": ["etiamaki {quand}", "imechapishwa {quand}", "mitekabu {quand}", "me tulama {quand}"],
  "Le poste": ["Mosala", "Nafasi", "Mudimu", "Kisalu"],
  "Compétences recherchées": ["Mayele oyo bazali koluka", "Ujuzi unaohitajika", "Bumanyi budi bukebibua", "Mayele yina bo ke sosa"],
  "À propos de {nom}": ["Na ntina na {nom}", "Kuhusu {nom}", "Bua bualu bua {nom}", "Sambu na {nom}"],
  "Se connecter pour postuler": ["Kota mpo na kotinda mokanda", "Ingia ili kuomba kazi", "Buela bua kulomba mudimu", "Kota sambu na kulomba kisalu"],
  "Voir les candidats": ["Talá bato basengi", "Ona waombaji", "Mona balombi", "Tala bantu me lomba"],
  "Connecte-toi avec un compte demandeur pour postuler.": ["Kota na kɔnti ya moluki mosala mpo na kotinda mokanda.", "Ingia kwa akaunti ya mtafuta kazi ili kuomba.", "Buela ne kɔnti wa mukebi wa mudimu bua kulomba.", "Kota na kɔnti ya muntu ke sosa kisalu sambu na kulomba."],
  "🔒 Ton dossier doit être validé par un administrateur avant de pouvoir postuler.": [
    "🔒 Administrateur asengeli kondima dosie na yo liboso ete otinda mokanda.",
    "🔒 Faili lako lazima likubaliwe na msimamizi kabla ya kuomba kazi.",
    "🔒 Mulombodi udi ne bua kuitaba dosie diebe kumpala kua kulomba.",
    "🔒 Administrateur fwete ndima dosie na nge ntete na kulomba.",
  ],
  "Voir mon dossier": ["Talá dosie na ngai", "Ona faili langu", "Mona dosie dianyi", "Tala dosie na mono"],
  "✅ Tu as déjà postulé. Statut :": ["✅ Osilaki kotinda mokanda. Ezalela :", "✅ Umeshaomba. Hali :", "✅ Wakadi mulombe kale. Muanda :", "✅ Nge me lomba dezia. Mutindu :"],
  "Ton message à l'employeur": ["Nsango na yo epai ya mopesi mosala", "Ujumbe wako kwa mwajiri", "Mukenji webe kudi mupi wa mudimu", "Nsangu na nge na mupesi kisalu"],
  "Présente-toi en quelques lignes et dis pourquoi ce poste t'intéresse.": [
    "Mimonisa na milongo mike mpe loba mpo na nini mosala oyo esepelisi yo.",
    "Jitambulishe kwa mistari michache na useme kwa nini nafasi hii inakuvutia.",
    "Diyikile mu milongo mikese ne amba bua tshinyi mudimu eu udi ukusankisha.",
    "Kudimonisa na milongo fioti mpe tuba sambu na nki kisalu yai ke sepelisa nge.",
  ],
  "Postuler": ["Tinda mokanda", "Omba kazi", "Lomba mudimu", "Lomba kisalu"],
  "🔒 Cette offre n'est pas visible du public : le compte de l'employeur n'est pas validé.": [
    "🔒 Mosala oyo emonanaka te : kɔnti ya mopesi mosala endimami naino te.",
    "🔒 Kazi hii haionekani kwa umma : akaunti ya mwajiri haijakubaliwa.",
    "🔒 Mudimu eu kawuena umueneka : kɔnti wa mupi wa mudimu kauvua muitabibue.",
    "🔒 Kisalu yai ke monana ve : kɔnti ya mupesi kisalu me ndimama ve.",
  ],
  "Tu es connecté en administrateur.": ["Okoti lokola administrateur.", "Umeingia kama msimamizi.", "Wakadi mubuele bu mulombodi.", "Nge me kota bonso administrateur."],

  // ---------- Talents ----------
  "{n} profil(s) vérifié(s)": ["profil {n} etalami", "wasifu {n} uliothibitishwa", "profil {n} mitangila", "profil {n} me talama"],
  "Nom, métier, compétence…": ["Nkombo, mosala, mayele…", "Jina, kazi, ujuzi…", "Dina, mudimu, bumanyi…", "Zina, kisalu, mayele…"],
  "Aucun talent trouvé.": ["Moto ya mayele amonani te.", "Hakuna kipaji kilichopatikana.", "Kakuena muena dimanya mumueneke.", "Muntu ya mayele me monana ve."],
  "← Tous les talents": ["← Bato ya mayele nyonso", "← Vipaji vyote", "← Bena dimanya bonso", "← Bantu ya mayele yonso"],
  "Membre Musala": ["Moto ya Musala", "Mwanachama wa Musala", "Muena Musala", "Muntu ya Musala"],
  "🟢 Disponible": ["🟢 Azali pɔsɔ", "🟢 Anapatikana", "🟢 Udi mudilongolole", "🟢 Kele ya kuyilama"],
  "À propos": ["Na ntina na ye", "Kuhusu", "Bua bualu buende", "Sambu na yandi"],
  "Compétences": ["Mayele", "Ujuzi", "Bumanyi", "Mayele"],
  "Expérience": ["Boyebi ya mosala", "Uzoefu", "Dimanya dia mudimu", "Mambu ya kisalu"],
  "Études": ["Kelasi", "Masomo", "Malongesha", "Kalasi"],
  "Contact": ["Kokutana", "Mawasiliano", "Kuyukidilangana", "Kuwakana"],
  "Les coordonnées sont visibles uniquement par les employeurs vérifiés.": [
    "Sɛkɔ bapesi mosala batalami nde bakoki komona adresi na telefone.",
    "Mawasiliano yanaonekana na waajiri waliothibitishwa tu.",
    "Anu bapi ba mudimu batangila ke badi mua kumona mushindu wa kumuyukila.",
    "Kaka bapesi kisalu me talama lenda mona adresi ti telefone.",
  ],
  "🔒 Ce profil n'est pas encore visible du public.": ["🔒 Profil oyo emonanaka naino te.", "🔒 Wasifu huu bado hauonekani kwa umma.", "🔒 Profil eu kawena naku umueneka.", "🔒 Profil yai ke monana ntete ve."],

  // ---------- Connexion ----------
  "E-mail": ["E-mail", "Barua pepe", "E-mail", "E-mail"],
  "Mot de passe": ["Liloba ya sekele", "Nenosiri", "Diyi dia musokoko", "Mpova ya kinsweki"],
  "Se connecter": ["Kota", "Ingia", "Buela", "Kota"],
  "Pas encore de compte ?": ["Ozali naino na kɔnti te ?", "Bado huna akaunti ?", "Kuena naku ne kɔnti ?", "Nge kele ntete ve ti kɔnti ?"],
  "Inscris-toi": ["Komikomisa", "Jiandikishe", "Difundishe", "Kudisonika"],
  "🔒 Sur un ordinateur partagé (cybercafé, école), pense à cliquer sur Déconnexion en partant. Par sécurité, Musala te déconnecte aussi après 30 minutes sans activité.": [
    "🔒 Soki osaleli ordinatɛrɛ ya bato mingi (cybercafé, kelasi), kobosana te kofina « Kobima » ntango ozali kokende. Mpo na libateli, Musala ekobimisa yo mpe soki ominiti 30 eleki kozanga kosala eloko.",
    "🔒 Kwenye kompyuta ya pamoja (cybercafé, shule), kumbuka kubofya « Toka » unapoondoka. Kwa usalama, Musala inakutoa pia baada ya dakika 30 bila shughuli.",
    "🔒 Pa ordinatere wa bantu bonso (cybercafé, tshilongelu), kuvulukila kukomena « Kupatuka » paudi uya. Bua bukubi, Musala neikupatule kabidi panyima pa minite 30 kuyi wenza tshintu.",
    "🔒 Na ordinatere ya bantu mingi (cybercafé, kalasi), kuvila ve kufina « Kubasika » ntangu nge ke kwenda. Sambu na lukengolo, Musala ta basisa nge mpe na nima ya minuti 30 kukonda kusala kima.",
  ],

  // ---------- Inscription : vérification de l'e-mail ----------
  "Ton e-mail": ["E-mail na yo", "Barua pepe yako", "E-mail webe", "E-mail na nge"],
  "Le code reçu": ["Kode oyo ozwi", "Msimbo uliopokea", "Kode muangata", "Kode yina nge me baka"],
  "Ton dossier": ["Dosie na yo", "Faili lako", "Dosie diebe", "Dosie na nge"],
  "Rejoins Musala": ["Yaka na Musala", "Jiunge na Musala", "Lua mu Musala", "Kwisa na Musala"],
  "Pour commencer, on vérifie que ton adresse e-mail t'appartient bien et que tu n'es pas un robot 🤖. Tu vas recevoir un code à 6 chiffres.": [
    "Mpo na kobanda, tokotala soki e-mail oyo ezali mpenza ya yo mpe ete ozali robot te 🤖. Okozwa kode ya mituya 6.",
    "Kuanza, tunahakikisha kwamba barua pepe hii ni yako kweli na kwamba wewe si roboti 🤖. Utapokea msimbo wa tarakimu 6.",
    "Bua kutuadija, tudi tutangila ne e-mail eu udi bulelela webe ne kuena robot 🤖. Neupete kode wa nomba 6.",
    "Sambu na kubanda, beto ke tala nde e-mail yai kele ya nge mpenza mpe nde nge kele robot ve 🤖. Nge ta baka kode ya bantalu 6.",
  ],
  "Ton adresse e-mail": ["Adresi e-mail na yo", "Anwani yako ya barua pepe", "Adresse e-mail webe", "Adresi e-mail na nge"],
  "Recevoir mon code": ["Zwa kode na ngai", "Pokea msimbo wangu", "Angata kode wanyi", "Baka kode na mono"],
  "Déjà inscrit ?": ["Osili komikomisa ?", "Tayari umejiandikisha ?", "Wakadi mudifundishe kale ?", "Nge me disonika dezia ?"],
  "Connecte-toi": ["Kota", "Ingia", "Buela", "Kota"],
  "Entre ton code": ["Kotisa kode na yo", "Weka msimbo wako", "Bueja kode webe", "Kotisa kode na nge"],
  "Nous avons envoyé un code à 6 chiffres à {email}. Il est valable {minutes} minute(s).": [
    "Totindeli kode ya mituya 6 na {email}. Ekosala mpo na miniti {minutes}.",
    "Tumetuma msimbo wa tarakimu 6 kwa {email}. Ni halali kwa dakika {minutes}.",
    "Tuakatuma kode wa nomba 6 kudi {email}. Udi ne bukole bua minite {minutes}.",
    "Beto me tinda kode ya bantalu 6 na {email}. Yo ke sala sambu na minuti {minutes}.",
  ],
  "Code reçu par e-mail": ["Kode oyo ozwi na e-mail", "Msimbo uliopokea kwa barua pepe", "Kode muangata ku e-mail", "Kode yina nge me baka na e-mail"],
  "Vérifier mon code": ["Talá kode na ngai", "Thibitisha msimbo wangu", "Tangila kode wanyi", "Tala kode na mono"],
  "Renvoyer le code": ["Tinda kode lisusu", "Tuma msimbo tena", "Tuma kode kabidi", "Tinda kode diaka"],
  "Changer d'adresse e-mail": ["Bongola adresi e-mail", "Badilisha barua pepe", "Shintulula e-mail", "Soba adresi e-mail"],
  "Pas reçu ? Regarde dans tes courriers indésirables (spam).": [
    "Ozwi te ? Talá na ba spam.",
    "Hujapokea ? Angalia kwenye barua taka (spam).",
    "Kuena mupete ? Tangila mu ba spam.",
    "Nge me baka ve ? Tala na ba spam.",
  ],
  "📬 Boîte mail de démonstration": ["📬 Bokisi ya e-mail ya komeka", "📬 Sanduku la barua la majaribio", "📬 Tshibutu tsha e-mail tsha kuteta", "📬 Bokisi ya e-mail ya kumeka"],
  "En mode démo, aucun e-mail n'est vraiment envoyé : voici le message que tu recevrais.": [
    "Na mode démo, e-mail moko te etindamaka mpenza : tala nsango oyo olingaki kozwa.",
    "Katika hali ya majaribio, hakuna barua pepe inayotumwa kweli : huu ndio ujumbe ungepokea.",
    "Mu mushindu wa kuteta, kakuena e-mail udi utumibua bulelela : mukenji uudi mua kupeta ewu.",
    "Na mode démo, e-mail mosi ve ke tindama mpenza : nsangu yina nge zolaka kubaka yai.",
  ],
  "Ne pas remplir": ["Kotondisa te", "Usijaze", "Kuuwujudi to", "Kufulusa ve"],
  "✔ vérifié": ["✔ etalami", "✔ imethibitishwa", "✔ mutangila", "✔ me talama"],
  "Utiliser une autre adresse": ["Salela adresi mosusu", "Tumia anwani nyingine", "Enza mudimu ne adresse mukuabu", "Sadila adresi ya nkaka"],

  // ---------- Inscription : formulaire ----------
  "Champ obligatoire": ["Esengeli kotondisa", "Sehemu ya lazima", "Bia bualu bualu kuwujuja", "Fwete fulusa"],
  "Je suis…": ["Nazali…", "Mimi ni…", "Ndi…", "Mono kele…"],
  "👤 Demandeur d'emploi": ["👤 Moluki mosala", "👤 Mtafuta kazi", "👤 Mukebi wa mudimu", "👤 Muntu ke sosa kisalu"],
  "Je cherche un travail": ["Nazali koluka mosala", "Natafuta kazi", "Ndi nkeba mudimu", "Mono ke sosa kisalu"],
  "🏢 Employeur": ["🏢 Mopesi mosala", "🏢 Mwajiri", "🏢 Mupi wa mudimu", "🏢 Mupesi kisalu"],
  "Nom complet (comme sur ta pièce d'identité) ou nom de l'entreprise": [
    "Nkombo mobimba (lokola na karte na yo) to nkombo ya kompanyi",
    "Jina kamili (kama kwenye kitambulisho chako) au jina la kampuni",
    "Dina dijima (bu mudidi ku kapia kebe) anyi dina dia kompanyi",
    "Zina ya mvimba (bonso na karti na nge) to zina ya kompani",
  ],
  "Ville": ["Engumba", "Mji", "Tshimenga", "Mbanza"],
  "Téléphone": ["Telefone", "Simu", "Telefone", "Telefone"],
  "Mot de passe (8 caractères minimum)": ["Liloba ya sekele (minimumu bilembo 8)", "Nenosiri (angalau herufi 8)", "Diyi dia musokoko (bimanyinu 8 pa nshi)", "Mpova ya kinsweki (bidimbu 8 na fioti)"],
  "👤 Dossier de vérification": ["👤 Dosie ya botaleli", "👤 Faili la uthibitisho", "👤 Dosie dia kutangila", "👤 Dosie ya kutala"],
  "🏢 Dossier de vérification": ["🏢 Dosie ya botaleli", "🏢 Faili la uthibitisho", "🏢 Dosie dia kutangila", "🏢 Dosie ya kutala"],
  "Créer mon compte et envoyer mon dossier": ["Sala kɔnti na ngai mpe tinda dosie", "Fungua akaunti na utume faili langu", "Enza kɔnti wanyi ne tuma dosie", "Sala kɔnti na mono mpe tinda dosie"],
  "Pour protéger les demandeurs contre les fausses offres, chaque employeur est vérifié par un administrateur avant de pouvoir recruter. Il faut :": [
    "Mpo na kobatela baluki mosala na misala ya lokuta, administrateur atalaka mopesi mosala nyonso liboso ete azwa bato. Esengeli :",
    "Ili kuwalinda watafuta kazi dhidi ya nafasi za uongo, kila mwajiri hukaguliwa na msimamizi kabla ya kuajiri. Inahitajika :",
    "Bua kukuba bakebi ba mudimu ku midimu ya dishima, mulombodi udi utangila mupi wa mudimu yonso kumpala kua kuangata bantu. Bidi bikengela :",
    "Sambu na kukengela bantu ke sosa kisalu na bisalu ya luvunu, administrateur ke tala mupesi kisalu yonso ntete na kubaka bantu. Fwete vanda :",
  ],
  "Pour garantir des profils sérieux aux employeurs, chaque demandeur est vérifié par un administrateur avant de pouvoir postuler. Il faut :": [
    "Mpo bapesi mosala bazwa ba profil ya solo, administrateur atalaka moluki mosala nyonso liboso ete atinda mokanda. Esengeli :",
    "Ili waajiri wapate wasifu wa kweli, kila mtafuta kazi hukaguliwa na msimamizi kabla ya kuomba. Inahitajika :",
    "Bua bapi ba mudimu bapete ba profil ba bulelela, mulombodi udi utangila mukebi wa mudimu yonso kumpala kua kulomba. Bidi bikengela :",
    "Sambu bapesi kisalu kubaka ba profil ya kieleka, administrateur ke tala muntu yonso ke sosa kisalu ntete na kulomba. Fwete vanda :",
  ],
  "Nom complet identique à celui de la pièce d'identité": ["Nkombo mobimba ndenge ezali na karte", "Jina kamili sawa na kwenye kitambulisho", "Dina dijima bu didi ku kapia", "Zina ya mvimba bonso na karti"],
  "Avoir au moins 18 ans (date de naissance)": ["Kozala na mbula 18 to koleka (mokolo ya mbotama)", "Kuwa na angalau miaka 18 (tarehe ya kuzaliwa)", "Kuikala ne bidimu 18 anyi bipite (dituku dia kuledibua)", "Kuvanda ti bamvula 18 to mingi (kilumbu ya kubutuka)"],
  "Pièce d'identité valide : carte d'électeur, passeport ou permis de conduire": [
    "Karte ya solo : karte ya pɔnɔ, passeport to permis ya kotambwisa motuka",
    "Kitambulisho halali : kadi ya mpiga kura, pasipoti au leseni ya udereva",
    "Kapia ka bulelela : kapia ka disungula, pasepore anyi permis wa kuendesha mashinyi",
    "Karti ya kieleka : karti ya bapɔnɔ, pasipore to permis ya kunatisa motuka",
  ],
  "Adresse de résidence en RDC": ["Adresi ya esika ofandaka na RDC", "Anwani ya makazi katika RDC", "Adresse wa muaba uudi usombele mu RDC", "Adresi ya kisika nge ke zinga na RDC"],
  "Niveau d'études renseigné": ["Kelasi oyo osalaki ekomami", "Kiwango cha elimu kimejazwa", "Malongesha muafundibue", "Kalasi nge me landa me sonama"],
  "Métier recherché et au moins une compétence": ["Mosala ozali koluka mpe ata mayele moko", "Kazi unayotafuta na angalau ujuzi mmoja", "Mudimu uudi ukeba ne bumanyi bumue pa nshi", "Kisalu nge ke sosa mpe ata mayele mosi"],
  "Téléphone et e-mail joignables": ["Telefone mpe e-mail oyo ekosala", "Simu na barua pepe zinazopatikana", "Telefone ne e-mail bidi bienza", "Telefone ti e-mail yina ke sala"],
  "Entreprise immatriculée au RCCM (numéro valide)": ["Kompanyi ekomami na RCCM (nimero ya solo)", "Kampuni iliyosajiliwa RCCM (nambari halali)", "Kompanyi mufundibue ku RCCM (nomba wa bulelela)", "Kompani me sonama na RCCM (nimero ya kieleka)"],
  "Numéro d'identification nationale (Id. Nat.)": ["Nimero ya Id. Nat.", "Nambari ya utambulisho wa kitaifa (Id. Nat.)", "Nomba wa Id. Nat.", "Nimero ya Id. Nat."],
  "Numéro d'impôt (NIF)": ["Nimero ya mpako (NIF)", "Nambari ya kodi (NIF)", "Nomba wa tshitadi (NIF)", "Nimero ya mpaku (NIF)"],
  "Adresse physique du siège en RDC": ["Adresi ya biro monene na RDC", "Anwani ya ofisi kuu katika RDC", "Adresse wa biro binene mu RDC", "Adresi ya biro ya nene na RDC"],
  "Responsable du recrutement identifié (nom et fonction)": ["Mokambi ya kozwa bato ayebani (nkombo mpe mosala)", "Msimamizi wa ajira anayejulikana (jina na cheo)", "Mulombodi wa kuangata bantu mumanyike (dina ne mudimu)", "Mfumu ya kubaka bantu ya kuzabana (zina ti kisalu)"],
  "Date de naissance": ["Mokolo ya mbotama", "Tarehe ya kuzaliwa", "Dituku dia kuledibua", "Kilumbu ya kubutuka"],
  "Niveau d'études": ["Kelasi osalaki", "Kiwango cha elimu", "Malongesha", "Kalasi nge me landa"],
  "Pièce d'identité": ["Karte ya botambwisi", "Kitambulisho", "Kapia ka bumuntu", "Karti ya kimuntu"],
  "N° de la pièce": ["Nimero ya karte", "Nambari ya kitambulisho", "Nomba wa kapia", "Nimero ya karti"],
  "Adresse de résidence": ["Adresi ya ndako", "Anwani ya makazi", "Adresse wa nzubu", "Adresi ya nzo"],
  "Métier recherché": ["Mosala ozali koluka", "Kazi unayotafuta", "Mudimu uudi ukeba", "Kisalu nge ke sosa"],
  "Compétences (séparées par des virgules)": ["Mayele (kabolá na virgule)", "Ujuzi (tenganisha kwa koma)", "Bumanyi (abanyangana ne virgule)", "Mayele (kabula na virgule)"],
  "Choisir…": ["Pona…", "Chagua…", "Sungula…", "Pona…"],
  "Secteur": ["Domɛni", "Sekta", "Tshitupa", "Kitini"],
  "N° RCCM": ["Nimero RCCM", "Nambari RCCM", "Nomba RCCM", "Nimero RCCM"],
  "N° Id. Nat.": ["Nimero Id. Nat.", "Nambari Id. Nat.", "Nomba Id. Nat.", "Nimero Id. Nat."],
  "N° Impôt (NIF)": ["Nimero ya mpako (NIF)", "Nambari ya kodi (NIF)", "Nomba wa tshitadi (NIF)", "Nimero ya mpaku (NIF)"],
  "Nom du responsable": ["Nkombo ya mokambi", "Jina la msimamizi", "Dina dia mulombodi", "Zina ya mfumu"],
  "Sa fonction": ["Mosala na ye", "Cheo chake", "Mudimu wende", "Kisalu na yandi"],
  "Adresse du siège": ["Adresi ya biro monene", "Anwani ya ofisi kuu", "Adresse wa biro binene", "Adresi ya biro ya nene"],

  // ---------- Listes ----------
  "Informatique & Tech": ["Informatiki & Teknoloji", "Kompyuta & Teknolojia", "Informatike & Tekinoloji", "Informatiki & Teknoloji"],
  "Mines": ["Mabende", "Madini", "Mabue a buakane", "Bamine"],
  "Agriculture": ["Bilanga", "Kilimo", "Bidime", "Bilanga"],
  "Santé": ["Bokolongono", "Afya", "Bukole bua mubidi", "Mavimpi"],
  "Éducation": ["Mateya", "Elimu", "Dilongesha", "Malongi"],
  "Commerce": ["Mombongo", "Biashara", "Busumbi", "Mumbongo"],
  "BTP": ["Botongi (BTP)", "Ujenzi (BTP)", "Diibaka (BTP)", "Kutunga (BTP)"],
  "Banque & Finance": ["Banki & Mbongo", "Benki & Fedha", "Banke & Makuta", "Banki & Mbongo"],
  "Télécoms": ["Télécoms", "Mawasiliano ya simu", "Télécoms", "Télécoms"],
  "ONG & Humanitaire": ["ONG & Bosalisi", "NGO & Misaada ya kibinadamu", "ONG & Diambuluisha", "ONG & Lusadisu"],
  "Transport & Logistique": ["Transport & Logistiki", "Usafiri & Usafirishaji", "Diambula & Logistike", "Transport & Logistiki"],
  "Hôtellerie": ["Bahotɛlɛ", "Hoteli", "Mahotele", "Bahotele"],
  "CDI": ["CDI (kontra ya ntango molai)", "CDI (mkataba wa kudumu)", "CDI (tshipungidi tsha kashidi)", "CDI (kontra ya ntangu yonso)"],
  "CDD": ["CDD (kontra ya ntango mokuse)", "CDD (mkataba wa muda)", "CDD (tshipungidi tsha tshikondo)", "CDD (kontra ya ntangu fioti)"],
  "Stage": ["Stage", "Mafunzo kazini", "Stage", "Stage"],
  "Freelance": ["Freelance", "Kazi huru", "Freelance", "Freelance"],
  "Temps partiel": ["Ndambo ya ntango", "Muda wa sehemu", "Tshitupa tsha diba", "Ndambu ya ntangu"],
  "Sans diplôme": ["Diplome te", "Bila cheti", "Kuyi dipolome", "Kukonda dipolome"],
  "Certificat d'études primaires": ["Sertifika ya kelasi ya ebandeli", "Cheti cha shule ya msingi", "Setifika wa tshilongelu tshia kumpala", "Sertifika ya kalasi ya ntete"],
  "Diplôme d'État": ["Diplome d'État", "Cheti cha Serikali (Diplôme d'État)", "Dipolome dia Leta", "Dipolome ya Leta"],
  "Formation professionnelle": ["Formasyo ya mosala", "Mafunzo ya ufundi", "Dilongesha dia mudimu", "Malongi ya kisalu"],
  "Graduat": ["Graduat", "Stashahada (Graduat)", "Graduat", "Graduat"],
  "Licence": ["Licence", "Shahada ya kwanza (Licence)", "Licence", "Licence"],
  "Master": ["Master", "Shahada ya uzamili (Master)", "Master", "Master"],
  "Doctorat": ["Doctorat", "Shahada ya uzamivu (Doctorat)", "Doctorat", "Doctorat"],
  "Carte d'électeur": ["Karte ya pɔnɔ", "Kadi ya mpiga kura", "Kapia ka disungula", "Karti ya bapɔnɔ"],
  "Passeport": ["Passeport", "Pasipoti", "Pasepore", "Pasipore"],
  "Permis de conduire": ["Permis ya kotambwisa motuka", "Leseni ya udereva", "Permis wa kuendesha mashinyi", "Permis ya kunatisa motuka"],

  // ---------- Statuts ----------
  "Envoyée": ["Etindami", "Imetumwa", "Mituma", "Me tindama"],
  "Vue": ["Etalami", "Imeonwa", "Mimona", "Me monana"],
  "Entretien": ["Lisolo ya mosala", "Mahojiano", "Diyikila dia mudimu", "Lukutakanu"],
  "Retenue": ["Endimami", "Imekubaliwa", "Muitabibue", "Me ndimama"],
  "Non retenue": ["Endimami te", "Haikukubaliwa", "Kayena muitabibue", "Me ndimama ve"],
  "En attente de validation": ["Ezali kozela kondimama", "Inasubiri kukubaliwa", "Udi utekemena kuitabibua", "Ke vingila kundimama"],
  "Validé": ["Endimami", "Imekubaliwa", "Muitabibue", "Me ndimama"],
  "Refusé": ["Eboyami", "Imekataliwa", "Mubengibue", "Me lemba"],
  "Suspendu": ["Etelemisami", "Imesimamishwa", "Mujikija", "Me telama"],

  // ---------- Espaces personnels ----------
  "Bonjour {nom} 👋": ["Mbote {nom} 👋", "Habari {nom} 👋", "Moyo {nom} 👋", "Mbote {nom} 👋"],
  "🔑 Changer mon mot de passe": ["🔑 Bongola liloba ya sekele", "🔑 Badilisha nenosiri langu", "🔑 Shintulula diyi dianyi dia musokoko", "🔑 Soba mpova na mono ya kinsweki"],
  "Tu pourras publier des offres dès que ton compte sera validé.": ["Okokoka kotia misala soki kɔnti na yo endimami.", "Utaweza kuchapisha nafasi za kazi akaunti yako ikikubaliwa.", "Neukoke kuteka midimu pakuitabibua kɔnti webe.", "Nge ta lenda kutula bisalu ntangu kɔnti na nge ta ndimama."],
  "Tu pourras postuler aux offres et apparaître dans les talents dès que ton dossier sera validé.": [
    "Okokoka kotinda mikanda mpe komonana na bato ya mayele soki dosie na yo endimami.",
    "Utaweza kuomba kazi na kuonekana kwenye vipaji faili lako likikubaliwa.",
    "Neukoke kulomba midimu ne kumueneka munkatshi mua bena dimanya pakuitabibua dosie diebe.",
    "Nge ta lenda kulomba bisalu mpe kumonana na bantu ya mayele ntangu dosie na nge ta ndimama.",
  ],
  "Ton dossier est en cours de vérification.": ["Dosie na yo ezali kotalama.", "Faili lako linakaguliwa.", "Dosie diebe didi ditangilibua.", "Dosie na nge ke talama."],
  "Un administrateur va contrôler tes informations.": ["Administrateur akotala makambo na yo.", "Msimamizi atakagua taarifa zako.", "Mulombodi neatangile malu ebe.", "Administrateur ta tala mambu na nge."],
  "Ton dossier a été refusé.": ["Dosie na yo eboyami.", "Faili lako limekataliwa.", "Dosie diebe diakabengibua.", "Dosie na nge me lemba."],
  "Corrige les informations ci-dessous puis renvoie-le.": ["Bongisa makambo oyo ezali na nse mpe tinda yango lisusu.", "Rekebisha taarifa zilizo hapa chini kisha uzitume tena.", "Akaja malu adi muinshi ne utume kabidi.", "Yidikisa mambu yina kele na nsi mpe tinda yo diaka."],
  "Ton compte est suspendu.": ["Kɔnti na yo etelemisami.", "Akaunti yako imesimamishwa.", "Kɔnti webe mujikija.", "Kɔnti na nge me telama."],
  "Contacte l'administrateur de Musala.": ["Kutana na administrateur ya Musala.", "Wasiliana na msimamizi wa Musala.", "Yukila ne mulombodi wa Musala.", "Wakana ti administrateur ya Musala."],
  "Motif :": ["Ntina :", "Sababu :", "Bualu :", "Kikuma :"],
  "Mon dossier de vérification": ["Dosie na ngai ya botaleli", "Faili langu la uthibitisho", "Dosie dianyi dia kutangila", "Dosie na mono ya kutala"],
  "Renvoyer mon dossier": ["Tinda dosie na ngai lisusu", "Tuma faili langu tena", "Tuma dosie dianyi kabidi", "Tinda dosie na mono diaka"],
  "Mettre à jour mon dossier": ["Bongisa dosie na ngai", "Sasisha faili langu", "Vuija dosie dianyi dipiadipia", "Yidikisa dosie na mono"],
  "À propos de moi (facultatif)": ["Na ntina na ngai (soki olingi)", "Kunihusu (si lazima)", "Bua bualu buanyi (bu muudi musue)", "Sambu na mono (kana nge me zola)"],
  "Expérience (facultatif)": ["Boyebi ya mosala (soki olingi)", "Uzoefu (si lazima)", "Dimanya dia mudimu (bu muudi musue)", "Mambu ya kisalu (kana nge me zola)"],
  "Qui es-tu ? Qu'est-ce qui te motive ?": ["Ozali nani ? Nini epesaka yo makasi ?", "Wewe ni nani ? Nini kinakuhamasisha ?", "Udi nganyi ? Tshinyi tshidi tshikupesha bukole ?", "Nge kele nani ? Nki ke pesaka nge ngolo ?"],
  "Tes emplois, stages, projets…": ["Misala na yo, ba stage, mikano…", "Kazi zako, mafunzo, miradi…", "Midimu yebe, ba stage, malu audi musue kuenza…", "Bisalu na nge, ba stage, bangindu…"],
  "Voir mon profil public": ["Talá profil na ngai", "Ona wasifu wangu", "Mona profil wanyi", "Tala profil na mono"],
  "Mes candidatures": ["Mikanda na ngai ya mosala", "Maombi yangu", "Malomba anyi", "Malombi na mono"],
  "Offre": ["Mosala", "Kazi", "Mudimu", "Kisalu"],
  "Entreprise": ["Kompanyi", "Kampuni", "Kompanyi", "Kompani"],
  "Envoyée le": ["Etindamaki", "Ilitumwa", "Mituma", "Me tindama"],
  "Statut": ["Ezalela", "Hali", "Muanda", "Mutindu"],
  "Tu n'as pas encore postulé.": ["Otindi naino mokanda moko te.", "Bado hujaomba kazi.", "Kuena naku mulombe mudimu.", "Nge me lomba ntete ve."],
  "Découvre les offres": ["Talá misala", "Gundua nafasi za kazi", "Tangila midimu", "Tala bisalu"],
  "Mon profil": ["Profil na ngai", "Wasifu wangu", "Profil wanyi", "Profil na mono"],
  "Mon métier": ["Mosala na ngai", "Kazi yangu", "Mudimu wanyi", "Kisalu na mono"],
  "À propos de moi": ["Na ntina na ngai", "Kunihusu", "Bua bualu buanyi", "Sambu na mono"],
  "Je suis disponible pour un emploi": ["Nazali pɔsɔ mpo na mosala", "Ninapatikana kwa kazi", "Ndi mudilongolole bua mudimu", "Mono kele ya kuyilama sambu na kisalu"],
  "Enregistrer mon profil": ["Bomba profil na ngai", "Hifadhi wasifu wangu", "Lama profil wanyi", "Bumba profil na mono"],
  "Dossier vérifié ✔": ["Dosie etalami ✔", "Faili limethibitishwa ✔", "Dosie mutangila ✔", "Dosie me talama ✔"],
  "Ton identité est vérifiée. Pour la modifier, contacte l'administrateur des demandeurs : elle sera vérifiée à nouveau.": [
    "Botambwisi na yo etalami. Mpo na kobongola yango, kutana na administrateur ya baluki mosala : bakotala yango lisusu.",
    "Utambulisho wako umethibitishwa. Ili kuubadilisha, wasiliana na msimamizi wa watafuta kazi : utakaguliwa tena.",
    "Bumuntu buebe mbutangila. Bua kubushintulula, yukila ne mulombodi wa bakebi ba mudimu : nebutangilibue kabidi.",
    "Kimuntu na nge me talama. Sambu na kusoba yo, wakana ti administrateur ya bantu ke sosa kisalu : bo ta tala yo diaka.",
  ],
  "+ Publier une offre": ["+ Tia mosala", "+ Chapisha nafasi ya kazi", "+ Teka mudimu", "+ Tula kisalu"],
  "Mes offres": ["Misala na ngai", "Nafasi zangu za kazi", "Midimu yanyi", "Bisalu na mono"],
  "Candidats": ["Basengi", "Waombaji", "Balombi", "Balombi"],
  "État": ["Ezalela", "Hali", "Muanda", "Mutindu"],
  "{n} candidat(s)": ["basengi {n}", "waombaji {n}", "balombi {n}", "balombi {n}"],
  "En ligne": ["Ezali na Internet", "Mtandaoni", "Pa Internet", "Kele na Internet"],
  "Fermée": ["Ekangami", "Imefungwa", "Mibuikila", "Me kangama"],
  "Fermer": ["Kanga", "Funga", "Buikila", "Kanga"],
  "Rouvrir": ["Fungola lisusu", "Fungua tena", "Bulula kabidi", "Kangula diaka"],
  "Aucune offre publiée. Lance-toi !": ["Otii naino mosala te. Banda !", "Hakuna nafasi iliyochapishwa. Anza !", "Kuena naku muteke mudimu. Tuadija !", "Nge me tula ntete kisalu ve. Banda !"],
  "Mon entreprise": ["Kompanyi na ngai", "Kampuni yangu", "Kompanyi wanyi", "Kompani na mono"],
  "Site web": ["Site web", "Tovuti", "Site web", "Site web"],
  "Site web (facultatif)": ["Site web (soki olingi)", "Tovuti (si lazima)", "Site web (bu muudi musue)", "Site web (kana nge me zola)"],
  "Présentation": ["Komimonisa", "Maelezo", "Diyikila", "Kudimonisa"],
  "Présentation de l'entreprise": ["Komonisa kompanyi", "Maelezo ya kampuni", "Diyikila dia kompanyi", "Kumonisa kompani"],
  "Que fait ton entreprise ?": ["Kompanyi na yo esalaka nini ?", "Kampuni yako inafanya nini ?", "Kompanyi webe udi wenza tshinyi ?", "Kompani na nge ke salaka nki ?"],
  "Enregistrer": ["Bomba", "Hifadhi", "Lama", "Bumba"],
  "Secteur :": ["Domɛni :", "Sekta :", "Tshitupa :", "Kitini :"],
  "Pour modifier ces informations, contacte l'administrateur des employeurs : elles seront vérifiées à nouveau.": [
    "Mpo na kobongola makambo oyo, kutana na administrateur ya bapesi mosala : bakotala yango lisusu.",
    "Ili kubadilisha taarifa hizi, wasiliana na msimamizi wa waajiri : zitakaguliwa tena.",
    "Bua kushintulula malu aa, yukila ne mulombodi wa bapi ba mudimu : neatangilibue kabidi.",
    "Sambu na kusoba mambu yai, wakana ti administrateur ya bapesi kisalu : bo ta tala yo diaka.",
  ],
  "Responsable": ["Mokambi", "Msimamizi", "Mulombodi", "Mfumu"],
  "Adresse": ["Adresi", "Anwani", "Adresse", "Adresi"],

  // ---------- Publier une offre et candidats ----------
  "← Mon espace": ["← Esika na ngai", "← Ukurasa wangu", "← Muaba wanyi", "← Kisika na mono"],
  "Publier une offre": ["Tia mosala", "Chapisha nafasi ya kazi", "Teka mudimu", "Tula kisalu"],
  "Intitulé du poste": ["Nkombo ya mosala", "Jina la nafasi", "Dina dia mudimu", "Zina ya kisalu"],
  "Contrat": ["Kontra", "Mkataba", "Tshipungidi", "Kontra"],
  "Salaire (facultatif)": ["Lifuta (soki olingi)", "Mshahara (si lazima)", "Difutu (bu muudi musue)", "Lufutu (kana nge me zola)"],
  "Description du poste": ["Ndimbola ya mosala", "Maelezo ya nafasi", "Diumvuija dia mudimu", "Ntendula ya kisalu"],
  "Missions, horaires, avantages…": ["Misala ya kosala, bangonga, matomba…", "Majukumu, saa za kazi, faida…", "Midimu, mêba, mapeta…", "Bisalu, bangunga, mambote…"],
  "Publier l'offre": ["Tia mosala", "Chapisha nafasi", "Teka mudimu", "Tula kisalu"],
  "Pour l'offre « {titre} » · {n} candidature(s)": ["Mpo na mosala « {titre} » · mikanda {n}", "Kwa nafasi « {titre} » · maombi {n}", "Bua mudimu « {titre} » · malomba {n}", "Sambu na kisalu « {titre} » · malombi {n}"],
  "Candidat": ["Mosengi", "Mwombaji", "Mulombi", "Mulombi"],
  "Message": ["Nsango", "Ujumbe", "Mukenji", "Nsangu"],
  "Pas encore de candidat. Partage ton offre !": ["Mosengi azali naino te. Kabolá mosala na yo !", "Bado hakuna mwombaji. Shiriki nafasi yako !", "Kakuena naku mulombi. Abanya mudimu webe !", "Mulombi kele ntete ve. Kabula kisalu na nge !"],

  // ---------- Mot de passe ----------
  "Changer mon mot de passe": ["Bongola liloba ya sekele", "Badilisha nenosiri langu", "Shintulula diyi dianyi dia musokoko", "Soba mpova na mono ya kinsweki"],
  "Mot de passe actuel": ["Liloba ya sekele ya sikoyo", "Nenosiri la sasa", "Diyi dia musokoko dia katataka", "Mpova ya kinsweki ya sesepi"],
  "Nouveau mot de passe ({minimum} caractères minimum)": ["Liloba ya sekele ya sika (minimumu bilembo {minimum})", "Nenosiri jipya (angalau herufi {minimum})", "Diyi dipiadipia dia musokoko (bimanyinu {minimum} pa nshi)", "Mpova ya mpa ya kinsweki (bidimbu {minimum} na fioti)"],
  "Confirme le nouveau mot de passe": ["Ndimisa liloba ya sekele ya sika", "Thibitisha nenosiri jipya", "Shindika diyi dipiadipia", "Ndimisa mpova ya mpa"],

  // ---------- Page introuvable ----------
  "Oups ! 🤔": ["Ah ! 🤔", "Lo ! 🤔", "Ayi ! 🤔", "Ah ! 🤔"],
  "Cette page n'existe pas.": ["Lokasa oyo ezali te.", "Ukurasa huu haupo.", "Dibeji edi kadiena.", "Lukaya yai kele ve."],
  "Retour à l'accueil": ["Zonga na ebandeli", "Rudi mwanzo", "Pingana ku tshibangidilu", "Vutuka na luyantiku"],

  // ---------- Messages (toasts) ----------
  "Session expirée : reconnecte-toi.": ["Ntango esili : kota lisusu.", "Muda umekwisha : ingia tena.", "Diba diapua : buela kabidi.", "Ntangu me mana : kota diaka."],
  "Réservé aux employeurs.": ["Mpo na bapesi mosala kaka.", "Kwa waajiri tu.", "Bua bapi ba mudimu nkayabu.", "Sambu na bapesi kisalu kaka."],
  "Réservé aux demandeurs d'emploi.": ["Mpo na baluki mosala kaka.", "Kwa watafuta kazi tu.", "Bua bakebi ba mudimu nkayabu.", "Sambu na bantu ke sosa kisalu kaka."],
  "Ton dossier doit d'abord être validé par un administrateur.": ["Administrateur asengeli liboso kondima dosie na yo.", "Faili lako lazima likubaliwe kwanza na msimamizi.", "Mulombodi udi ne bua kuitaba dosie diebe kumpala.", "Administrateur fwete ndima ntete dosie na nge."],
  "À bientôt sur Musala !": ["Tokomonana na Musala !", "Tuonane tena kwenye Musala !", "Tuamonangana kabidi mu Musala !", "Beto ta monana na Musala !"],
  "E-mail ou mot de passe incorrect.": ["E-mail to liloba ya sekele ezali malamu te.", "Barua pepe au nenosiri si sahihi.", "E-mail anyi diyi dia musokoko kadiena bimpe.", "E-mail to mpova ya kinsweki kele mbote ve."],
  "Bienvenue {nom} !": ["Boyei malamu {nom} !", "Karibu {nom} !", "Wakuabuela bimpe {nom} !", "Kwisa mbote {nom} !"],
  "Envoi impossible.": ["Ekoki kotindama te.", "Haiwezekani kutuma.", "Kabiena mua kutuma.", "Kutinda ke lenda ve."],
  "Cette adresse e-mail n'est pas valide.": ["Adresi e-mail oyo ezali malamu te.", "Anwani hii ya barua pepe si halali.", "Adresse e-mail eu kawena muimpe.", "Adresi e-mail yai kele mbote ve."],
  "Cet e-mail a déjà un compte. Connecte-toi !": ["E-mail oyo esili kozala na kɔnti. Kota !", "Barua pepe hii tayari ina akaunti. Ingia !", "E-mail eu udi kale ne kɔnti. Buela !", "E-mail yai kele dezia ti kɔnti. Kota !"],
  "Code envoyé 📩": ["Kode etindami 📩", "Msimbo umetumwa 📩", "Kode mutuma 📩", "Kode me tindama 📩"],
  "Nouveau code envoyé 📩": ["Kode ya sika etindami 📩", "Msimbo mpya umetumwa 📩", "Kode mupiamupia mutuma 📩", "Kode ya mpa me tindama 📩"],
  "E-mail vérifié ✅ Continue ton inscription.": ["E-mail etalami ✅ Kokoba komikomisa.", "Barua pepe imethibitishwa ✅ Endelea kujiandikisha.", "E-mail mutangila ✅ Tungunuka ne difundisha.", "E-mail me talama ✅ Landa kudisonika."],
  "Vérifie d'abord ton adresse e-mail avec le code.": ["Talá liboso adresi e-mail na yo na kode.", "Thibitisha kwanza barua pepe yako kwa msimbo.", "Tangila kumpala e-mail webe ne kode.", "Tala ntete adresi e-mail na nge ti kode."],
  "Dossier envoyé ! Un administrateur va le vérifier 🔎": ["Dosie etindami ! Administrateur akotala yango 🔎", "Faili limetumwa ! Msimamizi atalikagua 🔎", "Dosie mutuma ! Mulombodi neaditangile 🔎", "Dosie me tindama ! Administrateur ta tala yo 🔎"],
  "Dossier envoyé à l'administrateur 🔎": ["Dosie etindami epai ya administrateur 🔎", "Faili limetumwa kwa msimamizi 🔎", "Dosie mutuma kudi mulombodi 🔎", "Dosie me tindama na administrateur 🔎"],
  "Ton dossier ne peut plus être modifié.": ["Dosie na yo ekoki lisusu kobongolama te.", "Faili lako haliwezi kubadilishwa tena.", "Dosie diebe kadiena mua kushintuluibua kabidi.", "Dosie na nge lenda soba diaka ve."],
  "Candidature envoyée ! Bonne chance 🍀": ["Mokanda etindami ! Mabonza malamu 🍀", "Ombi limetumwa ! Bahati njema 🍀", "Dilomba mituma ! Diakalenga 🍀", "Dilombi me tindama ! Kiese ya mbote 🍀"],
  "Cette offre n'est plus disponible.": ["Mosala oyo ezali lisusu te.", "Nafasi hii haipo tena.", "Mudimu eu kawena kabidi.", "Kisalu yai kele diaka ve."],
  "Profil enregistré ✅": ["Profil ebombami ✅", "Wasifu umehifadhiwa ✅", "Profil mulama ✅", "Profil me bumbama ✅"],
  "Entreprise enregistrée ✅": ["Kompanyi ebombami ✅", "Kampuni imehifadhiwa ✅", "Kompanyi mulama ✅", "Kompani me bumbama ✅"],
  "Offre publiée 🚀": ["Mosala etiami 🚀", "Nafasi imechapishwa 🚀", "Mudimu muteka 🚀", "Kisalu me tulama 🚀"],
  "Statut mis à jour": ["Ezalela ebongwani", "Hali imesasishwa", "Muanda muvuija mupiamupia", "Mutindu me sobama"],
  "Mot de passe changé ✅": ["Liloba ya sekele ebongwani ✅", "Nenosiri limebadilishwa ✅", "Diyi dia musokoko dishintulula ✅", "Mpova ya kinsweki me sobama ✅"],
  "Le mot de passe actuel est incorrect.": ["Liloba ya sekele ya sikoyo ezali malamu te.", "Nenosiri la sasa si sahihi.", "Diyi dia musokoko dia katataka kadiena dimpe.", "Mpova ya kinsweki ya sesepi kele mbote ve."],
  "Les deux nouveaux mots de passe ne sont pas identiques.": ["Maloba mibale ya sekele ya sika ekokani te.", "Manenosiri mapya mawili hayafanani.", "Mêyi abidi mapiamapia kaena afuanangane.", "Bampova zole ya mpa ke wakana ve."],
  "Choisis un mot de passe différent de l'actuel.": ["Pona liloba ya sekele mosusu.", "Chagua nenosiri tofauti na la sasa.", "Sungula diyi dikuabu.", "Pona mpova ya nkaka."],
  "Le nouveau mot de passe doit faire au moins {minimum} caractères.": ["Liloba ya sekele ya sika esengeli kozala na bilembo {minimum} to koleka.", "Nenosiri jipya lazima liwe na angalau herufi {minimum}.", "Diyi dipiadipia didi ne bua kuikala ne bimanyinu {minimum} pa nshi.", "Mpova ya mpa fwete vanda ti bidimbu {minimum} na fioti."],
  "Le mot de passe doit faire au moins 8 caractères.": ["Liloba ya sekele esengeli kozala na bilembo 8 to koleka.", "Nenosiri lazima liwe na angalau herufi 8.", "Diyi dia musokoko didi ne bua kuikala ne bimanyinu 8 pa nshi.", "Mpova ya kinsweki fwete vanda ti bidimbu 8 na fioti."],
  "Indique un nom (100 caractères maximum).": ["Koma nkombo (bilembo 100 kaka).", "Andika jina (herufi 100 zaidi).", "Funda dina (bimanyinu 100 bia bungi).", "Sonika zina (bidimbu 100 kaka)."],
  "Choisis demandeur ou employeur.": ["Pona moluki mosala to mopesi mosala.", "Chagua mtafuta kazi au mwajiri.", "Sungula mukebi wa mudimu anyi mupi wa mudimu.", "Pona muntu ke sosa kisalu to mupesi kisalu."],
  "Cet e-mail n'est pas valide.": ["E-mail oyo ezali malamu te.", "Barua pepe hii si halali.", "E-mail eu kawena muimpe.", "E-mail yai kele mbote ve."],
  "Indique un numéro de téléphone joignable (au moins 9 chiffres).": ["Koma nimero ya telefone oyo ekosala (mituya 9 to koleka).", "Andika nambari ya simu inayopatikana (angalau tarakimu 9).", "Funda nomba wa telefone udi wenza (nomba 9 pa nshi).", "Sonika nimero ya telefone yina ke sala (bantalu 9 na fioti)."],
  "Indique une date de naissance valide.": ["Koma mokolo ya mbotama ya solo.", "Andika tarehe halali ya kuzaliwa.", "Funda dituku dia kuledibua dia bulelela.", "Sonika kilumbu ya kubutuka ya kieleka."],
  "Il faut avoir au moins 18 ans pour s'inscrire.": ["Esengeli kozala na mbula 18 to koleka mpo na komikomisa.", "Lazima uwe na angalau miaka 18 ili kujiandikisha.", "Bidi bikengela kuikala ne bidimu 18 bua kudifundisha.", "Fwete vanda ti bamvula 18 sambu na kudisonika."],
  "Choisis le type de pièce d'identité.": ["Pona lolenge ya karte.", "Chagua aina ya kitambulisho.", "Sungula mushindu wa kapia.", "Pona mutindu ya karti."],
  "Le n° de pièce doit faire 4 à 30 caractères (lettres, chiffres, tirets).": ["Nimero ya karte esengeli kozala na bilembo 4 tii 30.", "Nambari ya kitambulisho lazima iwe na herufi 4 hadi 30.", "Nomba wa kapia udi ne bua kuikala ne bimanyinu 4 too ne 30.", "Nimero ya karti fwete vanda ti bidimbu 4 tii 30."],
  "Indique ton adresse de résidence.": ["Koma adresi ya ndako na yo.", "Andika anwani yako ya makazi.", "Funda adresse wa nzubu webe.", "Sonika adresi ya nzo na nge."],
  "Choisis ton niveau d'études.": ["Pona kelasi osalaki.", "Chagua kiwango chako cha elimu.", "Sungula malongesha ebe.", "Pona kalasi nge me landa."],
  "Indique le métier que tu recherches.": ["Koma mosala ozali koluka.", "Andika kazi unayotafuta.", "Funda mudimu uudi ukeba.", "Sonika kisalu nge ke sosa."],
  "Indique au moins une compétence.": ["Koma ata mayele moko.", "Andika angalau ujuzi mmoja.", "Funda bumanyi bumue pa nshi.", "Sonika ata mayele mosi."],
  "Choisis le secteur de l'entreprise.": ["Pona domɛni ya kompanyi.", "Chagua sekta ya kampuni.", "Sungula tshitupa tsha kompanyi.", "Pona kitini ya kompani."],
  "Le titre et la description sont obligatoires.": ["Nkombo mpe ndimbola esengeli.", "Kichwa na maelezo ni lazima.", "Dina ne diumvuija bidi bikengela.", "Zina ti ntendula fwete vanda."],
  "Oups, une erreur est survenue.": ["Ah, libunga moko esalemi.", "Lo, kosa limetokea.", "Ayi, tshilema tshimue tshienzeke.", "Ah, kifu mosi me salama."],
  "Attends encore {secondes} s avant de demander un nouveau code.": ["Zela lisusu sekonde {secondes} liboso osenga kode ya sika.", "Subiri sekunde {secondes} kabla ya kuomba msimbo mpya.", "Indila kabidi segonde {secondes} kumpala kua kulomba kode mupiamupia.", "Vingila diaka segonde {secondes} ntete na kulomba kode ya mpa."],
  "Demande d'abord un code.": ["Senga liboso kode.", "Omba msimbo kwanza.", "Lomba kumpala kode.", "Lomba ntete kode."],
  "Ce code a expiré. Demande un nouveau code.": ["Kode oyo esili. Senga kode ya sika.", "Msimbo huu umekwisha muda. Omba msimbo mpya.", "Kode eu mujike. Lomba kode mupiamupia.", "Kode yai me mana. Lomba kode ya mpa."],
  "Trop d'essais. Demande un nouveau code.": ["Omeki mingi koleka. Senga kode ya sika.", "Majaribio mengi mno. Omba msimbo mpya.", "Mateta a bungi menemene. Lomba kode mupiamupia.", "Nge me meka mingi. Lomba kode ya mpa."],
  "Code incorrect. Trop d'essais : demande un nouveau code.": ["Kode ezali malamu te. Omeki mingi : senga kode ya sika.", "Msimbo si sahihi. Majaribio mengi : omba msimbo mpya.", "Kode kawena muimpe. Mateta a bungi : lomba kode mupiamupia.", "Kode kele mbote ve. Nge me meka mingi : lomba kode ya mpa."],
  "Code incorrect. Il te reste {reste} essai(s).": ["Kode ezali malamu te. Otikali na komeka {reste}.", "Msimbo si sahihi. Umebakiza majaribio {reste}.", "Kode kawena muimpe. Mateta {reste} ke adi ashala.", "Kode kele mbote ve. Nge bikana ti mameki {reste}."],

  // ---------- E-mail du code ----------
  "{code} est ton code Musala": ["{code} ezali kode na yo ya Musala", "{code} ni msimbo wako wa Musala", "{code} ke kode webe wa Musala", "{code} kele kode na nge ya Musala"],
  "Bonjour,\n\nVoici ton code pour créer ton compte Musala : {code}\n\nIl est valable 10 minutes. Ne le donne à personne : l'équipe Musala ne te le demandera jamais.\n\nSi tu n'as pas demandé ce code, ignore simplement cet e-mail.\n\nL'équipe Musala": [
    "Mbote,\n\nKode na yo mpo na kosala kɔnti ya Musala : {code}\n\nEkosala mpo na miniti 10. Kopesa yango na moto te : ekipi ya Musala ekosenga yo yango soko moke te.\n\nSoki osengaki kode oyo te, tika e-mail oyo.\n\nEkipi ya Musala",
    "Habari,\n\nHuu ndio msimbo wako wa kufungua akaunti ya Musala : {code}\n\nNi halali kwa dakika 10. Usimpe mtu yeyote : timu ya Musala haitakuomba kamwe.\n\nKama hukuomba msimbo huu, puuza tu barua pepe hii.\n\nTimu ya Musala",
    "Moyo,\n\nKode webe bua kuenza kɔnti wa Musala ewu : {code}\n\nUdi ne bukole bua minite 10. Kuupi muntu nansha umue : tshisumbu tsha Musala katshiakukulomba nansha kakese.\n\nBikala kuvua mulombe kode eu, lekela e-mail eu.\n\nTshisumbu tsha Musala",
    "Mbote,\n\nKode na nge sambu na kusala kɔnti ya Musala yai : {code}\n\nYo ke sala sambu na minuti 10. Kupesa yo na muntu ve : ekipi ya Musala ta lomba nge yo ata fioti ve.\n\nKana nge lombaka ve kode yai, bika e-mail yai.\n\nEkipi ya Musala",
  ],

  // ---------- Partage et installation ----------
  "Partager cette offre": ["Kabolá mosala oyo", "Shiriki nafasi hii", "Abanya mudimu eu", "Kabula kisalu yai"],
  "💬 Partager sur WhatsApp": ["💬 Kabolá na WhatsApp", "💬 Shiriki kwenye WhatsApp", "💬 Abanya ku WhatsApp", "💬 Kabula na WhatsApp"],
  "📤 Partager…": ["📤 Kabolá…", "📤 Shiriki…", "📤 Abanya…", "📤 Kabula…"],
  "Postule sur Musala, le réseau pro de la RDC : {lien}": [
    "Tinda mokanda na Musala, réseau ya misala ya RDC : {lien}",
    "Omba kazi kwenye Musala, mtandao wa kazi wa RDC : {lien}",
    "Lomba mudimu ku Musala, tshisangilu tsha midimu tsha RDC : {lien}",
    "Lomba kisalu na Musala, réseau ya bisalu ya RDC : {lien}",
  ],
  "📲 Installer Musala": ["📲 Tia Musala na telefone", "📲 Sakinisha Musala", "📲 Teka Musala mu telefone", "📲 Tula Musala na telefone"],
  "Musala est installé sur ton téléphone 🎉": ["Musala ezali sikoyo na telefone na yo 🎉", "Musala imesakinishwa kwenye simu yako 🎉", "Musala mmuteka mu telefone webe 🎉", "Musala kele sesepi na telefone na nge 🎉"],

  // ---------- Mode léger ----------
  "📶 Mode léger activé · Cette visite a utilisé {ko} Ko d'Internet.": [
    "📶 Mode ya pete ezali · Botali oyo esaleli {ko} Ko ya Internet.",
    "📶 Hali nyepesi imewashwa · Ziara hii imetumia {ko} Ko za Internet.",
    "📶 Mushindu mupepele mutuadija · Dilua edi diakenza mudimu ne {ko} Ko ya Internet.",
    "📶 Mode ya pete kele · Kutala yai me sadila {ko} Ko ya Internet.",
  ],
  "Mode léger activé 📶": ["Mode ya pete ezali 📶", "Hali nyepesi imewashwa 📶", "Mushindu mupepele mutuadija 📶", "Mode ya pete kele 📶"],
  "Mode léger désactivé": ["Mode ya pete ekangami", "Hali nyepesi imezimwa", "Mushindu mupepele mujikija", "Mode ya pete me kangama"],
  "Musala est enregistré sur ton appareil : il marche même sans Internet.": [
    "Musala ebombami na telefone na yo : ekosala ata soki Internet ezali te.",
    "Musala imehifadhiwa kwenye kifaa chako : inafanya kazi hata bila Internet.",
    "Musala mulama mu tshiamu tshiebe : udi wenza nansha kakuyi Internet.",
    "Musala me bumbama na telefone na nge : yo ke sala ata kukonda Internet.",
  ],
  "Tu n'es pas connecté à Internet : tu vois la dernière version enregistrée.": [
    "Ozali na Internet te : ozali komona makambo oyo ebombamaki na nsuka.",
    "Hujaunganishwa na Internet : unaona toleo la mwisho lililohifadhiwa.",
    "Kuena pa Internet : udi umona malu malama ku ndekelu.",
    "Nge kele na Internet ve : nge ke mona mambu yina me bumbama na nsuka.",
  ],
};

// Langue choisie : retenue sur cet appareil seulement (préférence personnelle).
const CLE_PREFERENCES = "musala_preferences";

function lirePreferences() {
  try {
    return JSON.parse(localStorage.getItem(CLE_PREFERENCES)) || {};
  } catch (err) {
    return {};
  }
}

function ecrirePreferences(changements) {
  try {
    localStorage.setItem(CLE_PREFERENCES, JSON.stringify({ ...lirePreferences(), ...changements }));
  } catch (err) { /* le stockage peut être bloqué : la préférence ne sera simplement pas retenue */ }
}

let langue = Object.hasOwn(LANGUES, lirePreferences().langue) ? lirePreferences().langue : "fr";

function changerLangue(code) {
  if (!Object.hasOwn(LANGUES, code)) return;
  langue = code;
  ecrirePreferences({ langue: code });
  document.documentElement.lang = code;
}

function remplacer(texte, valeurs) {
  return texte.replace(/\{(\w+)\}/g, (tout, cle) => (Object.hasOwn(valeurs, cle) ? String(valeurs[cle]) : tout));
}

// Traduit une phrase française dans la langue choisie.
// t("Bonjour {nom} 👋", { nom: "Arnold" }) → « Mbote Arnold 👋 » en lingala.
function t(francais, valeurs = {}) {
  const traductions = TRADUCTIONS[francais];
  const i = ORDRE_LANGUES.indexOf(langue);
  const texte = langue !== "fr" && traductions && traductions[i] ? traductions[i] : francais;
  return remplacer(texte, valeurs);
}

// Pour un message déjà écrit en français (par exemple « Code incorrect. Il te reste 3 essai(s). »),
// retrouve la phrase modèle correspondante et la traduit.
const MODELES = Object.keys(TRADUCTIONS)
  .filter((cle) => /\{\w+\}/.test(cle))
  .map((cle) => {
    const noms = [];
    const source = cle.replace(/[.*+?^$()|[\]\\]/g, "\\$&").replace(/\\?\{(\w+)\\?\}/g, (tout, nom) => {
      noms.push(nom);
      return "(.+?)";
    });
    return { cle, noms, regex: new RegExp(`^${source}$`, "s") };
  });

function traduireMessage(message) {
  if (langue === "fr" || typeof message !== "string") return message;
  if (Object.hasOwn(TRADUCTIONS, message)) return t(message);
  for (const m of MODELES) {
    const r = m.regex.exec(message);
    if (r) return t(m.cle, Object.fromEntries(m.noms.map((nom, i) => [nom, r[i + 1]])));
  }
  return message;
}
