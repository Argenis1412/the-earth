/**
 * Builds a lightweight combobox/autocomplete around an input and a list element.
 * @param {{
 *   input: HTMLInputElement,
 *   listEl: HTMLUListElement,
 *   search: (query: string) => Array<{label: string, sub: string, value: string}>,
 *   onPick: (item: {label: string, sub: string, value: string}) => void,
 *   maxRows?: number,
 * }} options
 * @returns {{ close: () => void, destroy: () => void }}
 */
export function createAutocomplete({ input, listEl, search, onPick, maxRows = 4 }) {
  let items = [];
  let activeIndex = -1;
  const bound = [];

  const listen = (el, type, fn) => {
    el.addEventListener(type, fn);
    bound.push([el, type, fn]);
  };

  function renderActive() {
    const rows = [...listEl.children];
    rows.forEach((row, idx) => {
      row.setAttribute('aria-selected', String(idx === activeIndex));
    });
    const activeRow = rows[activeIndex];
    if (activeRow) {
      input.setAttribute('aria-activedescendant', activeRow.id);
      activeRow.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  function move(delta) {
    if (!items.length) return;
    if (activeIndex === -1) activeIndex = delta > 0 ? 0 : items.length - 1;
    else activeIndex = (activeIndex + delta + items.length) % items.length;
    renderActive();
  }

  function close() {
    listEl.hidden = true;
    delete listEl.dataset.dir;
    listEl.innerHTML = '';
    items = [];
    activeIndex = -1;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function position() {
    const rect = input.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    const listHeight = listEl.offsetHeight;
    if (below < 150 && rect.top >= listHeight) listEl.dataset.dir = 'up';
    else delete listEl.dataset.dir;
  }

  function pick(index) {
    const item = items[index];
    if (!item) return;
    onPick(item);
    close();
  }

  function open(results) {
    items = results;
    activeIndex = -1;
    listEl.innerHTML = '';
    results.forEach((item, idx) => {
      const row = document.createElement('li');
      row.id = `${listEl.id}-opt-${idx}`;
      row.setAttribute('role', 'option');
      row.setAttribute('aria-selected', 'false');
      const label = document.createElement('span');
      label.textContent = item.label;
      const sub = document.createElement('small');
      sub.textContent = item.sub;
      row.append(label, sub);
      row.addEventListener('click', () => pick(idx));
      listEl.append(row);
    });
    listEl.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    position();
  }

  function refresh() {
    const results = search(input.value);
    if (results.length) open(results);
    else close();
  }

  listen(input, 'input', refresh);

  listen(input, 'keydown', (e) => {
    if (e.key === 'Escape') {
      if (!listEl.hidden) close();
      return;
    }
    if (e.key === 'Tab') {
      close();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(1);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(-1);
      return;
    }
    if (e.key === 'Enter' && activeIndex !== -1) {
      e.preventDefault();
      pick(activeIndex);
    }
  });

  listen(input, 'blur', close);
  listen(listEl, 'mousedown', (e) => e.preventDefault());

  return {
    close,
    destroy() {
      bound.forEach(([el, type, fn]) => el.removeEventListener(type, fn));
      close();
    },
  };
}
