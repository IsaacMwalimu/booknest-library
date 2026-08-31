import React, { useState } from 'react';

import { Layout } from '../components';
import IssueLoan from '../features/loans/IssueLoan';
import ReturnLoan from '../features/loans/ReturnLoan';
import ActiveLoans from '../features/loans/ActiveLoans';
import OverdueLoans from '../features/loans/OverdueLoans';
import LoanHistory from '../features/loans/LoanHistory';

const TABS = [
  { id: 'active', label: 'Active Loans', component: ActiveLoans },
  { id: 'issue', label: 'Issue Book', component: IssueLoan },
  { id: 'return', label: 'Return Book', component: ReturnLoan },
  { id: 'overdue', label: 'Overdue Loans', component: OverdueLoans },
  { id: 'history', label: 'Loan History', component: LoanHistory },
];

export default function BorrowReturn() {
  const [activeTab, setActiveTab] = useState('active');

  const ActiveComponent = TABS.find((t) => t.id === activeTab).component;

  return (
    <Layout currentPage="Borrow & Return">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <ActiveComponent />
      </div>
    </Layout>
  );
}
