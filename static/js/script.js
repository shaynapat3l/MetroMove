document.getElementById('questionnaire').addEventListener('submit', async (e) => {
    e.preventDefault();

    const budget = document.getElementById('budget').value;
    const lifestyle = document.getElementById('lifestyle').value;

    const response = await fetch('/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ budget, lifestyle }),
    });

    const recommendations = await response.json();
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = '';

    if (recommendations.length === 0) {
        recommendationsList.innerHTML = '<li>No recommendations found. Try adjusting your filters.</li>';
    } else {
        recommendations.forEach((item) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${item.neighborhood}</strong><br>
                Score: ${item.score}<br>
                Rent: $${item.rent}<br>
                Crime Rate: ${item.crime_rate}<br>
                Walkability: ${item.walkability}
            `;
            recommendationsList.appendChild(li);
        });
    }
});