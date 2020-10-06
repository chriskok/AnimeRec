const sendButton = document.querySelector('#submit');
const animeName = document.querySelector('#selected-title');
const selectedAnime = document.querySelector('#select-anime-from-list')

//You need to put the url to the server here in order, everything else can stay the same
const SERVER_URI = "http://127.0.0.1:5000/";
var names_request_xhttp;
var recommendations_xhttp;

eventListeners();
function eventListeners() {
  document.addEventListener('DOMContentLoaded', appInit);
}

//This function gets the anime names from the server
function getAnimeNames(){
  // const URL = SERVER_URI + "get-names";
  const URL = "get-names";
  names_request_xhttp = new XMLHttpRequest();
  names_request_xhttp.open("GET", URL, true);
  names_request_xhttp.send();
  return names_request_xhttp;
}

// ####### Functions ############
function appInit() {
  sendButton.disabled = true;
  sendButton.classList.add('cursor-not-allowed', 'opacity-50');

  var names = getAnimeNames();
  names.onreadystatechange = function () {
    if (names.readyState === 4) {
      // populate dropdown
      var select = document.getElementById("anime_names"); 
      var name_list = JSON.parse(names_request_xhttp.responseText)['names'];
      for(var i = 0; i < name_list.length; i++) {
          var opt = name_list[i];
          var el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          select.appendChild(el);
      }
    }
  }
}

function requestRecommendations(name)
{
  recommendations_xhttp = new XMLHttpRequest();   // new HttpRequest instance   
  const RECOMMENDATIONS_URL = "get-recommendations/" + name;
  // const RECOMMENDATIONS_URL = SERVER_URI + "get-recommendations/" + name;
  recommendations_xhttp.open("POST", RECOMMENDATIONS_URL);
  recommendations_xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  recommendations_xhttp.send();  
  return recommendations_xhttp
}

// Validate fields 
animeName.addEventListener('change', validateSubmission);

function validateSubmission(e) {
  var animeList = names_request_xhttp.responseText;
  // console.log(animeList);
  if (e.target.value.length > 0) {
    var isItIn = animeList.includes(e.target.value);

    if (isItIn === true) {
      const error = document.querySelector('p.error');
      if (error) { error.remove() }
      e.target.classList.remove('border', 'border-red-500');
      e.target.classList.add('border', 'border-green-500');
      sendButton.disabled = false;
      sendButton.classList.remove('cursor-not-allowed', 'opacity-50');

    } else {
      e.target.classList.remove('border-green-500');
      e.target.classList.add('border-red-500');
      displayError()
    }

  } else {
    displayError()
  }
}

function displayError() {
  const errorMessage = document.createElement('p');
  errorMessage.textContent = 'Please select a name from the list'
  errorMessage.classList.add('border', 'border-red-500',
    'background-color-100', 'text-red-500', 'p-3',
    'mt-5', 'text-center', 'error'
  );
  const errors = document.querySelectorAll('.error');
  if (errors.length === 0) { selectedAnime.appendChild(errorMessage); }


}

// Function to remove element by class name
function removeElement(class_name) {
  var elements = document.getElementsByClassName(class_name);
  while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
  }
}

//### Send Request

selectedAnime.addEventListener('submit', sendQuery)

function sendQuery(e) {
  e.preventDefault();
  //show spinner
  // const spinner = document.querySelector('#spinner');
  // spinner.style.display = 'flex';

  var chosen_anime = document.getElementById("selected-title").value;
  console.log('Query Sent: ' + chosen_anime);
  var current_recom = requestRecommendations(chosen_anime);
  
  gtag('event', 'search', {
    'event_label' : chosen_anime
  });

  gtag('event', 'test_search_action', {
    'event_label' : chosen_anime,
    'event_category' : 'search'
  });

  current_recom.onreadystatechange = function () {
    // ready state 'complete = 4'
    // without checking it will run multiple times for multiple ready states
    if (current_recom.readyState === 4) {
      var json_recom = JSON.parse(current_recom.responseText);
      var recom_dict = json_recom["recommendations"][chosen_anime];
      removeElement("recommendation"); // remove all preexisting recommendations

      for (var key in recom_dict) {
        // check if the property/key is defined in the object itself, not in parent
        if (recom_dict.hasOwnProperty(key)) { 
          
          individual_rec_dict = recom_dict[key];
          console.log(key, recom_dict[key]);

          const recommendation = document.createElement('div');
          const animeTitle = individual_rec_dict['full_title']; // Here goes the recommended title
          const animeDescription = individual_rec_dict['synopsis']; // Here goes the recommended title
          const animeImage = individual_rec_dict['image_url'];
          recommendation.className = "recommendation"
          recommendation.innerHTML = 
          `
            <div class="recommendation-picture">
              <img src=` + animeImage +  `>
            </div>
            <div class="main-topic">
              <div class="recommendation-text">
                <h5><u>` + animeTitle + `</u></h5>
                <p>` + animeDescription + `</p>
              </div>
            </div>
          `
          // recommendation.textContent = individual_rec_dict['full_title'] + ": " + individual_rec_dict['synopsis'] 
          recommendation.classList.add('text-left', 'my-10', 'p-2', 'bg-orange-500', 'text-white', 'font-bold');

          selectedAnime.appendChild(recommendation);
        }
      }
    }
  }

  // setTimeout(() => {
  //   spinner.style.display = 'none';

  //   const recommendation = document.createElement('p');
  //   recommendation.textContent = 'Recommended Item Placeholder'
  //   recommendation.classList.add('text-center', 'my-10', 'p-2', 'bg-orange-500', 'text-white', 'font-bold');

  //   selectedAnime.appendChild(recommendation);
  // }, 3000);

}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("selected-title");
  filter = input.value.toUpperCase();
  div = document.getElementById("spinner"); 
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}


//--------------Here is an example of how to use the function----------------
// var n = "one piece";
// var recom = requestRecommendations(n);

// recom.onreadystatechange = function () {
//   // ready state 'complete = 4'
//   // without checking it will run multiple times for multiple ready states
//   if (recom.readyState === 4) {
//     json_recom = JSON.parse(recom.responseText);
//     console.log(json_recom);
//   }
// }
