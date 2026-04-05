import { createContext, useContext, useState, useEffect } from 'react';
import { hrmsEmployeeAPI } from '../api';

const HRMSAuthContext = createContext();

export const HRMSAuthProvider = ({ children }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('hrms_employee_token');
    if (token) {
      hrmsEmployeeAPI.verify()
        .then(r => setEmployee(r.data.employee))
        .catch(() => {
          localStorage.removeItem('hrms_employee_token');
          localStorage.removeItem('hrms_employee');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (employeeId, password) => {
    const r = await hrmsEmployeeAPI.login({ employeeId, password });
    localStorage.setItem('hrms_employee_token', r.data.token);
    localStorage.setItem('hrms_employee', JSON.stringify(r.data.employee));
    setEmployee(r.data.employee);
    return r.data;
  };

  const logout = () => {
    localStorage.removeItem('hrms_employee_token');
    localStorage.removeItem('hrms_employee');
    setEmployee(null);
  };

  return (
    <HRMSAuthContext.Provider value={{ employee, login, logout, loading, isAuthenticated: !!employee }}>
      {children}
    </HRMSAuthContext.Provider>
  );
};

export const useHRMSAuth = () => useContext(HRMSAuthContext);
