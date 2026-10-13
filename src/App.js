import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';
import Home from './components/Home';
import { getLabels, readPreference, savePreference } from './translations';

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Portfolio request failed: ${response.status}`);
  return response.json();
}

class App extends Component {
  loadVersion = 0;
  requests = new Map();

  constructor(props) {
    super(props);
    this.state = {
      language: readPreference('portfolioLanguage', 'en') === 'ja' ? 'ja' : 'en',
      theme: readPreference('portfolioTheme', 'light') === 'dark' ? 'dark' : 'light',
      resumeData: null, sharedData: null, loading: true, error: false,
    };
  }

  componentDidMount() {
    document.body.dataset.theme = this.state.theme;
    document.documentElement.lang = this.state.language;
    this.loadPortfolio(this.state.language);
  }

  componentWillUnmount() { this.loadVersion += 1; }

  getData = (path) => {
    // Cache only for this mounted app, so switches reuse data while a reload
    // still checks the deployed content. Failed requests remain retryable.
    if (!this.requests.has(path)) {
      this.requests.set(path, loadJson(path).catch(error => {
        this.requests.delete(path);
        throw error;
      }));
    }
    return this.requests.get(path);
  };

  loadPortfolio = async (language) => {
    if (this.state.resumeData && !this.state.error && language === this.state.language) return;
    const version = ++this.loadVersion;
    this.setState({ loading: true, error: false });
    try {
      const [sharedData, resumeData] = await Promise.all([
        this.getData('/portfolio_shared_data.json'),
        this.getData(language === 'ja' ? '/res_secondaryLanguage.json' : '/res_primaryLanguage.json'),
      ]);
      // A slower response must not overwrite a more recent language selection.
      if (version !== this.loadVersion) return;
      this.setState({ sharedData, resumeData, language, loading: false, error: false });
      document.documentElement.lang = language;
      document.title = `${sharedData.basic_info.name} | ${resumeData.basic_info.headline}`;
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = resumeData.basic_info.meta_description;
      savePreference('portfolioLanguage', language);
    } catch {
      if (version === this.loadVersion) this.setState({ loading: false, error: true });
    }
  };

  changeTheme = () => {
    const theme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setState({ theme });
    document.body.dataset.theme = theme;
    savePreference('portfolioTheme', theme);
  };

  render() {
    const { resumeData, sharedData, language, theme, loading, error } = this.state;
    const labels = getLabels(language);
    return (
      <Router>
        <Header sharedData={sharedData?.basic_info} resumeBasicInfo={resumeData?.basic_info}
          labels={labels} theme={theme} changeTheme={this.changeTheme} />
        <main>
          {loading && <p className="portfolio-status" role="status">{labels.loading}</p>}
          {error && <div className="portfolio-status" role="alert">
            <p>{labels.loadError}</p>
            <button type="button" onClick={() => this.loadPortfolio(language)}>{labels.retry}</button>
          </div>}
          {resumeData && sharedData && <Routes>
            <Route path="/" element={<Home resumeData={resumeData} sharedData={sharedData} labels={labels} />} />
            <Route path="/about" element={<About resumeBasicInfo={resumeData.basic_info} labels={labels} />} />
            <Route path="*" element={<section className="portfolio-status">
              <h2>{labels.notFound}</h2><p>{labels.notFoundDetail}</p><Link to="/">{labels.backHome}</Link>
            </section>} />
          </Routes>}
        </main>
        <Footer sharedBasicInfo={sharedData?.basic_info} labels={labels} language={language}
          applyPickedLanguage={this.loadPortfolio} loading={loading} />
      </Router>
    );
  }
}

export default App;
