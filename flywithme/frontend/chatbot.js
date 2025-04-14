const API_URL = "https://localhost:44307/api/Chat";
let map;
let markers = [];

// Function to Fetch Chatbot Response
async function fetchChatbotResponse(userMessage) {
    try {
        var userId = sessionStorage.getItem("UserId");
        var token = sessionStorage.getItem("TOKEN");

        // Show loader before sending request
        showLoader(true);

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ message: userMessage, userId: userId }),
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        return {
            chatResult: data.chatResult || "I couldn't understand that.",
            jsonItinerary: data.jsonItinerary || []
        };
    } catch (error) {
        console.error("Chatbot API Error:", error);
        return {
            chatResult: "Error connecting to AI. Please try again.",
            jsonItinerary: []
        };
    } finally {
        // Hide loader after receiving response
        showLoader(false);
    }
}

//Old method for chat box
// async function sendMessage() {
//     const userInput = document.getElementById("userInput");
//     const chatBox = document.getElementById("chatBox");
//     const message = userInput.value.trim();

//     if (message === "") return;

//     // Display user's message
//     chatBox.innerHTML += <div class="user-message"><strong>You:</strong> ${message}</div>;

//     // Fetch API response
//     const response = await fetchChatbotResponse(message);

//     // Display chatbot response
//     chatBox.innerHTML += <div class="bot-message"><strong>Chat Buddy:</strong> ${response.chatResult}</div>;

//     // Remove existing map link if any
//     document.querySelectorAll(".itinerary-map-link").forEach(el => el.remove());

//     // If there's an itinerary, show "View Itinerary Map" link
//     if (response.jsonItinerary && response.jsonItinerary.length > 0) {
//         const mapLink = document.createElement("a");
//         mapLink.href = "#";
//         mapLink.innerHTML = "🗺️ View Itinerary Map";
//         mapLink.className = "itinerary-map-link"; // Add a class for easy removal
//         mapLink.onclick = function () {
//             openModal();
//             updateMap(response.jsonItinerary);
//             return false; // Prevents page refresh
//         };

//         const mapDiv = document.createElement("div");
//         mapDiv.className = "bot-message";
//         mapDiv.appendChild(mapLink);
//         chatBox.appendChild(mapDiv);
//     }

//     chatBox.scrollTop = chatBox.scrollHeight;
//     userInput.value = "";
// }

// Function to show/hide loader
function showLoader(isLoading) {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = isLoading ? "block" : "none";
    }
}

// Send Message and Handle Response
async function sendMessage() {
    const userInput = document.getElementById("searchInput");
    showLoader(true);
    document.getElementById("searchInput").disabled = true;
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    
    if (searchInput.value == "undefined" || searchInput.value == "") {
        showLoader(false);
        document.getElementById("searchInput").disabled = false;
        return;
    }
    
    const message = searchInput.value.trim();
    if (message === "") return;
    
    // Fetch API response (simulating chatbot response for itinerary search)
    const response = await fetchChatbotResponse(message);
    
    // Clear previous results
    searchResults.innerHTML = "";
    
    // Display chatbot response
    const botMessage = document.createElement("div");
    botMessage.className = "bot-message";
    botMessage.innerHTML = `${response.chatResult}`;
    searchResults.appendChild(botMessage);
    
    if (response.jsonItinerary && response.jsonItinerary.length > 0) {
        const itineraryList = document.createElement("ul");
        itineraryList.className = "itinerary-list";
        
        response.jsonItinerary.forEach(item => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>Day ${item.day}: ${item.location}</strong> <br>
                                  ${item.description} <br>`;
            
            const weatherLink = document.createElement("a");
            weatherLink.href = "#";
            weatherLink.innerHTML = "🌦️ Get Today's Weather";
            weatherLink.className = "weather-link";
            weatherLink.onclick = async function () {
                const weather = await fetchWeather(item.location);
                const weatherInfo = document.createElement("p");
                weatherInfo.className = "weather-info";
                weatherInfo.innerHTML = `🌡️ ${weather.temperature}°C, ${weather.condition}`;
                listItem.appendChild(weatherInfo);
                weatherLink.style.display="none";
                return false;
            };
            
            listItem.appendChild(weatherLink);
            itineraryList.appendChild(listItem);
        });
        
        searchResults.appendChild(itineraryList);
        
        const linkContainer = document.createElement("div");
        linkContainer.className = "link-container"; // Apply Flexbox styling
        
        const mapLink = document.createElement("a");
        mapLink.href = "#";
        mapLink.innerHTML = "🗺️ View Itinerary Map";
        mapLink.className = "itinerary-map-link";
        mapLink.onclick = function () {
            openModal();
            updateMap(response.jsonItinerary);
            return false;
        };
        
        // const flightLink = document.createElement("a");
        // flightLink.href = "#";
        // flightLink.innerHTML = "✈️ Show Flight Details";
        // flightLink.className = "flight-details-link";
        // flightLink.onclick = function () {
        //     openFlightModal();
        //     return false;
        // };
        
        // Append links to container
        linkContainer.appendChild(mapLink);
        //linkContainer.appendChild(flightLink);
        
        // Append container to search results
        searchResults.appendChild(linkContainer);
        
        
        const mapDiv = document.createElement("div");
        mapDiv.className = "bot-message";
        mapDiv.appendChild(mapLink);
        mapDiv.appendChild(document.createElement("br"));
        //mapDiv.appendChild(flightLink);
        searchResults.appendChild(mapDiv);
    }
    
    searchResults.style.display = "block";
    showLoader(false);
    document.getElementById("searchInput").disabled = false;
    userInput.value = "";
}






// Fetch weather API function
async function fetchWeather(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=89982247f1084327a88134153252603&q=${location}`);
        const data = await response.json();
        return {
            temperature: data.current.temp_c,
            condition: data.current.condition.text
        };
    } catch (error) {
        return { temperature: "N/A", condition: "Unable to fetch weather" };
    }
}

// Handle Enter Key Press for Sending Message
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Ensure functions are accessible globally
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
