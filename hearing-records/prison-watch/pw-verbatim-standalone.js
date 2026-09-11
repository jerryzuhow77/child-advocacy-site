(() => {
  'use strict';

  document.querySelectorAll('.pw-verbatim-source').forEach((section) => {
    section.querySelectorAll('[data-pw-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const open = button.dataset.pwAction === 'open';
        section.querySelectorAll('.pw-verbatim-table').forEach((table) => {
          table.open = open;
        });
      });
    });
  });
})();
