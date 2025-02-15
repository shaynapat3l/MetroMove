//
//  RentalTrendPredictor.swift
//  MetroMove
//
//  Created by Sanjana Nukala on 2/15/25.
//

import Foundation

struct RentalTrendPredictor {
    let openAIKey = "YOUR_OPENAI_API_KEY"

    func predictFutureRentals(city: String, rentalHistory: [Double], completion: @escaping (String) -> Void) {
        let historicalPrices = rentalHistory.map { "\($0)" }.joined(separator: ", ")

        let prompt = """
        Given the following historical rental prices in \(city): \(historicalPrices),
        predict the rental price trend for the next 12 months.
        Should someone move now, or wait for a better price? Provide a short explanation.
        """

        let headers = ["Authorization": "Bearer \(openAIKey)", "Content-Type": "application/json"]
        let body: [String: Any] = ["model": "gpt-4", "prompt": prompt, "temperature": 0.6, "max_tokens": 200]

        guard let url = URL(string: "https://api.openai.com/v1/completions") else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.allHTTPHeaderFields = headers
        request.httpBody = try? JSONSerialization.data(withJSONObject: body, options: [])

        URLSession.shared.dataTask(with: request) { data, _, error in
            guard let data = data, error == nil else { return }
            let response = try? JSONDecoder().decode(OpenAIResponse.self, from: data)
            completion(response?.choices.first?.text ?? "No prediction available.")
        }.resume()
    }
}

// OpenAI Response Model
struct OpenAIResponse: Codable {
    let choices: [Choice]
}

struct Choice: Codable {
    let text: String
}
