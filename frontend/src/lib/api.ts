const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// =========================
// Hosted Zone Types
// =========================

export interface HostedZone {
  id: number;
  name: string;
  type: string;
  description: string | null;
}

export interface HostedZoneCreate {
  name: string;
  type: string;
  description?: string;
}

export interface HostedZoneUpdate {
  name: string;
  type: string;
  description?: string;
}

// =========================
// DNS Record Types
// =========================

export interface DNSRecord {
  id: number;
  hosted_zone_id: number;
  name: string;
  type: string;
  value: string;
  ttl: number;
}

export interface DNSRecordCreate {
  hosted_zone_id: number;
  name: string;
  type: string;
  value: string;
  ttl?: number;
}

export interface DNSRecordUpdate {
  name: string;
  type: string;
  value: string;
  ttl?: number;
}

// =========================
// Common Response Handler
// =========================

async function handleResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || "Something went wrong with the request."
    );
  }

  return response.json();
}

// =========================
// Hosted Zone API
// =========================

export async function getHostedZones(): Promise<HostedZone[]> {
  const response = await fetch(
    `${API_BASE_URL}/hosted-zones`
  );

  return handleResponse<HostedZone[]>(response);
}

export async function getHostedZone(
  zoneId: number
): Promise<HostedZone> {
  const response = await fetch(
    `${API_BASE_URL}/hosted-zones/${zoneId}`
  );

  return handleResponse<HostedZone>(response);
}

export async function createHostedZone(
  zoneData: HostedZoneCreate
): Promise<HostedZone> {
  const response = await fetch(
    `${API_BASE_URL}/hosted-zones`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zoneData),
    }
  );

  return handleResponse<HostedZone>(response);
}

export async function updateHostedZone(
  zoneId: number,
  zoneData: HostedZoneUpdate
): Promise<HostedZone> {
  const response = await fetch(
    `${API_BASE_URL}/hosted-zones/${zoneId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zoneData),
    }
  );

  return handleResponse<HostedZone>(response);
}

export async function deleteHostedZone(
  zoneId: number
): Promise<{ message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/hosted-zones/${zoneId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse<{ message: string }>(response);
}

// =========================
// DNS Record API
// =========================

export async function getDNSRecords(
  hostedZoneId: number
): Promise<DNSRecord[]> {
  const response = await fetch(
    `${API_BASE_URL}/dns-records/zone/${hostedZoneId}`
  );

  return handleResponse<DNSRecord[]>(response);
}

export async function getDNSRecord(
  recordId: number
): Promise<DNSRecord> {
  const response = await fetch(
    `${API_BASE_URL}/dns-records/${recordId}`
  );

  return handleResponse<DNSRecord>(response);
}

export async function createDNSRecord(
  recordData: DNSRecordCreate
): Promise<DNSRecord> {
  const response = await fetch(
    `${API_BASE_URL}/dns-records`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recordData),
    }
  );

  return handleResponse<DNSRecord>(response);
}

export async function updateDNSRecord(
  recordId: number,
  recordData: DNSRecordUpdate
): Promise<DNSRecord> {
  const response = await fetch(
    `${API_BASE_URL}/dns-records/${recordId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recordData),
    }
  );

  return handleResponse<DNSRecord>(response);
}

export async function deleteDNSRecord(
  recordId: number
): Promise<{ message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/dns-records/${recordId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse<{ message: string }>(response);
}
