import React from 'react';
import Footer from "./components/Footer";
import Header from "./components/Header";
import Assistant from "./components/Assistant";

const App: React.FC = () => {
  return (
    <div className="content">
      <Header />
      <Assistant />
      <Footer />
    </div>
  );
}

export default App;
