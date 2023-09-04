import { Request, Response, NextFunction } from 'express';
import puppeteer from 'puppeteer';
import Profile from '../models/profile';
import SubProfile from '../models/subProfile';
import CPVCode from '../models/cpvCode';
import { summarize } from './GPTAPIController';

export const createProfile = async (req: Request, res: Response) => {
  if (!req.auth) {
    return res.status(400).json({ error: 'Authentication data not found' });
  }
  const companyName = req.body.companyName;
  const auth0sub = req.auth.sub;

  try {
    // Find an existing profile by companyName
    let profile = await Profile.findOne({ auth0sub: auth0sub });

    if (!profile) {
      // If the profile does not exist, create a new one
      profile = new Profile({ auth0sub: auth0sub, companyName: companyName });
      await profile.save();
    }

    let subProfile = new SubProfile({
      subProfileName: 'default',
      profile: profile._id,
      financialDocuments: "",
      pastWorks: "",
      cpvCodes: [],
      industry: "",
      tenderSize: "",
      lowestcost: "",
      highestcost: "",
      description: "",
      exclude: [],
      dislikedLocations: [],
      languages: [],
      keywords: []
    });

    await subProfile.save();

    // add the newly created subprofile to the profile's subProfiles array
    profile.subProfiles.push(subProfile._id);
    await profile.save();

    // Return the updated or newly created profile and its associated subprofile data
    res.status(201).json({ message: "Profile and subprofile created/updated", profile, subProfile });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create/update profile and subprofile' });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  const { profileID } = req.params;

  try {
    // Find the profile by id
    const profile = await Profile.findById(profileID);

    if (!profile) {
      // If the profile does not exist, return an error
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Delete the profile
    await Profile.deleteOne({ _id: profileID });

    // Return a success message
    res.status(200).json({ message: "Profile deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
};

export const fetchProfile = async (req: Request, res: Response) => {
  if (!req.auth) {
    return res.status(400).json({ error: 'Authentication data not found' });
  }
  const auth0sub = req.auth.sub;

  try {
    const profile = await Profile.findOne({ auth0sub: auth0sub })
      .populate({
        path: 'subProfiles',
        populate: {
          path: 'searches',
          select: '-procurementCalls'  // Exclude procurementCalls field
        }
      });

    if (profile) {
      res.status(200).json(profile);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};


export const fetchSubProfile = async (req: Request, res: Response) => {
  const { subProfileId } = req.params;

  try {
    // Find the subprofile by its ID and populate the searches field excluding procurementCalls
    const subProfile = await SubProfile.findById(subProfileId)
      .populate({
        path: 'searches',
        select: '-procurementCalls'  // Exclude procurementCalls field
      });

    if (!subProfile) {
      // If the subprofile does not exist, return an error
      return res.status(404).json({ error: 'SubProfile not found' });
    }

    // Return the fetched subprofile data with populated searches
    res.status(200).json(subProfile);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch subprofile' });
  }
};


export const updateSubProfile = async (req: Request, res: Response) => {
  const { subProfileId } = req.params;
  const updateData = req.body.subProfile;

  try {
    // Find the subprofile by id
    let subProfile = await SubProfile.findByIdAndUpdate(subProfileId, updateData, { new: true });

    if (!subProfile) {
      // If the subprofile does not exist, return an error
      return res.status(404).json({ error: 'SubProfile not found' });
    }

    // Return the updated subprofile data
    console.log("\nProfile updated");
    res.status(200).json({ message: "Subprofile updated", subProfile });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update subprofile' });
  }
};

export const deleteSubProfile = async (req: Request, res: Response) => {
  const { subProfileId } = req.params;

  try {
    // Find the subprofile by id
    const subProfile = await SubProfile.findById(subProfileId);

    if (!subProfile) {
      // If the subprofile does not exist, return an error
      return res.status(404).json({ error: 'SubProfile not found' });
    }

    // Delete the subprofile
    await SubProfile.deleteOne({ _id: subProfileId });

    // Remove the subprofile from the associated profile's subProfiles array
    const profile = await Profile.findById(subProfile.profile);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    (profile.subProfiles as any).pull(subProfileId);
    await profile.save();

    // Return a success message
    res.status(200).json({ message: "Subprofile deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete subprofile' });
  }
};

export const createSubProfile = async (req: Request, res: Response) => {
  const { profileID, teamName } = req.body.teamData;

  try {
    // Find the associated profile
    const profile = await Profile.findById(profileID);

    if (!profile) {
      // If the profile does not exist, return an error
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Create the associated subprofile
    const subProfile = new SubProfile({
      profile: profileID,
      subProfileName: teamName,
      financialDocuments: "",
      pastWorks: "",
      industry: "",
      tenderSize: "",
      lowestcost: "",
      highestcost: "",
      description: "",
    });
    await subProfile.save();

    // Add the newly created subprofile to the profile's subProfiles array
    profile.subProfiles.push(subProfile._id);
    await profile.save();

    // Return the newly created subprofile data
    res.status(201).json({ message: "Subprofile created", subProfile });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create subprofile' });
  }
};

export const cpvCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params; // Assuming the parameter name is 'code'

    if (!code) {
      return res.status(400).json({ error: 'CPV code is required.' });
    }

    // Find the CPV code in the database
    const cpv = await CPVCode.findOne({ cpvcode: code });

    if (!cpv) {
      return res.status(404).json({ error: 'CPV code not found.' });
    }

    // Send the found CPV code as a response
    res.status(200).json(cpv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch CPV code.' });
  }
};

export const scrape = async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch({
      executablePath: puppeteer.executablePath(),
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url);

    const headings: { [key: string]: string[] } = {};
    headings.h1 = (await page.$$eval('h1', elements => elements.map(item => item.textContent))).filter(Boolean) as string[];
    headings.h2 = (await page.$$eval('h2', elements => elements.map(item => item.textContent))).filter(Boolean) as string[];
    headings.h3 = (await page.$$eval('h3', elements => elements.map(item => item.textContent))).filter(Boolean) as string[];

    // Fetching paragraphs, links, list items, table elements, and articles
    const paragraphs = await page.$$eval('p', elements => elements.map(item => item.textContent));
    const links = await page.$$eval('a', elements => elements.map(item => item.textContent));
    const listItems = await page.$$eval('li', elements => elements.map(item => item.textContent));
    const tableRows = await page.$$eval('tr', elements => elements.map(item => item.textContent));
    const tableData = await page.$$eval('td', elements => elements.map(item => item.textContent));
    const articles = await page.$$eval('article', elements => elements.map(item => item.textContent));

    await browser.close();

    const combinedHeadings = Object.values(headings).flat().join(', ');
    let textContent = combinedHeadings + ' ' + paragraphs.join(' ') + ' ' + links.join(' ') + ' ' + listItems.join(' ') + ' ' + tableRows.join(' ') + ' ' + tableData.join(' ') + ' ' + articles.join(' ');

    const contentPrompt = textContent.length > 16000 ? textContent.slice(0, 16000) : textContent;
    const combinedPrompt = `Generate a document summarizing this. The document should be less than 16000 characters.` + contentPrompt;

    // Call the summarize function directly
    const summaryResult = await summarize({ prompt: combinedPrompt });

    return res.json({ text: summaryResult });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while scraping and summarizing the content' });
  }
};