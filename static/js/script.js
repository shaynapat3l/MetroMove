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
            console.log("Recommendations:", recommendations); // Debugging

            const resultsDiv = document.getElementById("recommendations-output");
            resultsDiv.innerHTML = ""; // Clear previous results

            // AI Recommendations
            if (recommendations.ai_recommendations) {
                const aiSection = document.createElement("div");
                aiSection.innerHTML = `<h3>AI Recommendations</h3>`;

                if (Array.isArray(recommendations.ai_recommendations)) {
                    const aiList = document.createElement("ul");
                    recommendations.ai_recommendations.forEach((rec) => {
                        const listItem = document.createElement("li");
                        listItem.textContent = rec;
                        aiList.appendChild(listItem);
                    });
                    aiSection.appendChild(aiList);
                } else {
                    aiSection.innerHTML += `<p>${recommendations.ai_recommendations}</p>`;
                }

                resultsDiv.appendChild(aiSection);
            }

            // Real Estate Listings
            if (recommendations.realtor_data && recommendations.realtor_data.listings) {
                const realEstateSection = document.createElement("div");
                realEstateSection.innerHTML = `<h3>Real Estate Listings</h3>`;

                recommendations.realtor_data.listings.forEach((listing) => {
                    const listingDiv = document.createElement("div");
                    listingDiv.classList.add("listing");
                    listingDiv.innerHTML = `
                        <p><strong>Address:</strong> ${listing.address}</p>
                        <p><strong>Price:</strong> $${listing.list_price}</p>
                        <p><strong>Beds:</strong> ${listing.beds}, <strong>Baths:</strong> ${listing.baths}, <strong>Sqft:</strong> ${listing.sqft}</p>
                        <hr>
                    `;
                    realEstateSection.appendChild(listingDiv);
                });

                resultsDiv.appendChild(realEstateSection);
            }

            // Cost of Living & Crime Rates
            if (recommendations.teleport_data) {
                const teleportSection = document.createElement("div");
                teleportSection.innerHTML = `
                    <h3>Cost of Living & Crime Rates</h3>
                    <p><strong>Cost of Living:</strong> ${recommendations.teleport_data.categories[0].score_out_of_10}/10</p>
                    <p><strong>Crime Rate:</strong> ${recommendations.teleport_data.categories[1].score_out_of_10}/10</p>
                `;
                resultsDiv.appendChild(teleportSection);
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            document.getElementById("recommendations-output").innerHTML = `<p style="color:red;">Error fetching recommendations. Check console for details.</p>`;
        }
    });
});
