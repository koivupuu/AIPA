/**
 * 
 * Footer
 * 
 * This component is a stand alone component the displays any relevant information the user might need. 
 * 
 */
import React from 'react';
import CPVChecker from './utils/CPVChecker';

const footerContent = {
  companyName: "Company Name",
  copyright: "© 2023, All rights reserved.",
  quickLinks: [
    { name: "Give Feedback", link: "https://flinga.fi/s/FB6Y97A" }
  ],
  contact: {
    emails: ["tealjapa@jyu.fi", "errasane@jyu.fi", "koivismj@jyu.fi"],
    phone: "+358 (044) 970-9225",
    address: "Mattilanniemi 2, 40100 Jyväskylä, Agora, Finland"
  }
}

const Footer = () => {
  return (
    <footer className="bg-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="font-bold text-gray-700 mb-2">{footerContent.companyName}</h3>
            <p className="text-gray-600">{footerContent.copyright}</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-2">Quick Links</h3>
            <ul className="text-gray-600">
              {footerContent.quickLinks.map(link => (
                <li key={link.name}>
                  <a href={link.link} target="_blank" rel="noopener noreferrer">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-2">Contact Us</h3>
            <address className="text-gray-600">
              <p>Email: {footerContent.contact.emails.join(", ")}</p>
              <p>Phone: {footerContent.contact.phone}</p>
              <p>{footerContent.contact.address}</p>
            </address>
          </div>
        </div>
        <CPVChecker />
      </div>
    </footer>
  );
};

export default Footer;
