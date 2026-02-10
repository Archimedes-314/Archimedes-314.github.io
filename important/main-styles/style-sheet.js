document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.break').forEach(el => {
        const type = el.dataset.brType;
        const length = el.dataset.brLength;

        switch (type) {
            case 'rem':
                el.style.height = `${length}rem`
                break;

            case 'px':
                el.style.height = `${length}px`
        }
    })
});

 