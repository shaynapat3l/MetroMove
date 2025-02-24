import openai
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

OPENAI_API_KEY = "add-key-here"

openai.api_key = "add-key-here"

def generate_recommendations(user_data):
    """
    Generate AI-driven neighborhood recommendations.
    """
    prompt = f"""
    Recommend neighborhoods based on:
    - Budget: ${user_data['budget']}
    - Lifestyle: {user_data['lifestyle']}
    - City: {user_data['city']}, {user_data['state']}
    - Commute Preferences: {user_data['commute_preferences']}
    - Safety Concerns: {user_data['safety_concerns']}
    
    Provide details such as:
    - Expected rental prices
    - Walkability score out of 5
    - Crime rate
    - Public transit availability
    - Local schools and universities
    """

    try:
        print("Calling OpenAI API...")
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a real estate expert providing neighborhood recommendations."},
                {"role": "user", "content": prompt}
            ],
        )
        return response.choices[0].message['content'].strip()
    
    except openai.error.RateLimitError:
        print("Error: OpenAI API quota exceeded.")
        return "AI recommendations are temporarily unavailable due to API quota limits."
    
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return "AI recommendations could not be generated due to an API error."



@app.route('/')
def home():
    return render_template('index.html')


@app.route('/recommend', methods=['POST'])
def recommend():
    user_data = request.json
    print("Received User Data:", user_data)


    ai_recommendations = generate_recommendations(user_data)
    print("AI Recommendations:", ai_recommendations)


    recommendations = {
        "ai_recommendations": ai_recommendations
    }

    return jsonify(recommendations)


if __name__ == '__main__':
    app.run(debug=True)
