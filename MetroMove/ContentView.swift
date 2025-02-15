//
//  ContentView.swift
//  MetroMove
//
//  Created by Sanjana Nukala on 2/15/25.
//

import SwiftUI

struct ContentView: View {
    @State private var city = ""
    @State private var rentalTrendPrediction: String = "Fetching rental trends..."
    @State private var costOfLiving: String = "Fetching data..."
    
    let fetcher = APIFetcher()
    let predictor = RentalTrendPredictor()

    var body: some View {
        ZStack {
            LinearGradient(gradient: Gradient(colors: [Color.blue.opacity(0.8), Color.purple.opacity(0.7)]),
                           startPoint: .top, endPoint: .bottom)
                .edgesIgnoringSafeArea(.all)
            
            VStack {
                Text("MoveWise - AI Relocation")
                    .font(.largeTitle)
                    .bold()
                    .foregroundColor(.white)
                    .padding()

                TextField("Enter City", text: $city)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding()
                    .background(Color.white.opacity(0.8))
                    .cornerRadius(10)
                    .shadow(radius: 5)

                Button(action: getRentalTrendPrediction) {
                    Text("Get Rental Trends")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(Color.blue)
                        .cornerRadius(12)
                        .shadow(radius: 5)
                }
                .padding(.horizontal)

                VStack(alignment: .leading) {
                    Text("📈 Rental Trend Prediction:")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding(.top)
                    Text(rentalTrendPrediction)
                        .foregroundColor(.white)
                        .padding()

                    Text("💰 Cost of Living Estimates:")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding(.top)
                    Text(costOfLiving)
                        .foregroundColor(.white)
                }
                .padding()
                .background(Color.black.opacity(0.3))
                .cornerRadius(15)
                .shadow(radius: 5)
            }
            .padding()
        }
    }

    func getRentalTrendPrediction() {
        fetcher.fetchCostOfLiving(city: city) { result in
            self.costOfLiving = result
        }
        
        fetcher.fetchRentalHistory(city: city) { rentalHistory in
            guard let rentalHistory = rentalHistory else {
                rentalTrendPrediction = "No rental data available."
                return
            }
            
            predictor.predictFutureRentals(city: city, rentalHistory: rentalHistory) { prediction in
                rentalTrendPrediction = prediction
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

