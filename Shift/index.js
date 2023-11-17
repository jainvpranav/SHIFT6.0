
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'

import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js'

const appSettings = {
  databaseURL:"https://shiftvone-441de-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const personalize = ref(database, "personalize")
const promptval = document.getElementById("promptval");
const clickme = document.getElementById("clickme");

clickme.addEventListener("click", ()=> {
    const payload = {
        prompt: {
          text: `Extract essential parameters from ${promptval.value} for precise, high-quality, full-size fashion images using Vertex AI Vision on Google Cloud Platform. Prioritize details, avoid unrelated text, and use only text directly contributing to image generation. Instruct the model to prioritize quick and effective dress generation while maintaining quality, and use mannequins instead of real people for images.Get all this data in 2 lines.`
        }
      };
      // Get the essential parameters from ${promptval.value} so that a meaningful image can be generated using Vertex AI Vision. Construct a sentence from the parameters extracted.Add this text saying to focus on the details & generate full body images. Note that If prompts other than fashion & related matters are found, the output should be XOXO as text. The pictures generated shouldn't be offensive & take time but generate good images
      //  `Map the parameters from ${promptval.value} to the attributes in the given format
      // Attributes 
      // {
      //   "gender":"value",
      //   "category":"value",
      //   "color":"value",
      //   "size":"value",
      //   "fit":"value",
      //   "occasion":"value",
      //   "trendy keywords":"value",
      // }
      // Single prompt with distinct details that would help design an outfit for the same using an AI Image generator in the below format.
      // Prompt - (Here comes the prompt)
      // Generate both prompt n mappings`
    //   Based on the data in ${promptval}.value, get a particular prompt so image is generated for user personalization & generating image of an outfit. Check the gender, color specificity, height, age & occasion.


      // Define the URL for the Google Cloud Language API
      const url = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyDF7I5Dn3nG8hcj6BGzUxpLmDYIU-pteoU";
      
      // Make the POST request
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          console.log(data.candidates[0].output);
          // Handle the response data here
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle errors here
        });
})









//onvalue
onValue(personalize, function(snapshot) {
  if(snapshot.exists()) {
      let items = Object.entries(snapshot.val());
      console.log(items)
  }
})

//push
// clickme.addEventListener("click", function() {
// })

//remove
// newEl.addEventListener("dblclick", function() {
//   let location = ref(database, `todoList/${itemId}`);
//   remove(location);
// });


































