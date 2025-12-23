import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DATA_PREFIX, SESSION_KEY, USERS_KEY } from '../constants';
import {
  DataContextType,
  FuelLog,
  Settings,
  SimType,
  StockState,
  StockLog,
  Transaction,
  TransactionType,
  User,
  UserData,
} from '../types';

const defaultSettings: Settings = {
  name: 'متجر المندوب',
  weeklyTarget: 10000,
  theme: 'light',
  preferredFuelType: '91',
  priceConfig: {
    jawwy: [20, 18, 16],
    sawa: [17, 15, 13],
    multi: [30, 27, 25],
  },
};

const emptyStock: StockState = { jawwy: 0, sawa: 0, multi: 0 };

const defaultUserData: UserData = {
  transactions: [],
  stock: { ...emptyStock },
  damaged: { ...emptyStock },
  stockLogs: [],
  fuelLogs: [],
  settings: defaultSettings,
  lastSync: undefined,
};

const defaultUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'password',
    name: 'مدير المبيعات',
    role: 'admin',
  },
];

const DataContext = createContext<DataContextType | null>(null);

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage;

const loadUsersFromStorage = (): User[] => {
  if (!canUseStorage()) return defaultUsers;
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : defaultUsers;
};

const loadSessionUser = (users: User[]): User | null => {
  if (!canUseStorage()) return null;
  const sessionUsername = localStorage.getItem(SESSION_KEY);
  return sessionUsername ? users.find((u) => u.username === sessionUsername) ?? null : null;
};

const loadUserData = (username: string): UserData => {
  if (!canUseStorage()) return defaultUserData;
  const raw = localStorage.getItem(`${DATA_PREFIX}${username}`);
  return raw ? { ...defaultUserData, ...JSON.parse(raw) } : defaultUserData;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => loadUsersFromStorage());
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUsers = loadUsersFromStorage();
    return loadSessionUser(storedUsers);
  });
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setUserData(currentUser ? loadUserData(currentUser.username) : defaultUserData);
  }, [currentUser]);

  useEffect(() => {
    if (!canUseStorage()) return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (!canUseStorage() || !currentUser) return;
    localStorage.setItem(`${DATA_PREFIX}${currentUser.username}`, JSON.stringify(userData));
  }, [userData, currentUser]);

  const updateStockQuantity = (
    base: StockState,
    type: SimType,
    quantity: number,
    delta: number,
  ): StockState => ({
    ...base,
    [type]: Math.max(0, (base[type] || 0) + delta * quantity),
  });

  const login = async (username: string, pass: string) => {
    const user = users.find((u) => u.username === username && u.password === pass);
    if (!user) return false;
    setCurrentUser(user);
    if (canUseStorage()) {
      localStorage.setItem(SESSION_KEY, username);
    }
    setUserData(loadUserData(user.username));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    if (canUseStorage()) localStorage.removeItem(SESSION_KEY);
  };

  const addUser = (user: Omit<User, 'id'>) => {
    setUsers((prev) => [...prev, { ...user, id: Date.now() }]);
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUser?.id === id) logout();
  };

  const addTransaction = (type: TransactionType, amount: number, quantity: number) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      type,
      amount,
      quantity,
    };
    setUserData((prev) => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
    }));
  };

  const removeTransaction = (id: number) => {
    setUserData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  };

  const updateStock = (type: SimType, quantity: number, action: StockLog['action']) => {
    setUserData((prev) => {
      const log: StockLog = {
        id: Date.now(),
        date: new Date().toISOString(),
        type,
        quantity,
        action,
      };

      let nextStock = { ...prev.stock };
      let nextDamaged = { ...prev.damaged };

      switch (action) {
        case 'add':
          nextStock = updateStockQuantity(prev.stock, type, quantity, 1);
          break;
        case 'return_company':
          nextStock = updateStockQuantity(prev.stock, type, quantity, -1);
          break;
        case 'to_damaged':
          nextStock = updateStockQuantity(prev.stock, type, quantity, -1);
          nextDamaged = updateStockQuantity(prev.damaged, type, quantity, 1);
          break;
        case 'recover':
          nextDamaged = updateStockQuantity(prev.damaged, type, quantity, -1);
          nextStock = updateStockQuantity(prev.stock, type, quantity, 1);
          break;
        case 'flush':
          nextDamaged = updateStockQuantity(prev.damaged, type, quantity, -1);
          break;
        default:
          break;
      }

      return {
        ...prev,
        stock: nextStock,
        damaged: nextDamaged,
        stockLogs: [log, ...prev.stockLogs],
      };
    });
  };

  const addFuelLog = (log: Omit<FuelLog, 'id'>) => {
    const newLog: FuelLog = { ...log, id: Date.now() };
    setUserData((prev) => ({
      ...prev,
      fuelLogs: [newLog, ...prev.fuelLogs],
    }));
  };

  const removeFuelLog = (id: number) => {
    setUserData((prev) => ({
      ...prev,
      fuelLogs: prev.fuelLogs.filter((f) => f.id !== id),
    }));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setUserData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const importData = (json: string) => {
    try {
      const parsed: UserData = JSON.parse(json);
      setUserData({ ...defaultUserData, ...parsed });
      return true;
    } catch (err) {
      console.error('Import failed', err);
      return false;
    }
  };

  const exportData = () => JSON.stringify(userData, null, 2);

  const saveNow = () => {
    if (!currentUser || !canUseStorage()) return;
    localStorage.setItem(`${DATA_PREFIX}${currentUser.username}`, JSON.stringify(userData));
  };

  const syncToCloud = async () => {
    if (!currentUser) return false;
    setIsSyncing(true);
    await new Promise((res) => setTimeout(res, 500));
    setIsSyncing(false);
    setUserData((prev) => ({ ...prev, lastSync: new Date().toISOString() }));
    return true;
  };

  const syncFromCloud = async () => {
    if (!currentUser) return false;
    setIsSyncing(true);
    await new Promise((res) => setTimeout(res, 500));
    setIsSyncing(false);
    return true;
  };

  const value: DataContextType = useMemo(
    () => ({
      ...userData,
      users,
      currentUser,
      login,
      logout,
      addUser,
      deleteUser,
      addTransaction,
      removeTransaction,
      updateStock,
      addFuelLog,
      removeFuelLog,
      updateSettings,
      importData,
      exportData,
      saveNow,
      isSyncing,
      syncToCloud,
      syncFromCloud,
    }),
    [userData, users, currentUser, isSyncing],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
};
