import { Client } from '@hubspot/api-client';
import { AssociationSpecAssociationCategoryEnum } from '@hubspot/api-client/lib/codegen/crm/associations/v4';
import { NextRequest, NextResponse } from 'next/server';

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, role, company, phone, message } = await request.json();

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    let formattedPhone = '';
    if (phone) {
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        return NextResponse.json(
          { error: 'Phone number must be exactly 10 digits' },
          { status: 400 }
        );
      }
      formattedPhone = `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`;
    }

    const contactObj = {
      properties: {
        email,
        firstname: firstName,
        lastname: lastName,
        ...(role && { jobtitle: role }),
        ...(formattedPhone && { phone: formattedPhone }),
        ...(message && { message }),
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
      },
    };

    const domain = email.split('@')[1];

    const companyObj = {
      properties: {
        domain: domain,
        ...(company && { name: company }),
      },
    };

    const createCompanyResponse  = await hubspotClient.crm.companies.basicApi.create(companyObj);
    const createContactResponse  = await hubspotClient.crm.contacts.basicApi.create(contactObj);

    await hubspotClient.crm.associations.v4.basicApi.create(
        'companies',
        createCompanyResponse.id,
        'contacts',
        createContactResponse.id,
        [
            {
                "associationCategory": AssociationSpecAssociationCategoryEnum.HubspotDefined,
                "associationTypeId": 2
            }
        ]
    )
    return NextResponse.json(
        { message: 'Contact created successfully' },
        { status: 200 }
      );
  } catch (error: any) {
    console.error('HubSpot API Error:', error);
    
    if (error.code === 409) {
      return NextResponse.json(
        { message: 'Contact already exists - updated successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}
