  function makeElideNode(innerNodes) {
    const wrapper = document.createElement('span');
    wrapper.className = 'elide-wrapper';

    const ellipsis = document.createElement('button');
    ellipsis.type = 'button';
    ellipsis.className = 'elide-ellipsis';
    ellipsis.setAttribute('aria-expanded', 'false');
    ellipsis.innerText = '…';

    const content = document.createElement('span');
    content.className = 'elide-content';
    content.setAttribute('hidden', '');

    const hideBtn = document.createElement('button');
    hideBtn.type = 'button';
    hideBtn.className = 'hide-btn';
    hideBtn.innerText = '[hide]';

    innerNodes.forEach(n => content.appendChild(n));
    content.appendChild(hideBtn);

    ellipsis.addEventListener('click', () => {
      const expanded = ellipsis.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        content.setAttribute('hidden', '');
        ellipsis.setAttribute('aria-expanded', 'false');
      } else {
        content.removeAttribute('hidden');
        ellipsis.setAttribute('aria-expanded', 'true');
      }
    });

    hideBtn.addEventListener('click', () => {
      content.setAttribute('hidden','');
      ellipsis.setAttribute('aria-expanded','false');
      ellipsis.focus();
    });

    wrapper.appendChild(ellipsis);
    wrapper.appendChild(content);
    return wrapper;
  }

  function enhanceElides(root=document) {
    const els = root.querySelectorAll('.elide');
    els.forEach(el => {
      if (el.dataset.enhanced === 'true') return;
      el.dataset.enhanced = 'true';
      const nodes = Array.from(el.childNodes).map(n => n.cloneNode(true));
      const newNode = makeElideNode(nodes);
      el.replaceWith(newNode);
    });
  }

  document.addEventListener('DOMContentLoaded', () => enhanceElides());

    var coll = document.getElementsByClassName("collapsible");
    var i;
    
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        } 
      });
    }
