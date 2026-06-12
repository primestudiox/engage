// Service to interact with Google Drive and Google Sheets APIs

export interface LeadData {
  id?: string;
  name: string;
  gender?: string;
  phone: string;
  country: {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
  };
  description: string;
  experience: string;
  readyToInvest?: string;
  joinMastermind: boolean;
  timestamp: string;
  synced?: boolean;
}

/**
 * Searches the user's storage for an existing spreadsheet named "Engage Community Leads".
 * If not found, creates one and sets up headings.
 * Returns the spreadsheetId.
 */
export async function getOrCreateLeadsSheet(accessToken: string): Promise<string> {
  const query = encodeURIComponent("name = 'Engage Community Leads' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false");
  
  // Search for the file in Google Drive
  const driveSearchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
  const searchResponse = await fetch(driveSearchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!searchResponse.ok) {
    throw new Error(`Failed to search Google Drive: ${searchResponse.statusText}`);
  }

  const searchData = await searchResponse.json();
  if (searchData.files && searchData.files.length > 0) {
    // Found existing spreadsheet
    return searchData.files[0].id;
  }

  // Create new spreadsheet
  const createSheetUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  const createResponse = await fetch(createSheetUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: 'Engage Community Leads',
      },
    }),
  });

  if (!createResponse.ok) {
    throw new Error(`Failed to create Google Sheet: ${createResponse.statusText}`);
  }

  const createdSheet = await createResponse.json();
  const spreadsheetId = createdSheet.spreadsheetId;

  // Set up the header columns
  const firstSheetName = createdSheet.sheets?.[0]?.properties?.title || 'Sheet1';
  const range = `${firstSheetName}!A1:J1`;
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;
  
  const headers = [
    [
      'Subscription Timestamp',
      'Name',
      'Gender',
      'Country',
      'Country Code',
      'Phone Number',
      'Profile and situation',
      'Biggest obstacle',
      'Ready to invest',
      'Wants to join Hackathons/Masterminds'
    ]
  ];

  const headerResponse = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: headers,
    }),
  });

  if (!headerResponse.ok) {
    console.warn('Failed to append headers to the new spreadsheet:', headerResponse.statusText);
  }

  return spreadsheetId;
}

/**
 * Appends row(s) of leads data to the specified Google Sheet.
 */
export async function appendLeadsToSheet(
  spreadsheetId: string,
  accessToken: string,
  leads: LeadData[]
): Promise<void> {
  if (leads.length === 0) return;

  // Let's get the sheet structure first to get the correct current tab name
  const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const metaResponse = await fetch(metaUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  let sheetName = 'Sheet1';
  if (metaResponse.ok) {
    const metaData = await metaResponse.json();
    sheetName = metaData.sheets?.[0]?.properties?.title || 'Sheet1';
  }

  const range = `${sheetName}!A:J`;
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

  const rows = leads.map((lead) => [
    lead.timestamp,
    lead.name,
    lead.gender || '',
    lead.country.name,
    lead.country.dialCode,
    lead.phone,
    lead.description,
    lead.experience,
    lead.readyToInvest || '',
    lead.joinMastermind ? 'Yes' : 'No',
  ]);

  const response = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: rows,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to append rows to Google Sheet: ${response.statusText}`);
  }
}
