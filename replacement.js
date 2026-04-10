function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
function spellCheck(word) {
  const commonWords = ['sarath', 'krishna', 'skills', 'experience', 'projects', 'publications', 'certifications', 'contact', 'email', 'work', 'education', 'research', 'ai', 'ml', 'python', 'java', 'javascript', 'selenium', 'tosca', 'tensorflow', 'react', 'node', 'mongodb', 'aws', 'iot', 'fraud', 'detection', 'deep', 'learning', 'graph', 'neural', 'networks', 'ieee', 'wipro', 'datadevice', 'amrita', 'university', 'btech', 'computer', 'science', 'software', 'engineer', 'qa', 'testing', 'automation', 'web', 'development', 'full', 'stack', 'photography', 'videography', 'travel', 'music', 'social', 'media', 'storytelling', 'hire', 'collaborate', 'freelance', 'remote', 'australia', 'uae', 'bengaluru', 'india', 'linkedin', 'github', 'phone', 'location', 'personality', 'interests', 'availability', 'roles', 'opportunities', 'europe', 'relocation', 'visa', 'product', 'management', 'sales', 'marketing', 'strategy'];
  let bestMatch = word;
  let minDistance = Infinity;
  commonWords.forEach(dictWord => {
    const dist = levenshtein(word, dictWord);
    if (dist < minDistance && dist <= 2) {
      minDistance = dist;
      bestMatch = dictWord;
    }
  });
  return minDistance <= 2 ? bestMatch : word;
}
function correctQuery(query) {
  return query.replace(/\b[a-z]+\b/g, spellCheck);
}
function splitQueries(msg) {
  const separators = /\s+(and|or|also|plus|what about|tell me about|can you)\s+/gi;
  return msg.split(separators).filter(part => part.trim() && !/^(and|or|also|plus|what about|tell me about|can you)$/i.test(part.trim()));
}
function generateLocalReply(msg){
  const correctedMsg = correctQuery(msg.toLowerCase());
  const queries = splitQueries(correctedMsg);
  const responses = [];
  queries.forEach(query => {
    const corpus = buildAiCorpus();
    let bestMatch = '';
    let bestScore = 0;
    corpus.forEach(item => {
      const score = scoreText(query, item);
      if(score > bestScore){ bestScore = score; bestMatch = item; }
    });
    const threshold = Math.max(3, Math.floor((query.match(/\b[a-z0-9]+\b/g) || []).length / 2));
    if(bestScore >= threshold && bestMatch){
      responses.push(`Here's what I found:\n${bestMatch}`);
    } else {
      const fallbackAnswers = [
        {keys:['skill','technology','stack','tech','language','tool'], text:'Sarath is strong in QA, Selenium, Tosca, Python, Java, JavaScript, TypeScript, AI/ML, TensorFlow, scikit-learn, GNN, React, Node.js, MongoDB, and AWS IoT.'},
        {keys:['experience','work','project engineer','test engineer','wipro','datadevice','intern','role','job'], text:'He works as a Project Engineer at Wipro and a Test Engineer for an Australian team, with previous remote internship experience in web development and testing.'},
        {keys:['education','degree','b.tech','amrita','college','university'], text:'He completed his B.Tech in Computer Science at Amrita Vishwa Vidyapeetham from 2020 to 2024.'},
        {keys:['publication','paper','ieee','research','fraud detection','graph neural network','gnn'], text:'He has published IEEE research on credit-card fraud detection using deep learning, autoencoders, RNNs, and graph neural networks.'},
        {keys:['contact','email','hire','reach out','collaborate','freelance'], text:'You can reach him at sarathkrishna869@gmail.com. He is open to full-time roles, freelance work, and research partnerships.'},
        {keys:['hello','hi','hey','greetings'], text:'Hello! I\'m Sarath\'s AI assistant. I can tell you about his skills, experience, projects, publications, and more. What would you like to know?'},
        {keys:['who','about','background','bio'], text:'Sarath Krishna C K is a software engineer specializing in QA and test automation. He has a B.Tech in Computer Science, IEEE publications on AI fraud detection, and experience at Wipro and international remote teams.'},
        {keys:['location','where','live','based'], text:'Sarath is based in Bengaluru, India, but has worked remotely with teams in Australia and the UAE.'},
        {keys:['hobbies','interests','personal','outside work'], text:'Outside of work, Sarath enjoys photography, videography, travel, music, social media, and visual storytelling.'}
      ];
      let found = false;
      for(const item of fallbackAnswers){
        if(item.keys.some(k => query.includes(k))) {
          responses.push(item.text);
          found = true;
          break;
        }
      }
      if(!found){
        responses.push('I\'m a local assistant built from this portfolio. I can answer questions about Sarath\'s background, skills, projects, publications, and certifications. Ask me about his experience, his AI work, or how to contact him.');
      }
    }
  });
  return responses.join('\n\n');
}