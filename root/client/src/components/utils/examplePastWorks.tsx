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
            <h1>Past Works Document for XYZ Construction Inc.</h1><br />

            <h2>About</h2>
            <p>XYZ Construction Inc. is a leading construction company specialized in commercial, residential, and infrastructure projects. With over 50 years of experience in the industry, the company is committed to delivering high-quality, safe, and sustainable building solutions.</p><br />

            <h2>Projects</h2>
            <p>XYZ Construction values the trust of its clients and stakeholders, and the quality of its past projects is a testament to its expertise and commitment.</p><br />

            <h2>Clients</h2>
            <p>The portfolio of XYZ Construction spans a diverse range of clients, from private individuals to multinational corporations, government agencies, and non-profit organizations.</p><br />

            <h3>Completed Projects</h3><br />

            <h4>Residential Development - Sunnybrook Estates</h4>
            <p>Sunnybrook Estates is a modern residential development comprising 150 luxury apartments. XYZ Construction was responsible for the full construction, including infrastructure works such as roads, utilities, and landscaping.</p><br />

            <h4>Commercial Building - Downtown Plaza</h4>
            <p>Downtown Plaza is a state-of-the-art commercial building located in the heart of the city. XYZ Construction delivered a 20-story building that houses office spaces, retail outlets, and a multi-level parking garage.</p><br />

            <h4>Infrastructure Project - Riverside Bridge</h4>
            <p>The Riverside Bridge project involved the design and construction of a three-lane bridge over the River West. This infrastructure project has greatly improved transportation in the local area, reducing travel times and congestion.</p><br />

            <h4>Renovation - Heritage Museum</h4>
            <p>XYZ Construction was entrusted with the delicate task of renovating the city's historic Heritage Museum. The project required a delicate balance of preserving the building's historic integrity while updating its facilities to modern standards.</p><br />

            <h2>Future Projects</h2>
            <p>XYZ Construction is currently working on several high-profile projects, including a high-rise residential complex, a new city hospital, and a sports stadium.</p><br />

            <h2>Contact Information</h2>
            <p>
              XYZ Construction Inc.<br />
              1234 Builder's Lane<br />
              City, State, Zip<br />
              Contact: (123) 456-7890<br />
              Email: info@xyzconstruction.com
            </p>
          </div>
        </div>
      </div>
    </>

  );
};

export default ExamplePage;
