document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.break').forEach(el => {
        const type = el.dataset.brType;
        const length = el.dataset.brLength;

        el.style.height = `${length}`
    });

    document.querySelectorAll('.multicol').forEach(el => {
        const number = el.dataset.colNumber;
        const gap = el.dataset.colGap;
        const type = el.dataset.colGapType;
        const rule = el.dataset.colRule;

        el.style.columnCount = `${number}`;
        el.style.columnGap = `${gap}`
    });
});

 