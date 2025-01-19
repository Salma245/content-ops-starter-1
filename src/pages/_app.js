import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileAnalysis, setFileAnalysis] = useState('');
  const [view, setView] = useState('home');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleQuerySubmit = async () => {
    if (!query.trim()) {
      alert('Please enter a legal question.');
      return;
    }
    const userMessage = { sender: 'user', message: query };
    setConversation((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post('/.netlify/functions/generateContent', { prompt: query });
      setResponse(res.data.response);
      setConversation((prev) => [...prev, { sender: 'bot', message: res.data.response }]);
    } catch (error) {
      setResponse('There was an error processing your request.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please upload a file first.');
      return;
    }

    setLoading(true);

    // Mock file analysis response for now
    setTimeout(() => {
      setFileAnalysis('Document successfully analyzed. Key points extracted: ...');
      setLoading(false);
    }, 2000);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    const feedbackInput = document.querySelector('.input-box').value.trim();
    if (!feedbackInput) {
      alert('Please provide some feedback before submitting.');
      return;
    }
    setFeedbackSubmitted(true);
  };

  const HomeButton = () => (
    <button onClick={() => setView('home')} className="home-btn">
      Home
    </button>
  );

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <button className="hamburger" onClick={toggleSidebar}>☰</button>
        <ul className="menu">
          <li onClick={() => setView('home')}>🏠 Home</li>
          <li onClick={() => setView('qa')}>⚖ Legal Query</li>
          <li onClick={() => setView('upload')}>📄 Upload Document</li>
          <li onClick={() => setView('resources')}>📚 Indian Law Resources</li>
          <li onClick={() => setView('faqs')}>❓ FAQs</li>
          <li onClick={() => setView('feedback')}>📝 Feedback</li>
        </ul>
      </div>

      <div className="content">
        <div className="header">
          <h1>{view === 'home' ? 'LEGAL  BOT  FOR  INDIAN  LAW' : view === 'qa' ? 'LEGALEASE' : view === 'upload' ? 'DOCUMENT ANALYSIS' : view === 'resources' ? 'INDIAN LAW RESOURCES' : view === 'faqs' ? 'FREQUENTLY ASKED QUESTIONS ( FAQS )' : 'FEEDBACK'}</h1>
          <button className="dark-mode-toggle" onClick={toggleTheme}>
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>

        {view === 'home' && (
          <div className="home-screen">
            <p>Welcome to the Legal Bot! Navigate using the menu to get assistance with legal queries or upload documents for analysis.</p>
          </div>
        )}

        {view === 'qa' && (
          <div className="qa-section">
            <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter your legal query..." rows="3" className="input-box" />
            <br />
            <div className="button-group">
              <button onClick={handleQuerySubmit} disabled={loading} className="submit-btn">{loading ? 'Loading...' : 'Send'}</button>
              <button onClick={() => setQuery('')} className="clear-btn">Clear</button>
              <button onClick={toggleHistory} className="history-btn">{showHistory ? 'Hide History' : 'History'}</button>
            </div>
            <br />
            {showHistory && (
              <div className="conversation-history">
                {conversation.map((entry, index) => (
                  <div key={index} className={entry.sender === 'user' ? 'user-message' : 'bot-message'}>
                    {entry.message}
                  </div>
                ))}
              </div>
            )}
            <br />
            <div className="response-box">
              <h2>RESPONSE:</h2>
              <div className="response-content">{response || 'Your response will appear here.'}</div>
            </div>
          </div>
        )}

        {view === 'upload' && (
          <div className="upload-section">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="fileupload" />
            <button onClick={handleFileUpload} disabled={loading} className="submit-btn">{loading ? 'Uploading...' : 'Analyze Document'}</button>
            <br />
            <div className="analysis-results">
              <u><i><h2>ANALYSIS REPORT</h2></i></u>
              <div className="analysis-content">{fileAnalysis || 'Your analysis will appear here.'}</div>
            </div>
          </div>
        )}

        {view === 'resources' && (
          <div className="links">
            <a href="https://indianlaw.org/">The Indian Law Resource Center</a><br />
            <a href="https://libguides.bodleian.ox.ac.uk/law-india">Oxford LibGuides</a><br />
            <a href="https://www.india.gov.in/topics/law-justice">National Portal of India</a><br />
            <a href="https://www.google.com/search?q=indian+law+resources">...More</a><br />
          </div>
        )}

        {view === 'faqs' && (
          <div className="Qs">
            <ul className="list">
              <li>Does Indian law allow ‘registration’ of marriage between an Indian and a foreigner?</li>
              <li>Is monitoring someone else’s social media legal?</li>
              <li>Can a customer record a call without the consent of the opposite party?</li>
              <li>Differentiate between an Attorney, an Advocate, a Lawyer, and a Solicitor.</li>
              <li>Is it legal for a hostel to ask for fees during the lockdown?</li>
              <li>If I rescue someone from drowning and end up injuring myself, can I claim damages?</li>
              <li>Is it legal to kill someone in self-defence in India? Is it legal to carry a baton?</li>
            </ul>
            <a href="https://lawansweronline.com/frequently-asked-legal-questions/">...more</a>
          </div>
        )}

        {view === 'feedback' && (
          <div className="feedback-form">
            <form onSubmit={handleFeedbackSubmit}>
              <textarea className="input-box" placeholder="Write your feedback..." rows="3" />
              <button type="submit" className="submit-btn">Submit Feedback</button>
            </form>
            {feedbackSubmitted && (
              <div className="thank-you-message">
                Thank you for your feedback! We value your input and will work to improve the experience.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
