function changeCardColors() {
    const cards = document.querySelectorAll('.dropdown');
    const isChecked = document.getElementById('checkbox').checked;
    cards.forEach(card => {
        card.style.backgroundColor = isChecked ? '#e7a572' : '#23325a';
    });
}