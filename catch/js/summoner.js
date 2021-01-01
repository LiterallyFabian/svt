 var beatmap;
 var fruitLines = [];
 var timingLines = [];
 volume = 50;
 var music;
 var hitsoundsNormal;
 var hitsoundsSoft;
 var hitsoundsDrum;
 hitsounds = [];
 var thumbPath;
 var songLength;

 function startDebug() {
     startGame("./catch/song/debug.osu", "./catch/song/debug.jpg", "./catch/song/debug.mp3");
 }

 //loads stuff and then starts
 function startGame(map, thumbnail, audio) {
     fetch(`/${map}`)
         .then(response => response.text())
         .then(data => {
             beatmap = data.split("\n")
         });
     thumbPath = thumbnail;
     music = new Audio(`/${audio}`);
     hitsoundsNormal = [new Audio(`/catch/hitsounds/normal-hitnormal.mp3`), new Audio(`/catch/hitsounds/normal-hitwhistle.mp3`), new Audio(`/catch/hitsounds/normal-hitfinish.mp3`), new Audio(`/catch/hitsounds/normal-hitclap.mp3`)]
     hitsoundsSoft = [new Audio(`/catch/hitsounds/soft-hitnormal.mp3`), new Audio(`/catch/hitsounds/soft-hitwhistle.mp3`), new Audio(`/catch/hitsounds/soft-hitfinish.mp3`), new Audio(`/catch/hitsounds/soft-hitclap.mp3`)]
     hitsoundsDrum = [new Audio(`/catch/hitsounds/drum-hitnormal.mp3`), new Audio(`/catch/hitsounds/drum-hitwhistle.mp3`), new Audio(`/catch/hitsounds/drum-hitfinish.mp3`), new Audio(`/catch/hitsounds/drum-hitclap.mp3`)]
     music.onloadeddata = waitForLoad();
 }

 function waitForLoad() {
     if (typeof music !== "undefined" &&
         typeof beatmap !== "undefined" &&
         music.readyState == 4
     ) {
         processMap()
     } else {
         setTimeout(waitForLoad, 500);
     }
 }



 function processMap() {
     var foundTiming = false;
     var foundObjects = false;
     document.getElementById('catchField').style.background = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../${thumbPath}')`;
     document.getElementById('catchField').style.backgroundSize = `cover`;
     document.getElementById('catchField').style.backgroundRepeat = `no-repeat`;
     document.getElementById('catchField').style.backgroundPosition = `center center`;


     //Get lines and offset from file
     beatmap.forEach(line => {
         if (!foundTiming) {
             //set hitsounds
             //normal whistle finish clap
             if (line.includes("SampleSet: Normal") || line.includes("SampleSet: None")) hitsounds = hitsoundsNormal;
             else if (line.includes("SampleSet: Soft")) hitsounds = hitsoundsSoft;
             else if (line.includes("SampleSet: Drum")) hitsounds = hitsoundsDrum;
             else if (line.includes("[TimingPoints]")) foundTiming = true;
         } else {
             if (!foundObjects) {
                 if (line.split(",").length > 3) {
                     timingLines.push(line);
                 } else {
                     if (line.includes("[HitObjects]")) foundObjects = true;
                 }
             } else {
                 fruitLines.push(line);
             }
         }
     });

     setTimeout(function () {
         music.volume = volume / 100;
         music.play()
     }, 955)


     //Get data from all fruit lines
     fruitLines.forEach(line => {
         line = line.split(",")
         var pos = parseInt(line[0]);
         var delay = parseInt(line[2]);
         var hitsound = parseInt(line[4]);


         //slider
         if (line.length > 7) {
             var sliderPositions = line[5].split("|")
             var sliderEndPos = sliderPositions[sliderPositions.length - 1].split(":")[0]
             var repeats = parseInt(line[6]);
             summonFruit(delay, parseInt(pos, 10), 0, hitsound);

             var sliderLength = parseInt(Math.round(line[7]));
             var dropletsPerRepeat = parseInt(Math.round(sliderLength / 17));
             var droplets = dropletsPerRepeat * repeats;
             var diff = (pos - sliderEndPos) / droplets;
             var currentDrop = 0;
             for (var i = 0; i < droplets; i++) {
                 var dropPos = pos - (diff * i);
                 var dropDelay = (i) * 40 + delay;
                 if (currentDrop == dropletsPerRepeat) {
                     summonFruit(dropDelay, dropPos, 0, hitsound)
                     currentDrop = 0;
                 } else summonFruit(dropDelay, dropPos, 1)
                 currentDrop++;
             }
             summonFruit(delay + (droplets + 1) * 40, pos - (diff * droplets), 0, hitsound)
         } else if (line[3] != "12") //large fruit
         {
             summonFruit(delay, pos, 0, hitsound)
         } else { //spinner
             summonSpinner(delay, parseFloat(line[5]))
         }
         if (line.length > 1) songLength = parseInt(line[2]);


     })
     timingLines.forEach(line => {
         var data = line.split(",");
         toggleKiai(data[7] == 1, data[0]);
     })
     finishGame(songLength+3000);
 }