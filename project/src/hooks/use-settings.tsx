import { useState, useEffect } from 'react';
import axios from 'axios';

interface Settings {
  id: number;
  name: string;
  short_name: string;
  description: string;
  gstin: string;
  working_hours: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  youtube: string;
  instagram: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/settings/');
        if (response.data.success) {
          setSettings(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch settings');
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}