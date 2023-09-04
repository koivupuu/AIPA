import React, { useState, FC } from 'react';

const ExamplePage: FC = () => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const handleTooltipClick = (): void => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="mx-2 cursor-pointer">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white px-1 rounded focus:outline-primary-800 focus:shadow-outline"
        onClick={handleTooltipClick}
      >
        ?
      </button>
      {showTooltip && <Content handleTooltipClick={handleTooltipClick} />}
    </div>
  );
};

interface ContentProps {
  handleTooltipClick: () => void;
}

const Content: FC<ContentProps> = ({ handleTooltipClick }) => {

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50" onClick={handleTooltipClick}>
        <div className="absolute inset-0 bg-black opacity-90"></div>
        <div className="relative z-10 flex justify-center items-center space-x-1 text-white md:mx-16 mx-4 overflow-y-auto max-h-screen">
          <div className="text-lg md:text-base">
            <div className="mb-4 text-stop">Click anywhere to close</div>
            <h1>This is an example strategy document</h1>

            <h2>APPENDIX A: STRATEGIC PLANNING TERMS</h2>
            <p>Strategic Planning Term Definition</p><br />

            <h2>Core Values/Guiding Principles</h2>
            <p>Sustainability, Quality, Integrity, Community, and Innovation. These values form our commitment to environmental stewardship, providing the highest quality products, maintaining honest relationships, supporting local communities, and continually seeking improvement and innovation in our practices.</p><br />

            <h2>Core Purpose/Mission Statement</h2>
            <p>Our mission is to nourish our community and the world by producing high-quality, sustainable agricultural products while preserving and enhancing the land for future generations.</p><br />

            <h2>Vision Statement (5+ years)</h2>
            <p>Our vision for the next five years is to be a leading figure in sustainable and innovative agricultural practices, with our products recognized globally for their quality and our farming techniques acknowledged as a model of eco-friendly, productive agriculture.</p><br />

            <h2>Competitive Advantages</h2>
            <p>Our competitive advantages include our commitment to sustainable practices, our prime farmland location, the superior quality of our products, our strong community ties, and our innovative approach to modern farming techniques and technology.</p><br />

            <h2>Organization-Wide Strategies</h2>
            <p>Our strategies involve adopting and promoting sustainable farming practices, investing in agricultural technology (AgTech) to improve efficiency, fostering strong relationships with local businesses and consumers, and continuous improvement in product quality.</p><br />

            <h2>Long-Term Strategic Objectives (3+ years)</h2>
            <p>Over the next three to four years, we aim to reduce our carbon footprint by 25%, increase yield by 20% through AgTech, strengthen our local market presence, and expand to international markets.</p><br />

            <h2>Short-Term Items (1 year)</h2>
            <p>In the coming year, we plan to invest in advanced irrigation systems, initiate a local farmer's market to foster community ties, enhance organic farming techniques, and launch an informative website to promote our farm and educate consumers on sustainable agriculture.</p><br />

            <h2>Key Performance Indicators (KPIs)</h2>
            <p>Our KPIs include yield per acre, carbon footprint measurement, percentage of waste recycled, number of new community initiatives launched, website traffic, and expansion into new markets.</p><br />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExamplePage;