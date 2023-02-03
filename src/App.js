import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SoftballPageLayoutNav from './pages/SoftballPageLayoutNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const AppNotify = (string) => toast(string);
  return (
    <div>
      <Helmet>
        <title>EHT Youth Softball</title>
      </Helmet>
      <SoftballPageLayoutNav>
        <Outlet />
        <ToastContainer />
      </SoftballPageLayoutNav>
    </div>
  );
}

