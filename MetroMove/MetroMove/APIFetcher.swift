//
//  APIFetcher.swift
//  MetroMove
//
//  Created by Sanjana Nukala on 2/15/25.
//

import Foundation

struct APIFetcher {
    let numbeoAPIKey = "YOUR_NUMBEO_API_KEY"

    // Fetch cost of living and rent prices from Numbeo
    func fetchCostOfLiving(city: String, completion: @escaping (String) -> Void) {
        let urlString = "https://www.numbeo.com/api/city_prices?api_key=\(numbeoAPIKey)&query=\(city)"
        guard let url = URL(string: urlString) else { return }

        URLSession.shared.dataTask(with: url) { (data, _, _) in
            guard let data = data else { return }
            
            do {
                let result = try JSONDecoder().decode(CostOfLivingData.self, from: data)
                let rentPrice = result.prices.first { $0.item_name.contains("Rent") }?.average_price ?? 0.0
                completion("Average Rent: $\(rentPrice)")
            } catch {
                print("Error decoding cost-of-living data: \(error)")
                completion("No data available.")
            }
        }.resume()
    }
}

// Data Model for Numbeo API
struct CostOfLivingData: Codable {
    let prices: [PriceItem]
}

struct PriceItem: Codable {
    let item_name: String
    let average_price: Double
}
