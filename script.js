function changeCardColors() {
    const cards = document.querySelectorAll('.dropdown');
    const isChecked = document.getElementById('checkbox').checked;
    cards.forEach(card => {
        card.style.backgroundColor = isChecked ? '#e7a572' : '#23325a';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.querySelector('.cards');
    const cards = document.querySelectorAll('.card');
    let isSpread = false;
    let activeCard = null;

    // Store initial transforms for each card in spread state
    const spreadTransforms = [
        'rotate(-30deg) translate(-440px, 180px)',
        'rotate(-15deg) translate(-225px, 240px)',
        'rotate(0deg) translate(0, 250px)',
        'rotate(15deg) translate(225px, 240px)',
        'rotate(30deg) translate(440px, 180px)'
    ];

    // Handle card clicks
    cards.forEach((card, index) => {
        // Mouse enter - shove other cards
        card.addEventListener('mouseenter', () => {
            if (!isSpread || activeCard) return; // Only shove in spread state and if no card is active

            cards.forEach((otherCard, otherIndex) => {
                if (index !== otherIndex) {
                    const distance = Math.abs(otherIndex - index);
                    const direction = otherIndex < index ? -1 : 1;
                    const shove = (index === 0 || index === 4) ? 150 / distance : 100 / distance; // Increase shove for edge cards
                    const rotate = (index === 0 || index === 4) ? 15 / distance : 10 / distance; // Increase rotate for edge cards

                    // Apply shove relative to initial spread position
                    otherCard.style.transform = `
                        ${spreadTransforms[otherIndex]}
                        translateX(${direction * shove}px)
                        rotate(${direction * rotate}deg)
                    `;
                }
            });
        });

        // Mouse leave - reset other cards to spread position
        card.addEventListener('mouseleave', () => {
            if (!isSpread || activeCard) return; // Only reset in spread state and if no card is active

            cards.forEach((otherCard, otherIndex) => {
                otherCard.style.transform = spreadTransforms[otherIndex];
            });
        });

        // Click handler
        card.addEventListener('click', (e) => {
            if (!isSpread) {
                // First click - spread the cards
                cardsContainer.classList.add('spread');
                isSpread = true;

                // Apply spread transforms to cards
                cards.forEach((card, index) => {
                    card.style.transform = spreadTransforms[index];
                });
            } else if (isSpread && !activeCard) {
                // Click on a card in spread state (no active card)
                activeCard = card;
                card.classList.add('active');
                cards.forEach((other) => {
                    if (other !== card) other.classList.add('lowered');
                });
            } else if (isSpread && activeCard === card) {
                // Click on the active card - deactivate it
                activeCard.classList.remove('active');
                cards.forEach((other) => other.classList.remove('lowered'));
                activeCard = null;
            }
        });
    });

    // Handle close button clicks
    document.querySelectorAll('.close-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = e.target.closest('.card');
            if (activeCard === card) {
                card.classList.remove('active');
                cards.forEach((other) => other.classList.remove('lowered'));
                activeCard = null;
            }
        });
    });

    // Handle clicks outside the cards to collapse the stack
    document.addEventListener('click', (e) => {
        if (isSpread && !activeCard && !e.target.closest('.card')) {
            cardsContainer.classList.remove('spread');
            isSpread = false;

            // Reset cards to their stacked state
            cards.forEach((card) => {
                card.style.transform = '';
            });
        }
    });
});
