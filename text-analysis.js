// Text analysis functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const textInput = document.getElementById('textInput');
    const analyzeButton = document.getElementById('analyzeButton');
    const clearButton = document.getElementById('clearButton');
    const sampleTextButton = document.getElementById('sampleTextButton');
    const basicStats = document.getElementById('basicStats');
    const pronounsCount = document.getElementById('pronounsCount');
    const prepositionsCount = document.getElementById('prepositionsCount');
    const articlesCount = document.getElementById('articlesCount');

    // Event listeners
    if (analyzeButton) {
        analyzeButton.addEventListener('click', analyzeText);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearAll);
    }
    
    if (sampleTextButton) {
        sampleTextButton.addEventListener('click', loadSampleText);
    }
    
    // Clear all content
    function clearAll() {
        textInput.value = '';
        basicStats.innerHTML = '<p>Enter text and click "Analyze Text" to see statistics.</p>';
        pronounsCount.innerHTML = '<p>Enter text and click "Analyze Text" to see pronoun counts.</p>';
        prepositionsCount.innerHTML = '<p>Enter text and click "Analyze Text" to see preposition counts.</p>';
        articlesCount.innerHTML = '<p>Enter text and click "Analyze Text" to see indefinite article counts.</p>';
    }
    
    // Load sample text for testing
    function loadSampleText() {
        // A sample text that includes various grammatical elements
        fetch('https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/corpora/gutenberg.zip')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                // Just use a placeholder text if the fetch fails
                const sampleText = `
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. A student went to the university and met with a professor. The professor gave him an assignment about the solar system. He was very excited about it and started working on it immediately. The student used many resources for his research, including books from the library and articles from the internet. He worked with his classmates and they helped each other with their assignments. The professor was impressed with his work and gave him an excellent grade. After completing the assignment, they celebrated at a restaurant near the campus. The food was delicious and they enjoyed their time together. Later, they went for a walk in the park and discussed their future plans. An old man was sitting on a bench and feeding pigeons. They stopped to chat with him and learned about his experiences during the war. It was a fascinating conversation and they learned a lot from him. The student decided to include some of these stories in his next assignment. When he returned home, he told his family about his day and showed them his assignment. They were proud of him and encouraged him to continue working hard. The next day, he went back to the university and attended his classes. He was looking forward to learning more and working on new projects. The end.`;
                
                textInput.value = sampleText.repeat(100); // Repeat to make it over 10,000 words
                analyzeText();
            })
            .catch(error => {
                console.error('Error loading sample text:', error);
                // Fallback to a smaller sample text
                const fallbackText = `
                The quick brown fox jumps over the lazy dog. A student went to the university and met with a professor. The professor gave him an assignment about the solar system. He was very excited about it and started working on it immediately.`;
                textInput.value = fallbackText.repeat(100);
                analyzeText();
            });
    }
    
    // Main analysis function
    function analyzeText() {
        const text = textInput.value;
        
        if (!text.trim()) {
            alert('Please enter some text to analyze.');
            return;
        }
        
        // Calculate basic statistics
        const stats = calculateBasicStats(text);
        displayBasicStats(stats);
        
        // Analyze pronouns
        const pronouns = countPronouns(text);
        displayPronounCount(pronouns);
        
        // Analyze prepositions
        const prepositions = countPrepositions(text);
        displayPrepositionCount(prepositions);
        
        // Analyze indefinite articles
        const articles = countIndefiniteArticles(text);
        displayArticleCount(articles);
    }
    
    // Calculate basic statistics of the text
    function calculateBasicStats(text) {
        const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        const spaceCount = (text.match(/\s/g) || []).length;
        const newlineCount = (text.match(/\n/g) || []).length;
        const specialSymbolCount = (text.match(/[^\w\s]/g) || []).length;
        
        return {
            letters: letterCount,
            words: wordCount,
            spaces: spaceCount,
            newlines: newlineCount,
            specialSymbols: specialSymbolCount
        };
    }
    
    // Display basic statistics
    function displayBasicStats(stats) {
        basicStats.innerHTML = `
            <div class="stat-item">
                <strong>Letters:</strong> ${stats.letters}
            </div>
            <div class="stat-item">
                <strong>Words:</strong> ${stats.words}
            </div>
            <div class="stat-item">
                <strong>Spaces:</strong> ${stats.spaces}
            </div>
            <div class="stat-item">
                <strong>Newlines:</strong> ${stats.newlines}
            </div>
            <div class="stat-item">
                <strong>Special Symbols:</strong> ${stats.specialSymbols}
            </div>
        `;
    }
    
    // Count pronouns in the text
    function countPronouns(text) {
        const pronounsList = [
            // Personal pronouns
            'i', 'me', 'my', 'mine', 'myself',
            'you', 'your', 'yours', 'yourself', 'yourselves',
            'he', 'him', 'his', 'himself',
            'she', 'her', 'hers', 'herself',
            'it', 'its', 'itself',
            'we', 'us', 'our', 'ours', 'ourselves',
            'they', 'them', 'their', 'theirs', 'themselves',
            
            // Demonstrative pronouns
            'this', 'that', 'these', 'those',
            
            // Interrogative pronouns
            'who', 'whom', 'whose', 'which', 'what',
            
            // Relative pronouns
            'that', 'which', 'who', 'whom', 'whose',
            
            // Indefinite pronouns
            'anybody', 'anyone', 'anything', 'each', 'either', 'everybody', 'everyone', 
            'everything', 'neither', 'nobody', 'nothing', 'one', 'somebody', 'someone', 'something',
            'both', 'few', 'many', 'several', 'all', 'any', 'most', 'none', 'some'
        ];
        
        const results = {};
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        
        pronounsList.forEach(pronoun => {
            const count = words.filter(word => word === pronoun).length;
            if (count > 0) {
                results[pronoun] = count;
            }
        });
        
        return results;
    }
    
    // Display pronoun count
    function displayPronounCount(pronouns) {
        if (Object.keys(pronouns).length === 0) {
            pronounsCount.innerHTML = '<p>No pronouns found in the text.</p>';
            return;
        }
        
        let html = '<table><tr><th>Pronoun</th><th>Count</th></tr>';
        
        // Sort pronouns by count (descending)
        const sortedPronouns = Object.entries(pronouns)
            .sort((a, b) => b[1] - a[1]);
        
        sortedPronouns.forEach(([pronoun, count]) => {
            html += `<tr><td>${pronoun}</td><td>${count}</td></tr>`;
        });
        
        html += '</table>';
        pronounsCount.innerHTML = html;
    }
    
    // Count prepositions in the text
    function countPrepositions(text) {
        const prepositionsList = [
            'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 
            'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'besides', 
            'between', 'beyond', 'by', 'concerning', 'considering', 'despite', 'down', 
            'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 
            'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding', 
            'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards', 'under', 
            'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
        ];
        
        const results = {};
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        
        prepositionsList.forEach(preposition => {
            const count = words.filter(word => word === preposition).length;
            if (count > 0) {
                results[preposition] = count;
            }
        });
        
        return results;
    }
    
    // Display preposition count
    function displayPrepositionCount(prepositions) {
        if (Object.keys(prepositions).length === 0) {
            prepositionsCount.innerHTML = '<p>No prepositions found in the text.</p>';
            return;
        }
        
        let html = '<table><tr><th>Preposition</th><th>Count</th></tr>';
        
        // Sort prepositions by count (descending)
        const sortedPrepositions = Object.entries(prepositions)
            .sort((a, b) => b[1] - a[1]);
        
        sortedPrepositions.forEach(([preposition, count]) => {
            html += `<tr><td>${preposition}</td><td>${count}</td></tr>`;
        });
        
        html += '</table>';
        prepositionsCount.innerHTML = html;
    }
    
    // Count indefinite articles in the text
    function countIndefiniteArticles(text) {
        const articlesList = ['a', 'an', 'some'];
        
        const results = {};
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        
        articlesList.forEach(article => {
            const count = words.filter(word => word === article).length;
            if (count > 0) {
                results[article] = count;
            }
        });
        
        return results;
    }
    
    // Display indefinite article count
    function displayArticleCount(articles) {
        if (Object.keys(articles).length === 0) {
            articlesCount.innerHTML = '<p>No indefinite articles found in the text.</p>';
            return;
        }
        
        let html = '<table><tr><th>Article</th><th>Count</th></tr>';
        
        // Sort articles by count (descending)
        const sortedArticles = Object.entries(articles)
            .sort((a, b) => b[1] - a[1]);
        
        sortedArticles.forEach(([article, count]) => {
            html += `<tr><td>${article}</td><td>${count}</td></tr>`;
        });
        
        html += '</table>';
        articlesCount.innerHTML = html;
    }
});