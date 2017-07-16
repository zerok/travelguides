exports.init = function init() {
    document.querySelectorAll('.collapsable').forEach(container => {
        var label = container.querySelector('.collapsable__label');
        var indicator = document.createElement('i');
        indicator.classList.add('fa');
        indicator.classList.add('fa-fw');
        indicator.classList.add('fa-caret-right');
        label.insertBefore(indicator, label.querySelector('i'));

        container.classList.add('collapsable--collapsed');

        label.addEventListener('click', () => {
            if (container.classList.contains('collapsable--collapsed')) {
                container.classList.remove('collapsable--collapsed');
                container.classList.add('collapsable--open');
                indicator.classList.remove('fa-caret-right');
                indicator.classList.add('fa-caret-down');
            } else {
                container.classList.remove('collapsable--open');
                container.classList.add('collapsable--collapsed');
                indicator.classList.add('fa-caret-right');
                indicator.classList.remove('fa-caret-down');
            }
        });
    });
}
