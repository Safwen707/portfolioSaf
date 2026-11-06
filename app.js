(function(){
  "use strict";

  /* ---------------------------------------------------------
   * 1. RENDER PROJECT SLIDES FROM DATA
    *
    * Cette section transforme chaque objet de projects.data.js en
    * HTML. Le fichier de donnees reste donc la source de verite :
    * ajouter ou modifier un projet ne necessite pas de recopier sa
    * structure dans index.html.
   * --------------------------------------------------------- */

    // Construit les badges d'un projet en reutilisant le meme markup.
  function chipList(items, extraClass){
    return items.map(function(t){ return '<span class="chip'+(extraClass?(' '+extraClass):'')+'">'+escapeHtml(t)+'</span>'; }).join('');
  }

  // Echappe le texte fourni par les donnees avant de l'inserer dans
  // innerHTML. Cela evite qu'un titre ou une description soit interprete
  // comme du HTML.
  function escapeHtml(str){
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Renvoie uniquement les images utilisables dans le volet images.
  // Les objets de type PDF sont filtres car ils doivent etre affiches
  // dans le volet document de la vue Details.
  function visualImages(p){
    return p.visual && p.visual.images
      ? p.visual.images.filter(function(item){ return item.type !== 'pdf'; })
      : [];
  }

  // Recupere les PDF declares dans visual.images et prend aussi en compte
  // un PDF place directement dans la propriete demo du projet.
  function visualPdfs(p){
    var pdfs = p.visual && p.visual.images
      ? p.visual.images.filter(function(item){ return item.type === 'pdf'; })
      : [];
    if (p.demo && p.demo.type === 'pdf') pdfs.push(p.demo);
    return pdfs;
  }

  // Determine si le bouton Details est utile pour ce projet.
  // Une image, un PDF ou une video suffit a afficher le bouton.
  function hasDetails(p){
    return visualImages(p).length || visualPdfs(p).length || (p.demo && p.demo.type === 'video');
  }

  // Rend le panneau visuel principal situe a droite de chaque projet.
  // Priorite : video, galerie image/PDF, schema, image simple, placeholder.
  // La video est lue en boucle, muette, uniquement quand elle est visible
  // (voir syncVideos) ; un overlay "Voir la demo" invite a ouvrir la
  // version nette avec controles.
  function renderVisual(p){
    if (p.demo && p.demo.type === 'video'){
      return '<div class="panel panel-video" data-action="video-preview" data-id="'+p.id+'" role="button" tabindex="0" aria-label="Voir la démo de '+escapeHtml(p.title)+' en plein écran">'+
        '<video class="panel-video-media" src="'+p.demo.src+'" muted loop playsinline preload="metadata"'+
          (p.demo.poster ? ' poster="'+p.demo.poster+'"' : '')+'>Votre navigateur ne prend pas en charge la vidéo.</video>'+
        '<span class="panel-video-overlay" aria-hidden="true"><span class="panel-video-pill">&#9654; Voir la démo</span></span>'+
      '</div>';
    }
    if (p.visual.kind === 'gallery'){
      var firstImage = p.visual.images[0];
      var previewClass = ' panel-preview-blurred';
      var firstMedia = firstImage.type === 'pdf'
        ? '<span class="visual-gallery-document"><span class="visual-gallery-document-icon">PDF</span><strong>'+escapeHtml(firstImage.caption)+'</strong><small>Cliquer pour ouvrir</small></span>'
        : '<img class="panel-media panel-preview-media'+previewClass+'" src="'+firstImage.src+'" alt="'+escapeHtml(firstImage.caption)+'" loading="lazy">';
      return '<div class="panel panel-gallery">'+
        '<button class="visual-gallery-image" data-action="visual-gallery" data-id="'+p.id+'" data-index="0" aria-label="Agrandir l’image">'+
          firstMedia+
        '</button>'+
        '<button class="visual-gallery-arrow visual-gallery-prev" data-action="visual-gallery-step" data-direction="-1" aria-label="Image précédente">&larr;</button>'+
        '<button class="visual-gallery-arrow visual-gallery-next" data-action="visual-gallery-step" data-direction="1" aria-label="Image suivante">&rarr;</button>'+
        '<span class="visual-gallery-count">1 / '+p.visual.images.length+'</span>'+
      '</div>';
    }
    if (p.visual.kind === 'schema'){
      return '<div class="panel"><div class="panel-schema">'+p.visual.svg+'</div></div>';
    }
    if (p.visual.kind === 'image'){
      return '<div class="panel"><img class="panel-media panel-preview-media" src="'+p.visual.img+'" alt="Aperçu du projet '+escapeHtml(p.title)+'" loading="lazy"></div>';
    }
    // placeholder
    return (
      '<div class="panel"><div class="panel-placeholder">'+
        '<span class="ph-label">Aperçu à venir</span>'+
        '<div class="ph-tags">'+chipList(p.tags)+'</div>'+
        '<div class="ph-note">'+escapeHtml(p.note || "Démo et captures à ajouter dans projects.data.js.")+'</div>'+
      '</div></div>'
    );
  }

  function renderProject(p){
    // Les listes facultatives sont rendues uniquement lorsqu'elles
    // contiennent effectivement des elements.
    var pointsHtml = p.points && p.points.length
      ? '<ul class="project-points">'+p.points.map(function(pt){ return '<li>'+escapeHtml(pt)+'</li>'; }).join('')+'</ul>'
      : '';
    var noteHtml = (p.note && p.visual.kind !== 'placeholder')
      ? '<p class="project-note">'+escapeHtml(p.note)+'</p>'
      : (p.visual.kind === 'placeholder' ? '' : '');
    var summaryHtml = p.summary ? '<p class="project-summary">'+escapeHtml(p.summary)+'</p>' : '';

    var actions = '';
    if (hasDetails(p)){
      actions += '<button class="btn btn-primary" data-action="details" data-id="'+p.id+'">Détails</button>';
    }
    if (p.captures && p.captures.length){
      actions += '<button class="btn" data-action="captures" data-id="'+p.id+'">Captures ('+p.captures.length+')</button>';
    }
    (p.links || []).forEach(function(l){
      actions += '<a class="btn" href="'+l.href+'" target="_blank" rel="noopener">'+escapeHtml(l.label)+'</a>';
    });

    var section = document.createElement('section');
    section.className = 'slide slide-project';
    section.id = 'slide-'+p.id;
    section.setAttribute('aria-label', p.title);
    section.setAttribute('data-nav-label', p.index+' · '+p.title);
    section.innerHTML =
      '<div class="project-grid">'+
        '<div class="project-col-text">'+
          '<h2 class="project-title">'+escapeHtml(p.title)+'</h2>'+
          '<div class="project-tags">'+chipList(p.tags, 'tag-accent')+'</div>'+
          summaryHtml+
          pointsHtml+
          noteHtml+
          '<div class="project-actions">'+actions+'</div>'+
        '</div>'+
        '<div class="project-col-visual">'+renderVisual(p)+'</div>'+
      '</div>';
    return section;
  }

  var container = document.getElementById('projectsContainer');
  var frag = document.createDocumentFragment();
  (window.PROJECTS || []).forEach(function(p){ frag.appendChild(renderProject(p)); });
  container.parentNode.replaceChild(frag, container);

  /* ---------------------------------------------------------
   * 2. NAVIGATION
   *
   * Desktop (> 860px) : reel vertical, un geste de souris, une touche
   * ou un clic sur le rail fait avancer d'une seule slide.
   *
   * Mobile (<= 860px) : le paging est desactive. La page defile
   * normalement (scroll natif) pour que le contenu long d'un projet
   * reste accessible ; la barre de progression suit le scroll.
   * Le meme breakpoint est utilise dans le CSS de index.html.
   * --------------------------------------------------------- */
  var track = document.getElementById('track');
  var reel = document.getElementById('reel');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var railDots = document.getElementById('railDots');
  var railFill = document.getElementById('railProgressFill');
  var mobileFill = document.getElementById('mobileProgressFill');
  var rightFill = document.getElementById('scrollbarRightFill');
  var rightBar = document.getElementById('scrollbarRight');
  var mobileMQ = window.matchMedia('(max-width:860px)');
  var reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var current = 0;
  var locked = false;
  var LOCK_MS = 700;

  function isMobile(){ return mobileMQ.matches; }

  slides.forEach(function(s, i){
    var dot = document.createElement('button');
    dot.className = 'rail-dot';
    dot.setAttribute('data-label', s.getAttribute('data-nav-label') || s.getAttribute('aria-label') || ('Écran '+(i+1)));
    dot.setAttribute('aria-label', 'Aller à : '+(s.getAttribute('aria-label')||''));
    dot.addEventListener('click', function(){ goTo(i); });
    railDots.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(railDots.children);

  // Lit la video de la slide visible et met les autres en pause. Evite de
  // decoder plusieurs videos en boucle en meme temps (poids, batterie).
  // Avec "reduire les animations", rien ne demarre tout seul : l'apercu
  // reste sur la premiere image et l'overlay invite au clic.
  function syncVideos(){
    slides.forEach(function(s, i){
      var v = s.querySelector('.panel-video-media');
      if (!v) return;
      var visible;
      if (isMobile()){
        var r = v.getBoundingClientRect();
        visible = r.bottom > 0 && r.top < window.innerHeight;
      } else {
        visible = (i === current);
      }
      if (visible && !reduceMotionMQ.matches){
        var pr = v.play();
        if (pr && pr.catch) pr.catch(function(){});
      } else {
        v.pause();
      }
    });
  }

  // Met a jour la position du reel, la progression et l'accessibilite.
  // Desktop : les slides inactives sont rendues inertes pour eviter qu'un
  // element invisible recupere le focus clavier.
  // Mobile : pas de transform, tout est accessible, la progression suit
  // le scroll de la page.
  function update(){
    var pct;
    if (isMobile()){
      track.style.transform = '';
      slides.forEach(function(s){ s.inert = false; });
      var max = document.documentElement.scrollHeight - window.innerHeight;
      pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      // Slide courante = celle qui contient le milieu de l'ecran.
      var mid = window.innerHeight / 2;
      slides.forEach(function(s, i){
        var r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) current = i;
      });
    } else {
      track.style.transform = 'translateY(-'+(current*100)+'vh)';
      slides.forEach(function(s,i){ s.inert = (i !== current); });
      pct = slides.length > 1 ? (current/(slides.length-1))*100 : 0;
    }
    dots.forEach(function(d,i){ d.classList.toggle('is-active', i===current); });
    railFill.style.height = pct+'%';
    mobileFill.style.width = pct+'%';
    rightFill.style.top = (pct * 0.78)+'%';
    syncVideos();
  }

  // Change de slide en bornant l'index entre la premiere et la derniere.
  function goTo(i){
    var next = Math.max(0, Math.min(slides.length-1, i));
    if (isMobile()){
      slides[next].scrollIntoView({ behavior: reduceMotionMQ.matches ? 'auto' : 'smooth', block:'start' });
      return;
    }
    if (next === current) return;
    current = next;
    update();
    lock();
  }

  // Bloque les changements successifs trop rapides pendant l'animation.
  function lock(){
    locked = true;
    window.setTimeout(function(){ locked = false; }, LOCK_MS);
  }

  function next(){ if (!locked) goTo(current+1); }
  function prev(){ if (!locked) goTo(current-1); }

  var draggingScrollbar = false;

  function goToScrollbarPosition(clientY){
    var trackRect = rightBar.querySelector('.scrollbar-right-track').getBoundingClientRect();
    var thumbHeight = rightFill.getBoundingClientRect().height;
    var usableHeight = Math.max(1, trackRect.height - thumbHeight);
    var ratio = Math.min(1, Math.max(0, (clientY - trackRect.top - (thumbHeight / 2)) / usableHeight));
    current = Math.round(ratio * (slides.length - 1));
    update();
  }

  rightBar.addEventListener('click', function(e){
    if (!draggingScrollbar) goToScrollbarPosition(e.clientY);
  });

  rightBar.addEventListener('pointerdown', function(e){
    if (isMobile()) return;
    draggingScrollbar = true;
    rightBar.setPointerCapture(e.pointerId);
    goToScrollbarPosition(e.clientY);
  });
  rightBar.addEventListener('pointermove', function(e){
    if (draggingScrollbar) goToScrollbarPosition(e.clientY);
  });
  rightBar.addEventListener('pointerup', function(e){
    draggingScrollbar = false;
    rightBar.releasePointerCapture(e.pointerId);
  });
  rightBar.addEventListener('pointercancel', function(){ draggingScrollbar = false; });

  // Wheel (desktop / trackpad). Sur mobile on ne touche pas au scroll natif.
  reel.addEventListener('wheel', function(e){
    if (isMobile()) return;
    e.preventDefault();
    if (locked) return;
    if (Math.abs(e.deltaY) < 4) return;
    if (e.deltaY > 0) next(); else prev();
  }, { passive:false });

  // Keyboard (desktop uniquement : le navigateur gere deja le scroll mobile)
  window.addEventListener('keydown', function(e){
    if (isMobile()) return;
    if (document.getElementById('modalBackdrop').classList.contains('is-open')) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown'){ e.preventDefault(); next(); }
    else if (e.key === 'ArrowUp' || e.key === 'PageUp'){ e.preventDefault(); prev(); }
    else if (e.key === 'Home'){ e.preventDefault(); goTo(0); }
    else if (e.key === 'End'){ e.preventDefault(); goTo(slides.length-1); }
  });

  // Touch : swipe = changement de slide uniquement sur les ecrans larges
  // tactiles (tablette paysage, etc.). Sur mobile, scroll natif.
  var touchStartY = null;
  reel.addEventListener('touchstart', function(e){ touchStartY = e.touches[0].clientY; }, { passive:true });
  reel.addEventListener('touchend', function(e){
    if (touchStartY === null) return;
    var dy = touchStartY - e.changedTouches[0].clientY;
    touchStartY = null;
    if (isMobile()) return;
    if (Math.abs(dy) > 48){ if (dy > 0) next(); else prev(); }
  }, { passive:true });

  // Mobile : suit le scroll natif (progression, point actif, videos).
  var scrollTicking = false;
  window.addEventListener('scroll', function(){
    if (!isMobile() || scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function(){
      scrollTicking = false;
      update();
    });
  }, { passive:true });

  // Passage mobile <-> desktop (rotation, redimensionnement).
  function onLayoutChange(){ update(); }
  if (mobileMQ.addEventListener){ mobileMQ.addEventListener('change', onLayoutChange); }
  else if (mobileMQ.addListener){ mobileMQ.addListener(onLayoutChange); }
  window.addEventListener('resize', function(){ if (isMobile()) update(); });

  document.getElementById('btnBackTop').addEventListener('click', function(){ goTo(0); });

  update();

  /* ---------------------------------------------------------
   * 3. MODALS — details view and capture gallery
   *
   * Toutes les vues secondaires utilisent la meme fenetre modale :
   * details, images, PDF et videos. Cela evite de dupliquer la structure
   * de la fenetre et garantit un comportement de fermeture uniforme.
   * --------------------------------------------------------- */
  var backdrop = document.getElementById('modalBackdrop');
  var modalContent = document.getElementById('modalContent');
  var lastFocused = null;
  var galleryState = null;
  var detailsState = null;

  // Injecte le contenu de la modale, l'affiche et place le focus sur
  // le bouton de fermeture pour conserver un parcours clavier logique.
  function openModal(html){
    lastFocused = document.activeElement;
    modalContent.innerHTML = html;
    backdrop.classList.add('is-open');
    var closeBtn = modalContent.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  // Ferme la modale, arrete une video eventuelle et rend le focus au
  // bouton qui avait ouvert la fenetre.
  function closeModal(){
    backdrop.classList.remove('is-open');
    var video = modalContent.querySelector('video');
    if (video) video.pause();
    modalContent.innerHTML = '';
    galleryState = null;
    detailsState = null;
    if (lastFocused) lastFocused.focus();
  }

  backdrop.addEventListener('click', function(e){ if (e.target === backdrop) closeModal(); });
  window.addEventListener('keydown', function(e){
    if (!backdrop.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeModal();
    if (detailsState){
      if (e.key === 'ArrowRight') openDetails(detailsState.id, detailsState.imageIdx + 1, detailsState.pdfIdx);
      if (e.key === 'ArrowLeft') openDetails(detailsState.id, detailsState.imageIdx - 1, detailsState.pdfIdx);
    }
    if (galleryState){
      if (e.key === 'ArrowRight') galleryState.open(galleryState.id, galleryState.idx+1);
      if (e.key === 'ArrowLeft') galleryState.open(galleryState.id, galleryState.idx-1);
    }
  });

  // Recherche un projet par son identifiant stable defini dans les donnees.
  function findProject(id){
    return (window.PROJECTS||[]).find(function(p){ return p.id === id; });
  }

  // Construit le volet gauche de la vue Details : une image a la fois,
  // avec navigation precedente/suivante si plusieurs images existent.
  function detailImagePane(images, idx){
    if (!images.length) return '';
    var i = ((idx % images.length) + images.length) % images.length;
    var image = images[i];
    return '<section class="details-pane details-images">'+
      '<div class="details-pane-head"><span>Images</span><span class="gallery-count">'+(i+1)+' / '+images.length+'</span></div>'+
      '<div class="details-media gallery-frame"><img src="'+image.src+'" alt="'+escapeHtml(image.caption)+'"></div>'+
      '<div class="gallery-caption"><span>'+escapeHtml(image.caption)+'</span>'+
        (images.length > 1 ? '<span class="gallery-nav"><button data-details-nav="image-prev" aria-label="Image précédente">&larr;</button><button data-details-nav="image-next" aria-label="Image suivante">&rarr;</button></span>' : '')+
      '</div>'+
    '</section>';
  }

  // Construit le volet droit de la vue Details pour les documents PDF.
  // Chaque PDF est affiche dans un iframe et peut aussi etre ouvert
  // dans un nouvel onglet pour utiliser le lecteur PDF du navigateur.
  function detailPdfPane(pdfs, idx, title){
    if (!pdfs.length) return '';
    var i = ((idx % pdfs.length) + pdfs.length) % pdfs.length;
    var pdf = pdfs[i];
    return '<section class="details-pane details-pdfs">'+
      '<div class="details-pane-head"><span>Document PDF</span><span class="gallery-count">'+(i+1)+' / '+pdfs.length+'</span></div>'+
      '<div class="details-pdf"><iframe src="'+pdf.src+'" title="'+escapeHtml(pdf.caption || title)+'"></iframe></div>'+
      '<div class="gallery-caption"><span>'+escapeHtml(pdf.caption || '')+'</span>'+
        '<span class="gallery-nav">'+
          (pdfs.length > 1 ? '<button data-details-nav="pdf-prev" aria-label="PDF précédent">&larr;</button><button data-details-nav="pdf-next" aria-label="PDF suivant">&rarr;</button>' : '')+
          '<a class="btn" href="'+pdf.src+'" target="_blank" rel="noopener">Ouvrir le PDF</a>'+
        '</span>'+
      '</div>'+
    '</section>';
  }

  // Ouvre la vue Details et choisit automatiquement sa disposition :
  // deux colonnes lorsque images et PDF existent, une seule colonne
  // lorsqu'un seul type de contenu est disponible.
  function openDetails(id, imageIdx, pdfIdx){
    var p = findProject(id);
    if (!p) return;
    var images = visualImages(p);
    var pdfs = visualPdfs(p);
    detailsState = { id:id, imageIdx:images.length ? imageIdx : 0, pdfIdx:pdfs.length ? pdfIdx : 0 };

    var bodyHtml = '';
    if (images.length || pdfs.length){
      bodyHtml = '<div class="details-layout '+(images.length && pdfs.length ? 'details-split' : 'details-single')+'">'+
        detailImagePane(images, detailsState.imageIdx)+
        detailPdfPane(pdfs, detailsState.pdfIdx, p.title)+
      '</div>';
    } else if (p.demo && p.demo.type === 'video'){
      bodyHtml = '<div class="details-video"><video src="'+p.demo.src+'" controls playsinline'+(p.demo.poster ? ' poster="'+p.demo.poster+'"' : '')+'></video></div>';
    }

    var html =
      '<div class="modal-head"><span class="title">Détails — '+escapeHtml(p.title)+'</span>'+
      '<button class="modal-close" aria-label="Fermer">&times;</button></div>'+
      '<div class="modal-body">'+bodyHtml+'</div>';
    openModal(html);
    modalContent.querySelector('.modal-close').addEventListener('click', closeModal);
    var imagePrev = modalContent.querySelector('[data-details-nav="image-prev"]');
    var imageNext = modalContent.querySelector('[data-details-nav="image-next"]');
    var pdfPrev = modalContent.querySelector('[data-details-nav="pdf-prev"]');
    var pdfNext = modalContent.querySelector('[data-details-nav="pdf-next"]');
    if (imagePrev) imagePrev.addEventListener('click', function(){ openDetails(id, detailsState.imageIdx - 1, detailsState.pdfIdx); });
    if (imageNext) imageNext.addEventListener('click', function(){ openDetails(id, detailsState.imageIdx + 1, detailsState.pdfIdx); });
    if (pdfPrev) pdfPrev.addEventListener('click', function(){ openDetails(id, detailsState.imageIdx, detailsState.pdfIdx - 1); });
    if (pdfNext) pdfNext.addEventListener('click', function(){ openDetails(id, detailsState.imageIdx, detailsState.pdfIdx + 1); });
  }

  // Ouvre une video depuis l'apercu (overlay "Voir la demo"). La copie
  // affichee ici est controlee par l'utilisateur, avec le son, et tente
  // le plein ecran natif.
  function openVideoPreview(id){
    var p = findProject(id);
    if (!p || !p.demo || p.demo.type !== 'video') return;
    var html =
      '<div class="modal-head"><span class="title">Vidéo — '+escapeHtml(p.title)+'</span>'+
      '<button class="modal-close" aria-label="Fermer">&times;</button></div>'+
      '<div class="modal-body"><div class="details-video fullscreen-video-wrap">'+
        '<video class="fullscreen-video" src="'+p.demo.src+'" controls autoplay playsinline'+
          (p.demo.poster ? ' poster="'+p.demo.poster+'"' : '')+'></video>'+
      '</div></div>';
    openModal(html);
    modalContent.querySelector('.modal-close').addEventListener('click', closeModal);
    var video = modalContent.querySelector('.fullscreen-video');
    if (video.requestFullscreen){
      video.requestFullscreen().catch(function(){ video.focus(); });
    }
  }

  // Affiche une capture independante du systeme Details. Cette galerie
  // reste utile pour les projets qui fournissent un tableau captures.
  function showCapture(id, idx){
    var p = findProject(id);
    if (!p || !p.captures.length) return;
    var total = p.captures.length;
    var i = ((idx % total) + total) % total;
    galleryState = { id:id, idx:i, open:showCapture };
    var c = p.captures[i];
    var html =
      '<div class="modal-head"><span class="title">Captures — '+escapeHtml(p.title)+'</span>'+
      '<button class="modal-close" aria-label="Fermer">&times;</button></div>'+
      '<div class="modal-body"><div class="gallery">'+
        '<div class="gallery-frame"><img src="'+c.src+'" alt="'+escapeHtml(c.caption)+'"></div>'+
        '<div class="gallery-caption">'+
          '<span>'+escapeHtml(c.caption)+'</span>'+
          '<span class="gallery-nav">'+
            '<button data-nav="prev" aria-label="Image précédente">&larr;</button>'+
            '<span class="gallery-count">'+(i+1)+' / '+total+'</span>'+
            '<button data-nav="next" aria-label="Image suivante">&rarr;</button>'+
          '</span>'+
        '</div>'+
      '</div></div>';
    openModal(html);
    modalContent.querySelector('.modal-close').addEventListener('click', closeModal);
    modalContent.querySelector('[data-nav="next"]').addEventListener('click', function(){ showCapture(id, i+1); });
    modalContent.querySelector('[data-nav="prev"]').addEventListener('click', function(){ showCapture(id, i-1); });
  }

  // Affiche une image ou un PDF de la galerie visuelle dans la modale.
  // La navigation au clavier utilise galleryState pour conserver l'index.
  function showVisualGallery(id, idx){
    var p = findProject(id);
    if (!p || !p.visual || !p.visual.images || !p.visual.images.length) return;
    var images = p.visual.images;
    var total = images.length;
    var i = ((idx % total) + total) % total;
    galleryState = { id:id, idx:i, open:showVisualGallery };
    var image = images[i];
    var galleryBody = image.type === 'pdf'
      ? '<div class="pdf-frame"><iframe src="'+image.src+'" title="'+escapeHtml(image.caption)+'"></iframe></div>'
      : '<div class="gallery-frame"><img src="'+image.src+'" alt="'+escapeHtml(image.caption)+'"></div>';
    var html =
      '<div class="modal-head"><span class="title">Aperçu — '+escapeHtml(p.title)+'</span>'+
      '<button class="modal-close" aria-label="Fermer">&times;</button></div>'+
      '<div class="modal-body"><div class="gallery">'+
        galleryBody+
        '<div class="gallery-caption"><span>'+escapeHtml(image.caption)+'</span>'+
          '<span class="gallery-nav">'+
            '<button data-nav="prev" aria-label="Image précédente">&larr;</button>'+
            '<span class="gallery-count">'+(i+1)+' / '+total+'</span>'+
            '<button data-nav="next" aria-label="Image suivante">&rarr;</button>'+
          '</span>'+
        '</div>'+
      '</div></div>';
    openModal(html);
    modalContent.querySelector('.modal-close').addEventListener('click', closeModal);
    modalContent.querySelector('[data-nav="next"]').addEventListener('click', function(){ showVisualGallery(id, i+1); });
    modalContent.querySelector('[data-nav="prev"]').addEventListener('click', function(){ showVisualGallery(id, i-1); });
  }

  // Change l'image visible directement dans le panneau de la slide,
  // sans ouvrir de modale.
  function stepVisualGallery(button){
    var panel = button.closest('.panel-gallery');
    var project = findProject(panel && panel.querySelector('[data-action="visual-gallery"]')
      ? panel.querySelector('[data-action="visual-gallery"]').getAttribute('data-id')
      : '');
    if (!panel || !project || !project.visual.images.length) return;

    var idx = Number(panel.getAttribute('data-gallery-index') || 0);
    var total = project.visual.images.length;
    var dir = Number(button.getAttribute('data-direction'));
    var nextIdx = (((idx + dir) % total) + total) % total;
    var image = project.visual.images[nextIdx];
    var imageButton = panel.querySelector('[data-action="visual-gallery"]');
    imageButton.setAttribute('data-index', nextIdx);
    imageButton.innerHTML = image.type === 'pdf'
      ? '<span class="visual-gallery-document"><span class="visual-gallery-document-icon">PDF</span><strong>'+escapeHtml(image.caption)+'</strong><small>Cliquer pour ouvrir</small></span>'
      : '<img class="panel-media panel-preview-media panel-preview-blurred" src="'+image.src+'" alt="'+escapeHtml(image.caption)+'" loading="lazy">';
    panel.setAttribute('data-gallery-index', nextIdx);
    panel.querySelector('.visual-gallery-count').textContent = (nextIdx + 1)+' / '+total;
  }

  // Delegation d'evenement : un seul listener gere les boutons generes
  // dynamiquement apres le chargement des projets.
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    if (btn.getAttribute('data-action') === 'details') openDetails(id, 0, 0);
    if (btn.getAttribute('data-action') === 'video-preview') openVideoPreview(id);
    if (btn.getAttribute('data-action') === 'captures') showCapture(id, 0);
    if (btn.getAttribute('data-action') === 'visual-gallery') showVisualGallery(id, Number(btn.getAttribute('data-index')));
    if (btn.getAttribute('data-action') === 'visual-gallery-step') stepVisualGallery(btn);
  });

  // Acces clavier au panneau video (role="button") : Entree ou Espace.
  document.addEventListener('keydown', function(e){
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var panel = e.target.closest && e.target.closest('.panel-video[data-action="video-preview"]');
    if (!panel || backdrop.classList.contains('is-open')) return;
    e.preventDefault();
    openVideoPreview(panel.getAttribute('data-id'));
  });

})();