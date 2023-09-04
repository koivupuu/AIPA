import React, { useState, FC } from 'react';

/**
 * This component is meant to work as a template for the user to guide in creating appropriate documents for profile information. 
 */
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
    <>    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-90"></div>
      <div className="relative z-10 flex justify-center items-center space-x-1 text-white md:mx-16 mx-4 overflow-y-auto max-h-screen">
        <div>
          <div className="mb-4 text-stop">Click anywhere to close</div>
          <div className="text-lg md:text-base">
            <h1>This is an example Financials document</h1>

            <h2>Fiscal Year Summary</h2>
            <p>This document provides an overview of our company's financial performance during the last fiscal year. It includes detailed information about our revenues, expenses, and net profit.</p><br />

            <h2>Revenue</h2>
            <p>Our total revenue for the fiscal year was $5 million, a 10% increase from the previous year. The increase in revenue can be attributed to our expanded market presence and introduction of new products.</p><br />

            <h2>Expenses</h2>
            <p>Our total expenses for the fiscal year was $3 million, which included cost of goods sold, salaries, rent, utilities, and other operating expenses.</p><br />

            <h2>Net Profit</h2>
            <p>After accounting for all expenses, our net profit for the fiscal year was $2 million. This represents a net profit margin of 40%, a 5% increase from the previous year.</p><br />

            <h2>Assets</h2>
            <p>Our total assets at the end of the fiscal year was $8 million. This includes cash, accounts receivable, inventory, and property and equipment.</p><br />

            <h2>Liabilities</h2>
            <p>Our total liabilities at the end of the fiscal year was $2 million. This includes accounts payable, accrued expenses, and long-term debt.</p><br />

            <h2>Equity</h2>
            <p>Our total equity at the end of the fiscal year was $6 million. This represents the residual interest in the assets of the company after deducting liabilities.</p><br />

            <h2>Financial Outlook</h2>
            <p>Looking ahead, we expect to continue our growth trajectory and improve our profitability. We plan to launch several new products and enter new markets, which we anticipate will drive further revenue growth.</p><br />

            <h2>Key Financial Indicators</h2>
            <p>Our key financial indicators include revenue growth, net profit margin, return on assets, and return on equity. We monitor these indicators closely to ensure we are on track to meet our financial objectives.</p><br />
          </div>
        </div>
      </div>
    </div>
    </>

  );
};

export default ExamplePage;
