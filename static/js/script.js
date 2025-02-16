document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("questionnaire").addEventListener("submit", async (e) => {
        e.preventDefault();

        const user_data = {
            budget: document.getElementById("budget").value,
            lifestyle: document.getElementById("lifestyle").value,
            state: document.getElementById("state").value,
            city: document.getElementById("city").value,
            commute_preferences: document.getElementById("commute_preferences").value,
            safety_concerns: document.getElementById("safety_concerns").value,
        };

        try {
            const response = await fetch("/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user_data),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const recommendations = await response.json();
            console.log("Recommendations:", recommendations);

            const resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = "<h2>Recommendations</h2>";

            if (recommendations.ai_recommendations) {
                resultsDiv.innerHTML += `<h3>AI Recommendations</h3><p>${recommendations.ai_recommendations}</p>`;
            }

            if (recommendations.realtor_data && recommendations.realtor_data.listings) {
                let realEstateHTML = "<h3>Real Estate Listings</h3>";
                recommendations.realtor_data.listings.forEach((listing) => {
                    realEstateHTML += `
                        <div class="listing">
                            <p><strong>Address:</strong> ${listing.address}</p>
                            <p><strong>Price:</strong> $${listing.list_price}</p>
                            <p><strong>Beds:</strong> ${listing.beds}, <strong>Baths:</strong> ${listing.baths}, <strong>Sqft:</strong> ${listing.sqft}</p>
                            <hr>
                        </div>
                    `;
                });
                resultsDiv.innerHTML += realEstateHTML;
            }

            if (recommendations.teleport_data) {
                resultsDiv.innerHTML += `
                    <h3>Cost of Living & Crime Rates</h3>
                    <p><strong>Cost of Living:</strong> ${recommendations.teleport_data.categories[0].score_out_of_10}/10</p>
                    <p><strong>Crime Rate:</strong> ${recommendations.teleport_data.categories[1].score_out_of_10}/10</p>
                `;
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            document.getElementById("results").innerHTML = `<p style="color:red;">Error fetching recommendations. Check console for details.</p>`;
        }
    });
});
