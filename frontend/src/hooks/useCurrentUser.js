import { useCallback, useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import { getStoredUser, getToken, setStoredUser } from '../services/session';

export default function useCurrentUser() {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(Boolean(getToken()));

  const refreshUser = useCallback(async () => {
    if (!getToken()) {
      setLoading(false);
      setUser(null);
      return null;
    }

    try {
      setLoading(true);
      const { data } = await authAPI.getMe();
      if (data.success) {
        setUser(data.data);
        setStoredUser(data.data);
        return data.data;
      }
      return null;
    } catch {
      const fallbackUser = getStoredUser();
      setUser(fallbackUser);
      return fallbackUser;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser);
    setStoredUser(nextUser);
  }, []);

  return { user, loading, refreshUser, updateUser };
}
