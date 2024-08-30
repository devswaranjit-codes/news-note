const apiKey = 'b9d577ad908a4a4d97b763b219a6e31a'; // Replace with your actual API key

// Fetch and display trending news
function fetchTrendingNews() {
    const url = 'https://newsapi.org/v2/top-headlines?country=in&apiKey=' + apiKey; // Fetch news

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            displayNews(data.articles);
        })
        .catch(function(error) {
            document.getElementById('news-container').textContent = 'Error fetching news. Please try again later.';
            console.error('Error fetching news:', error);
        });
}


// Display news articles
function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; // Clear previous results

    if (articles.length === 0) {
        newsContainer.textContent = 'No news articles found.';
        return;
    }

    articles.forEach(function(article) {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'news-item';

        const image = document.createElement('img');
        image.src = article.urlToImage;
        

        const title = document.createElement('h2');
        title.textContent = article.title;

        const description = document.createElement('p');
        description.textContent = article.description;

        const readMoreBtn = document.createElement('button');
        readMoreBtn.textContent = 'Read More';
        readMoreBtn.onclick = function() {
            window.open(article.url, '_blank');
        };

        const noteBtn = document.createElement('button');
        noteBtn.textContent = 'Take Note';
        noteBtn.onclick = function() {
            saveNote(article.url, article.title);
        };

        articleDiv.appendChild(image);
        articleDiv.appendChild(title);
        articleDiv.appendChild(description);
        articleDiv.appendChild(readMoreBtn);
        articleDiv.appendChild(noteBtn);

        newsContainer.appendChild(articleDiv);
    });
}



// Handle search form submission
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const query = document.getElementById('query').value;
    const url = 'https://newsapi.org/v2/everything?q=' + encodeURIComponent(query) + '&apiKey=' + apiKey;

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            displayNews(data.articles);
        })
        .catch(function(error) {
            document.getElementById('news-container').textContent = 'Error fetching news. Please try again later.';
            console.error('Error fetching news:', error);
        });
       
});



// Share news via WhatsApp
function shareNews(url, title) {
    const shareUrl = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(title + ' ' + url);
    window.open(shareUrl, '_blank');
}



// Save note to local storage
function saveNote(url, title) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push({ url: url, title: title });
    localStorage.setItem('notes', JSON.stringify(notes));
    alert('Note saved!');
}



// Remove a note
function removeNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1); // Remove note at specified index
    localStorage.setItem('notes', JSON.stringify(notes));
    displaySavedNotes(); // Refresh the saved notes display
}



// Access all saved notes
function displaySavedNotes() {
    const savedNotesContainer = document.getElementById('saved-notes');
    savedNotesContainer.innerHTML = ''; // Clear previous results

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    if (notes.length === 0) {
        savedNotesContainer.textContent = 'No saved notes.';
        return;
    }

    notes.forEach(function(note, index) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'saved-note';

        const noteTitle = document.createElement('p');
        noteTitle.textContent = note.title;

        const noteLink = document.createElement('a');
        noteLink.href = note.url;
        noteLink.textContent = 'Read Article';
        noteLink.target = '_blank';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = function() {
            removeNote(index);
        };

        noteDiv.appendChild(noteTitle);
        noteDiv.appendChild(noteLink);
        noteDiv.appendChild(removeBtn);

        savedNotesContainer.appendChild(noteDiv);
    });

    document.getElementById('note-section').style.display = 'block';
}


// Fetch trending news when the page loads
fetchTrendingNews();

// Show saved notes when the "Access Notes" button is clicked
document.getElementById('access-notes').onclick = displaySavedNotes;
