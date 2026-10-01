(function(){
  var MC = window.MC, $ = MC.$, CAT = MC.CATALOG, reduce = MC.reduce;
  var HOME = /*__HOME__*/;
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* — разделы: общие плитки — */
  MC.dirTiles($('homeCats'), HOME);

  /* — река логотипов под картой — */
  var track = $('hhTrack');
  if (track) {
    var names = [], html = '';
    Object.keys(HOME.cats).forEach(function(k){ names = names.concat(HOME.cats[k].top || []); });
    names.forEach(function(n){ var s = CAT.services.find(function(x){ return x.n === n; }); if (s) html += '<span class="hh-logo' + (s.d ? ' on-dark' : '') + '"><img alt="" src="' + s.l + '"></span>'; });
    track.innerHTML = html + html;
  }

  /* — популярные сервисы — */
  var pop = $('homePopular');
  HOME.popular.forEach(function(p){
    var s = CAT.services.find(function(x){ return x.n === p.n; }); if (!s) return;
    var art = document.createElement('a'); art.className = 'pop-card'; art.href = s.h;
    art.innerHTML = '<span class="pc-logo' + (s.d ? ' on-dark' : '') + '"><img alt="" src="' + s.l + '"></span><span class="pc-cat">' + CAT.catName[s.c] + '</span><b class="pc-name">' + s.n + '</b><span class="pc-text">' + p.text + '</span><span class="pc-foot"><span class="pc-price" data-price-slug="' + MC.slugOf(s.h) + '">' + p.price + '</span><span class="pc-go" aria-hidden="true">' + ARROW + '</span></span>';
    pop.appendChild(art);
  });

  /* — карта: наклон за курсором — */
  var stage = $('cardStage'), tilt = $('cardTilt');
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    stage.addEventListener('pointermove', function(e){
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      tilt.style.setProperty('--ty', (x * 26).toFixed(1)); tilt.style.setProperty('--tx', (-8 - y * 22).toFixed(1));
    });
    stage.addEventListener('pointerleave', function(){ tilt.style.removeProperty('--ty'); tilt.style.removeProperty('--tx'); });
  }
  MC.initReveal();
})();
