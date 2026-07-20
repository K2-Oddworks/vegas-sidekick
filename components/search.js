/* Vegas Sidekick — dependency-free client-side show search. Requires window.VS_SHOWS. */
(function () {
  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  window.vsNorm = norm;

  // Returns matching shows ranked by relevance. Empty query -> [].
  window.vsSearch = function (query) {
    var q = norm(query).trim();
    if (!q) return [];
    var terms = q.split(/\s+/).filter(Boolean);
    var out = [];
    (window.VS_SHOWS || []).forEach(function (s) {
      var name = norm(s.name);
      var hay = norm([s.name, s.sub, s.venue, s.cat, s.kw].join(' '));
      // every term must appear somewhere (AND)
      for (var i = 0; i < terms.length; i++) {
        if (hay.indexOf(terms[i]) < 0) return;
      }
      var score = 0;
      if (name.indexOf(q) === 0) score += 100;        // name starts with query
      else if (name.indexOf(q) >= 0) score += 60;      // name contains full query
      if (norm(s.cat) === q) score += 55;              // exact category match
      terms.forEach(function (t) { if (name.indexOf(t) >= 0) score += 12; });
      out.push({ s: s, score: score });
    });
    out.sort(function (a, b) {
      return b.score - a.score || a.s.name.localeCompare(b.s.name);
    });
    return out.map(function (o) { return o.s; });
  };
})();
