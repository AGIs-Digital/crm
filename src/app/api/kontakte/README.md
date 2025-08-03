# Leads API Documentation

## Overview
This API provides endpoints for managing leads (contacts) and their tags in the callflows CRM system.

## Endpoints

### GET /api/kontakte
Returns all leads with optional filtering.

#### Query Parameters
- `tags` (optional): Comma-separated list of tag IDs to filter leads by. By default, returns leads with ANY of the specified tags.
- `match` (optional): If set to "all", returns leads with ALL of the specified tags.
- `excludeTags` (optional): Comma-separated list of tag IDs to exclude leads by.
- `pipeline` (optional): If set to "true", returns only leads with pipeline tags. If set to "false", returns only leads without pipeline tags.

#### Examples
- `/api/kontakte?tags=1,2,3` - Returns leads with tag ID 1, 2, OR 3
- `/api/kontakte?tags=1,2,3&match=all` - Returns leads with tag ID 1, 2, AND 3
- `/api/kontakte?excludeTags=1,2,3` - Returns leads without tag ID 1, 2, or 3
- `/api/kontakte?pipeline=true` - Returns only leads with pipeline tags
- `/api/kontakte?pipeline=false` - Returns only leads without pipeline tags

### GET /api/kontakte/tags
Returns all available tags.

### POST /api/kontakte
Creates a new lead.

#### Request Body
```json
{
  "company_name": "Firma GmbH",
  "salutation": "Herr",
  "first_name": "Max",
  "last_name": "Mustermann",
  "phone": "+49 123 456789",
  "email": "max@firma.de",
  "notes": "Wichtiger Lead",
  "tags": ["1", "3"] // Array of tag IDs
}
```

### POST /api/kontakte/tags
Creates a new tag.

#### Request Body
```json
{
  "name": "New Tag Name",
  "color": "#hexcolor"
}
```

## Integration with Make.com
The API is designed to be easily integrated with Make.com for automation workflows.

### Example Make.com Scenarios
1. **New Lead Creation**: Trigger when a new lead is created in an external system, then create a lead in callflows CRM.
2. **Lead Status Update**: Update lead tags based on external events or conditions.
3. **Lead Filtering**: Retrieve leads with specific tag combinations for targeted marketing campaigns.

### Webhook Integration
For real-time updates, you can set up webhooks in Make.com to listen for changes in the callflows CRM system.
